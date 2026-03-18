import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Users, DollarSign, MessageCircle, Clock } from "lucide-react";

const stats = [
  { label: "Upcoming Weddings", value: "8", icon: CalendarDays, change: "+2 this month" },
  { label: "Active Clients", value: "14", icon: Users, change: "3 pending" },
  { label: "Total Budget", value: "$284,500", icon: DollarSign, change: "92% collected" },
  { label: "Unread Messages", value: "5", icon: MessageCircle, change: "2 urgent" },
];

const upcomingWeddings = [
  { couple: "Sarah & Michael", date: "Apr 15, 2026", venue: "Rose Garden Estate", status: "On Track", progress: 78 },
  { couple: "Emma & James", date: "May 22, 2026", venue: "Lakeside Manor", status: "Needs Attention", progress: 45 },
  { couple: "Olivia & David", date: "Jun 10, 2026", venue: "The Grand Ballroom", status: "On Track", progress: 62 },
  { couple: "Sophia & Liam", date: "Jul 4, 2026", venue: "Beachfront Pavilion", status: "Planning", progress: 20 },
];

const tasks = [
  { text: "Confirm florist for Sarah & Michael", due: "Today", urgent: true },
  { text: "Send contract to Emma & James", due: "Tomorrow", urgent: false },
  { text: "Review catering menu options", due: "Mar 20", urgent: false },
  { text: "Final walkthrough — Rose Garden", due: "Mar 25", urgent: false },
];

export default function PlannerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
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
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Weddings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingWeddings.map((w) => (
              <div key={w.couple} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{w.couple}</div>
                  <div className="text-sm text-muted-foreground">{w.date} · {w.venue}</div>
                </div>
                <Badge variant={w.status === "Needs Attention" ? "destructive" : "secondary"} className="shrink-0">
                  {w.status}
                </Badge>
                <div className="w-24 shrink-0">
                  <Progress value={w.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((t) => (
              <div key={t.text} className="flex items-start gap-3 p-2">
                <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${t.urgent ? "text-destructive" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-sm text-foreground">{t.text}</p>
                  <p className={`text-xs ${t.urgent ? "text-destructive" : "text-muted-foreground"}`}>{t.due}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
