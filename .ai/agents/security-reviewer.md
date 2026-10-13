# Agente: revisión de seguridad

- Secretos solo en variables de entorno; `.env.example` documenta los nombres, sin valores.
- Las credenciales del portal del proveedor **no se guardan en el sistema** (ADR-0003).
- Contraseñas con argon2 o bcrypt; rate limit en el login; sesiones con expiración.
- Rol verificado en el servidor en cada endpoint; un cliente solo ve sus propios pedidos.
- Subida de CSV: solo admin, límite de tamaño, parseo como texto (sin evaluar fórmulas; ojo con CSV injection al reexportar).
- Cabeceras: CSP, HSTS, X-Frame-Options, nosniff. `noindex` en todo el portal.
- Ningún dato de cliente en URLs ni en logs.
