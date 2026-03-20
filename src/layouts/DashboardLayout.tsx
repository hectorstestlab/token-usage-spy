import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  LayoutDashboard,
  CalendarDays,
  Users,
  Store,
  DollarSign,
  MessageCircle,
  Settings,
  LogOut,
  Star,
  ClipboardList,
  CalendarCheck,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const plannerNav: NavItem[] = [
  { title: "Panel", url: "/planner/dashboard", icon: LayoutDashboard },
  { title: "Bodas", url: "/planner/weddings", icon: CalendarDays },
  { title: "Clientes", url: "/planner/clients", icon: Users },
  { title: "Proveedores", url: "/planner/vendors", icon: Store },
  { title: "Marketplace", url: "/planner/marketplace", icon: ShoppingBag },
  { title: "Presupuesto", url: "/planner/budget", icon: DollarSign },
  { title: "Mensajes", url: "/planner/messages", icon: MessageCircle },
  { title: "Configuración", url: "/planner/settings", icon: Settings },
];

const clientNav: NavItem[] = [
  { title: "Panel", url: "/client/dashboard", icon: LayoutDashboard },
  { title: "Mi Boda", url: "/client/wedding", icon: CalendarDays },
  { title: "Proveedores", url: "/client/vendors", icon: Store },
  { title: "Marketplace", url: "/client/marketplace", icon: ShoppingBag },
  { title: "Presupuesto", url: "/client/budget", icon: DollarSign },
  { title: "Mensajes", url: "/client/messages", icon: MessageCircle },
  { title: "Configuración", url: "/client/settings", icon: Settings },
];

const vendorNav: NavItem[] = [
  { title: "Panel", url: "/vendor/dashboard", icon: LayoutDashboard },
  { title: "Reservas", url: "/vendor/bookings", icon: CalendarCheck },
  { title: "Servicios", url: "/vendor/services", icon: ClipboardList },
  { title: "Marketplace", url: "/vendor/marketplace", icon: ShoppingBag },
  { title: "Reseñas", url: "/vendor/reviews", icon: Star },
  { title: "Mensajes", url: "/vendor/messages", icon: MessageCircle },
  { title: "Configuración", url: "/vendor/settings", icon: Settings },
];

function getNavItems(role: string | null): NavItem[] {
  switch (role) {
    case "planner": return plannerNav;
    case "client": return clientNav;
    case "vendor": return vendorNav;
    default: return [];
  }
}

function getRoleLabel(role: string | null): string {
  switch (role) {
    case "planner": return "Wedding Planner";
    case "client": return "Pareja";
    case "vendor": return "Proveedor";
    default: return "";
  }
}

function AppSidebar() {
  const { role, userName, logout } = useUser();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const items = getNavItems(role);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary shrink-0" />
          {!collapsed && <span className="font-bold text-foreground text-lg">WedPlan</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{getRoleLabel(role)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="text-sm text-muted-foreground mb-2 truncate">{userName}</div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          {!collapsed && "Cerrar Sesión"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 bg-card/50 backdrop-blur-sm">
            <SidebarTrigger className="mr-4" />
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
