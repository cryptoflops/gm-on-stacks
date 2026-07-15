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
      <HowItWorks />
      <CommunityStats />
      <Testimonials />
      <Footer />
    </main>
  );
}
