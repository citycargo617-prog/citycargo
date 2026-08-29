import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
  linkClassName?: string;
  showText?: boolean;
  textClassName?: string;
  accentClassName?: string;
}

export function Logo({
  className = "",
  linkClassName = "",
  showText = true,
  textClassName = "text-2xl text-[#004b71]",
  accentClassName = "text-[10.5px] text-[#004b71]",
}: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-1 ${linkClassName}`}>
      <div
        className={`relative flex items-center justify-center shrink-0 ${className || "h-14 w-14"}`}
      >
        {/* Spinning Arrows */}
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]"
          viewBox="0 0 100 100"
        >
          <defs>
            <marker
              id="arrow-blue"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#004b71" />
            </marker>
            <marker
              id="arrow-orange"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f28020" />
            </marker>
          </defs>

          <path
            d="M 50 10 A 40 40 0 0 1 87.5 36.4"
            stroke="#004b71"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#arrow-blue)"
          />
          <path
            d="M 90 50 A 40 40 0 0 1 63.6 87.5"
            stroke="#f28020"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#arrow-orange)"
          />
          <path
            d="M 50 90 A 40 40 0 0 1 12.5 63.6"
            stroke="#004b71"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#arrow-blue)"
          />
          <path
            d="M 10 50 A 40 40 0 0 1 36.4 12.5"
            stroke="#f28020"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#arrow-orange)"
          />
        </svg>

        {/* Static Center Buildings */}
        <svg className="absolute w-[50%] h-[50%] z-10" viewBox="0 0 50 50">
          <rect x="20" y="8" width="12" height="42" fill="#004b71" rx="1" />
          <rect x="5" y="24" width="13" height="26" fill="#f28020" rx="1" />
          <rect x="34" y="30" width="11" height="20" fill="#f28020" rx="1" />

          <rect x="23" y="14" width="2" height="3" fill="white" />
          <rect x="27" y="14" width="2" height="3" fill="white" />
          <rect x="23" y="21" width="2" height="3" fill="white" />
          <rect x="27" y="21" width="2" height="3" fill="white" />
          <rect x="23" y="28" width="2" height="3" fill="white" />
          <rect x="27" y="28" width="2" height="3" fill="white" />
          <rect x="23" y="35" width="2" height="3" fill="white" />
          <rect x="27" y="35" width="2" height="3" fill="white" />

          <rect x="8" y="29" width="2" height="3" fill="white" />
          <rect x="13" y="29" width="2" height="3" fill="white" />
          <rect x="8" y="36" width="2" height="3" fill="white" />
          <rect x="13" y="36" width="2" height="3" fill="white" />

          <rect x="36" y="35" width="2" height="3" fill="white" />
          <rect x="41" y="35" width="2" height="3" fill="white" />
        </svg>
      </div>

      {showText && (
        <span className="flex flex-col leading-none ml-1">
          <span className={`font-display font-extrabold tracking-tight ${textClassName}`}>
            CITY<span className="font-light">CARGO</span>
          </span>
          <span
            className={`font-semibold tracking-wider mt-0.5 whitespace-nowrap ${accentClassName}`}
          >
            PACKERS AND MOVERS
          </span>
        </span>
      )}
    </Link>
  );
}
