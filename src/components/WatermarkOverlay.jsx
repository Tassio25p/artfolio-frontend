import React from "react";

export default function WatermarkOverlay({ nomeUsuario = "Artista", customText = null }) {
  const textoPrincipal = customText || `Artfolio @${(nomeUsuario || "Artista").replace(/\s+/g, "").toLowerCase()}`;

  // Criar uma grade repetida de textos em diagonal
  const linhas = Array.from({ length: 8 });
  const colunas = Array.from({ length: 6 });

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-20 overflow-hidden flex flex-col justify-around items-center backdrop-blur-[0.5px]"
      aria-hidden="true"
    >
      {/* Camada Glassmorphism e Blurs Sutis com as Cores da Identidade Visual */}
      <div className="absolute inset-0 bg-white/[0.04] backdrop-contrast-[1.02]"></div>

      {/* Orbes de Blur Difuso com as Cores Oficiais da Marca */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-[#6C5CE7]/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FF793F]/15 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-[#0984E3]/15 rounded-full blur-2xl"></div>

      {/* Grade de Padrão Diagonal com o Nome do Artista e Selo Artfolio */}
      <div className="absolute inset-[-40%] flex flex-col justify-between transform -rotate-[24deg] opacity-75">
        {linhas.map((_, rowIdx) => (
          <div
            key={rowIdx}
            className={`flex justify-around items-center whitespace-nowrap gap-12 sm:gap-16 ${
              rowIdx % 2 === 0 ? "translate-x-12" : "-translate-x-12"
            }`}
          >
            {colunas.map((_, colIdx) => (
              <div
                key={colIdx}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm shadow-black/10"
              >
                {/* Mini logo da paleta Artfolio */}
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#6C5CE7] via-[#FF793F] to-[#0984E3] shadow-xs"></span>
                <span className="font-editorial text-xs sm:text-sm font-black tracking-wider text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {textoPrincipal}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
