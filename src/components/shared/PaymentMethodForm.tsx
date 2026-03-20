import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PaymentMethod } from "@/types/payments";
import { toast } from "sonner";

interface PaymentMethodFormProps {
  onSave: (method: PaymentMethod) => void;
  onCancel: () => void;
}

export default function PaymentMethodForm({ onSave, onCancel }: PaymentMethodFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex">("visa");

  const handleSubmit = () => {
    if (!cardNumber || !holderName || !expiryMonth || !expiryYear) {
      toast.error("Completa todos los campos");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Número de tarjeta inválido");
      return;
    }
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    onSave({
      id: `pm-${Date.now()}`,
      type: cardType,
      last4,
      holderName,
      expiryMonth,
      expiryYear,
      isDefault: false,
    });
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de tarjeta</Label>
        <Select value={cardType} onValueChange={(v) => setCardType(v as typeof cardType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="visa">Visa</SelectItem>
            <SelectItem value="mastercard">Mastercard</SelectItem>
            <SelectItem value="amex">American Express</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Número de tarjeta</Label>
        <Input
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
        />
      </div>
      <div className="space-y-2">
        <Label>Nombre del titular</Label>
        <Input placeholder="Nombre completo" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mes</Label>
          <Select value={expiryMonth} onValueChange={setExpiryMonth}>
            <SelectTrigger><SelectValue placeholder="Mes" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <SelectItem key={m} value={m}>{m}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Año</Label>
          <Select value={expiryYear} onValueChange={setExpiryYear}>
            <SelectTrigger><SelectValue placeholder="Año" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 8 }, (_, i) => {
                const y = String(2025 + i);
                return <SelectItem key={y} value={y}>{y}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar Tarjeta</Button>
      </div>
    </div>
  );
}
