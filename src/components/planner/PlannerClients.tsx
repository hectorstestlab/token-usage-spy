import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { useEntities } from "@/contexts/EntitiesContext";
import { NewClientDialog } from "@/components/shared/EntityDialogs";

export default function PlannerClients() {
  const { clients } = useEntities();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Tus parejas y sus datos de contacto</p>
        </div>
        <NewClientDialog />
      </div>
      <div className="grid gap-4">
        {clients.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <p className="text-sm text-muted-foreground">Boda: {c.wedding}</p>
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{c.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{c.phone}</span>
              </div>
              <Badge variant="secondary">{c.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
