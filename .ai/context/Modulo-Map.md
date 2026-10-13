# Mapa de módulos

Estado: **planificado** (sin código). Actualizar cuando se cree cada carpeta.

| Módulo | Backend (`apps/api/src/`) | Frontend (`apps/web/app/`) | Agente | Estado |
|---|---|---|---|---|
| Auth y roles | `auth/` | `(auth)/ingresar`, `registro` | backend-api, security-reviewer | planificado |
| Clientes | `customers/` | `admin/clientes` | backend-api | planificado |
| Proveedor (CSV) | `supplier/` | `admin/importar` | supplier-integration | planificado |
| Catálogo (mi oferta) | `catalog/` | `comprar`, `admin/productos` | backend-api, frontend-web | planificado |
| Precios y cotización | `pricing/` | `admin/precios` | pricing-orders | planificado |
| Pedidos | `orders/` | `carrito`, `mis-pedidos`, `admin/pedidos` | pricing-orders | planificado |
| Notificaciones | `notifications/` | — | backend-api | planificado |
| Configuración | `settings/` | `admin/configuracion` | backend-api | planificado |
| Auditoría | `audit/` | `admin/auditoria` | database | planificado |
| Compartido | `packages/shared` (Zod, tipos, formatos) | | todos | planificado |

Dependencias: `orders` → `catalog` → `pricing` → `supplier`. `notifications` es escuchado por `orders`.
