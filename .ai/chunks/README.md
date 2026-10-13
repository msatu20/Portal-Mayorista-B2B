# Fragmentación del repositorio y presupuesto de tokens

## Estrategia

El repo se trabaja **por módulo vertical** (dominio), no por capa. Una tarea de "pedidos" carga
`apps/api/src/orders/`, los esquemas de pedidos de `packages/shared` y las páginas de pedidos de `apps/web`;
nada más. El índice de qué cargar para cada módulo está en `module-index.md`.

Orden de carga (parar apenas alcance):
1. `context/Trabajo-Activo.md` + `context/Modulo-Map.md` (siempre).
2. El agente que corresponde + 1 o 2 skills.
3. Los archivos del módulo según `module-index.md`: primero tipos y pruebas, después la implementación.
4. Solo si hace falta: archivos de módulos vecinos (dependencias en `Modulo-Map.md`).

## Presupuesto orientativo por tipo de tarea

| Tarea | Contexto a cargar | Presupuesto |
|---|---|---|
| Pregunta o duda puntual | Trabajo-Activo + 1 archivo | ≤ 5k tokens |
| Bug acotado | Contexto base + módulo afectado | ≤ 20k |
| Feature en un módulo | Contexto base + agente + skills + módulo | ≤ 40k |
| Feature transversal | Dividir en subtareas por módulo | ≤ 40k por subtarea |
| Revisión de arquitectura | Todos los `context/` + ADRs | ≤ 30k |

## Directrices

- Buscar antes de leer: grep o glob para ubicar, y lectura parcial por rangos.
- No releer archivos ya leídos en la misma sesión si no cambiaron.
- Resultados de exploración útiles → 1 a 3 líneas en `Modulo-Map.md` o `module-index.md`.
- Archivos generados (migraciones de Prisma, `.next/`, lockfiles) no se leen salvo que la tarea sea sobre ellos.
