import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const notificacoesBase = [
  {
    id: 1,
    usuarios: ["artista"],
    tipo: "moderacao",
    titulo: "Obra aprovada",
    descricao:
      "Sua obra Abstração em Tons de Púrpura foi aprovada pela moderação e já pode aparecer no Feed.",
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
    usuarios: ["artista"],
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
    usuarios: ["cliente", "artista"],
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
    usuarios: ["artista"],
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
    usuarios: ["cliente", "artista"],
    tipo: "mensagem",
    titulo: "Mensagem recebida",
    descricao:
      "Helena Matos enviou uma nova mensagem sobre uma possível encomenda.",
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
    usuarios: ["artista"],
    tipo: "interacao",
    titulo: "Nova curtida recebida",
    descricao: "Um usuário curtiu sua obra Ecos da Metrópole.",
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
    usuarios: ["artista"],
    tipo: "interacao",
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
    usuarios: ["cliente"],
    tipo: "encomenda",
    titulo: "Encomenda em andamento",
    descricao:
      "A artista Marina Silva aceitou sua solicitação de arte personalizada.",
    tempo: "Agora",
    icone: "fa-solid fa-clock",
    cor: "text-artBlue",
    fundo: "bg-artBlue/10",
    lida: false,
    link: "/encomendas",
    acao: "Acompanhar",
  },
  {
    id: 9,
    usuarios: ["cliente"],
    tipo: "interacao",
    titulo: "Artista respondeu",
    descricao:
      "Você recebeu uma resposta sobre uma obra salva no seu perfil.",
    tempo: "2 h",
    icone: "fa-solid fa-reply",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
    link: "/mensagens",
    acao: "Ver conversa",
  },
  {
    id: 10,
    usuarios: ["moderador", "admin"],
    tipo: "moderacao",
    titulo: "Nova obra na quarentena",
    descricao:
      "Uma nova obra foi enviada para análise e aguarda decisão da moderação.",
    tempo: "Agora",
    icone: "fa-solid fa-shield-halved",
    cor: "text-artOrange",
    fundo: "bg-artOrange/10",
    lida: false,
    link: "/admin",
    acao: "Analisar",
  },
  {
    id: 11,
    usuarios: ["moderador", "admin"],
    tipo: "denuncia",
    titulo: "Nova denúncia aberta",
    descricao:
      "Uma denúncia de possível plágio foi enviada para análise.",
    tempo: "25 min",
    icone: "fa-solid fa-flag",
    cor: "text-red-500",
    fundo: "bg-red-50",
    lida: false,
    link: "/admin",
    acao: "Ver denúncia",
  },
  {
    id: 12,
    usuarios: ["admin"],
    tipo: "sistema",
    titulo: "Usuário sinalizado",
    descricao:
      "Um perfil recebeu múltiplas denúncias e entrou em monitoramento administrativo.",
    tempo: "1 h",
    icone: "fa-solid fa-user-shield",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
    link: "/admin",
    acao: "Revisar",
  },
  {
    id: 13,
    usuarios: ["artista"],
    tipo: "plano",
    titulo: "Recurso Pro disponível",
    descricao:
      "Recursos comerciais, estatísticas e destaque no Feed estarão ligados ao sistema de planos.",
    tempo: "1 semana",
    icone: "fa-solid fa-crown",
    cor: "text-artPurple",
    fundo: "bg-artPurple/10",
    lida: true,
    link: "/planos",
    acao: "Ver plano",
  },
];

const filtros = [
  { id: "Todas", label: "Todas" },
  { id: "Moderação", label: "Moderação" },
  { id: "Denúncias", label: "Denúncias" },
  { id: "Mensagens", label: "Mensagens" },
  { id: "Encomendas", label: "Encomendas" },
  { id: "Interações", label: "Interações" },
  { id: "Sistema", label: "Sistema" },
];

function getPapelLabel(tipoUsuario) {
  if (tipoUsuario === "artista") return "Artista";
  if (tipoUsuario === "cliente") return "Cliente";
  if (tipoUsuario === "moderador") return "Moderador";
  if (tipoUsuario === "admin") return "Administrador";
  return "Usuário";
}

