import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { notificacaoService, getToken } from "../services/api";

const NotificationContext = createContext();

// Função utilitária para tocar um som sutil de notificação via Web Audio API
function tocarSomNotificacao() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // Primeiro tom (D5 - 587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Segundo tom mais agudo (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (err) {
    console.debug("Áudio desativado ou não suportado:", err);
  }
}

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState({ visible: false, title: "", message: "", link: "/notificacoes" });

  const prevCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const intervalRef = useRef(null);

  // Ocultar toast manualmente
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Exibir Toast com auto-dismiss após 5 segundos
  const triggerToast = useCallback((title, message, link = "/notificacoes") => {
    setToast({ visible: true, title, message, link });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 5000);
  }, []);

  // Buscar contagem atualizada de não lidas do backend
  const fetchUnreadCount = useCallback(async () => {
    if (!getToken() || !isAuthenticated) return;

    try {
      const res = await notificacaoService.contarNaoLidas();
      if (res && typeof res.quantidade === "number") {
        const newCount = res.quantidade;

        // Verificar se chegou uma NOVA notificação durante a sessão ativa
        if (!isInitialLoadRef.current && newCount > prevCountRef.current) {
          tocarSomNotificacao();

          // Buscar dados da última notificação para o Toast
          try {
            const listRes = await notificacaoService.listar();
            if (listRes && Array.isArray(listRes.items) && listRes.items.length > 0) {
              const latest = listRes.items[0];
              const link = latest.tipo === "FOLLOW" && (latest.idRemetente || latest.remetente?.id)
                ? `/artista/${latest.idRemetente || latest.remetente?.id}`
                : latest.idPostagem
                ? `/obra/${latest.idPostagem}`
                : "/notificacoes";

              triggerToast(
                latest.titulo || "Nova notificação",
                latest.mensagem || "Você possui uma nova notificação.",
                link
              );
            } else {
              triggerToast(
                "Nova notificação",
                "Você recebeu uma nova notificação no Artfolio.",
                "/notificacoes"
              );
            }
          } catch {
            triggerToast(
              "Nova notificação",
              "Você recebeu uma nova notificação no Artfolio.",
              "/notificacoes"
            );
          }
        }

        prevCountRef.current = newCount;
        setUnreadCount(newCount);
        isInitialLoadRef.current = false;
      }
    } catch (err) {
      console.debug("Erro ao consultar contagem de notificações não lidas:", err);
    }
  }, [isAuthenticated, triggerToast]);

  // Forçar atualização manual da contagem de não lidas
  const refreshUnreadCount = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Marcar uma notificação como lida e atualizar contagem
  const markAsRead = useCallback(async (notificacaoId) => {
    try {
      await notificacaoService.marcarComoLida(notificacaoId);
      setUnreadCount((prev) => {
        const updated = Math.max(0, prev - 1);
        prevCountRef.current = updated;
        return updated;
      });
      await fetchUnreadCount();
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
    }
  }, [fetchUnreadCount]);

  // Marcar todas as notificações como lidas
  const markAllAsRead = useCallback(async () => {
    try {
      await notificacaoService.marcarTodasComoLidas();
      setUnreadCount(0);
      prevCountRef.current = 0;
      await fetchUnreadCount();
    } catch (err) {
      console.error("Erro ao marcar todas notificações como lidas:", err);
    }
  }, [fetchUnreadCount]);

  // Gerenciar Polling automático e Reset de Sessão ao trocar de usuário / logout
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      // Logout ou Usuário Desautenticado -> Limpar tudo
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setUnreadCount(0);
      prevCountRef.current = 0;
      isInitialLoadRef.current = true;
      hideToast();
      return;
    }

    // Usuário Autenticado -> Resetar flag de carga inicial para a nova conta e fazer fetch imediato
    isInitialLoadRef.current = true;
    prevCountRef.current = 0;
    fetchUnreadCount();

    // Configurar Polling inteligente a cada 8 segundos
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, user?.id, fetchUnreadCount, hideToast]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        markAsRead,
        markAllAsRead,
        toast,
        hideToast,
        triggerToast,
      }}
    >
      {children}

      {/* Componente Toast de Notificação em Tempo Real */}
      {toast.visible && (
        <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-bounce-short">
          <div className="bg-artDark text-white p-4 rounded-[1.5rem] shadow-2xl border border-white/10 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-artPurple text-white flex items-center justify-center shrink-0">
              <i className="fa-solid fa-bell text-base animate-wiggle"></i>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-xs text-artOrange truncate uppercase tracking-widest">
                  {toast.title}
                </h4>
                <button
                  type="button"
                  onClick={hideToast}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>

              <p className="text-xs text-gray-200 mt-1 line-clamp-2 leading-relaxed font-light">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() => {
                  hideToast();
                  if (toast.link) navigate(toast.link);
                }}
                className="mt-2 text-[10px] font-bold uppercase tracking-widest text-artPurple hover:text-white transition-colors inline-flex items-center gap-1"
              >
                Ver detalhes <i className="fa-solid fa-arrow-right text-[8px]"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications deve ser usado dentro de um NotificationProvider");
  }
  return context;
}
