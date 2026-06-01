import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const seguidores = [
  {
    id: 1,
    nome: "Gabriel Duarte",
    area: "Arte Têxtil",
    cidade: "Curitiba, PR",
    seguidores: "840",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    seguindo: true,
  },
  {
    id: 2,
    nome: "Helena Matos",
    area: "Ilustração Digital",
    cidade: "São Paulo, SP",
    seguidores: "1.5k",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    seguindo: false,
  },
  {
    id: 3,
    nome: "Ricardo Aris",
    area: "Pintura Conceitual",
    cidade: "Belo Horizonte, MG",
    seguidores: "620",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    seguindo: false,
  },
  {
    id: 4,
    nome: "Luan Rocha",
    area: "Modelagem 3D",
    cidade: "Rio de Janeiro, RJ",
    seguidores: "2.1k",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    seguindo: true,
  },
  {
    id: 5,
    nome: "Camila Torres",
    area: "Arte Digital",
    cidade: "Campinas, SP",
    seguidores: "970",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    seguindo: false,
  },
];

export default function Seguidores() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Comunidade artística
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Seguidores<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Veja quem acompanha seu trabalho, descubra novas conexões e
                fortaleça sua presença dentro do Artfolio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/perfil"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Perfil
              </Link>

              <Link
                to="/seguindo"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
              >
                Ver Seguindo
              </Link>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">1.2k</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Seguidores
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">320</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Seguindo
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">48</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Obras
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Filtros
                </h2>

                <div className="space-y-2">
                  <button className="w-full bg-artDark text-white px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left">
                    Todos
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Artistas
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Galerias
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Colecionadores
                  </button>
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica de conexão
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Interaja com quem acompanha você.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Responder mensagens, seguir de volta e comentar obras ajuda a
                  criar uma comunidade mais forte.
                </p>

                <i className="fa-solid fa-users absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Lista de conexões
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Pessoas que seguem você
                    </h2>
                  </div>

                  <div className="relative w-full md:w-72">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

                    <input
                      type="text"
                      placeholder="Buscar seguidor..."
                      className="w-full bg-[#F9F8F6] rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {seguidores.map((seguidor) => (
                    <article
                      key={seguidor.id}
                      className="group bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-artPurple shrink-0">
                          <img
                            src={seguidor.avatar}
                            alt={seguidor.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-bold text-base">
                            {seguidor.nome}
                          </h3>

                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {seguidor.area}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            <i className="fa-solid fa-location-dot mr-1 text-artPurple"></i>
                            {seguidor.cidade}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-xs text-gray-400 font-bold">
                        <span>
                          <i className="fa-solid fa-users mr-1"></i>
                          {seguidor.seguidores} seguidores
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                            seguidor.seguindo
                              ? "bg-white border border-black/5 text-gray-400 hover:bg-artOrange hover:text-white"
                              : "bg-artDark text-white hover:bg-artPurple"
                          }`}
                        >
                          {seguidor.seguindo ? "Seguindo" : "Seguir de volta"}
                        </button>

                        <Link
                          to="/mensagens"
                          className="px-4 py-2.5 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artBlue hover:text-white transition-all"
                        >
                          Mensagem
                        </Link>
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