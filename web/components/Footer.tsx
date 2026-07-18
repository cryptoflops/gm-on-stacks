
import { Github, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--color-panel)]/50 backdrop-blur-xl relative z-10">
      {/* Cross-project links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 border-b border-border">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-600 mb-6">
          <span>Built by <a href="https://github.com/cryptoflops" className="hover:text-zinc-400 transition-colors">cryptoflops</a></span>
          <span>·</span>
          <a href="https://aegis-aev.pages.dev" className="hover:text-white transition-colors">Aegis</a>
          <a href="https://quest-dao.pages.dev" className="hover:text-white transition-colors">QuestDAO</a>
          <a href="https://stacks-jackpot-wall.pages.dev" className="hover:text-white transition-colors">Jackpot Wall</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/assets/gm-logo.png" alt="" width={32} height={32} className="opacity-60" />
            <div>
              <p className="text-white font-bold text-sm">GM on Stacks</p>
              <p className="text-zinc-500 text-xs">Say gm onchain. Build your streak. Mint your badge.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/cryptoflops/gm-on-stacks" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium">
              <Github size={14} /> GitHub
            </a>
            <a href="https://www.stacks.co" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-[var(--color-brand)] transition-colors flex items-center gap-1.5 text-xs font-medium">
              <Globe size={14} /> Stacks
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs">© {new Date().getFullYear()} GM on Stacks. All rights reserved.</p>
          <span className="text-zinc-700 text-[10px] uppercase tracking-widest">Built on Bitcoin. Secured by Stacks.</span>
        </div>
      </div>
    </footer>
  );
}
