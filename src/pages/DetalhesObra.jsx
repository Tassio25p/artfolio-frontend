import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import ModalConversao from "../components/ModalConversao";
import LightboxModal from "../components/LightboxModal";
import ModalConfirmarExclusao from "../components/ModalConfirmarExclusao";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, getMediaUrl } from "../services/api";
import { getEstiloCategoria } from "../constants/categories";

export default function DetalhesObra() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principais da obra
  const [obraDetalhe, setObraDetalhe] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");

  // Estados de engajamento
  const [isSalvo, setIsSalvo] = useState(false);
  const [isCurtido, setIsCurtido] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

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

  const carregarDadosObra = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const dadosObra = await obrasService.obterObraPorId(id);
      if (dadosObra && dadosObra.id) {
        setObraDetalhe(dadosObra);
        setLikesCount(dadosObra.totalCurtidas || 0);
        setIsCurtido(Boolean(dadosObra.curtido_por_mim));
        setIsSalvo(Boolean(dadosObra.salvo_por_mim));
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
          // fallback silencioso
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

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const isOwner = currentUser?.id === obraDetalhe?.usuario?.id;

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
      mostrarAviso("Comentário publicado!", "success");
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

  // Skeleton de Carregamento Compacto
  if (loading) {
    return (
      <div className="bg-[#F9F8F6] text-artDark antialiased min-h-screen font-sans">
        <Sidebar />
        <main className="ml-14 min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
          <div className="h-7 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-[420px] bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="lg:col-span-5 h-[380px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!obraDetalhe) {
    return (
      <div className="bg-[#F9F8F6] text-artDark antialiased min-h-screen font-sans">
        <Sidebar />
        <main className="ml-14 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-xl">
            <i className="fa-solid fa-triangle-exclamation text-3xl text-artOrange mb-3"></i>
            <h2 className="text-xl font-bold text-artDark mb-1">Obra não encontrada</h2>
            <p className="text-xs text-gray-500 mb-5">A publicação acessada não existe ou foi removida pelo autor.</p>
            <Link
              to="/feed"
              className="inline-flex items-center justify-center bg-artDark text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-artOrange transition-all shadow-md"
            >
              Voltar ao Feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const categoriasLista =
    obraDetalhe.categorias && obraDetalhe.categorias.length > 0
      ? obraDetalhe.categorias
      : obraDetalhe.categoria
      ? [obraDetalhe.categoria]
      : [];

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen pb-16">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-14 min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* TOPO: Navegação & Categorias */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white border border-gray-200/80 text-gray-700 hover:text-artDark hover:border-gray-400 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left text-[11px]"></i>
              <span>{isOwner ? "Voltar às minhas obras" : "Voltar ao Feed"}</span>
            </button>

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
              onDenunciar={() =>
                abrirDenuncia("obra", obraDetalhe.legenda || `Obra #${obraDetalhe.id}`)
              }
              onCopiarLinkSuccess={(msg) => mostrarAviso(msg, "success")}
            />
          )}
        </div>

        {/* Alerta de Notificação */}
        {noticeMessage && (
          <div className={`${noticeStyles[noticeType]} border rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-xs animate-fade-in`}>
            <i className="fa-solid fa-circle-info text-sm"></i>
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* ESTRUTURA PRINCIPAL EM 2 COLUNAS (COMPACTA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUNA ESQUERDA: Palco da Obra & Barra de Engajamento Abaixo */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div
              onClick={() => setModalZoomAberto(true)}
              className="bg-neutral-900 rounded-2xl overflow-hidden shadow-md relative group cursor-zoom-in min-h-[320px] max-h-[500px] flex items-center justify-center border border-black/10"
            >
              <img
                src={getMediaUrl(obraDetalhe.arquivoUrl)}
                alt={obraDetalhe.legenda || "Obra de arte"}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200";
                }}
                className="w-full h-full max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-[1.01] mx-auto"
              />

              {/* Tag Dica de Zoom */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
                <i className="fa-solid fa-expand text-[10px]"></i>
                <span>Clique para ampliar</span>
              </div>
            </div>

            {/* BARRA DE ENGAJAMENTO (TOTALMENTE ABAIXO DA IMAGEM, NO FLUXO NORMAL) */}
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm mt-1">
              <div className="flex items-center gap-5 sm:gap-6">
                {/* Botão Curtir */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${
                    isCurtido ? "text-red-500 scale-105" : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <i className={isCurtido ? "fa-solid fa-heart text-sm text-red-500 animate-pulse" : "fa-regular fa-heart text-sm"}></i>
                  <span>{likesCount} <span className="hidden sm:inline font-medium">curtidas</span></span>
                </button>

                {/* Botão Favoritar */}
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${
                    isSalvo ? "text-amber-500" : "text-gray-600 hover:text-amber-500"
                  }`}
                >
                  <i className={isSalvo ? "fa-solid fa-bookmark text-sm text-amber-500" : "fa-regular fa-bookmark text-sm"}></i>
                  <span>{isSalvo ? "Salvo" : "Salvar"}</span>
                </button>

                {/* Visualizações */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                  <i className="fa-regular fa-eye text-sm"></i>
                  <span>{obraDetalhe.visualizacoes || 0} <span className="hidden sm:inline font-normal">views</span></span>
                </div>
              </div>

              {/* Botão Compartilhar */}
              <button
                type="button"
                onClick={handleCompartilhar}
                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-artDark flex items-center justify-center transition-colors text-xs border border-gray-100 shadow-xs"
                title="Copiar link da obra"
              >
                <i className="fa-solid fa-share-nodes text-[11px]"></i>
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: PAINEL LATERAL UNIFICADO E COMPACTO (STICKY DESKTOP) */}
          <div className="lg:col-span-5 sticky top-8 self-start space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              
              {/* HEADER DO ARTISTA */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Link
                    to={isOwner ? "/perfil" : `/artista/${obraDetalhe.usuario?.id}`}
                    className="w-10 h-10 rounded-full bg-artPurple overflow-hidden shrink-0 border border-gray-100 shadow-xs hover:scale-105 transition-transform"
                  >
                    {obraDetalhe.usuario?.fotoPerfil ? (
                      <img
                        src={getMediaUrl(obraDetalhe.usuario.fotoPerfil)}
                        alt={obraDetalhe.usuario.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-artPurple flex items-center justify-center text-white font-bold text-sm">
                        {obraDetalhe.usuario?.nome?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider">
                      Artista / Autor
                    </span>
                    <Link
                      to={isOwner ? "/perfil" : `/artista/${obraDetalhe.usuario?.id}`}
                      className="font-bold text-sm text-artDark hover:text-artOrange transition-colors block truncate"
                    >
                      {obraDetalhe.usuario?.nome || "Artista Desconhecido"}
                    </Link>
                  </div>
                </div>

                {!isOwner ? (
                  <Link
                    to={`/artista/${obraDetalhe.usuario?.id}`}
                    className="bg-artDark hover:bg-artOrange text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 whitespace-nowrap"
                  >
                    Ver Perfil
                  </Link>
                ) : (
                  <span className="bg-orange-50 text-artOrange border border-orange-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Proprietário
                  </span>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* TÍTULO E DETALHES COMPACTOS DA OBRA */}
              <div className="space-y-2">
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug">
                  {obraDetalhe.legenda || `Obra #${obraDetalhe.id}`}
                </h1>

                <p className="text-xs text-gray-400 font-medium">
                  {obraDetalhe.dataPostagem
                    ? `Publicado em ${new Date(obraDetalhe.dataPostagem).toLocaleDateString("pt-BR")}`
                    : "Publicado recentemente"}
                </p>

                {obraDetalhe.legenda && (
                  <p className="text-xs text-gray-600 leading-relaxed font-light whitespace-pre-line pt-1">
                    {obraDetalhe.legenda}
                  </p>
                )}

                {/* Categorias & Tags Compactas */}
                {categoriasLista.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {categoriasLista.map((cat, i) => {
                      const estilo = getEstiloCategoria(cat.nomeCategoria);
                      return (
                        <span
                          key={cat.id || i}
                          className={`${estilo.corTag} px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition-transform hover:scale-105`}
                        >
                          #{cat.nomeCategoria}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* LINHA DE AÇÕES DO PROPRIETÁRIO */}
              {isOwner && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                      Ações da Publicação
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

        {/* SEÇÃO INFERIOR: COMENTÁRIOS COMPACTOS (ALINHADOS COM O CONTAINER) */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-5 max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-artDark">
              Comentários ({comentarios.length})
            </h2>
          </div>

          {/* Form de Envio de Comentário */}
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
                <p className="text-xs font-medium">Nenhum comentário ainda. Seja o primeiro a comentar sobre esta arte!</p>
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
                        src={getMediaUrl(item.usuario.fotoPerfil)}
                        alt={item.usuario.nome}
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

      </main>

      {/* MODAIS AUXILIARES */}
      <LightboxModal
        isOpen={modalZoomAberto}
        onClose={() => setModalZoomAberto(false)}
        imagemUrl={getMediaUrl(obraDetalhe?.arquivoUrl)}
        titulo={obraDetalhe?.legenda}
      />

      <ModalConfirmarExclusao
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleExcluirObraConfirmado}
        loading={deleting}
        tituloObra={obraDetalhe?.legenda}
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