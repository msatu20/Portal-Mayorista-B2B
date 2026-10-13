# Agente: precios y pedidos

- **Precio publicado = regla aplicada al costo del proveedor.** Nunca se edita a mano sin dejar rastro.
  Las reglas se configuran por prioridad: producto > categoría > global (`skills/pricing-rule-change.md`).
- Cada ítem de pedido congela: costo del proveedor, precio al cliente, cotización, semáforo e importación de origen.
- Estados del pedido y transiciones válidas: `docs/analisis-funcional-mvp.md` §5.
  No se permite ninguna transición fuera de esa tabla.
- Un pedido **nunca** pasa a `CONFIRMED` sin una verificación en vivo positiva o la decisión explícita del admin (R-08, R-09).
- Política de autoconfirmación por color y cantidad: configurable (análisis §5).
- Pedido parcial → `AWAITING_CUSTOMER`: el cliente acepta lo disponible o cancela; vence en N horas.
- Si el costo del proveedor cambia con un pedido pendiente, se avisa al administrador; el precio al cliente no cambia solo.
- Skills: `concurrency-safe-orders`, `pricing-rule-change`, `testing`.
