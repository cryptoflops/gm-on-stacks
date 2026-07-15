"use client";

import { Send, TrendingUp, Shield } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Say GM Daily",
    description:
      'Post "gm" to the Stacks blockchain every day. It\'s free — you only pay gas.',
    icon: Send,
  },
  {
    number: "02",
    title: "Build Your Streak",
    description:
      "Track your streak. The longer you go, the closer you get to the 97% discount.",
    icon: TrendingUp,
  },
  {
    number: "03",
    title: "Mint Your Badge",
    description:
      "At 21 consecutive days, mint a premium SIP-009 NFT Badge for only 1 STX (normally 33 STX).",
    icon: Shield,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 w-full py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Three simple steps to earn your on-chain reputation
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass-card flex flex-col items-start text-left relative group"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Step Number */}
                <span className="text-[10px] font-mono text-brand uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-brand/40" />
                  Step {step.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-6 group-hover:bg-brand/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-brand" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
