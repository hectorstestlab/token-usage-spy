import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, User, FileText } from "lucide-react";
import type { MarketplaceContract } from "@/types/marketplace";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  aceptado: "default",
  pendiente: "secondary",
  rechazado: "destructive",
  completado: "outline",
};

export default function ContractCard({ contract }: { contract: MarketplaceContract }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{contract.service}</h3>
            <p className="text-sm text-muted-foreground">{contract.vendorName}</p>
          </div>
          <Badge variant={statusVariant[contract.status]}>{contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 shrink-0" />{contract.clientName}</span>
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 shrink-0" />{contract.date}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{contract.location}</span>
          <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 shrink-0" />{contract.weddingName}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-lg font-bold text-foreground">{contract.amount}</span>
          <span className="text-xs text-muted-foreground">
            Contratado por {contract.hiredBy === "planner" ? "planner" : "pareja"}
            {contract.hiredBy === "client" && " ⚡"}
          </span>
        </div>

        {contract.notes && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">{contract.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
