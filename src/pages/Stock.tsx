import { useState } from "react";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockMovements, useCreateStockMovement } from "@/hooks/useStockMovements";
import { useProducts } from "@/hooks/useProducts";

export default function Stock() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [moveType, setMoveType] = useState<"in" | "out" | "adjustment">("in");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const { data: movements = [], isLoading } = useStockMovements();
  const { data: products = [] } = useProducts();
  const createMovement = useCreateStockMovement();

  const openDialog = (type: "in" | "out" | "adjustment") => {
    setMoveType(type); setProductId(""); setQuantity(0); setReason(""); setNotes(""); setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMovement.mutate({ product_id: productId, type: moveType, quantity, reason, notes }, { onSuccess: () => setDialogOpen(false) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">Track incoming and outgoing stock</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openDialog("in")}><ArrowDown className="mr-1 h-4 w-4" /> Add Stock</Button>
          <Button variant="outline" size="sm" onClick={() => openDialog("out")}><ArrowUp className="mr-1 h-4 w-4" /> Remove Stock</Button>
          <Button variant="outline" size="sm" onClick={() => openDialog("adjustment")}><RefreshCw className="mr-1 h-4 w-4" /> Adjust</Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{moveType === "in" ? "Add Stock" : moveType === "out" ? "Remove Stock" : "Stock Adjustment"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>{moveType === "adjustment" ? "New Stock Level" : "Quantity"}</Label><Input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} required /></div>
            {moveType === "out" && (
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2"><Label>Notes</Label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." /></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!productId}>Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle className="text-base">Stock Movement History</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Badge variant={m.type === "in" ? "default" : m.type === "out" ? "destructive" : "outline"} className={m.type === "in" ? "bg-success hover:bg-success/80" : m.type === "adjustment" ? "border-primary text-primary" : ""}>
                        {m.type === "in" ? "Incoming" : m.type === "out" ? "Outgoing" : "Adjustment"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{m.products?.name || "Unknown"}</TableCell>
                    <TableCell className="text-right">{m.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">{m.reason || m.notes || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {movements.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No stock movements yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
