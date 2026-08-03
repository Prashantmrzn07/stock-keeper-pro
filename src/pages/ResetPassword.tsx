import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated! You're signed in.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[hsl(220,20%,6%)] p-4 overflow-hidden">
      <SmokeBackground smokeColor="#1e40af" />
      <Card className="relative z-10 w-full max-w-md border-primary/20 bg-[hsl(220,25%,10%)]/90 backdrop-blur-xl shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-[hsl(210,20%,95%)]">Set a new password</CardTitle>
          <p className="text-sm text-[hsl(215,20%,55%)]">
            {ready ? "Choose a strong password you'll remember" : "Open this page from the reset link in your email"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[hsl(215,20%,75%)]">New Password</Label>
              <Input className="border-primary/20 bg-[hsl(220,25%,14%)] text-[hsl(210,20%,95%)] placeholder:text-[hsl(215,20%,40%)]" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label className="text-[hsl(215,20%,75%)]">Confirm Password</Label>
              <Input className="border-primary/20 bg-[hsl(220,25%,14%)] text-[hsl(210,20%,95%)] placeholder:text-[hsl(215,20%,40%)]" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} />
            </div>
            <Button className="w-full" type="submit" disabled={loading || !ready}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
            <p className="text-center text-sm text-[hsl(215,20%,55%)]">
              <button type="button" onClick={() => navigate("/auth")} className="text-primary underline-offset-4 hover:underline">
                Back to sign in
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
