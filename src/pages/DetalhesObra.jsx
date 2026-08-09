import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import { obrasService, getUser, getToken } from "../services/api";

function DetalhesObra() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [obraDetalhe, setObraDetalhe] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [denunciaAtual, setDenunciaAtual] = useState({ tipo: "obra", alvo: "" });

  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const currentUser = getUser();

  const carregarDadosObra = async () => {
    if (!id) return;
    try {
      const dadosObra = await obrasService.obterObraPorId(id);
      if (dadosObra && dadosObra.id) {
        setObraDetalhe(dadosObra);
      }

      // Carregar comentários reais
      const listaComentarios = await obrasService.listarComentarios(id);
      setComentarios(listaComentarios || []);
    } catch (err) {
      console.error("Erro ao carregar obra:", err);
      mostrarAviso(err.message || "Obra não encontrada.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosObra();
  }, [id]);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const isOwner = currentUser?.id === obraDetalhe?.usuario?.id;

  const handleComentarioSubmit = async (event) => {
    event.preventDefault();
    if (!novoComentario.trim()) return;

    if (!getToken()) {
      mostrarAviso("Você precisa estar logado para comentar.", "error");
      return;
    }

    setSubmittingComment(true);
    try {
      const comentarioCriado = await obrasService.criarComentario(id, novoComentario.trim());
      setComentarios((prev) => [...prev, comentarioCriado]);
      setNovoComentario("");
      mostrarAviso("Comentário adicionado com sucesso!", "success");
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

  const abrirDenuncia = (tipo, alvo) => {
    setDenunciaAtual({ tipo, alvo });
    setModalDenunciaAberto(true);
  };

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/10",
    success: "bg-green-50 text-green-600 border-green-200",
    error: "bg-red-50 text-red-500 border-red-200",
  };

  if (loading) {
    return (
      <div className="bg-[#F9F8F6] text-artDark antialiased min-h-screen font-sans">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
              Carregando detalhes da obra...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!obraDetalhe) {
    return (
      <div className="bg-[#F9F8F6] text-artDark antialiased min-h-screen font-sans">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-editorial text-4xl italic mb-4">Obra não encontrada.</h2>
            <Link to="/feed" className="bg-artDark text-white px-6 py-3 rounded-full text-sm font-bold">
              Voltar ao Feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <section className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-xl shadow-black/5 relative">
              <img
                src={obraDetalhe.arquivoUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200"}
                alt={obraDetalhe.legenda || "Obra"}
                className="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
              />

              <div className="absolute top-5 right-5">
                {isOwner ? (
                  <Link
                    to={`/editar-obra/${obraDetalhe.id}`}
                    className="w-11 h-11 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-artDark hover:text-white transition-all shadow-lg"
                    title="Editar obra"
                  >
                    <i className="fa-solid fa-pen text-sm"></i>
                  </Link>
                ) : (
                  <MenuOpcoes
                    tipo="obra"
                    detalhesLink={`/obra/${obraDetalhe.id}`}
                    onDenunciar={() =>
                      abrirDenuncia("obra", obraDetalhe.legenda || `Obra #${obraDetalhe.id}`)
                    }
                  />
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-5">
            {noticeMessage && (
              <div className={`${noticeStyles[noticeType]} border rounded-[1.3rem] px-5 py-3 mb-5 text-xs font-bold`}>
                <i className="fa-solid fa-circle-info mr-2"></i>
                {noticeMessage}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap items-center gap-2">
                {obraDetalhe.categoria?.nomeCategoria && (
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px]">
                    {obraDetalhe.categoria.nomeCategoria}
                  </span>
                )}

                {isOwner && (
                  <span className="bg-artOrange/10 text-artOrange px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                    Minha obra
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl leading-tight mb-4">
              {obraDetalhe.legenda || `Obra #${obraDetalhe.id}`}
            </h1>

            {/* Autor */}
            <div className="bg-white rounded-[1.7rem] p-4 border border-black/5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-11 h-11 rounded-full bg-artPurple overflow-hidden shrink-0">
                    {obraDetalhe.usuario?.fotoPerfil ? (
                      <img
                        src={obraDetalhe.usuario.fotoPerfil}
                        alt={obraDetalhe.usuario.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-artPurple flex items-center justify-center text-white font-bold">
                        {obraDetalhe.usuario?.nome?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                      {obraDetalhe.usuario?.tipo_conta || "Artista"}
                    </p>

                    <h3 className="font-bold text-base">
                      {obraDetalhe.usuario?.nome || "Artista"}
                    </h3>
                  </div>
                </div>

                <Link
                  to={isOwner ? "/perfil" : `/artista/${obraDetalhe.usuario?.id}`}
                  className="px-4 py-2.5 rounded-full border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all text-center"
                >
                  Ver Perfil
                </Link>
              </div>
            </div>

            <div className="bg-artPurple/5 rounded-[1.7rem] p-5 border border-artPurple/10 mb-5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3">
                Informações da obra
              </h4>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between gap-4">
                  <span>Data de publicação</span>
                  <strong className="text-artDark text-right">
                    {obraDetalhe.dataPostagem ? new Date(obraDetalhe.dataPostagem).toLocaleDateString() : "—"}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Categoria</span>
                  <strong className="text-artPurple text-right">
                    {obraDetalhe.categoria?.nomeCategoria || "Digital"}
                  </strong>
                </div>
              </div>
            </div>

            {isOwner ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to={`/editar-obra/${obraDetalhe.id}`}
                  className="bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
                >
                  <i className="fa-solid fa-pen mr-2"></i>
                  Editar Obra
                </Link>

                <Link
                  to="/meu-portfolio"
                  className="bg-white border border-black/5 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
                >
                  <i className="fa-solid fa-layer-group mr-2"></i>
                  Gerenciar
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/mensagens"
                  className="bg-white border border-black/5 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
                >
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Mensagem
                </Link>

                <Link
                  to="/encomendas"
                  className="bg-artOrange text-white py-4 rounded-full text-sm font-bold hover:bg-artDark transition-all text-center"
                >
                  <i className="fa-solid fa-bag-shopping mr-2"></i>
                  Encomenda
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Seção de Comentários Reais */}
        <section className="max-w-6xl mx-auto mt-8 bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-editorial text-3xl italic">Comentários</h2>

            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {comentarios.length} {comentarios.length === 1 ? "comentário" : "comentários"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {comentarios.length === 0 ? (
              <p className="text-sm text-gray-400 italic lg:col-span-2">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            ) : (
              comentarios.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-artPurple overflow-hidden shrink-0">
                    {item.usuario?.fotoPerfil ? (
                      <img
                        src={item.usuario.fotoPerfil}
                        alt={item.usuario.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-artPurple text-white flex items-center justify-center text-xs font-bold">
                        {item.usuario?.nome?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-[#F9F8F6] rounded-[1.3rem] p-4">
                    <div className="flex justify-between gap-3 mb-1">
                      <strong className="text-sm">{item.usuario?.nome || "Usuário"}</strong>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-gray-400 font-bold">
                          {item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString() : ""}
                        </span>

                        {(currentUser?.id === item.usuario?.id || currentUser?.tipo_conta === "admin" || currentUser?.tipo_conta === "moderador") && (
                          <button
                            type="button"
                            onClick={() => handleDeletarComentario(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                            title="Excluir comentário"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{item.conteudo}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleComentarioSubmit} className="flex gap-3">
            <input
              type="text"
              value={novoComentario}
              onChange={(event) => setNovoComentario(event.target.value)}
              placeholder="Escreva um comentário..."
              maxLength={500}
              disabled={submittingComment}
              className="flex-1 bg-[#F9F8F6] rounded-full px-5 py-3.5 outline-none focus:ring-2 ring-artPurple/20 text-sm min-w-0 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={submittingComment || !novoComentario.trim()}
              className="w-11 h-11 rounded-full bg-artDark text-white hover:bg-artPurple transition-all shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="Enviar comentário"
            >
              {submittingComment ? (
                <i className="fa-solid fa-spinner fa-spin text-xs"></i>
              ) : (
                <i className="fa-solid fa-arrow-up text-xs"></i>
              )}
            </button>
          </form>
        </section>
      </main>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        tipo={denunciaAtual.tipo}
        alvo={denunciaAtual.alvo}
      />
    </div>
  );
}

export default DetalhesObra;