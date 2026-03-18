import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, DollarSign, Users, TrendingUp } from "lucide-react";

const stats = [
  { label: "Upcoming Bookings", value: "6", icon: CalendarCheck, sub: "Next: Mar 22" },
  { label: "Monthly Revenue", value: "$12,400", icon: DollarSign, sub: "+18% vs last month" },
  { label: "New Inquiries", value: "4", icon: Users, sub: "2 pending response" },
  { label: "Avg Rating", value: "4.8", icon: TrendingUp, sub: "Based on 47 reviews" },
];

const bookings = [
  { client: "Sarah & Michael", date: "Apr 15, 2026", type: "Wedding", status: "Confirmed", amount: "$3,200" },
  { client: "Emma & James", date: "May 22, 2026", type: "Wedding", status: "Confirmed", amount: "$4,500" },
  { client: "Olivia & David", date: "Jun 10, 2026", type: "Wedding", status: "Pending", amount: "$2,800" },
  { client: "Corporate Event", date: "Mar 28, 2026", type: "Event", status: "Confirmed", amount: "$1,500" },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Your business at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {bookings.map((b) => (
            <div key={b.client + b.date} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">{b.client}</p>
                <p className="text-sm text-muted-foreground">{b.date} · {b.type}</p>
              </div>
              <span className="text-sm font-medium text-foreground">{b.amount}</span>
              <Badge variant={b.status === "Pending" ? "secondary" : "default"}>{b.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
