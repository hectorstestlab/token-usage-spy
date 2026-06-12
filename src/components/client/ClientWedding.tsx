import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Heart } from "lucide-react";
import { useEntities } from "@/contexts/EntitiesContext";
import { JoinWeddingDialog } from "@/components/shared/EntityDialogs";

export default function ClientWedding() {
  const { weddings } = useEntities();
  const wedding = weddings[0];

  if (!wedding) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Boda</h1>
          <p className="text-muted-foreground">Aún no estás vinculada(o) a ninguna boda</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="h-10 w-10 text-primary mx-auto" />
            <p className="text-muted-foreground">Pide a tu planner el código de invitación.</p>
            <JoinWeddingDialog asRole="client" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Boda</h1>
        <p className="text-muted-foreground">{wedding.couple}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div><p className="text-sm text-muted-foreground">Fecha</p><p className="font-semibold text-foreground">{wedding.date}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <div><p className="text-sm text-muted-foreground">Lugar</p><p className="font-semibold text-foreground">{wedding.venue}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <div><p className="text-sm text-muted-foreground">Invitados</p><p className="font-semibold text-foreground">{wedding.guests}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Estado de la planificación</p>
          <p className="text-xl font-semibold text-foreground mt-1">{wedding.status}</p>
          <p className="text-xs text-muted-foreground mt-2">Progreso: {wedding.progress}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
