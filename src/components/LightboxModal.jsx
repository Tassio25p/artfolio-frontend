import React, { useEffect } from "react";

export default function LightboxModal({ isOpen, onClose, imagemUrl, titulo }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imagemUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in cursor-zoom-out"
    >
      {/* Header do Lightbox */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl flex items-center justify-between text-white/80 py-2"
      >
        <h3 className="text-sm font-semibold truncate max-w-md">{titulo || "Visualização em Tela Cheia"}</h3>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm font-bold"
          title="Fechar (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Imagem Centralizada */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl max-h-[85vh] flex items-center justify-center my-auto cursor-default"
      >
        <img
          src={imagemUrl}
          alt={titulo || "Obra em destaque"}
          className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl shadow-black/80"
        />
      </div>

      {/* Footer Dica */}
      <p className="text-[11px] text-white/50 font-medium">
        Pressione <kbd className="bg-white/10 px-2 py-0.5 rounded text-white">ESC</kbd> ou clique fora para fechar
      </p>
    </div>
  );
}
