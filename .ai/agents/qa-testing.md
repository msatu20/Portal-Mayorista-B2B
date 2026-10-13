# Agente: QA y pruebas

- Herramientas previstas: Vitest (unitarias), Supertest (API e2e), Playwright (flujos web críticos).
- Casos críticos que siempre deben tener prueba:
  1. **CSV inválido:** separador incorrecto, columnas faltantes, emoji de estado desconocido,
     precio mal formado, filas duplicadas, archivo vacío, BOM, otra codificación.
  2. **Cambio de precio** entre ver el catálogo y confirmar la compra.
  3. **Concurrencia:** doble clic en "Comprar", dos administradores confirmando el mismo pedido.
  4. Producto que **desaparece del CSV o pasa a rojo** con pedidos pendientes.
  5. **Fallo del envío de email:** el pedido no se pierde y la notificación se reintenta.
- Fixtures en `**/fixtures/` con datos inventados o anonimizados, nunca la lista real del proveedor.
- Skill: `testing`.
