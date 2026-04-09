import { useState } from "react";
import { Plus, DollarSign, ShoppingCart, TrendingUp, Percent, Eye, Pencil, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useSales, useCreateSale, useUpdateSaleStatus } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";

interface SaleLineItem { product_id: string; quantity: number; unit_price: number; discount: number; }

export default function Sales() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailSale, setDetailSale] = useState<any>(null);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [items, setItems] = useState<SaleLineItem[]>([{ product_id: "", quantity: 1, unit_price: 0, discount: 0 }]);

  const { data: sales = [], isLoading } = useSales();
  const { data: products = [] } = useProducts();
  const createSale = useCreateSale();
  const updateStatus = useUpdateSaleStatus();

  const totalRevenue = sales.reduce((s: number, sale: any) => s + Number(sale.total_amount), 0);
  const avgOrder = sales.length > 0 ? totalRevenue / sales.length : 0;

  const addItem = () => setItems(i => [...i, { product_id: "", quantity: 1, unit_price: 0, discount: 0 }]);
  const updateItem = (idx: number, field: string, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      if (field === "product_id") {
        const p = products.find(p => p.id === value);
        if (p) updated.unit_price = Math.round(Number(p.unit_price));
      }
      return updated;
    }));
  };
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const getDiscountedPrice = (item: SaleLineItem) => {
    const discountMultiplier = 1 - (item.discount / 100);
    return Math.round(item.unit_price * discountMultiplier);
  };

  const getItemTotal = (item: SaleLineItem) => item.quantity * getDiscountedPrice(item);
  const total = items.reduce((s, i) => s + getItemTotal(i), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(i => i.product_id);
    if (validItems.length === 0) return;
    const saleItems = validItems.map(i => ({
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: getDiscountedPrice(i),
    }));
    createSale.mutate({ customer_name: customerName, payment_status: paymentStatus, items: saleItems }, {
      onSuccess: () => { setDialogOpen(false); setCustomerName(""); setItems([{ product_id: "", quantity: 1, unit_price: 0, discount: 0 }]); }
    });
  };

  const getProductName = (productId: string) => {
    const p = products.find(p => p.id === productId);
    return p?.name || "Unknown";
  };

  const metrics = [
    { title: "Total Revenue", value: `$${Math.round(totalRevenue)}`, icon: DollarSign, iconBg: "bg-success/10 text-success", gradient: "gradient-success" },
    { title: "Total Orders", value: sales.length, icon: ShoppingCart, iconBg: "bg-primary/10 text-primary", gradient: "gradient-primary" },
    { title: "Avg Order Value", value: `$${Math.round(avgOrder)}`, icon: TrendingUp, iconBg: "bg-warning/10 text-warning", gradient: "gradient-warning" },
  ];

  return (
    <div className="space-y-6 animate-fade-in page-bg-glow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="page-header flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-warning shadow-lg shadow-warning/25 icon-float">
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1>Sales</h1>
            <p>Track and manage sales orders</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="shadow-md shadow-primary/20"><Plus className="mr-1 h-4 w-4" /> New Sale</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.title} className="metric-card group">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${m.iconBg} transition-transform group-hover:scale-110`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.title}</p>
                <p className="text-2xl font-bold tracking-tight">{m.value}</p>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-full ${m.gradient} opacity-60`} />
          </div>
        ))}
      </div>

      {/* New Sale Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New Sale</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Customer Name</Label><Input value={customerName} onChange={e => setCustomerName(e.target.value)} required /></div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partial</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Items</Label>
              {items.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-border/50 p-3 bg-muted/20 space-y-2">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Product</Label>
                      <Select value={item.product_id} onValueChange={v => updateItem(idx, "product_id", v)}>
                        <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Label className="text-xs text-muted-foreground">Qty</Label>
                      <Input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} />
                    </div>
                    <div className="w-28">
                      <Label className="text-xs text-muted-foreground">Unit Price</Label>
                      <Input type="number" min={0} value={item.unit_price} onChange={e => updateItem(idx, "unit_price", parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="w-20">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1"><Percent className="h-3 w-3" /> Disc</Label>
                      <Input type="number" min={0} max={100} value={item.discount} onChange={e => updateItem(idx, "discount", parseInt(e.target.value) || 0)} />
                    </div>
                    {items.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)}>×</Button>}
                  </div>
                  {item.unit_price > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      {item.discount > 0 && (
                        <>
                          <span className="text-muted-foreground line-through">${item.unit_price}</span>
                          <span className="text-success font-semibold">${getDiscountedPrice(item)}</span>
                          <Badge variant="outline" className="text-[10px] border-success/30 text-success bg-success/5">-{item.discount}%</Badge>
                        </>
                      )}
                      <span className="ml-auto font-medium">Subtotal: ${getItemTotal(item)}</span>
                    </div>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="mr-1 h-3 w-3" /> Add Item</Button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <p className="text-lg font-bold">Total: ${total}</p>
                {items.some(i => i.discount > 0) && (
                  <p className="text-xs text-muted-foreground">
                    Before discount: ${items.reduce((s, i) => s + i.quantity * i.unit_price, 0)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Sale</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sale Detail Dialog */}
      <Dialog open={!!detailSale} onOpenChange={() => setDetailSale(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Sale Details</DialogTitle></DialogHeader>
          {detailSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  {editingSale ? (
                    <Input value={editingSale.customer_name} onChange={e => setEditingSale({ ...editingSale, customer_name: e.target.value })} />
                  ) : (
                    <p className="font-semibold">{detailSale.customer_name}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  {editingSale ? (
                    <Select value={editingSale.payment_status} onValueChange={v => setEditingSale({ ...editingSale, payment_status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={detailSale.payment_status === "paid" ? "default" : "outline"}
                      className={detailSale.payment_status === "paid" ? "bg-success" : detailSale.payment_status === "pending" ? "border-warning/50 text-warning" : "border-primary/50 text-primary"}>
                      {detailSale.payment_status.charAt(0).toUpperCase() + detailSale.payment_status.slice(1)}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(detailSale.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold text-primary">${Math.round(Number(detailSale.total_amount))}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-2">Items Sold</p>
                <div className="space-y-2">
                  {detailSale.sale_items?.map((si: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{si.products?.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">Qty: {si.quantity} × ${Math.round(Number(si.unit_price))}</p>
                      </div>
                      <p className="font-semibold">${Math.round(si.quantity * Number(si.unit_price))}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {editingSale ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setEditingSale(null)}>Cancel</Button>
                    <Button size="sm" onClick={() => {
                      updateStatus.mutate({ id: editingSale.id, payment_status: editingSale.payment_status });
                      setDetailSale({ ...detailSale, payment_status: editingSale.payment_status, customer_name: editingSale.customer_name });
                      setEditingSale(null);
                    }}>Save</Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setEditingSale({ ...detailSale })}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="text-right font-semibold">Items</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((s: any) => (
                  <TableRow key={s.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium">{s.customer_name}</TableCell>
                    <TableCell className="text-right">{s.sale_items?.length || 0}</TableCell>
                    <TableCell className="text-right font-semibold">${Math.round(Number(s.total_amount))}</TableCell>
                    <TableCell>
                      <Select value={s.payment_status} onValueChange={v => updateStatus.mutate({ id: s.id, payment_status: v })}>
                        <SelectTrigger className="h-7 w-24 text-xs border-none bg-transparent p-0">
                          <Badge variant={s.payment_status === "paid" ? "default" : "outline"}
                            className={s.payment_status === "paid" ? "bg-success hover:bg-success/80" : s.payment_status === "pending" ? "border-warning/50 text-warning bg-warning/5" : "border-primary/50 text-primary bg-primary/5"}>
                            {s.payment_status.charAt(0).toUpperCase() + s.payment_status.slice(1)}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partial</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailSale(s)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {sales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="empty-state">
                        <ShoppingCart className="empty-state-icon" />
                        <p className="text-sm text-muted-foreground">No sales yet</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
