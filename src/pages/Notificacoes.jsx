import React from "react";
import Sidebar from "../components/Sidebar";

const notificacoes = [
  {
    id: 1,
    tipo: "curtida",
    titulo: "Nova curtida recebida",
    descricao: "Marina Silva curtiu sua obra Fragmentos de Vidro.",
    tempo: "Agora",
    icone: "fa-solid fa-heart",
    cor: "text-artOrange",
    fundo: "bg-artOrange/10",
    lida: false,
  },
  {
    id: 2,
    tipo: "comentario",
    titulo: "Novo comentário",
    descricao: "Gabriel comentou em Abstração em Tons de Púrpura.",
    tempo: "12 min",
    icone: "fa-solid fa-comment",
    cor: "text-artBlue",
    fundo: "bg-artBlue/10",
    lida: false,
  },
  {
    id: 3,
    tipo: "seguidor",
    titulo: "Novo seguidor",
    descricao: "Helena Matos começou a seguir seu perfil artístico.",
    tempo: "1 h",
    icone: "fa-solid fa-user-plus",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
  },
  {
    id: 4,
    tipo: "mensagem",
    titulo: "Mensagem recebida",
    descricao: "Ricardo Aris enviou uma nova mensagem sobre encomendas.",
    tempo: "Ontem",
    icone: "fa-solid fa-paper-plane",
    cor: "text-artDark",
    fundo: "bg-black/5",
    lida: true,
  },
  {
    id: 5,
    tipo: "plano",
    titulo: "Obra em destaque",
    descricao: "Sua obra Ecos da Metrópole recebeu prioridade no feed global.",
    tempo: "2 dias",
    icone: "fa-solid fa-crown",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
  },
];

export default function Notificacoes() {
  const naoLidas = notificacoes.filter((item) => !item.lida).length;

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Central de atividades
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Notificações<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl">
                Acompanhe curtidas, comentários, mensagens e novidades
                importantes sobre seu portfólio artístico.
              </p>
            </div>

            <button className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10">
              <i className="fa-solid fa-check-double mr-2"></i>
              Marcar como lidas
            </button>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{notificacoes.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Notificações
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{naoLidas}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Não lidas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">5</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Hoje
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Filtros
                </h2>

                <div className="space-y-2">
                  <button className="w-full bg-artDark text-white px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left">
                    Todas
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Curtidas
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Comentários
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Mensagens
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Sistema
                  </button>
                </div>
              </div>

              <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica Artfolio
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Responda rápido às mensagens.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Interações rápidas aumentam as chances de fechar encomendas e
                  novas conexões.
                </p>

                <i className="fa-solid fa-bell absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Histórico recente
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Atividades do perfil
                    </h2>
                  </div>

                  <button className="bg-[#F9F8F6] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all">
                    Limpar histórico
                  </button>
                </div>

                <div className="space-y-3">
                  {notificacoes.map((item) => (
                    <article
                      key={item.id}
                      className={`group rounded-[1.5rem] p-4 border transition-all flex gap-4 items-start ${
                        item.lida
                          ? "bg-[#F9F8F6] border-black/5"
                          : "bg-white border-artPurple/20 shadow-lg shadow-black/5"
                      } hover:shadow-xl hover:shadow-black/5`}
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl ${item.fundo} ${item.cor} flex items-center justify-center shrink-0`}
                      >
                        <i className={item.icone}></i>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="font-bold text-sm">{item.titulo}</h3>

                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {item.tempo}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {item.descricao}
                        </p>
                      </div>

                      {!item.lida && (
                        <span className="w-2.5 h-2.5 rounded-full bg-artPurple mt-2 shrink-0"></span>
                      )}
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