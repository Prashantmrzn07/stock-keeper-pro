import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: products } = useProducts();

  const lowStockItems = products?.filter(p => p.stock <= p.reorder_level) ?? [];
  const outOfStockItems = products?.filter(p => p.stock === 0) ?? [];
  const alertCount = lowStockItems.length;

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {alertCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                        {alertCount > 9 ? "9+" : alertCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="text-xs text-muted-foreground">{alertCount} stock alert{alertCount !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {alertCount === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground text-center">No alerts — all stock levels are healthy.</p>
                    ) : (
                      <>
                        {outOfStockItems.map(p => (
                          <button
                            key={p.id}
                            onClick={() => navigate("/low-stock")}
                            className="flex items-start gap-3 w-full p-3 hover:bg-accent text-left transition-colors"
                          >
                            <Package className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs text-destructive">Out of stock</p>
                            </div>
                            <Badge variant="destructive" className="ml-auto shrink-0 text-[10px]">0</Badge>
                          </button>
                        ))}
                        {lowStockItems.filter(p => p.stock > 0).map(p => (
                          <button
                            key={p.id}
                            onClick={() => navigate("/low-stock")}
                            className="flex items-start gap-3 w-full p-3 hover:bg-accent text-left transition-colors"
                          >
                            <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">Stock: {p.stock} / Reorder: {p.reorder_level}</p>
                            </div>
                            <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">{p.stock}</Badge>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                  {alertCount > 0 && (
                    <div className="p-2 border-t">
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => navigate("/low-stock")}>
                        View all alerts
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">My Account</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Company Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
