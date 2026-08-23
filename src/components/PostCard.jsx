import { useState } from "react";
import { Link } from "react-router-dom";
import MenuOpcoes from "./MenuOpcoes";
import ModalDenuncia from "./ModalDenuncia";
import { obrasService, getMediaUrl } from "../services/api";

const colorClasses = {
  artPurple: "bg-artPurple",
  artBlue: "bg-artBlue",
  artOrange: "bg-artOrange",
  artDark: "bg-artDark",
};

export default function PostCard(props) {
  const post = props.post || {};
  const id = props.id || post.id || 1;
  const image = props.image || post.arquivoUrl || post.arquivo_url || "";
  const avatar = props.avatar || post.usuario?.fotoPerfil || post.usuario?.avatar || "";
  const user = props.user || post.usuario?.nome || "Artista";
  const userId = props.userId || post.usuario?.id || post.idUsuario;
  const title = props.title || post.legenda || `Obra #${id}`;
  const description = props.description || post.descricao || "";
  const tag = props.tag || (post.categorias && post.categorias[0]?.nomeCategoria) || post.categoria?.nomeCategoria || "";
  const likes = props.likes ?? post.likes ?? post.totalCurtidas ?? 0;
  const comments = props.comments ?? post.comentarios ?? post.totalComentarios ?? 0;
  const curtidoPorMim = props.curtidoPorMim ?? post.curtido_por_mim ?? false;
  const salvoPorMim = props.salvoPorMim ?? post.salvo_por_mim ?? false;
  const color = props.color || "artPurple";

  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [likesCount, setLikesCount] = useState(Number(likes) || 0);
  const [isLiked, setIsLiked] = useState(Boolean(curtidoPorMim));
  const [isSaved, setIsSaved] = useState(Boolean(salvoPorMim));

  const avatarColor = colorClasses[color] || "bg-artPurple";

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isLiked) {
        await obrasService.descurtir(id);
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await obrasService.curtir(id);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isSaved) {
        await obrasService.removerSalvo(id);
        setIsSaved(false);
      } else {
        await obrasService.salvarObra(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  return (
    <>
      <article className="relative break-inside-avoid bg-white rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-black/5">
        <Link
          to={`/obra/${id}`}
          className="absolute inset-0 z-10"
          aria-label={`Ver detalhes da obra ${title}`}
        />

        <div className="relative overflow-hidden">
          <img
            src={getMediaUrl(image)}
            alt={title || "Obra"}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800";
            }}
            className="w-full h-auto group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
            {tag && (
              <div className="bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                {tag}
              </div>
            )}

            <MenuOpcoes
              tipo="obra"
              detalhesLink={`/obra/${id}`}
              isSalvo={isSaved}
              onSalvar={handleSaveClick}
              onDenunciar={() => setModalDenunciaAberto(true)}
            />
          </div>
        </div>

        <div className="relative z-20 p-6">
          <div className="flex items-center space-x-3 mb-5">
            <Link
              to={userId ? `/artista/${userId}` : "/feed"}
              className={`w-8 h-8 rounded-full ${avatarColor} overflow-hidden block hover:opacity-85 transition-opacity`}
            >
              {avatar ? (
                <img
                  src={getMediaUrl(avatar)}
                  alt={user}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                  {user?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </Link>

            <Link
              to={userId ? `/artista/${userId}` : "/feed"}
              className="text-xs font-bold tracking-tight hover:text-artPurple transition-colors truncate"
            >
              {user || "Artista"}
            </Link>
          </div>

          <h4 className="font-editorial text-2xl italic leading-tight group-hover:text-artPurple transition-colors">
            {title}
          </h4>

          {description && (
            <p className="text-sm text-gray-400 mt-2 font-light line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-5 pt-5 border-t border-black/5 flex justify-between items-center">
            <div className="flex space-x-5 text-gray-400">
              <button
                type="button"
                onClick={handleLikeClick}
                className={`relative z-30 transition-colors flex items-center space-x-1.5 ${
                  isLiked ? "text-red-500" : "hover:text-artOrange"
                }`}
                title={isLiked ? "Remover curtida" : "Curtir obra"}
              >
                <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                <span className="text-[10px] font-bold">{likesCount}</span>
              </button>

              <Link
                to={`/obra/${id}`}
                className="relative z-30 hover:text-artBlue transition-colors flex items-center space-x-1.5"
                title="Comentários"
              >
                <i className="fa-regular fa-comment"></i>
                <span className="text-[10px] font-bold">{comments}</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleSaveClick}
              className={`relative z-30 transition-all ${
                isSaved
                  ? "text-amber-500 scale-110"
                  : "text-gray-400 hover:text-amber-500 hover:scale-110"
              }`}
              title={isSaved ? "Remover dos favoritos" : "Salvar nos favoritos"}
            >
              <i className={isSaved ? "fa-solid fa-bookmark text-amber-500" : "fa-regular fa-bookmark"}></i>
            </button>
          </div>
        </div>
      </article>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        tipo="obra"
        alvo={title}
      />
    </>
  );
}