import React from "react";
import Sidebar from "../components/Sidebar";

const obras = [
  {
    id: 1,
    titulo: "Abstração em Tons de Púrpura",
    categoria: "Pintura Digital",
    status: "Publicado",
    curtidas: 42,
    views: "1.2k",
    imagem:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
    destaque: true,
  },
  {
    id: 2,
    titulo: "Escultura Têxtil #02",
    categoria: "Têxtil",
    status: "Publicado",
    curtidas: 28,
    views: 840,
    imagem:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
    destaque: false,
  },
  {
    id: 3,
    titulo: "Fragmentos de Vidro",
    categoria: "Arte Conceitual",
    status: "Rascunho",
    curtidas: 0,
    views: 0,
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    destaque: false,
  },
];

function MeuPortfolio() {
  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Gerenciamento de Obras
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Meu <span className="italic text-artOrange">Portfólio.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl">
                Gerencie suas publicações, acompanhe o desempenho das suas obras
                e mantenha seu portfólio sempre atualizado.
              </p>
            </div>

            <button className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10">
              <i className="fa-solid fa-plus mr-2"></i>
              Nova Obra
            </button>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">48</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Obras
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">2.7k</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Visualizações
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">156</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Curtidas
              </span>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <h2 className="font-editorial text-3xl italic">Minhas Obras</h2>

              <div className="flex gap-3 overflow-x-auto pb-1">
                <button className="bg-artDark text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Todas
                </button>

                <button className="bg-[#F9F8F6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors">
                  Publicadas
                </button>

                <button className="bg-[#F9F8F6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors">
                  Rascunhos
                </button>

                <button className="bg-[#F9F8F6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors">
                  Destaques
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {obras.map((obra) => (
                <article
                  key={obra.id}
                  className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 flex flex-col lg:flex-row gap-4 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                >
                  <div className="w-full lg:w-44 h-44 lg:h-32 rounded-[1.4rem] overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={obra.imagem}
                      alt={obra.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-artPurple">
                          {obra.categoria}
                        </span>

                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                            obra.status === "Publicado"
                              ? "bg-artBlue/10 text-artBlue"
                              : "bg-artOrange/10 text-artOrange"
                          }`}
                        >
                          {obra.status}
                        </span>

                        {obra.destaque && (
                          <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-artPurple/10 text-artPurple">
                            Destaque
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-xl leading-tight">
                        {obra.titulo}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-xs text-gray-400 font-bold">
                      <span>
                        <i className="fa-regular fa-heart mr-1"></i>
                        {obra.curtidas} curtidas
                      </span>

                      <span>
                        <i className="fa-regular fa-eye mr-1"></i>
                        {obra.views} views
                      </span>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 lg:justify-center">
                    <button className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artDark hover:text-white transition-all">
                      <i className="fa-solid fa-pen mr-2"></i>
                      Editar
                    </button>

                    <button className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-white border border-black/5 text-xs font-bold text-gray-400 hover:bg-artOrange hover:text-white transition-all">
                      <i className="fa-solid fa-trash mr-2"></i>
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MeuPortfolio;