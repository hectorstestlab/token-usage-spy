import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const bookings = [
  { client: "Sara y Miguel", date: "15 Abr, 2026", venue: "Jardín de Rosas", status: "Confirmado", amount: "$3,200" },
  { client: "Emma y Jaime", date: "22 May, 2026", venue: "Hacienda del Lago", status: "Confirmado", amount: "$4,500" },
  { client: "Olivia y David", date: "10 Jun, 2026", venue: "Gran Salón", status: "Pendiente", amount: "$2,800" },
  { client: "Evento Corporativo", date: "28 Mar, 2026", venue: "Centro de Conferencias", status: "Confirmado", amount: "$1,500" },
  { client: "Sofía y Liam", date: "4 Jul, 2026", venue: "Pabellón de Playa", status: "Consulta", amount: "Por definir" },
];

export default function VendorBookings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
        <p className="text-muted-foreground">Todas tus reservas confirmadas y pendientes</p>
      </div>
      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b.client + b.date} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{b.client}</h3>
                <p className="text-sm text-muted-foreground">{b.date} · {b.venue}</p>
              </div>
              <span className="text-sm font-medium text-foreground">{b.amount}</span>
              <Badge variant={b.status === "Consulta" ? "outline" : b.status === "Pendiente" ? "secondary" : "default"}>{b.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
