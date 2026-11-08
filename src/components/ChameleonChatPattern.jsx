import React from "react";

/**
 * ChameleonChatPattern — Fundo decorativo sutil com contorno de camaleões em degradê base.
 * Opacidade ultra-fina (3% a 5%) para criar atmosfera de marca d'água elegante sem atrapalhar leitura.
 * Para desativar ou remover, basta ocultar/comentar este componente no Messages.jsx.
 */
export default function ChameleonChatPattern({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none z-0 bg-white ${className}`}
    >
      {/* Imagem perfeita de fundo único preenchendo toda a tela sem repetições */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: "url('/chat-pattern.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Filtro branco para suavizar e deixar o fundo um pouco mais opaco */}
      <div className="absolute inset-0 bg-white/70 pointer-events-none" />
    </div>
  );
}
