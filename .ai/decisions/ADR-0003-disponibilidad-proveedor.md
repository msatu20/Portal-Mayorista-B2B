# ADR-0003: Cómo se obtiene la oferta y la disponibilidad del proveedor

- **Estado:** Aceptada · 13/10/2026
- **Contexto:** no hay API ni acuerdo con el proveedor. El dueño tiene usuario y clave de su portal, donde ve
  la disponibilidad (semáforo de 4 colores, sin cantidades) y descarga la lista en CSV.

## Opciones evaluadas

| Opción | Pros | Contras |
|---|---|---|
| A. CSV subido a mano + verificación manual del admin por pedido | Legítima, simple, sin riesgo para la cuenta | Requiere unos minutos del admin por pedido |
| B. API o feed autorizado por el proveedor | Automática y confiable | Hoy no existe; hay que pedirla |
| C. Bot que entra con mis credenciales y lee el portal | Automática | Probable violación de los términos de uso; riesgo de bloqueo de la cuenta (perder al proveedor); frágil ante cambios de su web; obliga a guardar sus credenciales |

## Decisión

Opción **A** para el MVP. La interfaz `AvailabilityChecker` deja lista la opción **B**.
La opción **C** queda descartada mientras no exista una autorización escrita del proveedor.

## Consecuencias

- Todo pedido pasa por `PENDING_VERIFICATION`; nunca hay confirmación automática.
- El semáforo del último CSV solo filtra (el 🔴 no se puede comprar) e informa (🟡/🟠 "sujeto a confirmación").
- La antigüedad del CSV se muestra y limita las compras (R-06).
- El sistema no almacena las credenciales del proveedor.
