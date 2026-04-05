import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState(localStorage.getItem("company_name") || "My Company");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "$");
  const [taxRate, setTaxRate] = useState(localStorage.getItem("tax_rate") || "10");
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const handleSave = () => {
    localStorage.setItem("company_name", companyName);
    localStorage.setItem("currency", currency);
    localStorage.setItem("tax_rate", taxRate);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your company and app settings</p></div>

      <Card>
        <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{user?.email}</span></p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Company Name</Label><Input value={companyName} onChange={e => setCompanyName(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Currency Symbol</Label><Input value={currency} onChange={e => setCurrency(e.target.value)} /></div>
            <div className="space-y-2"><Label>Tax Rate (%)</Label><Input value={taxRate} onChange={e => setTaxRate(e.target.value)} type="number" /></div>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Low stock email alerts</p><p className="text-xs text-muted-foreground">Get notified when items fall below reorder level</p></div>
            <Switch checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Daily summary report</p><p className="text-xs text-muted-foreground">Receive a daily summary of stock movements</p></div>
            <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
