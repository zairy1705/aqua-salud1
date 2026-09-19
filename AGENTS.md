# REGLAS PERMANENTES DE DESARROLLO — AQUA-SALUD

Cualquier modificación o evolución futura de la plataforma AQUA-SALUD debe cumplir de forma estricta las siguientes directrices permanentes:

## 1. Reglas Fundamentales de Integridad y Operación
1. **NO eliminar funcionalidades existentes** sin autorización explícita del usuario.
2. **NO modificar una función funcional** si no es estrictamente necesario para la solicitud requerida.
3. **NO borrar datos** reales ni históricos persistidos.
4. **NO inventar datos** ni alterar registros arbitrariamente.
5. **NO inventar resultados** analíticos ni eludir los cálculos matemáticos/estequiométricos reales.
6. **NO inventar normativa** sanitaria ni técnica (respetar siempre el D.S. N.° 031-2010-SA, EPA, SMEWW y guías oficiales de SUNASS / MVCS / DIGESA).
7. **NO colocar secretos, credenciales ni claves de API en el frontend** (mantener la arquitectura segura del backend y variables en `.env`).
8. **NO crear funcionalidades ficticias** o simuladas que confundan la operación real del sistema.
9. **Reutilizar componentes existentes** del ecosistema modular antes de generar duplicaciones.
10. **Mantener compatibilidad retroactiva total** con los módulos existentes (`AQUA-JASS`, `AQUA-LAB`, `AQUA-METALS`, `AQUA-ALERT`, `AQUA-RISK`, `AQUA-TERRITORIO`, `AQUA-DATA`, `AQUA-CRM`, `AQUA-IA`, `PLANES DE ACCIÓN`).
11. **Verificar responsive** tras cada modificación (diseñado para móviles de campo, tablets y estaciones de escritorio).
12. **Verificar navegación** tras cada modificación (mantener consistencia en el Navbar inferior, cabecera y enlaces entre módulos).
13. **Verificar almacenamiento** tras cada modificación (persistencia local y sincronización de base de datos sin corrupción de esquemas).
14. **Verificar permisos y control de acceso (RBAC)** tras cada modificación para proteger las diferentes perspectivas de usuario.
15. **Realizar pruebas (linter y compilación estricta)** antes de considerar terminada cualquier modificación.

---

## 2. Análisis de Dependencias Previas a Cambios Críticos

Cuando una nueva función pueda comprometer o modificar una función existente, se debe analizar la dependencia y buscar una implementación armónica y compatible.

Antes de intervenir cualquier función o componente crítico, se debe identificar y evaluar el siguiente flujo:

```
FUNCIÓN ACTUAL
   ↓
DEPENDENCIAS
   ↓
CAMBIO PROPUESTO
   ↓
RIESGOS
   ↓
PRUEBAS NECESARIAS
   ↓
IMPLEMENTACIÓN
```

---

## 3. Jerarquía Permanente de Prioridades

Toda decisión arquitectónica, de interfaz o de lógica operativa debe regirse por este orden estricto:

$$\textbf{ESTABILIDAD} \longrightarrow \textbf{SEGURIDAD} \longrightarrow \textbf{EXACTITUD} \longrightarrow \textbf{USABILIDAD} \longrightarrow \textbf{ESCALABILIDAD}$$

---

## 4. Perspectivas de Usuario Protegidas

* **Módulo JASS:** El más sencillo, rápido, directo y táctil de utilizar desde un teléfono móvil en campo rural.
* **Módulo Laboratorio:** Técnico, riguroso, formal y con cadena de custodia analítica certificable.
* **Dashboard de Autoridades / Alertas:** Visual, priorizado por matriz de riesgo epidemiológico y con respuesta oportuna mediante planes de acción.
* **Municipalidad (ATM / Alcaldía):** Visión territorial integral, cartográfica y con reportes ejecutivos consolidados.
* **Módulo CRM:** Práctico, ágil y enfocado en la atención técnica y comercial.
