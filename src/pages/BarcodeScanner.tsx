import { useState } from "react";
import { Scan, Search, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

export default function BarcodeScanner() {
  const [lookup, setLookup] = useState("");
  const { data: products = [] } = useProducts();
  const [foundProduct, setFoundProduct] = useState<any>(null);

  const handleLookup = () => {
    const found = products.find(p => p.sku.toLowerCase() === lookup.toLowerCase() || p.id === lookup);
    if (found) {
      setFoundProduct(found);
    } else {
      toast.error("Product not found");
      setFoundProduct(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-info shadow-lg shadow-info/25">
          <Scan className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1>Barcode Scanner</h1>
          <p>Scan or enter a barcode to look up products</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Scan className="h-4 w-4 text-muted-foreground" /> Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20">
              <div className="text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-3">
                  <Scan className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium">Camera scanner</p>
                <p className="text-xs text-muted-foreground mt-0.5">Coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" /> Manual Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Enter SKU..." className="pl-9" value={lookup} onChange={e => setLookup(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLookup()} />
            </div>
            <Button className="w-full shadow-md shadow-primary/20" onClick={handleLookup}>Look Up Product</Button>
            {foundProduct && (
              <div className="rounded-xl border border-border/50 p-4 space-y-3 bg-muted/20">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{foundProduct.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{foundProduct.sku}</p>
                    </div>
                  </div>
                  <Badge variant={foundProduct.stock === 0 ? "destructive" : foundProduct.stock <= foundProduct.reorder_level ? "outline" : "default"}
                    className={foundProduct.stock > 0 && foundProduct.stock <= foundProduct.reorder_level ? "border-warning/50 text-warning bg-warning/5" : foundProduct.stock > foundProduct.reorder_level ? "bg-success" : ""}>
                    {foundProduct.stock === 0 ? "Out of Stock" : foundProduct.stock <= foundProduct.reorder_level ? "Low Stock" : "In Stock"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="text-lg font-bold">{foundProduct.stock}</p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-bold">${Number(foundProduct.unit_price).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
