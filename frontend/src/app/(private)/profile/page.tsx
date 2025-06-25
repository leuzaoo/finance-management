"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

import { useUserStore } from "@/src/store/useUserStore";

import TitlePage from "@/src/components/common/TitlePage";
import InputField from "@/src/components/ui/InputField";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, getProfile, updateProfile } = useUserStore();
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getProfile().then(() => {
      const p = useUserStore.getState().profile;
      if (!p) {
        router.push("/login");
      } else {
        setFirstName(p.firstName);
      }
    });
  }, [getProfile, router]);

  console.log(profile)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ firstName, password: password || undefined });
    setPassword("");

    setTimeout(() => {
      getProfile();
    }, 1500);
  };

  if (isLoading || !profile) return <p>Carregando…</p>;

  return (
    <>
      <ToastContainer autoClose={1500} />
      <div className="mx-auto max-w-md">
        <TitlePage text="Meu Perfil" />

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block font-medium">Email</label>
            <InputField
              disabled
              placeholder="Email"
              type="email"
              value={profile.email}
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block font-medium">Primeiro nome</label>
            <InputField
              placeholder="José"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Nova senha</label>
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Salvar alterações
          </button>
        </form>
      </div>
    </>
  );
}
