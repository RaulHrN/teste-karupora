import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const brStates = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

export default function PacienteNovo() {
  const navigate = useNavigate();
  const [lgpdConsent, setLgpdConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Paciente cadastrado",
      description: "O paciente foi cadastrado com sucesso.",
    });
    navigate("/pacientes");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/pacientes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Novo Paciente</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Preencha os dados para cadastrar um novo paciente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="pessoal" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="saude">Saúde</TabsTrigger>
              <TabsTrigger value="lgpd">LGPD</TabsTrigger>
            </TabsList>

            {/* Dados Pessoais */}
            <TabsContent value="pessoal">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input id="name" placeholder="Nome do paciente" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input id="cpf" placeholder="000.000.000-00" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate">Data de nascimento *</Label>
                      <Input id="birthDate" type="date" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="gender">Sexo *</Label>
                      <Select required>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feminino">Feminino</SelectItem>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="objective">Objetivo nutricional</Label>
                      <Select>
                        <SelectTrigger id="objective">
                          <SelectValue placeholder="Selecione o objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                          <SelectItem value="ganho_massa">Ganho de massa muscular</SelectItem>
                          <SelectItem value="reeducacao">Reeducação alimentar</SelectItem>
                          <SelectItem value="esportiva">Nutrição esportiva</SelectItem>
                          <SelectItem value="diabetes">Controle de diabetes</SelectItem>
                          <SelectItem value="gestacao">Gestação saudável</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contato & Endereço */}
            <TabsContent value="contato">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contato e Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="email@exemplo.com" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                      <Input id="phone" placeholder="(00) 00000-0000" required />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium text-foreground mb-3">Endereço</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="street">Rua</Label>
                        <Input id="street" placeholder="Nome da rua" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" placeholder="Nº" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" placeholder="Apto, sala..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input id="neighborhood" placeholder="Bairro" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="zip">CEP</Label>
                        <Input id="zip" placeholder="00000-000" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" placeholder="Cidade" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="state">Estado</Label>
                        <Select>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            {brStates.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saúde */}
            <TabsContent value="saude">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Histórico de Saúde</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="allergies">Alergias alimentares</Label>
                    <Input id="allergies" placeholder="Ex: Amendoim, Camarão (separar por vírgula)" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="intolerances">Intolerâncias alimentares</Label>
                    <Input id="intolerances" placeholder="Ex: Lactose, Glúten (separar por vírgula)" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="medicalHistory">Histórico médico relevante</Label>
                    <Textarea id="medicalHistory" placeholder="Doenças, cirurgias, condições crônicas..." rows={3} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="medications">Medicamentos em uso</Label>
                    <Textarea id="medications" placeholder="Liste os medicamentos e dosagens..." rows={2} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Observações gerais</Label>
                    <Textarea id="notes" placeholder="Notas adicionais sobre o paciente..." rows={3} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LGPD */}
            <TabsContent value="lgpd">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Consentimento LGPD</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-sm text-foreground leading-relaxed">
                      Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018),
                      solicitamos o consentimento do paciente para a coleta, armazenamento e processamento
                      de seus dados pessoais e de saúde para fins de acompanhamento nutricional.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Os dados serão utilizados exclusivamente para prestação de serviços nutricionais
                      e poderão ser excluídos a qualquer momento mediante solicitação do titular.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="lgpd"
                      checked={lgpdConsent}
                      onCheckedChange={setLgpdConsent}
                    />
                    <Label htmlFor="lgpd" className="text-sm">
                      O paciente concorda com a coleta e tratamento dos dados *
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/pacientes")}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-1.5" disabled={!lgpdConsent}>
              <Save className="h-4 w-4" />
              Cadastrar Paciente
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
