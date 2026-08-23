import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, title = "Notificação", type = "info", link = "") => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, title, type, link };

    // Adiciona o toast flutuante
    setToasts((prev) => [...prev, newToast]);

    // Salvar notificação no histórico permanente do localStorage para a Central de Notificações
    try {
      const historyRaw = localStorage.getItem("artfolio_notifications_history");
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      
      const newHistoryItem = {
        id: `local-${id}`,
        titulo: title,
        mensagem: message,
        tipo: type === "seguidor" ? "FOLLOW" : type === "mensagem" ? "MESSAGE" : type === "postagem" ? "LIKE" : "SYSTEM",
        lida: false,
        dataCriacao: new Date().toISOString(),
        link: link || (type === "mensagem" ? "/mensagens" : type === "seguidor" ? "/seguidores" : "/feed"),
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 49)]; // Guarda até 50 mais recentes
      localStorage.setItem("artfolio_notifications_history", JSON.stringify(updatedHistory));
    } catch {
      // Ignore storage error
    }

    // Autoclose após 6 segundos
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container Global Flutuante */}
      <div className="fixed top-5 right-5 z-[9999] space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-artDark text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-start gap-3 animate-slideInRight transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-artOrange/20 text-artOrange flex items-center justify-center shrink-0 mt-0.5">
              {toast.type === "mensagem" && <i className="fa-solid fa-paper-plane text-xs"></i>}
              {toast.type === "seguidor" && <i className="fa-solid fa-user-plus text-xs"></i>}
              {toast.type === "postagem" && <i className="fa-solid fa-palette text-xs"></i>}
              {toast.type === "sucesso" && <i className="fa-solid fa-check-circle text-xs"></i>}
              {toast.type === "erro" && <i className="fa-solid fa-triangle-exclamation text-xs"></i>}
              {(!toast.type || toast.type === "info") && <i className="fa-solid fa-bell text-xs"></i>}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-artOrange">
                {toast.title}
              </p>
              <p className="text-xs font-semibold text-gray-200 mt-0.5 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
}
