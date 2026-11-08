import React, { useState, useEffect, useRef } from "react";
import {
  ARTFOLIO_CUSTOM_EMOJIS,
  UNICODE_EMOJIS,
} from "../utils/artfolioEmojis";

export default function EmojiPicker({
  onSelect,
  onSelectEmoji,
  isOpen: propIsOpen,
  onClose: propOnClose,
  position = "bottom", // "top" | "bottom"
  className = "",
  buttonClassName = "",
  buttonLabel = "Emojis",
  showButtonLabel = true,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("artfolio"); // "artfolio" | "computador"
  const [searchTerm, setSearchTerm] = useState("");
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);

  const isControlled = propIsOpen !== undefined;
  const isOpen = isControlled ? propIsOpen : internalOpen;

  const handleClose = React.useCallback(() => {
    if (isControlled) {
      if (typeof propOnClose === "function") {
        propOnClose();
      }
    } else {
      setInternalOpen(false);
    }
  }, [isControlled, propOnClose]);

  const handleToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isControlled) {
      if (isOpen && typeof propOnClose === "function") {
        propOnClose();
      }
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  // Fecha o picker ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        (!triggerRef.current || !triggerRef.current.contains(event.target))
      ) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClose]);

  const handleEmojiClick = (emojiValue, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const formatted = typeof emojiValue === "string" && emojiValue.startsWith(":")
      ? ` ${emojiValue} `
      : emojiValue;

    if (typeof onSelect === "function") {
      onSelect(formatted);
    }
    if (typeof onSelectEmoji === "function") {
      onSelectEmoji(formatted);
    }
  };

  // Renderiza o popover do picker
  const renderPopover = () => {
    if (!isOpen) return null;

    const term = (searchTerm || "").toLowerCase().trim();

    const artfolioFiltrados = (ARTFOLIO_CUSTOM_EMOJIS || []).filter((e) => {
      if (!term) return true;
      return (
        (e.name || "").toLowerCase().includes(term) ||
        (e.code || "").toLowerCase().includes(term) ||
        (e.category || "").toLowerCase().includes(term)
      );
    });

    return (
      <div
        ref={pickerRef}
        onClick={(e) => e.stopPropagation()}
        className={`absolute z-[99999] w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white/98 backdrop-blur-2xl border border-black/15 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.45)] flex flex-col overflow-hidden text-artDark select-none transition-all duration-200 animate-in fade-in zoom-in-95 pointer-events-auto ${
          position === "top"
            ? "bottom-full mb-2.5 right-0 sm:right-auto sm:left-0"
            : "top-full mt-2 right-0"
        } ${className}`}
        style={{ maxHeight: "380px" }}
      >
        {/* Cabeçalho do Seletor com Abas Artfolio & Computador */}
        <div className="p-3 border-b border-black/5 bg-[#F9F8F6]/90 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <i className="fa-solid fa-face-smile text-artOrange"></i> Seletor de Emojis
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className="w-6 h-6 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Fechar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Alternador de Abas */}
          <div className="grid grid-cols-2 p-1 bg-black/5 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("artfolio");
                setSearchTerm("");
              }}
              className={`py-1 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "artfolio"
                  ? "bg-white text-artPurple shadow-xs"
                  : "text-gray-500 hover:text-artDark"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-artPurple"></span>
              Emojis Artfolio
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("computador");
                setSearchTerm("");
              }}
              className={`py-1 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "computador"
                  ? "bg-white text-artOrange shadow-xs"
                  : "text-gray-500 hover:text-artDark"
              }`}
            >
              <i className="fa-solid fa-laptop text-[11px]"></i>
              Computador
            </button>
          </div>

          {/* Barra de Busca de Emojis */}
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === "artfolio"
                  ? "Buscar emojis do Artfolio..."
                  : "Buscar emojis..."
              }
              className="w-full bg-white rounded-xl pl-8 pr-7 py-1.5 text-xs outline-none border border-black/10 focus:border-artPurple/40 focus:ring-2 ring-artPurple/10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchTerm("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {/* Conteúdo dos Emojis */}
        <div className="p-3 overflow-y-auto max-h-56 flex-1">
          {/* ================= ABA 1: EMOJIS EXCLUSIVOS ARTFOLIO ================= */}
          {activeTab === "artfolio" && (
            <div>
              {artfolioFiltrados.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs">
                  <i className="fa-solid fa-face-frown text-2xl mb-1.5 block"></i>
                  Nenhum emoji encontrado.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                  {artfolioFiltrados.map((emoji) => (
                    <button
                      key={emoji.code}
                      type="button"
                      onClick={(e) => handleEmojiClick(emoji.code, e)}
                      className="group relative p-2 rounded-2xl hover:bg-artPurple/10 hover:border-artPurple/30 border border-transparent transition-all flex flex-col items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
                      title={`${emoji.name} (${emoji.code})`}
                    >
                      <div className="w-7 h-7 flex items-center justify-center pointer-events-none">
                        {emoji.svg}
                      </div>
                      <span className="text-[9px] text-gray-400 truncate w-full text-center mt-1 group-hover:text-artPurple font-medium">
                        {(emoji.name || "").split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= ABA 2: EMOJIS DO COMPUTADOR (UNICODE) ================= */}
          {activeTab === "computador" && (
            <div className="space-y-3">
              {(UNICODE_EMOJIS || []).map((cat) => {
                const emojisFiltrados = (cat.emojis || []).filter((em) => {
                  if (!term) return true;
                  return em.includes(term);
                });

                if (term && emojisFiltrados.length === 0) return null;

                return (
                  <div key={cat.categoria}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                      <i className={`fa-solid ${cat.icone} text-artOrange`}></i>
                      {cat.categoria}
                    </span>
                    <div className="grid grid-cols-6 sm:grid-cols-7 gap-1">
                      {emojisFiltrados.map((em, eIdx) => (
                        <button
                          key={`${cat.categoria}-${eIdx}`}
                          type="button"
                          onClick={(e) => handleEmojiClick(em, e)}
                          className="w-7 h-7 rounded-xl hover:bg-black/5 text-base flex items-center justify-center transition-all hover:scale-125 active:scale-95 cursor-pointer"
                          title={em}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="p-2 px-3.5 bg-[#F9F8F6] border-t border-black/5 flex items-center justify-between text-[9px] text-gray-400">
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-sparkles text-amber-500"></i>
            Suporte a chats, legendas e bios
          </span>
          <span className="font-semibold text-artPurple">Artfolio</span>
        </div>
      </div>
    );
  };

  if (isControlled) {
    return renderPopover();
  }

  return (
    <div className={`relative inline-block ${isOpen ? "z-[9999]" : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={
          buttonClassName ||
          `text-gray-400 hover:text-artOrange text-xs flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-black/5 cursor-pointer ${
            isOpen ? "text-artOrange bg-artOrange/10 font-bold" : ""
          }`
        }
        title="Inserir Emojis (Artfolio & Computador)"
      >
        <i className="fa-regular fa-face-smile"></i>
        {showButtonLabel && <span className="text-[10px] font-bold">{buttonLabel}</span>}
      </button>
      {renderPopover()}
    </div>
  );
}
