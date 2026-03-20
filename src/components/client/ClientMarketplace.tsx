import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { marketplaceListings, marketplaceContracts, marketplaceAlerts } from "@/data/marketplaceData";
import ListingCard from "@/components/marketplace/ListingCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import ContractCard from "@/components/marketplace/ContractCard";
import HireDialog from "@/components/marketplace/HireDialog";
import type { MarketplaceListing } from "@/types/marketplace";

export default function ClientMarketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [hireTarget, setHireTarget] = useState<MarketplaceListing | null>(null);

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

  const clientContracts = marketplaceContracts.filter((c) => c.hiredBy === "client");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">Encuentra y contrata proveedores para tu boda</p>
      </div>

      <Card className="border-wedding-gold/30 bg-wedding-gold/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-wedding-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Contratación directa</p>
            <p className="text-xs text-muted-foreground">
              Al contratar un proveedor directamente, tu wedding planner recibirá una notificación automática para coordinar los detalles.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="explorar">
        <TabsList>
          <TabsTrigger value="explorar">Explorar</TabsTrigger>
          <TabsTrigger value="mis-contratos">
            Mis Contratos
            {clientContracts.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">{clientContracts.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explorar" className="space-y-6 mt-4">
          <MarketplaceFilters search={search} onSearchChange={setSearch} activeCategory={category} onCategoryChange={setCategory} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onHire={setHireTarget} showHireButton />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No se encontraron proveedores.</p>
          )}
        </TabsContent>

        <TabsContent value="mis-contratos" className="mt-4">
          {clientContracts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aún no has contratado proveedores.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {clientContracts.map((c) => (
                <ContractCard key={c.id} contract={c} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <HireDialog listing={hireTarget} open={!!hireTarget} onOpenChange={(v) => !v && setHireTarget(null)} hiredBy="client" />
    </div>
  );
}
