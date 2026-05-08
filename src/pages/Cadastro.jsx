import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Futuramente aqui vamos enviar os dados para o backend
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        <section className="lg:col-span-4 bg-artDark text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div>
            <Link
              to="/"
              className="font-editorial text-3xl font-black text-artOrange inline-block mb-12"
            >
              Artfolio
            </Link>

            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
              Novo cadastro
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
              Crie sua{" "}
              <span className="italic text-artPurple block">conta.</span>
            </h1>

            <p className="text-sm text-gray-400 mt-5 leading-relaxed max-w-sm">
              Preencha seus dados para criar seu perfil no Artfolio. Depois do
              cadastro, você será direcionado para o login.
            </p>
          </div>

          <div className="mt-10 space-y-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-artPurple text-artPurple flex items-center justify-center text-xs font-bold">
                01
              </div>

              <p className="text-xs uppercase font-bold tracking-widest">
                Criar cadastro
              </p>
            </div>

            <div className="flex items-center gap-4 opacity-70">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">
                02
              </div>

              <p className="text-xs uppercase font-bold tracking-widest">
                Fazer login
              </p>
            </div>

            <div className="flex items-center gap-4 opacity-40">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">
                03
              </div>

              <p className="text-xs uppercase font-bold tracking-widest">
                Acessar o feed
              </p>
            </div>
          </div>

          <i className="fa-solid fa-user-plus absolute -right-10 -bottom-10 text-[13rem] text-white/5 rotate-12"></i>
        </section>

        <section className="lg:col-span-8 bg-white p-6 lg:p-12 flex items-center">
          <div className="w-full max-w-3xl mx-auto">
            <div className="mb-8">
              <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Cadastro de artista
              </span>

              <h2 className="font-editorial text-4xl lg:text-5xl leading-none">
                Comece seu portfólio.
              </h2>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Essas informações serão usadas para criar sua conta e iniciar
                seu perfil artístico dentro da plataforma.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Nome do artista / completo
                </label>

                <input
                  type="text"
                  placeholder="Como você quer ser chamado?"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Telefone / WhatsApp
                </label>

                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Tipo de usuário
                </label>

                <select
                  defaultValue="artista"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                >
                  <option value="artista">Artista</option>
                  <option value="galeria">Galeria</option>
                  <option value="colecionador">Colecionador</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Senha
                </label>

                <input
                  type="password"
                  placeholder="Crie uma senha"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Biografia inicial
                </label>

                <textarea
                  rows="3"
                  placeholder="Ex: Artista digital focado em surrealismo, ilustração e arte conceitual..."
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2 flex items-start gap-3 text-sm text-gray-500">
                <input
                  type="checkbox"
                  className="mt-1 accent-artOrange"
                  required
                />

                <p>
                  Li e concordo com os{" "}
                  <a href="#" className="text-artDark font-bold underline">
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a href="#" className="text-artDark font-bold underline">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </div>

              <div className="md:col-span-2 bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4">
                <h3 className="text-sm font-bold mb-1">
                  Próximo passo
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  Depois de criar sua conta, você será enviado para a tela de
                  login. Após entrar, o sistema abre o feed principal.
                </p>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-artDark text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                  Criar Conta
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>

                <p className="text-sm text-gray-500">
                  Já possui conta?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-artPurple hover:underline"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>

            <Link
              to="/"
              className="inline-block mt-7 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Voltar para início
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}