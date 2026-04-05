import { AlertTriangle, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

export default function LowStock() {
  const { data: products = [], isLoading } = useProducts();
  const lowStockItems = products.filter(p => p.stock <= p.reorder_level);

  const handleGeneratePO = () => {
    const csv = ["Product,SKU,Current Stock,Reorder Level,Suggested Order",
      ...lowStockItems.map(p => `"${p.name}","${p.sku}",${p.stock},${p.reorder_level},${Math.max(0, p.reorder_level * 2 - p.stock)}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "purchase-order.csv";
    a.click();
    toast.success("Purchase order downloaded");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Low Stock Alerts</h1>
          <p className="text-muted-foreground">{lowStockItems.length} items need attention</p>
        </div>
        <Button size="sm" onClick={handleGeneratePO} disabled={lowStockItems.length === 0}><ShoppingCart className="mr-1 h-4 w-4" /> Generate Purchase Order</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Reorder Level</TableHead>
                  <TableHead className="text-right">Suggested Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                    <TableCell className="text-right">{p.stock}</TableCell>
                    <TableCell className="text-right">{p.reorder_level}</TableCell>
                    <TableCell className="text-right font-medium">{Math.max(0, p.reorder_level * 2 - p.stock)}</TableCell>
                    <TableCell>
                      <Badge variant={p.stock === 0 ? "destructive" : "outline"} className={p.stock > 0 ? "border-warning text-warning" : ""}>
                        {p.stock === 0 ? "Out of Stock" : "Low Stock"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {lowStockItems.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">All items are well-stocked!</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
