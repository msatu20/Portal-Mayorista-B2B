# Skill: importación y validación del CSV del proveedor

## Formato observado (lista del 13/10/2026)

- Encabezado exacto: `"Stock";"Producto";"Categoría";"Precio USD";"Precio ARS"`
- Separador `;`, todos los campos entre comillas dobles, UTF-8 (incluye emojis y tildes; puede venir con BOM).
- **Stock = emoji de 4 estados** (no 3): 🟢 🟡 🟠 🔴. Mapeo interno: `GREEN`, `YELLOW`, `ORANGE`, `RED`.
- Precio USD: `"$1.150"` → 1150. El punto es separador de miles; no se observaron decimales.
- Precio ARS: `"$1.799.750"`. Implica una cotización del proveedor (en esa lista: 1565 ARS/USD constante).
  Se usa solo como control de consistencia; **mi** precio en ARS sale de mi cotización.
- No hay código ni SKU: la única identidad es el texto de `Producto` (ver ADR-0004).
- La condición viene dentro del nombre: `Caja Abollada`, `CPO`, `Activado`, `USADO`, `Grado A`,
  `sin caja`, `slim`, `con cargador`, `NFC`, `SIN FACE ID`.
- Las categorías incluyen productos que no son celulares (PERFUMES, VAPERS, BATERIAS, MODULOS, etc.).

## Procedimiento

1. Detectar y quitar el BOM; rechazar el archivo si no es UTF-8 válido.
2. Validar el encabezado (mismas 5 columnas, en ese orden; tolerar mayúsculas y tildes). Si no coincide → rechazar todo el archivo.
3. Por fila, validar y normalizar:
   - emoji conocido; si no → error de fila;
   - nombre no vacío; `nameKey` = trim + espacios colapsados + mayúsculas (**sin** quitar espacios
     internos ni unidades: `50 ML` y `50ML` son filas distintas con precios distintos);
   - precio USD: quitar `$` y espacios; `.` seguido de exactamente 3 dígitos = miles; `,` = decimal; resultado > 0;
   - consistencia ARS/USD: si la cotización implícita se desvía más de 2 % de la mediana → advertencia.
4. Duplicados de `nameKey` en el mismo archivo → error de fila (no se elige uno al azar).
5. Generar el **informe de diferencias** contra la última importación aplicada: nuevos, desaparecidos,
   cambios de precio (con %), cambios de semáforo y errores.
6. Umbrales de seguridad: si hay más de 10 % de filas con error, o desaparece más del 30 % del catálogo,
   la importación queda bloqueada hasta que el administrador la confirme explícitamente.
7. Aplicar en **una sola transacción**: crear `supplier_import`, snapshots y actualizar el estado vigente.
   Si algo falla, no se aplica nada.

## Nunca

- Interpretar celdas como fórmulas.
- Pisar el historial: cada importación es un snapshot nuevo.
- Versionar la lista real en el repo; los fixtures de prueba se inventan.
