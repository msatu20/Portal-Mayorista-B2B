# ADR-0004: Identidad de los productos del proveedor

- **Estado:** Propuesta · 13/10/2026
- **Contexto:** el CSV no trae código ni SKU. Hay nombres casi idénticos con precios distintos
  (`...EDP 50 ML` a $23 y `...EDP 50ML` a $11).
- **Decisión:** clave = `nameKey` = nombre con trim, espacios colapsados y en mayúsculas. **No** se quitan
  espacios internos, tildes ni unidades, para no unir productos distintos. Los duplicados dentro de un mismo
  archivo son un error de fila.
- **Consecuencias:**
  - Si el proveedor renombra un producto, aparece como "nuevo" y el anterior como "desaparecido". El informe
    de diferencias sugiere posibles pares similares y el admin puede **vincular** el nuevo con mi producto existente
    (conserva el nombre visible, la foto y el override de precio).
  - Si el proveedor algún día agrega un código, se migra a esa clave.
