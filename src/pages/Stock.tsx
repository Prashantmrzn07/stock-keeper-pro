import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sampleStockMovements } from "@/lib/sample-data";

export default function Stock() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">Track incoming and outgoing stock</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><ArrowDown className="mr-1 h-4 w-4" /> Add Stock</Button>
          <Button variant="outline" size="sm"><ArrowUp className="mr-1 h-4 w-4" /> Remove Stock</Button>
          <Button variant="outline" size="sm"><RefreshCw className="mr-1 h-4 w-4" /> Adjust</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock Movement History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleStockMovements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Badge variant={m.type === "in" ? "default" : "destructive"} className={m.type === "in" ? "bg-success hover:bg-success/80" : ""}>
                      {m.type === "in" ? "Incoming" : "Outgoing"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{m.product}</TableCell>
                  <TableCell className="text-right">{m.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{m.date}</TableCell>
                  <TableCell>{m.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
