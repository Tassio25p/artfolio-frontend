import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { notificacaoService, getMediaUrl } from "../services/api";

const filtros = [
  { id: "Todas", label: "Todas" },
  { id: "LIKE", label: "Curtidas" },
  { id: "COMMENT", label: "Comentários" },
  { id: "FOLLOW", label: "Seguidores" },
  { id: "MESSAGE", label: "Mensagens" },
];

function getIconeETipo(tipo) {
  switch (tipo) {
    case "LIKE":
      return { icone: "fa-solid fa-heart", cor: "text-artOrange", fundo: "bg-artOrange/10", label: "Curtida", link: "/feed", acao: "Ver no feed" };
    case "COMMENT":
      return { icone: "fa-solid fa-comment", cor: "text-artBlue", fundo: "bg-artBlue/10", label: "Comentário", link: "/feed", acao: "Ver comentário" };
    case "FOLLOW":
      return { icone: "fa-solid fa-user-plus", cor: "text-artPurple", fundo: "bg-artPurple/10", label: "Seguidor", link: "/seguidores", acao: "Ver seguidores" };
    case "MESSAGE":
      return { icone: "fa-solid fa-paper-plane", cor: "text-artDark", fundo: "bg-black/5", label: "Mensagem", link: "/mensagens", acao: "Responder" };
    default:
      return { icone: "fa-solid fa-bell", cor: "text-artPurple", fundo: "bg-artPurple/10", label: tipo, link: "/notificacoes", acao: "Ver" };
  }
}

