import React from "react";
import { formatarPrecoBR } from "../utils/obraHelper";

export default function PriceBadge({ preco, className = "" }) {
  const precoFormatado = formatarPrecoBR(preco);
  if (!precoFormatado) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-black/10 shadow-md text-artDark select-none cursor-default transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:rotate-1 hover:shadow-lg hover:border-artOrange/40 group ${className}`}
      title="Preço base sugerido pelo artista para negociação"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Ícone de Etiqueta com Gradiente que reage no Hover */}
      <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-artOrange to-amber-500 text-white flex items-center justify-center text-[10px] shadow-2xs group-hover:rotate-12 transition-transform duration-300">
        <i className="fa-solid fa-tag"></i>
      </div>

      <div className="flex flex-col">
        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none">
          Preço Base
        </span>
        <span className="font-editorial text-xs sm:text-sm font-bold text-artDark group-hover:text-artOrange transition-colors leading-tight">
          {precoFormatado}
        </span>
      </div>
    </div>
  );
}
