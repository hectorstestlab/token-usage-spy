import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Settings as SettingsIcon, User, CreditCard } from "lucide-react";
import PaymentSettings from "@/components/shared/PaymentSettings";

export default function SettingsPage() {
  const { userName, role } = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Gestiona las preferencias de tu cuenta</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-1.5">
            <CreditCard className="h-4 w-4" /> Pagos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{userName || "Usuario"}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{role || "Sin rol"}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="h-5 w-5 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Más opciones de perfil estarán disponibles una vez que se conecte el backend.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
