# Skill: pedidos seguros ante concurrencia y cambios de precio

- **Idempotencia:** el checkout envía una `idempotencyKey` (uuid generado en el cliente); un reintento o doble clic devuelve el mismo pedido.
- **Validación de precio:** el cliente envía el precio que vio. Si no coincide con el vigente → `409 PRICE_CHANGED`
  con los precios nuevos; el cliente confirma de nuevo. Nunca se cobra un precio que el cliente no vio.
- **Validación de oferta:** producto activo, publicado, no rojo y con importación vigente (no vencida).
- **Transiciones de estado:** `UPDATE ... WHERE id = ? AND status = ?` (bloqueo optimista). Si no afecta
  filas → `409 ORDER_INVALID_TRANSITION`. Así dos administradores no confirman dos veces.
- Todo dentro de `prisma.$transaction`. Los efectos externos (email) van por outbox, después del commit.
- Stock propio (fase posterior): reserva con `SELECT ... FOR UPDATE` sobre la fila de stock.
