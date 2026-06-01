import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const defaultEncomendas = [
  {
    id: 1,
    cliente: "Ricardo Aris",
    tipo: "Arte digital personalizada",
    descricao: "Solicitou uma arte abstrata em tons de azul para capa musical de projeto autoral.",
    status: "Pendente",
    prazo: "7 dias",
    valor: "R$ 350,00",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    cliente: "Helena Matos",
    tipo: "Ilustração editorial",
    descricao: "Pedido de ilustração comercial para campanha visual de marca de cosméticos sustentáveis.",
    status: "Em andamento",
    prazo: "12 dias",
    valor: "R$ 620,00",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    cliente: "Lucas Ferreira",
    tipo: "Modelagem 3D",
    descricao: "Criação de objeto 3D decorativo realista para apresentação digital de produto.",
    status: "Finalizada",
    prazo: "Concluída",
    valor: "R$ 900,00",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
];

export default function Encomendas() {
  const [encomendasList, setEncomendasList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("Todas");

  // Load from localStorage or initialize with default
  useEffect(() => {
    const saved = localStorage.getItem("artfolio_encomendas");
    if (saved) {
      setEncomendasList(JSON.parse(saved));
    } else {
      localStorage.setItem("artfolio_encomendas", JSON.stringify(defaultEncomendas));
      setEncomendasList(defaultEncomendas);
    }
  }, []);

  // Update order status inside Encomendas screen
  const handleUpdateStatus = (id, newStatus) => {
    const updated = encomendasList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          prazo: newStatus === "Finalizada" ? "Concluída" : item.prazo
        };
      }
      return item;
    });

    setEncomendasList(updated);
    localStorage.setItem("artfolio_encomendas", JSON.stringify(updated));

    // Update selectedOrder if open
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => ({
        ...prev,
        status: newStatus,
        prazo: newStatus === "Finalizada" ? "Concluída" : prev.prazo
      }));
    }
  };

  // Filter encomendas
  const filteredEncomendas = encomendasList.filter((item) => {
    if (filter === "Todas") return true;
    return item.status.toLowerCase() === filter.toLowerCase();
  });

  // Calculate statistics dynamically based on current list state
  const total = encomendasList.length;
  const pendentes = encomendasList.filter((item) => item.status === "Pendente").length;
  const emAndamento = encomendasList.filter((item) => item.status === "Em andamento").length;
  const faturamentoEstimado = encomendasList
    .filter((item) => item.status !== "Recusada")
    .reduce((acc, curr) => {
      const val = parseFloat(curr.valor.replace("R$ ", "").replace(",", "."));
      return acc + val;
    }, 0);

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

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed font-light">
                Acompanhe pedidos personalizados, negociações com clientes e
                oportunidades de venda dentro do Artfolio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/mensagens"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all shadow-sm"
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

          {/* Dinamic Statistics */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">{total}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Encomendas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">{pendentes}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Pendentes
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">{emAndamento}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Em andamento
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">R$ {faturamentoEstimado.toFixed(2).replace(".", ",")}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Ativo / Concluído
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              {/* Filter Sidebar */}
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Status
                </h2>

                <div className="space-y-2">
                  {[
                    { id: "Todas", label: "Todas" },
                    { id: "Pendente", label: "Pendentes" },
                    { id: "Em andamento", label: "Em andamento" },
                    { id: "Finalizada", label: "Finalizadas" },
                    { id: "Recusada", label: "Recusadas" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilter(btn.id)}
                      className={`w-full px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-all ${
                        filter === btn.id
                          ? "bg-artDark text-white shadow-md shadow-black/10"
                          : "bg-[#F9F8F6] text-gray-400 hover:text-artDark hover:bg-[#eae7df]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica comercial
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Responda rápido aos pedidos.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed font-light">
                  Clientes têm mais confiança quando recebem retorno claro sobre
                  prazo, valor e processo criativo.
                </p>

                <i className="fa-solid fa-handshake absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            {/* List Section */}
            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Pedidos recentes
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Solicitações de clientes
                    </h2>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F9F8F6] px-4 py-2 rounded-full">
                    {filteredEncomendas.length} listadas
                  </span>
                </div>

                {filteredEncomendas.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-12 text-center text-gray-400 italic text-sm">
                    Nenhuma encomenda nesta categoria.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEncomendas.map((item) => (
                      <article
                        key={item.id}
                        className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-artPurple shrink-0 border-2 border-white shadow">
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
                                      : item.status === "Finalizada"
                                      ? "bg-artPurple/10 text-artPurple"
                                      : "bg-red-50 text-red-500"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>

                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {item.tipo}
                              </p>

                              <p className="text-xs text-gray-500 mt-1 max-w-xl font-light">
                                {item.descricao.slice(0, 80)}...
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 lg:w-56">
                            <div className="bg-white rounded-[1.2rem] p-3 border border-black/5">
                              <p className="font-black text-xs leading-none">{item.prazo}</p>
                              <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                                Prazo
                              </span>
                            </div>

                            <div className="bg-white rounded-[1.2rem] p-3 border border-black/5">
                              <p className="font-black text-xs leading-none">{item.valor}</p>
                              <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                                Valor
                              </span>
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2 shrink-0">
                            <Link
                              to="/mensagens"
                              state={{ activeOrder: item }}
                              className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all text-center"
                            >
                              Responder
                            </Link>

                            <button
                              onClick={() => {
                                setSelectedOrder(item);
                                setIsModalOpen(true);
                              }}
                              className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:bg-artOrange hover:text-white transition-all"
                            >
                              Detalhes
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </section>
        </div>
      </main>

      {/* Detail Modal (eliminating redundancy) */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 border border-black/5 shadow-2xl relative overflow-hidden animate-scale-up">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-artDark text-lg transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-[1.3rem] overflow-hidden bg-artPurple shrink-0 border-2 border-[#F9F8F6]">
                <img
                  src={selectedOrder.avatar}
                  alt={selectedOrder.cliente}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-artOrange font-bold tracking-widest uppercase text-[9px] block">Solicitação de Encomenda</span>
                <h3 className="font-editorial text-2xl leading-none mt-1">{selectedOrder.cliente}</h3>
                <p className="text-xs text-gray-400 mt-1">{selectedOrder.tipo}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-[#F9F8F6] rounded-2xl p-4 border border-black/5">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Descrição Detalhada</p>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{selectedOrder.descricao}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#F9F8F6] p-3 rounded-xl border border-black/5">
                  <p className="font-black text-sm">{selectedOrder.valor}</p>
                  <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Valor</span>
                </div>
                <div className="bg-[#F9F8F6] p-3 rounded-xl border border-black/5">
                  <p className="font-black text-sm">{selectedOrder.prazo}</p>
                  <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Prazo</span>
                </div>
                <div className="bg-[#F9F8F6] p-3 rounded-xl border border-black/5">
                  <p className="font-black text-sm text-artPurple">{selectedOrder.status}</p>
                  <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Status</span>
                </div>
              </div>
            </div>

            {/* Actions Inside Modal */}
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedOrder.status === "Pendente" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Em andamento")}
                    className="flex-1 bg-artDark text-white py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-check"></i>
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Recusada")}
                    className="flex-1 bg-red-50 text-red-500 py-3 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-xmark"></i>
                    Recusar
                  </button>
                </>
              )}

              {selectedOrder.status === "Em andamento" && (
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "Finalizada")}
                  className="w-full bg-artPurple text-white py-3 rounded-full text-xs font-bold hover:bg-artDark transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-circle-check"></i>
                  Concluir Encomenda
                </button>
              )}

              {selectedOrder.status === "Finalizada" && (
                <div className="w-full bg-artPurple/5 text-artPurple text-center p-3 rounded-2xl border border-artPurple/10 text-xs font-medium">
                  <i className="fa-solid fa-circle-check mr-1.5"></i>
                  Esta encomenda foi finalizada!
                </div>
              )}

              {selectedOrder.status === "Recusada" && (
                <div className="w-full bg-red-50 text-red-500 text-center p-3 rounded-2xl border border-red-100 text-xs font-medium">
                  <i className="fa-solid fa-circle-xmark mr-1.5"></i>
                  Esta encomenda foi recusada.
                </div>
              )}

              <Link
                to="/mensagens"
                state={{ activeOrder: selectedOrder }}
                className="bg-white border border-black/10 text-artDark hover:bg-[#F9F8F6] px-6 py-3 rounded-full text-xs font-bold text-center flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
              >
                <i className="fa-solid fa-message"></i>
                Conversar
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}