import type { PaymentMethod } from "./payments";

export interface SharedPaymentMethod extends PaymentMethod {
  ownerId: string;
  ownerName: string;
  approvedForPlanner: boolean;
  sharedAt: string;
}

export interface PaymentApprovalRequest {
  id: string;
  transactionId: string;
  clientId: string;
  clientName: string;
  plannerId: string;
  plannerName: string;
  serviceName: string;
  vendorName: string;
  amount: number;
  currency: string;
  paymentMethodLast4: string;
  paymentMethodType: "visa" | "mastercard" | "amex";
  status: "pendiente" | "aprobado" | "denegado";
  requestedAt: string;
  resolvedAt: string | null;
}
