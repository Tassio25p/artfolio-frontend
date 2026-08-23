import React from "react";

export default function ModalConfirmarExclusao({ isOpen, onClose, onConfirm, loading, tituloObra }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] border border-black/5 p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/20 text-center relative space-y-5">
        
        {/* Ícone de Alerta */}
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto text-2xl shadow-sm">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        <div>
          <h3 className="text-xl font-bold text-artDark mb-2">Excluir esta obra?</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Você está prestes a remover <strong className="text-artDark">{tituloObra || "esta obra"}</strong>. Esta ação não poderá ser desfeita e a arte será removida do seu portfólio e do feed.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Excluindo...</span>
              </>
            ) : (
              <span>Confirmar Exclusão</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
