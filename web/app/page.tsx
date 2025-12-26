import { Navbar } from "@/components/Navbar";
import { SayGmBlock } from "@/components/SayGmBlock";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-start pt-32 selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <Navbar />

      <SayGmBlock />

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-600">
          Powered by Clarity & Chainhooks
        </p>
      </div>
    </div>
    </main >
  );
}
