import { useState } from "react";
import { Plus, Edit2, Trash2, Tags, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

export default function Categories() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | undefined>();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const { data: categories = [], isLoading } = useCategories();
  const { data: products = [] } = useProducts();
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const openEdit = (c: Category) => { setEditCat(c); setName(c.name); setDesc(c.description); setDialogOpen(true); };
  const openCreate = () => { setEditCat(undefined); setName(""); setDesc(""); setDialogOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCat) {
      updateCat.mutate({ id: editCat.id, name, description: desc }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createCat.mutate({ name, description: desc }, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-purple shadow-lg shadow-[hsl(280,65%,60%)]/25">
            <Tags className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1>Categories</h1>
            <p>Organize products by category</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button size="sm" onClick={openCreate} className="shadow-md shadow-primary/20"><Plus className="mr-1 h-4 w-4" /> Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editCat ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={desc} onChange={e => setDesc(e.target.value)} /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editCat ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}</div>
      ) : categories.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent>
            <div className="empty-state">
              <FolderOpen className="empty-state-icon" />
              <p className="text-sm text-muted-foreground">No categories yet</p>
              <Button size="sm" className="mt-3" onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Create your first category</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = products.filter(p => p.category_id === c.id).length;
            return (
              <Card key={c.id} className="group shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
                <CardContent className="p-5 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Tags className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{c.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{c.description || "No description"}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete "{c.name}"?</AlertDialogTitle><AlertDialogDescription>Products in this category will become uncategorized.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteCat.mutate(c.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="secondary" className="text-xs">{count} product{count !== 1 ? "s" : ""}</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full gradient-purple opacity-40" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
