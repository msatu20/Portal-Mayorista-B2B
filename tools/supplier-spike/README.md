# E0 — Relevamiento del portal del proveedor

Herramienta descartable para confirmar si se puede consultar el stock del proveedor en forma automática (ADR-0005).

**Qué hace:** entra **una vez** con tu cuenta, recorre las páginas de `SUPPLIER_PATHS` y anota cómo responde la
API del portal (qué endpoints hay, qué campos de stock trae y cómo maneja la sesión).
**Qué no hace:** no agrega al carrito, no compra y no guarda tu clave ni tus tokens en el reporte.

## Uso

1. Completar `tools/supplier-spike/.env` (dirección, usuario y clave). Ese archivo no se sube a GitHub.
2. En una terminal:
   ```
   cd tools/supplier-spike
   npm install
   npm run spike
   ```
3. Se abre Chrome, ingresa solo y recorre el portal (unos 30 segundos).
4. El resultado queda en `data/spike/` (`reporte.json` + capturas). Esa carpeta tampoco se sube a GitHub.
