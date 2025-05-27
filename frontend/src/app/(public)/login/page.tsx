// app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { LoaderIcon } from "../../../assets/icons/LoaderCircleIcon";
import { PasswordIcon } from "../../../assets/icons/PasswordIcon";
import { useAuthStore } from "../../../store/useAuthStore";
import { Providers } from "../../../utils/login-providers";
import { MailIcon } from "../../../assets/icons/MailIcon";

import InputField from "../../../components/ui/InputField";
import Video from "../../../components/ui/Video";

type FieldErrors = { email?: string; password?: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  // Pega o callbackUrl da query string no client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cb = params.get("callbackUrl");
    if (cb) setCallbackUrl(cb);
  }, []);

  const validateFields = (): boolean => {
    const errs: FieldErrors = {};
    if (!email.trim()) errs.email = "Insira seu email.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errs.email = "Formato de email inválido.";
    if (!password) errs.password = "Insira sua senha.";
    else if (password.length < 6)
      errs.password = "A senha precisa ter ao menos 6 caracteres.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    const success = await login(email, password);
    if (success) {
      setTimeout(() => void router.push(callbackUrl), 1500);
    }
  };

  return (
    <>
      <ToastContainer autoClose={1000} position="top-left" />
      <section className="mx-auto flex h-screen flex-col items-center justify-center lg:grid lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md p-4 lg:col-span-1">
          <p className="text-4xl font-medium lg:text-5xl">
            Olá,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text font-bold text-transparent">
              novamente!
            </span>
          </p>
          <h1 className="text-light/30 mt-3">
            Faça login em sua conta. Não possui?{" "}
            <Link href="/register" className="text-sky-300 underline">
              Criar conta
            </Link>
            .
          </h1>

          <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
            {Providers.map(({ id, name, icon }) => (
              <button
                key={id}
                disabled
                className="bg-dark-light text-light/60 flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Image src={icon} alt={name} width={20} height={20} />
                <span>Entrar com {name}</span>
              </button>
            ))}
          </div>

          <p className="text-light/60 my-10 w-full text-center text-sm">
            ou continue com seu e-mail
          </p>

          {isLoading ? (
            <div className="flex justify-center rounded-lg bg-white py-4 text-black">
              <LoaderIcon />
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col">
              <div className="space-y-3">
                <div className="space-y-1">
                  <InputField
                    type="email"
                    placeholder="johndoe@mail.com"
                    image={<MailIcon />}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <InputField
                    type="password"
                    placeholder="••••••••••••"
                    image={<PasswordIcon />}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  {fieldErrors.password && (
                    <p className="text-xs text-red-500">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="size-4" />
                  Salvar dados?
                </div>
                <Link
                  href="/recover-password"
                  className="text-sky-300 underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <button
                type="submit"
                className="mx-auto my-5 w-full rounded-md bg-blue-600 py-2 text-xl"
              >
                Entrar
              </button>
            </form>
          )}
        </div>
        <div className="col-span-1 hidden h-screen overflow-hidden rounded-l-3xl lg:block">
          <Video />
        </div>
      </section>
    </>
  );
}
