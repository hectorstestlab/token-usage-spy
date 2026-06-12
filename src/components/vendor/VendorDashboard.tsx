import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, DollarSign, Users, TrendingUp, ChevronRight } from "lucide-react";
import { useEntities } from "@/contexts/EntitiesContext";
import DrillDownDialog from "@/components/shared/DrillDownDialog";
import { JoinWeddingDialog } from "@/components/shared/EntityDialogs";

type DrillKey = "bookings" | "revenue" | "inquiries" | "rating" | "booking-detail" | null;

const monthlyRevenue = [
  { month: "Ene", amount: 8200 },
  { month: "Feb", amount: 10500 },
  { month: "Mar", amount: 12400 },
];

export default function VendorDashboard() {
  const { bookings } = useEntities();
  const [drill, setDrill] = useState<DrillKey>(null);
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[number] | null>(null);

  const upcoming = bookings.filter((b) => b.status !== "Consulta");
  const inquiries = bookings.filter((b) => b.status === "Consulta");
  const totalRevenue = useMemo(
    () => bookings.reduce((s, b) => s + (parseInt(b.amount.replace(/[^\d]/g, "")) || 0), 0),
    [bookings]
  );

  const stats = [
    { key: "bookings" as const, label: "Próximas Reservas", value: String(upcoming.length), icon: CalendarCheck, sub: `Próxima: ${upcoming[0]?.date ?? "—"}` },
    { key: "revenue" as const, label: "Ingresos Mensuales", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, sub: "+18% vs mes anterior" },
    { key: "inquiries" as const, label: "Nuevas Consultas", value: String(inquiries.length), icon: Users, sub: `${inquiries.length} pendiente(s)` },
    { key: "rating" as const, label: "Calificación Promedio", value: "4.8", icon: TrendingUp, sub: "Basado en 47 reseñas" },
  ];

  const reviews = [
    { client: "Sara y Miguel", rating: 5, text: "¡Increíbles! Capturaron cada momento." },
    { client: "Emma y Jaime", rating: 5, text: "Profesionales y muy creativos." },
    { client: "Olivia y David", rating: 4, text: "Excelente servicio, recomendados." },
  ];

  const openBooking = (b: typeof bookings[number]) => {
    setSelectedBooking(b);
    setDrill("booking-detail");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel del Proveedor</h1>
        <p className="text-muted-foreground">Tu negocio de un vistazo</p>
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
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Reservas Recientes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {bookings.slice(0, 5).map((b) => (
            <button key={b.id} onClick={() => openBooking(b)} className="w-full text-left">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{b.client}</p>
                  <p className="text-sm text-muted-foreground">{b.date} · {b.venue}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{b.amount}</span>
                <Badge variant={b.status === "Pendiente" ? "secondary" : b.status === "Consulta" ? "outline" : "default"}>{b.status}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <DrillDownDialog
        open={drill === "bookings"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Próximas Reservas"
        description={`${upcoming.length} reservas activas`}
        primaryHref="/vendor/bookings"
        primaryLabel="Ver todas"
      >
        <div className="space-y-2">
          {upcoming.map((b) => (
            <button key={b.id} onClick={() => openBooking(b)} className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{b.client}</p>
                <p className="text-xs text-muted-foreground">{b.date} · {b.venue}</p>
              </div>
              <span className="text-sm font-medium text-foreground">{b.amount}</span>
              <Badge variant={b.status === "Pendiente" ? "secondary" : "default"}>{b.status}</Badge>
            </button>
          ))}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "revenue"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Ingresos"
        description={`$${totalRevenue.toLocaleString()} totales en reservas`}
        primaryHref="/vendor/payments"
        primaryLabel="Ver pagos"
      >
        <div className="space-y-2">
          {monthlyRevenue.map((m) => (
            <div key={m.month} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-foreground font-medium">{m.month}</span>
              <span className="text-foreground font-bold">${m.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "inquiries"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Consultas Nuevas"
        description={`${inquiries.length} consultas por responder`}
        primaryHref="/vendor/messages"
        primaryLabel="Abrir mensajes"
      >
        <div className="space-y-2">
          {inquiries.map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{b.client}</p>
                <p className="text-xs text-muted-foreground">{b.date} · {b.venue}</p>
              </div>
              <Badge variant="outline">Consulta</Badge>
            </div>
          ))}
          {inquiries.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Sin consultas pendientes</p>}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "rating"}
        onOpenChange={(o) => !o && setDrill(null)}
        title="Reseñas Recientes"
        description="Calificación promedio: 4.8 ⭐"
        primaryHref="/vendor/reviews"
        primaryLabel="Ver todas las reseñas"
      >
        <div className="space-y-2">
          {reviews.map((r, i) => (
            <div key={i} className="p-3 rounded-lg border border-border space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground text-sm">{r.client}</p>
                <span className="text-sm">{"⭐".repeat(r.rating)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </DrillDownDialog>

      <DrillDownDialog
        open={drill === "booking-detail"}
        onOpenChange={(o) => !o && setDrill(null)}
        title={selectedBooking?.client ?? ""}
        description={selectedBooking?.date}
        primaryHref="/vendor/bookings"
        primaryLabel="Ver todas"
      >
        {selectedBooking && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Lugar</p><p className="text-sm font-medium text-foreground">{selectedBooking.venue}</p></div>
              <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Monto</p><p className="text-sm font-medium text-foreground">{selectedBooking.amount}</p></div>
              <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Estado</p><Badge>{selectedBooking.status}</Badge></div>
              <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Fecha</p><p className="text-sm font-medium text-foreground">{selectedBooking.date}</p></div>
            </div>
          </div>
        )}
      </DrillDownDialog>
    </div>
  );
}
