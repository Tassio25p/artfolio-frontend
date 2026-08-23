import React, { useState } from "react";

export default function ModalCompartilhar({ isOpen, onClose, titulo, url, onCopiarSucesso }) {
  const [copiado, setCopiado] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || window.location.href;

  const handleCopiar = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiado(true);
    if (onCopiarSucesso) onCopiarSucesso("Link copiado com sucesso!");
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleCompartilharRede = (rede) => {
    let target = "";
    const textEncoded = encodeURIComponent(`Confira o perfil de ${titulo || "Artista"} no Artfolio!`);
    const urlEncoded = encodeURIComponent(shareUrl);

    if (rede === "whatsapp") {
      target = `https://api.whatsapp.com/send?text=${textEncoded}%20${urlEncoded}`;
    } else if (rede === "twitter") {
      target = `https://twitter.com/intent/tweet?text=${textEncoded}&url=${urlEncoded}`;
    } else if (rede === "facebook") {
      target = `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}`;
    }

    if (target) {
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2.2rem] border border-black/5 max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-black/20 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F9F8F6] border border-black/5 flex items-center justify-center text-gray-400 hover:text-artDark transition-all"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center text-xl mb-4">
          <i className="fa-solid fa-share-nodes"></i>
        </div>

        <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
          Compartilhamento
        </span>
        <h3 className="font-editorial text-3xl font-bold italic text-artDark leading-tight mb-2">
          Compartilhar Perfil
        </h3>
        <p className="text-xs text-gray-500 mb-6 font-light">
          Envie este perfil para amigos, seguidores ou redes sociais.
        </p>

        {/* Botões de Redes Sociais */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleCompartilharRede("whatsapp")}
            className="flex flex-col items-center justify-center p-3.5 bg-green-50 text-green-600 rounded-2xl border border-green-200 hover:bg-green-100 transition-all gap-1.5"
          >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
            <span className="text-[10px] font-bold">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => handleCompartilharRede("twitter")}
            className="flex flex-col items-center justify-center p-3.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-200 hover:bg-sky-100 transition-all gap-1.5"
          >
            <i className="fa-brands fa-x-twitter text-2xl"></i>
            <span className="text-[10px] font-bold">X / Twitter</span>
          </button>

          <button
            type="button"
            onClick={() => handleCompartilharRede("facebook")}
            className="flex flex-col items-center justify-center p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 hover:bg-blue-100 transition-all gap-1.5"
          >
            <i className="fa-brands fa-facebook text-2xl"></i>
            <span className="text-[10px] font-bold">Facebook</span>
          </button>
        </div>

        {/* Input de Copiar Link Directo */}
        <div className="bg-[#F9F8F6] p-2.5 rounded-2xl border border-black/5 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent text-xs text-gray-600 flex-1 outline-none px-2 font-mono truncate"
          />

          <button
            type="button"
            onClick={handleCopiar}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              copiado
                ? "bg-green-600 text-white"
                : "bg-artDark text-white hover:bg-artPurple"
            }`}
          >
            {copiado ? (
              <>
                <i className="fa-solid fa-check mr-1"></i> Copiado!
              </>
            ) : (
              <>
                <i className="fa-solid fa-copy mr-1"></i> Copiar Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
