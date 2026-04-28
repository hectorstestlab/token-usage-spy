import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEntities } from "@/contexts/EntitiesContext";
import { NewBudgetCategoryDialog } from "@/components/shared/EntityDialogs";

export default function PlannerBudget() {
  const { budget } = useEntities();
  const categories = budget.filter((b) => b.scope === "planner");
  const totalAllocated = categories.reduce((s, c) => s + c.allocated, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resumen de Presupuesto</h1>
          <p className="text-muted-foreground">Seguimiento de gastos en todas las bodas activas</p>
        </div>
        <NewBudgetCategoryDialog scope="planner" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Presupuesto Total</p>
            <p className="text-2xl font-bold text-foreground">${totalAllocated.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Gastado</p>
            <p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Restante</p>
            <p className="text-2xl font-bold text-primary">${(totalAllocated - totalSpent).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {categories.map((c) => {
            const pct = c.allocated > 0 ? Math.round((c.spent / c.allocated) * 100) : 0;
            return (
              <div key={c.id} className="space-y-1.5">
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
