import type { MarketplaceListing, MarketplaceContract, MarketplaceAlert, VendorAd } from "@/types/marketplace";

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "l1", vendorId: "v1", vendorName: "Flores y Pétalos", category: "Florista",
    title: "Arreglos Florales para Bodas", description: "Diseño floral personalizado para ceremonias y recepciones. Incluye ramo de novia, boutonnières y centros de mesa.",
    price: "$3,200", priceType: "desde", rating: 4.9, reviewCount: 34, location: "Ciudad de México",
    images: [], featured: true, adTier: "premium", tags: ["ramos", "centros de mesa", "decoración floral"],
  },
  {
    id: "l2", vendorId: "v2", vendorName: "Captura Momentos", category: "Fotografía",
    title: "Fotografía y Video de Boda", description: "Cobertura completa del día con entrega de galería digital, álbum impreso y video cinematográfico.",
    price: "$5,500", priceType: "desde", rating: 4.8, reviewCount: 47, location: "Ciudad de México",
    images: [], featured: true, adTier: "premium", tags: ["fotografía", "video", "drone"],
  },
  {
    id: "l3", vendorId: "v3", vendorName: "Celebraciones Gourmet", category: "Catering",
    title: "Banquete y Coctelería Premium", description: "Menú de 3 tiempos con coctelería artesanal. Servicio para 50 a 500 invitados.",
    price: "$12,000", priceType: "desde", rating: 4.7, reviewCount: 28, location: "Guadalajara",
    images: [], featured: false, adTier: "destacado", tags: ["banquete", "coctelería", "chef privado"],
  },
  {
    id: "l4", vendorId: "v4", vendorName: "Cuerdas Armónicas", category: "Entretenimiento",
    title: "Música en Vivo para Ceremonia", description: "Cuarteto de cuerdas, violinista solista o trío acústico para ceremonia y coctel.",
    price: "$2,000", priceType: "desde", rating: 4.6, reviewCount: 19, location: "Monterrey",
    images: [], featured: false, adTier: "básico", tags: ["música en vivo", "cuerdas", "ceremonia"],
  },
  {
    id: "l5", vendorId: "v5", vendorName: "Dulces Capas Pastelería", category: "Pastel y Postres",
    title: "Pastel de Bodas Artesanal", description: "Pasteles de fondant o buttercream con diseño personalizado. Mesa de postres completa.",
    price: "$800", priceType: "desde", rating: 4.9, reviewCount: 52, location: "Ciudad de México",
    images: [], featured: true, adTier: "destacado", tags: ["pastel", "postres", "mesa dulce"],
  },
  {
    id: "l6", vendorId: "v6", vendorName: "Decoración Elegante", category: "Decoración",
    title: "Ambientación y Diseño de Espacios", description: "Transformación completa de venue: iluminación, mobiliario, telas y elementos decorativos.",
    price: "$8,500", priceType: "desde", rating: 4.5, reviewCount: 15, location: "Puebla",
    images: [], featured: false, adTier: "básico", tags: ["decoración", "iluminación", "mobiliario"],
  },
  {
    id: "l7", vendorId: "v7", vendorName: "Limusinas de Lujo", category: "Transporte",
    title: "Transporte Nupcial Premium", description: "Rolls Royce, Mercedes o Lincoln para la pareja. Servicio de shuttle para invitados.",
    price: "$600", priceType: "desde", rating: 4.4, reviewCount: 11, location: "Ciudad de México",
    images: [], featured: false, adTier: "básico", tags: ["transporte", "limusina", "shuttle"],
  },
  {
    id: "l8", vendorId: "v8", vendorName: "DJ Fiesta Total", category: "Entretenimiento",
    title: "DJ y Producción de Audio", description: "DJ profesional con sistema de sonido, iluminación LED y máquina de humo. 6 horas.",
    price: "$4,200", priceType: "fijo", rating: 4.7, reviewCount: 31, location: "Cancún",
    images: [], featured: true, adTier: "premium", tags: ["DJ", "sonido", "iluminación", "fiesta"],
  },
];

