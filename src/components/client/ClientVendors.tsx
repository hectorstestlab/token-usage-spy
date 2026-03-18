import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const booked = [
  { name: "Bloom & Petal Florists", category: "Florist", rating: 4.9, price: "$3,200", status: "Confirmed" },
  { name: "Capture Moments Photography", category: "Photographer", rating: 4.8, price: "$5,500", status: "Confirmed" },
  { name: "Gourmet Celebrations", category: "Caterer", rating: 4.7, price: "$12,000", status: "Deposit Paid" },
];

const marketplace = [
  { name: "Harmony Strings Band", category: "Entertainment", rating: 4.6, price: "From $2,000" },
  { name: "Sweet Layers Bakery", category: "Cake & Desserts", rating: 4.9, price: "From $800" },
  { name: "Elegant Drapes & Décor", category: "Décor", rating: 4.5, price: "From $1,500" },
  { name: "Luxe Limousine", category: "Transportation", rating: 4.4, price: "From $600" },
];

export default function ClientVendors() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
        <p className="text-muted-foreground">Your booked vendors and marketplace</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Booked Vendors</h2>
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
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse Marketplace</h2>
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
