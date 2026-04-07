import { useState, useEffect, useRef } from "react";
import { Scan, Search, Package, Camera, Upload, X, StopCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner() {
  const [lookup, setLookup] = useState("");
  const { data: products = [] } = useProducts();
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const findProduct = (code: string) => {
    const found = products.find(
      (p) => p.sku.toLowerCase() === code.toLowerCase() || p.id === code
    );
    if (found) {
      setFoundProduct(found);
      setLookup(code);
      toast.success(`Found: ${found.name}`);
    } else {
      toast.error("Product not found for code: " + code);
      setFoundProduct(null);
    }
  };

  const handleLookup = () => {
    if (!lookup.trim()) return;
    findProduct(lookup);
  };

  const startCamera = async () => {
    try {
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;
      setScanning(true);
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          findProduct(decodedText);
          stopCamera();
        },
        () => {}
      );
    } catch (err: any) {
      toast.error("Camera error: " + (err?.message || "Could not access camera"));
      setScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const scanner = new Html5Qrcode("barcode-reader-hidden");
      const result = await scanner.scanFile(file, true);
      findProduct(result);
      scanner.clear();
    } catch {
      toast.error("Could not read barcode from image");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
        {/* Camera Scanner */}
        <Card className="shadow-sm overflow-hidden border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" /> Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              id="barcode-reader"
              className="rounded-xl overflow-hidden border border-border/40 bg-muted/20"
              style={{ minHeight: scanning ? 260 : 0, display: scanning ? "block" : "none" }}
            />
            {!scanning && (
              <div className="flex h-52 items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/10">
                <div className="text-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
                    <Camera className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-medium">Point your camera at a barcode</p>
                  <p className="text-xs text-muted-foreground">Supports QR codes and 1D barcodes</p>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {!scanning ? (
                <Button className="flex-1 shadow-md shadow-primary/20" onClick={startCamera}>
                  <Camera className="mr-2 h-4 w-4" /> Start Camera
                </Button>
              ) : (
                <Button variant="destructive" className="flex-1" onClick={stopCamera}>
                  <StopCircle className="mr-2 h-4 w-4" /> Stop Camera
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Image
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div id="barcode-reader-hidden" className="hidden" />
          </CardContent>
        </Card>

        {/* Manual Lookup */}
        <Card className="shadow-sm overflow-hidden border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" /> Manual Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter SKU or scan result..."
                className="pl-9"
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
            </div>
            <Button className="w-full shadow-md shadow-primary/20" onClick={handleLookup}>
              Look Up Product
            </Button>
            {foundProduct && (
              <div className="rounded-xl border border-border/50 p-4 space-y-3 bg-muted/20 animate-fade-in">
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
                  <Badge
                    variant={
                      foundProduct.stock === 0
                        ? "destructive"
                        : foundProduct.stock <= foundProduct.reorder_level
                        ? "outline"
                        : "default"
                    }
                    className={
                      foundProduct.stock > 0 && foundProduct.stock <= foundProduct.reorder_level
                        ? "border-warning/50 text-warning bg-warning/5"
                        : foundProduct.stock > foundProduct.reorder_level
                        ? "bg-success"
                        : ""
                    }
                  >
                    {foundProduct.stock === 0
                      ? "Out of Stock"
                      : foundProduct.stock <= foundProduct.reorder_level
                      ? "Low Stock"
                      : "In Stock"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="text-lg font-bold">{foundProduct.stock}</p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-bold">
                      ${Number(foundProduct.unit_price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => { setFoundProduct(null); setLookup(""); }}>
                  <X className="mr-2 h-3 w-3" /> Clear Result
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
