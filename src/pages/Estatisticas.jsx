import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, usuarioService, getMediaUrl } from "../services/api";

export default function Estatisticas() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      navigate("/feed");
      return;
    }

    const carregarMetricas = async () => {
      try {
        if (user?.id) {
          const [perfilRes, obrasRes] = await Promise.all([
            usuarioService.obterPerfil(user.id),
            obrasService.listarObras({ usuario_id: user.id }),
          ]);
          setPerfil(perfilRes);
          setObras(Array.isArray(obrasRes) ? obrasRes : []);
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarMetricas();
  }, [user, isGuest]);

  if (loading) {
    return (
      <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-3"></i>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Carregando painel de estatísticas...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Cálculos agregados reais
  const totalVisualizacoes = obras.reduce((acc, o) => acc + (o.visualizacoes || 0), 0);
  const totalCurtidas = obras.reduce((acc, o) => acc + (o.totalCurtidas || 0), 0);
  const totalComentarios = obras.reduce((acc, o) => acc + (o.totalComentarios || 0), 0);
  const totalSalvos = obras.reduce((acc, o) => acc + (o.totalSalvos || 0), 0);
  const totalSeguidores = perfil?.seguidoresCount || perfil?.seguidores || 0;
  const totalObras = obras.length;

  // Obras mais vistas ordenadas
  const obrasPopulares = [...obras].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 5);

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
                Painel Privado do Criador
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl italic leading-none">
                Métricas & Estatísticas
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-light">
                Acompanhe o alcance e o engajamento real das suas obras na comunidade.
              </p>
            </div>

            <Link
              to="/perfil"
              className="bg-white border border-black/5 text-artDark px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center w-fit"
            >
              ← Ver Meu Perfil
            </Link>
          </div>

          {/* Grid de Cards de Estatísticas Reais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {/* Visualizações Totais */}
            <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center text-lg mx-auto mb-2">
                <i className="fa-solid fa-eye"></i>
              </div>
              <span className="font-editorial text-3xl italic font-black text-artDark block">
                {totalVisualizacoes}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Visualizações
              </span>
            </div>

            {/* Curtidas Totais */}
            <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-lg mx-auto mb-2">
                <i className="fa-solid fa-heart"></i>
              </div>
              <span className="font-editorial text-3xl italic font-black text-artDark block">
                {totalCurtidas}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Curtidas
              </span>
            </div>

            {/* Comentários Totais */}
            <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-artBlue/10 text-artBlue flex items-center justify-center text-lg mx-auto mb-2">
                <i className="fa-solid fa-comments"></i>
              </div>
              <span className="font-editorial text-3xl italic font-black text-artDark block">
                {totalComentarios}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Comentários
              </span>
            </div>

            {/* Obras Salvas / Favoritadas */}
            <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg mx-auto mb-2">
                <i className="fa-solid fa-bookmark"></i>
              </div>
              <span className="font-editorial text-3xl italic font-black text-artDark block">
                {totalSalvos}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Salvos
              </span>
            </div>

            {/* Seguidores */}
            <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mx-auto mb-2">
                <i className="fa-solid fa-users"></i>
              </div>
              <span className="font-editorial text-3xl italic font-black text-artDark block">
                {totalSeguidores}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Seguidores
              </span>
            </div>

            {/* Obras Publicadas */}
            <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center text-lg mx-auto mb-2">
                <i className="fa-solid fa-palette"></i>
              </div>
              <span className="font-editorial text-3xl italic font-black text-artDark block">
                {totalObras}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Obras Ativas
              </span>
            </div>
          </div>

          {/* Obras Mais Populares */}
          <div className="bg-white rounded-[2.5rem] border border-black/5 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                  Desempenho por Obra
                </span>
                <h2 className="font-editorial text-3xl italic font-bold">
                  Obras em Destaque
                </h2>
              </div>

              <Link
                to="/meu-portfolio"
                className="text-xs font-bold text-artOrange hover:underline"
              >
                Ver Todas as Obras →
              </Link>
            </div>

            {obrasPopulares.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <i className="fa-solid fa-chart-simple text-4xl mb-3 text-gray-200"></i>
                <p className="text-sm">Você ainda não tem obras publicadas para gerar métricas.</p>
                <Link
                  to="/criar-obra"
                  className="inline-block mt-4 bg-artDark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange transition-all"
                >
                  Publicar Primeira Obra
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {obrasPopulares.map((obra, index) => (
                  <Link
                    key={obra.id}
                    to={`/obra/${obra.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#F9F8F6] rounded-2xl border border-black/5 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-lg font-black text-gray-300 w-6 text-center">
                        #{index + 1}
                      </span>

                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-black/5">
                        <img
                          src={getMediaUrl(obra.arquivoUrl)}
                          alt={obra.legenda || "Obra"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-artDark group-hover:text-artPurple transition-colors truncate">
                          {obra.legenda || `Obra #${obra.id}`}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {obra.categoria?.nomeCategoria || (obra.categorias?.[0]?.nomeCategoria) || "Arte"} • {obra.dataPostagem ? new Date(obra.dataPostagem).toLocaleDateString("pt-BR") : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 shrink-0 text-xs font-bold text-gray-500 sm:justify-end">
                      <span className="flex items-center gap-1.5" title="Visualizações">
                        <i className="fa-solid fa-eye text-artPurple"></i>
                        {obra.visualizacoes || 0}
                      </span>

                      <span className="flex items-center gap-1.5" title="Curtidas">
                        <i className="fa-solid fa-heart text-red-500"></i>
                        {obra.totalCurtidas || 0}
                      </span>

                      <span className="flex items-center gap-1.5" title="Comentários">
                        <i className="fa-solid fa-comment text-artBlue"></i>
                        {obra.totalComentarios || 0}
                      </span>

                      <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-artDark transition-colors"></i>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}