import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";

const clients = [
  { name: "Sarah & Michael", email: "sarah.m@email.com", phone: "(555) 123-4567", wedding: "Apr 15, 2026", status: "Active" },
  { name: "Emma & James", email: "emma.j@email.com", phone: "(555) 234-5678", wedding: "May 22, 2026", status: "Active" },
  { name: "Olivia & David", email: "olivia.d@email.com", phone: "(555) 345-6789", wedding: "Jun 10, 2026", status: "Active" },
  { name: "Sophia & Liam", email: "sophia.l@email.com", phone: "(555) 456-7890", wedding: "Jul 4, 2026", status: "New" },
  { name: "Ava & Noah", email: "ava.n@email.com", phone: "(555) 567-8901", wedding: "Aug 20, 2026", status: "New" },
];

export default function PlannerClients() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground">Your couples and their contact details</p>
      </div>
      <div className="grid gap-4">
        {clients.map((c) => (
          <Card key={c.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <p className="text-sm text-muted-foreground">Wedding: {c.wedding}</p>
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
