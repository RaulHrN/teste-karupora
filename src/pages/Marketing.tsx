import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/MetricCard";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Megaphone,
  Send,
  Cake,
  Target,
  Users,
  Plus,
  MessageCircle,
  Mail,
  CheckCircle,
  Clock,
  FileEdit,
} from "lucide-react";
import { mockCampaigns, mockBirthdayPatients, mockSegments } from "@/data/marketing";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";

const statusConfig = {
  rascunho: { label: "Rascunho", icon: FileEdit, className: "bg-muted text-muted-foreground border-border" },
  agendada: { label: "Agendada", icon: Clock, className: "bg-info/10 text-info border-info/20" },
  enviada: { label: "Enviada", icon: CheckCircle, className: "bg-primary/10 text-primary border-primary/20" },
  cancelada: { label: "Cancelada", icon: FileEdit, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const typeConfig = {
  reativacao: { label: "Reativação", className: "bg-warning/10 text-warning border-warning/20" },
  aniversario: { label: "Aniversário", className: "bg-accent text-accent-foreground border-accent-foreground/20" },
  promocional: { label: "Promocional", className: "bg-info/10 text-info border-info/20" },
  informativo: { label: "Informativo", className: "bg-muted text-muted-foreground border-border" },
};

const pieColors = [
  "hsl(148, 62%, 26%)", "hsl(210, 80%, 52%)", "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 50%)", "hsl(0, 72%, 51%)", "hsl(170, 50%, 40%)",
];

export default function Marketing() {
  const sentCampaigns = mockCampaigns.filter((c) => c.status === "enviada");
  const totalSent = sentCampaigns.reduce((s, c) => s + c.sentCount, 0);
  const totalDelivered = sentCampaigns.reduce((s, c) => s + c.deliveredCount, 0);
  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(0) : "0";

  const segmentChart = mockSegments.map((s) => ({ name: s.objective, value: s.count }));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Marketing</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Campanhas, reativação e segmentação de pacientes</p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Campanhas Enviadas" value={String(sentCampaigns.length)} icon={Send} variant="primary" subtitle="nos últimos 90 dias" />
          <MetricCard title="Mensagens Enviadas" value={String(totalSent)} icon={MessageCircle} subtitle={`${totalDelivered} entregues`} />
          <MetricCard title="Taxa de Entrega" value={`${deliveryRate}%`} icon={Target} variant="primary" />
          <MetricCard title="Aniversariantes" value={String(mockBirthdayPatients.length)} icon={Cake} variant="info" subtitle="esta semana" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="campanhas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
            <TabsTrigger value="aniversariantes">Aniversariantes</TabsTrigger>
            <TabsTrigger value="segmentacao">Segmentação</TabsTrigger>
          </TabsList>

          {/* Campanhas */}
          <TabsContent value="campanhas">
            <div className="space-y-3">
              {mockCampaigns.map((campaign) => {
                const delivery = campaign.sentCount > 0 ? (campaign.deliveredCount / campaign.sentCount) * 100 : 0;
                return (
                  <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-sm font-semibold text-foreground">{campaign.name}</h3>
                            <Badge variant="outline" className={typeConfig[campaign.type].className}>
                              {typeConfig[campaign.type].label}
                            </Badge>
                            <Badge variant="outline" className={statusConfig[campaign.status].className}>
                              {statusConfig[campaign.status].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {campaign.channel === "whatsapp" ? <MessageCircle className="inline h-3 w-3 mr-1" /> : <Mail className="inline h-3 w-3 mr-1" />}
                            {campaign.channel === "whatsapp" ? "WhatsApp" : "E-mail"} · Critério: {campaign.criteria}
                          </p>
                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span>Criada: {format(parseISO(campaign.createdAt), "dd/MM/yyyy")}</span>
                            {campaign.sentAt && <span>Enviada: {format(parseISO(campaign.sentAt), "dd/MM/yyyy")}</span>}
                            {campaign.scheduledAt && !campaign.sentAt && <span>Agendada: {format(parseISO(campaign.scheduledAt), "dd/MM/yyyy")}</span>}
                          </div>
                        </div>
                        {campaign.status === "enviada" && (
                          <div className="text-right shrink-0 w-36">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Entrega</span>
                              <span className="font-medium text-foreground">{delivery.toFixed(0)}%</span>
                            </div>
                            <Progress value={delivery} className="h-1.5" />
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {campaign.deliveredCount}/{campaign.sentCount} entregues
                            </p>
                          </div>
                        )}
                        {campaign.status === "rascunho" && (
                          <Button size="sm" variant="outline" className="gap-1 shrink-0">
                            <FileEdit className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Aniversariantes */}
          <TabsContent value="aniversariantes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cake className="h-4 w-4 text-primary" />
                  Aniversariantes da Semana
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => toast({ title: "Mensagens enviadas", description: "Parabéns enviado para todos os aniversariantes." })}
                >
                  <Send className="h-4 w-4" />
                  Enviar para Todos
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Aniversário</TableHead>
                      <TableHead>Dia</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Mensagem</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBirthdayPatients.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground">
                              {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </div>
                            <span className="text-sm font-medium">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{format(parseISO(p.birthDate), "dd/MM")}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.dayOfWeek}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.phone}</TableCell>
                        <TableCell>
                          {p.messageSent ? (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">Enviada</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">Pendente</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!p.messageSent && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-xs h-7"
                              onClick={() => toast({ title: "Enviado!", description: `Mensagem de aniversário enviada para ${p.name}.` })}
                            >
                              <Send className="h-3 w-3" />
                              Enviar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segmentação */}
          <TabsContent value="segmentacao">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Pie Chart */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Distribuição por Objetivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={segmentChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${percent > 0.08 ? name.split(" ")[0] : ""}`}
                        labelLine={false}
                        fontSize={11}
                      >
                        {segmentChart.map((_, i) => (
                          <Cell key={i} fill={pieColors[i % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(140,10%,90%)" }} formatter={(v: number) => [`${v} pacientes`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Segment Table */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Segmentos por Objetivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Objetivo</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Ativos</TableHead>
                        <TableHead className="text-center">Inativos</TableHead>
                        <TableHead className="text-center">Idade Média</TableHead>
                        <TableHead className="w-[120px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSegments.map((seg, i) => (
                        <TableRow key={seg.objective}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                              <span className="text-sm font-medium">{seg.objective}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-center">{seg.count}</TableCell>
                          <TableCell className="text-sm text-center text-primary font-medium">{seg.active}</TableCell>
                          <TableCell className="text-sm text-center text-destructive">{seg.inactive}</TableCell>
                          <TableCell className="text-sm text-center text-muted-foreground">{seg.avgAge} anos</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs h-7"
                              onClick={() => toast({ title: "Campanha criada", description: `Rascunho de campanha para "${seg.objective}" criado.` })}
                            >
                              <Megaphone className="h-3 w-3" />
                              Campanha
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
