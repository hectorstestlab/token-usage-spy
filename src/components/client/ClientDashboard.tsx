import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, CheckCircle2, DollarSign, Heart } from "lucide-react";

const daysUntilWedding = 28;
const checklistTotal = 24;
const checklistDone = 17;

const checklist = [
  { text: "Book venue", done: true },
  { text: "Hire photographer", done: true },
  { text: "Choose caterer", done: true },
  { text: "Send invitations", done: true },
  { text: "Final dress fitting", done: false },
  { text: "Confirm seating chart", done: false },
  { text: "Book honeymoon flights", done: false },
];

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Your Wedding Dashboard</h1>
        <p className="text-muted-foreground">Everything at a glance</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-4xl font-bold text-foreground">{daysUntilWedding}</p>
            <p className="text-sm text-muted-foreground">days to go!</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Checklist Progress</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{checklistDone}/{checklistTotal}</p>
            <Progress value={(checklistDone / checklistTotal) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Budget Used</span>
            </div>
            <p className="text-2xl font-bold text-foreground">$32,400</p>
            <p className="text-xs text-muted-foreground">of $45,000 budget</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <CheckCircle2 className={`h-5 w-5 ${item.done ? "text-primary" : "text-muted-foreground/30"}`} />
              <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.text}</span>
              {item.done && <Badge variant="secondary" className="text-xs">Done</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
