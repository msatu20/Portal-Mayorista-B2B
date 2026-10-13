# Skill: notificaciones (aviso de compra)

- Patrón **outbox**: al crear o cambiar un pedido se inserta una fila en `notification_outbox` dentro de la misma transacción.
  Un worker la envía después y reintenta con backoff (máximo 5 intentos); los fallos quedan visibles en el panel.
- Canales detrás de la interfaz `Notifier`: `EmailNotifier` (MVP, SMTP o Resend); después Telegram o WhatsApp.
- Eventos del MVP: `ORDER_PLACED` → administrador; `ORDER_CONFIRMED` y `ORDER_REJECTED` → cliente.
- El email al administrador incluye el **nombre exacto del producto según el proveedor**, para buscarlo
  rápido en su portal, y el enlace directo al pedido en el panel.
- Plantillas en español, sin datos sensibles innecesarios.
