# ADR-0004: Identidad de los productos del proveedor

- **Estado:** Aceptada (revisada tras E0) · 13/10/2026
- **Contexto:** el CSV no trae código. E0 mostró que la API del proveedor expone `productReference.id`, único por
  producto (329 productos; 1 sin referencia, que tampoco figura en la lista de precios).
- **Decisión:**
  - Clave principal: `supplierRefId` = `productReference.id`.
  - Clave secundaria: `nameKey` = nombre con trim, espacios colapsados y en mayúsculas (sin quitar espacios internos
    ni unidades: `50 ML` ≠ `50ML`). Se usa para el CSV de respaldo y para productos sin referencia.
  - Un producto sin `supplierRefId` no se puede autoconfirmar; va a revisión del admin.
- **Consecuencias:** los renombres del proveedor dejan de romper la correspondencia. El informe de diferencias sigue
  existiendo para el CSV de respaldo.
