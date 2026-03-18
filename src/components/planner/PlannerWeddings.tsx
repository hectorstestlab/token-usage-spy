import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const weddings = [
  { couple: "Sarah & Michael", date: "Apr 15, 2026", venue: "Rose Garden Estate", guests: 150, status: "On Track", budget: "$45,000" },
  { couple: "Emma & James", date: "May 22, 2026", venue: "Lakeside Manor", guests: 200, status: "Needs Attention", budget: "$62,000" },
  { couple: "Olivia & David", date: "Jun 10, 2026", venue: "The Grand Ballroom", guests: 120, status: "On Track", budget: "$38,000" },
  { couple: "Sophia & Liam", date: "Jul 4, 2026", venue: "Beachfront Pavilion", guests: 80, status: "Planning", budget: "$28,000" },
  { couple: "Ava & Noah", date: "Aug 20, 2026", venue: "Mountain Lodge", guests: 100, status: "Planning", budget: "$35,000" },
];

export default function PlannerWeddings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weddings</h1>
          <p className="text-muted-foreground">Manage all your upcoming weddings</p>
        </div>
        <Badge variant="secondary">{weddings.length} total</Badge>
      </div>
      <div className="grid gap-4">
        {weddings.map((w) => (
          <Card key={w.couple} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{w.couple}</h3>
                <p className="text-sm text-muted-foreground">{w.date} · {w.venue}</p>
              </div>
              <div className="text-sm text-muted-foreground hidden md:block">{w.guests} guests</div>
              <div className="text-sm font-medium text-foreground hidden md:block">{w.budget}</div>
              <Badge variant={w.status === "Needs Attention" ? "destructive" : "secondary"}>{w.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
