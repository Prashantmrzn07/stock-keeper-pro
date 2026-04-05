import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      title: "Stock Value Report", desc: "Total inventory value by product", icon: "📦",
      onExport: () => downloadCSV("Stock Value Report", ["Product", "SKU", "Stock", "Cost Price", "Total Value"],
        products.map(p => [p.name, p.sku, String(p.stock), String(p.cost_price), String(p.stock * Number(p.cost_price))])),
    },
    {
      title: "Stock Movement Report", desc: "Incoming and outgoing stock history", icon: "📊",
      onExport: () => downloadCSV("Stock Movement Report", ["Product", "Type", "Quantity", "Reason", "Date"],
        movements.map((m: any) => [m.products?.name || "", m.type, String(m.quantity), m.reason || "", new Date(m.created_at).toLocaleDateString()])),
    },
    {
      title: "Sales Report", desc: "All sales with totals", icon: "💰",
      onExport: () => downloadCSV("Sales Report", ["Customer", "Total", "Status", "Date"],
        sales.map((s: any) => [s.customer_name, String(s.total_amount), s.payment_status, new Date(s.created_at).toLocaleDateString()])),
    },
    {
      title: "Low Stock Report", desc: "Items below reorder level", icon: "⚠️",
      onExport: () => downloadCSV("Low Stock Report", ["Product", "SKU", "Stock", "Reorder Level", "Suggested Order"],
        products.filter(p => p.stock <= p.reorder_level).map(p => [p.name, p.sku, String(p.stock), String(p.reorder_level), String(Math.max(0, p.reorder_level * 2 - p.stock))])),
    },
    {
      title: "Profit Report", desc: "Revenue minus cost analysis", icon: "📈",
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
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-muted-foreground">Generate and export reports</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{r.desc}</p>
              <Button variant="outline" size="sm" onClick={r.onExport}><Download className="mr-1 h-3.5 w-3.5" /> Export CSV</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
