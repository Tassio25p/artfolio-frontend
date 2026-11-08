import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, getMediaUrl } from "../services/api";
import { desempacotarDadosObra } from "../utils/obraHelper";

export default function MeuPortfolio() {
  const { user } = useAuth();
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletandoId, setDeletandoId] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const carregarObras = useCallback(async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const dados = await obrasService.listarObras({ usuario_id: user.id });
        setObras(Array.isArray(dados) ? dados : []);
      }
    } catch (err) {
      console.error("Erro ao carregar obras:", err);
      setMensagemErro("Não foi possível carregar suas obras.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    carregarObras();
  }, [carregarObras]);

  const handleExcluirObra = async (id) => {
    if (!window.confirm("Tem certeza de que deseja excluir esta obra? Esta ação não pode ser desfeita.")) {
      return;
    }

    setDeletandoId(id);
    setMensagemErro("");
    setMensagemSucesso("");

    try {
      await obrasService.deletarObra(id);
      setObras((prev) => prev.filter((o) => o.id !== id));
      setMensagemSucesso("Obra removida com sucesso.");
      setTimeout(() => setMensagemSucesso(""), 4000);
    } catch (err) {
      setMensagemErro(err.message || "Erro ao remover obra.");
    } finally {
      setDeletandoId(null);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 block">
                Gerenciamento de Criações
              </span>
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl italic leading-[1.05] text-artDark">
                Minhas Obras<span className="text-artOrange not-italic">.</span>
              </h1>
              <p className="text-base text-gray-500 mt-3 font-light">
                Gerencie todas as suas obras publicadas na plataforma
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-artPurple/10 via-artOrange/10 to-artBlue/10 border border-artPurple/20 text-artPurple text-xs font-semibold mt-4 shadow-sm">
                <i className="fa-solid fa-wand-magic-sparkles text-artOrange"></i>
                <span className="bg-gradient-to-r from-artPurple via-artOrange to-artBlue bg-clip-text text-transparent font-bold">
                  Todas as suas contribuições belas para esta comunidade
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/perfil"
                className="bg-transparent border border-black/10 text-artDark px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue/5 hover:text-artBlue hover:border-artBlue transition-all duration-300 text-center shadow-2xs"
              >
                Ver Perfil Público
              </Link>

              <Link
                to="/criar-obra"
                className="bg-artDark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange transition-all shadow-md flex items-center gap-2"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                Nova Obra
              </Link>
            </div>
          </div>

          {/* Feedback Alerts */}
          {mensagemSucesso && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 mb-6 text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-artGreen"></i>
              <span>{mensagemSucesso}</span>
            </div>
          )}

          {mensagemErro && (
            <div className="bg-artOrange/10 border border-artOrange/30 text-artOrange rounded-2xl p-4 mb-6 text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{mensagemErro}</span>
            </div>
          )}

          {/* Lista de Obras */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 text-center">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-3"></i>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Carregando suas obras...
              </p>
            </div>
          ) : obras.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 text-center">
              <i className="fa-solid fa-palette text-5xl text-gray-200 mb-4"></i>
              <h2 className="font-editorial text-3xl italic mb-2">
                Você ainda não publicou nenhuma obra.
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6 font-light">
                Publique suas ilustrações, pinturas, fotografias e designs para montar seu acervo e ser descoberto por outros artistas.
              </p>
              <Link
                to="/criar-obra"
                className="inline-flex items-center gap-2 bg-artDark text-white px-6 py-3.5 rounded-full text-xs font-bold hover:bg-artOrange transition-all shadow-md"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                Publicar Primeira Obra
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {obras.map((obra) => {
                const dados = desempacotarDadosObra(obra);
                const tituloObra = dados.titulo || obra.titulo || `Obra #${obra.id}`;
                const imagemObra = obra.arquivoUrl || obra.imagem_url || obra.imagemUrl || obra.arquivo_url || "";
                const totalCurtidas = obra.totalCurtidas ?? obra.total_curtidas ?? 0;
                const totalComentarios = obra.totalComentarios ?? obra.total_comentarios ?? 0;
                const totalViews = obra.visualizacoes ?? obra.total_visualizacoes ?? 0;

                const ext = imagemObra ? imagemObra.split(".").pop().toLowerCase().split("?")[0] : "";
                const isVideo = ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext) || obra.tipoMidia === "video" || obra.tipo === "video";
                const isPdf = ["pdf"].includes(ext);
                const isDoc = ["doc", "docx", "txt", "odt", "rtf", "ppt", "pptx"].includes(ext);
                const is3D = ["obj", "fbx", "gltf", "glb", "stl", "blend", "dae"].includes(ext);
                const isArchive = ["zip", "rar", "7z", "psd", "ai", "eps"].includes(ext);
                const isOutroArquivo = isPdf || isDoc || is3D || isArchive;

                return (
                  <div
                    key={obra.id}
                    className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group overflow-hidden"
                  >
                    <Link to={`/obra/${obra.id}`} className="relative h-60 bg-gray-100/70 overflow-hidden block cursor-pointer">
                      {isVideo ? (
                        <div className="relative w-full h-full bg-neutral-950 flex items-center justify-center">
                          <video
                            src={getMediaUrl(imagemObra)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            muted
                            playsInline
                            preload="metadata"
                          />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-white/10 z-10">
                            <i className="fa-solid fa-play text-[8px] text-artOrange"></i>
                            <span>Vídeo</span>
                          </div>
                        </div>
                      ) : isOutroArquivo ? (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col items-center justify-center text-white p-4 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 text-artOrange border border-white/10 flex items-center justify-center text-xl mb-2 shadow-inner">
                            <i className={isPdf ? "fa-solid fa-file-pdf" : isDoc ? "fa-solid fa-file-lines" : is3D ? "fa-solid fa-cube" : "fa-solid fa-file-zipper"}></i>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-artOrange bg-artOrange/20 px-2 py-0.5 rounded-full border border-artOrange/30">
                            {ext.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={getMediaUrl(imagemObra)}
                          alt={tituloObra}
                          onError={(e) => {
                            e.currentTarget.src = "/default-art.png";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-artDark shadow-sm border border-white/60 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-artGreen animate-pulse"></span>
                          <span>Ativa</span>
                        </span>
                      </div>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(obra.categorias && obra.categorias.length > 0 ? obra.categorias : (obra.categoria ? [obra.categoria] : [])).map((c, i) => (
                            <span
                              key={c.id || i}
                              className="bg-artPurple/10 text-artPurple px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest"
                            >
                              {c.nomeCategoria}
                            </span>
                          ))}
                        </div>

                        <Link to={`/obra/${obra.id}`} className="block hover:text-artOrange transition-colors">
                          <h3 className="font-editorial text-xl italic font-bold leading-snug line-clamp-1">
                            {tituloObra}
                          </h3>
                        </Link>

                        {dados.descricao && (
                          <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-light">
                            {dados.descricao}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-bold">
                          <span className="flex items-center gap-1" title="Curtidas">
                            <i className="fa-regular fa-heart text-artOrange"></i>
                            {totalCurtidas}
                          </span>
                          <span className="flex items-center gap-1" title="Comentários">
                            <i className="fa-regular fa-comment text-artBlue"></i>
                            {totalComentarios}
                          </span>
                          <span className="flex items-center gap-1" title="Visualizações">
                            <i className="fa-regular fa-eye text-gray-400"></i>
                            {totalViews}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between gap-2">
                        <Link
                          to={`/obra/${obra.id}`}
                          className="text-xs font-bold text-gray-600 group-hover:text-artOrange transition-colors flex items-center gap-2 relative py-1"
                        >
                          <span>Ver Detalhes</span>
                          <span className="relative flex items-center justify-center w-5 h-5">
                            <span className="absolute inset-0 rounded-full bg-artOrange/10 scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none"></span>
                            <i className="fa-solid fa-arrow-right text-[10px] relative z-10 transition-transform duration-300 group-hover:translate-x-1.5 text-gray-400 group-hover:text-artOrange"></i>
                          </span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/editar-obra/${obra.id}`}
                            className="w-8 h-8 rounded-full bg-gray-100/80 hover:bg-artDark hover:text-white transition-colors flex items-center justify-center text-xs"
                            title="Editar"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleExcluirObra(obra.id)}
                            disabled={deletandoId === obra.id}
                            className="w-8 h-8 rounded-full bg-artOrange/10 text-artOrange hover:bg-artOrange hover:text-white transition-colors flex items-center justify-center text-xs"
                            title="Excluir"
                          >
                            {deletandoId === obra.id ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa-solid fa-trash"></i>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
  );
}