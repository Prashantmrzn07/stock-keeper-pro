import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, User, Building, Bell, Shield, Save, Mail, Camera, Pencil, Loader2, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SettingsPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Company state
  const [companyName, setCompanyName] = useState(localStorage.getItem("company_name") || "My Company");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "$");
  const [taxRate, setTaxRate] = useState(localStorage.getItem("tax_rate") || "10");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  // Notification state
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [stockArrival, setStockArrival] = useState(true);
  const [salesAlerts, setSalesAlerts] = useState(true);

  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const initials = displayName?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "U";

  // Load profile from database
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name || user.email?.split("@")[0] || "");
      } else {
        setDisplayName(user.email?.split("@")[0] || "");
      }
      // Load avatar
      const { data: files } = await supabase.storage.from("avatars").list(user.id, { limit: 1 });
      if (files && files.length > 0) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(`${user.id}/${files[0].name}`);
        setAvatarUrl(urlData.publicUrl + "?t=" + Date.now());
      }
    };
    loadProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      // Remove old avatar files
      const { data: existing } = await supabase.storage.from("avatars").list(user.id);
      if (existing && existing.length > 0) {
        await supabase.storage.from("avatars").remove(existing.map(f => `${user.id}/${f.name}`));
      }
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl + "?t=" + Date.now());
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("user_id", user.id);
      if (error) throw error;
      // Also update user metadata
      await supabase.auth.updateUser({ data: { display_name: displayName } });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveCompany = () => {
    localStorage.setItem("company_name", companyName);
    localStorage.setItem("currency", currency);
    localStorage.setItem("tax_rate", taxRate);
    localStorage.setItem("language", language);
    toast.success("Company settings saved!");
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
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
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription className="text-xs">Your personal information and avatar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-2">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 text-background animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-background" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Display Name</Label>
                <Input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="bg-muted/30 border-border/50 focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-muted/30 border-border/50 text-muted-foreground"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={savingProfile} size="sm">
              {savingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Profile
            </Button>
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
          <div className="flex justify-end">
            <Button onClick={handleSaveCompany} size="sm">
              <Save className="mr-2 h-4 w-4" /> Save Company Settings
            </Button>
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
            { label: "Low stock alerts", desc: "Get notified when items fall below reorder level", checked: lowStockAlerts, onChange: setLowStockAlerts },
            { label: "Stock arrival notifications", desc: "Get notified when new stock is added to inventory", checked: stockArrival, onChange: setStockArrival },
            { label: "Sales alerts", desc: "Receive notifications for new sales and payments", checked: salesAlerts, onChange: setSalesAlerts },
            { label: "Daily summary report", desc: "Receive a daily summary of stock movements", checked: dailySummary, onChange: setDailySummary },
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
              <p className="text-sm font-medium">Change Password</p>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </div>
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <KeyRound className="mr-2 h-4 w-4" /> Change
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
                  </div>
                  <Button onClick={handleChangePassword} disabled={changingPassword} className="w-full">
                    {changingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update Password
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center justify-between rounded-lg p-3 bg-muted/20">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Badge variant="outline" className="text-xs border-muted-foreground/30">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
