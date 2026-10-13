# Skill: notificaciones (email + WhatsApp)

- Patrón **outbox**: el evento se inserta en `notification_outbox` dentro de la misma transacción del pedido.
  Un worker (pg-boss) lo envía después, con reintentos y backoff (máximo 5); los fallos quedan visibles en el panel.
- Canales detrás de la interfaz `Notifier`:
  - `EmailNotifier`: SMTP o Resend.
  - `WhatsAppNotifier`: **API oficial de WhatsApp Business (Meta Cloud API)** con plantillas aprobadas.
    Prohibidas las librerías no oficiales (whatsapp-web.js, etc.): WhatsApp bloquea esos números.
- Eventos y destinatarios: `docs/analisis-funcional-mvp.md` §8.
- El aviso al admin incluye el **nombre exacto según el proveedor** y el enlace al pedido en el panel.
- Los teléfonos se guardan en formato E.164 (`+549...`); el cliente puede desactivar WhatsApp en su perfil.
- Las alertas del conector (`BLOCKED`, `SCHEMA_CHANGED`, `AUTH_FAILED`) son urgentes: WhatsApp + email al admin.
