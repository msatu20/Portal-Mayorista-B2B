# Skill: cambio de reglas de precio

## Modelo

`precio_publicado = redondeo( costo_proveedor × (1 + margen_%) + margen_fijo_usd )`

- Alcance de la regla: `PRODUCT` > `CATEGORY` > `GLOBAL` (gana la más específica).
- Redondeo configurable: ninguno, al entero o a múltiplos de 5.
- Un precio fijo manual por producto (override) es válido, pero queda auditado y se marca en el panel.
- Precio mínimo de seguridad: nunca publicar por debajo del costo del proveedor (bloquear y avisar).

## Procedimiento

1. Mostrar una vista previa con el antes y el después: cuántos productos cambian y en cuánto.
2. Aplicar en transacción y registrar en `audit_log` (quién, cuándo, regla anterior y nueva).
3. Los pedidos ya creados **no** cambian de precio.
4. Probar: precedencia de reglas, redondeo, override y precio menor al costo.
