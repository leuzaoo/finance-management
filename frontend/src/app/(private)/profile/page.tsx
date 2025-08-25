"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilLineIcon, UserCircle2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { useUserStore } from "@/src/store/useUserStore";
import { useAuthStore } from "@/src/store/useAuthStore";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
import PersonalDataModal from "@/src/components/forms/PersonalDataModal";
import TitlePage from "@/src/components/common/TitlePage";
import ThemeSwitch from "@/src/components/ui/ThemeSwitch";
import AuthModal from "@/src/components/forms/AuthModal";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, getProfile, updateProfile } = useUserStore();
  const { logout, isLoading: logoutLoading } = useAuthStore();

  const [pdModalOpen, setPdModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    getProfile().then(() => {
      if (!useUserStore.getState().profile) {
        router.push("/login");
      }
    });
  }, [getProfile, router]);

  const handleLogout = async () => {
    await logout();
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  if (isLoading || !profile) return <LoaderIcon />;

  const handlePersonalSubmit = async (data: { firstName: string }) => {
    await updateProfile({ firstName: data.firstName });
    toast.success("Dados pessoais atualizados!");
    setPdModalOpen(false);
  };

  const handleAuthSubmit = async (data: { password: string }) => {
    await updateProfile({ password: data.password });
    toast.success("Senha atualizada!");
    setAuthModalOpen(false);
  };

  return (
    <>
      <ToastContainer autoClose={1500} position="top-left" />
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <TitlePage text="Meu Perfil" />
          <button>
            <ThemeSwitch />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-dark/10 p-4 transition-all duration-1000 dark:border-light/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCircle2 size={40} strokeWidth={1} />
              <div>
                <p className="font-medium">{profile.firstName}</p>
                <p className="text-sm font-light">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-dark/10 p-4 transition-all duration-1000 dark:border-light/10">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold 2md:text-xl">Dados Pessoais</h2>
            <button
              onClick={() => setPdModalOpen(true)}
              title="Editar Dados Pessoais"
              className="cursor-pointer rounded-lg border border-dark/20 px-2 py-1 transition-all duration-1000 dark:border-light/20"
            >
              <PencilLineIcon
                size={16}
                className="transition-all duration-1000 dark:text-light/50 md:text-dark/50"
              />
            </button>
          </div>

          <div className="mt-3">
            <label className="block text-sm text-dark/50 transition-all duration-1000 dark:text-light/50 2md:text-base">
              Primeiro nome
            </label>
            <p className="text-dark transition-all duration-1000 dark:text-light 2md:text-lg">
              {profile.firstName}
            </p>
          </div>

          <div className="mt-3">
            <label className="block text-sm text-dark/50 transition-all duration-1000 dark:text-light/50 2md:text-base">
              Email
            </label>
            <p className="text-dark transition-all duration-1000 dark:text-light 2md:text-lg">
              {profile.email}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-dark/10 p-4 transition-all duration-1000 dark:border-light/10">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold 2md:text-xl">Autenticação</h2>
            <button
              onClick={() => setAuthModalOpen(true)}
              title="Editar Senha"
              className="cursor-pointer rounded-lg border border-dark/20 px-2 py-1 dark:border-light/20"
            >
              <PencilLineIcon
                size={16}
                className="text-dark/50 dark:text-light/50"
              />
            </button>
          </div>

          <div className="mt-3">
            <label className="block text-sm text-dark/50 transition-all duration-1000 dark:text-light/50 2md:text-base">
              Senha
            </label>
            <p className="text-dark transition-all duration-1000 dark:text-light 2md:text-lg">
              ••••••••••••
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`mt-4 w-full cursor-pointer rounded-xl bg-red-600 py-3 text-center font-medium text-white transition-all duration-200 hover:bg-red-400 ${
            logoutLoading && "cursor-not-allowed opacity-50"
          }`}
        >
          {logoutLoading ? <LoaderIcon /> : "Sair da conta"}
        </button>
      </div>

      <PersonalDataModal
        isOpen={pdModalOpen}
        firstName={profile.firstName}
        email={profile.email}
        onClose={() => setPdModalOpen(false)}
        onSubmit={handlePersonalSubmit}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSubmit={handleAuthSubmit}
      />
    </>
  );
}
