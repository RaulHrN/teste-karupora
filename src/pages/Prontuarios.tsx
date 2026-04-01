import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, FileDown, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockPatients } from "@/data/patients";
import { EvolutionCharts } from "@/components/EvolutionCharts";
import { MealPlanView } from "@/components/MealPlanView";
import { AnamneseForm } from "@/components/AnamneseForm";
import { toast } from "@/hooks/use-toast";

export default function Prontuarios() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<string>("1");
  const patient = mockPatients.find((p) => p.id === selectedPatient);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Prontuário Nutricional</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Anamnese, plano alimentar e evolução do paciente</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.filter((p) => p.status === "ativo").map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => toast({ title: "PDF gerado", description: "O plano alimentar foi exportado em PDF." })}
            >
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => toast({ title: "Enviado", description: "Plano alimentar enviado via WhatsApp." })}
            >
              <Send className="h-4 w-4" />
              Enviar ao Paciente
            </Button>
          </div>
        </div>

        {patient && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{patient.name}</p>
              <p className="text-xs text-muted-foreground">{patient.objective} · {patient.phone}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="evolucao" className="space-y-4">
          <TabsList>
            <TabsTrigger value="evolucao">Evolução</TabsTrigger>
            <TabsTrigger value="plano">Plano Alimentar</TabsTrigger>
            <TabsTrigger value="anamnese">Anamnese</TabsTrigger>
          </TabsList>

          <TabsContent value="evolucao">
            <EvolutionCharts />
          </TabsContent>

          <TabsContent value="plano">
            <MealPlanView patientId={selectedPatient} />
          </TabsContent>

          <TabsContent value="anamnese">
            <AnamneseForm />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
