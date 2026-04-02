import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Filter, Eye } from "lucide-react";
import { mockPatients } from "@/data/patients";
import { useNavigate } from "react-router-dom";
import { format, parseISO, differenceInYears } from "date-fns";

const paymentBadge = {
  em_dia: { label: "Em dia", className: "bg-primary/10 text-primary border-primary/20" },
  pendente: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
  inadimplente: { label: "Inadimplente", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const statusBadge = {
  ativo: { label: "Ativo", className: "bg-primary/10 text-primary border-primary/20" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground border-border" },
};

export default function Pacientes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [objectiveFilter, setObjectiveFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  // Nutricionistas veem apenas seus próprios pacientes
  const basePatients = useMemo(() => {
    if (user.roles.includes("nutricionista") && !user.roles.includes("master") && !user.roles.includes("administrativo") && user.assignedPatientIds) {
      return mockPatients.filter((p) => user.assignedPatientIds!.includes(p.id));
    }
    return mockPatients;
  }, [user]);

  const objectives = useMemo(
    () => [...new Set(basePatients.map((p) => p.objective))],
    [basePatients]
  );

  const filtered = useMemo(() => {
    return basePatients.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.cpf.includes(search) ||
        p.phone.includes(search);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesObjective = objectiveFilter === "all" || p.objective === objectiveFilter;
      const matchesPayment = paymentFilter === "all" || p.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesObjective && matchesPayment;
    });
  }, [search, statusFilter, objectiveFilter, paymentFilter, basePatients]);

  const hasFilters = statusFilter !== "all" || objectiveFilter !== "all" || paymentFilter !== "all";

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pacientes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mockPatients.length} pacientes cadastrados
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => navigate("/pacientes/novo")}>
            <Plus className="h-4 w-4" />
            Novo Paciente
          </Button>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, e-mail, CPF ou telefone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={objectiveFilter} onValueChange={setObjectiveFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os objetivos</SelectItem>
                    {objectives.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="em_dia">Em dia</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="inadimplente">Inadimplente</SelectItem>
                  </SelectContent>
                </Select>
                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setStatusFilter("all");
                      setObjectiveFilter("all");
                      setPaymentFilter("all");
                    }}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Última Consulta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Nenhum paciente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((patient) => {
                    const age = differenceInYears(new Date(), parseISO(patient.birthDate));
                    return (
                      <TableRow
                        key={patient.id}
                        className="cursor-pointer hover:bg-accent/30"
                        onClick={() => navigate(`/pacientes/${patient.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                              {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">{patient.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{age} anos</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-normal">
                            {patient.objective}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {patient.lastVisit ? format(parseISO(patient.lastVisit), "dd/MM/yyyy") : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusBadge[patient.status].className}>
                            {statusBadge[patient.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={paymentBadge[patient.paymentStatus].className}>
                            {paymentBadge[patient.paymentStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
