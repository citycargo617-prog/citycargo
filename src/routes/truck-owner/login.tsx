import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import {
  Truck,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/truck-owner/login")({
  head: () => ({
    meta: [
      { title: "Truck Owner Login — City Cargo Fleet Management" },
      {
        name: "description",
        content:
          "Login to City Cargo's truck management platform. GPS tracking, trip management, FASTag, and more for fleet owners.",
      },
    ],
  }),
  component: TruckOwnerLogin,
});

function TruckOwnerLogin() {
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"initial" | "otp" | "password">("initial");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  function handleSendOtp() {
    if (phone.length === 10) {
      setMode("otp");
      setOtpSent(true);
    }
  }

  function handleVerifyOtp() {
    if (otp.length === 6) {
      setLoggedIn(true);
      setTimeout(() => navigate({ to: "/truck-owner/dashboard" }), 1500);
    }
  }

  function handlePasswordLogin() {
    if (phone.length === 10 && password.length >= 4) {
      setLoggedIn(true);
      setTimeout(() => navigate({ to: "/truck-owner/dashboard" }), 1500);
    }
  }

  const quickLinks = [
    { icon: CreditCard, label: "Buy FASTag", href: "/buy-gps" },
    { icon: MapPin, label: "Buy GPS", href: "/buy-gps" },
    { icon: Truck, label: "Book Truck", href: "/booking" },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Top nav bar */}
      <header className="border-b border-white/10 bg-[oklch(0.15_0.04_260)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Logo
            className="h-9 w-9"
            textClassName="text-xl text-white"
            accentClassName="text-[8px] text-white/80"
          />
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              About
            </a>
            <Link
              to="/buy-gps"
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Buy FASTag
            </Link>
            <Link
              to="/buy-gps"
              className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Buy GPS
            </Link>
            <Link
              to="/booking"
              search={{ from: "", to: "" }}
              className="text-xs font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors"
            >
              Book Truck
            </Link>
          </nav>
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-white/20 text-white hover:bg-white/10 font-semibold"
            >
              I'm a business
            </Button>
          </Link>
        </div>
      </header>

      {/* Main area */}
      <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[oklch(0.2_0.06_290)]">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.2_0.06_290)/90] to-[oklch(0.2_0.06_290)/70]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          {/* Left side - hero text */}
          <div>
            <h1 className="font-display text-4xl font-extrabold uppercase leading-tight text-white md:text-5xl">
              Leader in Truck
              <br />
              Management Solutions
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/60">
              We partner with hundreds of thousands of businesses across India in the shared journey
              of building a reliable, safer and predictable transportation infrastructure.
            </p>

            {/* Quick action cards */}
            <div className="mt-8 flex flex-wrap gap-3">
              {quickLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  <l.icon className="h-4 w-4 text-accent" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - login card */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl bg-white p-8 shadow-2xl">
              {loggedIn ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
                    Login Successful!
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">Redirecting to your dashboard...</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-bold text-gray-900">
                    Login to City Cargo
                  </h2>

                  <div className="mt-6">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Enter your mobile number"
                        className="h-12 pl-10 text-gray-900 border-gray-200"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {mode === "initial" && (
                    <div className="mt-4 space-y-3">
                      <Button
                        className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 font-bold uppercase tracking-wide"
                        onClick={handleSendOtp}
                        disabled={phone.length !== 10}
                      >
                        Login with OTP
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-wide"
                        onClick={() => setMode("password")}
                      >
                        Login with Password
                      </Button>
                    </div>
                  )}

                  {mode === "otp" && (
                    <div className="mt-6 space-y-4">
                      <p className="text-sm text-gray-500">
                        OTP sent to +91 {phone.slice(0, 4)}****{phone.slice(8)}
                      </p>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-center text-xs text-gray-400">
                        Enter any 6-digit code for demo
                      </p>
                      <Button
                        className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 font-bold"
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6}
                      >
                        Verify OTP <ArrowRight className="h-4 w-4" />
                      </Button>
                      <button
                        className="w-full text-center text-sm text-primary hover:underline"
                        onClick={() => setMode("initial")}
                      >
                        ← Back to login options
                      </button>
                    </div>
                  )}

                  {mode === "password" && (
                    <div className="mt-4 space-y-4">
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 pr-10 text-gray-900 border-gray-200"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 font-bold"
                        onClick={handlePasswordLogin}
                        disabled={phone.length !== 10 || password.length < 4}
                      >
                        Login <ArrowRight className="h-4 w-4" />
                      </Button>
                      <button
                        className="w-full text-center text-sm text-primary hover:underline"
                        onClick={() => setMode("initial")}
                      >
                        ← Back to login options
                      </button>
                    </div>
                  )}

                  <div className="mt-8 border-t border-gray-100 pt-4 text-center">
                    <p className="text-sm text-gray-400">Not able to login?</p>
                    <a
                      href="tel:+919370093700"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Contact +91 93700-93700
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* "How can we help you" section */}
        <div className="relative bg-white/5 backdrop-blur">
          <div className="mx-auto max-w-7xl px-5 py-12 text-center">
            <h2 className="font-display text-2xl font-extrabold uppercase text-white">
              How can we help you
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "GPS Tracking",
                  text: "Real-time vehicle location, route history, geofencing alerts",
                  href: "/buy-gps",
                },
                {
                  title: "FASTag Management",
                  text: "Simplified toll payments and expense reconciliation",
                  href: "/buy-gps",
                },
                {
                  title: "Fleet Analytics",
                  text: "Fuel insights, driver performance, and trip profitability",
                  href: "/truck-owner/dashboard",
                },
              ].map((card) => (
                <Link
                  key={card.title}
                  to={card.href}
                  className="rounded-2xl bg-white/10 p-6 text-left backdrop-blur transition-all hover:bg-white/15 hover:translate-y-[-2px]"
                >
                  <h3 className="font-display text-lg font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{card.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
