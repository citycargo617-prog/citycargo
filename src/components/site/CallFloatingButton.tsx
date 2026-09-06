import { useState } from "react";
import { Phone, X } from "lucide-react";

interface CallFloatingButtonProps {
  phone?: string;
  displayPhone?: string;
}

export function CallFloatingButton({
  phone = "+919651429006",
  displayPhone = "+91 96514 29006",
}: CallFloatingButtonProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-2 group">
      {/* Interactive Tooltip / Hours badge */}
      {showTooltip && (
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
      <a
        href={`tel:${phone}`}
        aria-label={`Call City Cargo at ${displayPhone}`}
        className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-3.5 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/45 active:scale-95"
      >
        {/* Subtle pulsing aura */}
        <span className="absolute -inset-0.5 rounded-full bg-primary opacity-40 blur-sm animate-pulse -z-10" />

        {/* Phone Icon */}
        <Phone className="h-5 w-5 animate-bounce" style={{ animationDuration: "2s" }} />

        <span className="font-display text-xs sm:text-sm font-bold tracking-wide">
          Direct Call
        </span>
      </a>
    </div>
  );
}
