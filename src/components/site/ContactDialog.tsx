import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CheckCircle2 } from "lucide-react";
import { HELPLINE_NUMBERS } from "@/lib/constants/contact";

interface ContactDialogProps {
  children: React.ReactNode;
}

export function ContactDialog({ children }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", company: "", email: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", phone: "", company: "", email: "" });
      }, 300);
    }, 2000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">
              Enquiry Submitted!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team will call you within 30 minutes.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Submit your enquiry</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Fill in your details and our logistics expert will reach out to you shortly.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="contact-phone"
                    placeholder="10-digit mobile number"
                    className="pl-10"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-company">Company Name</Label>
                <Input
                  id="contact-company"
                  placeholder="Your company"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <Button type="submit" variant="cta" size="lg" className="w-full">
                Submit Enquiry
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">
                Or call our 24x7 Helplines directly:
              </p>
              <div className="flex flex-col gap-1.5">
                {HELPLINE_NUMBERS.map((item) => (
                  <a
                    key={item.tel}
                    href={item.tel}
                    className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-xs font-bold text-foreground hover:bg-accent/15 hover:text-accent-foreground transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-accent" />
                      <span>{item.display}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-normal">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
