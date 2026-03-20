import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  UserX,
} from "lucide-react";

const todayAppointments = [
  { time: "08:00", patient: "Maria Silva", type: "Retorno", status: "confirmed" },
  { time: "09:00", patient: "João Santos", type: "Primeira Consulta", status: "confirmed" },
  { time: "10:30", patient: "Ana Oliveira", type: "Retorno", status: "pending" },
  { time: "14:00", patient: "Carlos Souza", type: "Teleconsulta", status: "confirmed" },
  { time: "15:30", patient: "Fernanda Lima", type: "Retorno", status: "confirmed" },
  { time: "16:30", patient: "Roberto Almeida", type: "Primeira Consulta", status: "pending" },
];

const overduePatients = [
  { name: "Paula Mendes", lastVisit: "12/01/2026", days: 67 },
  { name: "Ricardo Gomes", lastVisit: "05/01/2026", days: 74 },
  { name: "Luciana Barros", lastVisit: "28/12/2025", days: 82 },
];

const statusBadge = {
  confirmed: { label: "Confirmada", className: "bg-primary/10 text-primary border-primary/20" },
  pending: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
};

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Bom dia, Dra. Natália 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Quinta-feira, 20 de março de 2026</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Consultas Hoje"
            value="6"
            subtitle="2 pendentes de confirmação"
            icon={Calendar}
            variant="primary"
          />
          <MetricCard
            title="Receita do Mês"
            value="R$ 12.450"
            icon={DollarSign}
            trend={{ value: "8% vs mês anterior", positive: true }}
            variant="info"
          />
          <MetricCard
            title="Pacientes no Mês"
            value="42"
            subtitle="12 novos pacientes"
            icon={Users}
          />
          <MetricCard
            title="Taxa de Ocupação"
            value="78%"
            icon={TrendingUp}
            trend={{ value: "5% vs semana anterior", positive: true }}
            variant="primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Agenda de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {todayAppointments.map((apt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-medium text-primary w-12">{apt.time}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{apt.patient}</p>
                      <p className="text-xs text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusBadge[apt.status as keyof typeof statusBadge].className}>
                    {statusBadge[apt.status as keyof typeof statusBadge].label}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alerts */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Inadimplência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-2">
                  <p className="text-3xl font-semibold text-warning">3</p>
                  <p className="text-xs text-muted-foreground mt-1">pacientes com pagamento atrasado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <UserX className="h-4 w-4 text-destructive" />
                  Sem Retorno (+60 dias)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {overduePatients.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Última: {p.lastVisit}</p>
                    </div>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                      {p.days}d
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
