import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const weddings = [
  { couple: "Sara y Miguel", date: "15 Abr, 2026", venue: "Jardín de Rosas", guests: 150, status: "En Curso", budget: "$45,000" },
  { couple: "Emma y Jaime", date: "22 May, 2026", venue: "Hacienda del Lago", guests: 200, status: "Requiere Atención", budget: "$62,000" },
  { couple: "Olivia y David", date: "10 Jun, 2026", venue: "Gran Salón", guests: 120, status: "En Curso", budget: "$38,000" },
  { couple: "Sofía y Liam", date: "4 Jul, 2026", venue: "Pabellón de Playa", guests: 80, status: "Planificando", budget: "$28,000" },
  { couple: "Ava y Noah", date: "20 Ago, 2026", venue: "Cabaña de Montaña", guests: 100, status: "Planificando", budget: "$35,000" },
];

export default function PlannerWeddings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bodas</h1>
          <p className="text-muted-foreground">Gestiona todas tus próximas bodas</p>
        </div>
        <Badge variant="secondary">{weddings.length} en total</Badge>
      </div>
      <div className="grid gap-4">
        {weddings.map((w) => (
          <Card key={w.couple} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{w.couple}</h3>
                <p className="text-sm text-muted-foreground">{w.date} · {w.venue}</p>
              </div>
              <div className="text-sm text-muted-foreground hidden md:block">{w.guests} invitados</div>
              <div className="text-sm font-medium text-foreground hidden md:block">{w.budget}</div>
              <Badge variant={w.status === "Requiere Atención" ? "destructive" : "secondary"}>{w.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
