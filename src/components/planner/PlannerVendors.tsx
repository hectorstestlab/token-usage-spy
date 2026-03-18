import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const vendors = [
  { name: "Bloom & Petal Florists", category: "Florist", rating: 4.9, bookings: 12, status: "Preferred" },
  { name: "Capture Moments Photography", category: "Photographer", rating: 4.8, bookings: 8, status: "Preferred" },
  { name: "Gourmet Celebrations Catering", category: "Caterer", rating: 4.7, bookings: 6, status: "Active" },
  { name: "Harmony Strings Band", category: "Entertainment", rating: 4.6, bookings: 4, status: "Active" },
  { name: "Sweet Layers Bakery", category: "Cake & Desserts", rating: 4.9, bookings: 10, status: "Preferred" },
  { name: "Elegant Drapes & Décor", category: "Décor", rating: 4.5, bookings: 3, status: "New" },
];

export default function PlannerVendors() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
        <p className="text-muted-foreground">Your vendor network</p>
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
                <Badge variant={v.status === "Preferred" ? "default" : "secondary"}>{v.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-wedding-gold fill-wedding-gold" />{v.rating}</span>
                <span>{v.bookings} bookings</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
