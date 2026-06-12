import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Users } from "lucide-react";
import { useEntities } from "@/contexts/EntitiesContext";
import { toast } from "sonner";

export default function PlannerClients() {
  const { clients, weddings } = useEntities();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <p className="text-muted-foreground">Tus parejas y los códigos para invitarlas</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><KeyRound className="h-4 w-4" /> Códigos de invitación</h2>
          {weddings.length === 0 && (
            <p className="text-sm text-muted-foreground">Crea una boda para generar su código.</p>
          )}
          <div className="space-y-2">
            {weddings.map((w) => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{w.couple}</p>
                  <p className="text-xs text-muted-foreground">{w.date}</p>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(w.inviteCode ?? ""); toast.success("Código copiado"); }}
                  className="px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted font-mono text-sm"
                >
                  {w.inviteCode}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Parejas vinculadas</h2>
        <div className="grid gap-4">
          {clients.length === 0 && (
            <Card><CardContent className="p-6 text-sm text-muted-foreground">
              Aún no hay parejas vinculadas. Comparte el código de invitación de una boda.
            </CardContent></Card>
          )}
          {clients.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5 flex items-center gap-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">Boda: {c.wedding}</p>
                </div>
                <Badge variant="secondary">{c.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
