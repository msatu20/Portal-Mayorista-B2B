# Análisis funcional — MVP

Versión 0.2 · 13/10/2026 · Estado: **respuestas P1–P8 incorporadas; verificación automática sujeta al spike (E0)**

## 1. Objetivo del MVP

Que un cliente revendedor **entre, vea los productos que tengo en venta con mi precio y confirme
una compra para retirar**; que el sistema **verifique automáticamente contra el portal del proveedor**
que lo pedido existe, y que tanto yo como el cliente recibamos los avisos correspondientes.

Fuera del MVP (backlog): cuenta corriente, pagos, cupones, garantías, reclamos, outlet, preventa,
push, IMEI, stock propio y franjas con cupo.

## 2. Contexto y restricciones

- El proveedor tiene un portal propio. Tengo usuario y clave; no hay API pública ni acuerdo de integración.
- Según la especificación observada, ese portal es una app Next.js que consulta una API REST propia
  (`/user/products`, sesión con Auth.js). Es probable que el conector pueda hablar con esa API como lo
  hace el navegador, sin "leer pantallas". **Se confirma en el spike E0.**
- Tres capas de datos separadas: **oferta del proveedor**, **mi oferta** (precio publicado) y **mi inventario** (fase 2).

## 3. CSV del proveedor (lista del 13/10/2026)

| Aspecto | Hallazgo | Consecuencia |
|---|---|---|
| Formato | `;`, campos entre comillas, UTF-8 con emojis | Parser estricto con detección de BOM |
| Semáforo | 🟢 disponible · 🟡 stock medio · 🟠 pocas unidades · 🔴 sin stock (**confirmado**) | Sin cantidades exactas |
| Identidad | No hay SKU; solo el nombre | Clave = nombre normalizado (ADR-0004) |
| Nombres casi iguales | `...50 ML` a $23 y `...50ML` a $11 | La normalización no une variantes de espacios |
| Condición | Va en el nombre (Caja Abollada, CPO, USADO, etc.) | Cada fila es un producto distinto |
| ARS | Cotización implícita (1565 en esta lista) | Es la **cotización del proveedor**, la opción por defecto (§7) |
| Categorías | Muchas no son celulares | El admin elige qué publicar |

Validaciones: `.ai/skills/csv-import-validation.md`. Si el spike E0 lo permite, la lista también se
puede traer en forma automática (una vez por día), sin subir el CSV a mano.

## 4. Qué ve el cliente según el color

| Color (último dato) | Se muestra | Texto al cliente | Puede comprar |
|---|---|---|---|
| 🟢 | Sí | "Disponible" | Sí |
| 🟡 | Sí | "Stock limitado — confirmación en minutos" | Sí |
| 🟠 | Sí | "Últimas unidades — confirmación en minutos" | Sí |
| 🔴 | **No** | — | No |
| No listado en la última lista | No | — | No |

## 5. Verificación de disponibilidad (ADR-0005)

**Flujo:**
1. El cliente confirma → el pedido queda **Preconfirmado** (`PENDING_CHECK`). Recibe un email y un WhatsApp:
   "Recibimos tu pedido; en unos minutos te confirmamos la disponibilidad".
2. Un proceso en segundo plano entra al portal del proveedor con mis credenciales y consulta el estado
   actual de cada ítem. Reutiliza la sesión y respeta un límite de consultas.
3. Por ítem se decide, según la **política de autoconfirmación** (configurable):

   | Estado en vivo | Regla por defecto |
   |---|---|
   | 🟢 | Disponible → autoconfirma |
   | 🟡 | Autoconfirma si la cantidad ≤ 2; si no, revisión del admin |
   | 🟠 | Autoconfirma si la cantidad ≤ 1; si no, revisión del admin |
   | 🔴 o no encontrado | No disponible |
   | Si el proveedor expone la **cantidad real** (se verifica en E0) | Se compara cantidad pedida contra disponible y no se usan umbrales |

4. Resultado del pedido:
   - Todo disponible → **Confirmado** (`CONFIRMED`). Aviso al cliente con lugar y horario de retiro,
     y aviso al admin: "comprá/reservá en el proveedor".
   - Una parte disponible → **Esperando al cliente** (`AWAITING_CUSTOMER`). El cliente elige
     "Acepto lo disponible" o "Cancelo todo" (vence en N horas; por defecto se cancela).
   - Nada disponible → **Rechazado** (`REJECTED`).
   - Algún ítem en revisión → **Revisión manual** (`NEEDS_REVIEW`), con aviso al admin.
