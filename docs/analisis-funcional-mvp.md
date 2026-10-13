# Análisis funcional inicial — MVP

Versión 0.1 · 13/10/2026 · Estado: **borrador para aprobación**

## 1. Objetivo del MVP

Que un cliente revendedor **entre, vea los celulares que tengo en venta con mi precio, confirme
una compra para retirar**, y que yo **reciba un aviso**. Antes de que el pedido quede confirmado,
se verifica que el proveedor tenga disponibilidad.

Fuera del MVP (van al backlog): cuenta corriente, pagos, cupones, garantías, reclamos, outlet,
preventa, push, IMEI, stock propio y franjas horarias con cupo.

## 2. Contexto y restricciones

- El proveedor tiene un portal propio. Tengo usuario y clave para ver disponibilidad y descargar la
  lista de precios en CSV. **No hay API ni acuerdo** de integración.
- Mi portal es independiente: marca, diseño y textos propios.
- Las tres capas de datos se mantienen separadas:
  1. **Oferta del proveedor:** nombre, categoría, semáforo y costo en USD (desde el CSV).
  2. **Mi oferta:** qué publico, con qué nombre y a qué precio (costo + regla de margen).
  3. **Mi inventario:** stock físico propio. Fuera del MVP; el modelo lo prevé.

## 3. Análisis del CSV del proveedor (lista del 13/10/2026)

| Aspecto | Hallazgo | Consecuencia |
|---|---|---|
| Formato | `;` como separador, campos entre comillas, UTF-8 con emojis | Parser estricto con detección de BOM |
| Columnas | Stock, Producto, Categoría, Precio USD, Precio ARS | Se valida el encabezado exacto |
| Semáforo | **4 colores**: 🟢 🟡 🟠 🔴 (no 3) | Hay que confirmar qué significa cada uno (pregunta P1) |
| Identidad | No hay código ni SKU; solo el nombre | La clave es el nombre normalizado (ADR-0004). Si el proveedor renombra un producto, el sistema lo ve como uno nuevo y el anterior queda "no listado" |
| Nombres casi iguales | `...YARA EDP 50 ML` ($23) y `...YARA EDP 50ML` ($11) son filas distintas | La normalización **no** debe unir variantes de espacios |
| Condición | Va en el nombre: Caja Abollada, CPO, Activado, USADO, Grado A, sin caja, slim | Cada fila es un producto vendible distinto; no hace falta separar variantes en el MVP |
| Precios | `$1.150` = 1150 USD; sin decimales | El punto se interpreta como separador de miles |
| ARS | Cotización implícita constante (1565 ARS/USD en esta lista) | Sirve como control; mi ARS usa mi cotización |
| Categorías | IPHONE, IPHONE USADO, PRODUCTOS APPLE, XIAOMI, SAMSUNG, MOTOROLA, REALME, INFINIX, ARTICULOS VARIOS, PERFUMES, MODULOS, BATERIAS, VAPERS | El administrador elige qué categorías publicar (por defecto: solo celulares) |
| Datos | Cada snapshot es "el estado al momento de la descarga" | Hay que mostrar su antigüedad; un CSV viejo no garantiza nada |

Validaciones y tolerancia a archivos defectuosos: ver `.ai/skills/csv-import-validation.md`.

## 4. Disponibilidad: cómo se verifica (ADR-0003)

**Límite real:** el CSV es una foto del momento; el semáforo no da cantidades. Un 🟡 o 🟠 no dice si
alcanzan para 5 unidades. Ninguna regla automática basada en el CSV puede garantizar stock.

**Solución del MVP: verificación manual asistida.**

1. El cliente confirma la compra → el pedido queda **Pendiente de verificación** (el cliente lo ve así, con un texto claro).
2. Me llega un email con el pedido y el **nombre exacto de cada producto según el proveedor**.
3. Entro al portal del proveedor (yo, con mi usuario), verifico o hago la compra allá, y en mi panel marco:
   **Confirmar** (con día y hora de retiro), **Confirmar parcial** (quitando ítems) o **Rechazar**.
4. El cliente recibe un email con el resultado.

El semáforo del último CSV sirve como **filtro previo**: los productos 🔴 no se pueden comprar,
y los 🟡/🟠 muestran "stock limitado, sujeto a confirmación".

**Descartado por ahora:** que el sistema entre solo al portal del proveedor con mi usuario y clave
(bot o scraping). Motivos: probablemente viola sus términos de uso, puede hacer que **bloqueen mi
cuenta y pierda al proveedor**, se rompe con cualquier cambio de su web y obliga a guardar sus
credenciales. Si en algún momento el proveedor da una API o una autorización por escrito,
se conecta detrás de la interfaz `AvailabilityChecker` sin rehacer el sistema.

**Recomendación comercial:** preguntarle al proveedor si ofrece algún feed o API para revendedores.
Es común, porque les traés ventas.

## 5. Pedidos: estados y transiciones

