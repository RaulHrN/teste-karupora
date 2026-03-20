import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  time: string;
  duration: number; // minutes
  patient: string;
  type: "primeira" | "retorno" | "teleconsulta";
  status: "confirmed" | "pending" | "completed";
  dayOffset: number; // 0=Mon, 1=Tue...
}

const mockAppointments: Appointment[] = [
  { id: "1", time: "08:00", duration: 60, patient: "Maria Silva", type: "retorno", status: "confirmed", dayOffset: 0 },
  { id: "2", time: "10:00", duration: 60, patient: "João Santos", type: "primeira", status: "confirmed", dayOffset: 0 },
  { id: "3", time: "14:00", duration: 45, patient: "Ana Oliveira", type: "teleconsulta", status: "pending", dayOffset: 1 },
  { id: "4", time: "09:00", duration: 60, patient: "Carlos Souza", type: "retorno", status: "confirmed", dayOffset: 2 },
  { id: "5", time: "11:00", duration: 60, patient: "Fernanda Lima", type: "primeira", status: "pending", dayOffset: 2 },
  { id: "6", time: "08:00", duration: 60, patient: "Roberto Almeida", type: "retorno", status: "confirmed", dayOffset: 3 },
  { id: "7", time: "15:00", duration: 45, patient: "Paula Mendes", type: "teleconsulta", status: "confirmed", dayOffset: 3 },
  { id: "8", time: "09:00", duration: 60, patient: "Ricardo Gomes", type: "primeira", status: "confirmed", dayOffset: 4 },
  { id: "9", time: "14:00", duration: 60, patient: "Luciana Barros", type: "retorno", status: "pending", dayOffset: 4 },
];

const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 08:00 - 17:00

const typeLabels = {
  primeira: { label: "1ª Consulta", className: "bg-info/10 text-info border-info/20" },
  retorno: { label: "Retorno", className: "bg-primary/10 text-primary border-primary/20" },
  teleconsulta: { label: "Teleconsulta", className: "bg-accent text-accent-foreground border-accent-foreground/20" },
};

const statusDot = {
  confirmed: "bg-primary",
  pending: "bg-warning",
  completed: "bg-muted-foreground",
};

export default function Agenda() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const today = new Date();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Agenda</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} — {format(addDays(weekStart, 4), "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekStart(addDays(weekStart, -7))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
                Hoje
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekStart(addDays(weekStart, 7))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0 overflow-auto">
            <div className="min-w-[800px]">
              {/* Day Headers */}
              <div className="grid grid-cols-[64px_repeat(5,1fr)] border-b">
                <div className="p-3" />
                {weekDays.map((day, i) => {
                  const isToday = isSameDay(day, today);
                  return (
                    <div
                      key={i}
                      className={`p-3 text-center border-l ${isToday ? "bg-primary/5" : ""}`}
                    >
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {format(day, "EEE", { locale: ptBR })}
                      </p>
                      <p className={`text-lg font-semibold mt-0.5 ${isToday ? "text-primary" : "text-foreground"}`}>
                        {format(day, "dd")}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Time Grid */}
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-[64px_repeat(5,1fr)] border-b last:border-b-0 min-h-[72px]">
                  <div className="p-2 text-[11px] font-mono text-muted-foreground text-right pr-3 pt-1">
                    {String(hour).padStart(2, "0")}:00
                  </div>
                  {weekDays.map((day, dayIdx) => {
                    const isToday = isSameDay(day, today);
                    const apt = mockAppointments.find(
                      (a) => a.dayOffset === dayIdx && parseInt(a.time) === hour
                    );
                    return (
                      <div
                        key={dayIdx}
                        className={`border-l p-1 ${isToday ? "bg-primary/[0.02]" : ""} ${!apt ? "hover:bg-accent/30 cursor-pointer transition-colors" : ""}`}
                      >
                        {apt && (
                          <div className="bg-card border rounded-lg p-2 h-full shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={`h-1.5 w-1.5 rounded-full ${statusDot[apt.status]}`} />
                              <span className="text-xs font-mono text-muted-foreground">{apt.time}</span>
                            </div>
                            <p className="text-sm font-medium text-foreground truncate">{apt.patient}</p>
                            <Badge variant="outline" className={`mt-1 text-[10px] py-0 ${typeLabels[apt.type].className}`}>
                              {typeLabels[apt.type].label}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
