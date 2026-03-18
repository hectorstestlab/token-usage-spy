import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const messages = [
  { from: "Sarah M.", preview: "Can we move the tasting to next week?", time: "2h ago", unread: true },
  { from: "Bloom & Petal", preview: "Updated proposal attached for the ceremony arrangement.", time: "5h ago", unread: true },
  { from: "Emma J.", preview: "We loved the venue! Let's finalize.", time: "1d ago", unread: false },
  { from: "Capture Moments", preview: "Engagement shoot is confirmed for Saturday.", time: "1d ago", unread: false },
  { from: "Sophia L.", preview: "Thanks for the timeline update!", time: "2d ago", unread: false },
];

export default function Messages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Your conversations</p>
      </div>
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors ${m.unread ? "bg-primary/5" : ""}`}>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${m.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{m.from}</span>
                  {m.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground truncate">{m.preview}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{m.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
