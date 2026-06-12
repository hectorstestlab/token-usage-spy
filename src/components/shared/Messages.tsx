import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

interface Msg {
  id: string; sender_id: string; recipient_id: string;
  body: string; read: boolean; created_at: string;
}

export default function Messages() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    const list = (data ?? []) as any as Msg[];
    setMessages(list);
    const otherIds = Array.from(new Set(list.map((m) => m.sender_id === user.id ? m.recipient_id : m.sender_id)));
    if (otherIds.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", otherIds);
      const map: Record<string, string> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p.full_name ?? "Usuario"; });
      setNames(map);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mensajes</h1>
        <p className="text-muted-foreground">Tus conversaciones</p>
      </div>
      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex items-center gap-3 text-muted-foreground">
            <Info className="h-5 w-5" />
            <span className="text-sm">Aún no tienes mensajes. La mensajería se activará cuando un planner o pareja te escriba.</span>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {messages.map((m) => {
              const otherId = m.sender_id === user?.id ? m.recipient_id : m.sender_id;
              const otherName = names[otherId] ?? "Usuario";
              const incoming = m.recipient_id === user?.id;
              return (
                <div key={m.id} className={`flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors ${incoming && !m.read ? "bg-primary/5" : ""}`}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{otherName}</span>
                      {incoming ? <Badge variant="outline" className="text-[10px]">Recibido</Badge>
                        : <Badge variant="secondary" className="text-[10px]">Enviado</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{m.body}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{m.created_at.slice(0,10)}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
