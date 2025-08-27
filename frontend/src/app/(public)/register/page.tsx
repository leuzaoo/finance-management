"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { Loader2Icon } from "lucide-react";

import { useAuthStore } from "@/src/store/useAuthStore";

import RegisterAndLoginBg from "@/src/components/ui/RegisterAndLoginBg";
import InputField from "@/src/components/ui/InputField";

type FieldErrors = { firstName?: string; email?: string; password?: string };

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  const { register, isLoading: registerLoading } = useAuthStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const loading = useMemo(
    () => registerLoading || btnLoading,
    [registerLoading, btnLoading],
  );

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cb = params.get("callbackUrl");
    if (cb) setCallbackUrl(cb);
  }, []);

  const validateFields = (): boolean => {
    const errs: FieldErrors = {};
    if (!firstName.trim()) errs.firstName = "Insira seu primeiro nome.";
    else if (firstName.length < 2) errs.firstName = "Insira um nome válido.";
    if (!email.trim()) errs.email = "Insira seu email.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errs.email = "Formato de email inválido.";
    if (!password) errs.password = "Insira sua senha.";
    else if (password.length < 6)
      errs.password = "A senha precisa ter ao menos 6 caracteres.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateFields()) return;

    try {
      setBtnLoading(true);

      const result = await register(firstName, email, password); // { ok, requirePrimaryCurrency }
      if (result.ok) {
        await sleep(2000); // UX
        if (result.requirePrimaryCurrency) {
          router.push("/onboarding/currency");
        } else {
          router.push(callbackUrl);
        }
      }
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} position="top-left" />
      <section className="mx-auto flex h-screen flex-col items-center justify-center lg:grid lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md p-4 lg:col-span-1">
          <p className="text-4xl font-medium lg:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text font-bold text-transparent">
              Crie{" "}
            </span>
            a sua conta!
          </p>
          <h1 className="mt-3 text-light/30">
            Cadastre-se abaixo. Já possui uma conta?{" "}
            <Link href="/login" className="text-sky-300 underline">
              Fazer login
            </Link>
            .
          </h1>

          <form onSubmit={handleRegister} className="mt-10 flex flex-col">
            <div className="space-y-3">
              <div className="space-y-1">
                <label>Primeiro nome</label>
                <InputField
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  type="text"
                  placeholder="José"
                  disabled={loading}
                />
                {fieldErrors.firstName && (
                  <p className="text-xs text-red-500">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label>Email</label>
                <InputField
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="johndoe@mail.com"
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <label>Senha</label>
                <InputField
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Senha"
                  disabled={loading}
                />
                {fieldErrors.password && (
                  <p className="text-xs text-red-500">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <div className="mt-5 text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-sky-500 underline hover:text-sky-600"
              >
                Fazer login.
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={`mx-auto my-5 flex w-full items-center justify-center gap-2 rounded-md py-2 text-lg text-white transition-all duration-200 ${
                loading
                  ? "cursor-not-allowed bg-blue-600/70 opacity-80"
                  : "cursor-pointer bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {loading ? (
                <>
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Finalizar"
              )}
            </button>
          </form>
        </div>

        <div className="col-span-1 hidden h-screen overflow-hidden rounded-l-3xl lg:block">
          <RegisterAndLoginBg />
        </div>
      </section>
    </>
  );
}
