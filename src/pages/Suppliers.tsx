import { useState } from "react";
import { Plus, Mail, Phone, Edit2, Trash2, Truck, MapPin, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier, Supplier } from "@/hooks/useSuppliers";
import { useProducts } from "@/hooks/useProducts";

function SupplierForm({ supplier, onSubmit, onCancel }: { supplier?: Supplier; onSubmit: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: supplier?.name || "", contact: supplier?.contact || "", email: supplier?.email || "",
    phone: supplier?.phone || "", address: supplier?.address || "", payment_terms: supplier?.payment_terms || "",
  });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
        <div className="space-y-2"><Label>Contact Person</Label><Input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Payment Terms</Label><Input value={form.payment_terms} onChange={e => setForm(f => ({ ...f, payment_terms: e.target.value }))} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{supplier ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}

export default function Suppliers() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | undefined>();

  const { data: suppliers = [], isLoading } = useSuppliers();
  const { data: products = [] } = useProducts();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const handleSubmit = (data: any) => {
    if (editSupplier) {
      updateSupplier.mutate({ id: editSupplier.id, ...data }, { onSuccess: () => { setDialogOpen(false); setEditSupplier(undefined); } });
    } else {
      createSupplier.mutate(data, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in page-bg-glow">
      <div className="flex items-center justify-between">
        <div className="page-header flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-success shadow-lg shadow-success/25 icon-float">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1>Suppliers</h1>
            <p>{suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""} registered</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditSupplier(undefined); }}>
          <DialogTrigger asChild><Button size="sm" onClick={() => { setEditSupplier(undefined); setDialogOpen(true); }} className="shadow-md shadow-primary/20"><Plus className="mr-1 h-4 w-4" /> Add Supplier</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle></DialogHeader>
            <SupplierForm supplier={editSupplier} onSubmit={handleSubmit} onCancel={() => { setDialogOpen(false); setEditSupplier(undefined); }} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>
      ) : suppliers.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent>
            <div className="empty-state">
              <Building className="empty-state-icon" />
              <p className="text-sm text-muted-foreground">No suppliers yet</p>
              <Button size="sm" className="mt-3" onClick={() => setDialogOpen(true)}><Plus className="mr-1 h-4 w-4" /> Add your first supplier</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((s) => {
            const count = products.filter(p => p.supplier_id === s.id).length;
            return (
              <Card key={s.id} className="group shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
                <CardContent className="p-5 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success shrink-0">
                        <Building className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{s.name}</h3>
                        {s.contact && <p className="text-xs text-muted-foreground">{s.contact}</p>}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditSupplier(s); setDialogOpen(true); }}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete "{s.name}"?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteSupplier.mutate(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {s.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{s.email}</span></div>}
                    {s.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5 shrink-0" />{s.phone}</div>}
                    {s.address && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{s.address}</span></div>}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="secondary" className="text-xs">{count} product{count !== 1 ? "s" : ""}</Badge>
                    {s.payment_terms && <Badge variant="outline" className="text-xs">{s.payment_terms}</Badge>}
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full gradient-success opacity-40" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
