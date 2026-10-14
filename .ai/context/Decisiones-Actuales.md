# Decisiones vigentes (resumen de los ADR)

| ADR | Decisión | Estado |
|---|---|---|
| 0001 | Stack: Next.js + NestJS + Prisma + PostgreSQL, monorepo pnpm, TypeScript de punta a punta | Aceptada |
| 0002 | Alcance del MVP: catálogo + pedido para retirar + verificación + avisos; sin cuenta corriente ni stock propio | Aceptada |
| 0003 | Verificación manual de disponibilidad | Reemplazada por 0005 (queda como respaldo) |
| 0004 | Identidad del producto del proveedor: `productReference.id` (el nombre normalizado como respaldo) | Aceptada |
| 0005 | Verificación automática por HTTP contra la API del proveedor (cuenta del dueño), por cantidad exacta y a prueba de fallos | Aceptada (E0 OK) |

Reglas derivadas que todo agente debe respetar:
- Ningún pedido pasa a `CONFIRMED` sin una verificación en vivo positiva o la decisión del admin; un error nunca confirma.
- El conector es de solo lectura, de uso moderado y no evade captchas ni bloqueos.
- Las credenciales del proveedor solo viven en variables de entorno.
- Se autoconfirma por cantidad: unidades del color ≥ cantidad pedida. Semáforo: 🟢 ≥ 11 · 🟡 5–10 · 🟠 2–4 · 🔴 = 1.
- La lista del proveedor se importa automáticamente desde su API; el CSV queda como respaldo.
- Los dominios del proveedor no se escriben en el repo (solo en `.env`).
- Precios: producto > categoría > marca > global. Cotización: proveedor (por defecto), manual o automática.
- WhatsApp solo por la API oficial de Meta.
- La lista real del proveedor no se versiona.
