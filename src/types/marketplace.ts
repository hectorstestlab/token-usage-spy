export interface MarketplaceListing {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  title: string;
  description: string;
  price: string;
  priceType: "fijo" | "desde" | "por-hora" | "cotización";
  rating: number;
  reviewCount: number;
  location: string;
  images: string[];
  featured: boolean;
  adTier: "básico" | "destacado" | "premium";
  tags: string[];
}

export interface MarketplaceContract {
  id: string;
  listingId: string;
  vendorName: string;
  clientName: string;
  plannerName: string | null;
  service: string;
  status: "pendiente" | "aceptado" | "rechazado" | "completado";
  amount: string;
  date: string;
  location: string;
  weddingName: string;
  notes: string;
  createdAt: string;
  hiredBy: "planner" | "client";
}

export interface MarketplaceAlert {
  id: string;
  type: "contratación-directa" | "nueva-consulta" | "contrato-actualizado";
  message: string;
  clientName: string;
  vendorName: string;
  service: string;
  timestamp: string;
  read: boolean;
}

export interface VendorAd {
  id: string;
  listingId: string;
  title: string;
  tier: "básico" | "destacado" | "premium";
  status: "activo" | "pausado" | "expirado";
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  monthlyCost: string;
}
