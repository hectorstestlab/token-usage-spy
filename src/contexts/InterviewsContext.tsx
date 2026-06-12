import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import type { Interview, InterviewAnswer, InterviewQuestion, QuestionType } from "@/types/interviews";

const defaultQuestions: Omit<InterviewQuestion, "id">[] = [
  { text: "¿Cuáles son sus nombres completos?", type: "text", category: "Pareja", required: true },
  { text: "¿Cómo se conocieron?", type: "long-text", category: "Pareja" },
  { text: "Cuéntennos sobre la propuesta", type: "long-text", category: "Pareja" },
  { text: "¿Qué estilo de boda imaginan?", type: "single-choice", category: "Visión",
    options: ["Clásica","Rústica","Moderna","Bohemia","De destino","Íntima"] },
  { text: "Tres palabras que describan el ambiente deseado", type: "text", category: "Visión" },
  { text: "¿Qué es indispensable para ustedes?", type: "long-text", category: "Visión" },
  { text: "Fecha tentativa de la boda", type: "date", category: "Logística", required: true },
  { text: "Número estimado de invitados", type: "number", category: "Logística", required: true },
  { text: "¿Tienen una ciudad o lugar en mente?", type: "text", category: "Logística" },
  { text: "Tipo de ceremonia", type: "single-choice", category: "Logística",
    options: ["Religiosa","Civil","Simbólica","Mixta"] },
  { text: "Presupuesto total estimado (USD)", type: "number", category: "Presupuesto", required: true },
  { text: "Prioridades de inversión", type: "multi-choice", category: "Presupuesto",
    options: ["Lugar","Catering","Fotografía","Música","Decoración","Vestuario","Video"] },
  { text: "¿Qué servicios necesitan?", type: "multi-choice", category: "Servicios",
    options: ["Coordinación completa","Sólo día del evento","Diseño y decoración","Asesoría de proveedores"] },
];

interface InterviewsContextValue {
  loading: boolean;
  questions: InterviewQuestion[];
  addQuestion: (q: Omit<InterviewQuestion, "id">) => Promise<void>;
  removeQuestion: (id: string) => Promise<void>;
  interviews: Interview[];
  createInterview: (clientName: string) => Promise<Interview | null>;
  saveAnswers: (interviewId: string, answers: InterviewAnswer[], status?: Interview["status"], notes?: string) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  seedDefaults: () => Promise<void>;
}

const InterviewsContext = createContext<InterviewsContextValue | null>(null);

export function InterviewsProvider({ children }: { children: ReactNode }) {
  const { user, role } = useUser();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const refresh = useCallback(async () => {
    if (!user || role !== "planner") {
      setQuestions([]); setInterviews([]);
      return;
    }
    setLoading(true);
    try {
      const [{ data: qs }, { data: is }, { data: ans }] = await Promise.all([
        supabase.from("interview_questions").select("*").order("sort_order", { ascending: true }),
        supabase.from("interviews").select("*").order("created_at", { ascending: false }),
        supabase.from("interview_answers").select("*"),
      ]);
      setQuestions(
        (qs ?? []).map((q: any) => ({
          id: q.id, text: q.text, type: q.type as QuestionType,
          category: q.category, options: q.options ?? undefined, required: !!q.required,
        }))
      );
      const ansByInterview = new Map<string, InterviewAnswer[]>();
      (ans ?? []).forEach((a: any) => {
        const arr = ansByInterview.get(a.interview_id) ?? [];
        arr.push({ questionId: a.question_id, value: a.value });
        ansByInterview.set(a.interview_id, arr);
      });
      setInterviews(
        (is ?? []).map((i: any) => ({
          id: i.id, clientName: i.client_name, weddingId: i.wedding_id ?? undefined,
          date: i.interview_date, status: i.status as Interview["status"],
          notes: i.notes ?? undefined,
          answers: ansByInterview.get(i.id) ?? [],
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => { refresh(); }, [refresh]);

  const addQuestion: InterviewsContextValue["addQuestion"] = async (q) => {
    if (!user) return;
    const { error } = await supabase.from("interview_questions").insert({
      planner_id: user.id, text: q.text, type: q.type, category: q.category,
      options: q.options ?? null, required: q.required ?? false,
      sort_order: questions.length,
    });
    if (error) { toast.error(error.message); return; }
    await refresh();
  };

  const removeQuestion: InterviewsContextValue["removeQuestion"] = async (id) => {
    const { error } = await supabase.from("interview_questions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const seedDefaults: InterviewsContextValue["seedDefaults"] = async () => {
    if (!user) return;
    const rows = defaultQuestions.map((q, i) => ({
      planner_id: user.id, text: q.text, type: q.type, category: q.category,
      options: q.options ?? null, required: q.required ?? false, sort_order: i,
    }));
    const { error } = await supabase.from("interview_questions").insert(rows);
    if (error) { toast.error(error.message); return; }
    toast.success("Preguntas por defecto cargadas");
    await refresh();
  };

  const createInterview: InterviewsContextValue["createInterview"] = async (clientName) => {
    if (!user) return null;
    const { data, error } = await supabase.from("interviews").insert({
      planner_id: user.id, client_name: clientName, status: "Borrador",
    }).select("*").single();
    if (error || !data) { toast.error(error?.message ?? "Error"); return null; }
    const created: Interview = {
      id: (data as any).id, clientName: (data as any).client_name,
      date: (data as any).interview_date, status: "Borrador", answers: [],
    };
    setInterviews((prev) => [created, ...prev]);
    return created;
  };

  const saveAnswers: InterviewsContextValue["saveAnswers"] = async (interviewId, answers, status, notes) => {
    // Replace all answers
    await supabase.from("interview_answers").delete().eq("interview_id", interviewId);
    if (answers.length) {
      await supabase.from("interview_answers").insert(
        answers.map((a) => ({ interview_id: interviewId, question_id: a.questionId, value: a.value as any }))
      );
    }
    await supabase.from("interviews").update({
      status: status ?? undefined, notes: notes ?? undefined,
    }).eq("id", interviewId);
    await refresh();
  };

  const deleteInterview: InterviewsContextValue["deleteInterview"] = async (id) => {
    const { error } = await supabase.from("interviews").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setInterviews((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <InterviewsContext.Provider value={{
      loading, questions, addQuestion, removeQuestion,
      interviews, createInterview, saveAnswers, deleteInterview, seedDefaults,
    }}>
      {children}
    </InterviewsContext.Provider>
  );
}

export function useInterviews() {
  const ctx = useContext(InterviewsContext);
  if (!ctx) throw new Error("useInterviews must be used within InterviewsProvider");
  return ctx;
}
