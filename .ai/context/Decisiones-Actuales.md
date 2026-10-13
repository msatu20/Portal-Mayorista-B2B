# Decisiones vigentes (resumen de los ADR)

| ADR | Decisión | Estado |
|---|---|---|
| 0001 | Stack: Next.js + NestJS + Prisma + PostgreSQL, monorepo pnpm, TypeScript de punta a punta | Aceptada |
| 0002 | Alcance del MVP: catálogo + pedido para retirar + verificación + avisos; sin cuenta corriente ni stock propio | Aceptada |
| 0003 | Verificación manual de disponibilidad | Reemplazada por 0005 (queda como respaldo) |
| 0004 | Identidad del producto del proveedor: nombre normalizado | Propuesta |
| 0005 | Verificación automática con un conector al portal del proveedor (cuenta del dueño), a prueba de fallos | Aceptada, condicionada al spike E0 |

Reglas derivadas que todo agente debe respetar:
- Ningún pedido pasa a `CONFIRMED` sin una verificación en vivo positiva o la decisión del admin; un error nunca confirma.
- El conector es de solo lectura, de uso moderado y no evade captchas ni bloqueos.
- Las credenciales del proveedor solo viven en variables de entorno.
- 🔴 no se muestra al cliente; 🟡/🟠 se venden "sujeto a confirmación".
- Precios: producto > categoría > marca > global. Cotización: proveedor (por defecto), manual o automática.
- WhatsApp solo por la API oficial de Meta.
- La lista real del proveedor no se versiona.
