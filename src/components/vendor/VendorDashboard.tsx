import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, DollarSign, Users, TrendingUp } from "lucide-react";

const stats = [
  { label: "Próximas Reservas", value: "6", icon: CalendarCheck, sub: "Próxima: 22 Mar" },
  { label: "Ingresos Mensuales", value: "$12,400", icon: DollarSign, sub: "+18% vs mes anterior" },
  { label: "Nuevas Consultas", value: "4", icon: Users, sub: "2 pendientes de respuesta" },
  { label: "Calificación Promedio", value: "4.8", icon: TrendingUp, sub: "Basado en 47 reseñas" },
];

const bookings = [
  { client: "Sara y Miguel", date: "15 Abr, 2026", type: "Boda", status: "Confirmado", amount: "$3,200" },
  { client: "Emma y Jaime", date: "22 May, 2026", type: "Boda", status: "Confirmado", amount: "$4,500" },
  { client: "Olivia y David", date: "10 Jun, 2026", type: "Boda", status: "Pendiente", amount: "$2,800" },
  { client: "Evento Corporativo", date: "28 Mar, 2026", type: "Evento", status: "Confirmado", amount: "$1,500" },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel del Proveedor</h1>
        <p className="text-muted-foreground">Tu negocio de un vistazo</p>
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
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Reservas Recientes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {bookings.map((b) => (
            <div key={b.client + b.date} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">{b.client}</p>
                <p className="text-sm text-muted-foreground">{b.date} · {b.type}</p>
              </div>
              <span className="text-sm font-medium text-foreground">{b.amount}</span>
              <Badge variant={b.status === "Pendiente" ? "secondary" : "default"}>{b.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
