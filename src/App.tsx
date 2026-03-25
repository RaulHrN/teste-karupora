import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import Agenda from "./pages/Agenda.tsx";
import Pacientes from "./pages/Pacientes.tsx";
import PacienteNovo from "./pages/PacienteNovo.tsx";
import PacientePerfil from "./pages/PacientePerfil.tsx";
import Prontuarios from "./pages/Prontuarios.tsx";
import Financeiro from "./pages/Financeiro.tsx";
import Marketing from "./pages/Marketing.tsx";
import Relatorios from "./pages/Relatorios.tsx";
import Login from "./pages/Login.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/" element={<Index />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/pacientes/novo" element={<PacienteNovo />} />
              <Route path="/pacientes/:id" element={<PacientePerfil />} />
              <Route path="/prontuarios" element={<Prontuarios />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
