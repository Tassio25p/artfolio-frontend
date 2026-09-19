import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { notificacaoService, getToken, getMediaUrl } from "../services/api";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 1. Modo Silencioso com persistência no localStorage
  const [silenciado, setSilenciado] = useState(() => {
    try {
      return localStorage.getItem("artfolio_silenciar_notificacoes") === "true";
    } catch {
      return false;
    }
  });

  const toggleSilenciar = useCallback(() => {
    setSilenciado((prev) => {
      const novoValor = !prev;
      try {
        localStorage.setItem("artfolio_silenciar_notificacoes", String(novoValor));
      } catch (err) {
        console.error("[NotificationContext] Erro ao salvar preferencia:", err);
      }
      return novoValor;
    });
  }, []);

  // 2. Histórico interno de notificações e contador de não lidas
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidasCount, setNaoLidasCount] = useState(0);

  // 3. Pilha de Toasts Compactos (máximo 2 visíveis simultâneos com suporte a agrupamento)
  const [toasts, setToasts] = useState([]);

  const removerToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);
  const removeToast = removerToast;

  const triggerToast = useCallback(
    (titulo, mensagem, link, avatar, grupoKey = null) => {
      if (silenciado) return;

      const id = grupoKey || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const novoToast = { id, titulo, mensagem, link, avatar };

      setToasts((prev) => {
        // Se for a mesma conversa/grupo, substitui o anterior atualizando o texto
        const filtrados = prev.filter((t) => t.id !== id);
        return [...filtrados, novoToast].slice(-2);
      });

      setTimeout(() => {
        removerToast(id);
      }, 4000);
    },
    [silenciado, removerToast]
  );

  const tocarSomNotificacao = useCallback(() => {
    if (silenciado) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
        return;
      }
    } catch {
      // Falha de inicialização de áudio (navegador com autoplay restrito)
    }

    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch {
      // Arquivo de áudio não disponível ou bloqueado
    }
  }, [silenciado]);

  // Carregar contagem e lista inicial de notificações via REST
  const carregarDadosIniciais = useCallback(async () => {
    if (!getToken() || !isAuthenticated) return;
    try {
      const [countRes, listRes] = await Promise.allSettled([
        notificacaoService.contarNaoLidas(),
        notificacaoService.listar(),
      ]);

      if (countRes.status === "fulfilled" && countRes.value && typeof countRes.value.quantidade === "number") {
        setNaoLidasCount(countRes.value.quantidade);
      }

      if (listRes.status === "fulfilled" && listRes.value) {
        if (Array.isArray(listRes.value.items)) {
          setNotificacoes(listRes.value.items);
        } else if (Array.isArray(listRes.value)) {
          setNotificacoes(listRes.value);
        }
      }
    } catch (err) {
      console.debug("[NotificationContext] Erro ao carregar dados iniciais:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      queueMicrotask(() => {
        setNotificacoes([]);
        setNaoLidasCount(0);
        setToasts([]);
      });
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDadosIniciais();
  }, [isAuthenticated, user?.id, carregarDadosIniciais]);

  const marcarTodasComoLidas = useCallback(async () => {
    try {
      await notificacaoService.marcarTodasComoLidas();
    } catch (err) {
      console.debug("[NotificationContext] Erro ao marcar todas como lidas:", err);
    }
    setNaoLidasCount(0);
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  }, []);

  const markAsRead = useCallback(async (notificacaoId) => {
    try {
      if (!String(notificacaoId).startsWith("local-")) {
        await notificacaoService.marcarComoLida(notificacaoId);
      }
    } catch (err) {
      console.debug("[NotificationContext] Erro ao marcar como lida:", err);
    }
    setNaoLidasCount((prev) => Math.max(0, prev - 1));
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === notificacaoId ? { ...n, lida: true } : n))
    );
  }, []);

  // 4. Conexão WebSocket Persistente Blindada com JWT
  useEffect(() => {
    const token = getToken();
    if (!user?.id || !token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost =
      window.location.port === "5173" || window.location.port === "3000"
        ? "127.0.0.1:8000"
        : window.location.host;
    const socket = new WebSocket(`${protocol}//${wsHost}/ws?token=${encodeURIComponent(token)}`);

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    }, 25000);

    const handleEnviarSocket = (e) => {
      const payload = e.detail;
      if (payload && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
      }
    };
    window.addEventListener("artfolio_enviar_socket", handleEnviarSocket);

    socket.onmessage = (event) => {
      if (!event.data || event.data === "pong") return;

      try {
        const data = JSON.parse(event.data);

        // Disparo incondicional do barramento global para manter contadores reativos no Feed e PostCard
        window.dispatchEvent(new CustomEvent("artfolio_sync", { detail: data }));

        // Filtro 1: Ações disparadas pelo próprio usuário logado
        const autorAcaoId = data.idRemetente || data.remetente?.id || data.remetente_id;
        if (autorAcaoId && user?.id && Number(autorAcaoId) === Number(user.id)) {
          return;
        }

        // Filtro 2: Eventos puramente de sincronização ou desengajamento
        const tiposSilenciosos = [
          "DESCURTIDA",
          "UNLIKE",
          "UNFOLLOW",
          "DEIXOU_DE_SEGUIR",
          "SYNC",
          "DIGITANDO",
          "TYPING",
          "MENSAGENS_LIDAS",
          "MENSAGEM_EDITADA",
          "MENSAGEM_EXCLUIDA"
        ];
        if (data.silencioso === true || tiposSilenciosos.includes(data.tipo?.toUpperCase())) {
          return;
        }

        // Filtro 3: Se for mensagem de chat e o usuário já está com a conversa aberta na tela
        const conversaIdMsg = String(data.conversa_id || data.idConversa || data.conversaId || "");
        if (
          conversaIdMsg &&
          window.__artfolio_active_chat_id &&
          String(window.__artfolio_active_chat_id) === conversaIdMsg
        ) {
          return;
        }

        // Atualização dos dados do sininho
        setNaoLidasCount((prev) => (typeof data.naoLidasCount === "number" ? data.naoLidasCount : prev + 1));
        setNotificacoes((prev) => {
          const id = data.id || `ws-${Date.now()}`;
          return [{ ...data, id }, ...prev.filter((n) => n.id !== id)];
        });

        // Disparo de Toast e Áudio (apenas se não estiver silenciado)
        if (!silenciado) {
          tocarSomNotificacao();

          let linkRedirecionamento = "/notificacoes";
          if (conversaIdMsg) {
            linkRedirecionamento = `/mensagens?conversa=${conversaIdMsg}`;
          } else if ((data.tipo === "FOLLOW" || data.tipo === "SEGUIDOR") && (data.idRemetente || data.remetente?.id)) {
            linkRedirecionamento = `/artista/${data.idRemetente || data.remetente?.id}`;
          } else if (data.postagem_id || data.idPostagem || data.id_postagem) {
            linkRedirecionamento = `/obra/${data.postagem_id || data.idPostagem || data.id_postagem}`;
          }

          triggerToast(
            data.titulo || (data.remetente?.nome ? `Mensagem de ${data.remetente.nome}` : "Nova notificação"),
            data.conteudo || data.mensagem || "Nova interação recebida",
            linkRedirecionamento,
            data.remetente?.fotoPerfil,
            conversaIdMsg ? `chat-${conversaIdMsg}` : null
          );
        }
      } catch (parseErr) {
        console.warn("[WebSocket] Mensagem inválida:", parseErr);
      }
    };

    return () => {
      clearInterval(pingInterval);
      window.removeEventListener("artfolio_enviar_socket", handleEnviarSocket);
      socket.close();
    };
  }, [user?.id, silenciado, tocarSomNotificacao, triggerToast]);

  return (
    <NotificationContext.Provider
      value={{
        notificacoes,
        naoLidasCount,
        unreadCount: naoLidasCount,
        marcarTodasComoLidas,
        markAllAsRead: marcarTodasComoLidas,
        markAsRead,
        refreshUnreadCount: carregarDadosIniciais,
        removeToast,
        removerToast,
        triggerToast,
        toasts,
        toast: toasts[0] || null,
        silenciado,
        toggleSilenciar,
      }}
    >
      {children}

      <style>{`
        @keyframes toastSlideIn {
          0% { transform: translateX(110%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-toast-slide {
          animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Pilha de Toasts Compactos em Formato Pill (Canto Superior Direito) */}
      <aside
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none select-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              if (t.link) {
                navigate(t.link);
              }
              removerToast(t.id);
            }}
            className="pointer-events-auto cursor-pointer animate-toast-slide bg-neutral-950/90 hover:bg-neutral-900 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-neutral-800/80 flex items-center gap-3 transition-all duration-200 group"
          >
            {t.avatar ? (
              <img
                src={getMediaUrl(t.avatar)}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-neutral-700 shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }
                }}
              />
            ) : null}

            <div
              className={`w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold shrink-0 ${
                t.avatar ? "hidden" : "flex"
              }`}
            >
              ✦
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-neutral-100 truncate group-hover:text-amber-400 transition-colors">
                {t.titulo}
              </p>
              <p className="text-[11px] text-neutral-400 truncate leading-tight">
                {t.mensagem}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removerToast(t.id);
              }}
              className="text-neutral-500 hover:text-white p-1 rounded-md transition-colors shrink-0 cursor-pointer"
              title="Dispensar"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </aside>
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification deve ser utilizado dentro de um NotificationProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = useNotification;
