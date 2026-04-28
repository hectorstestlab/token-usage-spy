import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, DollarSign, Heart, AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mockApprovalRequests } from "@/data/paymentApprovalsData";
import { useEntities } from "@/contexts/EntitiesContext";
import DrillDownDialog from "@/components/shared/DrillDownDialog";

const daysUntilWedding = 28;
const checklistTotal = 24;
const checklistDone = 17;

const checklist = [
  { text: "Reservar lugar", done: true },
  { text: "Contratar fotógrafo", done: true },
  { text: "Elegir catering", done: true },
  { text: "Enviar invitaciones", done: true },
  { text: "Prueba final del vestido", done: false },
  { text: "Confirmar distribución de mesas", done: false },
  { text: "Reservar vuelos de luna de miel", done: false },
];

type DrillKey = "days" | "checklist" | "budget" | null;

export default function ClientDashboard() {
  const pendingApprovals = mockApprovalRequests.filter((r) => r.status === "pendiente");
  const { budget } = useEntities();
  const [drill, setDrill] = useState<DrillKey>(null);

  const clientBudget = budget.filter((b) => b.scope === "client");
  const total = clientBudget.reduce((s, c) => s + c.allocated, 0);
  const spent = clientBudget.reduce((s, c) => s + c.spent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Tu Boda</h1>
        <p className="text-muted-foreground">Todo de un vistazo</p>
      </div>

      {pendingApprovals.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Tienes {pendingApprovals.length} solicitud(es) de pago pendiente(s)
              </p>
              <p className="text-xs text-muted-foreground">Tu planner necesita tu aprobación para procesar pagos</p>
            </div>
            <Button size="sm" asChild>
              <Link to="/client/approvals">Ver solicitudes</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <button onClick={() => setDrill("days")} className="text-left">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-4xl font-bold text-foreground">{daysUntilWedding}</p>
              <p className="text-sm text-muted-foreground">¡días para el gran día!</p>
            </CardContent>
          </Card>
        </button>
        <button onClick={() => setDrill("checklist")} className="text-left">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Progreso del Checklist</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{checklistDone}/{checklistTotal}</p>
              <Progress value={(checklistDone / checklistTotal) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </button>
        <button onClick={() => setDrill("budget")} className="text-left">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Presupuesto Usado</span>
              </div>
              <p className="text-2xl font-bold text-foreground">${spent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">de ${total.toLocaleString()} de presupuesto</p>
            </CardContent>
          </Card>
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tu Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <CheckCircle2 className={`h-5 w-5 ${item.done ? "text-primary" : "text-muted-foreground/30"}`} />
              <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.text}</span>
              {item.done && <Badge variant="secondary" className="text-xs">Listo</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      <DrillDownDialog
        open={drill === "days"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Cuenta regresiva"
        description={`${daysUntilWedding} días para tu boda`}
        primaryHref="/client/wedding"
        primaryLabel="Ver detalles"
      >
        <div className="text-center py-6 space-y-2">
          <Heart className="h-12 w-12 text-primary mx-auto" />
          <p className="text-5xl font-bold text-foreground">{daysUntilWedding}</p>
          <p className="text-muted-foreground">Falta poco — ¡el gran día se acerca!</p>
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "checklist"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Progreso del Checklist"
        description={`${checklistDone} de ${checklistTotal} completados`}
      >
        <div className="space-y-2">
          {checklist.map((item) => (
            <div key={item.text} className="flex items-center gap-3 p-2 rounded border border-border">
              <CheckCircle2 className={`h-4 w-4 ${item.done ? "text-primary" : "text-muted-foreground/30"}`} />
              <span className={`text-sm flex-1 ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.text}</span>
              {item.done && <Badge variant="secondary" className="text-xs">Listo</Badge>}
            </div>
          ))}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "budget"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Presupuesto"
        description={`$${spent.toLocaleString()} gastado de $${total.toLocaleString()}`}
        primaryHref="/client/budget"
        primaryLabel="Ver detalle"
      >
        <div className="space-y-3">
          {clientBudget.map((c) => {
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
    </div>
  );
}
