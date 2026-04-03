import { Scan, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BarcodeScanner() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Barcode Scanner</h1>
        <p className="text-muted-foreground">Scan or enter a barcode to look up products</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Scan className="h-4 w-4" /> Scan Barcode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
              <div className="text-center">
                <Scan className="mx-auto mb-2 h-10 w-10" />
                <p className="text-sm">Camera scanner will be activated here</p>
                <Button className="mt-3" size="sm">Start Scanner</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4" /> Manual Lookup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter barcode or SKU..." />
            <Button className="w-full">Look Up Product</Button>
            <p className="text-center text-sm text-muted-foreground">Enter a product SKU to find it quickly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
