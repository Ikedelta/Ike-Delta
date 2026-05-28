import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // If an already-signed-in admin lands here, send them straight to /admin
  useEffect(() => {
    const verify = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (data) navigate("/admin");
    };
    verify();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = schema.safeParse(form);
    if (!result.success) {
      const fe: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fe.email = err.message;
        if (err.path[0] === "password") fe.password = err.message;
      });
      setErrors(fe);
      return;
    }

    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    if (error) {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: error.message === "Invalid login credentials"
          ? "Invalid email or password."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    // Verify admin role before granting access
    const { data: sessionData } = await supabase.auth.getUser();
    const uid = sessionData.user?.id;
    if (!uid) {
      setLoading(false);
      toast({ title: "Login Failed", description: "Session error.", variant: "destructive" });
      return;
    }
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();

    setLoading(false);

    if (!role) {
      await supabase.auth.signOut();
      toast({
        title: "Access Denied",
        description: "This account does not have admin privileges.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Welcome, Admin", description: "Signed in successfully." });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">Admin Portal</span>
        </Link>

        <div className="glass-strong rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Administrator Sign In</h1>
            <p className="text-muted-foreground">Restricted area — admin credentials only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@creativehub.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`pl-12 h-12 bg-muted border-border ${errors.email ? "border-destructive" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`pl-12 pr-12 h-12 bg-muted border-border ${errors.password ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" variant="hero" className="w-full h-12 glow-sm" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In as Admin"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Not an admin?{" "}
            <Link to="/auth/login" className="text-primary hover:underline font-medium">
              Customer sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          <Link to="/" className="hover:text-primary">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
