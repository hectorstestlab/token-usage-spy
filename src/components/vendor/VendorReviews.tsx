import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useUser } from "@/contexts/UserContext";

export default function VendorReviews() {
  const { reviews } = useMarketplace();
  const { userName } = useUser();

  // For demo: show all reviews — in a real backend we'd filter by vendorId == current user
  const myReviews = reviews;

  const summary = useMemo(() => {
    if (myReviews.length === 0) return { avg: 0, total: 0 };
    const avg = myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length;
    return { avg: Math.round(avg * 10) / 10, total: myReviews.length };
  }, [myReviews]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reseñas</h1>
        <p className="text-muted-foreground">Lo que dicen tus clientes y planners</p>
      </div>

      <Card>
        <CardContent className="p-5 flex items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Calificación</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-foreground">{summary.avg.toFixed(1)}</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < Math.round(summary.avg) ? "text-wedding-gold fill-wedding-gold" : "text-muted-foreground/20"}`} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
            <p className="text-3xl font-bold text-foreground mt-1">{summary.total}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {myReviews.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Aún no tienes reseñas.</p>
        )}
        {myReviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{r.authorName}</span>
                  <Badge variant="outline" className="text-[10px]">{r.authorRole === "planner" ? "Planner" : "Cliente"}</Badge>
                </div>
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
