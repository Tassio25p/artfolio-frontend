import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const encomendas = [
  {
    id: 1,
    cliente: "Ricardo Aris",
    tipo: "Arte digital personalizada",
    descricao: "Solicitou uma arte abstrata em tons de azul para capa musical.",
    status: "Pendente",
    prazo: "7 dias",
    valor: "R$ 350,00",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    cliente: "Helena Matos",
    tipo: "Ilustração editorial",
    descricao: "Pedido de ilustração para campanha visual de marca autoral.",
    status: "Em andamento",
    prazo: "12 dias",
    valor: "R$ 620,00",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    cliente: "Lucas Ferreira",
    tipo: "Modelagem 3D",
    descricao: "Criação de objeto 3D decorativo para apresentação de produto.",
    status: "Finalizada",
    prazo: "Concluída",
    valor: "R$ 900,00",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
];

export default function Encomendas() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Área comercial
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Encomendas<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Acompanhe pedidos personalizados, negociações com clientes e
                oportunidades de venda dentro do Artfolio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/mensagens"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
              >
                <i className="fa-solid fa-message mr-2"></i>
                Ver mensagens
              </Link>

              <Link
                to="/meu-portfolio"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
              >
                Meu Portfólio
              </Link>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">12</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Encomendas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">4</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Pendentes
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">5</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Em andamento
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">R$ 3.8k</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Estimado
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Status
                </h2>

                <div className="space-y-2">
                  <button className="w-full bg-artDark text-white px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left">
                    Todas
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Pendentes
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Em andamento
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Finalizadas
                  </button>
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica comercial
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Responda rápido aos pedidos.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Clientes têm mais confiança quando recebem retorno claro sobre
                  prazo, valor e processo criativo.
                </p>

                <i className="fa-solid fa-handshake absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Pedidos recentes
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Solicitações de clientes
                    </h2>
                  </div>

                  <div className="relative w-full md:w-72">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

                    <input
                      type="text"
                      placeholder="Buscar encomenda..."
                      className="w-full bg-[#F9F8F6] rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {encomendas.map((item) => (
                    <article
                      key={item.id}
                      className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-artPurple shrink-0">
                            <img
                              src={item.avatar}
                              alt={item.cliente}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-base">
                                {item.cliente}
                              </h3>

                              <span
                                className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                  item.status === "Pendente"
                                    ? "bg-artOrange/10 text-artOrange"
                                    : item.status === "Em andamento"
                                    ? "bg-artBlue/10 text-artBlue"
                                    : "bg-artPurple/10 text-artPurple"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>

                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                              {item.tipo}
                            </p>

                            <p className="text-sm text-gray-500 mt-1 max-w-xl">
                              {item.descricao}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:w-56">
                          <div className="bg-white rounded-[1.2rem] p-3 border border-black/5">
                            <p className="font-black">{item.prazo}</p>
                            <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                              Prazo
                            </span>
                          </div>

                          <div className="bg-white rounded-[1.2rem] p-3 border border-black/5">
                            <p className="font-black">{item.valor}</p>
                            <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                              Valor
                            </span>
                          </div>
                        </div>

                        <div className="flex lg:flex-col gap-2">
                          <Link
                            to="/mensagens"
                            className="flex-1 text-center bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
                          >
                            Responder
                          </Link>

                          <button className="flex-1 bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:bg-artOrange hover:text-white transition-all">
                            Detalhes
                          </button>
                        </div>
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