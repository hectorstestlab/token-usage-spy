import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, Trash2, ClipboardList, BarChart3, FileQuestion } from "lucide-react";
import { useInterviews } from "@/contexts/InterviewsContext";
import { InterviewRunner } from "./InterviewRunner";
import { QuestionManager } from "./QuestionManager";
import { InterviewAnalytics } from "./InterviewAnalytics";
import type { Interview } from "@/types/interviews";

function NewInterviewDialog({ onCreated }: { onCreated: (i: Interview) => void }) {
  const { createInterview } = useInterviews();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    const i = createInterview(name.trim().slice(0, 100));
    setOpen(false);
    setName("");
    onCreated(i);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1" /> Nueva entrevista</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nueva entrevista inicial</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <Label>Nombres de la pareja</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Ej. Ana y Carlos" />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Iniciar entrevista</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InterviewDetail({ interview, onClose }: { interview: Interview; onClose: () => void }) {
  const { questions } = useInterviews();
  const grouped = questions.reduce<Record<string, typeof questions>>((acc, q) => {
    (acc[q.category] ??= []).push(q);
    return acc;
  }, {});
  const getAnswer = (qid: string) => interview.answers.find((a) => a.questionId === qid)?.value;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{interview.clientName}</DialogTitle>
          <div className="flex gap-2 pt-1">
            <Badge variant="secondary">{interview.status}</Badge>
            <span className="text-xs text-muted-foreground self-center">
              {new Date(interview.date).toLocaleDateString()}
            </span>
          </div>
        </DialogHeader>
        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, qs]) => {
            const answered = qs.filter((q) => getAnswer(q.id) !== undefined);
            if (answered.length === 0) return null;
            return (
              <div key={cat}>
                <h4 className="text-sm font-semibold mb-2">{cat}</h4>
                <div className="space-y-2">
                  {answered.map((q) => {
                    const v = getAnswer(q.id);
                    return (
                      <div key={q.id} className="p-3 rounded-md bg-muted/40">
                        <p className="text-xs text-muted-foreground">{q.text}</p>
                        <p className="text-sm font-medium mt-1">
                          {Array.isArray(v) ? v.join(", ") : v}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {interview.notes && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Notas</h4>
              <p className="text-sm whitespace-pre-wrap p-3 rounded-md bg-muted/40">{interview.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PlannerInterviews() {
  const { interviews, deleteInterview } = useInterviews();
  const [running, setRunning] = useState<Interview | null>(null);
  const [viewing, setViewing] = useState<Interview | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entrevistas iniciales</h1>
          <p className="text-muted-foreground">Acompaña la primera reunión con los novios y captura datos clave</p>
        </div>
        <NewInterviewDialog onCreated={setRunning} />
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list"><ClipboardList className="h-4 w-4 mr-1" /> Entrevistas</TabsTrigger>
          <TabsTrigger value="questions"><FileQuestion className="h-4 w-4 mr-1" /> Preguntas</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-1" /> Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-3 mt-4">
          {interviews.length === 0 && (
            <Card><CardContent className="p-6 text-center text-muted-foreground">Aún no has creado entrevistas.</CardContent></Card>
          )}
          {interviews.map((i) => (
            <Card key={i.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-semibold">{i.clientName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(i.date).toLocaleDateString()} · {i.answers.length} respuestas
                  </p>
                </div>
                <Badge variant={i.status === "Completada" ? "default" : "secondary"}>{i.status}</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setViewing(i)}>
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setRunning(i)}>
                    Continuar
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteInterview(i.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="questions" className="mt-4"><QuestionManager /></TabsContent>
        <TabsContent value="analytics" className="mt-4"><InterviewAnalytics /></TabsContent>
      </Tabs>

      {running && (
        <InterviewRunner
          interview={running}
          open
          onOpenChange={(o) => { if (!o) setRunning(null); }}
        />
      )}
      {viewing && <InterviewDetail interview={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
