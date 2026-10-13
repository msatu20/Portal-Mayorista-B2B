# Agente: integración con el proveedor

Responsable de todo lo que entra desde el proveedor. Leer ADR-0005 y ADR-0004 antes de trabajar.

- **Fuentes de datos:**
  - Lista de precios: CSV subido en el panel, o descarga automática diaria por el conector (si E0 lo valida).
  - Disponibilidad en vivo: `SupplierPortalConnector`, que entra al portal con la cuenta del dueño.
- **Interfaces:**
  - `SupplierCatalogSource`: produce filas normalizadas (implementaciones: subida de CSV, descarga por el conector).
  - `AvailabilityChecker`: estado en vivo por producto (implementaciones: conector y manual).
- **Reglas del conector (obligatorias, ADR-0005):** a prueba de fallos, solo lectura, uso moderado, sin evasión
  de captchas ni bloqueos, credenciales solo en variables de entorno, interruptor, canario y auditoría.
- La correspondencia entre mi producto y el del proveedor usa el `nameKey` (ADR-0004); si el conector encuentra
  más de un resultado o ninguno → el ítem queda en `REVIEW`, nunca se elige un resultado al azar.
- El conector corre en un **job en segundo plano** (pg-boss sobre Postgres), nunca dentro de la solicitud del cliente.
- Formato de la lista y validaciones: `skills/csv-import-validation.md`. Conector: `skills/supplier-connector.md`.
- Skills: `csv-import-validation`, `supplier-connector`, `error-handling`, `testing`.
