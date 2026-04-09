import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Settings, User, Building, Bell, Shield, Globe, Palette, Save, Mail, Phone, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState(localStorage.getItem("company_name") || "My Company");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "$");
  const [taxRate, setTaxRate] = useState(localStorage.getItem("tax_rate") || "10");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [stockArrival, setStockArrival] = useState(true);
  const [salesAlerts, setSalesAlerts] = useState(true);

  const initials = user?.email?.substring(0, 2).toUpperCase() || "U";

  const handleSave = () => {
    localStorage.setItem("company_name", companyName);
    localStorage.setItem("currency", currency);
    localStorage.setItem("tax_rate", taxRate);
    localStorage.setItem("language", language);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl page-bg-glow">
      {/* Header */}
      <div className="page-header flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25 icon-float">
          <Settings className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1>Settings</h1>
          <p>Manage your account and application preferences</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="shadow-sm overflow-hidden border-none bg-gradient-to-br from-primary/5 via-card to-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{user?.user_metadata?.display_name || user?.email?.split("@")[0]}</h3>
                <Badge className="bg-success/10 text-success border-success/20 text-xs">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Company Information</CardTitle>
              <CardDescription className="text-xs">Your business details and regional settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Company Name</Label>
            <Input value={companyName} onChange={e => setCompanyName(e.target.value)} className="bg-muted/30 border-border/50 focus:bg-background transition-colors" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">$ (USD)</SelectItem>
                  <SelectItem value="€">€ (EUR)</SelectItem>
                  <SelectItem value="£">£ (GBP)</SelectItem>
                  <SelectItem value="₹">₹ (INR)</SelectItem>
                  <SelectItem value="¥">¥ (JPY)</SelectItem>
                  <SelectItem value="Rs">Rs (NPR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tax Rate (%)</Label>
              <Input value={taxRate} onChange={e => setTaxRate(e.target.value)} type="number" className="bg-muted/30 border-border/50 focus:bg-background transition-colors" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="np">Nepali</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
              <Bell className="h-4 w-4 text-warning" />
            </div>
            <div>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription className="text-xs">Control how you receive alerts and updates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1 pt-2">
          {[
            { label: "Low stock alerts", desc: "Get notified when items fall below reorder level", checked: lowStockAlerts, onChange: setLowStockAlerts, color: "text-destructive" },
            { label: "Stock arrival notifications", desc: "Get notified when new stock is added to inventory", checked: stockArrival, onChange: setStockArrival, color: "text-success" },
            { label: "Sales alerts", desc: "Receive notifications for new sales and payments", checked: salesAlerts, onChange: setSalesAlerts, color: "text-primary" },
            { label: "Daily summary report", desc: "Receive a daily summary of stock movements", checked: dailySummary, onChange: setDailySummary, color: "text-warning" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg p-3 hover:bg-accent/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${item.checked ? "bg-success" : "bg-muted-foreground/30"} transition-colors`} />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Switch checked={item.checked} onCheckedChange={item.onChange} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
              <Shield className="h-4 w-4 text-info" />
            </div>
            <div>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription className="text-xs">Manage your account security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="flex items-center justify-between rounded-lg p-3 bg-muted/20">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Badge variant="outline" className="text-xs border-muted-foreground/30">Coming Soon</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg p-3 bg-muted/20">
            <div>
              <p className="text-sm font-medium">Session management</p>
              <p className="text-xs text-muted-foreground">View and manage active sessions</p>
            </div>
            <Badge variant="outline" className="text-xs border-muted-foreground/30">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-6">
        <Button onClick={handleSave} size="lg" className="shadow-lg shadow-primary/20 px-8">
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}
