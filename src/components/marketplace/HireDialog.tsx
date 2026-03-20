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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { MarketplaceListing } from "@/types/marketplace";
import PaymentDialog from "@/components/marketplace/PaymentDialog";
import { toast } from "sonner";

interface HireDialogProps {
  listing: MarketplaceListing | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  hiredBy: "planner" | "client";
}

export default function HireDialog({ listing, open, onOpenChange, hiredBy }: HireDialogProps) {
  const [weddingName, setWeddingName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  if (!listing) return null;

  const handleSubmit = () => {
    if (!weddingName || !date) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    // Instead of finishing, open payment dialog
    onOpenChange(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast.success(`Servicio contratado: ${listing.title}`);
    if (hiredBy === "client") {
      toast.info("Se notificó a tu wedding planner sobre esta contratación");
    }
    setShowPayment(false);
    setWeddingName("");
    setDate("");
    setLocation("");
    setNotes("");
  };

  const handlePaymentClose = (v: boolean) => {
    if (!v) {
      setShowPayment(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contratar: {listing.title}</DialogTitle>
            <DialogDescription>{listing.vendorName} · {listing.price}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="wedding">Nombre de la boda *</Label>
              <Input id="wedding" value={weddingName} onChange={(e) => setWeddingName(e.target.value)} placeholder="Boda Sara & Miguel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha del evento *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue o dirección" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Detalles, preferencias..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Continuar al Pago</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaymentDialog
        listing={listing}
        open={showPayment}
        onOpenChange={handlePaymentClose}
        weddingName={weddingName}
        date={date}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
