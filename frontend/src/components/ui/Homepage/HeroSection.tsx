import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="mt-20 px-4 text-dark">
      <h1 className="sr-only">FinSafe</h1>
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-medium dark:text-light sm:text-5xl">
          Acompanhe a sua vida financeira com o FinSafe
        </h2>
        <p className="text-dark/40 dark:text-light/30 text-sm sm:text-lg xl:mx-auto xl:max-w-5xl">
          FinSafe simplifica e otimiza a sua gestão financeira. Oferencendo
          acompanhamentos de receitas e despesas, categorização de transações e
          gráficos para acompanhar a evolução, em qualquer moeda que você
          desejar.
        </p>

        <Link
          className="mx-auto mt-4 flex max-w-max items-center justify-center gap-2 rounded-xl bg-green-dark px-4 py-2 font-light text-light sm:text-xl"
          href="/register"
        >
          Comece agora
          <ArrowRightIcon size={20} />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
