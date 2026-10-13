# Skill: pruebas

- Unitarias junto al código (`*.spec.ts`); e2e de la API en `apps/api/test/`; Playwright en `apps/web/e2e/`.
- Toda regla de negocio nueva lleva al menos una prueba del camino feliz y una del caso borde.
- Base de datos de prueba aislada (contenedor Postgres); nunca contra producción.
- Fixtures inventados en `fixtures/`. Para CSV: un archivo válido mínimo + uno por cada tipo de error.
- Antes de cerrar una tarea: `pnpm typecheck && pnpm lint && pnpm test` (o el subconjunto del módulo).
- Si una prueba falla y no se arregla, se informa con la salida; nunca se desactiva sin dejarlo anotado.
