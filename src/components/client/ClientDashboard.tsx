import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, DollarSign, Heart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { mockApprovalRequests } from "@/data/paymentApprovalsData";

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

export default function ClientDashboard() {
  const pendingApprovals = mockApprovalRequests.filter((r) => r.status === "pendiente");

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
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-4xl font-bold text-foreground">{daysUntilWedding}</p>
            <p className="text-sm text-muted-foreground">¡días para el gran día!</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Progreso del Checklist</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{checklistDone}/{checklistTotal}</p>
            <Progress value={(checklistDone / checklistTotal) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Presupuesto Usado</span>
            </div>
            <p className="text-2xl font-bold text-foreground">$32,400</p>
            <p className="text-xs text-muted-foreground">de $45,000 de presupuesto</p>
          </CardContent>
        </Card>
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
    </div>
  );
}
