# E0 — Resultados del relevamiento del portal del proveedor

13/10/2026 · Herramientas: `tools/supplier-spike/spike.ts` y `correlate.ts` · Datos crudos en `data/spike/` (no versionados).
Por privacidad, el dominio del proveedor no figura en el repo: se configura en `.env` (`SUPPLIER_PORTAL_URL`, `SUPPLIER_API_URL`).

## Conclusión

**La verificación automática es viable y mucho más precisa de lo previsto:** la API del proveedor informa la
**cantidad exacta de unidades por color**, y el ingreso funciona por HTTP sin necesidad de un navegador.

## Hallazgos

| Tema | Resultado |
|---|---|
| Ingreso | Auth.js con credenciales: `GET /api/auth/csrf` → `POST /api/auth/callback/credentials` (campos `username`, `password`, `csrfToken`) → `GET /api/auth/session` devuelve `accessToken` (JWT). Funciona por HTTP. |
| 2FA y captcha | No hay captcha. Existe `POST /api/2fa/precheck`, que hoy responde `needsCode: false`. Si el proveedor activa 2FA, el conector debe detectarlo y desactivarse. |
| Sesión | El JWT dura 7 días (`remember`). Incluye `sessionEpoch`: el proveedor puede invalidar sesiones; hay que verificar si un ingreso nuevo cierra la sesión de Chrome del dueño. |
| API | Subdominio de la API, `Authorization: Bearer <JWT>`. |
| Stock exacto | `GET /user/products?page=&limit=` → cada producto trae `colorStock: { "Black": 232, "Green": 182 }`, `colors`, `productReference { id, priceUsd }`, `quantityDeals`, `dentedBoxVariant` y `dollarPrice`. 329 productos (7 páginas de 50). |
| Lista de precios | `GET /user/price-list/products?filter=0` → las mismas filas que el CSV en JSON (`name`, `category`, `stockEmoji`, `priceUsd`, `priceArs`, `colors`) más `cotizacion`. **Reemplaza la subida manual del CSV.** |
| Coincidencias | Las 328 filas de la lista coinciden por nombre con la API; 0 diferencias de precio. |
| Identidad estable | `productReference.id` es único por producto (excepto 1 producto sin referencia y fuera de la lista). Mejor clave que el nombre (ADR-0004). |
| Franjas de retiro | `GET /user/schedule`: franjas de "Día hábil" con hora de corte y de entrega (útil para saber cuándo puedo retirar yo). |

## Semáforo vs. cantidad real (328 productos)

| Color | Productos | Unidades (mín. / mediana / máx.) | Regla deducida |
|---|---|---|---|
| 🟢 | 109 | 11 / 30 / 900 | ≥ 11 |
| 🟡 | 74 | 5 / 6 / 10 | 5 a 10 |
| 🟠 | 89 | 2 / 3 / 4 | 2 a 4 |
| 🔴 | 56 | 1 / 1 / 1 | **1 unidad** (no "sin stock") |

Los productos con 0 unidades no aparecen en la lista.

## Impacto en el diseño

1. La autoconfirmación pasa a ser **por cantidad**: se confirma si `unidades disponibles (del color) ≥ cantidad pedida`.
   Los umbrales por color quedan solo como respaldo.
2. La lista se importa **automáticamente** desde la API (por ejemplo, cada 1 hora o 2 veces por día); el CSV queda como respaldo manual.
3. Identidad del producto: `productReference.id` (ADR-0004 revisado), con el nombre como respaldo.
4. **El stock es por color:** para verificar con exactitud, el cliente debería elegir el color (pregunta P11).
5. 🔴 = 1 unidad: se puede vender 1 unidad con verificación en vivo, en lugar de ocultarlo (pregunta P12).
6. `quantityDeals` (por ejemplo, "10+: −USD 4 c/u") baja mi costo en compras grandes: se puede tener en cuenta más adelante.
