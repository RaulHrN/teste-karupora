import { Patient } from "./patients";

export interface Anamnese {
  id: string;
  patientId: string;
  date: string;
  // Recordatório 24h
  recordatorio24h: {
    cafeManha: string;
    lancheManha: string;
    almoco: string;
    lancheTarde: string;
    jantar: string;
    ceia: string;
  };
  // Frequência alimentar
  frequenciaAlimentar: {
    frutas: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    verduras: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    carnes: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    laticinios: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    cereais: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    leguminosas: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    doces: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    frituras: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    refrigerantes: "diario" | "semanal" | "quinzenal" | "raramente" | "nunca";
    agua: string; // litros/dia
  };
  preferencias: string;
  aversoes: string;
  restricoes: string;
  historicoDietas: string;
  habitoIntestinal: string;
  nivelAtividade: "sedentario" | "leve" | "moderado" | "intenso" | "muito_intenso";
  horasSono: number;
  nivelEstresse: "baixo" | "moderado" | "alto";
  observacoes: string;
}

export interface MealItem {
  food: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  time: string;
  items: MealItem[];
}

export interface MealPlan {
  id: string;
  patientId: string;
  date: string;
  title: string;
  targetCalories: number;
  meals: Meal[];
}

export interface BodyMetrics {
  date: string;
  weight: number; // kg
  height: number; // cm
  imc: number;
  circunferenciaCintura?: number;
  circunferenciaQuadril?: number;
  circunferenciaBraco?: number;
  percentualGordura?: number;
}

export const mockBodyMetrics: BodyMetrics[] = [
  { date: "2025-07-15", weight: 82.5, height: 168, imc: 29.2, circunferenciaCintura: 92, circunferenciaQuadril: 104, percentualGordura: 32 },
  { date: "2025-08-15", weight: 80.8, height: 168, imc: 28.6, circunferenciaCintura: 90, circunferenciaQuadril: 103, percentualGordura: 31 },
  { date: "2025-09-15", weight: 79.2, height: 168, imc: 28.1, circunferenciaCintura: 88, circunferenciaQuadril: 101, percentualGordura: 29.5 },
  { date: "2025-10-15", weight: 78.0, height: 168, imc: 27.6, circunferenciaCintura: 87, circunferenciaQuadril: 100, percentualGordura: 28.5 },
  { date: "2025-11-15", weight: 76.5, height: 168, imc: 27.1, circunferenciaCintura: 85, circunferenciaQuadril: 99, percentualGordura: 27.8 },
  { date: "2025-12-15", weight: 75.8, height: 168, imc: 26.9, circunferenciaCintura: 84, circunferenciaQuadril: 98, percentualGordura: 27 },
  { date: "2026-01-15", weight: 74.2, height: 168, imc: 26.3, circunferenciaCintura: 82, circunferenciaQuadril: 97, percentualGordura: 26 },
  { date: "2026-02-15", weight: 73.5, height: 168, imc: 26.0, circunferenciaCintura: 81, circunferenciaQuadril: 96, percentualGordura: 25.5 },
  { date: "2026-03-18", weight: 72.1, height: 168, imc: 25.5, circunferenciaCintura: 80, circunferenciaQuadril: 95, percentualGordura: 24.8 },
];

export const mockMealPlan: MealPlan = {
  id: "mp-1",
  patientId: "1",
  date: "2026-03-18",
  title: "Plano Alimentar — Emagrecimento Fase 3",
  targetCalories: 1600,
  meals: [
    {
      name: "Café da manhã",
      time: "07:00",
      items: [
        { food: "Pão integral", quantity: "2 fatias (50g)", calories: 130, protein: 5, carbs: 24, fat: 2 },
        { food: "Ovo mexido", quantity: "2 unidades", calories: 140, protein: 12, carbs: 1, fat: 10 },
        { food: "Mamão papaia", quantity: "1/2 unidade", calories: 60, protein: 0.5, carbs: 15, fat: 0 },
        { food: "Café com leite desnatado", quantity: "200ml", calories: 50, protein: 4, carbs: 6, fat: 0.5 },
      ],
    },
    {
      name: "Lanche da manhã",
      time: "10:00",
      items: [
        { food: "Iogurte natural desnatado", quantity: "170g", calories: 90, protein: 8, carbs: 10, fat: 1 },
        { food: "Granola sem açúcar", quantity: "2 colheres (30g)", calories: 110, protein: 3, carbs: 18, fat: 3 },
      ],
    },
    {
      name: "Almoço",
      time: "12:30",
      items: [
        { food: "Arroz integral", quantity: "4 colheres (100g)", calories: 130, protein: 3, carbs: 28, fat: 1 },
        { food: "Feijão carioca", quantity: "1 concha (80g)", calories: 76, protein: 5, carbs: 13, fat: 0.5 },
        { food: "Frango grelhado", quantity: "120g", calories: 165, protein: 31, carbs: 0, fat: 3.5 },
        { food: "Salada verde", quantity: "à vontade", calories: 25, protein: 1.5, carbs: 4, fat: 0.3 },
        { food: "Azeite extra virgem", quantity: "1 colher de sopa", calories: 90, protein: 0, carbs: 0, fat: 10 },
      ],
    },
    {
      name: "Lanche da tarde",
      time: "15:30",
      items: [
        { food: "Banana", quantity: "1 unidade média", calories: 90, protein: 1, carbs: 23, fat: 0.3 },
        { food: "Pasta de amendoim", quantity: "1 colher de sopa (15g)", calories: 94, protein: 4, carbs: 3, fat: 8 },
      ],
    },
    {
      name: "Jantar",
      time: "19:00",
      items: [
        { food: "Salmão grelhado", quantity: "130g", calories: 208, protein: 25, carbs: 0, fat: 12 },
        { food: "Batata doce", quantity: "1 unidade média (150g)", calories: 130, protein: 2, carbs: 30, fat: 0 },
        { food: "Brócolis no vapor", quantity: "100g", calories: 35, protein: 3, carbs: 7, fat: 0.4 },
      ],
    },
    {
      name: "Ceia",
      time: "21:00",
      items: [
        { food: "Chá de camomila", quantity: "200ml", calories: 2, protein: 0, carbs: 0.5, fat: 0 },
      ],
    },
  ],
};
