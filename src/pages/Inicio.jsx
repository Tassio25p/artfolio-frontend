import React, { useState } from "react";
import { Link } from "react-router-dom";

const obrasDestaque = [
  {
    id: 1,
    titulo: "Fragmentos de Vidro",
    artista: "Marina Silva",
    categoria: "Pintura Digital",
    status: "Aprovada",
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    titulo: "Conexões de Algodão",
    artista: "Helena Matos",
    categoria: "Têxtil",
    status: "Aprovada",
    imagem:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    titulo: "Ecos da Metrópole",
    artista: "Gabriel Duarte",
    categoria: "3D Art",
    status: "Aprovada",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
];

const perfis = [
  {
    titulo: "Visitante",
    descricao:
      "Pode conhecer a plataforma, explorar obras públicas e visualizar perfis artísticos.",
    icone: "fa-solid fa-eye",
    cor: "text-artBlue",
    fundo: "bg-artBlue/10",
  },
  {
    titulo: "Cliente",
    descricao:
      "Pode salvar obras, conversar com artistas, solicitar encomendas e acompanhar interações.",
    icone: "fa-solid fa-user",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
  },
  {
    titulo: "Artista",
    descricao:
      "Pode criar portfólio, publicar obras, receber encomendas e acompanhar estatísticas.",
    icone: "fa-solid fa-palette",
    cor: "text-artOrange",
    fundo: "bg-artOrange/10",
  },
];

export default function Inicio() {
  const [noticeMessage, setNoticeMessage] = useState("");

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleAcaoFutura = () => {
    mostrarAviso(
      "Essa interação será integrada futuramente ao login e ao backend."
    );
  };

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
            <a
              href="#como-funciona"
              className="hover:text-artDark transition-colors"
            >
              Como funciona
            </a>

            <a href="#perfis" className="hover:text-artDark transition-colors">
              Perfis
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
        {noticeMessage && (
          <section className="px-5 lg:px-10 mb-4">
            <div className="max-w-6xl mx-auto bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          </section>
        )}

        <section className="px-5 lg:px-10 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
                Plataforma artística digital
              </span>

              <h1 className="font-editorial text-5xl lg:text-7xl leading-none mb-5">
                Mostre sua arte para o{" "}
                <span className="italic text-artOrange">mundo.</span>
              </h1>

              <p className="text-gray-500 text-sm lg:text-base leading-relaxed max-w-2xl font-light">
                O Artfolio conecta artistas, clientes e admiradores em uma
                plataforma feita para publicar obras, montar portfólios,
                conversar, solicitar encomendas e valorizar talentos criativos.
              </p>

              <p className="text-xs text-gray-400 mt-3 max-w-2xl leading-relaxed">
                A plataforma não intermedia pagamentos entre comprador e artista.
                O contato e a negociação acontecem diretamente entre as partes.
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-lg">
                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black">120+</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Artistas
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Prévia visual
                  </p>
                </div>

                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black">500+</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Obras
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Aprovadas
                  </p>
                </div>

                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black">3</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Planos
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Free, Premium e Pro
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-white/70 border border-black/5 rounded-[1.7rem] p-4 max-w-2xl">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">
                  Fluxo principal do artista
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm text-gray-500">
                  <div>
                    <strong className="text-artDark">1. Criar conta</strong>
                    <p className="mt-1">O artista se cadastra na plataforma.</p>
                  </div>

                  <div>
                    <strong className="text-artDark">2. Publicar obra</strong>
                    <p className="mt-1">A obra é enviada para análise.</p>
                  </div>

                  <div>
                    <strong className="text-artDark">3. Moderação</strong>
                    <p className="mt-1">A obra entra em quarentena.</p>
                  </div>

                  <div>
                    <strong className="text-artDark">4. Feed público</strong>
                    <p className="mt-1">Só aparece após aprovação.</p>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-artPurple text-[10px] font-black uppercase tracking-widest">
                        Obra em destaque
                      </span>

                      <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                        Aprovada
                      </span>
                    </div>

                    <h2 className="font-editorial text-3xl italic leading-none mt-2">
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
                  <p className="text-xl font-black">OK</p>
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Moderada
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
                O usuário cria uma conta e escolhe como pretende usar a
                plataforma: cliente, artista ou outro perfil permitido.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-black/5">
              <div className="w-11 h-11 rounded-2xl bg-artBlue/10 text-artBlue flex items-center justify-center mb-5">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <h3 className="font-bold text-xl mb-2">Moderação antes do feed</h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Obras publicadas passam por análise. Apenas conteúdos aprovados
                aparecem no feed e no perfil público.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-black/5">
              <div className="w-11 h-11 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center mb-5">
                <i className="fa-solid fa-comments"></i>
              </div>

              <h3 className="font-bold text-xl mb-2">Converse e encomende</h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Clientes podem conversar com artistas e solicitar encomendas. A
                negociação acontece diretamente entre eles.
              </p>
            </div>
          </div>
        </section>

        <section id="perfis" className="px-5 lg:px-10 pb-8">
          <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] border border-black/5 p-5 lg:p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                  Tipos de usuários
                </span>

                <h2 className="font-editorial text-3xl lg:text-4xl italic">
                  Cada perfil tem uma experiência.
                </h2>
              </div>

              <Link
                to="/cadastro"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all text-center"
              >
                Criar conta
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {perfis.map((perfil) => (
                <article
                  key={perfil.titulo}
                  className="bg-[#F9F8F6] rounded-[1.7rem] p-5 border border-black/5"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${perfil.fundo} ${perfil.cor} flex items-center justify-center mb-5`}
                  >
                    <i className={perfil.icone}></i>
                  </div>

                  <h3 className="font-bold text-xl mb-2">{perfil.titulo}</h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {perfil.descricao}
                  </p>
                </article>
              ))}
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
                  Obras aprovadas em destaque.
                </h2>

                <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                  A landing exibe apenas uma prévia visual. No sistema real, as
                  obras virão do backend após aprovação da moderação.
                </p>
              </div>

              <Link
                to="/feed"
                className="bg-[#F9F8F6] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all text-center"
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
                  <Link to={`/obra/${obra.id}`} className="block h-52 overflow-hidden">
                    <img
                      src={obra.imagem}
                      alt={obra.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="text-artPurple text-[10px] font-black uppercase tracking-widest">
                        {obra.categoria}
                      </span>

                      <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                        {obra.status}
                      </span>
                    </div>

                    <h3 className="font-editorial text-2xl italic leading-none mt-1 mb-4">
                      {obra.titulo}
                    </h3>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-gray-500">
                        {obra.artista}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAcaoFutura}
                          className="w-9 h-9 rounded-full bg-white border border-black/5 text-gray-400 hover:text-artOrange hover:bg-artOrange/10 transition-colors"
                        >
                          <i className="fa-regular fa-heart"></i>
                        </button>

                        <button
                          type="button"
                          onClick={handleAcaoFutura}
                          className="w-9 h-9 rounded-full bg-white border border-black/5 text-gray-400 hover:text-artBlue hover:bg-artBlue/10 transition-colors"
                        >
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
                Crie seu portfólio, publique suas obras, passe pelo processo de
                moderação e participe de uma comunidade feita para valorizar
                artistas independentes.
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