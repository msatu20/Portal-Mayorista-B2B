# Riesgos conocidos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R1 | ~~El semáforo no da cantidades~~ | — | **Mitigado en E0:** la API informa las unidades exactas por color |
| R12 | El ingreso del conector cierra la sesión de Chrome del dueño (o al revés), por `sessionEpoch` | Molestias; reingresos frecuentes | Reutilizar el token de 7 días; observar en las pruebas; si pasa, usar una cuenta secundaria si el proveedor la permite |
| R13 | El proveedor activa 2FA | El conector no puede ingresar | Detección por `/api/2fa/precheck` → `BLOCKED` + alerta → verificación manual |
| R2 | La lista queda vieja | Precios y estados desactualizados | Descarga diaria automática (si E0 la valida); aviso a 24 h y bloqueo a 72 h |
| R3 | El proveedor cambia el formato del CSV | La importación falla | Validación de encabezado; rechazo total; nunca se aplica a medias |
| R4 | El proveedor renombra productos (no hay SKU) | Duplicados o huérfanos; el conector no los encuentra | Informe de diferencias; vinculación manual; 0 o más de 1 coincidencia → `REVIEW` |
| R5 | El proveedor bloquea la cuenta por el acceso automático, o sus términos lo prohíben | Pérdida del proveedor | Uso moderado, solo lectura, sin evasión; revisar sus términos; pedirle una API |
| R6 | El sitio del proveedor cambia (login, API, HTML) | El conector deja de funcionar | Validación con Zod, canario, autodesactivación y respaldo manual |
| R7 | Otro revendedor compra entre la consulta y mi compra | Pedido confirmado sin stock | Aviso inmediato al admin; futura reserva o compra automática en el proveedor |
| R8 | Filtración de las credenciales del proveedor | Acceso de terceros a mi cuenta | Solo variables de entorno; nunca en logs; rotar la clave ante cualquier sospecha |
| R9 | Margen negativo por un cambio de costo con pedidos abiertos | Pérdida | Resaltado en el panel; bloqueo de precios menores al costo |
| R10 | Demora del admin con pedidos en `NEEDS_REVIEW` | Venta perdida | Alerta urgente por WhatsApp |
| R11 | Aprobación de plantillas de WhatsApp por parte de Meta | Demora en lanzar los avisos por WhatsApp | Lanzar con email; sumar WhatsApp cuando estén aprobadas |