export const marketplaceContracts: MarketplaceContract[] = [
  {
    id: "c1", listingId: "l1", vendorName: "Flores y Pétalos", clientName: "Sara y Miguel",
    plannerName: "Ana García", service: "Arreglos Florales para Bodas", status: "aceptado",
    amount: "$3,200", date: "15 Abr, 2026", location: "Hacienda Los Morales, CDMX",
    weddingName: "Boda Sara & Miguel", notes: "Paleta en tonos blush y sage", createdAt: "2026-01-15", hiredBy: "planner",
  },
  {
    id: "c2", listingId: "l2", vendorName: "Captura Momentos", clientName: "Sara y Miguel",
    plannerName: "Ana García", service: "Fotografía y Video de Boda", status: "aceptado",
    amount: "$5,500", date: "15 Abr, 2026", location: "Hacienda Los Morales, CDMX",
    weddingName: "Boda Sara & Miguel", notes: "Incluye sesión pre-boda", createdAt: "2026-01-20", hiredBy: "planner",
  },
  {
    id: "c3", listingId: "l3", vendorName: "Celebraciones Gourmet", clientName: "Emma y Jaime",
    plannerName: null, service: "Banquete y Coctelería Premium", status: "pendiente",
    amount: "$15,000", date: "22 May, 2026", location: "Jardín Botánico, GDL",
    weddingName: "Boda Emma & Jaime", notes: "Menú vegano disponible", createdAt: "2026-02-10", hiredBy: "client",
  },
  {
    id: "c4", listingId: "l8", vendorName: "DJ Fiesta Total", clientName: "Olivia y David",
    plannerName: "Ana García", service: "DJ y Producción de Audio", status: "pendiente",
    amount: "$4,200", date: "10 Jun, 2026", location: "Playa del Carmen",
    weddingName: "Boda Olivia & David", notes: "Requiere generador eléctrico", createdAt: "2026-03-01", hiredBy: "client",
  },
];

export const marketplaceAlerts: MarketplaceAlert[] = [
  {
    id: "a1", type: "contratación-directa", message: "Emma y Jaime contrataron directamente a Celebraciones Gourmet para su boda.",
    clientName: "Emma y Jaime", vendorName: "Celebraciones Gourmet", service: "Banquete y Coctelería Premium",
    timestamp: "2026-02-10T14:30:00", read: false,
  },
  {
    id: "a2", type: "contratación-directa", message: "Olivia y David contrataron directamente a DJ Fiesta Total para su boda.",
    clientName: "Olivia y David", vendorName: "DJ Fiesta Total", service: "DJ y Producción de Audio",
    timestamp: "2026-03-01T09:15:00", read: false,
  },
  {
    id: "a3", type: "nueva-consulta", message: "Nueva consulta de Laura y Pedro sobre servicios de fotografía.",
    clientName: "Laura y Pedro", vendorName: "Captura Momentos", service: "Fotografía y Video de Boda",
    timestamp: "2026-03-05T11:00:00", read: true,
  },
];

export const vendorAds: VendorAd[] = [
  { id: "ad1", listingId: "l2", title: "Fotografía y Video de Boda", tier: "premium", status: "activo", impressions: 2340, clicks: 187, startDate: "2026-01-01", endDate: "2026-06-30", monthlyCost: "$1,200" },
  { id: "ad2", listingId: "l9", title: "Sesión de Compromiso", tier: "destacado", status: "activo", impressions: 890, clicks: 56, startDate: "2026-02-01", endDate: "2026-05-31", monthlyCost: "$600" },
  { id: "ad3", listingId: "l10", title: "Paquete Elopement", tier: "básico", status: "pausado", impressions: 320, clicks: 18, startDate: "2025-10-01", endDate: "2026-01-31", monthlyCost: "$200" },
];

export const categories = [
  "Todos", "Florista", "Fotografía", "Catering", "Entretenimiento",
  "Pastel y Postres", "Decoración", "Transporte", "Venue", "Vestido y Traje",
];
