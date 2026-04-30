export type QuestionType = "text" | "long-text" | "number" | "date" | "single-choice" | "multi-choice";

export interface InterviewQuestion {
  id: string;
  text: string;
  type: QuestionType;
  category: string;
  options?: string[];
  required?: boolean;
}

export interface InterviewAnswer {
  questionId: string;
  value: string | string[];
}

export interface Interview {
  id: string;
  clientName: string;
  weddingId?: string;
  date: string;
  status: "Borrador" | "En curso" | "Completada";
  answers: InterviewAnswer[];
  notes?: string;
}
