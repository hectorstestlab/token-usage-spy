import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

interface Review {
  id: string; author_name: string; author_role: string;
  rating: number; text: string | null; created_at: string;
}

export default function VendorReviews() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("reviews")
      .select("*").eq("vendor_id", user.id).order("created_at", { ascending: false });
    setReviews((data ?? []) as any);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const summary = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, total: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, total: reviews.length };
  }, [reviews]);

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
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Aún no tienes reseñas.</p>
        )}
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{r.author_name}</span>
                  <Badge variant="outline" className="text-[10px]">{r.author_role === "planner" ? "Planner" : "Cliente"}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{r.created_at.slice(0,10)}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < r.rating ? "text-wedding-gold fill-wedding-gold" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              {r.text && <p className="text-sm text-muted-foreground">{r.text}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
