# Agente: base de datos (PostgreSQL + Prisma)

- Esquema en `apps/api/prisma/schema.prisma`. Migraciones con `prisma migrate`, nunca SQL manual en producción.
- Montos: `Decimal(12,2)` en USD. Toda operación guarda la cotización y el costo usados (historial inmutable).
- Ids `uuid`; `createdAt` y `updatedAt` en todas las tablas.
- Los datos del proveedor se guardan **por importación** (snapshot), no se pisan.
- Índices para: nombre normalizado del producto del proveedor, estado de pedidos y cliente.
- Skills: `db-migration`, `concurrency-safe-orders`.
