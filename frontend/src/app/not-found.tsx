import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-medium">Página não encontrada</h2>
      <p className="mt-2 text-center text-sm font-light text-white/60">
        Algumas páginas estão sendo desenvolvidas, aguarde pelas atualizações.
      </p>
      <Link
        href="/dashboard"
        className="bg-light text-dark mt-4 flex items-center gap-1 rounded-lg px-3 py-1"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
    </div>
  );
}
