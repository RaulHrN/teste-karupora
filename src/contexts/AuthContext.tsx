import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "master" | "nutricionista" | "administrativo" | "financeiro";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  clinicId: string;
  clinicName: string;
  crn?: string;
  /** IDs dos pacientes vinculados (apenas para nutricionistas) */
  assignedPatientIds?: string[];
}

interface AuthContextType {
  user: AppUser;
  setUser: (user: AppUser) => void;
  switchUser: (userId: string) => void;
  allUsers: AppUser[];
  hasAccess: (module: AppModule) => boolean;
}

export type AppModule =
  | "dashboard"
  | "agenda"
  | "pacientes"
  | "prontuarios"
  | "financeiro"
  | "chat"
  | "marketing"
  | "relatorios"
  | "configuracoes";

/** Mapa de permissões por role */
const rolePermissions: Record<UserRole, AppModule[]> = {
  master: [
    "dashboard", "agenda", "pacientes", "prontuarios",
    "financeiro", "chat", "marketing", "relatorios", "configuracoes",
  ],
  nutricionista: [
    "dashboard", "agenda", "pacientes", "prontuarios", "chat",
  ],
  administrativo: [
    "dashboard", "agenda", "pacientes", "prontuarios", "chat", "marketing", "relatorios",
  ],
  financeiro: [
    "dashboard", "financeiro", "pacientes", "relatorios",
  ],
};

export const roleLabels: Record<UserRole, string> = {
  master: "Master",
  nutricionista: "Nutricionista",
  administrativo: "Administrativo",
  financeiro: "Financeiro",
};

export const roleColors: Record<UserRole, string> = {
  master: "bg-red-500/10 text-red-600 border-red-200",
  nutricionista: "bg-green-500/10 text-green-600 border-green-200",
  administrativo: "bg-blue-500/10 text-blue-600 border-blue-200",
  financeiro: "bg-amber-500/10 text-amber-600 border-amber-200",
};

export const mockUsers: AppUser[] = [
  {
    id: "u1",
    name: "Dra. Natália Costa",
    email: "natalia@nutrigestao.com",
    roles: ["master"],
    clinicId: "c1",
    clinicName: "NutriVida Clínica",
    crn: "CRN-3 12345",
  },
  {
    id: "u2",
    name: "Dr. Pedro Mendes",
    email: "pedro@nutrigestao.com",
    roles: ["nutricionista"],
    clinicId: "c1",
    clinicName: "NutriVida Clínica",
    crn: "CRN-3 67890",
    assignedPatientIds: ["2", "5", "6"],
  },
  {
    id: "u3",
    name: "Ana Clara Souza",
    email: "ana@nutrigestao.com",
    roles: ["administrativo", "financeiro"],
    clinicId: "c1",
    clinicName: "NutriVida Clínica",
  },
  {
    id: "u4",
    name: "Marcos Ribeiro",
    email: "marcos@nutrigestao.com",
    roles: ["financeiro"],
    clinicId: "c1",
    clinicName: "NutriVida Clínica",
  },
  {
    id: "u5",
    name: "Dra. Juliana Reis",
    email: "juliana@nutrigestao.com",
    roles: ["nutricionista", "administrativo"],
    clinicId: "c1",
    clinicName: "NutriVida Clínica",
    crn: "CRN-3 11223",
    assignedPatientIds: ["1", "3", "7"],
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>(mockUsers[0]);

  const switchUser = (userId: string) => {
    const found = mockUsers.find((u) => u.id === userId);
    if (found) setUser(found);
  };

  const hasAccess = (module: AppModule): boolean => {
    return user.roles.some((role) => rolePermissions[role].includes(module));
  };

  const hasRole = (role: UserRole): boolean => {
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchUser, allUsers: mockUsers, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
