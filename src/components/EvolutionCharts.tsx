import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { mockBodyMetrics } from "@/data/prontuario";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingDown, Scale, Ruler, Activity } from "lucide-react";

export function EvolutionCharts() {
  const data = useMemo(
    () =>
      mockBodyMetrics.map((m) => ({
        ...m,
        label: format(parseISO(m.date), "MMM/yy", { locale: ptBR }),
      })),
    []
  );

  const first = mockBodyMetrics[0];
  const last = mockBodyMetrics[mockBodyMetrics.length - 1];
  const weightLoss = (first.weight - last.weight).toFixed(1);
  const imcDrop = (first.imc - last.imc).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard icon={Scale} label="Peso atual" value={`${last.weight} kg`} sub={`-${weightLoss} kg total`} />
        <SummaryCard icon={Activity} label="IMC atual" value={last.imc.toFixed(1)} sub={`-${imcDrop} total`} />
        <SummaryCard icon={Ruler} label="Cintura" value={`${last.circunferenciaCintura} cm`} sub={`-${(first.circunferenciaCintura! - last.circunferenciaCintura!)} cm`} />
        <SummaryCard icon={TrendingDown} label="% Gordura" value={`${last.percentualGordura}%`} sub={`-${(first.percentualGordura! - last.percentualGordura!).toFixed(1)}%`} />
      </div>

      {/* Weight Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Evolução de Peso (kg)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(148, 62%, 26%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(148, 62%, 26%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 10%, 90%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(140,10%,90%)" }} />
              <Area type="monotone" dataKey="weight" stroke="hsl(148, 62%, 26%)" fill="url(#weightGrad)" strokeWidth={2} name="Peso (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* IMC + Body Fat Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Evolução do IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 10%, 90%)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(140,10%,90%)" }} />
                <Line type="monotone" dataKey="imc" stroke="hsl(210, 80%, 52%)" strokeWidth={2} dot={{ r: 3 }} name="IMC" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Circunferências (cm)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 10%, 90%)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(150, 5%, 45%)" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(140,10%,90%)" }} />
                <Line type="monotone" dataKey="circunferenciaCintura" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Cintura" />
                <Line type="monotone" dataKey="circunferenciaQuadril" stroke="hsl(148, 62%, 26%)" strokeWidth={2} dot={{ r: 3 }} name="Quadril" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="text-xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-primary font-medium mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}
