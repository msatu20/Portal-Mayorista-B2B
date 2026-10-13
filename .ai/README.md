# Marco de trabajo para agentes de IA

Esta carpeta le da a cualquier IA (y a cualquier persona) el contexto mínimo necesario para
trabajar en el repositorio sin releer todo el código en cada sesión.

## Estructura

| Carpeta | Para qué sirve |
|---|---|
| `agents/` | Roles especializados. Empezar siempre por `orchestrator.md`. |
| `skills/` | Procedimientos reutilizables (paso a paso) que los agentes invocan. |
| `context/` | Resúmenes cortos y vigentes del proyecto. Es la "memoria" principal. |
| `chunks/` | Cómo dividir el repo por módulo y cuántos tokens gastar por tipo de tarea. |
| `decisions/` | ADRs: decisiones de arquitectura con su porqué. No se borran; se reemplazan. |
| `change-log/` | Registro obligatorio de cada cambio, un archivo por mes. |
| `tasks/` | Backlog del producto y mejoras pendientes del propio marco. |
| `templates/` | Plantillas para crear agentes, skills, ADRs, tareas y entradas de change-log. |

## Flujo en 30 segundos

1. Leer `agents/orchestrator.md`.
2. Leer `context/Trabajo-Activo.md` → saber qué se está haciendo.
3. Leer `context/Modulo-Map.md` → ubicar el módulo.
4. Elegir agente + skills. Cargar solo lo necesario.
5. Inspeccionar el código real antes de modificar.
6. Cambiar, probar, registrar en `change-log/`, actualizar `context/`.

## Reglas de oro

- El código manda: si un archivo de contexto contradice el código, se corrige el contexto.
- Nada de secretos en el repo (base de datos, SMTP, etc. van en `.env`).
- Las listas reales del proveedor no se versionan (`data/` y `*.csv` están en `.gitignore`).
- Cada archivo de `context/` debe tener menos de ~150 líneas. Si crece, aplicar `skills/context-compression.md`.
- Si el marco tiene fricción o huecos, anotarlo en `tasks/ai-framework-improvements.md`.

## Para personas

- ¿Querés saber en qué estado está el proyecto? → `context/Trabajo-Activo.md`.
- ¿Por qué se decidió algo? → `decisions/`.
- ¿Qué cambió y cuándo? → `change-log/`.
