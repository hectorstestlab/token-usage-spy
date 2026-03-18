import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  { name: "Sarah M.", rating: 5, text: "Absolutely incredible! Every photo was a masterpiece. Could not recommend more highly.", date: "Feb 2026" },
  { name: "Emily R.", rating: 5, text: "Professional, creative, and so easy to work with. Our wedding photos are stunning.", date: "Jan 2026" },
  { name: "Jessica L.", rating: 4, text: "Great experience overall. Loved the engagement session, wedding day was flawless.", date: "Dec 2025" },
  { name: "Amanda K.", rating: 5, text: "They captured every moment perfectly. We keep looking at our album over and over!", date: "Nov 2025" },
  { name: "Rachel T.", rating: 4, text: "Beautiful work. Delivery was a bit slow but the quality made up for it.", date: "Oct 2025" },
];

export default function VendorReviews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted-foreground">What your clients are saying</p>
      </div>
      <div className="grid gap-4">
        {reviews.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < r.rating ? "text-wedding-gold fill-wedding-gold" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
