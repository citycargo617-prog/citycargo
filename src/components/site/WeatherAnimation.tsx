import React from "react";
import type { WeatherConditionInfo } from "@/lib/weather";

interface WeatherAnimationProps {
  condition: WeatherConditionInfo;
  isDay?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WeatherAnimation({
  condition,
  isDay = true,
  size = "md",
  className = "",
}: WeatherAnimationProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  }[size];

  const category = condition.category;

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
      {/* ── Sunny / Clear Sky ── */}
      {category === "clear" && isDay && (
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Outer Sun Glow Pulse */}
          <div className="absolute inset-2 rounded-full bg-amber-400/30 blur-lg animate-sun-pulse" />

          {/* Rotating Sun Rays */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full text-amber-500 animate-sun-spin"
            fill="currentColor"
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="50"
                y1="12"
                x2="50"
                y2="2"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>

          {/* Central Radiant Sun Disc */}
          <div className="relative h-3/5 w-3/5 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-400 shadow-[0_0_24px_rgba(251,191,36,0.8)]" />
        </div>
      )}

      {/* ── Clear Night ── */}
      {category === "clear" && !isDay && (
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute inset-2 rounded-full bg-indigo-500/20 blur-md" />
          {/* Crescent Moon */}
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-amber-200 fill-current drop-shadow-[0_0_12px_rgba(253,230,138,0.7)]"
          >
            <path d="M50 15 A35 35 0 1 0 85 50 A28 28 0 1 1 50 15 Z" />
          </svg>
          {/* Twinkling Stars */}
          <span className="absolute top-2 right-3 text-xs animate-twinkle">✨</span>
          <span
            className="absolute bottom-4 left-3 text-[10px] animate-twinkle"
            style={{ animationDelay: "1.5s" }}
          >
            ✦
          </span>
        </div>
      )}

      {/* ── Cloudy / Partly Cloudy ── */}
      {category === "clouds" && (
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Background Sun Peeking */}
          {isDay && (
            <div className="absolute top-1 right-2 h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-sun-pulse" />
          )}
          {/* Foreground Drifting Cloud */}
          <div className="relative w-full text-slate-300 dark:text-slate-200 animate-cloud-drift">
            <svg viewBox="0 0 100 65" className="w-full h-full fill-current drop-shadow-md">
              <path d="M20 50 A15 15 0 0 1 28 25 A22 22 0 0 1 65 20 A18 18 0 0 1 85 36 A15 15 0 0 1 80 50 Z" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Rain / Showers ── */}
      {category === "rain" && (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          {/* Rain Cloud */}
          <div className="relative w-full text-slate-400 dark:text-slate-300 animate-cloud-drift">
            <svg viewBox="0 0 100 60" className="w-full h-full fill-current drop-shadow-md">
              <path d="M20 45 A15 15 0 0 1 28 22 A22 22 0 0 1 65 18 A18 18 0 0 1 85 34 A15 15 0 0 1 80 45 Z" />
            </svg>
          </div>
          {/* Falling Raindrops */}
          <div className="absolute bottom-2 inset-x-4 flex justify-around pointer-events-none">
            <span className="w-1 h-3 rounded-full bg-cyan-400 animate-rain-drop-1" />
            <span className="w-1 h-3 rounded-full bg-sky-400 animate-rain-drop-2" />
            <span className="w-1 h-3 rounded-full bg-blue-400 animate-rain-drop-3" />
            <span
              className="w-1 h-3 rounded-full bg-cyan-300 animate-rain-drop-1"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      )}

      {/* ── Thunderstorm ── */}
      {category === "thunderstorm" && (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          {/* Dark Storm Cloud */}
          <div className="relative w-full text-slate-600 dark:text-slate-400">
            <svg viewBox="0 0 100 60" className="w-full h-full fill-current drop-shadow-lg">
              <path d="M20 45 A15 15 0 0 1 28 22 A22 22 0 0 1 65 18 A18 18 0 0 1 85 34 A15 15 0 0 1 80 45 Z" />
            </svg>
          </div>
          {/* Flashing Lightning Bolt */}
          <svg
            viewBox="0 0 24 24"
            className="absolute bottom-1 w-6 h-8 text-yellow-400 fill-current animate-lightning"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          {/* Heavy Rain Streaks */}
          <div className="absolute bottom-1 inset-x-5 flex justify-between pointer-events-none">
            <span className="w-0.5 h-3 rounded-full bg-cyan-300 animate-rain-drop-1" />
            <span className="w-0.5 h-3 rounded-full bg-cyan-400 animate-rain-drop-3" />
          </div>
        </div>
      )}

      {/* ── Fog & Mist ── */}
      {category === "fog" && (
        <div className="relative flex flex-col items-center justify-center w-full h-full gap-1.5 overflow-hidden">
          <div className="w-4/5 h-2 rounded-full bg-slate-400/50 animate-fog-wave" />
          <div
            className="w-full h-2 rounded-full bg-slate-400/70 animate-fog-wave"
            style={{ animationDelay: "-2s" }}
          />
          <div
            className="w-3/4 h-2 rounded-full bg-slate-400/40 animate-fog-wave"
            style={{ animationDelay: "-4s" }}
          />
        </div>
      )}

      {/* ── Snowfall ── */}
      {category === "snow" && (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <div className="relative w-full text-slate-300 dark:text-slate-200">
            <svg viewBox="0 0 100 60" className="w-full h-full fill-current">
              <path d="M20 45 A15 15 0 0 1 28 22 A22 22 0 0 1 65 18 A18 18 0 0 1 85 34 A15 15 0 0 1 80 45 Z" />
            </svg>
          </div>
          <div className="absolute bottom-2 inset-x-4 flex justify-around pointer-events-none text-[10px] text-cyan-200">
            <span className="animate-rain-drop-1">❄</span>
            <span className="animate-rain-drop-2">❅</span>
            <span className="animate-rain-drop-3">❆</span>
          </div>
        </div>
      )}
    </div>
  );
}