export default function Notificacoes() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("Todas");
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  const { user } = useAuth();
  const tipoUsuario = user?.tipo_conta || "cliente";

  const [selectedIds, setSelectedIds] = useState([]);

  const carregarNotificacoes = async () => {
    try {
      let apiItems = [];
      try {
        const res = await notificacaoService.listar();
        if (Array.isArray(res)) {
          apiItems = res;
        } else if (res && Array.isArray(res.items)) {
          apiItems = res.items;
        }
      } catch {
        // Fallback
      }

      let localItems = [];
      try {
        const saved = localStorage.getItem("artfolio_notifications_history");
        if (saved) localItems = JSON.parse(saved);
      } catch {
        // Ignore
      }

      const mesclados = [...apiItems, ...localItems];
      const unicos = Array.from(new Map(mesclados.map((item) => [item.id, item])).values());
      unicos.sort((a, b) => new Date(b.dataCriacao || 0) - new Date(a.dataCriacao || 0));

      setNotificacoes(unicos);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, [navigate]);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const { markAsRead, markAllAsRead } = useNotifications();

  const handleMarcarComoLida = async (id) => {
    try {
      if (!String(id).startsWith("local-")) {
        await markAsRead(id);
      }
    } catch {
      // Ignore API sync fail
    }

    setNotificacoes((prev) => {
      const novao = prev.map((item) => (item.id === id ? { ...item, lida: true } : item));
      localStorage.setItem("artfolio_notifications_history", JSON.stringify(novao));
      return novao;
    });
    mostrarAviso("Notificação marcada como lida.", "success");
  };

  const handleMarcarTodasComoLidas = async () => {
    try {
      await markAllAsRead();
    } catch {
      // Ignore API sync fail
    }

    setNotificacoes((prev) => {
      const novao = prev.map((item) => ({ ...item, lida: true }));
      localStorage.setItem("artfolio_notifications_history", JSON.stringify(novao));
      return novao;
    });
    mostrarAviso("Todas as notificações foram marcadas como lidas.", "success");
  };

  const handleDeletar = async (id) => {
    try {
      if (!String(id).startsWith("local-")) {
        await notificacaoService.deletar(id);
      }
    } catch {
      // Ignore
    }

    setNotificacoes((prev) => {
      const novao = prev.filter((item) => item.id !== id);
      localStorage.setItem("artfolio_notifications_history", JSON.stringify(novao));
      return novao;
    });
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    mostrarAviso("Notificação excluída com sucesso.", "success");
  };

  const handleDeletarTodas = async () => {
    if (!window.confirm("Deseja realmente excluir todas as suas notificações?")) return;

    try {
      await notificacaoService.deletarTodas();
    } catch {
      // Ignore
    }

    setNotificacoes([]);
    setSelectedIds([]);
    localStorage.removeItem("artfolio_notifications_history");
    mostrarAviso("Todas as notificações foram excluídas.", "success");
  };

  const handleDeletarSelecionadas = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Deseja excluir as ${selectedIds.length} notificações selecionadas?`)) return;

    for (const id of selectedIds) {
      try {
        if (!String(id).startsWith("local-")) {
          await notificacaoService.deletar(id);
        }
      } catch {
        // Ignore
      }
    }

    setNotificacoes((prev) => {
      const novao = prev.filter((item) => !selectedIds.includes(item.id));
      localStorage.setItem("artfolio_notifications_history", JSON.stringify(novao));
      return novao;
    });
    mostrarAviso(`${selectedIds.length} notificações excluídas com sucesso.`, "success");
    setSelectedIds([]);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((item) => item.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredList = notificacoes.filter((item) => {
    if (filter === "Todas") return true;
    return item.tipo === filter;
  });

  const total = notificacoes.length;
  const naoLidas = notificacoes.filter((item) => !item.lida).length;

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/10",
    success: "bg-green-50 text-green-600 border-green-200",
    error: "bg-red-50 text-red-500 border-red-200",
  };

  if (loading) {
    return (
      <div className="bg-[#F9F8F6] text-artDark min-h-screen font-sans">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
              Carregando notificações...
            </p>
          </div>
        </main>
      </div>
    );
  }

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
                Acompanhe curtidas, comentários, novos seguidores, mensagens e
                alertas importantes sobre a sua conta no Artfolio.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleMarcarTodasComoLidas}
                disabled={naoLidas === 0}
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-check-double text-artOrange"></i>
                Marcar lidas
              </button>

              {total > 0 && (
                <button
                  type="button"
                  onClick={handleDeletarTodas}
                  className="bg-white border border-red-200 text-red-500 px-5 py-3 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-trash"></i>
                  Excluir todas
                </button>
              )}
            </div>
          </header>

          {noticeMessage && (
            <div className={`${noticeStyles[noticeType]} border rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold`}>
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-3xl font-black bg-gradient-to-r from-artPurple via-artOrange to-artBlue bg-clip-text text-transparent">{total}</p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Total de Notificações
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center text-xl">
                <i className="fa-solid fa-bell"></i>
              </div>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-artOrange">{naoLidas}</p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Não Lidas
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center text-xl">
                <i className="fa-solid fa-envelope-open-text"></i>
              </div>
            </div>
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
                      className={`w-full px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-all ${filter === btn.id
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
                <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica Artfolio ✨
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Interações em tempo real.
                </h3>

                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed font-light">
                  Mantenha-se engajado respondendo a comentários e mensagens de
                  outros usuários da plataforma.
                </p>

                <i className="fa-solid fa-bell absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/5">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Histórico recente
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Atividades do perfil
                    </h2>
                  </div>

                  {filteredList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="bg-gray-100 hover:bg-gray-200 text-artDark px-4 py-2 rounded-full text-[11px] font-bold transition-all"
                      >
                        {selectedIds.length === filteredList.length ? "Desmarcar Todos" : "Selecionar Tudo"}
                      </button>

                      {selectedIds.length > 0 && (
                        <button
                          type="button"
                          onClick={handleDeletarSelecionadas}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-[11px] font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                          Excluir ({selectedIds.length})
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {filteredList.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 sm:p-12 text-center">
                    <i className="fa-solid fa-bell-slash text-4xl text-gray-200 mb-4"></i>

                    <h3 className="font-editorial text-3xl italic">
                      Nenhuma notificação.
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 font-light">
                      Não existem notificações para este filtro no momento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredList.map((item) => (
                      <NotificacaoCard
                        key={item.id}
                        item={item}
                        isSelected={selectedIds.includes(item.id)}
                        onToggleSelect={() => handleToggleSelect(item.id)}
                        onMarcarLida={() => handleMarcarComoLida(item.id)}
                        onDeletar={() => handleDeletar(item.id)}
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

function NotificacaoCard({ item, isSelected, onToggleSelect, onMarcarLida, onDeletar }) {
  const meta = getIconeETipo(item.tipo);

  return (
    <article
      className={`group rounded-[1.5rem] p-4 border transition-all flex flex-col md:flex-row md:items-start gap-4 ${
        isSelected
          ? "bg-purple-50 border-artPurple shadow-md"
          : item.lida
          ? "bg-[#F9F8F6] border-black/5 opacity-80"
          : "bg-white border-artPurple/30 shadow-md shadow-black/5 hover:border-artPurple"
      } hover:shadow-lg hover:shadow-black/5`}
    >
      <div className="flex items-center gap-3 shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded text-artPurple focus:ring-artPurple cursor-pointer accent-artPurple"
        />

        {item.remetente?.fotoPerfil ? (
          <img
            src={getMediaUrl(item.remetente.fotoPerfil)}
            alt={item.remetente.nome}
            className="w-11 h-11 rounded-2xl object-cover border border-black/5"
          />
        ) : (
          <div className={`w-11 h-11 rounded-2xl ${meta.fundo} ${meta.cor} flex items-center justify-center shrink-0 text-lg`}>
            <i className={meta.icone}></i>
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="font-bold text-sm text-artDark">{item.titulo}</h3>

          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString("pt-BR") : ""}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-1 leading-relaxed font-light">
          {item.mensagem}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-white border border-black/5 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-500">
            {meta.label}
          </span>

          {!item.lida && (
            <span className="bg-artOrange/10 text-artOrange border border-artOrange/20 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
              Nova
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-2 shrink-0 items-center">
        <Link
          to={item.idPostagem ? `/obra/${item.idPostagem}` : meta.link}
          className="bg-white border border-black/5 px-4 py-2 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center shadow-sm"
        >
          {meta.acao}
        </Link>

        {!item.lida && (
          <button
            type="button"
            onClick={onMarcarLida}
            className="bg-artPurple/10 text-artPurple hover:bg-artPurple hover:text-white px-3 py-2 rounded-full text-xs font-bold transition-all"
            title="Marcar como lida"
          >
            <i className="fa-solid fa-check"></i>
          </button>
        )}

        <button
          type="button"
          onClick={onDeletar}
          className="bg-red-50 hover:bg-red-500 hover:text-white text-red-500 p-2 rounded-full transition-all text-xs"
          title="Excluir notificação"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </article>
  );
}