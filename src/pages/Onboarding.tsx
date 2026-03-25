import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf, Building2, UserCircle, Settings, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { icon: Building2, title: "Dados da Clínica", description: "Informações do seu consultório" },
  { icon: UserCircle, title: "Profissional", description: "Seus dados profissionais" },
  { icon: Settings, title: "Preferências", description: "Configure seu ambiente" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [clinic, setClinic] = useState({
    name: "",
    cnpj: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [professional, setProfessional] = useState({
    name: "",
    crn: "",
    specialty: "",
    consultDuration: "50",
  });

  const [preferences, setPreferences] = useState({
    sendReminders: true,
    reminderHours: "24",
    allowOnlineBooking: true,
    currency: "BRL",
  });

  const progress = ((step + 1) / steps.length) * 100;

  const handleFinish = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    toast({ title: "Clínica configurada! 🎉", description: "Tudo pronto para começar a atender." });
    navigate("/");
  };

  const canAdvance = () => {
    if (step === 0) return clinic.name && clinic.phone;
    if (step === 1) return professional.name && professional.crn;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 p-4">
        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <Leaf className="h-4 w-4" />
        </div>
        <span className="font-semibold text-foreground">NutriGestão</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-6">
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Etapa {step + 1} de {steps.length}
              </span>
              <span className="font-medium text-foreground">{steps[step].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : active
                          ? "bg-primary/15 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-[11px] ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="border-border/60 shadow-xl shadow-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{steps[step].title}</CardTitle>
              <CardDescription>{steps[step].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 1: Clinic */}
              {step === 0 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="clinicName">Nome da clínica *</Label>
                      <Input
                        id="clinicName"
                        placeholder="Clínica NutriVida"
                        value={clinic.name}
                        onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        placeholder="00.000.000/0001-00"
                        value={clinic.cnpj}
                        onChange={(e) => setClinic({ ...clinic, cnpj: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicPhone">Telefone *</Label>
                      <Input
                        id="clinicPhone"
                        placeholder="(11) 99999-0000"
                        value={clinic.phone}
                        onChange={(e) => setClinic({ ...clinic, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        placeholder="Rua das Flores, 123"
                        value={clinic.address}
                        onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="São Paulo"
                        value={clinic.city}
                        onChange={(e) => setClinic({ ...clinic, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Select value={clinic.state} onValueChange={(v) => setClinic({ ...clinic, state: v })}>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Professional */}
              {step === 1 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="profName">Nome completo *</Label>
                      <Input
                        id="profName"
                        placeholder="Dra. Natália Costa"
                        value={professional.name}
                        onChange={(e) => setProfessional({ ...professional, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crn">CRN *</Label>
                      <Input
                        id="crn"
                        placeholder="CRN-3 12345"
                        value={professional.crn}
                        onChange={(e) => setProfessional({ ...professional, crn: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidade</Label>
                      <Select
                        value={professional.specialty}
                        onValueChange={(v) => setProfessional({ ...professional, specialty: v })}
                      >
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinica">Nutrição Clínica</SelectItem>
                          <SelectItem value="esportiva">Nutrição Esportiva</SelectItem>
                          <SelectItem value="funcional">Nutrição Funcional</SelectItem>
                          <SelectItem value="pediatrica">Nutrição Pediátrica</SelectItem>
                          <SelectItem value="comportamental">Nutrição Comportamental</SelectItem>
                          <SelectItem value="estetica">Nutrição Estética</SelectItem>
                          <SelectItem value="materno">Materno-infantil</SelectItem>
                          <SelectItem value="oncologica">Nutrição Oncológica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="duration">Duração padrão da consulta</Label>
                      <Select
                        value={professional.consultDuration}
                        onValueChange={(v) => setProfessional({ ...professional, consultDuration: v })}
                      >
                        <SelectTrigger id="duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="40">40 minutos</SelectItem>
                          <SelectItem value="50">50 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                          <SelectItem value="90">90 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Preferences */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30">
                    <Checkbox
                      id="reminders"
                      checked={preferences.sendReminders}
                      onCheckedChange={(c) =>
                        setPreferences({ ...preferences, sendReminders: c as boolean })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="reminders" className="cursor-pointer">
                        Enviar lembretes de consulta por WhatsApp
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Pacientes receberão uma mensagem automática antes da consulta
                      </p>
                    </div>
                  </div>

                  {preferences.sendReminders && (
                    <div className="space-y-2 pl-7">
                      <Label htmlFor="reminderHours">Antecedência do lembrete</Label>
                      <Select
                        value={preferences.reminderHours}
                        onValueChange={(v) => setPreferences({ ...preferences, reminderHours: v })}
                      >
                        <SelectTrigger id="reminderHours">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 horas antes</SelectItem>
                          <SelectItem value="6">6 horas antes</SelectItem>
                          <SelectItem value="12">12 horas antes</SelectItem>
                          <SelectItem value="24">24 horas antes</SelectItem>
                          <SelectItem value="48">48 horas antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30">
                    <Checkbox
                      id="onlineBooking"
                      checked={preferences.allowOnlineBooking}
                      onCheckedChange={(c) =>
                        setPreferences({ ...preferences, allowOnlineBooking: c as boolean })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="onlineBooking" className="cursor-pointer">
                        Permitir agendamento online
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Pacientes poderão agendar consultas pelo link da clínica
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Moeda para cobranças</Label>
                    <Select
                      value={preferences.currency}
                      onValueChange={(v) => setPreferences({ ...preferences, currency: v })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">R$ — Real Brasileiro</SelectItem>
                        <SelectItem value="USD">$ — Dólar Americano</SelectItem>
                        <SelectItem value="EUR">€ — Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>

                {step < steps.length - 1 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canAdvance()}>
                    Próximo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleFinish} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Finalizando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Finalizar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
