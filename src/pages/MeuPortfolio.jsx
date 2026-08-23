import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, getMediaUrl } from "../services/api";

export default function MeuPortfolio() {
  const { user } = useAuth();
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletandoId, setDeletandoId] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const carregarObras = async () => {
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
  };

  useEffect(() => {
    carregarObras();
  }, [user]);

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
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                Gerenciamento de Criações
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl italic leading-none">
                Minhas Obras
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-light">
                Gerencie todas as suas obras publicadas na plataforma
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-artPurple/10 via-artOrange/10 to-artBlue/10 border border-artPurple/20 text-artPurple text-xs font-semibold mt-3 shadow-sm">
                <i className="fa-solid fa-wand-magic-sparkles text-artOrange"></i>
                <span className="bg-gradient-to-r from-artPurple via-artOrange to-artBlue bg-clip-text text-transparent font-bold">
                  Aqui todas as suas contribuições belas para esta comunidade
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/perfil"
                className="bg-white border border-black/5 text-artDark px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-100 transition-all text-center"
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
              <i className="fa-solid fa-circle-check"></i>
              <span>{mensagemSucesso}</span>
            </div>
          )}

          {mensagemErro && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{mensagemErro}</span>
            </div>
          )}

          {/* Lista de Obras */}
          {loading ? (
            <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center shadow-sm">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-3"></i>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Carregando suas obras...
              </p>
            </div>
          ) : obras.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-black/5 p-12 text-center shadow-sm">
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
              {obras.map((obra) => (
                <div
                  key={obra.id}
                  className="bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col group"
                >
                  <div className="relative h-60 bg-gray-100 overflow-hidden">
                    <img
                      src={getMediaUrl(obra.arquivoUrl)}
                      alt={obra.legenda || "Obra"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-emerald-700 shadow-sm border border-black/5">
                        ● Ativa
                      </span>
                    </div>
                  </div>

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

                      <h3 className="font-editorial text-xl italic font-bold leading-snug line-clamp-1">
                        {obra.legenda || `Obra #${obra.id}`}
                      </h3>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-bold">
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-heart text-red-500"></i>
                          {obra.totalCurtidas || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-comment text-artBlue"></i>
                          {obra.totalComentarios || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-eye"></i>
                          {obra.visualizacoes || 0}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between gap-2">
                      <Link
                        to={`/obra/${obra.id}`}
                        className="text-xs font-bold text-gray-600 hover:text-artDark transition-colors"
                      >
                        Ver Detalhes
                      </Link>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/editar-obra/${obra.id}`}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-artDark hover:text-white transition-colors flex items-center justify-center text-xs"
                          title="Editar"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleExcluirObra(obra.id)}
                          disabled={deletandoId === obra.id}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-xs"
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}