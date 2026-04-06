import { AlertTriangle, ShoppingCart, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="page-header flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-destructive shadow-lg shadow-destructive/25">
            <AlertTriangle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1>Low Stock Alerts</h1>
            <p>{lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} need attention</p>
          </div>
        </div>
        <Button size="sm" onClick={handleGeneratePO} disabled={lowStockItems.length === 0} className="shadow-md shadow-primary/20">
          <ShoppingCart className="mr-1 h-4 w-4" /> Generate Purchase Order
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : lowStockItems.length === 0 ? (
            <div className="empty-state py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success mb-4">
                <Package className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold">All items well-stocked!</p>
              <p className="text-sm text-muted-foreground mt-1">No items are below their reorder level.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">SKU</TableHead>
                  <TableHead className="font-semibold">Stock Level</TableHead>
                  <TableHead className="text-right font-semibold">Suggested Order</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((p) => {
                  const pct = p.reorder_level > 0 ? Math.min((p.stock / p.reorder_level) * 100, 100) : 0;
                  return (
                    <TableRow key={p.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{p.sku}</TableCell>
                      <TableCell>
                        <div className="space-y-1.5 w-32">
                          <div className="flex justify-between text-xs">
                            <span className={p.stock === 0 ? "text-destructive font-medium" : "text-warning font-medium"}>{p.stock}</span>
                            <span className="text-muted-foreground">/ {p.reorder_level}</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">{Math.max(0, p.reorder_level * 2 - p.stock)}</TableCell>
                      <TableCell>
                        <Badge variant={p.stock === 0 ? "destructive" : "outline"} className={p.stock > 0 ? "border-warning/50 text-warning bg-warning/5" : ""}>
                          {p.stock === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
