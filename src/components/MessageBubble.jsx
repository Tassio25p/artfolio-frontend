import React, { useState, useRef, useEffect } from "react";

export default function MessageBubble({
  text,
  time,
  sent = false,
  lida = false,
  deletado_em = null,
  editado_em = null,
  podeEditar = false,
  onEditar = null,
  onExcluir = null,
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickFora = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    if (menuAberto) {
      document.addEventListener("mousedown", handleClickFora);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, [menuAberto]);

  const isApagada = Boolean(deletado_em);

  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"} group/bubble relative`}>
      <div className="max-w-md relative flex items-start gap-1">
        {/* Menu de ações para mensagens enviadas (lado esquerdo do balão) */}
        {sent && !isApagada && (onEditar || onExcluir) && (
          <div className="relative self-center shrink-0">
            <button
              type="button"
              onClick={() => setMenuAberto((prev) => !prev)}
              className="opacity-0 group-hover/bubble:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-artDark rounded-full hover:bg-black/5 text-xs cursor-pointer"
              title="Ações da mensagem"
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            {menuAberto && (
              <div
                ref={menuRef}
                className="absolute right-full top-0 mr-1 bg-white border border-black/10 rounded-2xl shadow-xl py-1.5 z-40 min-w-[120px] text-left animate-fadeIn"
              >
                {podeEditar && onEditar && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAberto(false);
                      onEditar();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-[#F9F8F6] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <i className="fa-solid fa-pen text-[10px] text-artPurple"></i>
                    <span>Editar</span>
                  </button>
                )}
                {onExcluir && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAberto(false);
                      onExcluir();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <i className="fa-solid fa-trash text-[10px]"></i>
                    <span>Excluir</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          {isApagada ? (
            /* Balão sutil de mensagem apagada */
            <div
              className={`p-4 sm:p-4.5 rounded-[2rem] border ${
                sent
                  ? "bg-black/5 text-gray-400 rounded-tr-none border-black/5"
                  : "bg-gray-100 text-gray-400 rounded-tl-none border-black/5"
              }`}
            >
              <p className="text-xs sm:text-sm italic flex items-center gap-2 select-none">
                <i className="fa-solid fa-ban text-[11px] opacity-70"></i>
                <span>Esta mensagem foi apagada</span>
              </p>
            </div>
          ) : (
            /* Balão normal de mensagem */
            <div
              className={`p-5 sm:p-6 rounded-[2rem] shadow-sm ${
                sent
                  ? "bg-artDark text-white rounded-tr-none shadow-xl"
                  : "bg-white text-gray-700 rounded-tl-none border border-black/5"
              }`}
            >
              <p className="text-sm leading-relaxed opacity-90 break-words whitespace-pre-wrap">
                {text}
              </p>
            </div>
          )}

          {/* Rodapé do balão com hora, tag de editada e confirmação de leitura */}
          <div
            className={`text-[9px] mt-1.5 flex items-center gap-1.5 uppercase font-bold tracking-widest ${
              sent
                ? "justify-end text-artPurple mr-2"
                : "justify-start text-gray-400 ml-2"
            }`}
          >
            <span>{time} • {sent ? "Enviada" : "Recebida"}</span>
            {!isApagada && editado_em && (
              <span className="text-[9px] text-gray-400 lowercase italic font-normal tracking-normal ml-0.5">
                (editada)
              </span>
            )}
            {sent && !isApagada && (
              <span title={lida ? "Mensagem lida" : "Mensagem enviada"} className="inline-flex items-center ml-0.5">
                <i
                  className={`fa-solid fa-check-double text-[11px] ${
                    lida ? "text-emerald-500" : "text-neutral-400"
                  }`}
                ></i>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}