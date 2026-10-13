# Backlog del producto

## MVP (etapas 0 a 4) — ver `docs/analisis-funcional-mvp.md` §12
- [ ] E0 Spike del conector: login, endpoint de stock, ¿cantidad real?, descarga de la lista, captcha o 2FA
- [ ] E1 Base: monorepo, Postgres, Prisma, Auth.js con roles, registro con aprobación, panel mínimo
- [ ] E2 Proveedor: importación de la lista, diferencias, publicación, precios (global/marca/categoría/producto), cotización en 3 modos
- [ ] E3 Venta: catálogo (🔴 oculto), carrito, checkout con validación de precio, email + WhatsApp
- [ ] E4 Verificación y operación: conector en segundo plano, autoconfirmación, parciales, revisión manual, retiro, auditoría

## Después del MVP (sin orden definido)
- Stock propio y abastecimiento mixto (propio + proveedor) con reservas
- Reserva o compra automática en el proveedor al confirmar (certeza total; requiere un ADR y la aprobación del admin)
- Franjas de retiro con cupo y hora de corte
- Cuenta corriente: pagos, notas de débito y crédito, libro mayor
- Descuentos por cantidad y cupones
- Garantías y reclamos
- Exportación de la lista para WhatsApp
- PWA instalable y notificaciones push
- Integración por API con el proveedor (si la ofrece)
