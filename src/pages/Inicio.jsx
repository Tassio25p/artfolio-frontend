import React from "react";
import { Link } from "react-router-dom";

const obrasDestaque = [
  {
    titulo: "Fragmentos de Vidro",
    artista: "Marina Silva",
    categoria: "Pintura Digital",
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
  },
  {
    titulo: "Conexões de Algodão",
    artista: "Helena Matos",
    categoria: "Têxtil",
    imagem:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    titulo: "Ecos da Metrópole",
    artista: "Gabriel Duarte",
    categoria: "3D Art",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Inicio() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <header className="relative z-10 px-5 lg:px-10 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-editorial text-3xl font-black text-artOrange tracking-tight"
          >
            Artfolio
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <a href="#como-funciona" className="hover:text-artDark transition-colors">
              Como funciona
            </a>
            <a href="#obras" className="hover:text-artDark transition-colors">
              Obras
            </a>
            <Link to="/planos" className="hover:text-artDark transition-colors">
              Planos
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="bg-white border border-black/5 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
            >
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className="bg-artDark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-lg shadow-black/10"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen">
        <section className="px-5 lg:px-10 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
                Marketplace artístico digital
              </span>

              <h1 className="font-editorial text-5xl lg:text-7xl leading-none mb-5">
                Mostre sua arte para o{" "}
                <span className="italic text-artOrange">mundo.</span>
              </h1>

              <p className="text-gray-500 text-sm lg:text-base leading-relaxed max-w-2xl font-light">
                O Artfolio conecta artistas, colecionadores e admiradores em uma
                plataforma feita para publicar obras, montar portfólios,
                conversar com clientes e destacar talentos criativos.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/cadastro"
                  className="bg-artDark text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
                >
                  Criar meu portfólio
                </Link>

                <Link
                  to="/login"
                  className="bg-white border border-black/5 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all"
                >
                  Já tenho conta
                </Link>

                <Link
                  to="/feed"
                  className="bg-white border border-black/5 px-6 py-3.5 rounded-full text-sm font-bold text-artPurple hover:bg-artPurple hover:text-white transition-all"
                >
                  Explorar como visitante
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg">
                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black">1.2k</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Artistas
                  </span>
                </div>

                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black">8.5k</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Obras
                  </span>
                </div>

                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black">Pro</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Planos
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-white/70 border border-black/5 rounded-[1.7rem] p-4 max-w-2xl">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">
                  Caminho do usuário
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-500">
                  <div>
                    <strong className="text-artDark">1. Criar conta</strong>
                    <p className="mt-1">O artista se cadastra na plataforma.</p>
                  </div>

                  <div>
                    <strong className="text-artDark">2. Fazer login</strong>
                    <p className="mt-1">Depois entra no sistema pelo login.</p>
                  </div>

                  <div>
                    <strong className="text-artDark">3. Acessar o Feed</strong>
                    <p className="mt-1">Ao entrar, ele é direcionado para o feed.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="bg-white rounded-[2.5rem] p-4 border border-black/5 shadow-2xl shadow-black/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="rounded-[2rem] overflow-hidden h-[340px] lg:h-[450px]">
                    <img
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"
                      alt="Arte em destaque"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <span className="text-artPurple text-[10px] font-black uppercase tracking-widest">
                      Obra em destaque
                    </span>

                    <h2 className="font-editorial text-3xl italic leading-none mt-1">
                      Abstração em Tons de Púrpura
                    </h2>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-artPurple overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
                            alt="Artista"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span className="text-xs font-bold">Marina Silva</span>
                      </div>

                      <Link
                        to="/obra/1"
                        className="w-9 h-9 rounded-full bg-artDark text-white hover:bg-artPurple transition-all flex items-center justify-center"
                      >
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-4 top-8 bg-artOrange text-white rounded-2xl px-4 py-3 shadow-xl rotate-[-6deg] hidden md:block">
                  <p className="text-xl font-black">+40%</p>
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Engajamento
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="px-5 lg:px-10 pb-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-[2rem] p-6 border border-black/5">
              <div className="w-11 h-11 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center mb-5">
                <i className="fa-solid fa-user-plus"></i>
              </div>

              <h3 className="font-bold text-xl mb-2">Crie sua conta</h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                O usuário começa criando seu cadastro artístico para acessar os
                recursos principais da plataforma.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-black/5">
              <div className="w-11 h-11 rounded-2xl bg-artBlue/10 text-artBlue flex items-center justify-center mb-5">
                <i className="fa-solid fa-right-to-bracket"></i>
              </div>

              <h3 className="font-bold text-xl mb-2">Entre no sistema</h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Após o login, o usuário é levado para o feed, onde começa a
                navegação principal.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-black/5">
              <div className="w-11 h-11 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center mb-5">
                <i className="fa-solid fa-palette"></i>
              </div>

              <h3 className="font-bold text-xl mb-2">Publique e gerencie</h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Dentro do sistema, o artista pode publicar obras, editar perfil,
                conversar e acompanhar notificações.
              </p>
            </div>
          </div>
        </section>

        <section id="obras" className="px-5 lg:px-10 pb-10">
          <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] border border-black/5 p-5 lg:p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                  Curadoria recente
                </span>

                <h2 className="font-editorial text-3xl lg:text-4xl italic">
                  Obras que estão em alta.
                </h2>
              </div>

              <Link
                to="/feed"
                className="bg-[#F9F8F6] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all"
              >
                Ver Feed
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {obrasDestaque.map((obra) => (
                <article
                  key={obra.titulo}
                  className="group bg-[#F9F8F6] rounded-[1.7rem] overflow-hidden border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={obra.imagem}
                      alt={obra.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5">
                    <span className="text-artPurple text-[10px] font-black uppercase tracking-widest">
                      {obra.categoria}
                    </span>

                    <h3 className="font-editorial text-2xl italic leading-none mt-1 mb-4">
                      {obra.titulo}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">
                        {obra.artista}
                      </span>

                      <div className="flex gap-4 text-gray-400 text-sm">
                        <button className="hover:text-artOrange transition-colors">
                          <i className="fa-regular fa-heart"></i>
                        </button>

                        <button className="hover:text-artBlue transition-colors">
                          <i className="fa-regular fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 lg:px-10 pb-10">
          <div className="max-w-6xl mx-auto bg-artDark text-white rounded-[2.5rem] p-7 lg:p-8 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                Comece agora
              </span>

              <h2 className="font-editorial text-4xl lg:text-5xl italic leading-none mb-4">
                Transforme sua arte em presença digital.
              </h2>

              <p className="text-sm text-gray-400 leading-relaxed">
                Crie seu portfólio, publique suas obras e participe de uma
                comunidade feita para valorizar artistas independentes.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/cadastro"
                  className="bg-white text-artDark px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artPurple hover:text-white transition-all"
                >
                  Criar Conta
                </Link>

                <Link
                  to="/login"
                  className="border border-white/20 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-white hover:text-artDark transition-all"
                >
                  Fazer Login
                </Link>

                <Link
                  to="/planos"
                  className="border border-white/20 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-white hover:text-artDark transition-all"
                >
                  Conhecer Planos
                </Link>
              </div>
            </div>

            <i className="fa-solid fa-wand-magic-sparkles absolute -right-8 -bottom-12 text-[11rem] text-white/5 rotate-12"></i>
          </div>
        </section>
      </main>
    </div>
  );
}