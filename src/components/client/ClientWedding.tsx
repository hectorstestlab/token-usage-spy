import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";

const timeline = [
  { time: "2:00 PM", event: "Llegada de invitados y cóctel de bienvenida" },
  { time: "3:00 PM", event: "Comienza la ceremonia" },
  { time: "3:45 PM", event: "Hora del cóctel" },
  { time: "5:00 PM", event: "Recepción y cena" },
  { time: "7:00 PM", event: "Primer baile y discursos" },
  { time: "8:00 PM", event: "Fiesta y baile" },
  { time: "11:00 PM", event: "Despedida con bengalas" },
];

export default function ClientWedding() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Boda</h1>
        <p className="text-muted-foreground">Los detalles de tu gran día</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-semibold text-foreground">15 de Abril, 2026</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Lugar</p>
              <p className="font-semibold text-foreground">Jardín de Rosas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Invitados</p>
              <p className="font-semibold text-foreground">150 invitados · 128 confirmados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cronograma del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i < timeline.length - 1 && <div className="w-px h-8 bg-border" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.event}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{t.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
