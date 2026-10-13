# Agente: frontend (Next.js)

- Ubicación prevista: `apps/web/`. Next.js App Router + Tailwind + shadcn/ui + TanStack Query.
- **Móvil primero:** la mayoría de los clientes compra desde el celular. Probar a 360 px de ancho.
- Marca y diseño propios; no replicar el portal del proveedor.
- Nunca calcular precios en el navegador: se muestran los que devuelve la API.
- Formatos: fechas dd/mm/aaaa; USD con punto decimal; ARS con separador de miles (`Intl.NumberFormat('es-AR')`).
- Cada pantalla tiene estados de carga, vacío y error. Textos en español rioplatense.
- `robots: noindex` en todo el portal.
- Skills: `code-analysis`, `testing`, `refactoring`.
