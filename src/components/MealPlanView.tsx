import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockMealPlans, Meal } from "@/data/prontuario";
import { Clock, Flame, Beef, Wheat, Droplets, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MealPlanViewProps {
  patientId?: string;
}

export function MealPlanView({ patientId = "1" }: MealPlanViewProps) {
  const plans = mockMealPlans[patientId] || [];
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || "");
  const plan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const totals = useMemo(() => {
    if (!plan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return plan.meals.reduce(
      (acc, meal) => {
        meal.items.forEach((item) => {
          acc.calories += item.calories;
          acc.protein += item.protein;
          acc.carbs += item.carbs;
          acc.fat += item.fat;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [plan]);

  if (!plan) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-sm">Nenhum plano alimentar cadastrado para este paciente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plans.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Plano:</span>
          <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <SelectTrigger className="w-[320px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {plans.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} ({p.date})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">{plan.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Criado em {plan.date} · Meta: {plan.targetCalories} kcal</p>
            </div>
            <div className="flex gap-4">
              <MacroBadge icon={Flame} label="Calorias" value={`${totals.calories} kcal`} color="text-destructive" />
              <MacroBadge icon={Beef} label="Proteína" value={`${totals.protein.toFixed(0)}g`} color="text-primary" />
              <MacroBadge icon={Wheat} label="Carboidratos" value={`${totals.carbs.toFixed(0)}g`} color="text-warning" />
              <MacroBadge icon={Droplets} label="Gordura" value={`${totals.fat.toFixed(0)}g`} color="text-info" />
            </div>
          </div>
        </CardContent>
      </Card>

      {plan.meals.map((meal, i) => (
        <MealCard key={i} meal={meal} />
      ))}
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  const mealTotals = meal.items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {meal.name}
            <span className="text-xs font-normal text-muted-foreground">({meal.time})</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-muted/50">
            {mealTotals.calories} kcal
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alimento</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="text-right">Kcal</TableHead>
              <TableHead className="text-right">P (g)</TableHead>
              <TableHead className="text-right">C (g)</TableHead>
              <TableHead className="text-right">G (g)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meal.items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-sm font-medium">{item.food}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.quantity}</TableCell>
                <TableCell className="text-sm text-right">{item.calories}</TableCell>
                <TableCell className="text-sm text-right">{item.protein}</TableCell>
                <TableCell className="text-sm text-right">{item.carbs}</TableCell>
                <TableCell className="text-sm text-right">{item.fat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MacroBadge({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center gap-1 justify-center mb-0.5">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
