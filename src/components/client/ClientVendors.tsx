import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEntities } from "@/contexts/EntitiesContext";
import { JoinWeddingDialog } from "@/components/shared/EntityDialogs";
import { Badge } from "@/components/ui/badge";

export default function ClientVendors() {
  const { weddings } = useEntities();
  const wedding = weddings[0];
  const [vendorNames, setVendorNames] = useState<{ id: string; name: string }[]>([]);

  const fetchVendors = useCallback(async () => {
    if (!wedding) return;
    const { data: members } = await supabase
      .from("wedding_members")
      .select("user_id")
      .eq("wedding_id", wedding.id)
      .eq("member_role", "vendor");
    const ids = (members ?? []).map((m: any) => m.user_id);
    if (!ids.length) { setVendorNames([]); return; }
    const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids);
    setVendorNames((profs ?? []).map((p: any) => ({ id: p.id, name: p.full_name ?? "Proveedor" })));
  }, [wedding]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  if (!wedding) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
        <Card><CardContent className="p-8 text-center space-y-4">
          <Heart className="h-10 w-10 text-primary mx-auto" />
          <p className="text-muted-foreground">Únete a una boda primero.</p>
          <JoinWeddingDialog asRole="client" />
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
        <p className="text-muted-foreground">Proveedores asignados a tu boda</p>
      </div>

      <div className="grid gap-3">
        {vendorNames.length === 0 && (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">
            Tu planner aún no ha vinculado proveedores. Pídeles que compartan el código de invitación con cada proveedor.
          </CardContent></Card>
        )}
        {vendorNames.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{v.name}</p>
              </div>
              <Badge variant="secondary">Vinculado</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
