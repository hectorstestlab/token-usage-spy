import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Plus, Users } from "lucide-react";
import type { MarketplaceListing } from "@/types/marketplace";
import type { PaymentMethod } from "@/types/payments";
import { mockPaymentMethods } from "@/data/paymentsData";
import { mockSharedMethods } from "@/data/paymentApprovalsData";
import PaymentMethodForm from "@/components/shared/PaymentMethodForm";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

interface PaymentDialogProps {
  listing: MarketplaceListing | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  weddingName: string;
  date: string;
  onSuccess: () => void;
}

type Step = "summary" | "method" | "new-card" | "confirm";

export default function PaymentDialog({ listing, open, onOpenChange, weddingName, date, onSuccess }: PaymentDialogProps) {
  const { role } = useUser();
  const [step, setStep] = useState<Step>("summary");
  const [methods, setMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedMethod, setSelectedMethod] = useState<string>(mockPaymentMethods[0]?.id ?? "");
  const [isClientCard, setIsClientCard] = useState(false);
  const [processing, setProcessing] = useState(false);

  const clientCards = mockSharedMethods.filter((m) => m.approvedForPlanner);

  if (!listing) return null;

  const selected = isClientCard
    ? clientCards.find((m) => m.id === selectedMethod)
    : methods.find((m) => m.id === selectedMethod);

  const cardIcon = (type: string) => {
    switch (type) {
      case "visa": return "💳 Visa";
      case "mastercard": return "💳 MC";
      case "amex": return "💳 Amex";
      default: return "💳";
    }
  };

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (isClientCard) {
        toast.success("Solicitud de pago enviada al cliente", {
          description: `${listing.title} — ${listing.price}. Pendiente de aprobación.`,
        });
      } else {
        toast.success("¡Pago procesado exitosamente!", { description: `${listing.title} — ${listing.price}` });
      }
      setStep("summary");
      setIsClientCard(false);
      onOpenChange(false);
      onSuccess();
    }, 1500);
  };

  const handleAddCard = (method: PaymentMethod) => {
    setMethods((prev) => [...prev, method]);
    setSelectedMethod(method.id);
    setIsClientCard(false);
    toast.success("Tarjeta agregada");
    setStep("method");
  };

  const handleSelectOwn = (id: string) => {
    setSelectedMethod(id);
    setIsClientCard(false);
  };

  const handleSelectClient = (id: string) => {
    setSelectedMethod(id);
    setIsClientCard(true);
  };

  const handleClose = (v: boolean) => {
    if (!v) { setStep("summary"); setIsClientCard(false); }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "summary" && "Resumen del Pago"}
            {step === "method" && "Método de Pago"}
            {step === "new-card" && "Agregar Tarjeta"}
            {step === "confirm" && (isClientCard ? "Solicitar Aprobación" : "Confirmar Pago")}
          </DialogTitle>
          <DialogDescription>
            {step === "summary" && "Revisa los detalles antes de continuar"}
            {step === "method" && "Selecciona o agrega un método de pago"}
            {step === "new-card" && "Ingresa los datos de tu tarjeta"}
            {step === "confirm" && (isClientCard ? "El cliente deberá aprobar este pago" : "Verifica y confirma tu pago")}
          </DialogDescription>
        </DialogHeader>

        {step === "summary" && (
          <div className="space-y-3 py-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Servicio</span>
              <span className="font-medium text-foreground">{listing.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Proveedor</span>
              <span className="text-foreground">{listing.vendorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Boda</span>
              <span className="text-foreground">{weddingName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fecha</span>
              <span className="text-foreground">{date}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">{listing.price}</span>
            </div>
          </div>
        )}

        {step === "method" && (
          <div className="space-y-3 py-2">
            {/* Own cards */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tus Tarjetas</p>
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectOwn(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  selectedMethod === m.id && !isClientCard ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
              >
                <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-foreground">{cardIcon(m.type)} •••• {m.last4}</div>
                  <div className="text-xs text-muted-foreground">{m.holderName} · {m.expiryMonth}/{m.expiryYear}</div>
                </div>
                {selectedMethod === m.id && !isClientCard && <Check className="h-4 w-4 text-primary" />}
                {m.isDefault && <Badge variant="secondary" className="text-xs">Principal</Badge>}
              </button>
            ))}

            {/* Client cards - only for planners */}
            {role === "planner" && clientCards.length > 0 && (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-4 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Tarjetas de Clientes
                </p>
                {clientCards.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectClient(m.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selectedMethod === m.id && isClientCard ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-foreground">{cardIcon(m.type)} •••• {m.last4}</div>
                      <div className="text-xs text-muted-foreground">{m.ownerName} · Requiere aprobación</div>
                    </div>
                    {selectedMethod === m.id && isClientCard && <Check className="h-4 w-4 text-primary" />}
                    <Badge variant="outline" className="text-xs">Cliente</Badge>
                  </button>
                ))}
              </>
            )}

            <button
              onClick={() => setStep("new-card")}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:bg-muted/50 transition-colors"
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Agregar nueva tarjeta</span>
            </button>
          </div>
        )}

        {step === "new-card" && (
          <PaymentMethodForm onSave={handleAddCard} onCancel={() => setStep("method")} />
        )}

        {step === "confirm" && selected && (
          <div className="space-y-3 py-2">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Servicio</span>
                <span className="text-foreground">{listing.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pagar con</span>
                <span className="text-foreground">{cardIcon(selected.type)} •••• {selected.last4}</span>
              </div>
              {isClientCard && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Titular</span>
                  <span className="text-foreground">{(selected as any).ownerName}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-primary">{listing.price}</span>
              </div>
            </div>
            {isClientCard ? (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-foreground font-medium">⚠️ Requiere aprobación del cliente</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Se enviará una solicitud al cliente para aprobar este pago. El servicio se confirmará cuando el cliente acepte.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                Al confirmar, aceptas los términos de servicio. Este es un pago simulado.
              </p>
            )}
          </div>
        )}

        {step !== "new-card" && (
          <DialogFooter>
            {step === "summary" && (
              <>
                <Button variant="outline" onClick={() => handleClose(false)}>Cancelar</Button>
                <Button onClick={() => setStep("method")}>Continuar</Button>
              </>
            )}
            {step === "method" && (
              <>
                <Button variant="outline" onClick={() => setStep("summary")}>Atrás</Button>
                <Button onClick={() => setStep("confirm")} disabled={!selectedMethod}>Continuar</Button>
              </>
            )}
            {step === "confirm" && (
              <>
                <Button variant="outline" onClick={() => setStep("method")}>Atrás</Button>
                <Button onClick={handleConfirm} disabled={processing}>
                  {processing ? "Procesando..." : isClientCard ? "Enviar Solicitud" : "Confirmar Pago"}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