| Desde | Acción | Hacia | Quién |
|---|---|---|---|
| — | Confirmar compra | `PENDING_VERIFICATION` | Cliente |
| `PENDING_VERIFICATION` | Confirmar (total o parcial) + datos de retiro | `CONFIRMED` | Admin |
| `PENDING_VERIFICATION` | Rechazar (sin stock, u otro motivo) | `REJECTED` | Admin |
| `PENDING_VERIFICATION` | Cancelar | `CANCELLED` | Cliente o admin |
| `CONFIRMED` | Cancelar | `CANCELLED` | Admin |
| `CONFIRMED` | Marcar retirado | `PICKED_UP` | Admin |

- Si un pedido está más de N horas sin verificar (configurable, por defecto 2 h hábiles), se envía un recordatorio al administrador.
- Cada ítem congela: precio al cliente, costo del proveedor, semáforo e importación de origen.

## 6. Reglas de negocio (R-xx)

- **R-01** Solo clientes aprobados ven precios y compran. El registro queda pendiente hasta que el admin lo aprueba.
- **R-02** Precio publicado = costo del proveedor × (1 + % de margen) + monto fijo, redondeado. Las reglas aplican por producto > categoría > global.
- **R-03** Nunca se publica un precio por debajo del costo del proveedor.
- **R-04** Se muestran USD y ARS. ARS = USD × mi cotización (manual, o automática desde dolarapi con valor manual de respaldo).
- **R-05** Productos 🔴, no listados en el último CSV o no publicados: no se pueden comprar.
- **R-06** Si el último CSV tiene más de 24 h (configurable), el catálogo muestra un aviso; si tiene más de 72 h, se bloquean las compras.
- **R-07** Si el precio cambió entre que el cliente lo vio y la confirmación, se le muestran los precios nuevos y debe reconfirmar.
- **R-08** Un pedido nunca se informa como confirmado sin la verificación del admin.
- **R-09** Si al importar un CSV nuevo cambia el costo o el semáforo de un producto con pedidos pendientes, el panel lo resalta.
- **R-10** El doble clic o un reintento no crea pedidos duplicados (clave de idempotencia).
- **R-11** Toda acción del admin (importar, cambiar reglas, cambiar estados) queda auditada.

## 7. Pantallas del MVP

**Cliente (móvil primero)**
1. Ingreso / registro / recuperar clave.
2. Catálogo: buscador, filtro por categoría y marca, precio USD + ARS, indicador de disponibilidad
   (Disponible / Stock limitado / Sin stock) y botón Agregar.
3. Carrito → confirmar compra (con notas opcionales).
4. Mis pedidos: estado y detalle.

**Administración**
1. Importar CSV: subir archivo → informe de diferencias → aplicar.
2. Productos: publicar o despublicar, nombre visible, foto opcional y precio manual auditado.
3. Reglas de precio y cotización.
4. Pedidos: bandeja de pendientes de verificación, confirmar, confirmar parcial, rechazar y marcar retirado.
5. Clientes: aprobar o bloquear.
6. Configuración: email de aviso, horarios y datos de retiro, umbrales de antigüedad del CSV.

## 8. Modelo de datos del MVP (≈15 tablas)

`users`, `customers`, `categories`, `supplier_imports`, `supplier_products` (nombre normalizado,
estado vigente), `supplier_product_snapshots` (por importación), `products` (mi oferta, 1–1 con
el producto del proveedor), `pricing_rules`, `exchange_rates`, `orders`, `order_items`,
`notification_outbox`, `settings`, `audit_log`, más las tablas de sesión de Auth.js.

El stock propio (`stock_units`, `stock_movements`) se agrega en la fase 2 sin romper el modelo:
un ítem de pedido tendrá un origen (`SUPPLIER` u `OWN_STOCK`).

## 9. Preguntas abiertas

- **P1.** ¿Qué significa cada color en el portal del proveedor? Supuesto: 🟢 disponible, 🟡 stock medio, 🟠 pocas unidades, 🔴 sin stock.
- **P2.** ¿Registro abierto con aprobación, o los clientes los das de alta vos?
- **P3.** ¿Margen inicial? (por ejemplo, +5 % global o +USD 10 por equipo; puede variar por categoría).
- **P4.** ¿Qué categorías publicás? (supuesto: solo celulares, IPHONE, IPHONE USADO y algunos productos Apple).
- **P5.** ¿Se permite la confirmación parcial, o si falta algo se rechaza todo el pedido?
- **P6.** ¿El aviso solo por email, o también por Telegram/WhatsApp? (Telegram es gratis y simple de integrar.)
- **P7.** ¿Datos de retiro: una dirección y horario fijos, o los indicás pedido por pedido?
- **P8.** ¿Cotización ARS: dólar blue automático, manual, o la misma que usa el proveedor?

## 10. Plan de etapas propuesto

1. **Base:** monorepo, base de datos, autenticación con roles, panel mínimo.
2. **Proveedor:** importación del CSV con validaciones, informe de diferencias, publicación de productos y reglas de precio.
3. **Venta:** catálogo del cliente, carrito, checkout con validación de precio y estado, emails.
4. **Operación:** bandeja de verificación, confirmación o rechazo, retiro y auditoría. → **Con esto se puede operar.**
5. **Después:** stock propio, cuenta corriente, notificaciones push, etc. (backlog).
