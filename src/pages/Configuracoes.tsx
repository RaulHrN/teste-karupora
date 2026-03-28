import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2,
  Users,
  MessageSquareText,
  Palette,
  Save,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";

// ── Mock data ──

interface Professional {
  id: string;
  name: string;
  crn: string;
  specialty: string;
  email: string;
  phone: string;
  status: "ativo" | "inativo";
  role: "admin" | "nutricionista" | "secretaria";
}

interface MessageTemplate {
  id: string;
  name: string;
  category: "lembrete" | "boas-vindas" | "retorno" | "aniversario" | "personalizado";
  content: string;
  variables: string[];
  active: boolean;
}

const mockProfessionals: Professional[] = [
  { id: "1", name: "Dra. Natália Costa", crn: "CRN-3 12345", specialty: "Nutrição Clínica", email: "natalia@nutrigestao.com", phone: "(11) 99876-5432", status: "ativo", role: "admin" },
  { id: "2", name: "Dr. Pedro Mendes", crn: "CRN-3 67890", specialty: "Nutrição Esportiva", email: "pedro@nutrigestao.com", phone: "(11) 98765-4321", status: "ativo", role: "nutricionista" },
  { id: "3", name: "Ana Clara Souza", crn: "", specialty: "", email: "ana@nutrigestao.com", phone: "(11) 97654-3210", status: "ativo", role: "secretaria" },
  { id: "4", name: "Dra. Juliana Reis", crn: "CRN-3 11223", specialty: "Nutrição Materno-Infantil", email: "juliana@nutrigestao.com", phone: "(21) 96543-2100", status: "inativo", role: "nutricionista" },
];

const mockTemplates: MessageTemplate[] = [
  {
    id: "t1",
    name: "Lembrete de Consulta",
    category: "lembrete",
    content: "Olá {nome}! 😊 Lembramos que sua consulta está agendada para {data} às {hora}. Caso precise remarcar, entre em contato. Até lá!",
    variables: ["nome", "data", "hora"],
    active: true,
  },
  {
    id: "t2",
    name: "Boas-vindas",
    category: "boas-vindas",
    content: "Bem-vindo(a) à {clinica}, {nome}! 🌱 Estamos felizes em tê-lo(a) conosco. Sua primeira consulta está marcada para {data}. Qualquer dúvida, estamos à disposição!",
    variables: ["clinica", "nome", "data"],
    active: true,
  },
  {
    id: "t3",
    name: "Retorno Pendente",
    category: "retorno",
    content: "Olá {nome}, notamos que faz {dias} dias desde sua última consulta. Que tal agendarmos seu retorno? Estamos aqui para acompanhar seu progresso! 💪",
    variables: ["nome", "dias"],
    active: true,
  },
  {
    id: "t4",
    name: "Aniversário",
    category: "aniversario",
    content: "Feliz aniversário, {nome}! 🎂🎉 A equipe {clinica} deseja um dia maravilhoso! Como presente, preparamos uma condição especial para você. Entre em contato!",
    variables: ["nome", "clinica"],
    active: false,
  },
  {
    id: "t5",
    name: "Envio de Cardápio",
    category: "personalizado",
    content: "Olá {nome}! Segue seu novo plano alimentar: {plano}. Meta diária: {calorias} kcal. Qualquer dúvida sobre substituições, me avise! 🥗",
    variables: ["nome", "plano", "calorias"],
    active: true,
  },
];

const categoryLabels: Record<string, string> = {
  lembrete: "Lembrete",
  "boas-vindas": "Boas-vindas",
  retorno: "Retorno",
  aniversario: "Aniversário",
  personalizado: "Personalizado",
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  nutricionista: "Nutricionista",
  secretaria: "Secretária",
};

