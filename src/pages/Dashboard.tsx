import { Package, AlertTriangle, XCircle, DollarSign, ArrowDown, ArrowUp } from "lucide-react";
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
    { title: "Total Products", value: totalProducts, icon: Package, color: "text-primary" },
    { title: "Low Stock", value: lowStock, icon: AlertTriangle, color: "text-warning" },
    { title: "Out of Stock", value: outOfStock, icon: XCircle, color: "text-destructive" },
    { title: "Inventory Value", value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-success" },
  ];

  const loading = productsLoading || movementsLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-muted-foreground">Overview of your inventory</p></div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-3 ${m.color}`}><m.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{m.title}</p>
                {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">{m.value}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle className="text-base">Stock Movement (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend />
                <Bar dataKey="incoming" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Incoming" />
                <Bar dataKey="outgoing" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Outgoing" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Low Stock Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {products.filter(p => p.stock <= p.reorder_level).map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.sku}</p></div>
                <Badge variant={p.stock === 0 ? "destructive" : "outline"} className={p.stock > 0 ? "border-warning text-warning" : ""}>
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </Badge>
              </div>
            ))}
            {products.filter(p => p.stock <= p.reorder_level).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">All items well-stocked!</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.slice(0, 5).map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className={`rounded-full p-1.5 ${m.type === "in" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {m.type === "in" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.type === "in" ? "Received" : "Dispatched"} {m.quantity}x {m.products?.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {movements.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
