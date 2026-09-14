import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, PlusSquare, CheckCircle2 } from "lucide-react";

interface InstallAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstallAppModal({ open, onOpenChange }: InstallAppModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 sm:p-7">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#004b71]/10 p-2 ring-1 ring-[#004b71]/20">
            <img
              src="/pwa-192x192.png"
              alt="City Cargo"
              className="h-12 w-12 rounded-xl object-contain shadow-sm"
            />
          </div>
          <DialogTitle className="mt-3 font-display text-xl font-extrabold text-foreground">
            Install City Cargo App
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add City Cargo to your iPhone or iPad for instant booking and offline tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3.5 text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Share className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step 1
              </div>
              <div className="text-sm font-medium text-foreground">
                Tap the <span className="font-bold text-primary">Share</span> button in Safari's bottom toolbar.
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3.5 text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <PlusSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step 2
              </div>
              <div className="text-sm font-medium text-foreground">
                Scroll down and tap <span className="font-bold text-foreground">"Add to Home Screen"</span>.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3.5 text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step 3
              </div>
              <div className="text-sm font-medium text-foreground">
                Tap <span className="font-bold text-emerald-600">"Add"</span> in the top-right corner to complete.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Button
            variant="cta"
            className="w-full py-2.5 text-sm font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
