import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const frequencyOptions = [
  { value: "diario", label: "Diário" },
  { value: "semanal", label: "Semanal" },
  { value: "quinzenal", label: "Quinzenal" },
  { value: "raramente", label: "Raramente" },
  { value: "nunca", label: "Nunca" },
];

const foodGroups = [
  { key: "frutas", label: "Frutas" },
  { key: "verduras", label: "Verduras e legumes" },
  { key: "carnes", label: "Carnes e ovos" },
  { key: "laticinios", label: "Laticínios" },
  { key: "cereais", label: "Cereais e pães" },
  { key: "leguminosas", label: "Leguminosas" },
  { key: "doces", label: "Doces e açúcares" },
  { key: "frituras", label: "Frituras" },
  { key: "refrigerantes", label: "Refrigerantes/sucos industriais" },
];

export function AnamneseForm() {
  const handleSave = () => {
    toast({ title: "Anamnese salva", description: "Os dados foram registrados com sucesso." });
  };

  return (
    <div className="space-y-4">
      {/* Recordatório 24h */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recordatório Alimentar 24h</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: "cafeManha", label: "Café da manhã" },
            { id: "lancheManha", label: "Lanche da manhã" },
            { id: "almoco", label: "Almoço" },
            { id: "lancheTarde", label: "Lanche da tarde" },
            { id: "jantar", label: "Jantar" },
            { id: "ceia", label: "Ceia" },
          ].map((meal) => (
            <div key={meal.id} className="space-y-1">
              <Label htmlFor={meal.id}>{meal.label}</Label>
              <Textarea id={meal.id} placeholder={`O que o paciente consumiu no ${meal.label.toLowerCase()}?`} rows={2} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Frequência alimentar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequência Alimentar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodGroups.map((group) => (
              <div key={group.key} className="space-y-1">
                <Label>{group.label}</Label>
                <Select defaultValue="semanal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="space-y-1">
              <Label htmlFor="agua">Consumo de água (litros/dia)</Label>
              <Input id="agua" type="number" step="0.1" defaultValue="1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hábitos & Preferências */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hábitos e Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="atividade">Nível de atividade física</Label>
              <Select defaultValue="moderado">
                <SelectTrigger id="atividade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentario">Sedentário</SelectItem>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="intenso">Intenso</SelectItem>
                  <SelectItem value="muito_intenso">Muito intenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="sono">Horas de sono por noite</Label>
              <Input id="sono" type="number" defaultValue="7" min={1} max={16} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="estresse">Nível de estresse</Label>
              <Select defaultValue="moderado">
                <SelectTrigger id="estresse">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="intestinal">Hábito intestinal</Label>
              <Input id="intestinal" placeholder="Regular, constipação, etc." />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="preferencias">Preferências alimentares</Label>
            <Textarea id="preferencias" placeholder="Alimentos que o paciente gosta..." rows={2} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="aversoes">Aversões alimentares</Label>
            <Textarea id="aversoes" placeholder="Alimentos que o paciente não gosta..." rows={2} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="restricoes">Restrições alimentares</Label>
            <Textarea id="restricoes" placeholder="Vegetarianismo, veganismo, etc." rows={2} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="historicoDietas">Histórico de dietas anteriores</Label>
            <Textarea id="historicoDietas" placeholder="Quais dietas já fez, resultados, etc." rows={2} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="obs">Observações</Label>
            <Textarea id="obs" placeholder="Observações adicionais..." rows={2} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-6">
        <Button className="gap-1.5" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Salvar Anamnese
        </Button>
      </div>
    </div>
  );
}
