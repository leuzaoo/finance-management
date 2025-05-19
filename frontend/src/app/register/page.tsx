import Link from "next/link";
import React from "react";

import { PasswordIcon } from "../../assets/icons/PasswordIcon";
import { MailIcon } from "../../assets/icons/MailIcon";
import { UserIcon } from "../../assets/icons/UserIcon";

import InputField from "../../components/ui/InputField";
import Video from "../../components/ui/Video";

const RegisterPage = () => {
  return (
    <section className="mx-auto flex h-screen flex-col items-center justify-center lg:grid lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md p-4 lg:col-span-1">
        <p className="text-4xl font-medium lg:text-5xl">
          <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text font-bold text-transparent">
            Crie{" "}
          </span>
          a sua conta!
        </p>

        <h1 className="mt-3 font-light opacity-60">
          Insira seus dados abaixo.
        </h1>

        <form className="mt-20 flex flex-col">
          <div className="space-y-3">
            <InputField
              type="text"
              placeholder="Primeiro nome"
              image={<UserIcon />}
            />
            <InputField type="email" placeholder="Email" image={<MailIcon />} />
            <InputField
              type="password"
              placeholder="Senha"
              image={<PasswordIcon />}
            />
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
      </div>

      <div className="col-span-1 hidden h-screen overflow-hidden rounded-l-3xl lg:block">
        <Video />
      </div>
    </section>
  );
};

export default RegisterPage;
