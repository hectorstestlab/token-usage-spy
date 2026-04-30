import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInterviews } from "@/contexts/InterviewsContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useMemo } from "react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function InterviewAnalytics() {
  const { questions, interviews } = useInterviews();
  const completed = interviews.filter((i) => i.status === "Completada");

  const stats = useMemo(() => {
    const budgets = completed
      .map((i) => Number(i.answers.find((a) => a.questionId === "q-budget")?.value))
      .filter((n) => !isNaN(n) && n > 0);
    const guests = completed
      .map((i) => Number(i.answers.find((a) => a.questionId === "q-guests")?.value))
      .filter((n) => !isNaN(n) && n > 0);
    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    return {
      totalInterviews: interviews.length,
      completed: completed.length,
      avgBudget: avg(budgets),
      avgGuests: avg(guests),
    };
  }, [interviews, completed]);

  const choiceData = useMemo(() => {
    return questions
      .filter((q) => q.type === "single-choice" || q.type === "multi-choice")
      .map((q) => {
        const counts: Record<string, number> = {};
        q.options?.forEach((o) => (counts[o] = 0));
        completed.forEach((i) => {
          const a = i.answers.find((x) => x.questionId === q.id);
          if (!a) return;
          if (Array.isArray(a.value)) a.value.forEach((v) => (counts[v] = (counts[v] ?? 0) + 1));
          else counts[a.value as string] = (counts[a.value as string] ?? 0) + 1;
        });
        return {
          question: q,
          data: Object.entries(counts).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0),
        };
      })
      .filter((c) => c.data.length > 0);
  }, [questions, completed]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Entrevistas totales</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.totalInterviews}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completadas</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.completed}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Presupuesto promedio</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">${Math.round(stats.avgBudget).toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Invitados promedio</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{Math.round(stats.avgGuests)}</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {choiceData.map(({ question, data }) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-base">{question.text}</CardTitle>
              <Badge variant="outline" className="w-fit text-xs">{question.category}</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                {question.type === "single-choice" ? (
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                      {data.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={data}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
