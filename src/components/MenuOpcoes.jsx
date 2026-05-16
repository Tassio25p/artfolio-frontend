import { useState } from "react";
import { Link } from "react-router-dom";

export default function MenuOpcoes({
  tipo = "obra",
  detalhesLink = "#",
  onDenunciar,
}) {
  const [aberto, setAberto] = useState(false);

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setAberto(false);
    alert("Link copiado!");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setAberto(!aberto);
        }}
        className="w-9 h-9 rounded-full bg-white/90 border border-black/5 flex items-center justify-center text-gray-400 hover:text-artDark hover:bg-white transition-all shadow-sm"
        title="Mais opções"
      >
        <i className="fa-solid fa-ellipsis"></i>
      </button>

      {aberto && (
        <div className="absolute right-0 top-11 w-52 bg-white rounded-[1.3rem] border border-black/5 shadow-2xl shadow-black/10 p-2 z-50">
          <Link
            to={detalhesLink}
            onClick={() => setAberto(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#F9F8F6] transition-colors"
          >
            <i className="fa-regular fa-eye text-artBlue w-4"></i>
            Ver detalhes
          </Link>

          {tipo === "obra" && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAberto(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#F9F8F6] transition-colors text-left"
            >
              <i className="fa-regular fa-bookmark text-artPurple w-4"></i>
              Salvar obra
            </button>
          )}

          <button
            type="button"
            onClick={handleCopiarLink}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#F9F8F6] transition-colors text-left"
          >
            <i className="fa-solid fa-link text-gray-400 w-4"></i>
            Copiar link
          </button>

          <div className="h-px bg-black/5 my-2"></div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAberto(false);

              if (onDenunciar) {
                onDenunciar();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-50 text-red-500 transition-colors text-left"
          >
            <i className="fa-solid fa-flag w-4"></i>
            {tipo === "perfil" ? "Denunciar perfil" : "Denunciar obra"}
          </button>
        </div>
      )}
    </div>
  );
}