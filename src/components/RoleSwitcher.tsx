import { useAuth, roleLabels, roleColors, mockUsers } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Shield, Stethoscope, ClipboardList, Wallet } from "lucide-react";

const roleIcons = {
  master: Shield,
  nutricionista: Stethoscope,
  administrativo: ClipboardList,
  financeiro: Wallet,
};

export function RoleSwitcher() {
  const { user, switchUser } = useAuth();
  const Icon = roleIcons[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/60 transition-colors outline-none">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${roleColors[user.role]}`}>
              <Icon className="h-2.5 w-2.5 mr-0.5" />
              {roleLabels[user.role]}
            </Badge>
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Trocar perfil (demo)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockUsers.map((u) => {
          const RIcon = roleIcons[u.role];
          return (
            <DropdownMenuItem
              key={u.id}
              onClick={() => switchUser(u.id)}
              className={user.id === u.id ? "bg-accent" : ""}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 ${roleColors[u.role]}`}>
                    <RIcon className="h-2 w-2 mr-0.5" />
                    {roleLabels[u.role]}
                  </Badge>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
