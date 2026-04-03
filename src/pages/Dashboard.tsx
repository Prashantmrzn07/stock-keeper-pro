import { Package, AlertTriangle, XCircle, DollarSign, ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleProducts, sampleStockMovements, stockChartData } from "@/lib/sample-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

const totalProducts = sampleProducts.length;
const lowStock = sampleProducts.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length;
const outOfStock = sampleProducts.filter(p => p.stock === 0).length;
const totalValue = sampleProducts.reduce((acc, p) => acc + p.stock * p.costPrice, 0);

const metrics = [
  { title: "Total Products", value: totalProducts, icon: Package, color: "text-primary" },
  { title: "Low Stock", value: lowStock, icon: AlertTriangle, color: "text-warning" },
  { title: "Out of Stock", value: outOfStock, icon: XCircle, color: "text-destructive" },
  { title: "Inventory Value", value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-success" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-3 ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{m.title}</p>
                <p className="text-2xl font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Stock Movement (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stockChartData}>
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
          <CardHeader>
            <CardTitle className="text-base">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleProducts.filter(p => p.stock <= p.reorderLevel).map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sku}</p>
                </div>
                <Badge variant={p.stock === 0 ? "destructive" : "outline"} className={p.stock > 0 ? "border-warning text-warning" : ""}>
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sampleStockMovements.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className={`rounded-full p-1.5 ${m.type === "in" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {m.type === "in" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {m.type === "in" ? "Received" : "Dispatched"} {m.quantity}x {m.product}
                  </p>
                  <p className="text-xs text-muted-foreground">by {m.user} · {m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
