export interface Transaction {
  id: string;
  patientId: string;
  patientName: string;
  description: string;
  value: number;
  date: string;
  dueDate: string;
  paidAt: string | null;
  status: "pago" | "pendente" | "atrasado" | "cancelado";
  method: "pix" | "boleto" | "cartao" | "dinheiro" | null;
  type: "consulta" | "retorno" | "teleconsulta" | "pacote";
  recurrent: boolean;
}

export const mockTransactions: Transaction[] = [
  { id: "t1", patientId: "1", patientName: "Maria Silva", description: "Consulta de retorno", value: 250, date: "2026-03-18", dueDate: "2026-03-18", paidAt: "2026-03-18", status: "pago", method: "pix", type: "retorno", recurrent: false },
  { id: "t2", patientId: "2", patientName: "João Santos", description: "Consulta de retorno", value: 250, date: "2026-03-15", dueDate: "2026-03-15", paidAt: "2026-03-15", status: "pago", method: "cartao", type: "retorno", recurrent: false },
  { id: "t3", patientId: "3", patientName: "Ana Oliveira", description: "Consulta de retorno", value: 250, date: "2026-02-28", dueDate: "2026-02-28", paidAt: null, status: "atrasado", method: null, type: "retorno", recurrent: false },
  { id: "t4", patientId: "5", patientName: "Fernanda Lima", description: "Pacote mensal", value: 800, date: "2026-03-01", dueDate: "2026-03-05", paidAt: "2026-03-03", status: "pago", method: "pix", type: "pacote", recurrent: true },
  { id: "t5", patientId: "6", patientName: "Roberto Almeida", description: "Primeira consulta", value: 350, date: "2026-03-10", dueDate: "2026-03-10", paidAt: null, status: "pendente", method: null, type: "consulta", recurrent: false },
  { id: "t6", patientId: "4", patientName: "Carlos Souza", description: "Consulta de retorno", value: 250, date: "2025-12-10", dueDate: "2025-12-10", paidAt: null, status: "atrasado", method: null, type: "retorno", recurrent: false },
  { id: "t7", patientId: "8", patientName: "Ricardo Gomes", description: "Primeira consulta", value: 350, date: "2026-01-05", dueDate: "2026-01-10", paidAt: null, status: "atrasado", method: null, type: "consulta", recurrent: false },
  { id: "t8", patientId: "7", patientName: "Paula Mendes", description: "Consulta de retorno", value: 250, date: "2026-01-12", dueDate: "2026-01-15", paidAt: "2026-01-14", status: "pago", method: "boleto", type: "retorno", recurrent: false },
  { id: "t9", patientId: "1", patientName: "Maria Silva", description: "Consulta de retorno", value: 250, date: "2026-02-20", dueDate: "2026-02-20", paidAt: "2026-02-20", status: "pago", method: "pix", type: "retorno", recurrent: false },
  { id: "t10", patientId: "1", patientName: "Maria Silva", description: "Primeira consulta", value: 350, date: "2026-01-15", dueDate: "2026-01-15", paidAt: "2026-01-15", status: "pago", method: "pix", type: "consulta", recurrent: false },
  { id: "t11", patientId: "5", patientName: "Fernanda Lima", description: "Teleconsulta", value: 200, date: "2026-03-19", dueDate: "2026-03-19", paidAt: "2026-03-19", status: "pago", method: "cartao", type: "teleconsulta", recurrent: false },
  { id: "t12", patientId: "2", patientName: "João Santos", description: "Primeira consulta", value: 350, date: "2026-02-10", dueDate: "2026-02-10", paidAt: "2026-02-10", status: "pago", method: "pix", type: "consulta", recurrent: false },
  { id: "t13", patientId: "6", patientName: "Roberto Almeida", description: "Consulta de retorno", value: 250, date: "2026-01-20", dueDate: "2026-01-25", paidAt: null, status: "atrasado", method: null, type: "retorno", recurrent: false },
  { id: "t14", patientId: "3", patientName: "Ana Oliveira", description: "Primeira consulta", value: 350, date: "2026-01-08", dueDate: "2026-01-08", paidAt: "2026-01-08", status: "pago", method: "dinheiro", type: "consulta", recurrent: false },
  { id: "t15", patientId: "5", patientName: "Fernanda Lima", description: "Pacote mensal", value: 800, date: "2026-02-01", dueDate: "2026-02-05", paidAt: "2026-02-04", status: "pago", method: "pix", type: "pacote", recurrent: true },
];

export const monthlyRevenue = [
  { month: "Out/25", receita: 3200, projecao: null },
  { month: "Nov/25", receita: 4100, projecao: null },
  { month: "Dez/25", receita: 3800, projecao: null },
  { month: "Jan/26", receita: 5650, projecao: null },
  { month: "Fev/26", receita: 5100, projecao: null },
  { month: "Mar/26", receita: 4850, projecao: null },
  { month: "Abr/26", receita: null, projecao: 5200 },
  { month: "Mai/26", receita: null, projecao: 5500 },
  { month: "Jun/26", receita: null, projecao: 5800 },
];
