import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreditCard, CheckCircle2, XCircle, Clock, ShieldCheck } from "lucide-react";
import type { PaymentApprovalRequest, SharedPaymentMethod } from "@/types/paymentApprovals";
import { mockApprovalRequests, mockSharedMethods } from "@/data/paymentApprovalsData";
import { toast } from "sonner";

const statusConfig = {
  pendiente: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
  aprobado: { label: "Aprobado", variant: "default" as const, icon: CheckCircle2 },
  denegado: { label: "Denegado", variant: "destructive" as const, icon: XCircle },
};

const cardLabel = (type: string) => {
  switch (type) {
    case "visa": return "Visa";
    case "mastercard": return "MC";
    case "amex": return "Amex";
    default: return "Tarjeta";
  }
};

export default function ClientPaymentApprovals() {
  const [requests, setRequests] = useState<PaymentApprovalRequest[]>(mockApprovalRequests);
  const [sharedMethods, setSharedMethods] = useState<SharedPaymentMethod[]>(mockSharedMethods);

  const pending = requests.filter((r) => r.status === "pendiente");
  const resolved = requests.filter((r) => r.status !== "pendiente");

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "aprobado" as const, resolvedAt: new Date().toISOString().slice(0, 10) } : r)
    );
    toast.success("Pago aprobado exitosamente");
  };

  const handleDeny = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "denegado" as const, resolvedAt: new Date().toISOString().slice(0, 10) } : r)
    );
    toast.success("Pago denegado");
  };

  const toggleShared = (id: string) => {
    setSharedMethods((prev) =>
      prev.map((m) => m.id === id ? { ...m, approvedForPlanner: !m.approvedForPlanner } : m)
    );
    const method = sharedMethods.find((m) => m.id === id);
    if (method) {
      toast.success(method.approvedForPlanner ? "Tarjeta revocada para el planner" : "Tarjeta autorizada para el planner");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Aprobaciones de Pago</h1>
        <p className="text-muted-foreground">Gestiona los pagos que tu planner solicita con tus tarjetas</p>
      </div>

      {/* Shared cards management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Tarjetas Autorizadas para tu Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sharedMethods.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{cardLabel(m.type)} •••• {m.last4}</div>
                <div className="text-xs text-muted-foreground">{m.holderName} · {m.expiryMonth}/{m.expiryYear}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{m.approvedForPlanner ? "Autorizada" : "No autorizada"}</span>
                <Switch checked={m.approvedForPlanner} onCheckedChange={() => toggleShared(m.id)} />
              </div>
            </div>
          ))}
          {sharedMethods.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No tienes tarjetas para compartir. Agrega una en la sección de Pagos.</p>
          )}
        </CardContent>
      </Card>

      {/* Pending requests */}
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
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{r.serviceName}</p>
                    <p className="text-sm text-muted-foreground">{r.vendorName} · Solicitado por {r.plannerName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tarjeta: {cardLabel(r.paymentMethodType)} •••• {r.paymentMethodLast4} · {r.requestedAt}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-foreground">${r.amount.toLocaleString()} {r.currency}</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleDeny(r.id)}>
                    <XCircle className="h-4 w-4 mr-1" /> Denegar
                  </Button>
                  <Button size="sm" onClick={() => handleApprove(r.id)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Aprobar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Resolved requests */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resolved.length === 0 && pending.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No hay solicitudes de pago</p>
          )}
          {resolved.map((r) => {
            const config = statusConfig[r.status];
            const Icon = config.icon;
            return (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${r.status === "aprobado" ? "text-primary" : "text-destructive"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{r.vendorName} · {r.plannerName} · {r.resolvedAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${r.amount.toLocaleString()} {r.currency}</p>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
