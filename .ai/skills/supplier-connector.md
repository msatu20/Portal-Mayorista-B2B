# Skill: conector con el portal del proveedor

**Cuándo usarla:** al crear, modificar o depurar la consulta automática de stock (ADR-0005).

## API relevada en E0 (detalle en `docs/e0-resultados-conector.md`)

- Ingreso: `GET {portal}/api/auth/csrf` → `POST {portal}/api/auth/callback/credentials` (form: `username`, `password`,
  `csrfToken`, `json=true`) → `GET {portal}/api/auth/session` → `user.accessToken` (JWT, 7 días).
- Precheck de 2FA: `POST {portal}/api/2fa/precheck`. Si alguna vez responde `needsCode: true` → `BLOCKED` (no se automatiza el 2FA).
- Stock: `GET {api}/user/products?page=&limit=50` con `Authorization: Bearer`. Campos: `productReference.id`, `name`,
  `colorStock` (unidades por color), `productReference.priceUsd`.
- Lista: `GET {api}/user/price-list/products?filter=0` (`name`, `category`, `stockEmoji`, `priceUsd`, `priceArs`) + `cotizacion`.
- Los dominios van solo en `.env`; no se escriben en el código ni en la documentación.

## Procedimiento

1. Credenciales desde `SUPPLIER_PORTAL_URL`, `SUPPLIER_API_URL`, `SUPPLIER_USER` y `SUPPLIER_PASSWORD`
   (variables de entorno). Validarlas al arrancar; si faltan → conector desactivado.
2. Sesión: login → guardar el token o la cookie en memoria con su vencimiento → reutilizarla. Si responde
   401, se hace un solo reintento de login; si vuelve a fallar → `AUTH_FAILED` y se alerta.
3. Consulta por producto (buscar por nombre del proveedor) → comparar con el `nameKey`:
   - exactamente 1 coincidencia → devolver color (y cantidad, si la API la expone);
   - 0 o más de 1 → `REVIEW`.
4. Limitar a 1 solicitud por segundo, con timeout de 10 s por solicitud y un máximo de 2 reintentos con backoff.
5. Validar la forma de la respuesta con un esquema Zod. Si no coincide → `SCHEMA_CHANGED`, el conector se
   desactiva solo y se alerta (el sitio cambió).
6. Captcha, 403 o 429 → `BLOCKED`: el conector se desactiva solo y se alerta. **No se intenta evadirlo.**
7. Guardar cada consulta en `availability_checks` (sin tokens ni datos sensibles).

## Pruebas

- Con un servidor simulado (fixtures JSON inventados): OK, 401, 429, timeout, esquema cambiado,
  0 y 2 coincidencias. **Ninguna prueba automática toca el sitio real del proveedor.**

## Nunca

- Loguear la clave, el token o las cookies.
- Confirmar un pedido si el resultado no es un positivo explícito.
- Agregar al carrito o comprar en el proveedor sin un ADR que lo apruebe.
