import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuOpcoes from "./MenuOpcoes";
import ModalDenuncia from "./ModalDenuncia";
import ModalConversao from "./ModalConversao";
import PriceBadge from "./PriceBadge";
import WatermarkOverlay from "./WatermarkOverlay";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, usuarioService, getMediaUrl } from "../services/api";
import { getEstiloCategoria } from "../constants/categories";
import { desempacotarDadosObra, getAvatarLedStyle } from "../utils/obraHelper";

const colorClasses = {
  artPurple: "bg-artPurple",
  artBlue: "bg-artBlue",
  artOrange: "bg-artOrange",
  artDark: "bg-artDark",
};

export default function PostCard(props) {
  const post = props.post || {};
  const { user: authUser, isGuest: authIsGuest } = useAuth();

  // Mapeamento estruturado de dados da postagem
  const id = props.id ?? post.id ?? 1;
  const dadosObra = desempacotarDadosObra(post);
  const title = props.title ?? dadosObra.titulo ?? `Obra #${id}`;
  const description = props.description ?? dadosObra.descricao ?? "";
  const precoBase = props.precoBase ?? post.preco_base ?? post.precoBase ?? dadosObra.precoBase;
  const marcaDagua = props.marcaDagua ?? post.marca_dagua ?? post.marcaDagua ?? dadosObra.marcaDagua;
  const bloquearDownload = props.bloquearDownload ?? post.bloquear_download ?? post.bloquearDownload ?? dadosObra.bloquearDownload;

  const image = props.image ?? props.imagem ?? props.url_imagem ?? post.arquivoUrl ?? post.arquivo_url ?? post.imagem ?? post.url_imagem ?? "";
  const dataPostagem = post.dataPostagem ?? props.dataPostagem ?? null;

  // Autor da postagem
  const autor = post.usuario ?? post.autor ?? props.usuario ?? props.autor ?? {};
  const userId = props.userId ?? autor.id ?? post.idUsuario;
  const user = props.user ?? autor.nome ?? "Artista";
  const avatar = props.avatar ?? autor.fotoPerfil ?? autor.avatar ?? "";
  const planoAutor = (autor.plano ?? post.plano ?? "Free").toLowerCase();
  const temLed = autor.mostrar_moldura_led !== false;

  // Categorias
  const cats = Array.isArray(post.categorias) && post.categorias.length > 0
    ? post.categorias
    : (post.categoria ? [post.categoria] : (props.tag ? [{ nomeCategoria: props.tag }] : []));

  // Contexto de usuário e permissões
  const isGuest = props.isGuest ?? authIsGuest;
  const currentUserId = props.currentUserId ?? authUser?.id;
  const isMe = !isGuest && currentUserId === userId;

  // Estados locais reativos
  const [totalCurtidas, setTotalCurtidas] = useState(
    Number(props.likes ?? post.total_curtidas ?? post.curtidas ?? post.totalCurtidas ?? post.likes ?? 0)
  );
  const [totalComentarios, setTotalComentarios] = useState(
    Number(props.comments ?? post.total_comentarios ?? post.comentarios ?? post.totalComentarios ?? 0)
  );
  const [isLiked, setIsLiked] = useState(
    Boolean(props.curtidoPorMim ?? props.curtido ?? post.curtido_por_mim ?? post.usuario_curtiu ?? false)
  );
  const [isSaved, setIsSaved] = useState(
    Boolean(props.salvoPorMim ?? props.salvo ?? post.salvo_por_mim ?? post.usuario_salvou ?? false)
  );
  const [isFollowing, setIsFollowing] = useState(
    Boolean(props.isFollowing ?? props.seguindo ?? post.seguindo_usuario ?? autor.usuario_seguindo ?? false)
  );
  const [seguidoresAuthor, setSeguidoresAuthor] = useState(
    Number(props.seguidores ?? post.seguidores ?? autor.total_seguidores ?? autor.seguidores ?? 0)
  );
  const [imageLoaded, setImageLoaded] = useState(false);

  // Modais de suporte
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [modalConversaoAberto, setModalConversaoAberto] = useState(false);
  const [acaoTentada, setAcaoTentada] = useState("interagir");

  // Sincronização quando as props mudarem (ex: refresh do feed ou busca)
  useEffect(() => {
    setTotalCurtidas(Number(props.likes ?? post.total_curtidas ?? post.curtidas ?? post.totalCurtidas ?? post.likes ?? 0));
  }, [props.likes, post.total_curtidas, post.curtidas, post.totalCurtidas, post.likes]);

  useEffect(() => {
    setTotalComentarios(Number(props.comments ?? post.total_comentarios ?? post.comentarios ?? post.totalComentarios ?? 0));
  }, [props.comments, post.total_comentarios, post.comentarios, post.totalComentarios]);

  useEffect(() => {
    setIsLiked(Boolean(props.curtidoPorMim ?? props.curtido ?? post.curtido_por_mim ?? post.usuario_curtiu));
  }, [props.curtidoPorMim, props.curtido, post.curtido_por_mim, post.usuario_curtiu]);

  useEffect(() => {
    setIsSaved(Boolean(props.salvoPorMim ?? props.salvo ?? post.salvo_por_mim ?? post.usuario_salvou));
  }, [props.salvoPorMim, props.salvo, post.salvo_por_mim, post.usuario_salvou]);

  useEffect(() => {
    setIsFollowing(Boolean(props.isFollowing ?? props.seguindo ?? post.seguindo_usuario ?? autor.usuario_seguindo));
  }, [props.isFollowing, props.seguindo, post.seguindo_usuario, autor.usuario_seguindo]);

  useEffect(() => {
    setSeguidoresAuthor(Number(props.seguidores ?? post.seguidores ?? autor.total_seguidores ?? autor.seguidores ?? 0));
  }, [props.seguidores, post.seguidores, autor.total_seguidores, autor.seguidores]);

  // Sincronização reativa em tempo real via evento global 'artfolio_sync' (WebSocket)
  useEffect(() => {
    const handleSync = (e) => {
      const dados = e.detail;
      if (!dados) return;

      const targetPostId = dados.postagem_id ?? dados.idPostagem ?? dados.id_postagem;
      if (Number(targetPostId) === Number(id) || Number(targetPostId) === Number(post.id)) {
        if ((dados.tipo === "CURTIDA" || dados.tipo === "LIKE") && dados.total_curtidas !== undefined) {
          setTotalCurtidas(dados.total_curtidas);
        } else if ((dados.tipo === "COMENTARIO" || dados.tipo === "COMMENT") && dados.total_comentarios !== undefined) {
          setTotalComentarios(dados.total_comentarios);
        }
      }

      // Sincronizar contagem de seguidores do autor da publicação
      if (dados.tipo === "SEGUIDOR" && userId && Number(dados.seguido_id) === Number(userId)) {
        if (typeof dados.total_seguidores === "number") {
          setSeguidoresAuthor(dados.total_seguidores);
        }
      }
    };

    window.addEventListener("artfolio_sync", handleSync);
    return () => window.removeEventListener("artfolio_sync", handleSync);
  }, [id, post.id, userId]);

  // Interação: Curtir / Descurtir
  const handleLikeClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isGuest) {
      setAcaoTentada("curtir esta obra");
      setModalConversaoAberto(true);
      return;
    }

    if (props.onToggleLike) {
      props.onToggleLike(id, isLiked);
      return;
    }

    if (props.onCurtir) {
      props.onCurtir(id);
      return;
    }

    try {
      if (isLiked) {
        setIsLiked(false);
        setTotalCurtidas((prev) => Math.max(0, prev - 1));
        await obrasService.descurtir(id);
      } else {
        setIsLiked(true);
        setTotalCurtidas((prev) => prev + 1);
        await obrasService.curtir(id);
      }
    } catch (err) {
      console.error("Erro ao curtir/descurtir obra:", err);
      // Reverter em caso de falha
      setIsLiked((prev) => !prev);
      setTotalCurtidas((prev) => (isLiked ? prev + 1 : Math.max(0, prev - 1)));
      if (props.mostrarAviso) {
        props.mostrarAviso(err.message || "Erro ao alterar curtida.", "error");
      }
    }
  };

  // Interação: Salvar / Favoritar
  const handleSaveClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isGuest) {
      setAcaoTentada("salvar esta obra nos seus favoritos");
      setModalConversaoAberto(true);
      return;
    }

    if (props.onToggleSave) {
      props.onToggleSave(id, isSaved);
      return;
    }

    if (props.onSalvar) {
      props.onSalvar(id);
      return;
    }

    try {
      if (isSaved) {
        setIsSaved(false);
        await obrasService.removerSalvo(id);
        if (props.mostrarAviso) props.mostrarAviso("Obra removida dos favoritos com sucesso.", "info");
      } else {
        setIsSaved(true);
        await obrasService.salvarObra(id);
        if (props.mostrarAviso) props.mostrarAviso("Obra salva nos favoritos!", "info");
      }
    } catch (err) {
      console.error("Erro ao salvar obra:", err);
      setIsSaved((prev) => !prev);
      if (props.mostrarAviso) props.mostrarAviso(err.message || "Erro ao favoritar obra.", "error");
    }
  };

  // Interação: Seguir / Deixar de Seguir Autor
  const handleFollowClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isGuest) {
      setAcaoTentada("seguir este artista");
      setModalConversaoAberto(true);
      return;
    }

    if (!userId) return;

    if (props.onToggleFollow) {
      props.onToggleFollow(userId, isFollowing);
      return;
    }

    if (props.onSeguir) {
      props.onSeguir(userId);
      return;
    }

    try {
      const estaSeguindo = isFollowing;
      setIsFollowing(!estaSeguindo);
      setSeguidoresAuthor((prev) => (estaSeguindo ? Math.max(0, prev - 1) : prev + 1));

      if (estaSeguindo) {
        await usuarioService.deixarDeSeguir(userId);
        if (props.mostrarAviso) props.mostrarAviso(`Você deixou de seguir ${user}.`, "info");
      } else {
        await usuarioService.seguir(userId);
        if (props.mostrarAviso) props.mostrarAviso(`Você começou a seguir ${user}!`, "info");
      }
    } catch (err) {
      console.error("Erro ao seguir artista:", err);
      setIsFollowing((prev) => !prev);
      setSeguidoresAuthor((prev) => (isFollowing ? prev + 1 : Math.max(0, prev - 1)));
      if (props.mostrarAviso) props.mostrarAviso(err.message || "Erro ao alternar seguidor.", "error");
    }
  };

  // Interação: Denúncia
  const handleDenunciarClick = () => {
    if (isGuest) {
      setAcaoTentada("denunciar uma publicação");
      setModalConversaoAberto(true);
      return;
    }

    if (props.onDenunciar) {
      props.onDenunciar(post);
    } else {
      setModalDenunciaAberto(true);
    }
  };

  // Moldura LED do Avatar conforme plano com suporte a Boost HEX
  const ledInfo = getAvatarLedStyle(autor);

  return (
    <>
      <article className="bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group flex flex-col justify-between h-full relative">
        {/* Mídia da Obra com Proporção Uniforme e Proteções */}
        <div
          onContextMenu={(e) => {
            if (bloquearDownload) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="relative overflow-hidden bg-neutral-950 flex items-center justify-center w-full h-60 sm:h-64"
        >
          <Link to={`/obra/${id}`} className="w-full h-full flex items-center justify-center relative">
            {(() => {
              const ext = (image || "").split("?")[0].split(".").pop().toLowerCase();
              const isVideo = ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext);
              const isPdf = ["pdf"].includes(ext);
              const isDoc = ["doc", "docx", "txt", "odt", "rtf", "ppt", "pptx"].includes(ext);
              const is3D = ["obj", "fbx", "gltf", "glb", "stl", "blend", "dae"].includes(ext);
              const isArchive = ["zip", "rar", "7z", "psd", "ai", "eps"].includes(ext);
              const isOutroArquivo = isPdf || isDoc || is3D || isArchive;

              if (isVideo) {
                return (
                  <video
                    src={getMediaUrl(image)}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                );
              }

              if (isOutroArquivo) {
                return (
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
                );
              }

              return (
                <div className="relative w-full h-full flex items-center justify-center bg-neutral-950 overflow-hidden">
                  <img
                    src={getMediaUrl(image) || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"}
                    alt={title || "Obra"}
                    draggable={!bloquearDownload}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800";
                      setImageLoaded(true);
                    }}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                      imageLoaded ? "filter-none opacity-100" : "blur-md opacity-60 scale-105"
                    }`}
                  />

                  {/* Marca d'água no card se ativa */}
                  {marcaDagua && (
                    <WatermarkOverlay nomeUsuario={user} />
                  )}
                </div>
              );
            })()}
          </Link>

          {/* Badges de Destaque Boost, Preço Base e Múltiplos Arquivos */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
            {post.destaque_boost && (
              <div className="bg-gradient-to-r from-artOrange to-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-artOrange/30 pointer-events-auto">
                <i className="fa-solid fa-bolt text-[9px] animate-pulse"></i>
                <span>Em Alta</span>
              </div>
            )}

            {precoBase && (
              <div className="pointer-events-auto">
                <PriceBadge preco={precoBase} />
              </div>
            )}

            {Array.isArray(post.arquivos) && post.arquivos.length > 1 && (
              <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-sm pointer-events-auto">
                <i className="fa-solid fa-layer-group text-[8px]"></i>
                <span>{post.arquivos.length}</span>
              </div>
            )}
          </div>

          {/* Menu de Opções Contextual */}
          <div className="absolute top-3 right-3 z-10">
            <MenuOpcoes
              tipo="obra"
              detalhesLink={`/obra/${id}`}
              isSalvo={isSaved}
              onSalvar={handleSaveClick}
              onDenunciar={handleDenunciarClick}
              onCopiarLinkSuccess={(msg) => props.mostrarAviso && props.mostrarAviso(msg, "info")}
            />
          </div>
        </div>

        {/* Conteúdo e Metadados */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Categorias e Data de Publicação */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex flex-wrap gap-1.5 min-w-0 max-w-[70%]">
                {cats.map((c, i) => {
                  const catNome = c?.nomeCategoria || c?.nome || (typeof c === "string" ? c : "Arte");
                  const estilo = getEstiloCategoria(catNome) || { corTag: "bg-artPurple/10 text-artPurple" };
                  return (
                    <span
                      key={c?.id || i}
                      className={`${estilo.corTag || "bg-artPurple/10 text-artPurple"} px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border truncate max-w-[120px]`}
                      title={catNome}
                    >
                      {catNome}
                    </span>
                  );
                })}
              </div>

              {dataPostagem && (
                <span className="text-[10px] text-gray-400 font-bold shrink-0">
                  {new Date(dataPostagem).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>

            {/* Título com Tipografia Editorial e Truncamento com Ellipsis */}
            {title && (
              <Link to={`/obra/${id}`} className="block">
                <h2
                  className="font-editorial text-lg sm:text-xl italic font-bold leading-snug mb-1.5 text-artDark hover:text-artPurple transition-colors truncate block w-full"
                  title={title}
                >
                  {title}
                </h2>
              </Link>
            )}

            {/* Descrição resumida com line-clamp-2 e quebra segura */}
            {description && (
              <p
                className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3 font-light break-words overflow-hidden"
                title={description}
              >
                {description}
              </p>
            )}
          </div>

          {/* Autor */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-black/5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Link
                to={isMe ? "/perfil" : (userId ? `/artista/${userId}` : "/feed")}
                style={ledInfo.style}
                className={`w-8 h-8 rounded-full bg-artPurple ${ledInfo.className} overflow-hidden shrink-0 block hover:opacity-85 transition-all`}
                title={`Ver perfil de ${user}`}
              >
                {avatar ? (
                  <img
                    src={getMediaUrl(avatar)}
                    alt={user}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-artPurple flex items-center justify-center text-white text-xs font-bold">
                    {user?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  to={isMe ? "/perfil" : (userId ? `/artista/${userId}` : "/feed")}
                  className="text-xs sm:text-sm font-bold truncate block hover:text-artPurple transition-colors max-w-[140px]"
                  title={user}
                >
                  {user}
                </Link>
                <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 truncate">
                  Artista • {seguidoresAuthor} seg.
                </p>
              </div>
            </div>

            {!isMe && userId && (
              <button
                type="button"
                onClick={handleFollowClick}
                className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all shrink-0 ${
                  isFollowing
                    ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                    : "bg-artDark text-white hover:bg-artPurple"
                }`}
              >
                {isFollowing ? "Seguindo" : "+ Seguir"}
              </button>
            )}
          </div>

          {/* Barra de Interação (Curtir, Salvar, Comentários, Link) */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
            <div className="flex items-center gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={handleLikeClick}
                className={`flex items-center gap-1.5 transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
                title={isLiked ? "Remover curtida" : "Curtir obra"}
              >
                <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                <span>{totalCurtidas}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveClick}
                className={`flex items-center gap-1.5 transition-all ${
                  isSaved
                    ? "text-amber-500 scale-110"
                    : "text-gray-400 hover:text-amber-500"
                }`}
                title={isSaved ? "Remover dos favoritos" : "Salvar obra nos favoritos"}
              >
                <i className={isSaved ? "fa-solid fa-bookmark text-amber-500" : "fa-regular fa-bookmark"}></i>
              </button>

              <Link
                to={`/obra/${id}`}
                className="flex items-center gap-1.5 text-gray-400 hover:text-artBlue transition-colors"
                title="Comentários"
              >
                <i className="fa-regular fa-comment"></i>
                <span>{totalComentarios}</span>
              </Link>
            </div>

            <Link
              to={`/obra/${id}`}
              className="w-8 h-8 rounded-full bg-artDark text-white hover:bg-artPurple transition-all flex items-center justify-center shrink-0 shadow-sm"
              title="Ver detalhes da obra"
            >
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </article>

      {/* Modal de Denúncia Interno (Fallback caso não venha callback do pai) */}
      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        postagemId={id}
        alvo={title}
        onSucesso={(msg) => props.mostrarAviso && props.mostrarAviso(msg, "info")}
        onErro={(msg) => props.mostrarAviso && props.mostrarAviso(msg, "error")}
      />

      {/* Modal de Conversão para Visitantes (Guest) */}
      <ModalConversao
        isOpen={modalConversaoAberto}
        onClose={() => setModalConversaoAberto(false)}
        acao={acaoTentada}
      />
    </>
  );
}