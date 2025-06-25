"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useUserStore } from "@/src/store/useUserStore";

import TitlePage from "@/src/components/common/TitlePage";
import InputField from "@/src/components/ui/InputField";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, getProfile, updateProfile } = useUserStore();

  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getProfile().then(() => {
      const p = useUserStore.getState().profile;
      if (!p) {
        router.push("/login");
      } else {
        setFirstName(p.firstName);
        setOriginalFirstName(p.firstName);
      }
    });
  }, [getProfile, router]);

  const isDirty = useMemo(() => {
    return firstName.trim() !== originalFirstName.trim() || password.length > 0;
  }, [firstName, originalFirstName, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;
    await updateProfile({
      firstName: firstName.trim(),
      password: password || undefined,
    });
    toast.success("Perfil atualizado com sucesso!");
    setOriginalFirstName(firstName.trim());
  };

  if (isLoading || !profile) return <p>Carregando…</p>;

  return (
    <>
      <ToastContainer autoClose={1500} position="top-left" />
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

          <div className="relative">
            <label className="block font-medium">Nova senha</label>
            <InputField
              placeholder="•••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (!showPassword) {
                  if (
                    confirm(
                      "Você tem certeza que deseja exibir sua senha? Mantenha-a visível somente em ambiente seguro.",
                    )
                  ) {
                    setShowPassword(true);
                  }
                } else {
                  setShowPassword(false);
                }
              }}
              className="absolute -inset-y-6 top-0 right-0 cursor-pointer pr-4 text-blue-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isDirty}
            className={`w-full rounded py-2 text-white transition ${
              isDirty
                ? "cursor-pointer bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-blue-700 opacity-30"
            } `}
          >
            Salvar alterações
          </button>
        </form>
      </div>
    </>
  );
}
