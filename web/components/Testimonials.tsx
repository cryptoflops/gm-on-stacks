"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  initials: string;
  streak: number;
  gradient: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I never thought saying GM every day would become a ritual. The 21-day streak discount is real — minted my badge for 1 STX. Feels like an achievement.",
    name: "StacksMaxi.btc",
    initials: "SM",
    streak: 67,
    gradient: "from-brand to-amber-500",
  },
  {
    quote:
      "Building my streak taught me consistency. The community here is incredible — everyone supporting each other to keep the chain alive one GM at a time.",
    name: "satoshin.sats",
    initials: "SS",
    streak: 42,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    quote:
      "The NFT badge is beautiful and the fact that it's SIP-009 compatible means I can use it across the Stacks ecosystem. Best 1 STX I ever spent.",
    name: "nifty.nakamoto",
    initials: "NN",
    streak: 35,
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    quote:
      "I lost my streak at day 20. Almost gave up. But the community encouraged me to restart. Now I'm at 50+ days and it's become part of my morning routine.",
    name: "gm-everyday.btc",
    initials: "GE",
    streak: 53,
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  const t = testimonials[current];

  return (
    <section className="relative z-10 w-full py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-4">
            What Streakers Say
          </h2>
          <p className="text-gray-400 text-lg">
            Real builders. Real streaks. Real vibes.
          </p>
        </div>

        {/* Testimonial Card */}
        <div
          className="glass-card relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Quote mark decoration */}
          <Quote className="absolute top-6 right-6 w-16 h-16 text-white/[0.04] rotate-180 pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-display font-bold text-lg shadow-lg`}
                aria-hidden="true"
              >
                {t.initials}
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <blockquote className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-white font-display font-bold text-sm">
                  {t.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-[10px] font-mono text-brand uppercase tracking-[0.15em]">
                  {t.streak}-day streak
                </span>
              </div>
            </div>
          </div>

          {/* Navigation dots + arrows */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-brand w-6"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
