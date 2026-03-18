import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const vendors = [
  { name: "Flores y Pétalos", category: "Florista", rating: 4.9, bookings: 12, status: "Preferido" },
  { name: "Captura Momentos Fotografía", category: "Fotógrafo", rating: 4.8, bookings: 8, status: "Preferido" },
  { name: "Celebraciones Gourmet", category: "Catering", rating: 4.7, bookings: 6, status: "Activo" },
  { name: "Cuerdas Armónicas", category: "Entretenimiento", rating: 4.6, bookings: 4, status: "Activo" },
  { name: "Dulces Capas Pastelería", category: "Pastel y Postres", rating: 4.9, bookings: 10, status: "Preferido" },
  { name: "Decoración Elegante", category: "Decoración", rating: 4.5, bookings: 3, status: "Nuevo" },
];

export default function PlannerVendors() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
        <p className="text-muted-foreground">Tu red de proveedores</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <Card key={v.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{v.name}</h3>
                  <p className="text-sm text-muted-foreground">{v.category}</p>
                </div>
                <Badge variant={v.status === "Preferido" ? "default" : "secondary"}>{v.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-wedding-gold fill-wedding-gold" />{v.rating}</span>
                <span>{v.bookings} reservas</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
