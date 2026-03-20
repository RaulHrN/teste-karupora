import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-background px-4 shrink-0">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                NC
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Dra. Natália Costa</p>
                <p className="text-[11px] text-muted-foreground">Nutricionista — CRN 12345</p>
              </div>
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
