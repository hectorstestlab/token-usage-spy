import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const categories = [
  { name: "Venue & Catering", allocated: 18000, spent: 15200 },
  { name: "Photography", allocated: 5500, spent: 5500 },
  { name: "Flowers", allocated: 3200, spent: 3200 },
  { name: "Entertainment", allocated: 4000, spent: 0 },
  { name: "Attire", allocated: 3500, spent: 2800 },
  { name: "Other", allocated: 2800, spent: 1200 },
];

const total = 45000;
const spent = categories.reduce((s, c) => s + c.spent, 0);

export default function ClientBudget() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Budget</h1>
        <p className="text-muted-foreground">Your wedding budget breakdown</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Spent</p>
            <p className="text-3xl font-bold text-foreground">${spent.toLocaleString()}</p>
            <Progress value={(spent / total) * 100} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-2">of ${total.toLocaleString()} total budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Remaining</p>
            <p className="text-3xl font-bold text-primary">${(total - spent).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>By Category</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {categories.map((c) => (
            <div key={c.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{c.name}</span>
                <span className="text-muted-foreground">${c.spent.toLocaleString()} / ${c.allocated.toLocaleString()}</span>
              </div>
              <Progress value={c.allocated > 0 ? (c.spent / c.allocated) * 100 : 0} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
