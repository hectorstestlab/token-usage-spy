import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import type { PaymentMethod } from "@/types/payments";
import PaymentMethodForm from "@/components/shared/PaymentMethodForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DBMethod {
  id: string; brand: string; last4: string; holder_name: string;
  exp_month: string; exp_year: string; is_default: boolean;
}
interface DBTx {
  id: string; service_name: string; vendor_name: string | null; amount: number;
  currency: string; status: string; payment_method_last4: string | null; created_at: string;
}

export default function PaymentSettings() {
  const { user } = useUser();
  const [methods, setMethods] = useState<DBMethod[]>([]);
  const [transactions, setTransactions] = useState<DBTx[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const [{ data: pms }, { data: txs }] = await Promise.all([
      supabase.from("payment_methods").select("*").order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
    ]);
    setMethods((pms ?? []) as any);
    setTransactions((txs ?? []) as any);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAddMethod = async (m: PaymentMethod) => {
    if (!user) return;
    const { error } = await supabase.from("payment_methods").insert({
      user_id: user.id, brand: m.type, last4: m.last4,
      holder_name: m.holderName, exp_month: m.expiryMonth, exp_year: m.expiryYear,
      is_default: methods.length === 0,
    });
    if (error) { toast.error(error.message); return; }
    setShowForm(false);
    toast.success("Tarjeta agregada");
    fetchAll();
  };

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("payment_methods").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tarjeta eliminada");
    fetchAll();
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("payment_methods").update({ is_default: true }).eq("id", id);
    toast.success("Tarjeta principal actualizada");
    fetchAll();
  };

  const cardIcon = (b: string) => b === "visa" ? "Visa" : b === "mastercard" ? "MC" : b === "amex" ? "Amex" : "Tarjeta";
  const statusColor = (s: string) =>
    s === "completado" || s === "pagado" ? "default" :
    s === "pendiente" ? "secondary" :
    s === "fallido" || s === "denegado" || s === "reembolsado" ? "destructive" : "outline";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Métodos de Pago</CardTitle>
          {!showForm && (
            <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-4 p-4 border border-border rounded-lg">
              <PaymentMethodForm onSave={handleAddMethod} onCancel={() => setShowForm(false)} />
            </div>
          )}
          <div className="space-y-3">
            {methods.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{cardIcon(m.brand)} •••• {m.last4}</div>
                  <div className="text-xs text-muted-foreground">{m.holder_name} · {m.exp_month}/{m.exp_year}</div>
                </div>
                {m.is_default && <Badge variant="secondary">Principal</Badge>}
                {!m.is_default && (
                  <Button size="sm" variant="ghost" onClick={() => handleSetDefault(m.id)} className="text-xs">
                    Hacer principal
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => handleRemove(m.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {methods.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tienes métodos de pago guardados</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historial de Transacciones</CardTitle></CardHeader>
        <CardContent>
          {transactions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Sin transacciones aún</p>
          )}
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.service_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.vendor_name ?? "—"} · {tx.created_at.slice(0, 10)}
                    {tx.payment_method_last4 && ` · •••• ${tx.payment_method_last4}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${Number(tx.amount).toLocaleString()} {tx.currency}</p>
                  <Badge variant={statusColor(tx.status) as any}>{tx.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
