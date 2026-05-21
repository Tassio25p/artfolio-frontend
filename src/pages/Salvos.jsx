import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const obrasSalvas = [
  {
    id: 1,
    titulo: "Abstração em Tons de Púrpura",
    artista: "Marina Silva",
    categoria: "Pintura Digital",
    preco: "R$ 350,00",
    statusVenda: "Disponível",
    salvoEm: "Salvo hoje",
    imagem:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    titulo: "Conexões de Algodão",
    artista: "Helena Matos",
    categoria: "Têxtil",
    preco: "Sob consulta",
    statusVenda: "Aceita encomenda",
    salvoEm: "Salvo ontem",
    imagem:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    titulo: "Ecos da Metrópole",
    artista: "Luan Rocha",
    categoria: "3D Art",
    preco: "R$ 620,00",
    statusVenda: "Disponível",
    salvoEm: "Salvo há 3 dias",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    titulo: "Fragmentos de Vidro",
    artista: "Gabriel Duarte",
    categoria: "Arte Conceitual",
    preco: "Indisponível",
    statusVenda: "Vendido",
    salvoEm: "Salvo há 1 semana",
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
  },
];

const statusClasses = {
  Disponível: "bg-artBlue/10 text-artBlue",
  "Aceita encomenda": "bg-artPurple/10 text-artPurple",
  Vendido: "bg-artOrange/10 text-artOrange",
};

function Salvos() {
  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Coleção pessoal
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Obras <span className="italic text-artOrange">Salvas.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Guarde obras de interesse para consultar depois, conversar com o
                artista, acompanhar disponibilidade ou solicitar uma encomenda.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/feed"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Feed
              </Link>

              <Link
                to="/buscar"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
              >
                Buscar Obras
              </Link>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{obrasSalvas.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Obras salvas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">3</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Disponíveis
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">1</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Vendida
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">2</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Artistas
              </span>
            </div>
          </section>

          <section className="bg-artPurple/5 border border-artPurple/10 rounded-[1.7rem] p-5 mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center shrink-0">
                <i className="fa-solid fa-bookmark"></i>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  Para comprar ou encomendar depois
                </h2>

                <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  As obras salvas funcionam como uma lista de interesse. Você
                  pode voltar nelas depois, falar com o artista ou acompanhar se
                  ainda estão disponíveis.
                </p>
              </div>
            </div>

            <Link
              to="/mensagens"
              className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
            >
              Ver conversas
            </Link>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Filtros
                </h2>

                <div className="space-y-2">
                  <button className="w-full bg-artDark text-white px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left">
                    Todas
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Disponíveis
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Aceita encomenda
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Vendidas
                  </button>
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Salve obras de interesse.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Use esta área para acompanhar obras que você deseja comprar,
                  negociar ou usar como referência para uma encomenda.
                </p>

                <i className="fa-solid fa-bookmark absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Lista de interesse
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Obras guardadas para depois
                    </h2>
                  </div>

                  <div className="relative w-full md:w-72">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

                    <input
                      type="text"
                      placeholder="Buscar obra salva..."
                      className="w-full bg-[#F9F8F6] rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {obrasSalvas.map((obra) => (
                    <article
                      key={obra.id}
                      className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 flex flex-col lg:flex-row gap-4 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                    >
                      <Link
                        to={`/obra/${obra.id}`}
                        className="w-full lg:w-44 h-44 lg:h-32 rounded-[1.4rem] overflow-hidden bg-gray-100 shrink-0"
                      >
                        <img
                          src={obra.imagem}
                          alt={obra.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-artPurple">
                              {obra.categoria}
                            </span>

                            <span
                              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                statusClasses[obra.statusVenda] ||
                                "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {obra.statusVenda}
                            </span>
                          </div>

                          <h3 className="font-bold text-xl leading-tight">
                            {obra.titulo}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Por <strong>{obra.artista}</strong> • {obra.salvoEm}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-5 text-xs text-gray-400 font-bold">
                          <span>
                            <i className="fa-solid fa-tag mr-1"></i>
                            {obra.preco}
                          </span>

                          <span>
                            <i className="fa-solid fa-bookmark mr-1"></i>
                            Salva para depois
                          </span>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-3 lg:justify-center">
                        <Link
                          to={`/obra/${obra.id}`}
                          className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-artDark text-white text-xs font-bold hover:bg-artPurple transition-all text-center"
                        >
                          Ver Obra
                        </Link>

                        <Link
                          to="/mensagens"
                          className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artBlue hover:text-white transition-all text-center"
                        >
                          Mensagem
                        </Link>

                        <button className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-white border border-black/5 text-xs font-bold text-gray-400 hover:bg-artOrange hover:text-white transition-all">
                          Remover
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Salvos;