# Decisiones vigentes (resumen de los ADR)

| ADR | Decisión | Estado |
|---|---|---|
| 0001 | Stack: Next.js + NestJS + Prisma + PostgreSQL, monorepo pnpm, TypeScript de punta a punta | Aceptada |
| 0002 | Alcance del MVP: catálogo + pedido para retirar + aviso; sin cuenta corriente ni stock propio | Aceptada |
| 0003 | Disponibilidad del proveedor: CSV subido a mano + verificación manual del admin; sin bot ni scraping | Aceptada |
| 0004 | Identidad del producto del proveedor: nombre normalizado (trim, espacios colapsados, mayúsculas) | Propuesta |

Reglas derivadas que todo agente debe respetar:
- Ningún pedido se confirma al cliente sin la verificación del admin.
- Las credenciales del proveedor no se guardan en el sistema.
- La lista real del proveedor no se versiona.
