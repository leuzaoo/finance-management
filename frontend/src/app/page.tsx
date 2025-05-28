import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Bem-vindo!</h1>
        <Link href="/login" className="bg-blue-400 p-3">
          Ir para login
        </Link>
      </div>
    </>
  );
}
