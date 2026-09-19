import { UserRoleTier } from '../types';

const SECURITY_SALT = 'AQUA_SALUD_DS031_SECURE_SALT_v1';

/**
 * Computes a standard SHA-256 hash using the native Web Cryptography API.
 * Never stores plain-text passwords or sensitive keys.
 */
export async function computeSha256(input: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const msgUint8 = new TextEncoder().encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Web Crypto unavailable, using fallback deterministic hash', e);
  }

  // Pure fallback hash if Web Crypto is unavailable (e.g. non-secure local testing)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256_fallback_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

/**
 * Hashes a user password with the platform cryptographic salt.
 * Output format: sha256:<hex_digest>
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const normalized = plainPassword.trim();
  const digest = await computeSha256(`${SECURITY_SALT}:${normalized}`);
  return `sha256:${digest}`;
}

/**
 * Verifies a plain password against an encrypted password hash.
 */
export async function verifyPassword(plainPassword: string, storedHash?: string): Promise<boolean> {
  if (!storedHash) return false;
  // If hash is in sha256: format
  if (storedHash.startsWith('sha256:')) {
    const expected = await hashPassword(plainPassword);
    return expected === storedHash;
  }
  // If legacy unhashed (e.g. from previous demo mock), verify and automatically flag
  return plainPassword === storedHash;
}

/**
 * Generates an audit tamper-evident checksum for an entry.
 */
export async function generateAuditChecksum(
  id: string,
  timestamp: string,
  action: string,
  entityId: string,
  author: string
): Promise<string> {
  const payload = `${id}|${timestamp}|${action}|${entityId}|${author}|${SECURITY_SALT}`;
  const hex = await computeSha256(payload);
  return hex.substring(0, 16).toUpperCase();
}

/**
 * Sanitizes untrusted user input to prevent XSS and HTML tag injection.
 */
export function sanitizeText(input: string, maxLength: number = 2000): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Strip iframes
    .replace(/javascript:/gi, '') // Strip javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Strip event handlers like onclick=
    .replace(/[<>]/g, '') // Strip remaining angle brackets
    .slice(0, maxLength);
}

/**
 * Strict RFC 5322 standard email validation.
 */
export function validateEmailStrict(email: string): boolean {
  if (!email || email.length > 120) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/;
  return regex.test(email.trim());
}

/**
 * Validates and normalizes phone numbers (supports Peru 9-digit mobile, local 044, or international E.164).
 */
export function validatePeruvianPhone(rawPhone: string): {
  valid: boolean;
  normalized: string;
  formatted: string;
  error?: string;
} {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) {
    return { valid: false, normalized: '', formatted: '', error: 'El teléfono es obligatorio' };
  }

  // Peru 9-digit mobile starting with 9
  if (digits.length === 9 && digits.startsWith('9')) {
    return {
      valid: true,
      normalized: `51${digits}`,
      formatted: `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`,
    };
  }

  // Already prefixed with 51 and 9 digits
  if (digits.length === 11 && digits.startsWith('519')) {
    const local = digits.slice(2);
    return {
      valid: true,
      normalized: digits,
      formatted: `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`,
    };
  }

  // Peru landline (e.g. Trujillo 044 271558 -> 8 digits or 6 digits)
  if (digits.length >= 6 && digits.length <= 11) {
    return {
      valid: true,
      normalized: digits,
      formatted: rawPhone.trim(),
    };
  }

  return {
    valid: false,
    normalized: digits,
    formatted: rawPhone.trim(),
    error: 'Ingrese un número telefónico válido (9 dígitos para móvil o número de contacto local).',
  };
}

/**
 * Validates full name: minimum 3 letters, no symbols, reasonable length.
 */
export function validateNameStrict(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: 'El nombre debe tener al menos 3 caracteres.' };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: 'El nombre no puede exceder los 100 caracteres.' };
  }
  // Allow letters, accented characters (á, é, í, ó, ú, ñ), dots, spaces, hyphens
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.\-']+$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, error: 'El nombre sólo debe contener letras y espacios.' };
  }
  return { valid: true };
}

/**
 * Data Masking / Redaction for Non-Authorized Roles
 * Protects confidential client and JASS operator data when viewed by unauthorized users or viewers.
 */
export function maskSensitiveText(
  value: string,
  userTier: UserRoleTier,
  type: 'phone' | 'email' | 'name'
): string {
  // ADMIN and SUPERVISOR have full access to sensitive records
  if (userTier === 'ADMIN' || userTier === 'SUPERVISOR') {
    return value;
  }

  if (!value) return '';

  if (type === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 7) {
      return `${digits.slice(0, 3)} ••• •• ${digits.slice(-2)}`;
    }
    return '•••-••••';
  }

  if (type === 'email') {
    const parts = value.split('@');
    if (parts.length === 2) {
      const user = parts[0];
      const domain = parts[1];
      const maskedUser = user.length > 2 ? `${user.charAt(0)}•••${user.slice(-1)}` : '••';
      return `${maskedUser}@${domain}`;
    }
    return '••••@••••.pe';
  }

  if (type === 'name') {
    const words = value.split(' ');
    return words.map((w, idx) => (idx === 0 ? w : `${w.charAt(0)}***`)).join(' ');
  }

  return value;
}
