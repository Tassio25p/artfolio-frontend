import React from "react";
import { Link } from "react-router-dom";
import { getMediaUrl } from "../services/api";
import { desempacotarDadosObra } from "../utils/obraHelper";
import PriceBadge from "./PriceBadge";
import WatermarkOverlay from "./WatermarkOverlay";

export default function PortfolioCard(props) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const obra = props.obra || {};
  const id = props.id || obra.id;
  const dados = desempacotarDadosObra(obra);

  const image = props.image || obra.image || obra.arquivoUrl || obra.arquivo_url || obra.imagem || "";
  const title = props.title || obra.title || dados.titulo || `Obra #${id || ""}`;
  const description = props.description || obra.description || dados.descricao || "";
  const precoBase = props.precoBase || obra.precoBase || obra.preco_base || dados.precoBase;
  const marcaDagua = props.marcaDagua || obra.marcaDagua || obra.marca_dagua || dados.marcaDagua;
  const isPinned = props.fixado !== undefined ? props.fixado : (obra.fixado || false);

  const category =
    props.category ||
    obra.category?.nomeCategoria ||
    (obra.categorias && obra.categorias[0]?.nomeCategoria) ||
    null;
  const color = props.color || obra.color || "text-artPurple";

  const ext = (image || "").split("?")[0].split(".").pop().toLowerCase();
  const isVideo = ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext);
  const isPdf = ["pdf"].includes(ext);
  const isDoc = ["doc", "docx", "txt", "odt", "rtf", "ppt", "pptx"].includes(ext);
  const is3D = ["obj", "fbx", "gltf", "glb", "stl", "blend", "dae"].includes(ext);
  const isArchive = ["zip", "rar", "7z", "psd", "ai", "eps"].includes(ext);
  const isOutroArquivo = isPdf || isDoc || is3D || isArchive;

  return (
    <Link
      to={id ? `/obra/${id}` : "#"}
      className={`group rounded-[2rem] overflow-hidden transition-all flex flex-col justify-between h-full block relative ${
        isPinned
          ? "bg-gradient-to-b from-orange-50/50 via-white to-white border-2 border-artOrange/35 shadow-md shadow-orange-500/10 ring-1 ring-artOrange/20 hover:shadow-xl hover:shadow-orange-500/15"
          : "bg-white border border-black/5 shadow-sm hover:shadow-xl hover:shadow-black/5"
      }`}
    >
      <div>
        {/* Frame de Mídia Uniforme */}
        <div className={`relative w-full h-60 sm:h-64 bg-neutral-950 overflow-hidden flex items-center justify-center ${isPinned ? "m-2 w-[calc(100%-1rem)] rounded-[1.4rem]" : ""}`}>
          {isVideo ? (
            <video
              src={getMediaUrl(image)}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          ) : isOutroArquivo ? (
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col items-center justify-center text-white p-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-artOrange border border-white/10 flex items-center justify-center text-2xl mb-2 shadow-inner">
                <i className={
                  isPdf ? "fa-solid fa-file-pdf" :
                  isDoc ? "fa-solid fa-file-lines" :
                  is3D ? "fa-solid fa-cube" :
                  isArchive ? "fa-solid fa-file-zipper" :
                  "fa-solid fa-file"
                }></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-artOrange bg-artOrange/20 px-2.5 py-0.5 rounded-full border border-artOrange/30 truncate max-w-[140px]">
                {ext.toUpperCase()}
              </span>
            </div>
          ) : (
            <img
              src={getMediaUrl(image) || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800";
                setImageLoaded(true);
              }}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                imageLoaded ? "filter-none opacity-100" : "blur-md opacity-60 scale-105"
              }`}
            />
          )}

          {marcaDagua && <WatermarkOverlay nomeUsuario={obra.usuario?.nome || "Artista"} />}

          {/* Preço Base no canto superior esquerdo */}
          {precoBase && (
            <div className="absolute top-3 left-3 z-10 pointer-events-auto">
              <PriceBadge preco={precoBase} />
            </div>
          )}

          {/* Múltiplos Arquivos Badge */}
          {Array.isArray(obra.arquivos) && obra.arquivos.length > 1 && (
            <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-sm">
              <i className="fa-solid fa-layer-group text-[8px]"></i>
              <span>{obra.arquivos.length}</span>
            </div>
          )}

          {/* Botão de Fixar para o autor da obra (visível no hover quando NÃO estiver fixada) */}
          {props.isOwner && props.onToggleFixar && !isPinned && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.onToggleFixar(id);
              }}
              className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-white/95 hover:bg-artOrange hover:text-white shadow-md border border-black/10 text-gray-500 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
              style={precoBase ? { top: "2.75rem" } : {}}
              title="Fixar no topo do perfil (máximo 3)"
            >
              <i className="fa-solid fa-thumbtack text-xs"></i>
            </button>
          )}

          {/* Canto superior direito: Categoria e Alfinete 2D simples */}
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
            {category && (
              <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-artDark shadow-sm truncate max-w-[120px]">
                {category}
              </div>
            )}

            {isPinned && (
              <div
                onClick={(e) => {
                  if (props.isOwner && props.onToggleFixar) {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onToggleFixar(id);
                  }
                }}
                className={`w-7 h-7 rounded-full bg-artOrange text-white shadow-md flex items-center justify-center text-xs pointer-events-auto select-none transition-all ${
                  props.isOwner ? "cursor-pointer hover:scale-110 active:scale-95" : ""
                }`}
                title={props.isOwner ? "Obra fixada no topo (Clique para desafixar)" : "Obra fixada no topo do perfil"}
              >
                <i className="fa-solid fa-thumbtack"></i>
              </div>
            )}
          </div>
        </div>

        {/* Metadados e Título da Obra */}
        <div className="p-5 pb-0">
          {category && (
            <span className={`text-[9px] font-bold uppercase tracking-widest ${color} block mb-1 truncate`}>
              {category}
            </span>
          )}

          <h3
            className="font-editorial text-lg sm:text-xl italic font-bold group-hover:text-artOrange transition-colors truncate block w-full"
            title={title}
          >
            {title}
          </h3>

          {description && (
            <p
              className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-1 font-light break-words overflow-hidden"
              title={description}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Barra de Engajamento Inferior */}
      <div className="p-5 pt-3">
        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors" title="Curtidas">
              <i className="fa-regular fa-heart"></i>
              <span>{obra.totalCurtidas ?? obra.total_curtidas ?? 0}</span>
            </span>

            <span className="flex items-center gap-1.5 hover:text-amber-500 transition-colors" title="Salvos nos favoritos">
              <i className="fa-regular fa-bookmark"></i>
              <span>{obra.totalSalvos ?? obra.total_salvos ?? 0}</span>
            </span>

            <span className="flex items-center gap-1.5 hover:text-artBlue transition-colors" title="Comentários">
              <i className="fa-regular fa-comment"></i>
              <span>{obra.totalComentarios ?? obra.total_comentarios ?? 0}</span>
            </span>
          </div>

          <div
            className="w-8 h-8 rounded-full bg-artDark text-white group-hover:bg-artOrange transition-all flex items-center justify-center shadow-sm shrink-0"
            title="Ver detalhes da obra"
          >
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </div>
        </div>
      </div>
    </Link>
  );
}