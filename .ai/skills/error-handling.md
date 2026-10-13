# Skill: manejo de errores

- Errores de negocio con código estable y mensaje en español, por ejemplo:
  `PRICE_CHANGED`, `PRODUCT_UNAVAILABLE`, `CSV_INVALID_HEADER`, `ORDER_INVALID_TRANSITION`.
  Formato: `{ error: { code, message, details? } }`.
- 4xx = error del usuario (explicable); 5xx = error nuestro (log con id de correlación, mensaje genérico).
- Integraciones externas (email, cotización): timeout, reintentos con backoff y fallback definido.
  Si la cotización no responde, se usa la última conocida y se muestra su antigüedad.
- Las notificaciones usan una tabla outbox: el pedido se guarda primero y el email se envía después, con reintentos.
- Nunca tragar excepciones en silencio; nunca loguear datos personales ni secretos.
