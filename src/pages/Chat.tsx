import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Send,
  User,
  UtensilsCrossed,
  TrendingUp,
  Download,
  Share2,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { mockPatients, Patient } from "@/data/patients";
import { mockMealPlans, mockBodyMetrics } from "@/data/prontuario";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  text: string;
  sender: "user" | "patient";
  timestamp: Date;
}

const initialMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Olá Dra., segui o plano direitinho essa semana!", sender: "patient", timestamp: new Date(2026, 2, 25, 9, 15) },
    { id: "m2", text: "Ótimo, Maria! Vamos revisar seus resultados na próxima consulta.", sender: "user", timestamp: new Date(2026, 2, 25, 9, 20) },
  ],
  "2": [
    { id: "m3", text: "Dra., posso substituir o frango por atum no almoço?", sender: "patient", timestamp: new Date(2026, 2, 24, 14, 30) },
  ],
  "5": [
    { id: "m4", text: "Bom dia! Consegui bater todas as metas de macro essa semana 💪", sender: "patient", timestamp: new Date(2026, 2, 25, 7, 45) },
  ],
};

export default function Chat() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const filtered = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const patientMessages = selectedPatient ? messages[selectedPatient.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [patientMessages.length]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedPatient) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedPatient.id]: [...(prev[selectedPatient.id] || []), msg],
    }));
    setNewMessage("");
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const lastMsg = (id: string) => {
    const msgs = messages[id];
    if (!msgs?.length) return "Nenhuma mensagem";
    return msgs[msgs.length - 1].text.slice(0, 40) + (msgs[msgs.length - 1].text.length > 40 ? "..." : "");
  };

  const handleDownload = () => {
    toast({ title: "Download iniciado", description: "Relatório de progresso sendo gerado..." });
  };

  const handleSendReport = () => {
    if (!selectedPatient) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      text: "📊 Relatório de progresso enviado — confira seus resultados!",
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedPatient.id]: [...(prev[selectedPatient.id] || []), msg],
    }));
    toast({ title: "Relatório enviado", description: `Relatório enviado para ${selectedPatient.name}` });
  };

  const handleSendMealPlan = () => {
    if (!selectedPatient) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      text: `📋 Cardápio "${(mockMealPlans[selectedPatient.id]?.[0])?.title || "Plano"}" enviado — ${(mockMealPlans[selectedPatient.id]?.[0])?.targetCalories || 0} kcal/dia.`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedPatient.id]: [...(prev[selectedPatient.id] || []), msg],
    }));
    toast({ title: "Cardápio enviado", description: `Plano alimentar enviado para ${selectedPatient.name}` });
  };

  const latestMetrics = mockBodyMetrics[mockBodyMetrics.length - 1];
  const previousMetrics = mockBodyMetrics[mockBodyMetrics.length - 2];

  // ── Sidebar list ──
  const PatientList = () => (
    <div className="flex flex-col h-full border-r border-border bg-card">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelectedPatient(p); setActivePanel(null); }}
            className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-accent/50 border-b border-border/50 ${
              selectedPatient?.id === p.id ? "bg-accent" : ""
            }`}
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(p.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate text-foreground">{p.name}</span>
                <Badge variant={p.status === "ativo" ? "default" : "secondary"} className="text-[10px] ml-1 shrink-0">
                  {p.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{lastMsg(p.id)}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground text-center">Nenhum paciente encontrado.</p>
        )}
      </ScrollArea>
    </div>
  );

  // ── Action panel content ──
  const ActionPanel = () => {
    if (!selectedPatient || !activePanel) return null;

    return (
      <div className="border-l border-border bg-card flex flex-col h-full">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setActivePanel(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground">
            {activePanel === "dados" && "Dados Pessoais"}
            {activePanel === "cardapio" && "Cardápio"}
            {activePanel === "metricas" && "Métricas"}
          </span>
        </div>
        <ScrollArea className="flex-1 p-4">
          {activePanel === "dados" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedPatient.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedPatient.objective}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> <span>{selectedPatient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedPatient.address.city}, {selectedPatient.address.state}</span>
                </div>
              </div>
              {(selectedPatient.allergies.length > 0 || selectedPatient.intolerances.length > 0) && (
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center gap-1 text-destructive text-xs font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" /> Alertas
                    </div>
                    {selectedPatient.allergies.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-foreground">Alergias:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.allergies.map((a) => (
                            <Badge key={a} variant="destructive" className="text-[10px]">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedPatient.intolerances.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-foreground">Intolerâncias:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.intolerances.map((i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-destructive/50 text-destructive">{i}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              <div className="text-sm space-y-1">
                <p className="font-medium text-foreground">Histórico Médico</p>
                <p className="text-muted-foreground text-xs">{selectedPatient.medicalHistory}</p>
              </div>
              {selectedPatient.medications && (
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">Medicações</p>
                  <p className="text-muted-foreground text-xs">{selectedPatient.medications}</p>
                </div>
              )}
            </div>
          )}

          {activePanel === "cardapio" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{(mockMealPlans[selectedPatient?.id || ""]?.[0])?.title || "Sem plano"}</h3>
                  <p className="text-xs text-muted-foreground">{(mockMealPlans[selectedPatient?.id || ""]?.[0])?.targetCalories || 0} kcal/dia</p>
                </div>
                <Button size="sm" onClick={handleSendMealPlan}>
                  <Share2 className="h-3.5 w-3.5 mr-1" /> Enviar
                </Button>
              </div>
              {(mockMealPlans[selectedPatient?.id || ""]?.[0])?.meals.map((meal) => (
                <Card key={meal.name}>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-semibold flex justify-between">
                      <span>{meal.name}</span>
                      <span className="text-muted-foreground font-normal">{meal.time}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ul className="space-y-1">
                      {meal.items.map((item) => (
                        <li key={item.food} className="flex justify-between text-xs">
                          <span className="text-foreground">{item.food}</span>
                          <span className="text-muted-foreground">{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activePanel === "metricas" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Baixar
                </Button>
                <Button size="sm" onClick={handleSendReport}>
                  <Share2 className="h-3.5 w-3.5 mr-1" /> Enviar
                </Button>
              </div>
              {[
                { label: "Peso", value: `${latestMetrics.weight} kg`, prev: previousMetrics.weight, curr: latestMetrics.weight, unit: "kg", good: "down" },
                { label: "IMC", value: latestMetrics.imc.toFixed(1), prev: previousMetrics.imc, curr: latestMetrics.imc, unit: "", good: "down" },
                { label: "% Gordura", value: `${latestMetrics.percentualGordura}%`, prev: previousMetrics.percentualGordura!, curr: latestMetrics.percentualGordura!, unit: "%", good: "down" },
                { label: "Cintura", value: `${latestMetrics.circunferenciaCintura} cm`, prev: previousMetrics.circunferenciaCintura!, curr: latestMetrics.circunferenciaCintura!, unit: "cm", good: "down" },
              ].map((m) => {
                const diff = m.curr - m.prev;
                const positive = m.good === "down" ? diff < 0 : diff > 0;
                return (
                  <Card key={m.label}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-lg font-bold text-foreground">{m.value}</p>
                      </div>
                      <Badge variant={positive ? "default" : "destructive"} className="text-xs">
                        {diff > 0 ? "+" : ""}{diff.toFixed(1)}{m.unit}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
              <Card>
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs">Histórico de Peso</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  {mockBodyMetrics.slice(-5).map((m) => (
                    <div key={m.date} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{new Date(m.date).toLocaleDateString("pt-BR")}</span>
                      <span className="font-medium text-foreground">{m.weight} kg</span>
                      <span className="text-muted-foreground">IMC {m.imc}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Progresso geral</p>
                <Progress value={72} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">72% da meta atingida</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    );
  };

  // ── Chat area ──
  const ChatArea = () => {
    if (!selectedPatient) {
      return (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Send className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Selecione um paciente para iniciar o chat</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-3 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSelectedPatient(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(selectedPatient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{selectedPatient.name}</p>
              <p className="text-[11px] text-muted-foreground">{selectedPatient.objective}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant={activePanel === "dados" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActivePanel(activePanel === "dados" ? null : "dados")}
              title="Dados pessoais"
            >
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant={activePanel === "cardapio" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActivePanel(activePanel === "cardapio" ? null : "cardapio")}
              title="Cardápio"
            >
              <UtensilsCrossed className="h-4 w-4" />
            </Button>
            <Button
              variant={activePanel === "metricas" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActivePanel(activePanel === "metricas" ? null : "metricas")}
              title="Métricas"
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {patientMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t border-border bg-card">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-2rem)] rounded-lg border border-border overflow-hidden bg-background">
        {/* Patient list — hide on mobile when a patient is selected */}
        {(!isMobile || !selectedPatient) && (
          <div className={`${isMobile ? "w-full" : "w-72"} shrink-0`}>
            <PatientList />
          </div>
        )}

        {/* Chat */}
        {(!isMobile || selectedPatient) && <ChatArea />}

        {/* Action panel */}
        {activePanel && selectedPatient && !isMobile && (
          <div className="w-80 shrink-0">
            <ActionPanel />
          </div>
        )}
      </div>

      {/* Mobile action panel as overlay */}
      {activePanel && selectedPatient && isMobile && (
        <div className="fixed inset-0 z-50 bg-background">
          <ActionPanel />
        </div>
      )}
    </AppLayout>
  );
}
