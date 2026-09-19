import {
  AquaIAContextData,
  AquaIAParsedResponse,
  parseAquaIAResponse,
  generateDeterministicAquaIAResponse,
} from '../data/aquaIaEngine';

export interface AquaIAMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  parsed?: AquaIAParsedResponse;
  source?: 'gemini-3.8-flash' | 'deterministic-engine';
}

export async function queryAquaIA(
  prompt: string,
  context: AquaIAContextData
): Promise<{ text: string; source: 'gemini-3.8-flash' | 'deterministic-engine' }> {
  try {
    const response = await fetch('/api/aqua-ia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        context,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return {
          text: data.text,
          source: data.source || 'gemini-3.8-flash',
        };
      }
    }
  } catch (err) {
    console.warn('Could not reach /api/aqua-ia, falling back to local deterministic analysis:', err);
  }

  // Fallback to deterministic engine
  const fallbackText = generateDeterministicAquaIAResponse(prompt, context);
  return {
    text: fallbackText,
    source: 'deterministic-engine',
  };
}

export { parseAquaIAResponse };
