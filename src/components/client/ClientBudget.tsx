import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEntities } from "@/contexts/EntitiesContext";
import { NewBudgetCategoryDialog } from "@/components/shared/EntityDialogs";

export default function ClientBudget() {
  const { budget } = useEntities();
  const categories = budget.filter((b) => b.scope === "client");
  const total = categories.reduce((s, c) => s + c.allocated, 0);
  const spent = categories.reduce((s, c) => s + c.spent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Presupuesto</h1>
          <p className="text-muted-foreground">Desglose del presupuesto de tu boda</p>
        </div>
        <NewBudgetCategoryDialog scope="client" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Gastado</p>
            <p className="text-3xl font-bold text-foreground">${spent.toLocaleString()}</p>
            <Progress value={total > 0 ? (spent / total) * 100 : 0} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-2">de ${total.toLocaleString()} de presupuesto total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Restante</p>
            <p className="text-3xl font-bold text-primary">${(total - spent).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Por Categoría</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {categories.map((c) => (
            <div key={c.id} className="space-y-1.5">
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
