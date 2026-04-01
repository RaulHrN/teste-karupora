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

export const mockMealPlans: Record<string, MealPlan[]> = {
  "1": [
    {
      id: "mp-1",
      patientId: "1",
      date: "2026-03-18",
      title: "Plano Alimentar — Emagrecimento Fase 3",
      targetCalories: 1600,
      meals: [
        {
          name: "Café da manhã", time: "07:00",
          items: [
            { food: "Pão integral", quantity: "2 fatias (50g)", calories: 130, protein: 5, carbs: 24, fat: 2 },
            { food: "Ovo mexido", quantity: "2 unidades", calories: 140, protein: 12, carbs: 1, fat: 10 },
            { food: "Mamão papaia", quantity: "1/2 unidade", calories: 60, protein: 0.5, carbs: 15, fat: 0 },
            { food: "Café com leite desnatado", quantity: "200ml", calories: 50, protein: 4, carbs: 6, fat: 0.5 },
          ],
        },
        {
          name: "Lanche da manhã", time: "10:00",
          items: [
            { food: "Iogurte natural desnatado", quantity: "170g", calories: 90, protein: 8, carbs: 10, fat: 1 },
            { food: "Granola sem açúcar", quantity: "2 colheres (30g)", calories: 110, protein: 3, carbs: 18, fat: 3 },
          ],
        },
        {
          name: "Almoço", time: "12:30",
          items: [
            { food: "Arroz integral", quantity: "4 colheres (100g)", calories: 130, protein: 3, carbs: 28, fat: 1 },
            { food: "Feijão carioca", quantity: "1 concha (80g)", calories: 76, protein: 5, carbs: 13, fat: 0.5 },
            { food: "Frango grelhado", quantity: "120g", calories: 165, protein: 31, carbs: 0, fat: 3.5 },
            { food: "Salada verde", quantity: "à vontade", calories: 25, protein: 1.5, carbs: 4, fat: 0.3 },
            { food: "Azeite extra virgem", quantity: "1 colher de sopa", calories: 90, protein: 0, carbs: 0, fat: 10 },
          ],
        },
        {
          name: "Lanche da tarde", time: "15:30",
          items: [
            { food: "Banana", quantity: "1 unidade média", calories: 90, protein: 1, carbs: 23, fat: 0.3 },
            { food: "Pasta de amendoim", quantity: "1 colher de sopa (15g)", calories: 94, protein: 4, carbs: 3, fat: 8 },
          ],
        },
        {
          name: "Jantar", time: "19:00",
          items: [
            { food: "Salmão grelhado", quantity: "130g", calories: 208, protein: 25, carbs: 0, fat: 12 },
            { food: "Batata doce", quantity: "1 unidade média (150g)", calories: 130, protein: 2, carbs: 30, fat: 0 },
            { food: "Brócolis no vapor", quantity: "100g", calories: 35, protein: 3, carbs: 7, fat: 0.4 },
          ],
        },
        {
          name: "Ceia", time: "21:00",
          items: [
            { food: "Chá de camomila", quantity: "200ml", calories: 2, protein: 0, carbs: 0.5, fat: 0 },
          ],
        },
      ],
    },
    {
      id: "mp-1b",
      patientId: "1",
      date: "2026-02-10",
      title: "Plano Alimentar — Emagrecimento Fase 2",
      targetCalories: 1700,
      meals: [
        {
          name: "Café da manhã", time: "07:00",
          items: [
            { food: "Tapioca com queijo branco", quantity: "1 unidade", calories: 180, protein: 8, carbs: 28, fat: 4 },
            { food: "Suco de laranja natural", quantity: "200ml", calories: 80, protein: 1, carbs: 20, fat: 0 },
          ],
        },
        {
          name: "Almoço", time: "12:30",
          items: [
            { food: "Arroz integral", quantity: "4 colheres (100g)", calories: 130, protein: 3, carbs: 28, fat: 1 },
            { food: "Feijão preto", quantity: "1 concha (80g)", calories: 80, protein: 5, carbs: 14, fat: 0.5 },
            { food: "Patinho grelhado", quantity: "120g", calories: 190, protein: 32, carbs: 0, fat: 6 },
            { food: "Legumes refogados", quantity: "100g", calories: 45, protein: 2, carbs: 8, fat: 1 },
          ],
        },
        {
          name: "Jantar", time: "19:00",
          items: [
            { food: "Sopa de legumes com frango", quantity: "300ml", calories: 180, protein: 15, carbs: 20, fat: 4 },
            { food: "Torrada integral", quantity: "2 unidades", calories: 70, protein: 2, carbs: 12, fat: 1 },
          ],
        },
      ],
    },
  ],
  "2": [
    {
      id: "mp-2",
      patientId: "2",
      date: "2026-03-15",
      title: "Plano Alimentar — Hipertrofia",
      targetCalories: 2800,
      meals: [
        {
          name: "Café da manhã", time: "06:30",
          items: [
            { food: "Aveia em flocos", quantity: "60g", calories: 220, protein: 8, carbs: 38, fat: 4 },
            { food: "Whey protein", quantity: "1 scoop (30g)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
            { food: "Banana", quantity: "1 unidade", calories: 90, protein: 1, carbs: 23, fat: 0.3 },
            { food: "Ovos inteiros", quantity: "3 unidades", calories: 210, protein: 18, carbs: 1.5, fat: 15 },
          ],
        },
        {
          name: "Almoço", time: "12:00",
          items: [
            { food: "Arroz branco", quantity: "200g", calories: 260, protein: 5, carbs: 56, fat: 0.5 },
            { food: "Feijão carioca", quantity: "1 concha (100g)", calories: 95, protein: 6, carbs: 17, fat: 0.5 },
            { food: "Peito de frango grelhado", quantity: "200g", calories: 275, protein: 52, carbs: 0, fat: 6 },
            { food: "Salada mista", quantity: "à vontade", calories: 30, protein: 2, carbs: 5, fat: 0.5 },
          ],
        },
        {
          name: "Pré-treino", time: "15:00",
          items: [
            { food: "Batata doce", quantity: "200g", calories: 172, protein: 2, carbs: 40, fat: 0 },
            { food: "Frango desfiado", quantity: "100g", calories: 138, protein: 26, carbs: 0, fat: 3 },
          ],
        },
        {
          name: "Pós-treino", time: "17:30",
          items: [
            { food: "Whey protein", quantity: "1 scoop (30g)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
            { food: "Maltodextrina", quantity: "30g", calories: 114, protein: 0, carbs: 28, fat: 0 },
          ],
        },
        {
          name: "Jantar", time: "19:30",
          items: [
            { food: "Carne vermelha magra", quantity: "180g", calories: 250, protein: 36, carbs: 0, fat: 11 },
            { food: "Macarrão integral", quantity: "100g", calories: 140, protein: 5, carbs: 28, fat: 1 },
            { food: "Brócolis", quantity: "100g", calories: 35, protein: 3, carbs: 7, fat: 0.4 },
          ],
        },
      ],
    },
  ],
  "3": [
    {
      id: "mp-3",
      patientId: "3",
      date: "2026-02-28",
      title: "Plano Alimentar — Controle Glicêmico",
      targetCalories: 1500,
      meals: [
        {
          name: "Café da manhã", time: "07:30",
          items: [
            { food: "Pão integral sem açúcar", quantity: "2 fatias", calories: 120, protein: 5, carbs: 22, fat: 2 },
            { food: "Queijo branco", quantity: "30g", calories: 55, protein: 5, carbs: 1, fat: 3.5 },
            { food: "Chá verde sem açúcar", quantity: "200ml", calories: 2, protein: 0, carbs: 0.5, fat: 0 },
          ],
        },
        {
          name: "Almoço", time: "12:00",
          items: [
            { food: "Arroz integral", quantity: "3 colheres (75g)", calories: 98, protein: 2, carbs: 21, fat: 0.7 },
            { food: "Lentilha", quantity: "1 concha (80g)", calories: 90, protein: 7, carbs: 15, fat: 0.3 },
            { food: "Peixe grelhado", quantity: "150g", calories: 180, protein: 30, carbs: 0, fat: 6 },
            { food: "Salada folhas verdes", quantity: "à vontade", calories: 20, protein: 1.5, carbs: 3, fat: 0.2 },
          ],
        },
        {
          name: "Jantar", time: "18:30",
          items: [
            { food: "Omelete de legumes", quantity: "2 ovos + legumes", calories: 180, protein: 14, carbs: 5, fat: 12 },
            { food: "Salada de folhas", quantity: "à vontade", calories: 20, protein: 1, carbs: 3, fat: 0.2 },
          ],
        },
      ],
    },
  ],
  "5": [
    {
      id: "mp-5",
      patientId: "5",
      date: "2026-03-19",
      title: "Plano Alimentar — Performance Crossfit",
      targetCalories: 2400,
      meals: [
        {
          name: "Café da manhã", time: "06:00",
          items: [
            { food: "Ovos mexidos", quantity: "4 unidades", calories: 280, protein: 24, carbs: 2, fat: 20 },
            { food: "Aveia", quantity: "50g", calories: 185, protein: 7, carbs: 32, fat: 3 },
            { food: "Frutas vermelhas", quantity: "100g", calories: 45, protein: 1, carbs: 10, fat: 0.3 },
          ],
        },
        {
          name: "Pré-treino", time: "09:00",
          items: [
            { food: "Batata doce", quantity: "200g", calories: 172, protein: 2, carbs: 40, fat: 0 },
            { food: "Peito de peru", quantity: "60g", calories: 65, protein: 13, carbs: 0, fat: 1 },
          ],
        },
        {
          name: "Pós-treino", time: "12:00",
          items: [
            { food: "Whey protein isolado", quantity: "1 scoop", calories: 110, protein: 25, carbs: 1, fat: 0.5 },
            { food: "Banana com mel", quantity: "1 un + 1 col sopa", calories: 155, protein: 1, carbs: 40, fat: 0.3 },
          ],
        },
        {
          name: "Almoço", time: "13:00",
          items: [
            { food: "Arroz integral", quantity: "150g", calories: 195, protein: 4, carbs: 42, fat: 1.5 },
            { food: "Feijão", quantity: "100g", calories: 95, protein: 6, carbs: 17, fat: 0.5 },
            { food: "Frango grelhado", quantity: "180g", calories: 248, protein: 46, carbs: 0, fat: 5.5 },
            { food: "Salada variada", quantity: "à vontade", calories: 30, protein: 2, carbs: 5, fat: 0.5 },
          ],
        },
        {
          name: "Jantar", time: "19:00",
          items: [
            { food: "Salmão", quantity: "150g", calories: 240, protein: 29, carbs: 0, fat: 14 },
            { food: "Quinoa", quantity: "80g", calories: 95, protein: 4, carbs: 17, fat: 1.5 },
            { food: "Legumes grelhados", quantity: "150g", calories: 55, protein: 2, carbs: 10, fat: 1 },
          ],
        },
      ],
    },
  ],
  "6": [
    {
      id: "mp-6",
      patientId: "6",
      date: "2026-03-10",
      title: "Plano Alimentar — Emagrecimento sem Lactose/Glúten",
      targetCalories: 1550,
      meals: [
        {
          name: "Café da manhã", time: "07:00",
          items: [
            { food: "Tapioca", quantity: "1 unidade média", calories: 140, protein: 1, carbs: 34, fat: 0 },
            { food: "Ovo cozido", quantity: "2 unidades", calories: 140, protein: 12, carbs: 1, fat: 10 },
            { food: "Café preto", quantity: "200ml", calories: 5, protein: 0, carbs: 1, fat: 0 },
          ],
        },
        {
          name: "Almoço", time: "12:00",
          items: [
            { food: "Arroz branco", quantity: "4 colheres (100g)", calories: 130, protein: 2.5, carbs: 28, fat: 0.3 },
            { food: "Feijão", quantity: "1 concha (80g)", calories: 76, protein: 5, carbs: 13, fat: 0.5 },
            { food: "File de tilápia", quantity: "150g", calories: 170, protein: 30, carbs: 0, fat: 5 },
            { food: "Legumes cozidos", quantity: "100g", calories: 40, protein: 2, carbs: 8, fat: 0.5 },
          ],
        },
        {
          name: "Jantar", time: "19:00",
          items: [
            { food: "Sopa de abóbora com frango", quantity: "300ml", calories: 160, protein: 14, carbs: 18, fat: 3 },
          ],
        },
      ],
    },
  ],
  "7": [
    {
      id: "mp-7",
      patientId: "7",
      date: "2026-01-12",
      title: "Plano Alimentar — Gestação 24 semanas",
      targetCalories: 2000,
      meals: [
        {
          name: "Café da manhã", time: "07:30",
          items: [
            { food: "Pão integral", quantity: "2 fatias", calories: 130, protein: 5, carbs: 24, fat: 2 },
            { food: "Queijo minas", quantity: "2 fatias (40g)", calories: 80, protein: 7, carbs: 1, fat: 5 },
            { food: "Suco de laranja", quantity: "200ml", calories: 80, protein: 1, carbs: 20, fat: 0 },
          ],
        },
        {
          name: "Lanche da manhã", time: "10:00",
          items: [
            { food: "Mix de castanhas", quantity: "30g", calories: 180, protein: 5, carbs: 6, fat: 16 },
            { food: "Maçã", quantity: "1 unidade", calories: 72, protein: 0.3, carbs: 19, fat: 0.2 },
          ],
        },
        {
          name: "Almoço", time: "12:30",
          items: [
            { food: "Arroz integral", quantity: "4 colheres", calories: 130, protein: 3, carbs: 28, fat: 1 },
            { food: "Feijão", quantity: "1 concha", calories: 76, protein: 5, carbs: 13, fat: 0.5 },
            { food: "Carne moída refogada", quantity: "120g", calories: 190, protein: 22, carbs: 2, fat: 10 },
            { food: "Espinafre refogado", quantity: "80g", calories: 30, protein: 3, carbs: 3, fat: 1 },
          ],
        },
        {
          name: "Jantar", time: "19:00",
          items: [
            { food: "Omelete", quantity: "2 ovos", calories: 150, protein: 12, carbs: 1, fat: 10 },
            { food: "Salada de beterraba", quantity: "100g", calories: 40, protein: 2, carbs: 8, fat: 0.2 },
            { food: "Pão integral", quantity: "1 fatia", calories: 65, protein: 2.5, carbs: 12, fat: 1 },
          ],
        },
      ],
    },
  ],
};
