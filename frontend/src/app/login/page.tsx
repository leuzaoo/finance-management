"use client";

import Image from "next/image";
import Link from "next/link";

import { PasswordIcon } from "../../assets/icons/PasswordIcon";
import { Providers } from "../../utils/login-providers";
import { MailIcon } from "../../assets/icons/MailIcon";

import InputField from "../../components/ui/InputField";
import Video from "../../components/ui/Video";

const LoginPage = () => {
  return (
    <section className="mx-auto flex h-screen flex-col items-center justify-center lg:grid lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md p-4 lg:col-span-1">
        <p className="text-4xl font-medium lg:text-5xl">
          Olá,{" "}
          <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text font-bold text-transparent">
            novamente!
          </span>
        </p>

        <h1 className="mt-3 font-light opacity-60">Faça login em sua conta.</h1>

        <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
          {Providers.map(({ id, name, icon }) => (
            <button
              disabled
              key={id}
              className={`bg-dark-light text-light/60 flex w-full items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Image src={icon} alt={name} width={20} height={20} />
              <span>Entrar com {name}</span>
            </button>
          ))}
        </div>

        <p className="text-light/60 my-10 w-full text-center text-sm">
          ou continue com seu e-mail
        </p>

        <form className="flex flex-col">
          <div className="space-y-3">
            <InputField
              type="email"
              placeholder="johndoe@mail.com"
              image={<MailIcon />}
            />
            <InputField
              type="password"
              placeholder="••••••••••••"
              image={<PasswordIcon />}
            />
          </div>
          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="size-4" />
              Salvar dados?
            </div>
            <Link href="/register" className="text-sky-300 underline">
              Esqueceu sua senha?
            </Link>
          </div>
          <button
            type="submit"
            className="mx-auto my-5 w-full cursor-pointer rounded-md bg-blue-600 py-2 text-xl"
          >
            Entrar
          </button>
        </form>
      </div>

      <div className="col-span-1 hidden h-screen overflow-hidden rounded-l-3xl lg:block">
        <Video />
      </div>
    </section>
  );
};

export default LoginPage;
