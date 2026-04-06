import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Settings, User, Building, Bell, Shield } from "lucide-react";

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
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="page-header flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25">
          <Settings className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold">
              {user?.email?.substring(0, 2).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.email}</p>
              <Badge variant="secondary" className="text-xs mt-0.5">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Company Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Company Name</Label><Input value={companyName} onChange={e => setCompanyName(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Currency Symbol</Label><Input value={currency} onChange={e => setCurrency(e.target.value)} /></div>
            <div className="space-y-2"><Label>Tax Rate (%)</Label><Input value={taxRate} onChange={e => setTaxRate(e.target.value)} type="number" /></div>
          </div>
          <Button onClick={handleSave} className="shadow-md shadow-primary/20">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-accent/30 transition-colors">
            <div>
              <p className="text-sm font-medium">Low stock email alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when items fall below reorder level</p>
            </div>
            <Switch checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-accent/30 transition-colors">
            <div>
              <p className="text-sm font-medium">Daily summary report</p>
              <p className="text-xs text-muted-foreground">Receive a daily summary of stock movements</p>
            </div>
            <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
