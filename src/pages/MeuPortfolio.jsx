import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const obras = [
  {
    id: 1,
    titulo: "Abstração em Tons de Púrpura",
    categoria: "Pintura Digital",
    status: "Aprovada",
    curtidas: 42,
    views: "1.2k",
    imagem:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
    destaque: true,
    motivoRecusa: null,
  },
  {
    id: 2,
    titulo: "Escultura Têxtil #02",
    categoria: "Têxtil",
    status: "Pendente",
    curtidas: 0,
    views: 0,
    imagem:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
    destaque: false,
    motivoRecusa: null,
  },
  {
    id: 3,
    titulo: "Fragmentos de Vidro",
    categoria: "Arte Conceitual",
    status: "Recusada",
    curtidas: 0,
    views: 0,
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    destaque: false,
    motivoRecusa:
      "A obra aparenta conter elemento protegido por direitos autorais ou sem comprovação de autoria.",
  },
  {
    id: 4,
    titulo: "Estudo de Formas",
    categoria: "Ilustração",
    status: "Rascunho",
    curtidas: 0,
    views: 0,
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    destaque: false,
    motivoRecusa: null,
  },
];

const statusClasses = {
  Aprovada: "bg-artBlue/10 text-artBlue",
  Pendente: "bg-artOrange/10 text-artOrange",
  Recusada: "bg-red-50 text-red-500",
  Rascunho: "bg-gray-100 text-gray-400",
};

function MeuPortfolio() {
  const totalAprovadas = obras.filter((obra) => obra.status === "Aprovada").length;
  const totalPendentes = obras.filter((obra) => obra.status === "Pendente").length;
  const totalRecusadas = obras.filter((obra) => obra.status === "Recusada").length;

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
                Acompanhe suas obras, veja o status de moderação e gerencie o
                que aparece no Feed e no seu perfil público.
              </p>
            </div>

            <Link
              to="/criar-obra"
              className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Nova Obra
            </Link>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{obras.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Obras
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalAprovadas}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Aprovadas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalPendentes}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Pendentes
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalRecusadas}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Recusadas
              </span>
            </div>
          </section>

          <section className="bg-artOrange/5 border border-artOrange/10 rounded-[1.7rem] p-5 mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  Moderação de conteúdo
                </h2>

                <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Obras enviadas ficam pendentes até serem avaliadas. Apenas
                  obras aprovadas aparecem no Feed e no perfil público.
                </p>
              </div>
            </div>

            <Link
              to="/admin"
              className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
            >
              Ver processo
            </Link>
          </section>

          <section className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <h2 className="font-editorial text-3xl italic">Minhas Obras</h2>

              <div className="flex gap-3 overflow-x-auto pb-1">
                <button className="bg-artDark text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Todas
                </button>

                <button className="bg-[#F9F8F6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors">
                  Aprovadas
                </button>

                <button className="bg-[#F9F8F6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors">
                  Pendentes
                </button>

                <button className="bg-[#F9F8F6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors">
                  Recusadas
                </button>

                <button className="bg-[#F9F8F6] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors">
                  Rascunhos
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {obras.map((obra) => (
                <article
                  key={obra.id}
                  className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 flex flex-col lg:flex-row gap-4 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                >
                  <div className="relative w-full lg:w-44 h-44 lg:h-32 rounded-[1.4rem] overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={obra.imagem}
                      alt={obra.titulo}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        obra.status === "Recusada" ? "grayscale opacity-70" : ""
                      }`}
                    />

                    {obra.status !== "Aprovada" && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="bg-white/90 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                          {obra.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-artPurple">
                          {obra.categoria}
                        </span>

                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                            statusClasses[obra.status] || "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {obra.status}
                        </span>

                        {obra.destaque && obra.status === "Aprovada" && (
                          <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-artPurple/10 text-artPurple">
                            Destaque
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-xl leading-tight">
                        {obra.titulo}
                      </h3>

                      {obra.status === "Pendente" && (
                        <p className="text-sm text-artOrange mt-2 font-medium">
                          <i className="fa-solid fa-clock mr-1"></i>
                          Aguardando análise da moderação.
                        </p>
                      )}

                      {obra.status === "Recusada" && (
                        <div className="mt-3 bg-red-50 border border-red-100 rounded-[1.2rem] p-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
                            Motivo da recusa
                          </p>

                          <p className="text-sm text-gray-500 leading-relaxed">
                            {obra.motivoRecusa}
                          </p>
                        </div>
                      )}
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
                    <Link
                      to={`/editar-obra/${obra.id}`}
                      className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                    >
                      <i className="fa-solid fa-pen mr-2"></i>
                      Editar
                    </Link>

                    {obra.status === "Aprovada" && (
                      <Link
                        to={`/obra/${obra.id}`}
                        className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artBlue hover:text-white transition-all text-center"
                      >
                        <i className="fa-solid fa-eye mr-2"></i>
                        Ver
                      </Link>
                    )}

                    {obra.status === "Recusada" && (
                      <Link
                        to={`/editar-obra/${obra.id}`}
                        className="flex-1 lg:flex-none px-5 py-3 rounded-full bg-artOrange text-white text-xs font-bold hover:bg-artDark transition-all text-center"
                      >
                        Corrigir
                      </Link>
                    )}

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