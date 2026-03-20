import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Crown } from "lucide-react";
import type { MarketplaceListing } from "@/types/marketplace";

interface ListingCardProps {
  listing: MarketplaceListing;
  onHire?: (listing: MarketplaceListing) => void;
  onView?: (listing: MarketplaceListing) => void;
  showHireButton?: boolean;
}

const tierColors: Record<string, string> = {
  premium: "bg-wedding-gold/15 text-wedding-gold border-wedding-gold/30",
  destacado: "bg-primary/10 text-primary border-primary/30",
  básico: "",
};

export default function ListingCard({ listing, onHire, onView, showHireButton = true }: ListingCardProps) {
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        listing.adTier === "premium" ? "ring-1 ring-wedding-gold/40" : ""
      }`}
    >
      {listing.adTier === "premium" && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className={tierColors.premium + " gap-1 text-xs border"}>
            <Crown className="h-3 w-3" /> Premium
          </Badge>
        </div>
      )}
      {listing.adTier === "destacado" && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className={tierColors.destacado + " text-xs border"}>Destacado</Badge>
        </div>
      )}

      <div className="h-36 bg-muted/50 flex items-center justify-center border-b">
        <span className="text-4xl opacity-30">📷</span>
      </div>

      <CardContent className="p-5 space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{listing.category}</p>
          <h3 className="font-semibold text-foreground mt-0.5 leading-snug">{listing.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{listing.vendorName}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>

        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-wedding-gold fill-wedding-gold" />
            <span className="font-medium text-foreground">{listing.rating}</span>
            <span className="text-muted-foreground">({listing.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {listing.location}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {listing.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <span className="text-lg font-bold text-foreground">{listing.price}</span>
            {listing.priceType === "desde" && <span className="text-xs text-muted-foreground ml-1">en adelante</span>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onView?.(listing)}>Ver más</Button>
            {showHireButton && (
              <Button size="sm" onClick={() => onHire?.(listing)}>Contratar</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
