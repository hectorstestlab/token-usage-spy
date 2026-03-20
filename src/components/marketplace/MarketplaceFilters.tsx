import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { categories } from "@/data/marketplaceData";

interface MarketplaceFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeCategory: string;
  onCategoryChange: (v: string) => void;
}

export default function MarketplaceFilters({ search, onSearchChange, activeCategory, onCategoryChange }: MarketplaceFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar proveedores, servicios..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(cat)}
            className="text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
