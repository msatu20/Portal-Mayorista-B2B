# Convenciones de código

- **Lenguaje:** TypeScript estricto (`strict: true`) en todo el monorepo. Sin `any` salvo justificado en un comentario.
- **Idioma:** identificadores, tablas y rutas de la API en inglés; textos de UI, docs y commits en español rioplatense.
  Las rutas visibles del frontend van en español (`/comprar`, `/mis-pedidos`).
- **Nombres:** archivos `kebab-case.ts`; clases `PascalCase`; variables `camelCase`; tablas `snake_case` (vía `@@map` de Prisma).
- **Dinero:** nunca `number` para montos persistidos; `Prisma.Decimal` en la API y string decimal en el JSON.
  Montos en USD con 2 decimales.
- **Validación:** esquemas Zod en `packages/shared`, reutilizados por la web y la API.
- **Errores:** códigos estables (`PRICE_CHANGED`, etc.); ver `skills/error-handling.md`.
- **Fechas:** se guardan en UTC y se muestran en `America/Argentina/Buenos_Aires` con formato dd/mm/aaaa.
- **Commits:** Conventional Commits en español (`feat: importar CSV del proveedor`).
- **Formato:** Prettier + ESLint; el CI falla con errores de tipos o de lint.
- **Comentarios:** solo el porqué, no el qué.
