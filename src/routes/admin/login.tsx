import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdmin, isAdminLoggedIn } from "@/lib/admin-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal Login — City Cargo Connect" },
      {
        name: "description",
        content: "Master control center for fleet pricing, truck inventory, routes, and bookings.",
      },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [authMode, setAuthMode] = useState<"password" | "pin">("password");
  const [email, setEmail] = useState("admin@citycargo.in");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate({ to: "/admin" as const });
    }
  }, [navigate]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      let success = false;
      if (authMode === "password") {
        success = loginAdmin(email, password);
      } else {
        success = loginAdmin("8888", pin);
      }

      setIsSubmitting(false);

      if (success) {
        toast.success("Welcome back, Administrator!", {
          description: "Access granted to Central Fleet Control.",
        });
        navigate({ to: "/admin" as const });
      } else {
        toast.error("Authentication Failed", {
          description:
            authMode === "password"
              ? "Invalid email or password. Use demo credentials."
              : "Invalid PIN code. Demo PIN is 8888.",
        });
      }
    }, 400);
  }

  function handleQuickDemoFill() {
    setEmail("admin@citycargo.in");
    setPassword("admin123");
    setPin("8888");
    toast.info("Demo credentials loaded! Click Sign In.");
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background font-sans selection:bg-primary/20">
      {/* Top Brand Header */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Logo />
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Main Website
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="relative w-full max-w-md">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-8 shadow-2xl backdrop-blur-2xl">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Security Gateway
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">v2.4 Fleet OS</span>
            </div>

            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Admin Control Center
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in to manage trucks, prices, routes, bookings, and site content.
            </p>

            {/* Auth Mode Tabs */}
            <div className="mt-6 grid grid-cols-2 rounded-xl bg-secondary/70 p-1">
              <button
                type="button"
                onClick={() => setAuthMode("password")}
                className={`rounded-lg py-2 text-xs font-bold transition-all ${
                  authMode === "password"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Email & Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("pin")}
                className={`rounded-lg py-2 text-xs font-bold transition-all ${
                  authMode === "pin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Quick Master PIN
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {authMode === "password" ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@citycargo.in"
                        className="h-11 pl-10 rounded-xl bg-background text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter master password"
                        className="h-11 pl-10 pr-10 rounded-xl bg-background text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    4-Digit Master PIN Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      maxLength={6}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter PIN (Demo: 8888)"
                      className="h-11 pl-10 rounded-xl bg-background text-center font-mono text-lg tracking-widest"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl font-display font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
              >
                {isSubmitting ? (
                  "Authenticating..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Access Admin Panel <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Quick Demo Fill Helper Card */}
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/40 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Demo Admin Access</p>
                    <p className="text-[11px] text-muted-foreground">
                      Email: <code className="text-primary">admin@citycargo.in</code> · PIN:{" "}
                      <code className="text-primary">8888</code>
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleQuickDemoFill}
                  className="h-8 rounded-lg text-xs font-semibold hover:bg-secondary"
                >
                  Quick Fill
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} City Cargo Connect Admin Portal · Authorized Personnel Only
      </footer>
    </div>
  );
}
