import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-background px-4 shrink-0">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  NC
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">Dra. Natália Costa</p>
                  <p className="text-[11px] text-muted-foreground">{t("nutritionist")} — CRN 12345</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={language === lang.value ? "bg-accent font-medium" : ""}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-surface p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
