# Arquitectura (objetivo; todavía no hay código)

```
Navegador (PWA, móvil primero)
   ├── páginas ──▶ apps/web  (Next.js App Router, Auth.js, Tailwind, shadcn/ui, TanStack Query)
   └── JSON + token ──▶ apps/api (NestJS, Zod, Prisma) ──▶ PostgreSQL
                                   ├── worker de outbox ──▶ Email (SMTP o Resend)
                                   └── cotización: dolarapi.com (cacheada) o manual
```

- **Monorepo pnpm:** `apps/web`, `apps/api`, `packages/shared` (esquemas Zod, tipos y formatos).
- La API es la única que toca la base de datos. Todas las reglas de negocio viven en la API.
- **Proveedor:** el CSV se sube a mano en el panel → `SupplierCatalogSource`. La disponibilidad pasa por
  `AvailabilityChecker` (implementación MVP: verificación manual del admin). Ver ADR-0003.
- **Notificaciones:** outbox en base de datos + interfaz `Notifier`. Redis y BullMQ no hacen falta en el MVP
  (se agregan si el volumen lo pide).
- **Infraestructura:** Docker Compose (Postgres) en local; producción en VPS con Docker + nginx,
  o Vercel (web) + Railway (api + db). A decidir antes del primer deploy.
- **Modelo de datos del MVP:** ≈15 tablas; ver `docs/analisis-funcional-mvp.md` §8.
