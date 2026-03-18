import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const services = [
  { name: "Wedding Day Photography", description: "Full-day coverage up to 10 hours", price: "$3,200", active: true },
  { name: "Engagement Session", description: "1-hour session at location of choice", price: "$800", active: true },
  { name: "Elopement Package", description: "2-hour intimate ceremony coverage", price: "$1,500", active: true },
  { name: "Photo Booth Add-On", description: "Custom backdrop, props, unlimited prints", price: "$600", active: false },
];

export default function VendorServices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Button>Add Service</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.name}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <Badge variant={s.active ? "default" : "secondary"}>{s.active ? "Active" : "Inactive"}</Badge>
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
