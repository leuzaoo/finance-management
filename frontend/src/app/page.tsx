import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Bem-vindo!</h1>
        <Link href="/login" className="bg-blue-600 px-6 py-2">
          Ir para login
        </Link>
      </div>
    </>
  );
}