export default function Configuracoes() {
  const { toast } = useToast();

  // ── Clinic state ──
  const [clinic, setClinic] = useState({
    name: "NutriVida Clínica",
    cnpj: "12.345.678/0001-90",
    phone: "(11) 3456-7890",
    email: "contato@nutrivida.com.br",
    website: "www.nutrivida.com.br",
    street: "Rua Augusta, 1200",
    neighborhood: "Consolação",
    city: "São Paulo",
    state: "SP",
    zip: "01304-001",
    workingHours: "08:00 - 18:00",
    workingDays: "Segunda a Sexta",
    consultationDuration: "50",
    onlineBooking: true,
    whatsappReminders: true,
  });

  // ── Professionals state ──
  const [professionals, setProfessionals] = useState(mockProfessionals);
  const [editingProf, setEditingProf] = useState<Professional | null>(null);
  const [profForm, setProfForm] = useState({ name: "", crn: "", specialty: "", email: "", phone: "", role: "nutricionista" as Professional["role"] });

  // ── Templates state ──
  const [templates, setTemplates] = useState(mockTemplates);
  const [editingTpl, setEditingTpl] = useState<MessageTemplate | null>(null);
  const [tplForm, setTplForm] = useState({ name: "", category: "personalizado" as MessageTemplate["category"], content: "" });

  const handleSaveClinic = () => {
    toast({ title: "Dados salvos", description: "Configurações da clínica atualizadas com sucesso." });
  };

  const handleSaveProf = () => {
    if (!profForm.name || !profForm.email) return;
    if (editingProf) {
      setProfessionals((prev) =>
        prev.map((p) => (p.id === editingProf.id ? { ...p, ...profForm } : p))
      );
      toast({ title: "Profissional atualizado" });
    } else {
      setProfessionals((prev) => [
        ...prev,
        { id: `p-${Date.now()}`, ...profForm, status: "ativo" },
      ]);
      toast({ title: "Profissional adicionado" });
    }
    setEditingProf(null);
    setProfForm({ name: "", crn: "", specialty: "", email: "", phone: "", role: "nutricionista" });
  };

  const handleDeleteProf = (id: string) => {
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Profissional removido" });
  };

  const handleSaveTpl = () => {
    if (!tplForm.name || !tplForm.content) return;
    const vars = (tplForm.content.match(/\{(\w+)\}/g) || []).map((v) => v.slice(1, -1));
    if (editingTpl) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTpl.id ? { ...t, ...tplForm, variables: vars } : t))
      );
      toast({ title: "Template atualizado" });
    } else {
      setTemplates((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, ...tplForm, variables: vars, active: true },
      ]);
      toast({ title: "Template criado" });
    }
    setEditingTpl(null);
    setTplForm({ name: "", category: "personalizado", content: "" });
  };

  const handleDeleteTpl = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Template removido" });
  };

  const toggleTplActive = (id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  };

  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copiado!", description: "Template copiado para a área de transferência." });
  };

  const openEditProf = (p: Professional) => {
    setEditingProf(p);
    setProfForm({ name: p.name, crn: p.crn, specialty: p.specialty, email: p.email, phone: p.phone, role: p.role });
  };

  const openEditTpl = (t: MessageTemplate) => {
    setEditingTpl(t);
    setTplForm({ name: t.name, category: t.category, content: t.content });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground">Gerencie sua clínica, equipe e comunicação.</p>
        </div>

        <Tabs defaultValue="clinica" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clinica" className="gap-1.5">
              <Building2 className="h-4 w-4" /> Clínica
            </TabsTrigger>
            <TabsTrigger value="profissionais" className="gap-1.5">
              <Users className="h-4 w-4" /> Profissionais
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1.5">
              <MessageSquareText className="h-4 w-4" /> Templates
            </TabsTrigger>
          </TabsList>

          {/* ═══════════ CLÍNICA ═══════════ */}
          <TabsContent value="clinica" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados da Clínica</CardTitle>
                <CardDescription>Informações cadastrais e de contato.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Nome da Clínica</Label>
                    <Input value={clinic.name} onChange={(e) => setClinic({ ...clinic, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CNPJ</Label>
                    <Input value={clinic.cnpj} onChange={(e) => setClinic({ ...clinic, cnpj: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Telefone</Label>
                    <Input value={clinic.phone} onChange={(e) => setClinic({ ...clinic, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>E-mail</Label>
                    <Input value={clinic.email} onChange={(e) => setClinic({ ...clinic, email: e.target.value })} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Website</Label>
                    <Input value={clinic.website} onChange={(e) => setClinic({ ...clinic, website: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Rua</Label>
                    <Input value={clinic.street} onChange={(e) => setClinic({ ...clinic, street: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bairro</Label>
                    <Input value={clinic.neighborhood} onChange={(e) => setClinic({ ...clinic, neighborhood: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cidade</Label>
                    <Input value={clinic.city} onChange={(e) => setClinic({ ...clinic, city: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Estado</Label>
                    <Input value={clinic.state} onChange={(e) => setClinic({ ...clinic, state: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CEP</Label>
                    <Input value={clinic.zip} onChange={(e) => setClinic({ ...clinic, zip: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Funcionamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Horário</Label>
                    <Input value={clinic.workingHours} onChange={(e) => setClinic({ ...clinic, workingHours: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Dias de Atendimento</Label>
                    <Input value={clinic.workingDays} onChange={(e) => setClinic({ ...clinic, workingDays: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duração da Consulta (min)</Label>
                    <Input type="number" value={clinic.consultationDuration} onChange={(e) => setClinic({ ...clinic, consultationDuration: e.target.value })} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Agendamento Online</p>
                      <p className="text-xs text-muted-foreground">Permitir pacientes agendar online</p>
                    </div>
                    <Switch checked={clinic.onlineBooking} onCheckedChange={(v) => setClinic({ ...clinic, onlineBooking: v })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Lembretes via Chat</p>
                      <p className="text-xs text-muted-foreground">Enviar lembretes automáticos</p>
                    </div>
                    <Switch checked={clinic.whatsappReminders} onCheckedChange={(v) => setClinic({ ...clinic, whatsappReminders: v })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveClinic}>
                <Save className="h-4 w-4 mr-1.5" /> Salvar Alterações
              </Button>
            </div>
          </TabsContent>

          {/* ═══════════ PROFISSIONAIS ═══════════ */}
          <TabsContent value="profissionais" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Equipe</h2>
                <p className="text-sm text-muted-foreground">{professionals.length} profissionais cadastrados</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingProf(null); setProfForm({ name: "", crn: "", specialty: "", email: "", phone: "", role: "nutricionista" }); }}>
                    <Plus className="h-4 w-4 mr-1.5" /> Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingProf ? "Editar Profissional" : "Novo Profissional"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                      <Label>Nome completo</Label>
                      <Input value={profForm.name} onChange={(e) => setProfForm({ ...profForm, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>CRN</Label>
                        <Input value={profForm.crn} onChange={(e) => setProfForm({ ...profForm, crn: e.target.value })} placeholder="Opcional" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Função</Label>
                        <Select value={profForm.role} onValueChange={(v) => setProfForm({ ...profForm, role: v as Professional["role"] })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="nutricionista">Nutricionista</SelectItem>
                            <SelectItem value="secretaria">Secretária</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Especialidade</Label>
                      <Input value={profForm.specialty} onChange={(e) => setProfForm({ ...profForm, specialty: e.target.value })} placeholder="Opcional" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>E-mail</Label>
                        <Input type="email" value={profForm.email} onChange={(e) => setProfForm({ ...profForm, email: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Telefone</Label>
                        <Input value={profForm.phone} onChange={(e) => setProfForm({ ...profForm, phone: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleSaveProf}>Salvar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead className="hidden sm:table-cell">Função</TableHead>
                      <TableHead className="hidden md:table-cell">Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professionals.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.crn || p.specialty || "—"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs">{roleLabels[p.role]}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.status === "ativo" ? "default" : "secondary"} className="text-xs">
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProf(p)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Profissional</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 py-2">
                                  <div className="space-y-1.5">
                                    <Label>Nome completo</Label>
                                    <Input value={profForm.name} onChange={(e) => setProfForm({ ...profForm, name: e.target.value })} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                      <Label>CRN</Label>
                                      <Input value={profForm.crn} onChange={(e) => setProfForm({ ...profForm, crn: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label>Função</Label>
                                      <Select value={profForm.role} onValueChange={(v) => setProfForm({ ...profForm, role: v as Professional["role"] })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="admin">Administrador</SelectItem>
                                          <SelectItem value="nutricionista">Nutricionista</SelectItem>
                                          <SelectItem value="secretaria">Secretária</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label>Especialidade</Label>
                                    <Input value={profForm.specialty} onChange={(e) => setProfForm({ ...profForm, specialty: e.target.value })} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                      <Label>E-mail</Label>
                                      <Input value={profForm.email} onChange={(e) => setProfForm({ ...profForm, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label>Telefone</Label>
                                      <Input value={profForm.phone} onChange={(e) => setProfForm({ ...profForm, phone: e.target.value })} />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                                  <DialogClose asChild><Button onClick={handleSaveProf}>Salvar</Button></DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProf(p.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════ TEMPLATES ═══════════ */}
          <TabsContent value="templates" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Templates de Mensagens</h2>
                <p className="text-sm text-muted-foreground">Use variáveis com {"{nome}"} no corpo da mensagem.</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingTpl(null); setTplForm({ name: "", category: "personalizado", content: "" }); }}>
                    <Plus className="h-4 w-4 mr-1.5" /> Novo Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingTpl ? "Editar Template" : "Novo Template"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                      <Label>Nome</Label>
                      <Input value={tplForm.name} onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Categoria</Label>
                      <Select value={tplForm.category} onValueChange={(v) => setTplForm({ ...tplForm, category: v as MessageTemplate["category"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Conteúdo</Label>
                      <Textarea rows={4} value={tplForm.content} onChange={(e) => setTplForm({ ...tplForm, content: e.target.value })} placeholder="Use {nome}, {data}, {hora}..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <DialogClose asChild><Button onClick={handleSaveTpl}>Salvar</Button></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {templates.map((t) => (
                <Card key={t.id} className={!t.active ? "opacity-60" : ""}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{t.name}</CardTitle>
                      <Switch checked={t.active} onCheckedChange={() => toggleTplActive(t.id)} />
                    </div>
                    <Badge variant="outline" className="text-[10px] w-fit">{categoryLabels[t.category]}</Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {t.variables.map((v) => (
                        <Badge key={v} variant="secondary" className="text-[10px]">{`{${v}}`}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-1 pt-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => copyTemplate(t.content)}>
                        <Copy className="h-3 w-3 mr-1" /> Copiar
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEditTpl(t)}>
                            <Pencil className="h-3 w-3 mr-1" /> Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Template</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 py-2">
                            <div className="space-y-1.5">
                              <Label>Nome</Label>
                              <Input value={tplForm.name} onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                              <Label>Categoria</Label>
                              <Select value={tplForm.category} onValueChange={(v) => setTplForm({ ...tplForm, category: v as MessageTemplate["category"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {Object.entries(categoryLabels).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>{v}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1.5">
                              <Label>Conteúdo</Label>
                              <Textarea rows={4} value={tplForm.content} onChange={(e) => setTplForm({ ...tplForm, content: e.target.value })} />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                            <DialogClose asChild><Button onClick={handleSaveTpl}>Salvar</Button></DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => handleDeleteTpl(t.id)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
