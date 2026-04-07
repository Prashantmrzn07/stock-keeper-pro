import { Download, Package, BarChart3, DollarSign, AlertTriangle, TrendingUp, FileSpreadsheet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useStockMovements } from "@/hooks/useStockMovements";
import { useSales } from "@/hooks/useSales";
import { toast } from "sonner";

export default function Reports() {
  const { data: products = [] } = useProducts();
  const { data: movements = [] } = useStockMovements();
  const { data: sales = [] } = useSales();

  const downloadCSV = (title: string, headers: string[], rows: string[][]) => {
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/ /g, "-")}.csv`;
    a.click();
    toast.success(`${title} downloaded`);
  };

  const reports = [
    {
      title: "Stock Value Report", desc: "Total inventory value by product",
      icon: Package, gradient: "gradient-primary", iconBg: "bg-primary/10 text-primary",
      onExport: () => downloadCSV("Stock Value Report", ["Product", "SKU", "Stock", "Cost Price", "Total Value"],
        products.map(p => [p.name, p.sku, String(p.stock), String(p.cost_price), String(p.stock * Number(p.cost_price))])),
    },
    {
      title: "Stock Movement", desc: "Incoming and outgoing stock history",
      icon: BarChart3, gradient: "gradient-info", iconBg: "bg-info/10 text-info",
      onExport: () => downloadCSV("Stock Movement Report", ["Product", "Type", "Quantity", "Reason", "Date"],
        movements.map((m: any) => [m.products?.name || "", m.type, String(m.quantity), m.reason || "", new Date(m.created_at).toLocaleDateString()])),
    },
    {
      title: "Sales Report", desc: "All sales with totals and status",
      icon: DollarSign, gradient: "gradient-success", iconBg: "bg-success/10 text-success",
      onExport: () => downloadCSV("Sales Report", ["Customer", "Total", "Status", "Date"],
        sales.map((s: any) => [s.customer_name, String(s.total_amount), s.payment_status, new Date(s.created_at).toLocaleDateString()])),
    },
    {
      title: "Low Stock Report", desc: "Items below reorder level",
      icon: AlertTriangle, gradient: "gradient-warning", iconBg: "bg-warning/10 text-warning",
      onExport: () => downloadCSV("Low Stock Report", ["Product", "SKU", "Stock", "Reorder Level", "Suggested Order"],
        products.filter(p => p.stock <= p.reorder_level).map(p => [p.name, p.sku, String(p.stock), String(p.reorder_level), String(Math.max(0, p.reorder_level * 2 - p.stock))])),
    },
    {
      title: "Profit Analysis", desc: "Revenue minus cost breakdown",
      icon: TrendingUp, gradient: "gradient-purple", iconBg: "bg-[hsl(280,65%,60%)]/10 text-[hsl(280,65%,60%)]",
      onExport: () => downloadCSV("Profit Report", ["Product", "Revenue", "Cost", "Profit"],
        products.map(p => {
          const soldQty = movements.filter((m: any) => m.product_id === p.id && m.type === "out").reduce((s: number, m: any) => s + m.quantity, 0);
          const revenue = soldQty * Number(p.unit_price);
          const cost = soldQty * Number(p.cost_price);
          return [p.name, String(revenue.toFixed(2)), String(cost.toFixed(2)), String((revenue - cost).toFixed(2))];
        })),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in page-bg-glow">
      <div className="page-header flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25 icon-float">
          <FileSpreadsheet className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1>Reports & Analytics</h1>
          <p>Generate and export detailed reports</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title} className="group shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${r.iconBg} transition-transform group-hover:scale-110`}>
                  <r.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={r.onExport} className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
              </Button>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${r.gradient} opacity-40 group-hover:opacity-70 transition-opacity`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
