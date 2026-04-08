import {
  LayoutDashboard, Package, ArrowLeftRight, Tags, Truck,
  AlertTriangle, BarChart3, ShoppingCart, Settings, LogOut, Scan,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Stock", url: "/stock", icon: ArrowLeftRight },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Suppliers", url: "/suppliers", icon: Truck },
  { title: "Low Stock", url: "/low-stock", icon: AlertTriangle },
  { title: "Scanner", url: "/barcode", icon: Scan },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src="/stockflow-logo.png" alt="StockFlow" className="h-9 w-9 shrink-0 rounded-xl shadow-lg shadow-primary/25" />
          {!collapsed && (
            <div>
              <span className="text-base font-bold text-sidebar-foreground tracking-tight">StockFlow</span>
              <p className="text-[10px] text-sidebar-muted leading-none">Inventory System</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent rounded-lg transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2 mb-2">
            <div className="h-6 w-6 rounded-lg bg-sidebar-accent flex items-center justify-center text-[10px] font-semibold text-sidebar-foreground">
              {user.email?.substring(0, 1).toUpperCase()}
            </div>
            <p className="text-xs text-sidebar-muted truncate flex-1">{user.email}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={handleSignOut} className="flex items-center gap-2 text-sidebar-muted hover:text-sidebar-foreground w-full rounded-lg transition-colors">
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Sign Out</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
