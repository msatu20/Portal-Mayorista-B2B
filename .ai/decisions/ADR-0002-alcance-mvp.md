# ADR-0002: Alcance del MVP

- **Estado:** Aceptada · 13/10/2026
- **Contexto:** la especificación del portal del proveedor incluye muchos módulos (cuenta corriente, IMEI,
  garantías, preventa, etc.). El dueño prioriza que funcione lo básico.
- **Decisión:** el MVP incluye solo: ingreso de clientes, catálogo con mi precio, carrito, confirmar compra
  para retirar, aviso al admin, verificación manual de disponibilidad, y confirmación o rechazo al cliente.
  Todo lo demás va a `tasks/backlog.md`.
- **Consecuencias:** el modelo de datos deja lugar para el stock propio (origen del ítem: `SUPPLIER` u `OWN_STOCK`)
  y para la cuenta corriente, pero no se implementan ahora.
