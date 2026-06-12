import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, DollarSign, MessageCircle, Clock, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEntities, Wedding } from "@/contexts/EntitiesContext";
import DrillDownDialog from "@/components/shared/DrillDownDialog";
import { NewTaskDialog } from "@/components/shared/EntityDialogs";

type DrillKey = "weddings" | "clients" | "budget" | "messages" | "wedding-detail" | null;

const mockMessages: { from: string; preview: string; urgent: boolean; time: string }[] = [];

export default function PlannerDashboard() {
  const { weddings, clients, tasks, budget, toggleTask } = useEntities();
  const [drill, setDrill] = useState<DrillKey>(null);
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);

  const totalBudget = useMemo(
    () => budget.filter((b) => b.scope === "planner").reduce((s, c) => s + c.allocated, 0),
    [budget]
  );
  const totalSpent = useMemo(
    () => budget.filter((b) => b.scope === "planner").reduce((s, c) => s + c.spent, 0),
    [budget]
  );
  const collectedPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const stats = [
    { key: "weddings" as const, label: "Próximas Bodas", value: String(weddings.length), icon: CalendarDays, change: `${weddings.filter((w) => w.status === "Planificando").length} planificando` },
    { key: "clients" as const, label: "Clientes Activos", value: String(clients.length), icon: Users, change: `${clients.filter((c) => c.status === "Nuevo").length} nuevos` },
    { key: "budget" as const, label: "Presupuesto Total", value: `$${totalBudget.toLocaleString()}`, icon: DollarSign, change: `${collectedPct}% gastado` },
    { key: "messages" as const, label: "Mensajes Sin Leer", value: String(mockMessages.filter((m) => m.urgent).length), icon: MessageCircle, change: `${mockMessages.filter((m) => m.urgent).length} urgentes` },
  ];

  const openWedding = (w: Wedding) => {
    setSelectedWedding(w);
    setDrill("wedding-detail");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel</h1>
          <p className="text-muted-foreground">¡Bienvenido de vuelta! Aquí tienes tu resumen.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/planner/analytics">Ver métricas</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button key={s.label} onClick={() => setDrill(s.key)} className="text-left">
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Próximas Bodas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weddings.slice(0, 4).map((w) => (
              <button key={w.id} onClick={() => openWedding(w)} className="w-full text-left">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{w.couple}</div>
                    <div className="text-sm text-muted-foreground">{w.date} · {w.venue}</div>
                  </div>
                  <Badge variant={w.status === "Requiere Atención" ? "destructive" : "secondary"} className="shrink-0">
                    {w.status}
                  </Badge>
                  <div className="w-24 shrink-0 hidden sm:block">
                    <Progress value={w.progress} className="h-2" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Tareas Pendientes</CardTitle>
            <NewTaskDialog trigger={<Button size="sm" variant="outline">Nueva</Button>} />
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((t) => (
              <button key={t.id} onClick={() => toggleTask(t.id)} className="w-full text-left flex items-start gap-3 p-2 rounded hover:bg-muted/40 transition-colors">
                <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${t.urgent ? "text-destructive" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.text}</p>
                  <p className={`text-xs ${t.urgent && !t.done ? "text-destructive" : "text-muted-foreground"}`}>{t.due}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Drill-down: Próximas Bodas */}
      <DrillDownDialog
        open={drill === "weddings"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Todas las Bodas"
        description={`${weddings.length} bodas en total`}
        primaryHref="/planner/weddings"
        primaryLabel="Ver calendario"
      >
        <div className="space-y-2">
          {weddings.map((w) => (
            <button
              key={w.id}
              onClick={() => openWedding(w)}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{w.couple}</p>
                <p className="text-xs text-muted-foreground">{w.date} · {w.venue}</p>
              </div>
              <Badge variant={w.status === "Requiere Atención" ? "destructive" : "secondary"}>{w.status}</Badge>
            </button>
          ))}
        </div>
      </DrillDownDialog>

      {/* Drill-down: Clientes */}
      <DrillDownDialog
        open={drill === "clients"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Clientes Activos"
        description={`${clients.length} clientes en cartera`}
        primaryHref="/planner/clients"
        primaryLabel="Ver todos"
      >
        <div className="space-y-2">
          {clients.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.wedding}</p>
              </div>
              <Badge variant="secondary">{c.status}</Badge>
            </div>
          ))}
        </div>
      </DrillDownDialog>

      {/* Drill-down: Presupuesto */}
      <DrillDownDialog
        open={drill === "budget"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Resumen de Presupuesto"
        description={`${collectedPct}% del presupuesto utilizado`}
        primaryHref="/planner/budget"
        primaryLabel="Ver detalle"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-foreground">${totalBudget.toLocaleString()}</p></div>
            <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Gastado</p><p className="font-bold text-foreground">${totalSpent.toLocaleString()}</p></div>
            <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Restante</p><p className="font-bold text-primary">${(totalBudget - totalSpent).toLocaleString()}</p></div>
          </div>
          {budget.filter((b) => b.scope === "planner").map((c) => {
            const pct = c.allocated > 0 ? Math.round((c.spent / c.allocated) * 100) : 0;
            return (
              <div key={c.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{c.name}</span>
                  <span className="text-muted-foreground">${c.spent.toLocaleString()} / ${c.allocated.toLocaleString()}</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            );
          })}
        </div>
      </DrillDownDialog>

      {/* Drill-down: Mensajes */}
      <DrillDownDialog
        open={drill === "messages"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Mensajes Sin Leer"
        primaryHref="/planner/messages"
        primaryLabel="Abrir mensajes"
      >
        <div className="space-y-2">
          {mockMessages.map((m, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <MessageCircle className={`h-4 w-4 ${m.urgent ? "text-destructive" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{m.from}</p>
                <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
              </div>
              <span className="text-xs text-muted-foreground">{m.time}</span>
            </div>
          ))}
        </div>
      </DrillDownDialog>

      {/* Drill-down: Wedding detail */}
      <DrillDownDialog
        open={drill === "wedding-detail"}
        onOpenChange={(o) => !o && setDrill(null)}
        title={selectedWedding?.couple ?? ""}
        description={selectedWedding?.date}
        primaryHref="/planner/weddings"
        primaryLabel="Ver todas las bodas"
      >
        {selectedWedding && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/40 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Lugar</p><p className="text-sm font-medium text-foreground">{selectedWedding.venue}</p></div>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Invitados</p><p className="text-sm font-medium text-foreground">{selectedWedding.guests}</p></div>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Presupuesto</p><p className="text-sm font-medium text-foreground">{selectedWedding.budget}</p></div>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Estado</p><Badge variant={selectedWedding.status === "Requiere Atención" ? "destructive" : "secondary"}>{selectedWedding.status}</Badge></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-foreground font-medium">Progreso de planificación</span>
                <span className="text-muted-foreground">{selectedWedding.progress}%</span>
              </div>
              <Progress value={selectedWedding.progress} className="h-2" />
            </div>
          </div>
        )}
      </DrillDownDialog>
    </div>
  );
}
