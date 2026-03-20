export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  serviceName: string;
  vendorName: string;
  status: "completado" | "pendiente" | "reembolsado" | "fallido";
  date: string;
  paymentMethodLast4: string;
  description: string;
}

export interface VendorPayout {
  id: string;
  amount: number;
  currency: string;
  status: "pagado" | "pendiente" | "en_proceso";
  date: string;
  serviceName: string;
  clientName: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  last4: string;
  holderName: string;
  clabe: string;
}
