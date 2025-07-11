import HeroSection from "../components/ui/Homepage/HeroSection";
import Navbar from "../components/ui/Homepage/Navbar";

export default function Home() {
  return (
    <>
      <main className="h-screen w-full bg-gray-200">
        <Navbar />
        <HeroSection />
      </main>
    </>
  );
}
