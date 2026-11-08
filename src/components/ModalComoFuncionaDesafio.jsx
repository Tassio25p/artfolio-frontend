import React from "react";

export default function ModalComoFuncionaDesafio({ aberto, onFechar, desafioAtual }) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onFechar}
    >
      <div
        className="bg-white text-artDark rounded-[2rem] border border-black/10 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de Fechar */}
        <button
          type="button"
          onClick={onFechar}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-artDark transition-all flex items-center justify-center text-sm cursor-pointer shadow-xs"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Header do Modal */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-artPurple via-indigo-600 to-artBlue text-white flex items-center justify-center text-xl shrink-0 shadow-lg shadow-artPurple/30">
            <i className="fa-solid fa-bolt text-artOrange"></i>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-artOrange bg-artOrange/10 border border-artOrange/20 px-2.5 py-0.5 rounded-full">
              Artfolio Weekly Prompt
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl italic font-bold mt-1 text-artDark">
              Como funciona o Desafio?
            </h2>
          </div>
        </div>

        {/* Corpo com Etapas */}
        <div className="space-y-4 text-xs text-gray-600 leading-relaxed font-light">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F9F8F6] border border-black/5">
            <div className="w-7 h-7 rounded-full bg-artPurple text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="text-artDark font-bold block text-sm mb-0.5">
                Tema Rotativo Oficial a cada 7 dias
              </strong>
              Toda semana o sistema ou a moderação ativa um novo tema inspirador (ex: <em>{desafioAtual?.nomeCategoria || "Cyberpunk Tropical"}</em>) para incentivar a criatividade de toda a comunidade.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F9F8F6] border border-black/5">
            <div className="w-7 h-7 rounded-full bg-artOrange text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="text-artDark font-bold block text-sm mb-0.5">
                Publique sua Obra com a Categoria
              </strong>
              Ao publicar sua arte no botão &quot;Nova Obra&quot;, selecione a categoria oficial do desafio da semana para concorrer ao destaque.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F9F8F6] border border-black/5">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="text-artDark font-bold block text-sm mb-0.5">
                Destaque Orgânico & Reconhecimento
              </strong>
              Todas as postagens do desafio recebem um selo especial ⚡ e ganham visibilidade em abas de destaque, facilitando novos seguidores, curtidas e encomendas!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between gap-3">
          {desafioAtual && (
            <span className="text-[11px] text-gray-500 font-medium truncate">
              Tema ativo: <strong className="text-artPurple font-bold">{desafioAtual.nomeCategoria}</strong>
            </span>
          )}
          <button
            type="button"
            onClick={onFechar}
            className="bg-artDark hover:bg-artPurple text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all ml-auto shadow-md cursor-pointer"
          >
            Entendi, vamos criar!
          </button>
        </div>
      </div>
    </div>
  );
}
