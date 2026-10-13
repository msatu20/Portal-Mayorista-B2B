# Trabajo activo

_Última actualización: 13/10/2026_

## Ahora
- **E0 — Spike del conector con el proveedor.** Objetivo: confirmar que se puede consultar el stock en forma
  automática y estable. Hay que averiguar: tipo de login (Auth.js con credenciales, ¿captcha o 2FA?), endpoint de
  productos y su respuesta (¿trae cantidad real?), vencimiento de la sesión y si se puede descargar la lista.
  Esperando del dueño: URL del portal y forma de ingreso (P9).

## Próximo
- E1 Base: monorepo pnpm, `apps/web`, `apps/api`, `packages/shared`, Docker Compose con Postgres, Prisma, Auth.js con roles.

## Hecho
- Marco de IA `.ai/` y análisis funcional v0.2 con las respuestas P1–P8 (ver change-log 2026-10).

## Bloqueos
- P9 (acceso al portal del proveedor) y P10 (cuenta de WhatsApp Business): `docs/analisis-funcional-mvp.md` §13.
