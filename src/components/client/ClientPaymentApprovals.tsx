import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

interface Req {
  id: string; wedding_id: string; planner_id: string;
  service_name: string; vendor_name: string | null;
  amount: number; currency: string;
  payment_method_last4: string | null; payment_method_brand: string | null;
  status: "pendiente" | "aprobado" | "denegado";
  requested_at: string; resolved_at: string | null;
}

const statusConfig = {
  pendiente: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
  aprobado: { label: "Aprobado", variant: "default" as const, icon: CheckCircle2 },
  denegado: { label: "Denegado", variant: "destructive" as const, icon: XCircle },
};

export default function ClientPaymentApprovals() {
  const { user } = useUser();
  const [requests, setRequests] = useState<Req[]>([]);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("payment_approval_requests")
      .select("*")
      .order("requested_at", { ascending: false });
    setRequests((data ?? []) as any);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const resolve = async (id: string, status: "aprobado" | "denegado") => {
    const { error } = await supabase
      .from("payment_approval_requests")
      .update({ status, resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "aprobado" ? "Pago aprobado" : "Pago denegado");
    fetchAll();
  };

  const pending = requests.filter((r) => r.status === "pendiente");
  const resolved = requests.filter((r) => r.status !== "pendiente");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Aprobaciones de Pago</h1>
        <p className="text-muted-foreground">Pagos que tu planner solicita autorizar</p>
      </div>

      {pending.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Solicitudes Pendientes
              <Badge variant="secondary">{pending.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{r.service_name}</p>
                    <p className="text-sm text-muted-foreground">{r.vendor_name ?? "—"}</p>
                    {r.payment_method_last4 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tarjeta •••• {r.payment_method_last4} · {r.requested_at.slice(0,10)}
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-foreground shrink-0">${Number(r.amount).toLocaleString()} {r.currency}</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => resolve(r.id, "denegado")}>
                    <XCircle className="h-4 w-4 mr-1" /> Denegar
                  </Button>
                  <Button size="sm" onClick={() => resolve(r.id, "aprobado")}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Aprobar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Historial</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {resolved.length === 0 && pending.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No hay solicitudes de pago todavía</p>
          )}
          {resolved.map((r) => {
            const c = statusConfig[r.status];
            const Icon = c.icon;
            return (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${r.status === "aprobado" ? "text-primary" : "text-destructive"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.service_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.vendor_name ?? "—"} · {r.resolved_at?.slice(0,10) ?? ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${Number(r.amount).toLocaleString()} {r.currency}</p>
                  <Badge variant={c.variant}>{c.label}</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
