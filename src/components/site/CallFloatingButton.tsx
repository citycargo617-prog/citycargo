import { useState } from "react";
import { Phone, X, ChevronUp } from "lucide-react";
import { HELPLINE_NUMBERS, PRIMARY_PHONE } from "@/lib/constants/contact";

interface CallFloatingButtonProps {
  phone?: string;
  displayPhone?: string;
}

export function CallFloatingButton({
  phone = PRIMARY_PHONE.tel,
  displayPhone = PRIMARY_PHONE.display,
}: CallFloatingButtonProps) {
  const [showTooltip, setShowTooltip] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-2">
      {/* Numbers Picker Popover */}
      {menuOpen && (
        <div className="mb-2 w-72 rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <p className="text-xs font-bold text-foreground">Select Helpline</p>
              <p className="text-[11px] text-muted-foreground">Available 24x7 for booking & tracking</p>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-secondary transition-colors"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 space-y-1.5">
            {HELPLINE_NUMBERS.map((item, idx) => (
              <a
                key={item.tel}
                href={item.tel}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] ${
                  idx === 0
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-secondary text-foreground hover:bg-accent/20"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{item.display}</span>
                </div>
                <span className="text-[10px] uppercase font-semibold tracking-wider opacity-85">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Tooltip / Hours badge */}
      {showTooltip && !menuOpen && (
        <div className="relative mb-1 hidden sm:flex items-center gap-2 rounded-2xl bg-card border border-border/80 px-3.5 py-2 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
          <div className="text-left">
            <p className="text-xs font-bold text-foreground">Direct Dispatch Helpline</p>
            <p className="text-[11px] text-muted-foreground font-mono font-semibold">{displayPhone}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-secondary transition-colors"
            title="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Floating Action Call Button */}
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={`Call City Cargo Helpline ${displayPhone}`}
        className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-3.5 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/45 active:scale-95"
      >
        {/* Subtle pulsing aura */}
        <span className="absolute -inset-0.5 rounded-full bg-primary opacity-40 blur-sm animate-pulse -z-10" />

        {/* Phone Icon */}
        <Phone className="h-5 w-5 animate-bounce" style={{ animationDuration: "2s" }} />

        <span className="font-display text-xs sm:text-sm font-bold tracking-wide">
          Direct Call
        </span>
        <ChevronUp className={`h-3.5 w-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
