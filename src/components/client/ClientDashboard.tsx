import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Heart, AlertTriangle, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEntities } from "@/contexts/EntitiesContext";
import { useUser } from "@/contexts/UserContext";
import { JoinWeddingDialog } from "@/components/shared/EntityDialogs";

export default function ClientDashboard() {
  const { user } = useUser();
  const { weddings, budget } = useEntities();
  const [pendingCount, setPendingCount] = useState(0);

  const wedding = weddings[0];
  const clientBudget = budget.filter((b) => b.scope === "client");
  const total = clientBudget.reduce((s, c) => s + c.allocated, 0);
  const spent = clientBudget.reduce((s, c) => s + c.spent, 0);

  const fetchPending = useCallback(async () => {
    if (!user) return;
    const { count } = await supabase
      .from("payment_approval_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pendiente");
    setPendingCount(count ?? 0);
  }, [user]);
  useEffect(() => { fetchPending(); }, [fetchPending]);

  const daysUntil = wedding?.dateObj
    ? Math.max(0, Math.ceil((wedding.dateObj.getTime() - Date.now()) / 86400000))
    : null;

  if (!wedding) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Tu Boda</h1>
          <p className="text-muted-foreground">Únete a la boda creada por tu wedding planner</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="h-10 w-10 text-primary mx-auto" />
            <p className="text-muted-foreground">Pide a tu planner el código de invitación y úsalo para ver toda la información de tu boda.</p>
            <JoinWeddingDialog asRole="client" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Tu Boda</h1>
        <p className="text-muted-foreground">{wedding.couple}</p>
      </div>

      {pendingCount > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Tienes {pendingCount} solicitud(es) de pago pendiente(s)
              </p>
            </div>
            <Button size="sm" asChild><Link to="/client/approvals">Ver solicitudes</Link></Button>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-4xl font-bold text-foreground">{daysUntil ?? "—"}</p>
            <p className="text-sm text-muted-foreground">días para el gran día</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Lugar</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{wedding.venue}</p>
            <p className="text-xs text-muted-foreground mt-1">{wedding.date}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Invitados</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{wedding.guests}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Presupuesto</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {clientBudget.length === 0 && (
            <p className="text-sm text-muted-foreground">Agrega categorías de presupuesto en la sección Presupuesto.</p>
          )}
          {clientBudget.length > 0 && (
            <>
              <p className="text-sm">Gastado: <span className="font-semibold">${spent.toLocaleString()}</span> de <span className="font-semibold">${total.toLocaleString()}</span></p>
              <Progress value={total > 0 ? (spent / total) * 100 : 0} className="h-2" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
