import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const services = [
  { name: "Fotografía de Boda", description: "Cobertura completa del día hasta 10 horas", price: "$3,200", active: true },
  { name: "Sesión de Compromiso", description: "Sesión de 1 hora en ubicación a elegir", price: "$800", active: true },
  { name: "Paquete Elopement", description: "Cobertura de ceremonia íntima de 2 horas", price: "$1,500", active: true },
  { name: "Photo Booth Adicional", description: "Fondo personalizado, accesorios, impresiones ilimitadas", price: "$600", active: false },
];

export default function VendorServices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Servicios</h1>
          <p className="text-muted-foreground">Gestiona tus ofertas de servicios</p>
        </div>
        <Button>Agregar Servicio</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.name}>
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