5. **Principio de seguridad:** si la consulta falla (login rechazado, sitio caído, cambio en la web,
   captcha, tiempo agotado), **nunca se confirma**. El pedido pasa a `NEEDS_REVIEW` y se avisa al admin
   por WhatsApp y email. El cliente sigue viendo "en verificación".

**Sobre el "100 %":** el sistema garantiza que **solo confirma con un dato en vivo positivo del proveedor**
y que ante cualquier duda no confirma. Hay un riesgo residual que ningún sistema elimina sin poder reservar
en el proveedor: que otro revendedor compre esas unidades entre la consulta y el momento en que yo compro.
Se reduce con el aviso inmediato al admin. La certeza total se logra cuando el sistema, además, **compra o
reserva en el proveedor** (opción futura, con aprobación del admin; ver backlog).

## 6. Pedidos: estados y transiciones

| Desde | Acción | Hacia | Quién |
|---|---|---|---|
| — | Confirmar compra | `PENDING_CHECK` | Cliente |
| `PENDING_CHECK` | Verificación: todo OK | `CONFIRMED` | Sistema |
| `PENDING_CHECK` | Verificación: parcial | `AWAITING_CUSTOMER` | Sistema |
| `PENDING_CHECK` | Verificación: nada | `REJECTED` | Sistema |
| `PENDING_CHECK` | Verificación con dudas o error | `NEEDS_REVIEW` | Sistema |
| `NEEDS_REVIEW` | Confirmar total, parcial o rechazar | `CONFIRMED` / `AWAITING_CUSTOMER` / `REJECTED` | Admin |
| `NEEDS_REVIEW` | Reintentar verificación | `PENDING_CHECK` | Admin |
| `AWAITING_CUSTOMER` | Acepta lo disponible | `CONFIRMED` | Cliente |
| `AWAITING_CUSTOMER` | Cancela, o vence el plazo | `CANCELLED` | Cliente o sistema |
| `PENDING_CHECK`, `NEEDS_REVIEW`, `CONFIRMED` | Cancelar | `CANCELLED` | Admin (cliente solo antes de `CONFIRMED`) |
| `CONFIRMED` | Marcar retirado | `PICKED_UP` | Admin |

Cada ítem guarda: precio al cliente, costo del proveedor, color al pedir, **resultado de la verificación en
vivo** (color o cantidad, fecha y hora) y su estado (`AVAILABLE` / `UNAVAILABLE` / `REVIEW`).

## 7. Configuración (todo desde el panel de administración)

Las configuraciones se editan en el panel (se guardan en la base y quedan auditadas). Además se pueden
**exportar e importar como archivo JSON**, y el sistema arranca con valores por defecto de
`config/defaults.json`. Así no hace falta tocar archivos en el servidor ni redesplegar.

**Precios** — precio = costo × (1 + %) + USD fijo, con redondeo opcional:
- Regla **global** (% y/o USD fijo).
- Reglas por **marca** y por **categoría**.
- Precio manual por **producto** (excepción auditada).
- Gana la regla más específica: producto > categoría > marca > global.
- La marca se deduce de la categoría (XIAOMI, SAMSUNG, MOTOROLA, REALME, INFINIX; IPHONE y PRODUCTOS APPLE → Apple)
  y se puede corregir por producto (por ejemplo, en ARTICULOS VARIOS).
- Nunca se publica por debajo del costo.

**Cotización ARS** — 3 modos:
1. **Proveedor** (por defecto): la implícita en la última lista importada.
2. **Manual**: un valor cargado por el admin (por ejemplo, 1570).
3. **Automática**: desde una fuente externa configurable (dolarapi.com: blue, oficial o MEP), cacheada unos minutos.
   Si la fuente falla, se usa la del proveedor.

El panel muestra los tres valores lado a lado para comparar. Cada pedido guarda la cotización usada.

**Retiro:** lugar y horario por defecto. Si no hay nada cargado, el admin los indica al confirmar cada pedido.
También se pueden cambiar en un pedido puntual.

