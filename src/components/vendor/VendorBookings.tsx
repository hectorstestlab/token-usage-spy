import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntities } from "@/contexts/EntitiesContext";
import { NewBookingDialog } from "@/components/shared/EntityDialogs";

export default function VendorBookings() {
  const { bookings } = useEntities();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
          <p className="text-muted-foreground">Todas tus reservas confirmadas y pendientes</p>
        </div>
        <NewBookingDialog />
      </div>
      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b.id} className="hover:shadow-md transition-shadow">
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
