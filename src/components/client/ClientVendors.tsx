import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const booked = [
  { name: "Flores y Pétalos", category: "Florista", rating: 4.9, price: "$3,200", status: "Confirmado" },
  { name: "Captura Momentos Fotografía", category: "Fotógrafo", rating: 4.8, price: "$5,500", status: "Confirmado" },
  { name: "Celebraciones Gourmet", category: "Catering", rating: 4.7, price: "$12,000", status: "Depósito Pagado" },
];

const marketplace = [
  { name: "Cuerdas Armónicas", category: "Entretenimiento", rating: 4.6, price: "Desde $2,000" },
  { name: "Dulces Capas Pastelería", category: "Pastel y Postres", rating: 4.9, price: "Desde $800" },
  { name: "Decoración Elegante", category: "Decoración", rating: 4.5, price: "Desde $1,500" },
  { name: "Limusinas de Lujo", category: "Transporte", rating: 4.4, price: "Desde $600" },
];

export default function ClientVendors() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
        <p className="text-muted-foreground">Tus proveedores reservados y marketplace</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Proveedores Reservados</h2>
        <div className="grid gap-4">
          {booked.map((v) => (
            <Card key={v.name}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{v.name}</h3>
                  <p className="text-sm text-muted-foreground">{v.category}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{v.price}</span>
                <Badge>{v.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Explorar Marketplace</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {marketplace.map((v) => (
            <Card key={v.name} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-foreground">{v.name}</h3>
                <p className="text-sm text-muted-foreground">{v.category}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 text-wedding-gold fill-wedding-gold" />{v.rating}</span>
                  <span className="text-sm text-muted-foreground">{v.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
