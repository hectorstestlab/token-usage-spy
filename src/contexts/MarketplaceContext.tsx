import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { MarketplaceListing } from "@/types/marketplace";
import type { Review } from "@/types/reviews";
import { marketplaceListings as listingsSeed } from "@/data/marketplaceData";
import { reviewsSeed } from "@/data/reviewsData";

interface MarketplaceContextType {
  listings: MarketplaceListing[];
  addListing: (l: Omit<MarketplaceListing, "id" | "rating" | "reviewCount" | "images" | "featured">) => void;
  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  getReviewsForVendor: (vendorId: string) => Review[];
  getVendorRating: (vendorId: string) => { rating: number; count: number };
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<MarketplaceListing[]>(listingsSeed);
  const [reviews, setReviews] = useState<Review[]>(reviewsSeed);

  const addListing: MarketplaceContextType["addListing"] = useCallback((data) => {
    const id = `l${Date.now()}`;
    setListings((prev) => [
      {
        ...data,
        id,
        rating: 0,
        reviewCount: 0,
        images: [],
        featured: data.adTier !== "básico",
      },
      ...prev,
    ]);
  }, []);

  const addReview: MarketplaceContextType["addReview"] = useCallback((r) => {
    const id = `r${Date.now()}`;
    const date = new Date().toLocaleDateString("es-MX", { month: "short", year: "numeric" });
    setReviews((prev) => [{ ...r, id, date }, ...prev]);
  }, []);

  const getReviewsForVendor = useCallback(
    (vendorId: string) => reviews.filter((r) => r.vendorId === vendorId),
    [reviews]
  );

  const getVendorRating = useCallback(
    (vendorId: string) => {
      const list = reviews.filter((r) => r.vendorId === vendorId);
      if (list.length === 0) return { rating: 0, count: 0 };
      const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
      return { rating: Math.round(avg * 10) / 10, count: list.length };
    },
    [reviews]
  );

  return (
    <MarketplaceContext.Provider value={{ listings, addListing, reviews, addReview, getReviewsForVendor, getVendorRating }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}
