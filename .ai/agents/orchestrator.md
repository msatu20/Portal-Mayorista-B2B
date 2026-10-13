# Agente orquestador

Rol: coordinar cualquier tarea en este repositorio. Toda sesión de IA empieza acá.

## Flujo obligatorio

1. **Orientarse (≈2k tokens):** leer `context/Trabajo-Activo.md` y `context/Modulo-Map.md`.
   Si la tarea toca reglas de negocio, sumar `context/Proyecto-Vision-General.md`.
2. **Clasificar la tarea** y elegir agente:

   | Tarea | Agente |
   |---|---|
   | Requisito nuevo, duda de negocio, caso borde | `functional-analyst` |
   | Endpoint, servicio, módulo NestJS | `backend-api` |
   | Página, componente, UX móvil | `frontend-web` |
   | Esquema, migración, consulta, índices | `database` |
   | CSV del proveedor, disponibilidad | `supplier-integration` |
   | Reglas de precio, pedidos, estados | `pricing-orders` |
   | Pruebas, casos críticos | `qa-testing` |
   | Auth, roles, secretos, datos de clientes | `security-reviewer` |

   Una tarea grande se divide en subtareas, cada una con su agente.
3. **Inspeccionar antes de cambiar:** buscar (grep/glob) lo existente. Prohibido duplicar
   utilidades, tipos o esquemas Zod que ya existan en `packages/shared`.
4. **Planificar** si el cambio toca más de 3 archivos o una regla de negocio.
   Si contradice un ADR vigente, frenar y consultar al usuario.
5. **Implementar** siguiendo `context/Codificacion-Convenciones.md`.
6. **Verificar:** tipos, lint y pruebas del módulo (`skills/testing.md`). Informar los fallos tal cual.
7. **Registrar:** entrada en `change-log/AAAA-MM.md` (`skills/change-log-entry.md`).
8. **Actualizar contexto:** `Trabajo-Activo.md` siempre; `Modulo-Map.md` si cambió la estructura;
   `Decisiones-Actuales.md` + ADR si se decidió algo; `Riesgos-Conocidos.md` si apareció un riesgo.

## Eficiencia de tokens

- No leer archivos completos si alcanza con un fragmento; usar `chunks/module-index.md`.
- No pegar en el chat contenido largo que ya está en un archivo: referenciarlo.
- Resumir hallazgos en `context/` para que la próxima sesión no repita la exploración.
- Presupuestos por tipo de tarea: `chunks/README.md`.

## Trabajo seguro con producción

- Nunca ejecutar migraciones destructivas, borrados masivos ni deploys sin confirmación explícita.
- Nunca leer ni imprimir archivos `.env` reales; usar `.env.example`.
- Nunca automatizar el ingreso al portal del proveedor (ver ADR-0003).
- Ante la duda entre dos interpretaciones de negocio: preguntar, no adivinar.
