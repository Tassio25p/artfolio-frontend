import React, { useState, useEffect } from "react";
import WatermarkOverlay from "./WatermarkOverlay";

export default function ProtectedImageWrapper({
  children,
  marcaDagua = false,
  bloquearDownload = false,
  bloquearPrint = false,
  nomeArtista = "Artista",
  isLiked = false,
  onCurtir,
  onConversar,
  className = "",
}) {
  const [printShieldAtivo, setPrintShieldAtivo] = useState(false);
  const [avisoProtecaoAberto, setAvisoProtecaoAberto] = useState(false);

  useEffect(() => {
    if (!bloquearPrint) return;

    const limparClipboard = () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Esta arte possui proteção de direitos autorais no Artfolio.");
        }
      } catch (_) {}
    };

    const ativarEscudo = () => {
      setPrintShieldAtivo(true);
      limparClipboard();
    };

    const handleKeyDown = (e) => {
      const isMetaKey = e.key === "Meta" || e.key === "OS" || e.keyCode === 91 || e.keyCode === 92;
      const isPrintScreen = e.key === "PrintScreen" || e.keyCode === 44;
      const isCtrlShortcut = e.ctrlKey && (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S");
      const isMetaShortcut = (e.metaKey || isMetaKey) && (e.shiftKey || e.key === "s" || e.key === "S" || e.key === "3" || e.key === "4" || e.key === "5");
      const isShiftCombo = e.shiftKey && (isPrintScreen || isMetaKey);

      if (isMetaKey || isPrintScreen || isCtrlShortcut || isMetaShortcut || isShiftCombo) {
        ativarEscudo();
        setTimeout(() => {
          if (document.hasFocus() && document.visibilityState === "visible") {
            setPrintShieldAtivo(false);
          }
        }, 3500);
      }
    };

    const handleKeyUp = (e) => {
      if (
        e.key === "PrintScreen" ||
        e.keyCode === 44 ||
        e.key === "Meta" ||
        e.key === "OS" ||
        e.keyCode === 91 ||
        e.keyCode === 92
      ) {
        ativarEscudo();
      }
    };

    const handleWindowBlur = () => {
      setPrintShieldAtivo(true);
      limparClipboard();
    };

    const handleWindowFocus = () => {
      setTimeout(() => {
        setPrintShieldAtivo(false);
      }, 1200);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setPrintShieldAtivo(true);
        limparClipboard();
      } else {
        setTimeout(() => {
          setPrintShieldAtivo(false);
        }, 1200);
      }
    };

    const intervalId = setInterval(() => {
      if (!document.hasFocus() || document.visibilityState !== "visible") {
        setPrintShieldAtivo(true);
      }
    }, 150);

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [bloquearPrint]);

  const dispararAvisoProtecao = () => {
    setAvisoProtecaoAberto(true);
  };

  const handleContextMenu = (e) => {
    if (bloquearDownload) {
      e.preventDefault();
      e.stopPropagation();
      dispararAvisoProtecao();
    }
  };

  const handleDragStart = (e) => {
    if (bloquearDownload) {
      e.preventDefault();
      e.stopPropagation();
      dispararAvisoProtecao();
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      className={`relative select-none overflow-hidden ${bloquearDownload ? "no-download" : ""} ${className}`}
      style={{
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
    >
      {/* Conteúdo da Imagem / Obra */}
      <div
        className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
          printShieldAtivo ? "filter blur-3xl opacity-0 scale-95 pointer-events-none" : ""
        }`}
      >
        {children}
      </div>

      {/* Marca d'água Visual Dinâmica */}
      {marcaDagua && <WatermarkOverlay nomeUsuario={nomeArtista} />}

      {/* Camada Invisível de Proteção contra Download / Salvar como */}
      {bloquearDownload && (
        <div
          className="absolute inset-0 z-10 bg-transparent cursor-default"
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          draggable={false}
          aria-hidden="true"
        />
      )}

      {/* Escudo contra Printscreen / Screenshot / Snipping Tool */}
      {printShieldAtivo && (
        <div className="absolute inset-0 z-30 bg-neutral-950/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-artOrange/15 text-artOrange flex items-center justify-center text-3xl mb-4 shadow-xl shadow-artOrange/20 border border-artOrange/30 backdrop-blur-md">
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <h4 className="font-editorial text-2xl font-bold text-white mb-2 tracking-tight">
            Conteúdo Protegido
          </h4>
          <p className="text-xs text-gray-300 max-w-xs leading-relaxed font-light">
            Esta arte possui proteção autoral ativa contra capturas e cópias não autorizadas.
          </p>
        </div>
      )}

      {/* Toast Notificação Animada de Proteção Autoral com Botões de Apoio */}
      {avisoProtecaoAberto && (
        <div className="absolute inset-x-3 bottom-3 z-40 bg-neutral-900/95 backdrop-blur-xl border border-white/15 text-white p-4 rounded-2xl shadow-2xl animate-fadeIn flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-artOrange/20 text-artOrange border border-artOrange/30 flex items-center justify-center shrink-0 mt-0.5">
              <i className="fa-solid fa-shield-halved text-sm"></i>
            </div>
            <div>
              <p className="text-xs text-gray-200 font-medium leading-snug">
                Esta obra é protegida pelos direitos autorais de{" "}
                <span className="text-artOrange font-bold font-editorial tracking-wide">
                  @{nomeArtista || "Artista"}
                </span>
                . Que tal apoiar o criador curtindo ou conversando com ele para solicitar liberação?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            {onCurtir && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCurtir();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLiked
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                <i className={`fa-${isLiked ? "solid" : "regular"} fa-heart ${isLiked ? "text-red-500" : ""}`}></i>
                <span>{isLiked ? "Curtido" : "Curtir"}</span>
              </button>
            )}

            {onConversar && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onConversar();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-artOrange hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <i className="fa-regular fa-paper-plane"></i>
                <span>Conversar</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAvisoProtecaoAberto(false);
              }}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Fechar aviso"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
