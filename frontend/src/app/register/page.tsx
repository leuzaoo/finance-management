import React from "react";

import InputField from "../../components/ui/InputField";

const RegisterPage = () => {
  return (
    <section className="h-screen mx-auto flex flex-col items-center  justify-center">
      <div className="bg-white/10 p-4 rounded-xl">
        <p className="text-center text-3xl">Criar conta</p>
        <form className="flex flex-col space-y-2 mt-5">
          <InputField label="Primeiro nome" type="text" placeholder="Ricardo" />
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
            Finalizar
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
