import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">IV</div>
          <CardTitle className="text-xl">{isLogin ? "Sign in to InvenTrack" : "Create an account"}</CardTitle>
          <p className="text-sm text-muted-foreground">Inventory management made simple</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="John Doe" /></div>
          )}
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@example.com" /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
          <Button className="w-full">{isLogin ? "Sign In" : "Sign Up"}</Button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary underline-offset-4 hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
