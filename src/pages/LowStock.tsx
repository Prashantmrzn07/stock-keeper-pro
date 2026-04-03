import { AlertTriangle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sampleProducts } from "@/lib/sample-data";

const lowStockItems = sampleProducts.filter(p => p.stock <= p.reorderLevel);

export default function LowStock() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Low Stock Alerts</h1>
          <p className="text-muted-foreground">{lowStockItems.length} items need attention</p>
        </div>
        <Button size="sm"><ShoppingCart className="mr-1 h-4 w-4" /> Generate Purchase Order</Button>
      </div>
      <Card>
        <CardContent className="p-0">
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
                  <TableCell className="text-right">{p.reorderLevel}</TableCell>
                  <TableCell className="text-right font-medium">{Math.max(0, p.reorderLevel * 2 - p.stock)}</TableCell>
                  <TableCell>
                    <Badge variant={p.stock === 0 ? "destructive" : "outline"} className={p.stock > 0 ? "border-warning text-warning" : ""}>
                      {p.stock === 0 ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
