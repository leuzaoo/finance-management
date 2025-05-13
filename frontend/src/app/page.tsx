import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>Homepage</div>
      <Link href="/login">Ir para login</Link>
    </>
  );
}
