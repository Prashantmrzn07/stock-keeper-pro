import { Plus, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sampleSales = [
  { id: "SO-001", customer: "Alice Johnson", items: 3, total: 189.97, status: "paid", date: "2024-01-15" },
  { id: "SO-002", customer: "Bob Williams", items: 1, total: 499.99, status: "pending", date: "2024-01-14" },
  { id: "SO-003", customer: "Carol Davis", items: 2, total: 124.98, status: "paid", date: "2024-01-13" },
  { id: "SO-004", customer: "Dan Brown", items: 5, total: 312.45, status: "partial", date: "2024-01-12" },
];

const statusColors: Record<string, string> = {
  paid: "bg-success hover:bg-success/80",
  pending: "border-warning text-warning",
  partial: "border-info text-info",
};

export default function Sales() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Track sales orders</p>
        </div>
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> New Sale</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-3 text-success"><DollarSign className="h-5 w-5" /></div>
            <div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold">$1,127.39</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-3 text-primary"><ShoppingCart className="h-5 w-5" /></div>
            <div><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-bold">4</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-3 text-warning"><TrendingUp className="h-5 w-5" /></div>
            <div><p className="text-sm text-muted-foreground">Avg Order</p><p className="text-2xl font-bold">$281.85</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleSales.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.id}</TableCell>
                  <TableCell>{s.customer}</TableCell>
                  <TableCell className="text-right">{s.items}</TableCell>
                  <TableCell className="text-right">${s.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "paid" ? "default" : "outline"} className={statusColors[s.status]}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