export default function Notificacoes() {
  const [filter, setFilter] = useState("Todas");
  const [noticeMessage, setNoticeMessage] = useState("");

  const tipoUsuario = "cliente"; // Simulação de tipo de usuário logado - pode ser "artista", "cliente", "moderador" ou "admin"

  const notificacoesDoUsuario = notificacoesBase.filter((item) =>
    item.usuarios.includes(tipoUsuario)
  );

  const filteredList = notificacoesDoUsuario.filter((item) => {
    if (filter === "Todas") return true;
    if (filter === "Moderação") return item.tipo === "moderacao";
    if (filter === "Denúncias") return item.tipo === "denuncia";
    if (filter === "Mensagens") return item.tipo === "mensagem";
    if (filter === "Encomendas") return item.tipo === "encomenda";
    if (filter === "Interações") {
      return item.tipo === "interacao" || item.tipo === "seguidor";
    }
    if (filter === "Sistema") {
      return item.tipo === "sistema" || item.tipo === "plano";
    }

    return true;
  });

  const total = notificacoesDoUsuario.length;
  const naoLidas = notificacoesDoUsuario.filter((item) => !item.lida).length;
  const moderacaoCount = notificacoesDoUsuario.filter(
    (item) => item.tipo === "moderacao"
  ).length;
  const denunciasCount = notificacoesDoUsuario.filter(
    (item) => item.tipo === "denuncia"
  ).length;

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleAcaoFutura = (mensagem) => {
    mostrarAviso(mensagem);
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Central de atividades
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Notificações<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed font-light">
                Acompanhe interações, mensagens, encomendas, análise de obras,
                denúncias e avisos importantes sobre sua conta no Artfolio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <span className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold text-center">
                <i className="fa-solid fa-user mr-2 text-artPurple"></i>
                Papel: {getPapelLabel(tipoUsuario)}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleAcaoFutura(
                    "A ação real de marcar notificações como lidas será integrada ao backend."
                  )
                }
                className="bg-artDark text-white px-6 py-4 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check-double"></i>
                Marcar como lidas
              </button>
            </div>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  Notificações ligadas ao fluxo real do Artfolio
                </h2>

                <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed font-light">
                  A central receberá avisos de obras aprovadas, recusadas,
                  encomendas, mensagens, denúncias, seguidores e ações
                  administrativas quando o backend estiver integrado.
                </p>
              </div>
            </div>

            <Link
              to={
                tipoUsuario === "moderador" || tipoUsuario === "admin"
                  ? "/admin"
                  : "/meu-portfolio"
              }
              className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center whitespace-nowrap"
            >
              {tipoUsuario === "moderador" || tipoUsuario === "admin"
                ? "Ver moderação"
                : "Ver portfólio"}
            </Link>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5 shadow-sm">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Filtros
                </h2>

                <div className="space-y-2">
                  {filtros.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
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

              <div className="bg-artBlue/5 border border-artBlue/10 rounded-[1.7rem] p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">
                  Integração futura
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  As notificações reais serão carregadas pelo backend conforme o
                  usuário logado, seu papel no sistema e suas permissões.
                </p>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6 shadow-sm">
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
                    type="button"
                    onClick={() =>
                      handleAcaoFutura(
                        "A limpeza real do histórico será integrada ao backend."
                      )
                    }
                    className="bg-[#F9F8F6] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all"
                  >
                    Limpar histórico
                  </button>
                </div>

                {filteredList.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 sm:p-12 text-center">
                    <i className="fa-solid fa-bell-slash text-4xl text-gray-200 mb-4"></i>

                    <h3 className="font-editorial text-3xl italic">
                      Nenhuma notificação.
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Não existem notificações nessa categoria para este tipo de
                      usuário.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredList.map((item) => (
                      <NotificacaoCard
                        key={item.id}
                        item={item}
                        onMarcarLida={() =>
                          handleAcaoFutura(
                            "A leitura real da notificação será atualizada no backend."
                          )
                        }
                      />
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

function NotificacaoCard({ item, onMarcarLida }) {
  return (
    <article
      className={`group rounded-[1.5rem] p-4 border transition-all flex flex-col md:flex-row md:items-start gap-4 ${
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

      <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
        <Link
          to={item.link}
          className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
        >
          {item.acao}
        </Link>

        {!item.lida && (
          <button
            type="button"
            onClick={onMarcarLida}
            className="bg-artPurple/10 text-artPurple px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all"
          >
            Marcar lida
          </button>
        )}
      </div>
    </article>
  );
}