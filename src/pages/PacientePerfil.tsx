import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlanView } from "@/components/MealPlanView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Calendar,
  FileText,
  DollarSign,
  Edit,
  UtensilsCrossed,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockPatients } from "@/data/patients";
import { format, parseISO, differenceInYears } from "date-fns";

const mockConsultas = [
  { date: "2026-03-18", type: "Retorno", professional: "Dra. Natália Costa", notes: "Evolução positiva. Perda de 1.2kg." },
  { date: "2026-02-20", type: "Retorno", professional: "Dra. Natália Costa", notes: "Ajuste no plano alimentar." },
  { date: "2026-01-15", type: "Primeira Consulta", professional: "Dra. Natália Costa", notes: "Anamnese completa realizada." },
];

const mockFinanceiro = [
  { date: "2026-03-18", description: "Consulta de retorno", value: "R$ 250,00", status: "pago" },
  { date: "2026-02-20", description: "Consulta de retorno", value: "R$ 250,00", status: "pago" },
  { date: "2026-01-15", description: "Primeira consulta", value: "R$ 350,00", status: "pago" },
];

export default function PacientePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Paciente não encontrado.</p>
        </div>
      </AppLayout>
    );
  }

  const age = differenceInYears(new Date(), parseISO(patient.birthDate));

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/pacientes")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{patient.name}</h1>
                <p className="text-sm text-muted-foreground">{age} anos · {patient.objective}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Edit className="h-3.5 w-3.5" />
            Editar
          </Button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="text-sm font-medium text-foreground">{patient.phone}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="text-sm font-medium text-foreground truncate">{patient.email}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Cidade</p>
                <p className="text-sm font-medium text-foreground">{patient.address.city}, {patient.address.state}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dados" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="plano">Plano Alimentar</TabsTrigger>
            <TabsTrigger value="consultas">Consultas</TabsTrigger>
            <TabsTrigger value="prontuarios">Prontuários</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="dados">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Informações Pessoais</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="CPF" value={patient.cpf} />
                  <InfoRow label="Data de nascimento" value={format(parseISO(patient.birthDate), "dd/MM/yyyy")} />
                  <InfoRow label="Sexo" value={patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} />
                  <InfoRow label="Status" value={<Badge variant="outline" className={patient.status === "ativo" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground"}>{patient.status === "ativo" ? "Ativo" : "Inativo"}</Badge>} />
                  <InfoRow label="Cadastrado em" value={format(parseISO(patient.createdAt), "dd/MM/yyyy")} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Saúde</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow
                    label="Alergias"
                    value={patient.allergies.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {patient.allergies.map((a) => (
                          <Badge key={a} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">{a}</Badge>
                        ))}
                      </div>
                    ) : "Nenhuma"}
                  />
                  <InfoRow
                    label="Intolerâncias"
                    value={patient.intolerances.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {patient.intolerances.map((i) => (
                          <Badge key={i} variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">{i}</Badge>
                        ))}
                      </div>
                    ) : "Nenhuma"}
                  />
                  <InfoRow label="Histórico médico" value={patient.medicalHistory || "—"} />
                  <InfoRow label="Medicamentos" value={patient.medications || "Nenhum"} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader><CardTitle className="text-base">Endereço</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">
                    {patient.address.street}, {patient.address.number}
                    {patient.address.complement ? ` — ${patient.address.complement}` : ""}
                    <br />
                    {patient.address.neighborhood} · {patient.address.city}/{patient.address.state} · CEP {patient.address.zip}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plano Alimentar */}
          <TabsContent value="plano">
            <MealPlanView patientId={id} />
          </TabsContent>

          {/* Consultas */}
          <TabsContent value="consultas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Histórico de Consultas
                </CardTitle>
                <Button size="sm" className="gap-1.5">Agendar Consulta</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockConsultas.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{format(parseISO(c.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{c.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.professional}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{c.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prontuários */}
          <TabsContent value="prontuarios">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Prontuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <FileText className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">Módulo de prontuários será implementado em breve.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financeiro */}
          <TabsContent value="financeiro">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Histórico Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFinanceiro.map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{format(parseISO(t.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-sm">{t.description}</TableCell>
                        <TableCell className="text-sm font-medium">{t.value}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            Pago
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}
