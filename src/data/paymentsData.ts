import type { PaymentMethod, Transaction, VendorPayout, BankAccount } from "@/types/payments";

export const mockPaymentMethods: PaymentMethod[] = [
  { id: "pm-1", type: "visa", last4: "4242", holderName: "Ana García", expiryMonth: "12", expiryYear: "2027", isDefault: true },
  { id: "pm-2", type: "mastercard", last4: "8888", holderName: "Ana García", expiryMonth: "06", expiryYear: "2026", isDefault: false },
];

export const mockTransactions: Transaction[] = [
  { id: "tx-1", amount: 15000, currency: "MXN", serviceName: "Fotografía Premium", vendorName: "Estudio Luz", status: "completado", date: "2025-03-15", paymentMethodLast4: "4242", description: "Paquete fotográfico completo" },
  { id: "tx-2", amount: 8500, currency: "MXN", serviceName: "Arreglos Florales Deluxe", vendorName: "Flores del Valle", status: "completado", date: "2025-03-10", paymentMethodLast4: "4242", description: "Decoración floral ceremonia y recepción" },
  { id: "tx-3", amount: 25000, currency: "MXN", serviceName: "Banquete 150 personas", vendorName: "Catering Gourmet", status: "pendiente", date: "2025-03-18", paymentMethodLast4: "8888", description: "Menú de 3 tiempos con barra libre" },
  { id: "tx-4", amount: 5000, currency: "MXN", serviceName: "DJ y sonido", vendorName: "SoundMax", status: "reembolsado", date: "2025-02-20", paymentMethodLast4: "4242", description: "Servicio cancelado" },
];

export const mockVendorPayouts: VendorPayout[] = [
  { id: "vp-1", amount: 15000, currency: "MXN", status: "pagado", date: "2025-03-16", serviceName: "Fotografía Premium", clientName: "Boda Ana & Carlos" },
  { id: "vp-2", amount: 12000, currency: "MXN", status: "pagado", date: "2025-03-12", serviceName: "Fotografía Básica", clientName: "Boda Laura & Pedro" },
  { id: "vp-3", amount: 18000, currency: "MXN", status: "en_proceso", date: "2025-03-19", serviceName: "Video + Foto", clientName: "Boda María & José" },
  { id: "vp-4", amount: 8000, currency: "MXN", status: "pendiente", date: "2025-03-22", serviceName: "Sesión pre-boda", clientName: "Boda Sofía & Diego" },
];

export const mockBankAccount: BankAccount = {
  id: "ba-1",
  bankName: "BBVA",
  last4: "7890",
  holderName: "Estudio Luz S.A. de C.V.",
  clabe: "************7890",
};
