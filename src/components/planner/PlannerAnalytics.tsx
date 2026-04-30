import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Users,
  Smile,
  AlertTriangle,
  Percent,
  Star,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useEntities } from "@/contexts/EntitiesContext";
import {
  averageProgress,
  budgetByCategory,
  parseBudgetString,
  revenueByMonth,
  taskCompletionRate,
  weddingsByStatus,
} from "@/lib/analyticsHelpers";
import DrillDownDialog from "@/components/shared/DrillDownDialog";

type Range = "30d" | "90d" | "year" | "all";
type DrillKey = "revenue" | "weddings" | "ticket" | "conversion" | null;

const STATUS_COLORS: Record<string, string> = {
  Planificando: "hsl(var(--chart-1))",
  "En Curso": "hsl(var(--chart-2))",
  "Requiere Atención": "hsl(var(--destructive))",
  Completado: "hsl(var(--chart-4))",
};

const SOURCE_DATA = [
  { source: "Referidos", value: 42 },
  { source: "Marketplace", value: 28 },
  { source: "Redes Sociales", value: 18 },
  { source: "Web Orgánico", value: 12 },
];
const SOURCE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-5))",
];

export default function PlannerAnalytics() {
  const { weddings, clients, vendors, tasks, budget } = useEntities();
  const [range, setRange] = useState<Range>("90d");
  const [drill, setDrill] = useState<DrillKey>(null);

  const totalRevenue = useMemo(
    () => weddings.reduce((s, w) => s + parseBudgetString(w.budget), 0),
    [weddings]
  );
  const completedCount = weddings.filter((w) => w.status === "Completado").length;
  const activeCount = weddings.filter((w) => w.status !== "Completado").length;
  const avgTicket = weddings.length ? Math.round(totalRevenue / weddings.length) : 0;
  const conversion = clients.length
    ? Math.round((clients.filter((c) => c.status === "Activo").length / clients.length) * 100)
    : 0;

  const revenueData = useMemo(() => revenueByMonth(weddings, 6), [weddings]);
  const statusData = useMemo(() => weddingsByStatus(weddings), [weddings]);
  const categoryData = useMemo(() => budgetByCategory(budget), [budget]);

  const taskRate = taskCompletionRate(tasks);
  const urgentPending = tasks.filter((t) => t.urgent && !t.done).length;
  const avgProgress = averageProgress(weddings);

  const totalAllocated = budget.filter((b) => b.scope === "planner").reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budget.filter((b) => b.scope === "planner").reduce((s, b) => s + b.spent, 0);
  const marginPct = totalAllocated ? Math.round(((totalAllocated - totalSpent) / totalAllocated) * 100) : 0;
  const atRisk = weddings.filter((w) => w.status === "Requiere Atención");

  const topVendors = [...vendors].sort((a, b) => b.bookings - a.bookings).slice(0, 5);

  const kpis = [
    {
      key: "revenue" as const,
      label: "Ingresos Totales",
      value: `$${totalRevenue.toLocaleString()}`,
      delta: "+12% vs periodo anterior",
      icon: DollarSign,
    },
    {
      key: "weddings" as const,
      label: "Bodas Gestionadas",
      value: String(weddings.length),
      delta: `${activeCount} activas · ${completedCount} completadas`,
      icon: CalendarCheck,
    },
    {
      key: "ticket" as const,
      label: "Ticket Promedio",
      value: `$${avgTicket.toLocaleString()}`,
      delta: "+5% últimos 90 días",
      icon: TrendingUp,
    },
    {
      key: "conversion" as const,
      label: "Conversión Clientes",
      value: `${conversion}%`,
      delta: `${clients.length} clientes en cartera`,
      icon: Users,
    },
  ];

  const revenueConfig: ChartConfig = {
    revenue: { label: "Ingresos", color: "hsl(var(--primary))" },
  };
  const statusConfig: ChartConfig = statusData.reduce((acc, s) => {
    acc[s.status] = { label: s.status, color: STATUS_COLORS[s.status] ?? "hsl(var(--muted))" };
    return acc;
  }, {} as ChartConfig);
  const categoryConfig: ChartConfig = {
    allocated: { label: "Asignado", color: "hsl(var(--muted-foreground))" },
    spent: { label: "Gastado", color: "hsl(var(--primary))" },
  };
  const sourceConfig: ChartConfig = SOURCE_DATA.reduce((acc, s, i) => {
    acc[s.source] = { label: s.source, color: SOURCE_COLORS[i] };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Métricas del Negocio</h1>
          <p className="text-muted-foreground">Mide el rendimiento y la salud de tu operación.</p>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
          <TabsList>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
            <TabsTrigger value="year">Año</TabsTrigger>
            <TabsTrigger value="all">Todo</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <button key={k.key} onClick={() => setDrill(k.key)} className="text-left">
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{k.label}</span>
                  <k.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">{k.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{k.delta}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-[260px] w-full">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bodas por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusConfig} className="h-[260px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {statusData.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? "hsl(var(--muted))"} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="status" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presupuesto por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="h-[260px] w-full">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="allocated" fill="var(--color-allocated)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="spent" fill="var(--color-spent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origen de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sourceConfig} className="h-[260px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="source" />} />
                <Pie data={SOURCE_DATA} dataKey="value" nameKey="source" outerRadius={90}>
                  {SOURCE_DATA.map((s, i) => (
                    <Cell key={s.source} fill={SOURCE_COLORS[i]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="source" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Operativa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productividad Operativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-foreground font-medium">Tareas completadas</span>
                <span className="text-muted-foreground">{taskRate}%</span>
              </div>
              <Progress value={taskRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-foreground font-medium">Progreso promedio de bodas</span>
                <span className="text-muted-foreground">{avgProgress}%</span>
              </div>
              <Progress value={avgProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-muted/40">
                <p className="text-xs text-muted-foreground">Tareas urgentes</p>
                <p className="text-xl font-bold text-destructive">{urgentPending}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40">
                <p className="text-xs text-muted-foreground">Tareas totales</p>
                <p className="text-xl font-bold text-foreground">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Proveedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topVendors.map((v, i) => (
              <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.category}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {v.rating}
                </div>
                <Badge variant="secondary" className="shrink-0">{v.bookings} reservas</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Salud del negocio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Satisfacción (NPS)</span>
              <Smile className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">72</p>
            <Progress value={86} className="h-1.5" />
            <p className="text-xs text-muted-foreground">Excelente · sobre 89 reseñas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Margen Estimado</span>
              <Percent className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{marginPct}%</p>
            <Progress value={Math.max(0, marginPct)} className="h-1.5" />
            <p className="text-xs text-muted-foreground">${(totalAllocated - totalSpent).toLocaleString()} restantes del presupuesto</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bodas en Riesgo</span>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-foreground">{atRisk.length}</p>
            <p className="text-xs text-muted-foreground">{atRisk.map((w) => w.couple).join(", ") || "Ninguna boda en alerta"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Drill-downs */}
      <DrillDownDialog
        open={drill === "revenue"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Ingresos por Boda"
        description={`Total: $${totalRevenue.toLocaleString()}`}
      >
        <div className="space-y-2">
          {weddings.map((w) => (
            <div key={w.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{w.couple}</p>
                <p className="text-xs text-muted-foreground">{w.date}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">{w.budget}</span>
            </div>
          ))}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "weddings"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Bodas por Estado"
        primaryHref="/planner/weddings"
        primaryLabel="Ver todas"
      >
        <div className="space-y-2">
          {statusData.map((s) => (
            <div key={s.status} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-sm text-foreground">{s.status}</span>
              <Badge variant="secondary">{s.count}</Badge>
            </div>
          ))}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "ticket"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Ticket Promedio"
        description={`Promedio actual: $${avgTicket.toLocaleString()}`}
      >
        <div className="space-y-2">
          {[...weddings].sort((a, b) => parseBudgetString(b.budget) - parseBudgetString(a.budget)).map((w) => (
            <div key={w.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-sm text-foreground">{w.couple}</span>
              <span className="text-sm font-semibold text-foreground">{w.budget}</span>
            </div>
          ))}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "conversion"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Conversión de Clientes"
        description={`${conversion}% activos`}
        primaryHref="/planner/clients"
        primaryLabel="Ver clientes"
      >
        <div className="space-y-2">
          {clients.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.wedding}</p>
              </div>
              <Badge variant="secondary">{c.status}</Badge>
            </div>
          ))}
        </div>
      </DrillDownDialog>
    </div>
  );
}
