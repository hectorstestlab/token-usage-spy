# POC Funcional con Lovable Cloud

Migrar el MVP actual (frontend-only con React Context y datos mock) a un POC funcional con backend real usando **Lovable Cloud** (autenticación, base de datos PostgreSQL con RLS, y storage).

## Alcance de esta versión

### 1. Activar Lovable Cloud
- Provisionar backend (Postgres + Auth + Storage).
- Configurar variables de entorno automáticas.

### 2. Autenticación real
- Reemplazar el login simulado (`UserContext`) por **email/password + Google**.
- Página `/login` con tabs Iniciar sesión / Registrarse.
- Selección de rol (Planner / Pareja / Proveedor) durante el signup.
- Listener `onAuthStateChange` + protección de rutas por rol.
- Logout real desde el sidebar.

### 3. Modelo de datos (tablas + RLS)
Tablas principales:
- `profiles` (id, full_name, avatar_url, created_at) — auto-creada vía trigger en signup.
- `user_roles` (user_id, role enum: `planner` | `client` | `vendor`) — tabla separada + función `has_role()` security definer.
- `weddings` (planner_id, couple, date, venue, guests, status, budget, progress).
- `clients` (planner_id, name, email, phone, wedding_id, status).
- `vendors` (owner_id, name, category, rating, status).
- `tasks` (planner_id, wedding_id, text, due, urgent, done).
- `budget_categories` (wedding_id, name, allocated, spent, scope).
- `vendor_services` (vendor_id, name, description, price, active).
- `vendor_bookings` (vendor_id, client_id, date, venue, status, amount).
- `interview_questions` (planner_id, text, type, category, options, required).
- `interviews` (planner_id, client_name, date, status, notes).
- `interview_answers` (interview_id, question_id, value).

**RLS:** cada tabla con políticas por rol — planner ve sus propios registros, client ve los suyos, vendor ve los suyos. Marketplace `listings` legible por todos los autenticados.

### 4. Migración de contextos
- Reemplazar `EntitiesContext` y `InterviewsContext` por hooks con **TanStack Query** que consulten Supabase.
- Mutaciones (`addWedding`, `addClient`, etc.) → `insert` con invalidación de cache.
- Mantener la misma API pública de los hooks para minimizar cambios en componentes.

### 5. Seed de datos demo
- Edge function o script SQL para poblar datos de muestra cuando se registra un nuevo planner (opcional, toggle "cargar datos demo").

### 6. Fuera de alcance (siguiente iteración)
- Pagos reales con Stripe (sigue simulado).
- Mensajería realtime (sigue mock).
- Notificaciones push.
- Marketplace de proveedores reales (sigue con datos seed).

## Detalles técnicos

```text
src/
├── integrations/supabase/    (auto-generado por Cloud)
├── hooks/
│   ├── useAuth.ts            (sesión + rol)
│   ├── useWeddings.ts        (query + mutations)
│   ├── useClients.ts
│   ├── useVendors.ts
│   ├── useInterviews.ts
│   └── ...
├── contexts/
│   └── UserContext.tsx       (refactor: lee de Supabase auth)
├── pages/
│   ├── Login.tsx             (refactor: auth real + selección rol)
│   └── Signup.tsx            (nueva, o tab dentro de Login)
└── components/auth/
    └── ProtectedRoute.tsx    (redirige si no hay sesión o rol incorrecto)
```

**Pasos de ejecución:**
1. Activar Cloud.
2. Crear migración con todas las tablas, enum `app_role`, función `has_role()`, trigger `handle_new_user()`, y políticas RLS.
3. Refactor `UserContext` + crear `useAuth`.
4. Refactor `Login.tsx` con email/password + Google + selección de rol.
5. Crear `ProtectedRoute` y envolver rutas de `/planner`, `/client`, `/vendor`.
6. Migrar `EntitiesContext` → hooks de TanStack Query (uno por entidad).
7. Migrar `InterviewsContext` → hooks.
8. Verificar build + flujos clave (signup planner → crear boda → ver en dashboard).

## Pregunta antes de implementar

Esto es un cambio grande (≈15-20 archivos nuevos/modificados, migración SQL extensa). ¿Procedo con todo el alcance, o prefieres dividirlo en fases? Por ejemplo:

- **Fase A**: Solo Cloud + Auth real (mantener datos mock).
- **Fase B**: Migrar entidades del Planner (weddings, clients, vendors, tasks, budget).
- **Fase C**: Migrar entrevistas + marketplace + reseñas.

Si no indicas lo contrario, ejecuto **Fase A** primero para validar el flujo de auth antes de tocar los datos.
