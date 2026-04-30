# Panel de Métricas de Negocio — Wedding Planner

## Resumen

Crear una nueva página `/planner/analytics` con un panel de métricas que ayude al planner a medir el éxito de su negocio: ingresos, conversión, eficiencia operativa, satisfacción y crecimiento. Usa los datos del `EntitiesContext` (bodas, clientes, presupuesto, tareas) más datos derivados/simulados (ingresos mensuales, fuentes de clientes, NPS).

## Nuevos archivos

### 1. `src/components/planner/PlannerAnalytics.tsx`
Página principal del panel. Estructura:

- **Header**: Título "Métricas del Negocio" + selector de rango temporal (Tabs: 30d / 90d / Año / Todo).

- **KPIs principales (4 tarjetas)** — patrón visual igual a `PlannerDashboard`:
  - Ingresos totales (suma de `budget` planner-scope) + variación %.
  - Bodas activas + completadas en el periodo.
  - Ticket promedio por boda (ingresos / nº bodas).
  - Tasa de conversión clientes nuevos → activos (de `clients`).

- **Gráficos (recharts vía `@/components/ui/chart`)**:
  1. **Ingresos por mes** — `BarChart` últimos 6 meses (datos derivados de `weddings` por `dateObj` + valor `budget`).
  2. **Bodas por estado** — `PieChart` (Planificando / En Curso / Requiere Atención / Completado).
  3. **Distribución de presupuesto por categoría** — `BarChart` horizontal (top 6 categorías scope planner).
  4. **Origen de clientes** — `PieChart` con datos mock (Referidos, Marketplace, Redes, Web).

- **Sección operativa (2 columnas)**:
  - **Productividad**: % tareas completadas, tareas urgentes pendientes, progreso promedio de bodas.
  - **Top proveedores**: ranking por `bookings` y `rating` desde `vendors`.

- **Indicadores de salud**:
  - Satisfacción del cliente (NPS simulado, valor estático con `Progress`).
  - Margen estimado (gastado vs asignado).
  - Bodas en riesgo (`status === "Requiere Atención"`).

Todas las tarjetas usan `Card` + `CardHeader/CardContent`. Los KPIs son clickeables y abren un `DrillDownDialog` con el desglose (reutilizando el componente existente).

### 2. `src/lib/analyticsHelpers.ts`
Funciones puras:
- `parseBudgetString(s)` → number (limpia `$` y comas).
- `revenueByMonth(weddings)` → `{ month, revenue }[]`.
- `weddingsByStatus(weddings)` → `{ status, count }[]`.
- `taskCompletionRate(tasks)` → number.
- `averageProgress(weddings)` → number.

## Archivos a editar

### 3. `src/layouts/DashboardLayout.tsx`
Agregar entrada en `plannerNav`:
```ts
{ title: "Métricas", url: "/planner/analytics", icon: BarChart3 }
```
(insertada entre "Panel" y "Bodas"; importar `BarChart3` de lucide).

### 4. `src/App.tsx`
Importar `PlannerAnalytics` y registrar la ruta dentro del bloque planner:
```tsx
<Route path="analytics" element={<PlannerAnalytics />} />
```

### 5. `src/components/planner/PlannerDashboard.tsx`
Pequeño CTA en el header del Panel: botón secundario "Ver métricas" → `/planner/analytics`, para descubrir la sección.

## Detalles técnicos

- Gráficos con `recharts` envueltos en `ChartContainer` (`src/components/ui/chart.tsx`) — hsl tokens del tema (`--primary`, `--secondary`, `--accent`, `--muted-foreground`).
- Sin nuevas dependencias.
- Sin backend: todo se calcula con `useMemo` desde `useEntities()`. Los datasets que no existen (NPS, fuentes de clientes, ingresos históricos previos al periodo) se simulan localmente con valores plausibles.
- Todo el copy en español, paleta wedding (rose/gold/blush/sage) ya configurada.
- Diseño responsive: KPIs `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`; gráficos `grid-cols-1 lg:grid-cols-2`.

## Flujo de usuario

```text
Sidebar → Métricas
  → KPIs (clic → drill-down con desglose)
  → Gráficos de ingresos, estados, presupuesto, fuentes
  → Productividad + Top proveedores
  → Indicadores de salud del negocio
```