**Verificación:** activar o desactivar el conector, umbrales por color, plazo de respuesta del cliente
en los pedidos parciales y antigüedad máxima de la lista.

**Notificaciones:** email y WhatsApp del admin; canales activos.

## 8. Notificaciones

| Evento | Cliente | Admin |
|---|---|---|
| Pedido recibido (preconfirmado) | Email + WhatsApp | Email + WhatsApp |
| Confirmado | Email + WhatsApp (con retiro) | WhatsApp "comprá en el proveedor" |
| Parcial (debe elegir) | Email + WhatsApp con enlace | Email |
| Rechazado | Email + WhatsApp | — |
| Revisión manual o fallo del conector | — | WhatsApp + email (urgente) |
| Registro nuevo para aprobar | — | Email |
| Cuenta aprobada | Email | — |

WhatsApp por la **API oficial de WhatsApp Business (Meta Cloud API)**: mensajes con plantillas aprobadas
y un costo bajo por conversación. Se descartan las librerías no oficiales, porque WhatsApp bloquea esos números.

## 9. Reglas de negocio

- **R-01** Registro abierto; la cuenta queda pendiente hasta que el admin la aprueba. Sin aprobación no se ven precios.
- **R-02** Precios según §7. **R-03** Nunca por debajo del costo.
- **R-04** USD y ARS visibles; la cotización según el modo configurado.
- **R-05** 🔴 o no listado: no se muestra.
- **R-06** Si la lista tiene más de 24 h: aviso al admin; si tiene más de 72 h: no se aceptan compras (configurable).
- **R-07** Si el precio cambió entre ver y confirmar, el cliente reconfirma.
- **R-08** Ningún pedido pasa a `CONFIRMED` sin una verificación en vivo positiva o la decisión explícita del admin.
- **R-09** Un error del conector nunca confirma: deriva a revisión manual.
- **R-10** Idempotencia en la confirmación (el doble clic no duplica pedidos).
- **R-11** Toda acción del admin y del conector queda auditada.

## 10. Pantallas del MVP

**Cliente:** registro e ingreso; catálogo (buscador, filtros por categoría y marca, USD + ARS, etiqueta
de disponibilidad); carrito → confirmar; mis pedidos (estado, aceptar parcial o cancelar).

**Admin:** pedidos (bandeja por estado, revisión manual, reintentar verificación, retiro); importar lista
y ver diferencias; productos (publicar, nombre visible, marca, foto, precio manual); precios; cotización;
clientes (aprobar o bloquear); configuración; estado del conector (última consulta OK, errores); auditoría.

## 11. Modelo de datos (≈17 tablas)

`users`, `customers`, `categories`, `brands`, `supplier_imports`, `supplier_products`,
`supplier_product_snapshots`, `products`, `pricing_rules`, `exchange_rates`, `settings`, `orders`,
`order_items`, `availability_checks` (cada consulta en vivo: ítem, resultado, latencia, error),
`notification_outbox`, `audit_log`, más las tablas de sesión de Auth.js.

## 12. Etapas

0. **Spike del conector (E0):** confirmar que se puede consultar el stock del proveedor en forma automática y estable
   (cómo es el login, si hay captcha o 2FA, qué devuelve la API, si incluye la cantidad real). **Define si el §5 es viable tal cual.**
1. **Base:** monorepo, base de datos, autenticación con roles, panel mínimo.
2. **Proveedor:** importación de la lista, diferencias, publicación, precios, cotización.
3. **Venta:** catálogo, carrito, checkout, email y WhatsApp.
4. **Verificación y operación:** conector en segundo plano, estados, parciales, revisión manual, retiro y auditoría.
   → **Con esto se puede operar.**
5. **Después:** compra o reserva automática en el proveedor, stock propio, cuenta corriente, etc.

## 13. Preguntas abiertas

- **P9.** ~~Forma de ingreso al portal del proveedor~~ → usuario y clave por URL, sin captcha ni 2FA (respondida). La URL se carga solo en el `.env` local.
- **P10.** ~~WhatsApp Business~~ → el dueño tiene un número de WhatsApp Business (respondida). Hay que verificar al configurarlo
  si se puede usar en la app y en la Cloud API a la vez (coexistencia) o si conviene un número dedicado para la API.
