import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface MessageThreadDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  recipientName: string;
  context?: string;
}

interface Msg { from: "me" | "them"; text: string; time: string; }

export default function MessageThreadDialog({ open, onOpenChange, recipientName, context }: MessageThreadDialogProps) {
  const [messages, setMessages] = useState<Msg[]>([
    { from: "them", text: `¡Hola! Soy de ${recipientName}. ¿En qué puedo ayudarte?`, time: "Ahora" },
  ]);
  const [draft, setDraft] = useState("");
  const [subject, setSubject] = useState(context || "");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "me", text, time: "Ahora" }]);
    setDraft("");
    toast.success("Mensaje enviado");
    // simulate reply
    setTimeout(() => {
      setMessages((m) => [...m, { from: "them", text: "Gracias por tu mensaje, te respondo pronto.", time: "Ahora" }]);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Conversación con {recipientName}</DialogTitle>
        </DialogHeader>
        {context && (
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
        )}
        <div className="border rounded-md h-64 overflow-y-auto p-3 space-y-2 bg-muted/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.from === "me" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribe un mensaje..."
            rows={2}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <Button onClick={send} className="gap-1.5"><Send className="h-4 w-4" /> Enviar</Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
