import type { SharedPaymentMethod, PaymentApprovalRequest } from "@/types/paymentApprovals";

export const mockSharedMethods: SharedPaymentMethod[] = [
  {
    id: "spm-1", type: "visa", last4: "4242", holderName: "Ana García",
    expiryMonth: "12", expiryYear: "2027", isDefault: true,
    ownerId: "client-1", ownerName: "Ana García", approvedForPlanner: true, sharedAt: "2025-03-01",
  },
  {
    id: "spm-2", type: "mastercard", last4: "8888", holderName: "Ana García",
    expiryMonth: "06", expiryYear: "2026", isDefault: false,
    ownerId: "client-1", ownerName: "Ana García", approvedForPlanner: false, sharedAt: "2025-03-05",
  },
];

export const mockApprovalRequests: PaymentApprovalRequest[] = [
  {
    id: "apr-1", transactionId: "tx-10", clientId: "client-1", clientName: "Ana García",
    plannerId: "planner-1", plannerName: "María López",
    serviceName: "Iluminación Profesional", vendorName: "LuzPro Events",
    amount: 12000, currency: "MXN", paymentMethodLast4: "4242", paymentMethodType: "visa",
    status: "pendiente", requestedAt: "2025-03-19", resolvedAt: null,
  },
  {
    id: "apr-2", transactionId: "tx-11", clientId: "client-1", clientName: "Ana García",
    plannerId: "planner-1", plannerName: "María López",
    serviceName: "Fotografía Premium", vendorName: "Estudio Luz",
    amount: 15000, currency: "MXN", paymentMethodLast4: "4242", paymentMethodType: "visa",
    status: "aprobado", requestedAt: "2025-03-15", resolvedAt: "2025-03-15",
  },
  {
    id: "apr-3", transactionId: "tx-12", clientId: "client-1", clientName: "Ana García",
    plannerId: "planner-1", plannerName: "María López",
    serviceName: "Servicio de DJ", vendorName: "SoundMax",
    amount: 8000, currency: "MXN", paymentMethodLast4: "8888", paymentMethodType: "mastercard",
    status: "denegado", requestedAt: "2025-03-10", resolvedAt: "2025-03-11",
  },
];
