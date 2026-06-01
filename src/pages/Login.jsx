import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Futuramente aqui vamos validar o e-mail e senha com o backend
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        <section className="lg:col-span-5 bg-white flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="font-editorial text-3xl font-black text-artOrange inline-block mb-10"
            >
              Artfolio
            </Link>

            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
              Acesso do usuário
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none mb-5">
              Fazer <span className="italic text-artOrange">Login.</span>
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Entre com seu e-mail e senha para acessar o feed, publicar obras,
              conversar com clientes e gerenciar seu portfólio.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Senha
                </label>

                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                  <input type="checkbox" className="accent-artPurple" />
                  Lembrar acesso
                </label>

                <Link
                  to="/recuperar-senha"
                  className="font-bold text-artPurple hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                Entrar no Artfolio
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </form>

            <div className="mt-8 bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5">
              <p className="text-sm text-gray-500">
                Ainda não possui uma conta?{" "}
                <Link
                  to="/cadastro"
                  className="font-bold text-artOrange hover:underline"
                >
                  Criar cadastro
                </Link>
              </p>
            </div>

            <Link
              to="/"
              className="inline-block mt-5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Voltar para início
            </Link>
          </div>
        </section>

        <section className="hidden lg:block lg:col-span-7 relative overflow-hidden bg-artBlue">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop"
            alt="Arte de fundo"
            className="w-full h-full object-cover mix-blend-multiply opacity-80 scale-105"
          />

          <div className="absolute inset-0 flex items-center p-16 text-white">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block mb-4">
                Área do artista
              </span>

              <h2 className="font-editorial text-7xl italic leading-none max-w-xl">
                Acesse seu universo criativo.
              </h2>

              <p className="text-sm text-white/70 max-w-md mt-6 leading-relaxed">
                Depois do login, você será direcionado ao feed para explorar
                obras, publicar criações e acompanhar sua presença artística.
              </p>

              <div className="mt-8 bg-white/10 border border-white/10 rounded-[1.7rem] p-5 max-w-md">
                <h3 className="text-sm font-bold mb-3">
                  Caminho após o login
                </h3>

                <div className="space-y-3 text-xs text-white/70">
                  <p>
                    <strong className="text-white">1.</strong> Entrar com e-mail
                    e senha
                  </p>

                  <p>
                    <strong className="text-white">2.</strong> Ir para o feed
                    principal
                  </p>

                  <p>
                    <strong className="text-white">3.</strong> Publicar,
                    conversar e gerenciar seu portfólio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}