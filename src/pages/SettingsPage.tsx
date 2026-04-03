import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your company and app settings</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Company Name</Label><Input defaultValue="My Company" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Currency Symbol</Label><Input defaultValue="$" /></div>
            <div className="space-y-2"><Label>Tax Rate (%)</Label><Input defaultValue="10" type="number" /></div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Low stock email alerts</p><p className="text-xs text-muted-foreground">Get notified when items fall below reorder level</p></div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Daily summary report</p><p className="text-xs text-muted-foreground">Receive a daily summary of stock movements</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Data Management</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline">Export Backup</Button>
          <Button variant="outline">Import Data</Button>
        </CardContent>
      </Card>
    </div>
  );
}
