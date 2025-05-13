import React from "react";

import InputField from "../../components/ui/InputField";

const LoginPage = () => {
  return (
    <section className="h-screen mx-auto flex flex-col items-center  justify-center">
      <div className="bg-white/10 p-4 rounded-xl">
        <p className="text-center text-3xl">Acessar conta</p>
        <form action="" className="flex flex-col space-y-2">
          <InputField
            label="Email"
            type="email"
            placeholder="johndoe@mail.com"
          />
          <InputField label="Senha" type="password" placeholder="********" />
          <button
            type="submit"
            className="cursor-pointer w-full mx-auto bg-blue-600 my-4 py-2 text-xl rounded-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
