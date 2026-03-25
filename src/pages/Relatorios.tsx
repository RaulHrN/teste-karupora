import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart, PieChart, Pie, Cell,
} from "recharts";
import {
  CalendarCheck, TrendingUp, Users, UserPlus, FileDown, FileSpreadsheet,
  ArrowUpRight, ArrowDownRight, Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  occupationData, returnRateData, patientTypeData, patientProgress,
} from "@/data/relatorios";

const COLORS = [
  "hsl(148, 62%, 26%)", "hsl(148, 40%, 50%)", "hsl(200, 60%, 50%)",
  "hsl(40, 80%, 55%)", "hsl(0, 60%, 50%)",
];

function MetricSummary({ icon: Icon, label, value, trend, trendUp }: {
  icon: React.ElementType; label: string; value: string; trend: string; trendUp: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold text-foreground">{value}</p>
            </div>
          </div>
          <Badge variant={trendUp ? "default" : "destructive"} className="gap-1">
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Relatorios() {
  const [selectedPatient, setSelectedPatient] = useState(patientProgress[0].id);
  const { toast } = useToast();

  const patient = patientProgress.find((p) => p.id === selectedPatient)!;
  const latestOccupation = occupationData[occupationData.length - 1];
  const latestReturn = returnRateData[returnRateData.length - 1];
  const latestPatientType = patientTypeData[patientTypeData.length - 1];
  const totalPatientsMonth = latestPatientType.novos + latestPatientType.recorrentes;

  const pieData = [
    { name: "Novos", value: latestPatientType.novos },
    { name: "Recorrentes", value: latestPatientType.recorrentes },
  ];

  const weightDelta = patient.weightHistory.length >= 2
    ? (patient.weightHistory[patient.weightHistory.length - 1].weight - patient.weightHistory[0].weight).toFixed(1)
    : "0";

  const handleExport = (type: "pdf" | "excel") => {
    toast({
      title: type === "pdf" ? "Exportando PDF..." : "Exportando Excel...",
      description: "O relatório será baixado em instantes.",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Métricas de desempenho e evolução dos pacientes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <FileDown className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricSummary
            icon={CalendarCheck} label="Ocupação da Agenda"
            value={`${latestOccupation.rate}%`} trend="+5% vs mês anterior" trendUp
          />
          <MetricSummary
            icon={TrendingUp} label="Taxa de Retorno"
            value={`${latestReturn.rate}%`} trend="+3% vs mês anterior" trendUp
          />
          <MetricSummary
            icon={UserPlus} label="Pacientes Novos"
            value={String(latestPatientType.novos)} trend="+14% vs mês anterior" trendUp
          />
          <MetricSummary
            icon={Users} label="Total Atendidos"
            value={String(totalPatientsMonth)} trend="+8% vs mês anterior" trendUp
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="occupation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="occupation">Ocupação</TabsTrigger>
            <TabsTrigger value="return">Taxa de Retorno</TabsTrigger>
            <TabsTrigger value="patients">Novos vs Recorrentes</TabsTrigger>
            <TabsTrigger value="progress">Progresso Individual</TabsTrigger>
          </TabsList>

          {/* Occupation Tab */}
          <TabsContent value="occupation">
            <Card>
              <CardHeader>
                <CardTitle>Ocupação da Agenda — Últimos 6 meses</CardTitle>
                <CardDescription>Slots disponíveis vs ocupados por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={occupationData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="slots" name="Total Slots" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.3} />
                      <Bar dataKey="occupied" name="Ocupados" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead className="text-right">Slots</TableHead>
                        <TableHead className="text-right">Ocupados</TableHead>
                        <TableHead className="text-right">Taxa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {occupationData.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell className="text-right">{row.slots}</TableCell>
                          <TableCell className="text-right">{row.occupied}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={row.rate >= 80 ? "default" : "secondary"}>{row.rate}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Return Rate Tab */}
          <TabsContent value="return">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Retorno de Pacientes</CardTitle>
                <CardDescription>Pacientes que retornaram após primeira consulta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={returnRateData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} unit="%" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                        formatter={(value: number) => [`${value}%`, "Taxa de Retorno"]}
                      />
                      <Area
                        type="monotone" dataKey="rate" name="Taxa de Retorno"
                        stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead className="text-right">1ª Consulta</TableHead>
                        <TableHead className="text-right">Retornaram</TableHead>
                        <TableHead className="text-right">Taxa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnRateData.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell className="text-right">{row.firstVisit}</TableCell>
                          <TableCell className="text-right">{row.returned}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={row.rate >= 75 ? "default" : "secondary"}>{row.rate}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New vs Recurring Tab */}
          <TabsContent value="patients">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Pacientes Novos vs Recorrentes</CardTitle>
                  <CardDescription>Evolução mensal por tipo de paciente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={patientTypeData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="novos" name="Novos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="recorrentes" name="Recorrentes" fill="hsl(148, 40%, 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Atual</CardTitle>
                  <CardDescription>Mês corrente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                          dataKey="value" paddingAngle={4}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Novos</span>
                      <span className="font-medium text-foreground">
                        {latestPatientType.novos} ({Math.round((latestPatientType.novos / totalPatientsMonth) * 100)}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recorrentes</span>
                      <span className="font-medium text-foreground">
                        {latestPatientType.recorrentes} ({Math.round((latestPatientType.recorrentes / totalPatientsMonth) * 100)}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Individual Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Progresso Individual do Paciente</CardTitle>
                    <CardDescription>Evolução de peso e IMC ao longo do acompanhamento</CardDescription>
                  </div>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {patientProgress.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-lg border p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-sm font-medium text-foreground">{patient.objective}</p>
                  </div>
                  <div className="rounded-lg border p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Consultas</p>
                    <p className="text-sm font-medium text-foreground">{patient.totalVisits}</p>
                  </div>
                  <div className="rounded-lg border p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Variação de Peso</p>
                    <p className={`text-sm font-medium ${Number(weightDelta) <= 0 ? "text-primary" : "text-destructive"}`}>
                      {Number(weightDelta) > 0 ? "+" : ""}{weightDelta} kg
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Adesão ao Plano</p>
                    <div className="flex items-center gap-2">
                      <Progress value={patient.adherence} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-foreground">{patient.adherence}%</span>
                    </div>
                  </div>
                </div>

                {/* Weight + IMC chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patient.weightHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                      <YAxis yAxisId="weight" className="text-xs fill-muted-foreground" unit=" kg" />
                      <YAxis yAxisId="imc" orientation="right" className="text-xs fill-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="weight" type="monotone" dataKey="weight" name="Peso (kg)"
                        stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }}
                      />
                      <Line
                        yAxisId="imc" type="monotone" dataKey="imc" name="IMC"
                        stroke="hsl(200, 60%, 50%)" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Weight history table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Peso (kg)</TableHead>
                      <TableHead className="text-right">IMC</TableHead>
                      <TableHead className="text-right">Classificação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.weightHistory.map((entry) => {
                      let classification = "Normal";
                      let variant: "default" | "secondary" | "destructive" = "default";
                      if (entry.imc < 18.5) { classification = "Abaixo do peso"; variant = "secondary"; }
                      else if (entry.imc < 25) { classification = "Normal"; variant = "default"; }
                      else if (entry.imc < 30) { classification = "Sobrepeso"; variant = "secondary"; }
                      else { classification = "Obesidade"; variant = "destructive"; }

                      return (
                        <TableRow key={entry.date}>
                          <TableCell className="font-medium">{entry.date}</TableCell>
                          <TableCell className="text-right">{entry.weight}</TableCell>
                          <TableCell className="text-right">{entry.imc}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={variant}>{classification}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
