import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const notificacoes = [
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
    link: "/obra/1",
    acao: "Ver obra",
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
    link: "/obra/3",
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
  const naoLidas = notificacoes.filter((item) => !item.lida).length;
  const moderacao = notificacoes.filter((item) => item.tipo === "moderacao").length;
  const denuncias = notificacoes.filter((item) => item.tipo === "denuncia").length;

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

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Acompanhe interações, mensagens, encomendas, análise de obras,
                denúncias e avisos importantes sobre sua conta no Artfolio.
              </p>
            </div>

            <button className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10">
              <i className="fa-solid fa-check-double mr-2"></i>
              Marcar como lidas
            </button>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <p className="text-2xl font-black">{moderacao}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Moderação
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{denuncias}</p>
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

                <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Quando uma obra for aprovada, recusada ou uma denúncia for
                  analisada, o usuário será avisado por esta central de
                  notificações.
                </p>
              </div>
            </div>

            <Link
              to="/meu-portfolio"
              className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
            >
              Ver portfólio
            </Link>
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
                    Moderação
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Denúncias
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Mensagens
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Encomendas
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Interações
                  </button>
                </div>
              </div>

              <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica Artfolio
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Fique atento às análises.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Obras pendentes ou recusadas exigem atenção. Corrigir a
                  publicação ajuda a manter seu portfólio ativo.
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
                      className={`group rounded-[1.5rem] p-4 border transition-all flex flex-col md:flex-row md:items-start gap-4 ${
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

                      <div className="flex items-center gap-3">
                        <Link
                          to={item.link}
                          className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                        >
                          {item.acao}
                        </Link>

                        {!item.lida && (
                          <span className="w-2.5 h-2.5 rounded-full bg-artPurple shrink-0"></span>
                        )}
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