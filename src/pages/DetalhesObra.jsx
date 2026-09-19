import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import ModalConversao from "../components/ModalConversao";
import LightboxModal from "../components/LightboxModal";
import ModalConfirmarExclusao from "../components/ModalConfirmarExclusao";
import PriceBadge from "../components/PriceBadge";
import ProtectedImageWrapper from "../components/ProtectedImageWrapper";
import WatermarkOverlay from "../components/WatermarkOverlay";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, usuarioService, getMediaUrl } from "../services/api";
import { getEstiloCategoria } from "../constants/categories";
import { desempacotarDadosObra, getAvatarLedStyle } from "../utils/obraHelper";
import ArtCanvasViewer from "../components/ArtCanvasViewer";
import PaletteExtractor from "../components/PaletteExtractor";

export default function DetalhesObra() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principais da obra
  const [obraDetalhe, setObraDetalhe] = useState(null);
  const [ambientColors, setAmbientColors] = useState(["#FF793F", "#6C5CE7"]);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");

  // Estado da mensagem direta contextualizada sobre a obra
  const [mensagemDireta, setMensagemDireta] = useState("");
  const [enviandoMensagemDireta, setEnviandoMensagemDireta] = useState(false);

  // Estados de engajamento e métricas
  const [isSalvo, setIsSalvo] = useState(false);
  const [isCurtido, setIsCurtido] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  // Estados do autor e relacionamento de seguir
  const [isSeguindo, setIsSeguindo] = useState(false);
  const [seguidoresCount, setSeguidoresCount] = useState(0);
  const [followingLoading, setFollowingLoading] = useState(false);

  // Estados de carrossel (múltiplas imagens)
  const [slideIndex, setSlideIndex] = useState(0);

  // Estados de Modais
  const [modalZoomAberto, setModalZoomAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [denunciaAtual, setDenunciaAtual] = useState({ tipo: "obra", alvo: "" });
  const [modalConversaoAberto, setModalConversaoAberto] = useState(false);
  const [acaoTentada, setAcaoTentada] = useState("interagir");

  // Estados de feedback e carregamento
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const { user: currentUser, isAuthenticated, isGuest } = useAuth();

  const autor = obraDetalhe?.autor || obraDetalhe?.usuario || {};
  const isOwner = Boolean(
    currentUser &&
    (obraDetalhe?.idUsuario === currentUser.id ||
     obraDetalhe?.id_usuario === currentUser.id ||
     autor.id === currentUser.id)
  );
  const isDono = isOwner;

  const dadosEstruturados = desempacotarDadosObra(obraDetalhe);
  const tituloObra = dadosEstruturados.titulo || (obraDetalhe ? `Obra #${obraDetalhe.id}` : "");
  const descricaoObra = dadosEstruturados.descricao || "";
  const precoBaseObra = dadosEstruturados.precoBase;
  const marcaDaguaObra = dadosEstruturados.marcaDagua;
  const bloquearDownloadObra = dadosEstruturados.bloquearDownload;
  const bloquearPrintObra = dadosEstruturados.bloquearPrint;

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const carregarDadosObra = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const dadosObra = await obrasService.obterObraPorId(id);
      if (dadosObra && dadosObra.id) {
        setObraDetalhe(dadosObra);

        // Mapeamento das métricas reais do backend
        const curtidasReais = dadosObra.total_curtidas ?? dadosObra.totalCurtidas ?? dadosObra.likes ?? 0;
        const viewsReais = dadosObra.total_visualizacoes ?? dadosObra.visualizacoes ?? 0;
        setLikesCount(Number(curtidasReais));
        setViewsCount(Number(viewsReais));
        setIsCurtido(Boolean(dadosObra.usuario_curtiu ?? dadosObra.curtido_por_mim));
        setIsSalvo(Boolean(dadosObra.usuario_salvou ?? dadosObra.salvo_por_mim));

        // Mapeamento dos dados do autor
        const autor = dadosObra.autor || dadosObra.usuario || {};
        setIsSeguindo(Boolean(autor.usuario_seguindo ?? autor.seguindo_usuario));
        setSeguidoresCount(Number(autor.total_seguidores ?? autor.seguidores ?? 0));
      }

      const listaComentarios = await obrasService.listarComentarios(id);
      setComentarios(listaComentarios || []);

      if (isAuthenticated && !isGuest) {
        try {
          const resSalvo = await obrasService.checarSalvo(id);
          if (resSalvo && typeof resSalvo.salvo === "boolean") {
            setIsSalvo(resSalvo.salvo);
          }
        } catch {
          // Fallback silencioso
        }
      }
    } catch (err) {
      console.error("Erro ao carregar obra:", err);
      mostrarAviso(err.message || "Obra não encontrada.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosObra();
  }, [id, isAuthenticated]);

  // Sincronização reativa em tempo real para Detalhes da Obra
  useEffect(() => {
    const handleSync = (e) => {
      const payload = e.detail;
      if (!payload) return;

      const targetPostId = payload.postagem_id || payload.id_postagem || payload.idPostagem;
      if (Number(targetPostId) === Number(id)) {
        if (payload.tipo === "CURTIDA" || payload.tipo === "LIKE") {
          if (typeof payload.total_curtidas === "number") {
            setLikesCount(payload.total_curtidas);
          } else {
            setLikesCount((prev) => prev + 1);
          }
        } else if (payload.tipo === "COMENTARIO" || payload.tipo === "COMMENT") {
          // Atualizar lista de comentários da obra
          obrasService.listarComentarios(id).then((items) => {
            if (Array.isArray(items)) setComentarios(items);
          }).catch(() => {});
        }
      }

      // Sincronizar contagem de seguidores do autor se o evento for para este perfil
      const autor = obraDetalhe?.autor || obraDetalhe?.usuario;
      if (payload.tipo === "SEGUIDOR" && autor && Number(payload.seguido_id) === Number(autor.id)) {
        if (typeof payload.total_seguidores === "number") {
          setSeguidoresCount(payload.total_seguidores);
        }
      }
    };

    window.addEventListener("artfolio_sync", handleSync);
    return () => window.removeEventListener("artfolio_sync", handleSync);
  }, [id, obraDetalhe]);

  // Ação de Seguir / Deixar de Seguir Artista
  const handleToggleFollow = async () => {
    if (isGuest || !isAuthenticated) {
      setAcaoTentada("seguir este artista");
      setModalConversaoAberto(true);
      return;
    }

    const autor = obraDetalhe?.autor || obraDetalhe?.usuario;
    const autorId = autor?.id;
    if (!autorId || autorId === currentUser?.id) return;

    const novoStatusSeguindo = !isSeguindo;
    setIsSeguindo(novoStatusSeguindo);
    setSeguidoresCount((prev) => (novoStatusSeguindo ? prev + 1 : Math.max(0, prev - 1)));
    setFollowingLoading(true);

    try {
      const res = novoStatusSeguindo
        ? await usuarioService.seguir(autorId)
        : await usuarioService.deixarDeSeguir(autorId);

      if (res && typeof res.total_seguidores === "number") {
        setSeguidoresCount(res.total_seguidores);
      }
      if (res && typeof res.seguindo === "boolean") {
        setIsSeguindo(res.seguindo);
      }

      if (novoStatusSeguindo) {
        mostrarAviso(`Você começou a seguir ${autor.nome || "o artista"}!`, "success");
      } else {
        mostrarAviso(`Você deixou de seguir ${autor.nome || "o artista"}.`, "info");
      }
    } catch (err) {
      setIsSeguindo(!novoStatusSeguindo);
      setSeguidoresCount((prev) => (novoStatusSeguindo ? Math.max(0, prev - 1) : prev + 1));
      mostrarAviso(err.message || "Erro ao alterar seguidor.", "error");
    } finally {
      setFollowingLoading(false);
    }
  };

  // Ação de Curtir / Descurtir Obra
  const handleToggleLike = async () => {
    if (isGuest || !isAuthenticated) {
      setAcaoTentada("curtir esta obra");
      setModalConversaoAberto(true);
      return;
    }

    const novoStatusCurtido = !isCurtido;
    setIsCurtido(novoStatusCurtido);
    setLikesCount((prev) => (novoStatusCurtido ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (novoStatusCurtido) {
        await obrasService.curtir(id);
      } else {
        await obrasService.descurtir(id);
      }
    } catch (err) {
      setIsCurtido(!novoStatusCurtido);
      setLikesCount((prev) => (novoStatusCurtido ? Math.max(0, prev - 1) : prev + 1));
      mostrarAviso(err.message || "Erro ao alterar curtida.", "error");
    }
  };

  // Ação de Salvar / Remover dos Favoritos
  const handleToggleSave = async () => {
    if (isGuest || !isAuthenticated) {
      setAcaoTentada("salvar esta obra nos seus favoritos");
      setModalConversaoAberto(true);
      return;
    }

    const novoStatusSalvo = !isSalvo;
    setIsSalvo(novoStatusSalvo);

    try {
      if (novoStatusSalvo) {
        await obrasService.salvarObra(id);
        mostrarAviso("Obra salva nos favoritos!", "success");
      } else {
        await obrasService.removerSalvo(id);
        mostrarAviso("Obra removida dos favoritos.", "info");
      }
    } catch (err) {
      setIsSalvo(!novoStatusSalvo);
      mostrarAviso(err.message || "Erro ao alterar salvamento.", "error");
    }
  };

  // Envio de Comentário
  const handleComentarioSubmit = async (event) => {
    event.preventDefault();
    if (!novoComentario.trim()) return;

    if (isGuest || !isAuthenticated) {
      setAcaoTentada("comentar nesta publicação");
      setModalConversaoAberto(true);
      return;
    }

    setSubmittingComment(true);
    try {
      const comentarioCriado = await obrasService.criarComentario(id, novoComentario.trim());
      setComentarios((prev) => [...prev, comentarioCriado]);
      setNovoComentario("");
      mostrarAviso("Comentário publicado com sucesso!", "success");
    } catch (err) {
      mostrarAviso(err.message || "Erro ao adicionar comentário.", "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletarComentario = async (comentarioId) => {
    try {
      await obrasService.deletarComentario(comentarioId);
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
      mostrarAviso("Comentário removido com sucesso!", "success");
    } catch (err) {
      mostrarAviso(err.message || "Erro ao remover comentário.", "error");
    }
  };

  const handleExcluirObraConfirmado = async () => {
    setDeleting(true);
    try {
      await obrasService.deletarObra(id);
      mostrarAviso("Obra excluída com sucesso! Redirecionando...", "success");
      setTimeout(() => {
        navigate("/meu-portfolio");
      }, 1200);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao excluir a obra.", "error");
      setDeleting(false);
    }
  };

  const handleEnviarMensagemDireta = (e) => {
    if (e) e.preventDefault();
    if (isGuest || !isAuthenticated) {
      setAcaoTentada("enviar mensagem sobre esta obra");
      setModalConversaoAberto(true);
      return;
    }
    const autor = obraDetalhe?.autor || obraDetalhe?.usuario || {};
    const textoDigitado =
      mensagemDireta.trim() ||
      `Olá ${autor.nome || "artista"}! Tenho interesse nesta obra e gostaria de conversar a respeito.`;

    const imgPrincipal =
      obraDetalhe.imagem ||
      obraDetalhe.url_imagem ||
      obraDetalhe.arquivoUrl ||
      (Array.isArray(obraDetalhe.arquivos) && obraDetalhe.arquivos[0]?.url) ||
      "";

    // Estrutura de anexo para ser exibida nos balões de chat de ambos
    const anexoObj = {
      id: id,
      titulo: tituloObra || "Obra de Arte",
      imagem: imgPrincipal,
      preco: precoBaseObra || "",
    };

    const msgCompleta = `[OBRA_ANEXO:${JSON.stringify(anexoObj)}]\n${textoDigitado}`;

    navigate(
      `/mensagens?artistaId=${autor.id}&destNome=${encodeURIComponent(
        autor.nome || "Artista"
      )}&destFoto=${encodeURIComponent(
        autor.foto_perfil || autor.fotoPerfil || ""
      )}&msg=${encodeURIComponent(msgCompleta)}&obraId=${id}&obraTitulo=${encodeURIComponent(
        tituloObra || ""
      )}&obraImagem=${encodeURIComponent(imgPrincipal)}&obraPreco=${encodeURIComponent(
        precoBaseObra || ""
      )}`
    );
  };

  const handleCompartilhar = () => {
    navigator.clipboard.writeText(window.location.href);
    mostrarAviso("Link da obra copiado para a área de transferência!", "success");
  };

  const abrirDenuncia = (tipo, alvo) => {
    if (isGuest || !isAuthenticated) {
      setAcaoTentada("denunciar uma obra");
      setModalConversaoAberto(true);
      return;
    }
    setDenunciaAtual({ tipo, alvo });
    setModalDenunciaAberto(true);
  };

  const noticeStyles = {
    info: "bg-orange-50 text-artOrange border-orange-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-red-50 text-red-600 border-red-200",
  };

  // Skeleton de Carregamento Fiel ao Layout
  if (loading) {
    return (
      <div className="w-full text-artDark antialiased min-h-screen font-sans">
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
            <div className="h-7 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-7 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              <div className="h-[460px] bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de Erro: Obra Não Encontrada
  if (!obraDetalhe) {
    return (
      <div className="w-full text-artDark antialiased min-h-screen font-sans">
        <div className="w-full min-h-screen flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-artOrange flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 className="text-xl font-bold text-artDark mb-1">Obra não encontrada</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              A publicação acessada não existe, foi arquivada ou removida pelo artista autor.
            </p>
            <Link
              to="/feed"
              className="inline-flex items-center justify-center gap-2 bg-artDark hover:bg-artOrange text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>Voltar ao Feed</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleFixar = async () => {
    try {
      const res = await obrasService.alternarFixar(id);
      setObraDetalhe((prev) => ({
        ...prev,
        fixado: res.fixado,
        fixado_em: res.fixado_em,
      }));
      mostrarAviso(
        res.fixado
          ? "Obra fixada no topo do seu perfil com sucesso!"
          : "Obra desafixada do topo do seu perfil.",
        "success"
      );
    } catch (err) {
      mostrarAviso(err.message || "Erro ao alterar fixação da obra.", "error");
    }
  };

  const imagemPrincipal = obraDetalhe.imagem_url || obraDetalhe.arquivoUrl || "";
  const dataPublicacao = obraDetalhe.data_criacao || obraDetalhe.dataPostagem;

  const categoriasLista =
    obraDetalhe.categorias && obraDetalhe.categorias.length > 0
      ? obraDetalhe.categorias
      : obraDetalhe.categoria
      ? [obraDetalhe.categoria]
      : [];

  // Configuração visual do LED do Autor com suporte a cor HEX customizada do Boost
  const ledInfo = getAvatarLedStyle(autor);
  const usuarioPlano = (autor.plano || "").toLowerCase();
  const temLed = autor.mostrar_moldura_led !== false;

  return (
    <div className="w-full pb-16">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* BARRA SUPERIOR: Navegação & Categorias */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white border border-gray-200/80 text-gray-700 hover:text-artDark hover:border-gray-400 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-[11px]"></i>
              <span>{isOwner ? "Voltar às minhas obras" : "Voltar ao Feed"}</span>
            </button>

            {isOwner && (
              <button
                type="button"
                onClick={handleToggleFixar}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 border cursor-pointer ${
                  obraDetalhe.fixado
                    ? "bg-artOrange text-white border-artOrange shadow-md shadow-artOrange/20"
                    : "bg-white border-gray-200/80 text-gray-700 hover:text-artOrange hover:border-artOrange"
                }`}
                title={obraDetalhe.fixado ? "Desafixar do topo do perfil" : "Fixar no topo do perfil (máximo 3)"}
              >
                <i className={`fa-solid fa-thumbtack text-[11px] ${obraDetalhe.fixado ? "rotate-[-20deg]" : ""}`}></i>
                <span>{obraDetalhe.fixado ? "Fixada no Perfil" : "Fixar no Perfil"}</span>
              </button>
            )}

            {categoriasLista.length > 0 && (
              <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
                • <strong className="text-gray-600 font-bold ml-1">#{categoriasLista[0].nomeCategoria}</strong>
              </span>
            )}
          </div>

          {!isOwner && (
            <MenuOpcoes
              tipo="obra"
              detalhesLink={`/obra/${obraDetalhe.id}`}
              isSalvo={isSalvo}
              onSalvar={handleToggleSave}
              onDenunciar={() => abrirDenuncia("obra", tituloObra)}
              onCopiarLinkSuccess={(msg) => mostrarAviso(msg, "success")}
            />
          )}
        </div>

        {/* Alerta de Feedback */}
        {noticeMessage && (
          <div className={`${noticeStyles[noticeType]} border rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-xs animate-fade-in`}>
            <i className="fa-solid fa-circle-info text-sm"></i>
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* ESTRUTURA PRINCIPAL EM 2 COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUNA ESQUERDA: Imagem / Mídia da Obra & Barra de Interações */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {(() => {
              const listaImagens =
                Array.isArray(obraDetalhe.arquivos) && obraDetalhe.arquivos.length > 0
                  ? obraDetalhe.arquivos
                  : [imagemPrincipal];
              const imgAtual = listaImagens[slideIndex] || imagemPrincipal;

              const ext = (imgAtual || "").split("?")[0].split(".").pop().toLowerCase();
              const isVideo = ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext);
              const isPdf = ["pdf"].includes(ext);
              const isDoc = ["doc", "docx", "txt", "odt", "rtf", "ppt", "pptx"].includes(ext);
              const is3D = ["obj", "fbx", "gltf", "glb", "stl", "blend", "dae"].includes(ext);
              const isArchive = ["zip", "rar", "7z", "psd", "ai", "eps"].includes(ext);
              const isOutroArquivo = isPdf || isDoc || is3D || isArchive;

              return (
                <div className="relative">
                  {/* Glow Atmosférico da Obra (Ateliê / Galeria Imersiva Radiante) */}
                  <div
                    className="absolute -inset-8 sm:-inset-16 rounded-[3rem] opacity-60 blur-3xl pointer-events-none transition-all duration-1000 -z-10"
                    style={{
                      background: `radial-gradient(ellipse at 50% 40%, ${ambientColors[0] || "#FF793F"}88 0%, ${
                        ambientColors[1] || ambientColors[0] || "#6C5CE7"
                      }55 40%, transparent 75%)`,
                    }}
                  />

                  <ProtectedImageWrapper
                    marcaDagua={marcaDaguaObra}
                    bloquearDownload={bloquearDownloadObra}
                    bloquearPrint={bloquearPrintObra}
                    nomeArtista={autor.nome}
                    isLiked={isCurtido}
                    onCurtir={handleToggleLike}
                    onConversar={handleEnviarMensagemDireta}
                    className="rounded-2xl overflow-hidden shadow-xl border border-black/10 relative z-10"
                  >
                    <div
                      onClick={() => !isVideo && !isOutroArquivo && setModalZoomAberto(true)}
                      className={`bg-neutral-950 w-full overflow-hidden relative group ${
                        !isVideo && !isOutroArquivo ? "cursor-zoom-in" : ""
                      } min-h-[340px] max-h-[560px] flex items-center justify-center border border-black/10`}
                    >
                      {/* Preço Base na Imagem */}
                      {precoBaseObra && (
                        <div className="absolute top-3 left-3 z-30 pointer-events-none">
                          <PriceBadge preco={precoBaseObra} />
                        </div>
                      )}

                      {/* Selo de Redução de Qualidade se ativado */}
                      {dadosEstruturados.reduzirQualidade && (
                        <div className="absolute top-3 right-3 z-30 pointer-events-none">
                          <div className="bg-amber-500/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[10px] font-bold shadow-lg border border-amber-400/30 flex items-center gap-1.5">
                            <i className="fa-solid fa-compress text-[9px]"></i>
                            <span>Modo Prévia Compactado</span>
                          </div>
                        </div>
                      )}

                      {isVideo ? (
                        <video
                          src={getMediaUrl(imgAtual)}
                          controls
                          controlsList={bloquearDownloadObra ? "nodownload" : undefined}
                          disablePictureInPicture={bloquearDownloadObra}
                          className="w-full h-auto max-h-[560px] object-contain bg-black"
                        />
                      ) : isOutroArquivo ? (
                        <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#121212] via-neutral-900 to-gray-900 flex flex-col items-center justify-center text-white p-6 text-center">
                          <div className="w-20 h-20 rounded-3xl bg-white/10 text-artOrange border border-white/15 flex items-center justify-center text-4xl mb-4 shadow-xl shadow-artOrange/10 backdrop-blur-md">
                            <i className={
                              isPdf ? "fa-solid fa-file-pdf" :
                              isDoc ? "fa-solid fa-file-lines" :
                              is3D ? "fa-solid fa-cube" :
                              isArchive ? "fa-solid fa-file-zipper" :
                              "fa-solid fa-file"
                            }></i>
                          </div>
                          <span className="font-editorial text-xl sm:text-2xl text-white/95 font-bold truncate max-w-sm">
                            {tituloObra}
                          </span>
                          <span className="text-[11px] text-artOrange uppercase font-bold tracking-widest mt-2 bg-artOrange/15 px-3 py-1 rounded-full border border-artOrange/30">
                            {ext.toUpperCase()} • {isPdf ? "Documento PDF" : is3D ? "Modelo/Asset 3D" : isDoc ? "Documento de Texto" : "Arquivo/Pacote Digital"}
                          </span>

                          {!bloquearDownloadObra ? (
                            <a
                              href={getMediaUrl(imgAtual)}
                              target="_blank"
                              rel="noreferrer"
                              download
                              className="mt-5 inline-flex items-center gap-2 bg-artOrange hover:bg-orange-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-artOrange/25"
                            >
                              <i className="fa-solid fa-download text-xs"></i>
                              <span>Baixar Arquivo ({ext.toUpperCase()})</span>
                            </a>
                          ) : (
                            <div className="mt-5 inline-flex items-center gap-2 bg-neutral-800/90 text-gray-300 border border-white/10 text-[11px] font-semibold px-4 py-2 rounded-xl">
                              <i className="fa-solid fa-shield-halved text-artOrange"></i>
                              <span>Download protegido pelo autor</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <ArtCanvasViewer
                          imageUrl={obraDetalhe.imagem || obraDetalhe.url_imagem || imgAtual}
                          titulo={obraDetalhe.titulo || tituloObra}
                          nomeArtista={obraDetalhe.autor?.nome || obraDetalhe.usuario?.nome || autor.nome}
                          onClick={() => setModalZoomAberto(true)}
                        />
                      )}

                      {/* Navegação de Carrossel */}
                      {listaImagens.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSlideIndex((prev) =>
                                prev === 0 ? listaImagens.length - 1 : prev - 1
                              );
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs transition-all shadow-lg z-30"
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSlideIndex((prev) =>
                                prev === listaImagens.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs transition-all shadow-lg z-30"
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>

                          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full z-30">
                            {slideIndex + 1} / {listaImagens.length}
                          </span>
                        </>
                      )}
                    </div>
                  </ProtectedImageWrapper>

                  {/* Miniaturas de slides do carrossel */}
                  {listaImagens.length > 1 && (
                    <div className="flex items-center gap-2 mt-2.5 overflow-x-auto py-1 no-scrollbar">
                      {listaImagens.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSlideIndex(idx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                            idx === slideIndex
                              ? "border-artPurple scale-105 shadow-md"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={getMediaUrl(imgUrl)}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* PALETA CROMÁTICA DA OBRA (EXTRAÇÃO NATIVA CANVAS OU PALETA CUSTOMIZADA) */}
            {dadosEstruturados.exibirPaleta !== false && (
              <PaletteExtractor
                imageUrl={imagemPrincipal}
                customColors={dadosEstruturados.coresCustomizadas}
                onColorsExtracted={(hexes) => setAmbientColors(hexes)}
              />
            )}

            {/* AVISO DE QUALIDADE REDUZIDA (OPÇÃO DO AUTOR) */}
            {dadosEstruturados.reduzirQualidade && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-compress"></i>
                  </div>
                  <div>
                    <span className="font-bold block text-amber-900">Prévia com Resolução Compactada</span>
                    <span className="text-[11px] text-amber-700/90 font-medium">Obra protegida em resolução reduzida. Entre em contato com o artista para obter a versão original em alta qualidade.</span>
                  </div>
                </div>
                {!isDono && (
                  <button
                    type="button"
                    onClick={handleEnviarMensagemDireta}
                    className="px-3.5 py-1.5 rounded-full bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-paper-plane text-[10px]"></i>
                    Solicitar Original em Alta
                  </button>
                )}
              </div>
            )}

            {/* BARRA DE ENGAJAMENTO E MÉTRICAS REAIS (ABAIXO DA IMAGEM) */}
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-sm mt-1">
              <div className="flex items-center gap-5 sm:gap-6">
                {/* Botão Curtir com feedback em tempo real */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${
                    isCurtido ? "text-red-500 scale-105" : "text-gray-600 hover:text-red-500"
                  }`}
                  title={isCurtido ? "Remover curtida" : "Curtir obra"}
                >
                  <i className={isCurtido ? "fa-solid fa-heart text-base text-red-500 animate-pulse" : "fa-regular fa-heart text-base"}></i>
                  <span>{likesCount} <span className="hidden sm:inline font-medium text-gray-400">curtidas</span></span>
                </button>

                {/* Comentários */}
                <a
                  href="#comentarios"
                  className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-artBlue transition-colors"
                  title="Comentários desta obra"
                >
                  <i className="fa-regular fa-comment text-base"></i>
                  <span>{comentarios.length} <span className="hidden sm:inline font-medium text-gray-400">comentários</span></span>
                </a>

                {/* Visualizações Únicas Reais */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400" title="Visualizações contabilizadas">
                  <i className="fa-regular fa-eye text-base"></i>
                  <span>{viewsCount} <span className="hidden sm:inline font-normal">views</span></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Botão Salvar nos Favoritos */}
                {!isDono && (
                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                      isSalvo
                        ? "bg-amber-50 text-amber-600 border border-amber-200 shadow-xs"
                        : "text-gray-600 hover:text-amber-500 hover:bg-gray-50 border border-transparent"
                    }`}
                    title={isSalvo ? "Remover dos favoritos" : "Salvar nos favoritos"}
                  >
                    <i className={isSalvo ? "fa-solid fa-bookmark text-sm text-amber-500" : "fa-regular fa-bookmark text-sm"}></i>
                    <span className="hidden sm:inline">{isSalvo ? "Salvo" : "Salvar"}</span>
                  </button>
                )}

                {/* Botão Compartilhar */}
                <button
                  type="button"
                  onClick={handleCompartilhar}
                  className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-artDark flex items-center justify-center transition-colors text-xs border border-gray-200/60 shadow-xs"
                  title="Copiar link da obra"
                >
                  <i className="fa-solid fa-share-nodes text-[11px]"></i>
                </button>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: PAINEL DO ARTISTA & METADADOS EDITORIAL */}
          <div className="lg:col-span-5 sticky top-8 self-start space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              
              {/* CARD DO ARTISTA COM LED NEON DINÂMICO */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Link
                    to={isOwner ? "/perfil" : `/artista/${autor.id}`}
                    style={ledInfo.style}
                    className={`w-11 h-11 rounded-full bg-artPurple overflow-hidden shrink-0 block hover:opacity-85 transition-all ${ledInfo.className}`}
                  >
                    {autor.foto_perfil || autor.fotoPerfil ? (
                      <img
                        src={getMediaUrl(autor.foto_perfil || autor.fotoPerfil)}
                        alt={autor.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-artPurple flex items-center justify-center text-white font-bold text-sm">
                        {autor.nome?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={isOwner ? "/perfil" : `/artista/${autor.id}`}
                        className="font-bold text-sm text-artDark hover:text-artPurple transition-colors block truncate"
                      >
                        {autor.nome || "Artista"}
                      </Link>

                      {temLed && autor.mostrar_badge_plano !== false && (
                        <>
                          {usuarioPlano === "boost" && (
                            <span className="bg-artOrange text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Boost
                            </span>
                          )}
                          {usuarioPlano === "pro" && (
                            <span className="bg-artPurple text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Pro
                            </span>
                          )}
                          {(usuarioPlano === "free" || !usuarioPlano) && (
                            <span className="bg-artGreen text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Free
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Subtítulo: ARTISTA • X SEGUIDORES */}
                    <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">
                      Artista • {seguidoresCount} {seguidoresCount === 1 ? "seguidor" : "seguidores"}
                    </p>
                  </div>
                </div>

                {/* Botão de Ação: Seguir / Seguindo ou Indicador de Proprietário */}
                {!isOwner && autor.id ? (
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    disabled={followingLoading}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-xs shrink-0 disabled:opacity-50 ${
                      isSeguindo
                        ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200/60"
                        : "bg-artDark text-white hover:bg-artPurple"
                    }`}
                  >
                    {followingLoading ? (
                      <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                    ) : isSeguindo ? (
                      "Seguindo"
                    ) : (
                      "+ Seguir"
                    )}
                  </button>
                ) : isOwner ? (
                  <span className="bg-orange-50 text-artOrange border border-orange-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Proprietário
                  </span>
                ) : null}
              </div>

              <hr className="border-gray-100" />

              {/* TÍTULO E PREÇO BASE SEPARADOS DE FORMA EDITORIAL */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="font-serif font-editorial italic text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {tituloObra}
                  </h1>

                  {precoBaseObra && (
                    <div className="shrink-0 pt-0.5">
                      <PriceBadge preco={precoBaseObra} />
                    </div>
                  )}
                </div>

                {/* Data formatada em português */}
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar text-[11px]"></i>
                  <span>
                    {dataPublicacao
                      ? `Publicado em ${new Date(dataPublicacao).toLocaleDateString("pt-BR")}`
                      : "Publicado recentemente"}
                  </span>
                </p>

                {/* LEGENDA / HISTÓRIA SEPARADA */}
                {descricaoObra.trim() && (
                  <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-4 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-artOrange block mb-1">
                      História & Legenda
                    </span>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-light whitespace-pre-line">
                      {descricaoObra.trim()}
                    </p>
                  </div>
                )}

                {/* Badges de Categorias Oficiais */}
                {categoriasLista.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {categoriasLista.map((cat, i) => {
                      const estilo = getEstiloCategoria(cat.nomeCategoria);
                      return (
                        <span
                          key={cat.id || i}
                          className={`${estilo.corTag} px-3 py-1 rounded-lg text-xs font-semibold border transition-transform hover:scale-105`}
                        >
                          #{cat.nomeCategoria}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CAIXA DE ENVIAR MENSAGEM DIRETA AO ARTISTA SOBRE A OBRA */}
              {!isOwner && autor.id && (
                <>
                  <hr className="border-gray-100" />
                  <div className="bg-gradient-to-br from-purple-50/50 via-white to-orange-50/50 rounded-2xl p-4 border border-artPurple/15 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                        <i className="fa-solid fa-paper-plane text-artOrange text-xs"></i>
                        <span>Falar com o artista sobre esta arte</span>
                      </span>
                      <span className="text-[9px] bg-artPurple/10 text-artPurple font-bold px-2 py-0.5 rounded-full">
                        Chat Direto
                      </span>
                    </div>

                    <form onSubmit={handleEnviarMensagemDireta} className="space-y-2">
                      <textarea
                        rows={2}
                        value={mensagemDireta}
                        onChange={(e) => setMensagemDireta(e.target.value)}
                        placeholder={`Olá ${autor.nome || "artista"}! Gostei muito desta obra e gostaria de saber mais...`}
                        className="w-full bg-white border border-artPurple/20 focus:border-artPurple rounded-xl p-2.5 text-xs text-artDark placeholder:text-gray-400 outline-none resize-none transition-all focus:ring-2 focus:ring-artPurple/10"
                      />

                      <button
                        type="submit"
                        className="w-full bg-artDark hover:bg-gradient-to-r hover:from-artPurple hover:via-artOrange hover:to-artBlue text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-artDark/10 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <i className="fa-solid fa-paper-plane text-[11px]"></i>
                        <span>Enviar Mensagem</span>
                      </button>
                    </form>
                  </div>
                </>
              )}

              {/* AÇÕES DO PROPRIETÁRIO DA OBRA */}
              {isOwner && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                      Gerenciar Publicação
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/editar-obra/${obraDetalhe.id}`}
                        className="bg-gray-100 hover:bg-artDark text-artDark hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border border-gray-200/60"
                      >
                        <i className="fa-solid fa-pen text-[10px]"></i>
                        <span>Editar</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setModalExcluirAberto(true)}
                        className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border border-red-200/60"
                      >
                        <i className="fa-solid fa-trash-can text-[10px]"></i>
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>

        {/* SEÇÃO INFERIOR: COMENTÁRIOS */}
        <section id="comentarios" className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-5 max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-artDark flex items-center gap-2">
              <i className="fa-regular fa-comments text-artOrange"></i>
              <span>Comentários ({comentarios.length})</span>
            </h2>
          </div>

          {/* Formulário de Envio de Comentário */}
          <form onSubmit={handleComentarioSubmit} className="flex gap-2.5 items-center">
            <div className="w-8 h-8 rounded-full bg-artPurple text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs overflow-hidden">
              {currentUser?.fotoPerfil ? (
                <img
                  src={getMediaUrl(currentUser.fotoPerfil)}
                  alt="Seu Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentUser?.nome ? currentUser.nome.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                placeholder={isGuest ? "Faça login para comentar..." : "Escreva um comentário..."}
                maxLength={500}
                disabled={submittingComment}
                className="flex-1 bg-gray-50 border border-gray-200 focus:border-artOrange focus:bg-white rounded-full px-4 py-2 text-xs text-artDark outline-none transition-all placeholder:text-gray-400"
              />

              <button
                type="submit"
                disabled={submittingComment || !novoComentario.trim()}
                className="bg-artOrange hover:bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1.5"
              >
                {submittingComment ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <span>Comentar</span>
                )}
              </button>
            </div>
          </form>

          {/* Lista de Comentários */}
          <div className="space-y-3 pt-1">
            {comentarios.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400 border border-dashed border-gray-200">
                <p className="text-xs font-medium">Nenhum comentário ainda. Seja o primeiro a prestigiar esta arte!</p>
              </div>
            ) : (
              comentarios.map((item) => (
                <div key={item.id} className="flex gap-3 items-start bg-gray-50/70 border border-gray-100 rounded-xl p-3">
                  <Link
                    to={currentUser?.id === item.usuario?.id ? "/perfil" : `/artista/${item.usuario?.id}`}
                    className="w-8 h-8 rounded-full bg-artPurple text-white flex items-center justify-center shrink-0 text-xs font-bold overflow-hidden hover:opacity-85 transition-opacity"
                  >
                    {item.usuario?.fotoPerfil ? (
                      <img
                        src={getMediaUrl(item.usuario?.fotoPerfil)}
                        alt={item.usuario?.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{item.usuario?.nome?.charAt(0)?.toUpperCase() || "U"}</span>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2 mb-0.5">
                      <Link
                        to={currentUser?.id === item.usuario?.id ? "/perfil" : `/artista/${item.usuario?.id}`}
                        className="text-xs font-bold text-artDark hover:text-artOrange transition-colors truncate"
                      >
                        {item.usuario?.nome || "Usuário"}
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString("pt-BR") : ""}
                        </span>

                        {(currentUser?.id === item.usuario?.id || currentUser?.tipo_conta === "admin" || currentUser?.tipo_conta === "moderador") && (
                          <button
                            type="button"
                            onClick={() => handleDeletarComentario(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors ml-1"
                            title="Excluir comentário"
                          >
                            <i className="fa-solid fa-trash-can text-[11px]"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-light break-words">
                      {item.conteudo}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* MODAIS */}
      <LightboxModal
        isOpen={modalZoomAberto}
        onClose={() => setModalZoomAberto(false)}
        imagemUrl={getMediaUrl(
          Array.isArray(obraDetalhe?.arquivos) && obraDetalhe.arquivos.length > 0
            ? obraDetalhe.arquivos[slideIndex] || imagemPrincipal
            : imagemPrincipal
        )}
        titulo={tituloObra}
      />

      <ModalConfirmarExclusao
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleExcluirObraConfirmado}
        loading={deleting}
        tituloObra={tituloObra}
      />

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        postagemId={obraDetalhe?.id}
        tipo={denunciaAtual.tipo}
        alvo={denunciaAtual.alvo}
        onSucesso={(msg) => mostrarAviso(msg, "success")}
        onErro={(msg) => mostrarAviso(msg, "error")}
      />

      <ModalConversao
        isOpen={modalConversaoAberto}
        onClose={() => setModalConversaoAberto(false)}
        acao={acaoTentada}
      />
    </div>
  );
}