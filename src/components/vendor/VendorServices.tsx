import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntities } from "@/contexts/EntitiesContext";
import { NewServiceDialog } from "@/components/shared/EntityDialogs";

export default function VendorServices() {
  const { services } = useEntities();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Servicios</h1>
          <p className="text-muted-foreground">Gestiona tus ofertas de servicios</p>
        </div>
        <NewServiceDialog />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <Badge variant={s.active ? "default" : "secondary"}>{s.active ? "Activo" : "Inactivo"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{s.description}</p>
              <p className="text-lg font-bold text-foreground">{s.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
