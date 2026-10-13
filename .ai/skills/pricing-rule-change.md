# Skill: cambio de reglas de precio y cotización

## Precio

`precio_publicado = redondeo( costo_proveedor × (1 + margen_%) + margen_fijo_usd )`

- Alcances: `PRODUCT` > `CATEGORY` > `BRAND` > `GLOBAL` (gana el más específico). Cada regla puede combinar % y USD fijo.
- Marca: se deduce de la categoría del proveedor (tabla de mapeo editable) y se puede corregir por producto.
- Redondeo configurable: ninguno, al entero o a múltiplos de 5.
- El precio manual por producto es un override auditado y se marca en el panel.
- Nunca se publica por debajo del costo (se bloquea y se avisa).

## Cotización ARS (3 modos)

- `SUPPLIER` (por defecto): la implícita en la última lista importada (ARS/USD, mediana de las filas).
- `MANUAL`: valor cargado por el admin.
- `AUTO`: fuente externa configurable (dolarapi.com: `blue`, `oficial`, `bolsa`), cacheada 5 minutos;
  si falla → `SUPPLIER`. Se guarda cada valor en `exchange_rates`.

## Dónde vive la configuración

- En la base (`pricing_rules`, `settings`), editable desde el panel y auditada.
- Exportar e importar como JSON desde el panel; valores iniciales en `config/defaults.json`.

## Procedimiento

1. Vista previa con el antes y el después: cuántos productos cambian y en cuánto.
2. Aplicar en transacción + `audit_log`.
3. Los pedidos ya creados **no** cambian de precio ni de cotización.
4. Probar: precedencia, combinación de % y fijo, redondeo, override, precio menor al costo y los 3 modos de cotización (incluido el fallo de la fuente automática).
