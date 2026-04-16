import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketplaceContracts } from "@/data/marketplaceData";
import ListingCard from "@/components/marketplace/ListingCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import ContractCard from "@/components/marketplace/ContractCard";
import HireDialog from "@/components/marketplace/HireDialog";
import ListingDetailDialog from "@/components/marketplace/ListingDetailDialog";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import type { MarketplaceListing } from "@/types/marketplace";

export default function PlannerMarketplace() {
  const { listings: marketplaceListings } = useMarketplace();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [hireTarget, setHireTarget] = useState<MarketplaceListing | null>(null);
  const [detailTarget, setDetailTarget] = useState<MarketplaceListing | null>(null);

  const filtered = useMemo(() => {
    return marketplaceListings
      .filter((l) => category === "Todos" || l.category === category)
      .filter((l) =>
        [l.title, l.vendorName, l.category, ...l.tags]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const tierOrder = { premium: 0, destacado: 1, básico: 2 };
        return tierOrder[a.adTier] - tierOrder[b.adTier];
      });
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">Busca proveedores y gestiona contratos para tus bodas</p>
      </div>

      <Tabs defaultValue="explorar">
        <TabsList>
          <TabsTrigger value="explorar">Explorar Proveedores</TabsTrigger>
          <TabsTrigger value="contratos">Contratos ({marketplaceContracts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="explorar" className="space-y-6 mt-4">
          <MarketplaceFilters search={search} onSearchChange={setSearch} activeCategory={category} onCategoryChange={setCategory} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onHire={setHireTarget} onView={setDetailTarget} showHireButton />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No se encontraron proveedores con esos filtros.</p>
          )}
        </TabsContent>

        <TabsContent value="contratos" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {marketplaceContracts.map((c) => (
              <ContractCard key={c.id} contract={c} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <HireDialog listing={hireTarget} open={!!hireTarget} onOpenChange={(v) => !v && setHireTarget(null)} hiredBy="planner" />
      <ListingDetailDialog listing={detailTarget} open={!!detailTarget} onOpenChange={(v) => !v && setDetailTarget(null)} onHire={setHireTarget} />
    </div>
  );
}
