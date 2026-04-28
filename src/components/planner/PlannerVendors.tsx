import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useEntities } from "@/contexts/EntitiesContext";
import { NewVendorDialog } from "@/components/shared/EntityDialogs";

export default function PlannerVendors() {
  const { vendors } = useEntities();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground">Tu red de proveedores</p>
        </div>
        <NewVendorDialog />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <Card key={v.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{v.name}</h3>
                  <p className="text-sm text-muted-foreground">{v.category}</p>
                </div>
                <Badge variant={v.status === "Preferido" ? "default" : "secondary"}>{v.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-wedding-gold fill-wedding-gold" />{v.rating || "—"}</span>
                <span>{v.bookings} reservas</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
