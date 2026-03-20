import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Plus, Trash2, Building2, DollarSign, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import type { PaymentMethod } from "@/types/payments";
import { mockPaymentMethods, mockTransactions, mockVendorPayouts, mockBankAccount } from "@/data/paymentsData";
import { mockSharedMethods, mockApprovalRequests } from "@/data/paymentApprovalsData";
import type { SharedPaymentMethod } from "@/types/paymentApprovals";
import PaymentMethodForm from "@/components/shared/PaymentMethodForm";
import { toast } from "sonner";

export default function PaymentSettings() {
  const { role } = useUser();
  const [methods, setMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showForm, setShowForm] = useState(false);
  const [sharedMethods, setSharedMethods] = useState<SharedPaymentMethod[]>(mockSharedMethods);

  const handleAddMethod = (method: PaymentMethod) => {
    setMethods((prev) => [...prev, method]);
    setShowForm(false);
    toast.success("Tarjeta agregada exitosamente");
  };

  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    toast.success("Tarjeta eliminada");
  };

  const handleSetDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    toast.success("Tarjeta principal actualizada");
  };

  const toggleShared = (id: string) => {
    setSharedMethods((prev) =>
      prev.map((m) => m.id === id ? { ...m, approvedForPlanner: !m.approvedForPlanner } : m)
    );
    const method = sharedMethods.find((m) => m.id === id);
    if (method) {
      toast.success(method.approvedForPlanner ? "Tarjeta revocada" : "Tarjeta autorizada para el planner");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completado": case "pagado": return "default";
      case "pendiente": case "pendiente_aprobacion": return "secondary";
      case "en_proceso": return "outline";
      case "reembolsado": case "fallido": case "denegado": return "destructive";
      default: return "secondary";
    }
  };

  const cardIcon = (type: string) => {
    switch (type) {
      case "visa": return "Visa";
      case "mastercard": return "MC";
      case "amex": return "Amex";
      default: return "Tarjeta";
    }
  };

  if (role === "vendor") {
    const totalEarnings = mockVendorPayouts.filter((p) => p.status === "pagado").reduce((s, p) => s + p.amount, 0);
    const pendingEarnings = mockVendorPayouts.filter((p) => p.status !== "pagado").reduce((s, p) => s + p.amount, 0);

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Ingresos Totales</p>
                <p className="text-xl font-bold text-foreground">${totalEarnings.toLocaleString()} MXN</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-accent-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Por Cobrar</p>
                <p className="text-xl font-bold text-foreground">${pendingEarnings.toLocaleString()} MXN</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Cuenta de Cobro</p>
                <p className="text-sm font-medium text-foreground">{mockBankAccount.bankName} •••• {mockBankAccount.last4}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Historial de Ingresos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVendorPayouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{p.clientName} · {p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${p.amount.toLocaleString()} MXN</p>
                    <Badge variant={statusColor(p.status)}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Planner & Client shared transaction history (includes planner-initiated client card payments)
  const approvalTxs = mockApprovalRequests.map((r) => ({
    id: r.id,
    amount: r.amount,
    currency: r.currency,
    serviceName: r.serviceName,
    vendorName: r.vendorName,
    status: r.status === "aprobado" ? "completado" : r.status === "denegado" ? "denegado" : "pendiente_aprobacion",
    date: r.requestedAt,
    paymentMethodLast4: r.paymentMethodLast4,
    paidByPlanner: true,
    plannerName: r.plannerName,
  }));

  const allTransactions = [
    ...mockTransactions.map((tx) => ({ ...tx, paidByPlanner: false, plannerName: "" })),
    ...approvalTxs,
  ].sort((a, b) => b.date.localeCompare(a.date));

  // Authorized client cards (read-only for planner)
  const authorizedClientCards = sharedMethods.filter((m) => m.approvedForPlanner);

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
                  <div className="text-sm font-medium text-foreground">{cardIcon(m.type)} •••• {m.last4}</div>
                  <div className="text-xs text-muted-foreground">{m.holderName} · {m.expiryMonth}/{m.expiryYear}</div>
                </div>
                {m.isDefault && <Badge variant="secondary">Principal</Badge>}
                {!m.isDefault && (
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

      {/* Client: Share cards with planner */}
      {role === "client" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Tarjetas Compartidas con tu Planner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sharedMethods.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{cardIcon(m.type)} •••• {m.last4}</div>
                  <div className="text-xs text-muted-foreground">{m.holderName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{m.approvedForPlanner ? "Autorizada" : "No autorizada"}</span>
                  <Switch checked={m.approvedForPlanner} onCheckedChange={() => toggleShared(m.id)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Planner: View authorized client cards (read-only) */}
      {role === "planner" && authorizedClientCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Tarjetas de Clientes Autorizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {authorizedClientCards.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{cardIcon(m.type)} •••• {m.last4}</div>
                  <div className="text-xs text-muted-foreground">{m.ownerName}</div>
                </div>
                <Badge variant="outline" className="text-xs">Cliente</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Historial de Transacciones</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{tx.serviceName}</p>
                    {tx.paidByPlanner && <Badge variant="outline" className="text-xs">Pagado por planner</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tx.vendorName} · {tx.date} · •••• {tx.paymentMethodLast4}
                    {tx.paidByPlanner && ` · ${tx.plannerName}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${tx.amount.toLocaleString()} {tx.currency}</p>
                  <Badge variant={statusColor(tx.status)}>{tx.status === "pendiente_aprobacion" ? "Pendiente aprobación" : tx.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
