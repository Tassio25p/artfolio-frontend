import React from "react";
import { Link } from "react-router-dom";

export default function ModalConversao({ isOpen, onClose, acao = "interagir" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-[2.5rem] p-6 lg:p-10 max-w-md w-full border border-black/5 shadow-2xl relative overflow-hidden animate-scaleUp text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#F9F8F6] text-gray-400 hover:text-artDark hover:bg-black/5 flex items-center justify-center transition-colors"
          title="Fechar"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        {/* Ícone decorativo Laranja Artista */}
        <div className="w-16 h-16 rounded-3xl bg-artOrange/10 text-artOrange flex items-center justify-center text-2xl mx-auto mb-6 shadow-lg shadow-artOrange/10">
          <i className="fa-solid fa-palette"></i>
        </div>

        <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
          Acesso Exclusivo para Membros
        </span>

        <h3 className="font-editorial text-3xl font-bold text-artDark leading-tight mb-3">
          Junte-se à nossa <span className="italic text-artOrange">Comunidade Artística.</span>
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-6 font-normal">
          Você está navegando como <strong>Visitante</strong>. Para {acao}, curtir, comentar, publicar obras e conversar diretamente com artistas, crie sua conta hoje mesmo!
        </p>

        <div className="space-y-3">
          <Link
            to="/cadastro"
            className="w-full inline-flex items-center justify-center gap-2 bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95"
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            Criar Minha Conta de Artista
          </Link>

          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#F9F8F6] text-artDark border border-black/5 py-3.5 rounded-full text-sm font-bold hover:bg-artPurple hover:text-white transition-all active:scale-95"
          >
            <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i>
            Já tenho uma conta (Login)
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 text-xs font-bold text-gray-400 hover:text-artDark transition-colors uppercase tracking-widest block mx-auto"
        >
          Continuar apenas explorando
        </button>
      </div>
    </div>
  );
}
