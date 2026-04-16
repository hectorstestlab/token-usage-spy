import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, MessageCircle, ShoppingBag, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MarketplaceListing } from "@/types/marketplace";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useUser } from "@/contexts/UserContext";
import MessageThreadDialog from "./MessageThreadDialog";
import { toast } from "sonner";

interface ListingDetailDialogProps {
  listing: MarketplaceListing | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onHire?: (listing: MarketplaceListing) => void;
}

export default function ListingDetailDialog({ listing, open, onOpenChange, onHire }: ListingDetailDialogProps) {
  const { getReviewsForVendor, addReview, getVendorRating } = useMarketplace();
  const { role, userName } = useUser();
  const [contactOpen, setContactOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const reviews = useMemo(
    () => (listing ? getReviewsForVendor(listing.vendorId) : []),
    [listing, getReviewsForVendor]
  );
  const computed = listing ? getVendorRating(listing.vendorId) : { rating: 0, count: 0 };

  if (!listing) return null;

  const canReview = role === "client" || role === "planner";

  const submitReview = () => {
    if (!reviewText.trim()) {
      toast.error("Escribe tu reseña");
      return;
    }
    addReview({
      vendorId: listing.vendorId,
      listingId: listing.id,
      authorName: userName || "Usuario",
      authorRole: role === "planner" ? "planner" : "client",
      rating,
      text: reviewText.trim(),
    });
    setReviewText("");
    setRating(5);
    toast.success("Reseña publicada");
  };

  const displayRating = computed.count > 0 ? computed.rating : listing.rating;
  const displayCount = computed.count > 0 ? computed.count : listing.reviewCount;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{listing.category}</p>
                <DialogTitle className="text-xl">{listing.title}</DialogTitle>
                <DialogDescription>{listing.vendorName}</DialogDescription>
              </div>
              <Badge variant="secondary">{listing.adTier}</Badge>
            </div>
          </DialogHeader>

          <div className="h-48 bg-muted/40 rounded-md flex items-center justify-center border">
            <span className="text-5xl opacity-30">📷</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-wedding-gold fill-wedding-gold" />
              <span className="font-semibold text-foreground">{displayRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({displayCount} reseñas)</span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {listing.location}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Descripción</h4>
            <p className="text-sm text-muted-foreground">{listing.description}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {listing.tags.map((t) => (
              <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-b py-3">
            <div>
              <p className="text-xs text-muted-foreground">Precio</p>
              <p className="text-2xl font-bold text-foreground">
                {listing.price}
                {listing.priceType === "desde" && <span className="text-xs font-normal text-muted-foreground ml-1">en adelante</span>}
                {listing.priceType === "por-hora" && <span className="text-xs font-normal text-muted-foreground ml-1">/hora</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1.5" onClick={() => setContactOpen(true)}>
                <MessageCircle className="h-4 w-4" /> Contactar
              </Button>
              {(role === "client" || role === "planner") && onHire && (
                <Button className="gap-1.5" onClick={() => { onOpenChange(false); onHire(listing); }}>
                  <ShoppingBag className="h-4 w-4" /> Comprar / Agendar
                </Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Reseñas ({reviews.length})</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no hay reseñas para este proveedor.</p>
              )}
              {reviews.map((r) => (
                <div key={r.id} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">{r.authorName}</span>
                      <Badge variant="outline" className="text-[10px] py-0">{r.authorRole === "planner" ? "Planner" : "Cliente"}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3.5 w-3.5 ${j < r.rating ? "text-wedding-gold fill-wedding-gold" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {canReview && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Deja tu reseña</h4>
              <div>
                <Label className="text-xs">Calificación</Label>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const v = i + 1;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRating(v)}
                        aria-label={`${v} estrellas`}
                      >
                        <Star className={`h-6 w-6 ${v <= rating ? "text-wedding-gold fill-wedding-gold" : "text-muted-foreground/30"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="review-text" className="text-xs">Tu reseña</Label>
                <Textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Comparte tu experiencia con este proveedor..."
                  rows={3}
                  maxLength={500}
                />
              </div>
              <Button onClick={submitReview} size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" /> Publicar reseña
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MessageThreadDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        recipientName={listing.vendorName}
        context={listing.title}
      />
    </>
  );
}
