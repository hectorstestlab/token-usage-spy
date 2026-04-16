import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/marketplaceData";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import type { MarketplaceListing } from "@/types/marketplace";

interface NewListingDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function NewListingDialog({ open, onOpenChange }: NewListingDialogProps) {
  const { addListing } = useMarketplace();
  const { userName } = useUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fotografía");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<MarketplaceListing["priceType"]>("desde");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [adTier, setAdTier] = useState<MarketplaceListing["adTier"]>("básico");

  const reset = () => {
    setTitle(""); setDescription(""); setPrice(""); setLocation(""); setTags("");
    setCategory("Fotografía"); setPriceType("desde"); setAdTier("básico");
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !price.trim() || !location.trim()) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    if (title.length > 100 || description.length > 1000) {
      toast.error("El título o la descripción exceden el largo permitido");
      return;
    }
    addListing({
      vendorId: `v-${userName.replace(/\s/g, "")}`,
      vendorName: userName || "Mi Negocio",
      category,
      title: title.trim(),
      description: description.trim(),
      price: price.startsWith("$") ? price : `$${price}`,
      priceType,
      location: location.trim(),
      adTier,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
    });
    toast.success("Servicio publicado en el marketplace");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publicar nuevo servicio</DialogTitle>
          <DialogDescription>Completa los datos para publicar tu producto o servicio en el marketplace.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Fotografía y Video de Boda" maxLength={100} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c !== "Todos").map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ciudad de México" maxLength={80} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descripción *</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={1000} placeholder="Describe tu servicio, qué incluye, duración..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3,500" maxLength={20} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de precio</Label>
              <Select value={priceType} onValueChange={(v) => setPriceType(v as MarketplaceListing["priceType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fijo">Fijo</SelectItem>
                  <SelectItem value="desde">Desde</SelectItem>
                  <SelectItem value="por-hora">Por hora</SelectItem>
                  <SelectItem value="cotización">A cotización</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="fotografía, drone, álbum" maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label>Plan de anuncio</Label>
            <Select value={adTier} onValueChange={(v) => setAdTier(v as MarketplaceListing["adTier"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="básico">Básico</SelectItem>
                <SelectItem value="destacado">Destacado</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Publicar servicio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
