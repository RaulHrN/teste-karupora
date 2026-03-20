export interface Campaign {
  id: string;
  name: string;
  type: "reativacao" | "aniversario" | "promocional" | "informativo";
  status: "rascunho" | "agendada" | "enviada" | "cancelada";
  channel: "whatsapp" | "email";
  targetCount: number;
  sentCount: number;
  deliveredCount: number;
  createdAt: string;
  scheduledAt: string | null;
  sentAt: string | null;
  criteria: string;
}

export interface BirthdayPatient {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  dayOfWeek: string;
  messageSent: boolean;
}

export interface SegmentGroup {
  objective: string;
  count: number;
  active: number;
  inactive: number;
  avgAge: number;
}

export const mockCampaigns: Campaign[] = [
  { id: "c1", name: "Reativação — Inativos 60+ dias", type: "reativacao", status: "enviada", channel: "whatsapp", targetCount: 12, sentCount: 12, deliveredCount: 11, createdAt: "2026-03-10", scheduledAt: "2026-03-12", sentAt: "2026-03-12", criteria: "Sem consulta há 60+ dias" },
  { id: "c2", name: "Reativação — Inativos 90+ dias", type: "reativacao", status: "enviada", channel: "whatsapp", targetCount: 5, sentCount: 5, deliveredCount: 4, createdAt: "2026-02-15", scheduledAt: "2026-02-16", sentAt: "2026-02-16", criteria: "Sem consulta há 90+ dias" },
  { id: "c3", name: "Aniversariantes Março", type: "aniversario", status: "enviada", channel: "whatsapp", targetCount: 8, sentCount: 8, deliveredCount: 8, createdAt: "2026-03-01", scheduledAt: "2026-03-01", sentAt: "2026-03-01", criteria: "Aniversário em março" },
  { id: "c4", name: "Promoção Pacote Trimestral", type: "promocional", status: "agendada", channel: "email", targetCount: 25, sentCount: 0, deliveredCount: 0, createdAt: "2026-03-18", scheduledAt: "2026-03-25", sentAt: null, criteria: "Todos os pacientes ativos" },
  { id: "c5", name: "Dicas de Alimentação Saudável", type: "informativo", status: "rascunho", channel: "email", targetCount: 0, sentCount: 0, deliveredCount: 0, createdAt: "2026-03-19", scheduledAt: null, sentAt: null, criteria: "A definir" },
  { id: "c6", name: "Reativação — Janeiro", type: "reativacao", status: "enviada", channel: "whatsapp", targetCount: 9, sentCount: 9, deliveredCount: 7, createdAt: "2026-01-10", scheduledAt: "2026-01-12", sentAt: "2026-01-12", criteria: "Sem consulta há 60+ dias" },
];

export const mockBirthdayPatients: BirthdayPatient[] = [
  { id: "b1", name: "Fernanda Lima", birthDate: "2000-03-21", phone: "(11) 95432-1098", dayOfWeek: "Sábado", messageSent: false },
  { id: "b2", name: "Lucas Pereira", birthDate: "1993-03-22", phone: "(11) 91234-5678", dayOfWeek: "Domingo", messageSent: false },
  { id: "b3", name: "Camila Rocha", birthDate: "1987-03-24", phone: "(21) 98765-4321", dayOfWeek: "Terça", messageSent: false },
  { id: "b4", name: "Bruno Martins", birthDate: "1991-03-25", phone: "(31) 97654-3210", dayOfWeek: "Quarta", messageSent: true },
];

export const mockSegments: SegmentGroup[] = [
  { objective: "Emagrecimento", count: 28, active: 22, inactive: 6, avgAge: 38 },
  { objective: "Ganho de massa muscular", count: 15, active: 12, inactive: 3, avgAge: 29 },
  { objective: "Reeducação alimentar", count: 12, active: 9, inactive: 3, avgAge: 42 },
  { objective: "Nutrição esportiva", count: 8, active: 7, inactive: 1, avgAge: 26 },
  { objective: "Controle de diabetes", count: 6, active: 5, inactive: 1, avgAge: 52 },
  { objective: "Gestação saudável", count: 4, active: 4, inactive: 0, avgAge: 31 },
];
