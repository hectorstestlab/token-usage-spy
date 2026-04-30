import { createContext, useContext, useState, ReactNode } from "react";
import type { Interview, InterviewAnswer, InterviewQuestion } from "@/types/interviews";

const id = () => Math.random().toString(36).slice(2, 10);

const defaultQuestions: InterviewQuestion[] = [
  // Pareja
  { id: "q-couple-names", text: "¿Cuáles son sus nombres completos?", type: "text", category: "Pareja", required: true },
  { id: "q-how-met", text: "¿Cómo se conocieron?", type: "long-text", category: "Pareja" },
  { id: "q-engagement", text: "Cuéntennos sobre la propuesta", type: "long-text", category: "Pareja" },
  // Visión
  { id: "q-style", text: "¿Qué estilo de boda imaginan?", type: "single-choice", category: "Visión",
    options: ["Clásica", "Rústica", "Moderna", "Bohemia", "De destino", "Íntima"] },
  { id: "q-vibe", text: "Tres palabras que describan el ambiente deseado", type: "text", category: "Visión" },
  { id: "q-must-have", text: "¿Qué es indispensable para ustedes?", type: "long-text", category: "Visión" },
  // Logística
  { id: "q-date", text: "Fecha tentativa de la boda", type: "date", category: "Logística", required: true },
  { id: "q-guests", text: "Número estimado de invitados", type: "number", category: "Logística", required: true },
  { id: "q-location", text: "¿Tienen una ciudad o lugar en mente?", type: "text", category: "Logística" },
  { id: "q-ceremony", text: "Tipo de ceremonia", type: "single-choice", category: "Logística",
    options: ["Religiosa", "Civil", "Simbólica", "Mixta"] },
  // Presupuesto
  { id: "q-budget", text: "Presupuesto total estimado (USD)", type: "number", category: "Presupuesto", required: true },
  { id: "q-priorities", text: "Prioridades de inversión", type: "multi-choice", category: "Presupuesto",
    options: ["Lugar", "Catering", "Fotografía", "Música", "Decoración", "Vestuario", "Video"] },
  // Servicios
  { id: "q-services", text: "¿Qué servicios necesitan?", type: "multi-choice", category: "Servicios",
    options: ["Coordinación completa", "Sólo día del evento", "Diseño y decoración", "Asesoría de proveedores"] },
];

interface InterviewsContextValue {
  questions: InterviewQuestion[];
  addQuestion: (q: Omit<InterviewQuestion, "id">) => void;
  removeQuestion: (id: string) => void;
  interviews: Interview[];
  createInterview: (clientName: string) => Interview;
  saveAnswers: (interviewId: string, answers: InterviewAnswer[], status?: Interview["status"], notes?: string) => void;
  deleteInterview: (id: string) => void;
}

const InterviewsContext = createContext<InterviewsContextValue | null>(null);

const sampleInterviews: Interview[] = [
  {
    id: id(),
    clientName: "Sara y Miguel",
    date: new Date(2026, 0, 12).toISOString(),
    status: "Completada",
    answers: [
      { questionId: "q-couple-names", value: "Sara Pérez y Miguel Torres" },
      { questionId: "q-style", value: "Rústica" },
      { questionId: "q-guests", value: "150" },
      { questionId: "q-budget", value: "45000" },
      { questionId: "q-ceremony", value: "Religiosa" },
      { questionId: "q-priorities", value: ["Lugar", "Fotografía", "Música"] },
    ],
  },
  {
    id: id(),
    clientName: "Emma y Jaime",
    date: new Date(2026, 1, 3).toISOString(),
    status: "Completada",
    answers: [
      { questionId: "q-couple-names", value: "Emma Ruiz y Jaime López" },
      { questionId: "q-style", value: "Moderna" },
      { questionId: "q-guests", value: "200" },
      { questionId: "q-budget", value: "62000" },
      { questionId: "q-ceremony", value: "Civil" },
      { questionId: "q-priorities", value: ["Catering", "Decoración", "Música"] },
    ],
  },
  {
    id: id(),
    clientName: "Sofía y Liam",
    date: new Date(2026, 2, 18).toISOString(),
    status: "En curso",
    answers: [
      { questionId: "q-couple-names", value: "Sofía Mendoza y Liam Cruz" },
      { questionId: "q-style", value: "De destino" },
      { questionId: "q-guests", value: "80" },
    ],
  },
];

export function InterviewsProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(defaultQuestions);
  const [interviews, setInterviews] = useState<Interview[]>(sampleInterviews);

  const createInterview = (clientName: string) => {
    const newOne: Interview = {
      id: id(),
      clientName,
      date: new Date().toISOString(),
      status: "Borrador",
      answers: [],
    };
    setInterviews((prev) => [newOne, ...prev]);
    return newOne;
  };

  const saveAnswers: InterviewsContextValue["saveAnswers"] = (interviewId, answers, status, notes) => {
    setInterviews((prev) =>
      prev.map((i) =>
        i.id === interviewId ? { ...i, answers, status: status ?? i.status, notes: notes ?? i.notes } : i
      )
    );
  };

  return (
    <InterviewsContext.Provider
      value={{
        questions,
        addQuestion: (q) => setQuestions((prev) => [...prev, { ...q, id: id() }]),
        removeQuestion: (qid) => setQuestions((prev) => prev.filter((q) => q.id !== qid)),
        interviews,
        createInterview,
        saveAnswers,
        deleteInterview: (iid) => setInterviews((prev) => prev.filter((i) => i.id !== iid)),
      }}
    >
      {children}
    </InterviewsContext.Provider>
  );
}

export function useInterviews() {
  const ctx = useContext(InterviewsContext);
  if (!ctx) throw new Error("useInterviews must be used within InterviewsProvider");
  return ctx;
}
