import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockMealPlans, Meal, MealPlan, MealItem } from "@/data/prontuario";
import {
  Clock, Flame, Beef, Wheat, Droplets, FileText,
  Plus, Pencil, Trash2, X, GripVertical,
} from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface MealPlanViewProps {
  patientId?: string;
}

const emptyItem = (): MealItem => ({
  food: "", quantity: "", calories: 0, protein: 0, carbs: 0, fat: 0,
});

const emptyMeal = (): Meal => ({
  name: "", time: "08:00", items: [emptyItem()],
});

export function MealPlanView({ patientId = "1" }: MealPlanViewProps) {
  const [allPlans, setAllPlans] = useState<Record<string, MealPlan[]>>(() => ({ ...mockMealPlans }));
  const plans = allPlans[patientId] || [];
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || "");
  const plan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  // Dialog states
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [plan]);

  const savePlan = useCallback((updatedPlan: MealPlan) => {
    setAllPlans((prev) => {
      const patientPlans = prev[patientId] || [];
      const exists = patientPlans.find((p) => p.id === updatedPlan.id);
      const newPlans = exists
        ? patientPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
        : [updatedPlan, ...patientPlans];
      return { ...prev, [patientId]: newPlans };
    });
    setSelectedPlanId(updatedPlan.id);
    setEditorOpen(false);
    setEditingPlan(null);
    toast({ title: "Plano salvo", description: `"${updatedPlan.title}" foi salvo com sucesso.` });
  }, [patientId]);

  const deletePlan = useCallback((planId: string) => {
    setAllPlans((prev) => {
      const filtered = (prev[patientId] || []).filter((p) => p.id !== planId);
      return { ...prev, [patientId]: filtered };
    });
    setSelectedPlanId("");
    setDeleteConfirm(null);
    toast({ title: "Plano excluído", description: "O plano alimentar foi removido." });
  }, [patientId]);

  const handleNew = () => {
    const newPlan: MealPlan = {
      id: `mp-${Date.now()}`,
      patientId,
      date: new Date().toISOString().slice(0, 10),
      title: "",
      targetCalories: 1800,
      meals: [emptyMeal()],
    };
    setEditingPlan(newPlan);
    setEditorOpen(true);
  };

  const handleEdit = () => {
    if (plan) {
      setEditingPlan(JSON.parse(JSON.stringify(plan)));
      setEditorOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {plans.length > 1 && (
            <>
              <span className="text-sm text-muted-foreground">Plano:</span>
              <Select value={selectedPlanId || plan?.id || ""} onValueChange={setSelectedPlanId}>
                <SelectTrigger className="w-[320px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title || "Sem título"} ({p.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {plan && (
            <>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleEdit}>
                <Pencil className="h-3.5 w-3.5" /> Editar
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(plan.id)}>
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </Button>
            </>
          )}
          <Button size="sm" className="gap-1.5" onClick={handleNew}>
            <Plus className="h-3.5 w-3.5" /> Novo Plano
          </Button>
        </div>
      </div>

      {!plan ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <FileText className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">Nenhum plano alimentar cadastrado.</p>
            <Button variant="link" size="sm" className="mt-2" onClick={handleNew}>
              Criar primeiro plano
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{plan.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Criado em {plan.date} · Meta: {plan.targetCalories} kcal
                  </p>
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

          {/* Meals */}
          {plan.meals.map((meal, i) => (
            <MealCard key={i} meal={meal} />
          ))}
        </>
      )}

      {/* Editor dialog */}
      {editorOpen && editingPlan && (
        <MealPlanEditorDialog
          plan={editingPlan}
          onSave={savePlan}
          onClose={() => { setEditorOpen(false); setEditingPlan(null); }}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir plano alimentar?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O plano alimentar será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteConfirm && deletePlan(deleteConfirm)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── Editor Dialog ─── */

function MealPlanEditorDialog({
  plan: initialPlan,
  onSave,
  onClose,
}: {
  plan: MealPlan;
  onSave: (plan: MealPlan) => void;
  onClose: () => void;
}) {
  const [plan, setPlan] = useState<MealPlan>(initialPlan);

  const updateField = <K extends keyof MealPlan>(key: K, value: MealPlan[K]) => {
    setPlan((p) => ({ ...p, [key]: value }));
  };

  const addMeal = () => {
    setPlan((p) => ({ ...p, meals: [...p.meals, emptyMeal()] }));
  };

  const removeMeal = (idx: number) => {
    setPlan((p) => ({ ...p, meals: p.meals.filter((_, i) => i !== idx) }));
  };

  const updateMeal = (idx: number, field: keyof Meal, value: string) => {
    setPlan((p) => {
      const meals = [...p.meals];
      meals[idx] = { ...meals[idx], [field]: value };
      return { ...p, meals };
    });
  };

  const addItem = (mealIdx: number) => {
    setPlan((p) => {
      const meals = [...p.meals];
      meals[mealIdx] = { ...meals[mealIdx], items: [...meals[mealIdx].items, emptyItem()] };
      return { ...p, meals };
    });
  };

  const removeItem = (mealIdx: number, itemIdx: number) => {
    setPlan((p) => {
      const meals = [...p.meals];
      meals[mealIdx] = { ...meals[mealIdx], items: meals[mealIdx].items.filter((_, i) => i !== itemIdx) };
      return { ...p, meals };
    });
  };

  const updateItem = (mealIdx: number, itemIdx: number, field: keyof MealItem, value: string | number) => {
    setPlan((p) => {
      const meals = [...p.meals];
      const items = [...meals[mealIdx].items];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      meals[mealIdx] = { ...meals[mealIdx], items };
      return { ...p, meals };
    });
  };

  const handleSave = () => {
    if (!plan.title.trim()) {
      toast({ title: "Erro", description: "Informe o título do plano.", variant: "destructive" });
      return;
    }
    if (plan.meals.length === 0) {
      toast({ title: "Erro", description: "Adicione pelo menos uma refeição.", variant: "destructive" });
      return;
    }
    for (const meal of plan.meals) {
      if (!meal.name.trim()) {
        toast({ title: "Erro", description: "Todas as refeições precisam de um nome.", variant: "destructive" });
        return;
      }
    }
    onSave(plan);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialPlan.title ? "Editar Plano Alimentar" : "Novo Plano Alimentar"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Título do Plano</Label>
              <Input
                value={plan.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Ex: Plano Alimentar — Emagrecimento Fase 1"
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Meta calórica (kcal)</Label>
              <Input
                type="number"
                value={plan.targetCalories}
                onChange={(e) => updateField("targetCalories", Math.max(0, Number(e.target.value)))}
                min={0}
                max={10000}
              />
            </div>
          </div>

          {/* Meals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Refeições</h4>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={addMeal}>
                <Plus className="h-3.5 w-3.5" /> Adicionar Refeição
              </Button>
            </div>

            {plan.meals.map((meal, mealIdx) => (
              <Card key={mealIdx} className="border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                    <div className="flex-1 grid grid-cols-[1fr_100px] gap-2">
                      <Input
                        value={meal.name}
                        onChange={(e) => updateMeal(mealIdx, "name", e.target.value)}
                        placeholder="Nome da refeição (ex: Café da manhã)"
                        maxLength={60}
                      />
                      <Input
                        type="time"
                        value={meal.time}
                        onChange={(e) => updateMeal(mealIdx, "time", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeMeal(mealIdx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {/* Items table */}
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[140px]">Alimento</TableHead>
                          <TableHead className="min-w-[100px]">Quantidade</TableHead>
                          <TableHead className="w-[70px] text-right">Kcal</TableHead>
                          <TableHead className="w-[60px] text-right">P (g)</TableHead>
                          <TableHead className="w-[60px] text-right">C (g)</TableHead>
                          <TableHead className="w-[60px] text-right">G (g)</TableHead>
                          <TableHead className="w-[40px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {meal.items.map((item, itemIdx) => (
                          <TableRow key={itemIdx}>
                            <TableCell className="p-1.5">
                              <Input
                                className="h-8 text-sm"
                                value={item.food}
                                onChange={(e) => updateItem(mealIdx, itemIdx, "food", e.target.value)}
                                placeholder="Alimento"
                                maxLength={80}
                              />
                            </TableCell>
                            <TableCell className="p-1.5">
                              <Input
                                className="h-8 text-sm"
                                value={item.quantity}
                                onChange={(e) => updateItem(mealIdx, itemIdx, "quantity", e.target.value)}
                                placeholder="Qtd"
                                maxLength={50}
                              />
                            </TableCell>
                            <TableCell className="p-1.5">
                              <Input
                                className="h-8 text-sm text-right"
                                type="number"
                                value={item.calories}
                                onChange={(e) => updateItem(mealIdx, itemIdx, "calories", Math.max(0, Number(e.target.value)))}
                                min={0}
                              />
                            </TableCell>
                            <TableCell className="p-1.5">
                              <Input
                                className="h-8 text-sm text-right"
                                type="number"
                                value={item.protein}
                                onChange={(e) => updateItem(mealIdx, itemIdx, "protein", Math.max(0, Number(e.target.value)))}
                                min={0}
                                step={0.1}
                              />
                            </TableCell>
                            <TableCell className="p-1.5">
                              <Input
                                className="h-8 text-sm text-right"
                                type="number"
                                value={item.carbs}
                                onChange={(e) => updateItem(mealIdx, itemIdx, "carbs", Math.max(0, Number(e.target.value)))}
                                min={0}
                                step={0.1}
                              />
                            </TableCell>
                            <TableCell className="p-1.5">
                              <Input
                                className="h-8 text-sm text-right"
                                type="number"
                                value={item.fat}
                                onChange={(e) => updateItem(mealIdx, itemIdx, "fat", Math.max(0, Number(e.target.value)))}
                                min={0}
                                step={0.1}
                              />
                            </TableCell>
                            <TableCell className="p-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(mealIdx, itemIdx)}
                                disabled={meal.items.length <= 1}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => addItem(mealIdx)}>
                    <Plus className="h-3 w-3" /> Adicionar alimento
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Plano</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Display Components ─── */

function MealCard({ meal }: { meal: Meal }) {
  const mealTotals = meal.items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
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
