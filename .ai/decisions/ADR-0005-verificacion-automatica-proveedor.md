# ADR-0005: Verificación automática de stock en el portal del proveedor

- **Estado:** Aceptada, condicionada al spike E0 · 13/10/2026 · Reemplaza a ADR-0003
- **Contexto:** el dueño necesita que cada pedido se verifique automáticamente contra el proveedor antes de
  confirmarlo. No hay API pública ni acuerdo; sí hay usuario y clave propios del portal del proveedor, que
  según la especificación observada es Next.js + Auth.js y consume una API REST (`/user/products`).
- **Decisión:** un **conector** (`SupplierPortalConnector`, que implementa `AvailabilityChecker`) inicia sesión
  con la cuenta del dueño y consulta el estado de los productos de cada pedido. Se usa la API JSON que usa el
  navegador; si no es viable, se usa un navegador automatizado (Playwright). El resultado aplica la política
  de autoconfirmación (análisis §5).

## Reglas obligatorias del conector

1. **A prueba de fallos:** cualquier error o respuesta inesperada → `NEEDS_REVIEW`, nunca `CONFIRMED`.
2. **Solo lectura:** no agrega al carrito ni compra (eso sería otra decisión, con un ADR propio).
3. **Uso moderado:** consulta solo cuando hay pedidos (y como máximo una descarga diaria de la lista);
   reutiliza la sesión; no más de 1 solicitud por segundo; resultados cacheados 2 minutos.
4. **Sin evasión:** no se resuelven captchas, no se rotan IPs ni se falsifican huellas del navegador. Si el
   proveedor agrega un captcha o un bloqueo, el conector se desactiva solo y avisa; se vuelve a la verificación manual.
5. **Credenciales:** solo en variables de entorno o en el gestor de secretos del hosting; nunca en la base, el
   repo ni los logs.
6. **Interruptor:** se puede apagar desde el panel; apagado = verificación manual.
7. **Monitoreo:** chequeo periódico (canario) con un producto conocido; si falla, se alerta al admin.
8. **Auditoría:** cada consulta queda en `availability_checks`.

## Consecuencias y riesgos aceptados por el dueño

- Puede ir contra los términos de uso del proveedor y derivar en un bloqueo de la cuenta. Se recomienda revisar
  sus términos y, si es posible, avisarle o pedirle una API.
- Es frágil ante cambios del sitio del proveedor: el canario y el principio de seguridad lo contienen.
- El riesgo residual (que otro compre las unidades entre la consulta y la compra del admin) solo se elimina
  reservando o comprando en el proveedor (backlog).
