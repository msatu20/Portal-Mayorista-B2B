# Arquitectura (objetivo; todavía no hay código)

```
Navegador (PWA, móvil primero)
   ├── páginas ──▶ apps/web  (Next.js App Router, Auth.js, Tailwind, shadcn/ui, TanStack Query)
   └── JSON + token ──▶ apps/api (NestJS, Zod, Prisma) ──▶ PostgreSQL
                                   ├── jobs (pg-boss) ──┬─▶ Conector ──▶ portal/API del proveedor (cuenta del dueño)
                                   │                    └─▶ outbox ──▶ Email (SMTP o Resend) + WhatsApp (Meta Cloud API)
                                   └── cotización: proveedor (por defecto) | manual | dolarapi.com
```

- **Monorepo pnpm:** `apps/web`, `apps/api`, `packages/shared` (esquemas Zod, tipos y formatos).
- La API es la única que toca la base de datos. Todas las reglas de negocio viven en la API.
- **Proveedor:** la lista llega por CSV subido o por descarga diaria del conector → `SupplierCatalogSource`.
  La disponibilidad en vivo pasa por `AvailabilityChecker` (conector, con la verificación manual de respaldo). Ver ADR-0005.
- **Jobs en segundo plano:** pg-boss (cola sobre el mismo Postgres); evita sumar Redis en el MVP.
- **Notificaciones:** outbox en base de datos + interfaz `Notifier` (email y WhatsApp).
- **Infraestructura:** Docker Compose (Postgres) en local; producción en VPS con Docker + nginx,
  o Vercel (web) + Railway (api + db). A decidir antes del primer deploy.
- **Modelo de datos del MVP:** ≈15 tablas; ver `docs/analisis-funcional-mvp.md` §8.
