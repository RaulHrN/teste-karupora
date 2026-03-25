// Agenda occupation data (last 6 months)
export const occupationData = [
  { month: "Out/25", slots: 120, occupied: 78, rate: 65 },
  { month: "Nov/25", slots: 120, occupied: 90, rate: 75 },
  { month: "Dez/25", slots: 100, occupied: 72, rate: 72 },
  { month: "Jan/26", slots: 120, occupied: 96, rate: 80 },
  { month: "Fev/26", slots: 110, occupied: 93, rate: 85 },
  { month: "Mar/26", slots: 120, occupied: 102, rate: 85 },
];

// Return rate by month
export const returnRateData = [
  { month: "Out/25", firstVisit: 12, returned: 8, rate: 67 },
  { month: "Nov/25", firstVisit: 15, returned: 11, rate: 73 },
  { month: "Dez/25", firstVisit: 10, returned: 6, rate: 60 },
  { month: "Jan/26", firstVisit: 18, returned: 14, rate: 78 },
  { month: "Fev/26", firstVisit: 14, returned: 12, rate: 86 },
  { month: "Mar/26", firstVisit: 16, returned: 13, rate: 81 },
];

// New vs recurring patients
export const patientTypeData = [
  { month: "Out/25", novos: 12, recorrentes: 28 },
  { month: "Nov/25", novos: 15, recorrentes: 30 },
  { month: "Dez/25", novos: 10, recorrentes: 25 },
  { month: "Jan/26", novos: 18, recorrentes: 32 },
  { month: "Fev/26", novos: 14, recorrentes: 35 },
  { month: "Mar/26", novos: 16, recorrentes: 38 },
];

// Individual patient progress
export const patientProgress = [
  {
    id: "1", name: "Maria Silva", objective: "Emagrecimento",
    startDate: "2025-06-10", totalVisits: 12, adherence: 92,
    weightHistory: [
      { date: "Jun/25", weight: 82, imc: 31.2 },
      { date: "Ago/25", weight: 79.5, imc: 30.2 },
      { date: "Out/25", weight: 77, imc: 29.3 },
      { date: "Dez/25", weight: 75.2, imc: 28.6 },
      { date: "Fev/26", weight: 73.8, imc: 28.1 },
      { date: "Mar/26", weight: 72.5, imc: 27.6 },
    ],
  },
  {
    id: "2", name: "João Santos", objective: "Ganho de massa",
    startDate: "2025-08-20", totalVisits: 8, adherence: 85,
    weightHistory: [
      { date: "Ago/25", weight: 70, imc: 22.5 },
      { date: "Out/25", weight: 72.3, imc: 23.2 },
      { date: "Dez/25", weight: 74.1, imc: 23.8 },
      { date: "Fev/26", weight: 75.8, imc: 24.3 },
      { date: "Mar/26", weight: 76.5, imc: 24.6 },
    ],
  },
  {
    id: "3", name: "Ana Oliveira", objective: "Controle diabetes",
    startDate: "2025-09-05", totalVisits: 6, adherence: 70,
    weightHistory: [
      { date: "Set/25", weight: 88, imc: 33.5 },
      { date: "Nov/25", weight: 86.5, imc: 32.9 },
      { date: "Jan/26", weight: 85, imc: 32.3 },
      { date: "Mar/26", weight: 84.2, imc: 32.0 },
    ],
  },
  {
    id: "5", name: "Fernanda Lima", objective: "Nutrição esportiva",
    startDate: "2026-01-10", totalVisits: 4, adherence: 98,
    weightHistory: [
      { date: "Jan/26", weight: 62, imc: 22.0 },
      { date: "Fev/26", weight: 62.5, imc: 22.2 },
      { date: "Mar/26", weight: 63.1, imc: 22.4 },
    ],
  },
  {
    id: "6", name: "Roberto Almeida", objective: "Emagrecimento",
    startDate: "2025-11-01", totalVisits: 5, adherence: 55,
    weightHistory: [
      { date: "Nov/25", weight: 105, imc: 34.8 },
      { date: "Jan/26", weight: 103, imc: 34.1 },
      { date: "Mar/26", weight: 101.5, imc: 33.6 },
    ],
  },
];
