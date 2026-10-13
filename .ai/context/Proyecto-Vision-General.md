# Visión general del proyecto

**Qué es:** portal web B2B de venta de celulares a revendedores. Marca y diseño propios.

**Cómo funciona el negocio:**
- Un proveedor mayorista publica su lista en su propio portal. Tengo usuario y clave para ver
  la disponibilidad (semáforo de 4 colores) y descargar la lista en CSV. **No hay API ni acuerdo.**
- Mi portal toma esa lista como fuente de catálogo y costo, aplica **mis reglas de precio** y vende a mis clientes.
- El cliente confirma una compra para **retirar**. El pedido queda preconfirmado y un conector verifica en vivo
  el stock en el portal del proveedor (ADR-0005). Solo confirma con un positivo; ante cualquier duda, revisión manual.

**Tres capas que nunca se mezclan:**
1. Oferta del proveedor (CSV: nombre, categoría, semáforo, costo USD).
2. Mi oferta (qué publico, nombre visible, precio = costo + margen).
3. Mi inventario propio (fase posterior).

**MVP (en curso):** registro con aprobación, catálogo con mi precio (🔴 oculto), carrito, confirmar compra,
verificación automática, confirmación total, parcial o rechazo, avisos por email y WhatsApp.
Detalle: `docs/analisis-funcional-mvp.md`.

**Fuera del MVP:** cuenta corriente, pagos, cupones, garantías, reclamos, outlet, preventa, push, IMEI y stock propio.

**Usuario y dueño:** Marce (Argentina). Documentación y UI en español rioplatense.
