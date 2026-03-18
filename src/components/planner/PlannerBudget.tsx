import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign } from "lucide-react";

const categories = [
  { name: "Venue & Catering", allocated: 18000, spent: 15200 },
  { name: "Photography & Video", allocated: 8000, spent: 6500 },
  { name: "Flowers & Décor", allocated: 5000, spent: 4800 },
  { name: "Entertainment", allocated: 4000, spent: 2000 },
  { name: "Attire & Beauty", allocated: 3500, spent: 3200 },
  { name: "Stationery", allocated: 1500, spent: 900 },
  { name: "Transportation", allocated: 2000, spent: 0 },
  { name: "Miscellaneous", allocated: 3000, spent: 1400 },
];

const totalAllocated = categories.reduce((s, c) => s + c.allocated, 0);
const totalSpent = categories.reduce((s, c) => s + c.spent, 0);

export default function PlannerBudget() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Budget Overview</h1>
        <p className="text-muted-foreground">Track spending across all active weddings</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold text-foreground">${totalAllocated.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-primary">${(totalAllocated - totalSpent).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {categories.map((c) => {
            const pct = Math.round((c.spent / c.allocated) * 100);
            return (
              <div key={c.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{c.name}</span>
                  <span className="text-muted-foreground">
                    ${c.spent.toLocaleString()} / ${c.allocated.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
