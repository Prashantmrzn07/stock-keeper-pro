import { Plus, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sampleSuppliers } from "@/lib/sample-data";

export default function Suppliers() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your suppliers</p>
        </div>
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Supplier</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sampleSuppliers.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-5">
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">Contact: {s.contact}</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{s.email}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{s.phone}</div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{s.productCount} products linked</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
