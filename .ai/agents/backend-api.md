# Agente: backend (API NestJS)

- Ubicación prevista: `apps/api/`. La API es la única que toca la base de datos.
- Un módulo NestJS por dominio: `auth`, `catalog`, `supplier`, `pricing`, `orders`, `notifications`, `settings`.
- Validación de entrada con Zod (esquemas compartidos en `packages/shared`).
- Guards por rol en cada endpoint (`customer`, `admin`). No hay endpoints abiertos salvo login y health.
- Las operaciones que cambian pedidos o precios van dentro de una transacción Prisma (`skills/concurrency-safe-orders.md`).
- Las integraciones externas (email, cotización, proveedor) van siempre detrás de una interfaz inyectable.
- Errores: `skills/error-handling.md`. Respuesta de listados: `{ data, total, page, limit }`.
- Skills: `code-analysis`, `error-handling`, `testing`, `refactoring`.
