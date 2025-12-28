import Navbar from "@/components/Navbar";
import SayGmBlock from "@/components/SayGmBlock";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden selection:bg-brand selection:text-white">
      <Navbar />
      <SayGmBlock />
    </main>
  );
}
