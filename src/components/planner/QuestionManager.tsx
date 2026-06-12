import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useInterviews } from "@/contexts/InterviewsContext";
import type { QuestionType } from "@/types/interviews";
import { toast } from "sonner";

const typeLabels: Record<QuestionType, string> = {
  text: "Texto corto",
  "long-text": "Texto largo",
  number: "Número",
  date: "Fecha",
  "single-choice": "Opción única",
  "multi-choice": "Opciones múltiples",
};

export function QuestionManager() {
  const { questions, addQuestion, removeQuestion, seedDefaults } = useInterviews();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<QuestionType>("text");
  const [optionsInput, setOptionsInput] = useState("");

  const categories = Array.from(new Set(questions.map((q) => q.category)));

  const handleAdd = () => {
    if (!text.trim() || !category.trim()) {
      toast.error("Completa la pregunta y la categoría");
      return;
    }
    const needsOptions = type === "single-choice" || type === "multi-choice";
    const options = needsOptions
      ? optionsInput.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    if (needsOptions && (!options || options.length < 2)) {
      toast.error("Agrega al menos 2 opciones separadas por coma");
      return;
    }
    addQuestion({ text: text.trim().slice(0, 200), category: category.trim().slice(0, 50), type, options });
    setText("");
    setOptionsInput("");
    toast.success("Pregunta agregada");
  };

  return (
    <div className="space-y-6">
      {questions.length === 0 && (
        <Card>
          <CardContent className="p-5 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Aún no tienes preguntas configuradas.</p>
            <Button variant="outline" onClick={seedDefaults}>Cargar preguntas por defecto</Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agregar pregunta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Pregunta</Label>
            <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder="¿Qué quieres preguntar?" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="cat-list"
                maxLength={50}
                placeholder="Ej. Visión"
              />
              <datalist id="cat-list">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(type === "single-choice" || type === "multi-choice") && (
            <div className="space-y-2">
              <Label>Opciones (separadas por coma)</Label>
              <Input value={optionsInput} onChange={(e) => setOptionsInput(e.target.value)} placeholder="Opción 1, Opción 2, ..." />
            </div>
          )}
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> Agregar pregunta
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {categories.map((cat) => (
          <Card key={cat}>
            <CardHeader>
              <CardTitle className="text-base">{cat}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {questions.filter((q) => q.category === cat).map((q) => (
                <div key={q.id} className="flex items-start justify-between gap-3 p-3 rounded-md border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.text}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{typeLabels[q.type]}</Badge>
                      {q.required && <Badge variant="secondary" className="text-xs">Requerida</Badge>}
                    </div>
                    {q.options && (
                      <p className="text-xs text-muted-foreground mt-1">{q.options.join(" · ")}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
