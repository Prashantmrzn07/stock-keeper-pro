import { useState } from "react";
import { Plus, Mail, Phone, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your suppliers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditSupplier(undefined); }}>
          <DialogTrigger asChild><Button size="sm" onClick={() => { setEditSupplier(undefined); setDialogOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add Supplier</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle></DialogHeader>
            <SupplierForm supplier={editSupplier} onSubmit={handleSubmit} onCancel={() => { setDialogOpen(false); setEditSupplier(undefined); }} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">{[1,2].map(i => <Skeleton key={i} className="h-40 w-full" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {suppliers.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{s.name}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditSupplier(s); setDialogOpen(true); }}><Edit2 className="h-3.5 w-3.5" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete "{s.name}"?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteSupplier.mutate(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Contact: {s.contact}</p>
                <div className="space-y-1 text-sm">
                  {s.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{s.email}</div>}
                  {s.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{s.phone}</div>}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{products.filter(p => p.supplier_id === s.id).length} products linked</p>
              </CardContent>
            </Card>
          ))}
          {suppliers.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">No suppliers yet</p>}
        </div>
      )}
    </div>
  );
}
