# Trabajo activo

_Última actualización: 13/10/2026_

## Ahora
- **E0 — Spike del conector con el proveedor.** Objetivo: confirmar que se puede consultar el stock en forma
  automática y estable. Hay que averiguar: tipo de login (Auth.js con credenciales, ¿captcha o 2FA?), endpoint de
  productos y su respuesta (¿trae cantidad real?), vencimiento de la sesión y si se puede descargar la lista.
  El login es con usuario y clave, sin captcha. Herramienta lista en `tools/supplier-spike/`; esperando que el dueño
  complete `.env` y la ejecute. El resultado se lee en `data/spike/reporte.json` (no versionado).

## Próximo
- E1 Base: monorepo pnpm, `apps/web`, `apps/api`, `packages/shared`, Docker Compose con Postgres, Prisma, Auth.js con roles.

## Hecho
- Marco de IA `.ai/` y análisis funcional v0.2 con las respuestas P1–P8 (ver change-log 2026-10).

## Bloqueos
- Ejecución del spike E0 por parte del dueño (necesita sus credenciales en el `.env` local).
