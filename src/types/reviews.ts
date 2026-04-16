export interface Review {
  id: string;
  vendorId: string;
  listingId?: string;
  authorName: string;
  authorRole: "client" | "planner";
  rating: number; // 1-5
  text: string;
  date: string; // ISO or display
}
