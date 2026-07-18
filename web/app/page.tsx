import Navbar from "@/components/Navbar";
import SayGmBlock from "@/components/SayGmBlock";
import HowItWorks from "@/components/HowItWorks";
import CommunityStats from "@/components/CommunityStats";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Background from "@/components/Background";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent overflow-hidden selection:bg-brand selection:text-white">
      <Background />
      <Navbar />
      <SayGmBlock />

      {/* Live Network Stats */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="glass-card !p-4 grid grid-cols-3 text-center">
          <div>
            <p className="data-label">Network</p>
            <p className="text-white font-bold text-sm">Stacks Mainnet</p>
          </div>
          <div>
            <p className="data-label">Contract</p>
            <p className="text-white font-mono text-xs">SP1TN...MAMP23P</p>
          </div>
          <div>
            <p className="data-label">Status</p>
            <p className="text-emerald-400 font-bold text-sm">Live</p>
          </div>
        </div>
      </div>

      <HowItWorks />
      <CommunityStats />

      {/* Why GM on Stacks */}
      <section className="border-t border-border relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="data-label mb-2">Why GM on Stacks</p>
          <h2 className="text-3xl font-bold text-white mb-12">More than just a greeting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-2">On-chain identity</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Every gm is a permanent transaction on the Stacks blockchain, secured by Bitcoin. Your streak is your proof of consistent presence in the ecosystem.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-2">Earn while you engage</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">After a 21-day streak, mint a premium SIP-009 NFT Badge for just 1 STX instead of 33 STX. That&apos;s a 97% discount for consistency.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-2">Community building</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Join hundreds of daily gm senders. Track global counts, compete on streaks, and be part of the friendliest community on Stacks.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-2">Developer friendly</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Open source and built on Clarity smart contracts. The gm contract is simple, auditable, and a great starting point for learning Stacks development.</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </main>
  );
}
