# Índice de módulos → archivos a cargar

_Se completa a medida que se crea el código. Formato: módulo, entrada principal, archivos clave, notas._

| Módulo | Cargar primero | Después | Notas |
|---|---|---|---|
| supplier | `packages/shared/src/supplier/*.schema.ts`, `apps/api/src/supplier/*.spec.ts` | `supplier/csv-parser.ts`, `supplier/import.service.ts` | (pendiente de crear) |
| pricing | `packages/shared/src/pricing/*`, `apps/api/src/pricing/*.spec.ts` | `pricing/price-calculator.ts` | (pendiente de crear) |
| orders | `packages/shared/src/orders/*`, `apps/api/src/orders/*.spec.ts` | `orders/orders.service.ts`, `orders/order-state.ts` | (pendiente de crear) |
| catalog | `apps/api/src/catalog/*` | `apps/web/app/comprar/*` | (pendiente de crear) |
| auth | `apps/web/auth.ts`, `apps/api/src/auth/*` | guards de rol | (pendiente de crear) |
| esquema DB | `apps/api/prisma/schema.prisma` (leer solo los modelos del módulo) | | (pendiente de crear) |
