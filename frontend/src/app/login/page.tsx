import React from "react";

const LoginPage = () => {
  return (
    <section className="h-screen mx-auto flex flex-col items-center  justify-center">
      <div className="bg-white/10 p-4 rounded-xl">
        <p className="text-center text-3xl">Acessar conta</p>
        <form action="" className="flex flex-col space-y-2">
          <div className="flex flex-col w-full min-w-xs">
            <label htmlFor="" className="text-lg font-light">
              Email
            </label>
            <input
              type="email"
              className="bg-light w-full py-2 text-lg text-dark pl-2 rounded-md"
            />
          </div>
          <div className="flex flex-col w-full min-w-xs">
            <label htmlFor="" className="text-lg font-light">
              Senha
            </label>
            <input
              type="password"
              className="bg-light w-full py-2 text-lg text-dark pl-2 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full mx-auto bg-blue-600 my-4 py-2 text-xl rounded-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
