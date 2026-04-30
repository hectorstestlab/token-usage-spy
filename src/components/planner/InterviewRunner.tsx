import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useInterviews } from "@/contexts/InterviewsContext";
import type { Interview, InterviewAnswer } from "@/types/interviews";
import { toast } from "sonner";

interface Props {
  interview: Interview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InterviewRunner({ interview, open, onOpenChange }: Props) {
  const { questions, saveAnswers } = useInterviews();
  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(() => {
    const map: Record<string, string | string[]> = {};
    interview.answers.forEach((a) => (map[a.questionId] = a.value));
    return map;
  });
  const [notes, setNotes] = useState(interview.notes ?? "");

  const currentCategory = categories[step];
  const currentQuestions = questions.filter((q) => q.category === currentCategory);
  const isNotesStep = step === categories.length;
  const totalSteps = categories.length + 1;
  const progress = ((step + 1) / totalSteps) * 100;

  const setValue = (qid: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const buildAnswers = (): InterviewAnswer[] =>
    Object.entries(answers)
      .filter(([_, v]) => (Array.isArray(v) ? v.length > 0 : v !== ""))
      .map(([questionId, value]) => ({ questionId, value }));

  const handleSaveDraft = () => {
    saveAnswers(interview.id, buildAnswers(), "En curso", notes);
    toast.success("Borrador guardado");
    onOpenChange(false);
  };

  const handleComplete = () => {
    saveAnswers(interview.id, buildAnswers(), "Completada", notes);
    toast.success("Entrevista completada");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Entrevista — {interview.clientName}</DialogTitle>
          <div className="flex items-center gap-3 pt-2">
            <Badge variant="secondary">
              {isNotesStep ? "Notas finales" : currentCategory}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Paso {step + 1} de {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="mt-2" />
        </DialogHeader>

        <div className="space-y-5 py-2">
          {!isNotesStep &&
            currentQuestions.map((q) => (
              <div key={q.id} className="space-y-2">
                <Label className="text-sm font-medium">
                  {q.text}
                  {q.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {q.type === "text" && (
                  <Input
                    value={(answers[q.id] as string) ?? ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                    maxLength={200}
                  />
                )}

                {q.type === "long-text" && (
                  <Textarea
                    value={(answers[q.id] as string) ?? ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                    maxLength={1000}
                    rows={3}
                  />
                )}

                {q.type === "number" && (
                  <Input
                    type="number"
                    value={(answers[q.id] as string) ?? ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                  />
                )}

                {q.type === "date" && (
                  <Input
                    type="date"
                    value={(answers[q.id] as string) ?? ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                  />
                )}

                {q.type === "single-choice" && (
                  <RadioGroup
                    value={(answers[q.id] as string) ?? ""}
                    onValueChange={(v) => setValue(q.id, v)}
                  >
                    {q.options?.map((opt) => (
                      <div key={opt} className="flex items-center gap-2">
                        <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                        <Label htmlFor={`${q.id}-${opt}`} className="font-normal">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {q.type === "multi-choice" && (
                  <div className="space-y-2">
                    {q.options?.map((opt) => {
                      const arr = (answers[q.id] as string[]) ?? [];
                      const checked = arr.includes(opt);
                      return (
                        <div key={opt} className="flex items-center gap-2">
                          <Checkbox
                            id={`${q.id}-${opt}`}
                            checked={checked}
                            onCheckedChange={(c) => {
                              const next = c ? [...arr, opt] : arr.filter((x) => x !== opt);
                              setValue(q.id, next);
                            }}
                          />
                          <Label htmlFor={`${q.id}-${opt}`} className="font-normal">{opt}</Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

          {isNotesStep && (
            <div className="space-y-2">
              <Label>Notas privadas del planner</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={2000}
                rows={6}
                placeholder="Impresiones, expectativas, próximos pasos..."
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <Button variant="ghost" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-1" /> Guardar borrador
          </Button>
          {!isNotesStep ? (
            <Button onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}>
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>Completar entrevista</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
