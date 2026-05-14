export interface ChatResponse {
  reply: string;
  quiz?: {
    question: string;
    options: string[]; // 5 options A‑E
    correctIndex: number; // 0‑4 (not sent to client UI)
  };
}
