"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import React, { useState } from "react";
import Link from "next/link";

import { LoaderIcon } from "../../assets/icons/LoaderCircleIcon";
import { PasswordIcon } from "../../assets/icons/PasswordIcon";
import { useAuthStore } from "../../store/useAuthStore";
import { MailIcon } from "../../assets/icons/MailIcon";
import { UserIcon } from "../../assets/icons/UserIcon";

import InputField from "../../components/ui/InputField";
import Video from "../../components/ui/Video";

type FieldErrors = {
  firstName?: string;
  email?: string;
  password?: string;
};

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const { register, isLoading } = useAuthStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    const success = await register(firstName, email, password);
    if (success) {
      setTimeout(() => {
        router.push(callbackUrl);
      }, 3000);
    }
  };

  const renderLoader = () => (
    <div className="mt-5 flex justify-center rounded-lg bg-white py-4 text-black">
      <LoaderIcon />
    </div>
  );
  const renderForm = () => (
    <form onSubmit={handleRegister} className="mt-10 flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <InputField
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            type="text"
            placeholder="Primeiro nome"
            image={<UserIcon />}
          />
          {fieldErrors.firstName && (
            <p className="text-xs text-red-500">{fieldErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-1">
          <InputField
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            image={<MailIcon />}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <InputField
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Senha"
            image={<PasswordIcon />}
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>
      </div>
      <div className="mt-5 text-sm">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-sky-300 underline">
          Fazer login.
        </Link>
      </div>

      <button
        type="submit"
        className="mx-auto my-5 w-full cursor-pointer rounded-md bg-blue-600 py-2 text-xl"
      >
        Finalizar
      </button>
    </form>
  );

  return (
    <>
      <ToastContainer position="top-left" autoClose={3000} />
      <section className="mx-auto flex h-screen flex-col items-center justify-center lg:grid lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md p-4 lg:col-span-1">
          {isLoading ? (
            <>
              <p className="text-4xl font-bold lg:text-5xl">
                Sua conta{" "}
                <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">
                  foi criada
                </span>
                !
              </p>
              <p className="text-light/50">Aguarde pelos últimos ajustes.</p>
            </>
          ) : (
            <>
              <p className="text-4xl font-medium lg:text-5xl">
                <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text font-bold text-transparent">
                  Crie{" "}
                </span>
                a sua conta!
              </p>
              <h1 className="text-light/30 mt-3">
                Cadastre-se abaixo. Já possui uma conta?{" "}
                <Link href="/login" className="text-sky-300 underline">
                  Fazer login
                </Link>
                .
              </h1>
            </>
          )}

          {isLoading ? renderLoader() : renderForm()}
        </div>

        <div className="col-span-1 hidden h-screen overflow-hidden rounded-l-3xl lg:block">
          <Video />
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
