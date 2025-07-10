import Image from "next/image";

import HeroSection from "../components/ui/Homepage/HeroSection";
import Navbar from "../components/ui/Homepage/Navbar";

export default function Home() {
  return (
    <>
      <main className="h-full w-full bg-gray-200">
        <Navbar />
        <HeroSection />
        <section>
          <h1 className="sr-only">Dashboard Image</h1>
          <div className="container mx-auto mt-10 px-4 pb-5 md:px-0">
            <Image
              src="/dashboard-mobile-print.png"
              alt="Dashboard Print"
              width={1080}
              height={1920}
              className="mx-auto rounded-md sm:hidden"
            />

            <Image
              src="/dashboard-print.png"
              alt="Dashboard Print"
              width={1920}
              height={1080}
              className="mx-auto hidden rounded-lg sm:block"
            />
            <p className="text-dark mt-2 px-4 text-center text-sm opacity-50">
              Imagens reais do dashboard. Design e códigos feito apenas por uma
              pessoa.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
