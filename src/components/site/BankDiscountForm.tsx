import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Gift,
  CheckCircle2,
  Send,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const banks = [
  { name: "State Bank of India (SBI)", color: "#22408E" },
  { name: "ICICI Bank", color: "#F37021" },
  { name: "Punjab National Bank (PNB)", color: "#D32F2F" },
  { name: "HDFC Bank", color: "#004B8D" },
  { name: "Axis Bank", color: "#800020" },
  { name: "Bank of Baroda (BOB)", color: "#F36F21" },
  { name: "Canara Bank", color: "#FFD700" },
  { name: "Union Bank of India", color: "#003DA5" },
  { name: "Kotak Mahindra Bank", color: "#ED1C24" },
  { name: "Yes Bank", color: "#0060A9" },
  { name: "IndusInd Bank", color: "#8B1A4A" },
  { name: "IDBI Bank", color: "#39A845" },
  { name: "Bank of India (BOI)", color: "#E65100" },
  { name: "Indian Bank", color: "#1565C0" },
  { name: "Central Bank of India", color: "#B71C1C" },
  { name: "UCO Bank", color: "#6A1B9A" },
  { name: "Indian Overseas Bank (IOB)", color: "#C62828" },
  { name: "Federal Bank", color: "#1976D2" },
  { name: "South Indian Bank", color: "#00796B" },
  { name: "Other", color: "#6B7280" },
];

interface BankDiscountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BankDiscountForm({ open, onOpenChange }: BankDiscountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bank: "",
    employeeId: "",
    designation: "",
    department: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    loadingCity: "",
    unloadingCity: "",
  });

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.bank) {
      toast.error("Please select your bank");
      return;
    }
    if (!formData.employeeId.trim()) {
      toast.error("Please enter your Employee ID");
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/citycargo617@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `🏦 Bank Employee Discount Request — ${formData.fullName} (${formData.bank})`,
          _template: "table",

          "Full Name": formData.fullName,
          "Mobile Number": formData.mobile,
          "Email Address": formData.email,

          "Bank Name": formData.bank,
          "Employee ID": formData.employeeId,
          Designation: formData.designation || "Not provided",
          Department: formData.department || "Not provided",

          "Full Address": formData.address,
          City: formData.city,
          "PIN Code": formData.pincode || "Not provided",

          "Loading City (From)": formData.loadingCity || "Not provided",
          "Unloading City (To)": formData.unloadingCity || "Not provided",

          _captcha: "false",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitting(false);
        onOpenChange(false);

        toast.success("🎉 Discount claimed successfully!", {
          description:
            "Our team will verify your details and contact you within 24 hours with your exclusive discount code.",
          duration: 6000,
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      setIsSubmitting(false);

      toast.error("Something went wrong", {
        description:
          "Please try again or contact us directly at citycargo617@gmail.com",
        duration: 5000,
      });
      return;
    }

    // Reset form
    setFormData({
      fullName: "",
      bank: "",
      employeeId: "",
      designation: "",
      department: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      loadingCity: "",
      unloadingCity: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-border/60 p-0">
        {/* Header with gradient */}
        <div className="relative overflow-hidden rounded-t-3xl bg-[oklch(0.16_0.04_260)] px-6 pb-5 pt-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <DialogHeader className="relative">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
                <Gift className="h-5 w-5 text-accent" />
              </div>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                Flat 15% Off
              </span>
            </div>
            <DialogTitle className="font-display text-2xl font-extrabold tracking-tight text-white">
              Claim your bank employee discount
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-white/50">
              Fill in your details below. Our team will verify your bank employment and share
              your exclusive discount code within 24 hours.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-2">
          {/* ── Personal Information ── */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-foreground/70">
              <User className="h-4 w-4" />
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bd-fullname" className="text-xs font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bd-fullname"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd-mobile" className="text-xs font-semibold">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bd-mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) =>
                      updateField("mobile", e.target.value.replace(/\D/g, ""))
                    }
                    className="h-10 rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bd-email" className="text-xs font-semibold">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bd-email"
                    type="email"
                    placeholder="your.email@bank.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="h-10 rounded-xl pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* ── Bank / Employment Details ── */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-foreground/70">
              <Building2 className="h-4 w-4" />
              Employment Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bd-bank" className="text-xs font-semibold">
                  Bank Name <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.bank} onValueChange={(v) => updateField("bank", v)}>
                  <SelectTrigger id="bd-bank" className="h-10 rounded-xl">
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {banks.map((b) => (
                      <SelectItem key={b.name} value={b.name}>
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: b.color }}
                          />
                          {b.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd-empid" className="text-xs font-semibold">
                  Employee ID <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bd-empid"
                    placeholder="e.g. EMP-123456"
                    value={formData.employeeId}
                    onChange={(e) => updateField("employeeId", e.target.value)}
                    className="h-10 rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd-designation" className="text-xs font-semibold">
                  Designation
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bd-designation"
                    placeholder="e.g. Branch Manager"
                    value={formData.designation}
                    onChange={(e) => updateField("designation", e.target.value)}
                    className="h-10 rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd-department" className="text-xs font-semibold">
                  Department
                </Label>
                <Input
                  id="bd-department"
                  placeholder="e.g. Operations"
                  value={formData.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* ── Address & Shipping ── */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-foreground/70">
              <MapPin className="h-4 w-4" />
              Address & Shipping
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bd-address" className="text-xs font-semibold">
                  Full Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="bd-address"
                  placeholder="House/Flat No., Street, Landmark..."
                  rows={2}
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="resize-none rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd-city" className="text-xs font-semibold">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bd-city"
                  placeholder="e.g. Delhi"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd-pincode" className="text-xs font-semibold">
                  PIN Code
                </Label>
                <Input
                  id="bd-pincode"
                  type="tel"
                  placeholder="e.g. 110001"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) =>
                    updateField("pincode", e.target.value.replace(/\D/g, ""))
                  }
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="h-px bg-border/40 sm:col-span-2" />

              <div className="space-y-1.5">
                <Label htmlFor="bd-from" className="text-xs font-semibold">
                  Loading City (From)
                </Label>
                <Input
                  id="bd-from"
                  placeholder="e.g. Mumbai"
                  value={formData.loadingCity}
                  onChange={(e) => updateField("loadingCity", e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd-to" className="text-xs font-semibold">
                  Unloading City (To)
                </Label>
                <Input
                  id="bd-to"
                  placeholder="e.g. Pune"
                  value={formData.unloadingCity}
                  onChange={(e) => updateField("unloadingCity", e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your details are safe with us. We'll verify your bank employment within{" "}
              <strong className="text-foreground">24 hours</strong> and send your exclusive
              discount code via SMS & email.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="cta"
            size="xl"
            className="w-full shimmer-overlay"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit & Claim 15% Discount
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
