import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const initialNotificacoes = [
  {
    id: 1,
    tipo: "moderacao",
    titulo: "Obra aprovada",
    descricao:
      "Sua obra Abstração em Tons de Púrpura foi aprovada pela moderação e já aparece no Feed.",
    tempo: "Agora",
    icone: "fa-solid fa-circle-check",
    cor: "text-artBlue",
    fundo: "bg-artBlue/10",
    lida: false,
    link: "/feed",
    acao: "Ver no feed",
  },
  {
    id: 2,
    tipo: "moderacao",
    titulo: "Obra recusada",
    descricao:
      "Sua obra Fragmentos de Vidro foi recusada por possível uso indevido de imagem ou direito autoral.",
    tempo: "15 min",
    icone: "fa-solid fa-triangle-exclamation",
    cor: "text-artOrange",
    fundo: "bg-artOrange/10",
    lida: false,
    link: "/meu-portfolio",
    acao: "Corrigir",
  },
  {
    id: 3,
    tipo: "denuncia",
    titulo: "Denúncia enviada",
    descricao:
      "Sua denúncia foi recebida e será analisada por um moderador ou administrador.",
    tempo: "40 min",
    icone: "fa-solid fa-flag",
    cor: "text-red-500",
    fundo: "bg-red-50",
    lida: false,
    link: "/notificacoes",
    acao: "Acompanhar",
  },
  {
    id: 4,
    tipo: "encomenda",
    titulo: "Nova solicitação de encomenda",
    descricao:
      "Ricardo Aris enviou uma solicitação de arte personalizada baseada em uma obra salva.",
    tempo: "1 h",
    icone: "fa-solid fa-handshake",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
    link: "/encomendas",
    acao: "Ver pedido",
  },
  {
    id: 5,
    tipo: "mensagem",
    titulo: "Mensagem recebida",
    descricao: "Helena Matos enviou uma nova mensagem sobre uma possível compra.",
    tempo: "Ontem",
    icone: "fa-solid fa-paper-plane",
    cor: "text-artDark",
    fundo: "bg-black/5",
    lida: true,
    link: "/mensagens",
    acao: "Responder",
  },
  {
    id: 6,
    tipo: "interacao",
    titulo: "Nova curtida recebida",
    descricao: "Marina Silva curtiu sua obra Ecos da Metrópole.",
    tempo: "2 dias",
    icone: "fa-solid fa-heart",
    cor: "text-artOrange",
    fundo: "bg-artOrange/10",
    lida: true,
    link: "/feed",
    acao: "Ver obra",
  },
  {
    id: 7,
    tipo: "seguidor",
    titulo: "Novo seguidor",
    descricao: "Gabriel Duarte começou a seguir seu perfil artístico.",
    tempo: "3 dias",
    icone: "fa-solid fa-user-plus",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
    link: "/seguidores",
    acao: "Ver seguidores",
  },
  {
    id: 8,
    tipo: "plano",
    titulo: "Recurso Pro ativo",
    descricao:
      "Sua conta possui acesso a recursos comerciais, estatísticas e destaque no Feed.",
    tempo: "1 semana",
    icone: "fa-solid fa-crown",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
    link: "/planos",
    acao: "Ver plano",
  },
];

export default function Notificacoes() {
  const [list, setList] = useState(initialNotificacoes);
  const [filter, setFilter] = useState("Todas");

  // Read action handlers
  const handleMarkAllRead = () => {
    setList(prev => prev.map(item => ({ ...item, lida: true })));
  };

  const handleMarkRead = (id) => {
    setList(prev => prev.map(item => item.id === id ? { ...item, lida: true } : item));
  };

  const handleClearHistory = () => {
    setList([]);
  };

  // Filter application
  const filteredList = list.filter(item => {
    if (filter === "Todas") return true;
    if (filter === "Moderação") return item.tipo === "moderacao";
    if (filter === "Denúncias") return item.tipo === "denuncia";
    if (filter === "Mensagens") return item.tipo === "mensagem";
    if (filter === "Encomendas") return item.tipo === "encomenda";
    if (filter === "Interações") return item.tipo === "interacao" || item.tipo === "seguidor";
    return true;
  });

  // Dinamic metrics calculation
  const total = list.length;
  const naoLidas = list.filter((item) => !item.lida).length;
  const moderacaoCount = list.filter((item) => item.tipo === "moderacao").length;
  const denunciasCount = list.filter((item) => item.tipo === "denuncia").length;

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

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed font-light">
                Acompanhe interações, mensagens, encomendas, análise de obras,
                denúncias e avisos importantes sobre sua conta no Artfolio.
              </p>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="bg-artDark text-white px-6 py-4 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-2"
            >
              <i className="fa-solid fa-check-double"></i>
              Marcar como lidas
            </button>
          </header>

          {/* Dinamic Count Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">{total}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Notificações
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">{naoLidas}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Não lidas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">{moderacaoCount}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Moderação
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm">
              <p className="text-2xl font-black">{denunciasCount}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Denúncias
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
                  Avisos de moderação
                </h2>

                <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed font-light">
                  Quando uma obra for aprovada, recusada ou uma denúncia for
                  analisada, o usuário será avisado por esta central de
                  notificações.
                </p>
              </div>
            </div>

            <Link
              to="/meu-portfolio"
              className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center whitespace-nowrap"
            >
              Ver portfólio
            </Link>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              {/* Categories filters */}
              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5 shadow-sm">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Filtros
                </h2>

                <div className="space-y-2">
                  {[
                    { id: "Todas", label: "Todas" },
                    { id: "Moderação", label: "Moderação" },
                    { id: "Denúncias", label: "Denúncias" },
                    { id: "Mensagens", label: "Mensagens" },
                    { id: "Encomendas", label: "Encomendas" },
                    { id: "Interações", label: "Interações" },
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

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden shadow-sm">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica Artfolio
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Fique atento às análises.
                </h3>

                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed font-light">
                  Obras pendentes ou recusadas exigem atenção. Corrigir a
                  publicação ajuda a manter seu portfólio ativo.
                </p>

                <i className="fa-solid fa-bell absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            {/* List Display */}
            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Histórico recente
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Atividades do perfil
                    </h2>
                  </div>

                  <button
                    onClick={handleClearHistory}
                    className="bg-[#F9F8F6] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all"
                  >
                    Limpar histórico
                  </button>
                </div>

                {filteredList.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-12 text-center text-gray-400 italic text-sm">
                    Nenhuma notificação encontrada nesta categoria.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredList.map((item) => (
                      <article
                        key={item.id}
                        onClick={() => handleMarkRead(item.id)}
                        className={`group rounded-[1.5rem] p-4 border transition-all flex flex-col md:flex-row md:items-start gap-4 cursor-pointer ${
                          item.lida
                            ? "bg-[#F9F8F6] border-black/5"
                            : "bg-white border-artPurple/20 shadow-md shadow-black/5 hover:border-artPurple"
                        } hover:shadow-lg hover:shadow-black/5`}
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

                          <p className="text-sm text-gray-500 mt-1 leading-relaxed font-light">
                            {item.descricao}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="bg-white border border-black/5 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-400">
                              {item.tipo}
                            </span>

                            {!item.lida && (
                              <span className="bg-artPurple/10 text-artPurple px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                Nova
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Link
                            to={item.link}
                            className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                          >
                            {item.acao}
                          </Link>

                          {!item.lida && (
                            <span className="w-2.5 h-2.5 rounded-full bg-artPurple shrink-0 animate-pulse"></span>
                          )}
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
    </div>
  );
}