import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  DollarSign,
  MessageCircle,
  Megaphone,
  BarChart3,
  Settings,
  Leaf,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { titleKey: "dashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "agenda", url: "/agenda", icon: Calendar },
  { titleKey: "patients", url: "/pacientes", icon: Users },
  { titleKey: "records", url: "/prontuarios", icon: FileText },
];

const managementItems = [
  { titleKey: "financial", url: "/financeiro", icon: DollarSign },
  { titleKey: "whatsapp", url: "/whatsapp", icon: MessageCircle },
  { titleKey: "marketing", url: "/marketing", icon: Megaphone },
  { titleKey: "reports", url: "/relatorios", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t } = useLanguage();

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.titleKey}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end={item.url === "/"}
            className="hover:bg-accent/60 transition-colors"
            activeClassName="bg-accent text-accent-foreground font-medium"
          >
            <item.icon className="mr-2 h-4 w-4 shrink-0" />
            {!collapsed && <span>{t(item.titleKey)}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-semibold text-foreground">NutriGestão</h1>
              <p className="text-[10px] text-muted-foreground">{t("nutritionManagement")}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(managementItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/configuracoes"
                className="hover:bg-accent/60 transition-colors"
                activeClassName="bg-accent text-accent-foreground font-medium"
              >
                <Settings className="mr-2 h-4 w-4 shrink-0" />
                {!collapsed && <span>{t("settings")}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
