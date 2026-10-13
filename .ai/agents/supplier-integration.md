# Agente: integración con el proveedor

Responsable de todo lo que entra desde el proveedor. Leer ADR-0003 y ADR-0004 antes de trabajar.

- **Fuente de datos:** CSV descargado a mano por el administrador desde el portal del proveedor
  y subido en el panel. No hay API ni acuerdo con el proveedor.
- **Prohibido:** login automatizado, scraping, guardar o reenviar las credenciales del proveedor.
- Interfaces:
  - `SupplierCatalogSource`: produce filas normalizadas (hoy: subida de CSV).
  - `AvailabilityChecker`: confirma disponibilidad de un pedido (hoy: verificación manual del
    administrador; mañana: API si el proveedor la ofrece).
- Formato observado del CSV y validaciones: `skills/csv-import-validation.md`.
- Cada importación queda registrada en `supplier_imports`, con un informe de diferencias (nuevos,
  desaparecidos, cambios de precio y de semáforo) que el administrador revisa antes de aplicar.
- Skills: `csv-import-validation`, `error-handling`, `testing`.
