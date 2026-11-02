import { Package, AlertTriangle, XCircle, DollarSign, ArrowDown, ArrowUp, Activity, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useStockMovements } from "@/hooks/useStockMovements";
import { useMemo } from "react";

export default function Dashboard() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: movements = [], isLoading: movementsLoading } = useStockMovements();
  const navigate = useNavigate();

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.reorder_level).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((acc, p) => acc + p.stock * Number(p.cost_price), 0);

  const chartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    return last7.map(date => {
      const dayMovements = movements.filter((m: any) => {
        const md = new Date(m.created_at);
        return md.toDateString() === date.toDateString();
      });
      return {
        day: days[date.getDay()],
        incoming: dayMovements.filter((m: any) => m.type === "in").reduce((s: number, m: any) => s + m.quantity, 0),
        outgoing: dayMovements.filter((m: any) => m.type === "out").reduce((s: number, m: any) => s + m.quantity, 0),
      };
    });
  }, [movements]);

  const metrics = [
    { title: "Total Products", value: totalProducts, icon: Package, gradient: "gradient-primary", iconBg: "bg-primary/10 text-primary", to: "/products", cta: "View products" },
    { title: "Low Stock", value: lowStock, icon: AlertTriangle, gradient: "gradient-warning", iconBg: "bg-warning/10 text-warning", to: "/low-stock", cta: "View alerts" },
    { title: "Out of Stock", value: outOfStock, icon: XCircle, gradient: "gradient-destructive", iconBg: "bg-destructive/10 text-destructive", to: "/low-stock?status=out", cta: "See empty items" },
    { title: "Inventory Value", value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, gradient: "gradient-success", iconBg: "bg-success/10 text-success", to: "/reports", cta: "Open reports" },
  ];

  const loading = productsLoading || movementsLoading;
  const alertProducts = products.filter(p => p.stock <= p.reorder_level);

  const cardLink = "text-xs font-medium text-primary hover:text-primary/80 inline-flex items-center gap-0.5 transition-colors";

  return (
    <div className="space-y-8 animate-fade-in page-bg-glow">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25 icon-float">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1>Dashboard</h1>
            <p>Real-time overview of your inventory</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Link key={m.title} to={m.to} className="metric-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${m.iconBg} transition-transform group-hover:scale-110`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.title}</p>
                {loading ? <Skeleton className="h-8 w-20 mt-1" /> : <p className="text-2xl font-bold tracking-tight">{m.value}</p>}
              </div>
            </div>
            <p className="mt-3 inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
              {m.cta}
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </p>
            <div className={`absolute bottom-0 left-0 h-1 w-full ${m.gradient} opacity-60`} />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Stock Movement</CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs font-normal">Last 7 Days</Badge>
                <Link to="/stock" className={cardLink}>Manage stock<ChevronRight className="h-3 w-3" /></Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="day" className="text-xs" axisLine={false} tickLine={false} />
                <YAxis className="text-xs" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    boxShadow: "0 8px 32px -4px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="incoming" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} name="Incoming" />
                <Bar dataKey="outgoing" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} name="Outgoing" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
              <div className="flex items-center gap-2">
                <Link to="/low-stock" className={cardLink}>View all<ChevronRight className="h-3 w-3" /></Link>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertProducts.slice(0, 5).map(p => (
              <button
                key={p.id}
                onClick={() => navigate(`/products?search=${encodeURIComponent(p.sku)}`)}
                aria-label={`View ${p.name} in products`}
                className="flex items-center justify-between gap-2 w-full text-left rounded-lg border border-border/50 p-3 hover:bg-accent/50 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={p.stock === 0 ? "destructive" : "outline"} className={p.stock > 0 ? "border-warning/50 text-warning bg-warning/5" : ""}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </button>
            ))}
            {alertProducts.length === 0 && (
              <div className="empty-state py-8">
                <Package className="empty-state-icon" />
                <p className="text-sm text-muted-foreground">All items well-stocked!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs font-normal">{movements.length} total</Badge>
              <Link to="/stock" className={cardLink}>View all movements<ChevronRight className="h-3 w-3" /></Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {movements.slice(0, 5).map((m: any) => (
              <button
                key={m.id}
                onClick={() => navigate("/stock")}
                aria-label="View stock movements"
                className="flex items-center gap-3 w-full text-left rounded-lg border border-border/50 p-3 hover:bg-accent/50 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className={`rounded-xl p-2 ${m.type === "in" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {m.type === "in" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.type === "in" ? "Received" : "Dispatched"} <span className="text-primary">{m.quantity}x</span> {m.products?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{m.type === "in" ? "IN" : "OUT"}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
            {movements.length === 0 && (
              <div className="empty-state py-8">
                <Activity className="empty-state-icon" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
