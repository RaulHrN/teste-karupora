import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/MetricCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import { mockTransactions, monthlyRevenue, Transaction } from "@/data/financeiro";
import { format, parseISO, differenceInDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

const statusConfig = {
  pago: { label: "Pago", className: "bg-primary/10 text-primary border-primary/20" },
  pendente: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
  atrasado: { label: "Atrasado", className: "bg-destructive/10 text-destructive border-destructive/20" },
  cancelado: { label: "Cancelado", className: "bg-muted text-muted-foreground border-border" },
};

function exportCSV(transactions: Transaction[]) {
  const header = "ID,Paciente,Descrição,Valor,Data,Vencimento,Pagamento,Status,Método,Tipo\n";
  const rows = transactions.map((t) =>
    [t.id, t.patientName, t.description, t.value.toFixed(2), t.date, t.dueDate, t.paidAt || "", t.status, t.method || "", t.type].join(",")
  ).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `financeiro_${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast({ title: "CSV exportado", description: "O arquivo foi baixado com sucesso." });
}

export default function Financeiro() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const today = new Date();

  const filtered = useMemo(() => {
    if (statusFilter === "all") return mockTransactions;
    return mockTransactions.filter((t) => t.status === statusFilter);
  }, [statusFilter]);

  // Metrics
  const totalReceived = mockTransactions.filter((t) => t.status === "pago").reduce((s, t) => s + t.value, 0);
  const totalPending = mockTransactions.filter((t) => t.status === "pendente").reduce((s, t) => s + t.value, 0);
  const totalOverdue = mockTransactions.filter((t) => t.status === "atrasado").reduce((s, t) => s + t.value, 0);

  // Aging
  const overdueTransactions = mockTransactions.filter((t) => t.status === "atrasado");
  const aging = useMemo(() => {
    const buckets = { "1-30": [] as Transaction[], "31-60": [] as Transaction[], "61-90": [] as Transaction[], "90+": [] as Transaction[] };
    overdueTransactions.forEach((t) => {
      const days = differenceInDays(today, parseISO(t.dueDate));
      if (days <= 30) buckets["1-30"].push(t);
      else if (days <= 60) buckets["31-60"].push(t);
      else if (days <= 90) buckets["61-90"].push(t);
      else buckets["90+"].push(t);
    });
    return buckets;
  }, [overdueTransactions]);

  const agingChart = [
    { bucket: "1-30 dias", total: aging["1-30"].reduce((s, t) => s + t.value, 0), count: aging["1-30"].length },
    { bucket: "31-60 dias", total: aging["31-60"].reduce((s, t) => s + t.value, 0), count: aging["31-60"].length },
    { bucket: "61-90 dias", total: aging["61-90"].reduce((s, t) => s + t.value, 0), count: aging["61-90"].length },
    { bucket: "90+ dias", total: aging["90+"].reduce((s, t) => s + t.value, 0), count: aging["90+"].length },
  ];

  const agingColors = ["hsl(38, 92%, 50%)", "hsl(25, 90%, 50%)", "hsl(10, 85%, 50%)", "hsl(0, 72%, 51%)"];

  // Revenue by type
  const revenueByType = useMemo(() => {
    const map: Record<string, number> = {};
    mockTransactions.filter((t) => t.status === "pago").forEach((t) => {
      const label = t.type === "consulta" ? "1ª Consulta" : t.type === "retorno" ? "Retorno" : t.type === "teleconsulta" ? "Teleconsulta" : "Pacote";
      map[label] = (map[label] || 0) + t.value;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Financeiro</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Cobranças, inadimplência e receita</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportCSV(filtered)}>
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button size="sm" className="gap-1.5">
              <DollarSign className="h-4 w-4" />
              Nova Cobrança
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Recebido no Mês" value={`R$ ${totalReceived.toLocaleString("pt-BR")}`} icon={DollarSign} variant="primary" trend={{ value: "12% vs mês anterior", positive: true }} />
          <MetricCard title="Pendente" value={`R$ ${totalPending.toLocaleString("pt-BR")}`} icon={Clock} variant="warning" subtitle={`${mockTransactions.filter((t) => t.status === "pendente").length} cobranças`} />
          <MetricCard title="Inadimplente" value={`R$ ${totalOverdue.toLocaleString("pt-BR")}`} icon={AlertTriangle} variant="warning" subtitle={`${overdueTransactions.length} cobranças atrasadas`} />
          <MetricCard title="Projeção Abril" value="R$ 5.200" icon={TrendingUp} variant="info" subtitle="Baseado na agenda futura" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transacoes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="inadimplencia">Inadimplência</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* Transações */}
          <TabsContent value="transacoes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Histórico de Transações</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Método</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-sm font-medium">{t.patientName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.description}</TableCell>
                        <TableCell className="text-sm font-medium">R$ {t.value.toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{format(parseISO(t.dueDate), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig[t.status].className}>
                            {statusConfig[t.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground capitalize">{t.method || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inadimplência */}
          <TabsContent value="inadimplencia">
            <div className="space-y-4">
              {/* Aging Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Aging de Inadimplência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={agingChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 10%, 90%)" />
                      <XAxis dataKey="bucket" tick={{ fontSize: 12 }} stroke="hsl(150, 5%, 45%)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" tickFormatter={(v) => `R$${v}`} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(140,10%,90%)" }} formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Total"]} />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]} name="Total">
                        {agingChart.map((_, i) => (
                          <Cell key={i} fill={agingColors[i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Aging detail */}
              {(["1-30", "31-60", "61-90", "90+"] as const).map((bucket, bi) => {
                const items = aging[bucket];
                if (items.length === 0) return null;
                return (
                  <Card key={bucket}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: agingColors[bi] }} />
                        {bucket} dias — {items.length} cobrança(s) — R$ {items.reduce((s, t) => s + t.value, 0).toFixed(2)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Vencimento</TableHead>
                            <TableHead>Dias atraso</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((t) => (
                            <TableRow key={t.id}>
                              <TableCell className="text-sm font-medium">{t.patientName}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{t.description}</TableCell>
                              <TableCell className="text-sm font-medium">R$ {t.value.toFixed(2)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{format(parseISO(t.dueDate), "dd/MM/yyyy")}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                                  {differenceInDays(today, parseISO(t.dueDate))}d
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="space-y-4">
              {/* Revenue + Projection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Receita Mensal e Projeção</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 10%, 90%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(140,10%,90%)" }} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="receita" name="Receita" fill="hsl(148, 62%, 26%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="projecao" name="Projeção" fill="hsl(148, 62%, 26%, 0.35)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue by type */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Receita por Tipo de Consulta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={revenueByType} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 10%, 90%)" />
                        <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" tickFormatter={(v) => `R$${v}`} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} stroke="hsl(150, 5%, 45%)" />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(140,10%,90%)" }} formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Receita"]} />
                        <Bar dataKey="value" fill="hsl(210, 80%, 52%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resumo do Período</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <SummaryRow label="Total recebido" value={`R$ ${totalReceived.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} className="text-primary font-semibold" />
                    <SummaryRow label="Pendente de pagamento" value={`R$ ${totalPending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} className="text-warning font-semibold" />
                    <SummaryRow label="Inadimplente" value={`R$ ${totalOverdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} className="text-destructive font-semibold" />
                    <div className="border-t pt-3">
                      <SummaryRow label="Total geral" value={`R$ ${(totalReceived + totalPending + totalOverdue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} className="text-foreground font-bold text-lg" />
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      <SummaryRow label="Cobranças pagas" value={`${mockTransactions.filter((t) => t.status === "pago").length}`} />
                      <SummaryRow label="Taxa de inadimplência" value={`${((overdueTransactions.length / mockTransactions.length) * 100).toFixed(0)}%`} className="text-destructive" />
                      <SummaryRow label="Ticket médio" value={`R$ ${(totalReceived / mockTransactions.filter((t) => t.status === "pago").length).toFixed(2)}`} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function SummaryRow({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${className}`}>{value}</span>
    </div>
  );
}
