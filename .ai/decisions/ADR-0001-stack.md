# ADR-0001: Stack tecnológico

- **Estado:** Aceptada · 13/10/2026
- **Contexto:** se necesita una web móvil para clientes y un panel de administración, con un costo de hosting bajo
  y la posibilidad de una app móvil futura que reutilice la API. Se evaluó React + .NET + SQL Server.
- **Decisión:** TypeScript de punta a punta. Next.js (App Router) para la web, NestJS para la API, Prisma +
  PostgreSQL, monorepo pnpm con `packages/shared` para esquemas Zod y tipos comunes.
- **Consecuencias:**
  - (+) Un solo lenguaje; validaciones compartidas entre la web y la API; hosting barato (Postgres gratuito o económico).
  - (+) La API separada permite sumar una app móvil sin rehacer la lógica.
  - (−) Dos procesos que desplegar. Alternativa más simple descartada: rutas de API de Next.js
    (mezcla la interfaz con la lógica de negocio).
  - .NET + SQL Server descartado: licencias y hosting más caros, sin ventaja para este caso.
