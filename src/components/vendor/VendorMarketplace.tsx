import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MousePointerClick, TrendingUp, DollarSign, Plus, Pause, Play } from "lucide-react";
import { vendorAds, marketplaceContracts } from "@/data/marketplaceData";
import ContractCard from "@/components/marketplace/ContractCard";
import { toast } from "sonner";

const tierLabel: Record<string, string> = { premium: "Premium", destacado: "Destacado", básico: "Básico" };
const tierColor: Record<string, string> = {
  premium: "bg-wedding-gold/15 text-wedding-gold border-wedding-gold/30 border",
  destacado: "bg-primary/10 text-primary border-primary/30 border",
  básico: "",
};

const stats = [
  { label: "Impresiones Totales", value: "3,550", icon: Eye, sub: "Últimos 30 días" },
  { label: "Clicks Totales", value: "261", icon: MousePointerClick, sub: "7.4% CTR" },
  { label: "Consultas Recibidas", value: "8", icon: TrendingUp, sub: "3 pendientes" },
  { label: "Inversión Mensual", value: "$2,000", icon: DollarSign, sub: "3 anuncios activos" },
];

export default function VendorMarketplace() {
  const [ads, setAds] = useState(vendorAds);
  const contracts = useMemo(() => marketplaceContracts.filter((c) => c.vendorName === "Captura Momentos" || true), []);

  const toggleAd = (id: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === id ? { ...ad, status: ad.status === "activo" ? "pausado" : "activo" } : ad
      )
    );
    toast.success("Estado del anuncio actualizado");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground">Gestiona tus anuncios y contratos</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo Anuncio</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="anuncios">
        <TabsList>
          <TabsTrigger value="anuncios">Mis Anuncios</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="anuncios" className="space-y-4 mt-4">
          {ads.map((ad) => (
            <Card key={ad.id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{ad.title}</h3>
                    <Badge className={tierColor[ad.tier]}>{tierLabel[ad.tier]}</Badge>
                    <Badge variant={ad.status === "activo" ? "default" : "secondary"}>
                      {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ad.startDate} — {ad.endDate} · {ad.monthlyCost}/mes
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {ad.impressions.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="h-3.5 w-3.5" /> {ad.clicks}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => toggleAd(ad.id)}
                >
                  {ad.status === "activo" ? <><Pause className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Activar</>}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contratos" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {contracts.map((c) => (
              <ContractCard key={c.id} contract={c} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
