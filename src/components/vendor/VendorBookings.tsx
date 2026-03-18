import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const bookings = [
  { client: "Sarah & Michael", date: "Apr 15, 2026", venue: "Rose Garden Estate", status: "Confirmed", amount: "$3,200" },
  { client: "Emma & James", date: "May 22, 2026", venue: "Lakeside Manor", status: "Confirmed", amount: "$4,500" },
  { client: "Olivia & David", date: "Jun 10, 2026", venue: "The Grand Ballroom", status: "Pending", amount: "$2,800" },
  { client: "Corporate Event", date: "Mar 28, 2026", venue: "City Conference Hall", status: "Confirmed", amount: "$1,500" },
  { client: "Sophia & Liam", date: "Jul 4, 2026", venue: "Beachfront Pavilion", status: "Inquiry", amount: "TBD" },
];

export default function VendorBookings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground">All your confirmed and pending bookings</p>
      </div>
      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b.client + b.date} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-6">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{b.client}</h3>
                <p className="text-sm text-muted-foreground">{b.date} · {b.venue}</p>
              </div>
              <span className="text-sm font-medium text-foreground">{b.amount}</span>
              <Badge variant={b.status === "Inquiry" ? "outline" : b.status === "Pending" ? "secondary" : "default"}>{b.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
