import type { Review } from "@/types/reviews";

export const reviewsSeed: Review[] = [
  { id: "r1", vendorId: "v2", listingId: "l2", authorName: "Sara M.", authorRole: "client", rating: 5, text: "¡Absolutamente increíble! Cada foto fue una obra maestra.", date: "Feb 2026" },
  { id: "r2", vendorId: "v2", listingId: "l2", authorName: "Emily R.", authorRole: "client", rating: 5, text: "Profesionales, creativos y muy fáciles de trabajar.", date: "Ene 2026" },
  { id: "r3", vendorId: "v1", listingId: "l1", authorName: "Ana García", authorRole: "planner", rating: 5, text: "Diseño floral impecable, muy puntuales.", date: "Mar 2026" },
  { id: "r4", vendorId: "v1", listingId: "l1", authorName: "Laura P.", authorRole: "client", rating: 4, text: "Hermosos arreglos, comunicación excelente.", date: "Feb 2026" },
  { id: "r5", vendorId: "v3", listingId: "l3", authorName: "Emma J.", authorRole: "client", rating: 5, text: "El banquete fue espectacular, todos los invitados quedaron encantados.", date: "Ene 2026" },
  { id: "r6", vendorId: "v8", listingId: "l8", authorName: "Olivia D.", authorRole: "client", rating: 5, text: "La pista no se vació en toda la noche. ¡Increíble DJ!", date: "Mar 2026" },
  { id: "r7", vendorId: "v5", listingId: "l5", authorName: "Mariana T.", authorRole: "client", rating: 5, text: "El pastel fue precioso y delicioso.", date: "Feb 2026" },
];
