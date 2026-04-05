import { useState } from "react";
import { Scan, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div><h1 className="text-2xl font-bold">Barcode Scanner</h1><p className="text-muted-foreground">Scan or enter a barcode to look up products</p></div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Scan className="h-4 w-4" /> Scan Barcode</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
              <div className="text-center"><Scan className="mx-auto mb-2 h-10 w-10" /><p className="text-sm">Camera scanner coming soon</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4" /> Manual Lookup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter SKU..." value={lookup} onChange={e => setLookup(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLookup()} />
            <Button className="w-full" onClick={handleLookup}>Look Up Product</Button>
            {foundProduct && (
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between"><span className="font-semibold">{foundProduct.name}</span>
                  <Badge variant={foundProduct.stock === 0 ? "destructive" : foundProduct.stock <= foundProduct.reorder_level ? "outline" : "default"} className={foundProduct.stock > 0 && foundProduct.stock <= foundProduct.reorder_level ? "border-warning text-warning" : foundProduct.stock > foundProduct.reorder_level ? "bg-success" : ""}>
                    {foundProduct.stock === 0 ? "Out of Stock" : foundProduct.stock <= foundProduct.reorder_level ? "Low Stock" : "In Stock"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">SKU: {foundProduct.sku}</p>
                <p className="text-sm">Stock: <span className="font-medium">{foundProduct.stock}</span></p>
                <p className="text-sm">Price: <span className="font-medium">${Number(foundProduct.unit_price).toFixed(2)}</span></p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
