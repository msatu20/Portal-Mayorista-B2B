# Riesgos conocidos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R1 | El semáforo no da cantidades; un 🟡 o 🟠 puede no alcanzar para el pedido | Pedido confirmado sin stock | Verificación manual obligatoria (ADR-0003); confirmación parcial |
| R2 | El CSV queda viejo (el admin no lo sube) | Precios y estados desactualizados | Aviso a las 24 h y bloqueo de compras a las 72 h (configurable) |
| R3 | El proveedor cambia el formato del CSV | La importación falla | Validación de encabezado; rechazo total con mensaje claro; nunca se aplica a medias |
| R4 | El proveedor renombra productos (no hay SKU) | Productos duplicados o huérfanos | Informe de diferencias; vinculación manual del producto nuevo con el anterior |
| R5 | Demora del admin en verificar | El cliente espera; venta perdida | Recordatorio a las N horas; aviso por un canal rápido (Telegram, fase 2) |
| R6 | Un cambio de precio del proveedor deja el margen negativo en un pedido pendiente | Pérdida | Resaltado en el panel (R-09); bloqueo de precios menores al costo |
| R7 | La dependencia de un único proveedor y de su portal | Si cierra el acceso, no hay catálogo | Diseño con interfaces; el stock propio en fase 2 reduce la dependencia |
| R8 | Automatizar el acceso al portal del proveedor | Bloqueo de la cuenta; posible incumplimiento de sus términos | Descartado (ADR-0003) |
