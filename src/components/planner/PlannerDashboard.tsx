import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Users, DollarSign, MessageCircle, Clock } from "lucide-react";

const stats = [
  { label: "Próximas Bodas", value: "8", icon: CalendarDays, change: "+2 este mes" },
  { label: "Clientes Activos", value: "14", icon: Users, change: "3 pendientes" },
  { label: "Presupuesto Total", value: "$284,500", icon: DollarSign, change: "92% cobrado" },
  { label: "Mensajes Sin Leer", value: "5", icon: MessageCircle, change: "2 urgentes" },
];

const upcomingWeddings = [
  { couple: "Sara y Miguel", date: "15 Abr, 2026", venue: "Jardín de Rosas", status: "En Curso", progress: 78 },
  { couple: "Emma y Jaime", date: "22 May, 2026", venue: "Hacienda del Lago", status: "Requiere Atención", progress: 45 },
  { couple: "Olivia y David", date: "10 Jun, 2026", venue: "Gran Salón", status: "En Curso", progress: 62 },
  { couple: "Sofía y Liam", date: "4 Jul, 2026", venue: "Pabellón de Playa", status: "Planificando", progress: 20 },
];

const tasks = [
  { text: "Confirmar florista para Sara y Miguel", due: "Hoy", urgent: true },
  { text: "Enviar contrato a Emma y Jaime", due: "Mañana", urgent: false },
  { text: "Revisar opciones de menú de catering", due: "20 Mar", urgent: false },
  { text: "Recorrido final — Jardín de Rosas", due: "25 Mar", urgent: false },
];

export default function PlannerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel</h1>
        <p className="text-muted-foreground">¡Bienvenido de vuelta! Aquí tienes tu resumen.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Próximas Bodas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingWeddings.map((w) => (
              <div key={w.couple} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{w.couple}</div>
                  <div className="text-sm text-muted-foreground">{w.date} · {w.venue}</div>
                </div>
                <Badge variant={w.status === "Requiere Atención" ? "destructive" : "secondary"} className="shrink-0">
                  {w.status}
                </Badge>
                <div className="w-24 shrink-0">
                  <Progress value={w.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((t) => (
              <div key={t.text} className="flex items-start gap-3 p-2">
                <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${t.urgent ? "text-destructive" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-sm text-foreground">{t.text}</p>
                  <p className={`text-xs ${t.urgent ? "text-destructive" : "text-muted-foreground"}`}>{t.due}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
