import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService, obrasService, getMediaUrl } from "../services/api";
import { desempacotarDadosObra } from "../utils/obraHelper";

export default function Estatisticas() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const [estatisticas, setEstatisticas] = useState(null);
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
          const [statsRes, obrasRes] = await Promise.all([
            usuarioService.obterEstatisticasPainel(user.id).catch(() => null),
            obrasService.listarObras({ usuario_id: user.id }).catch(() => []),
          ]);
          setEstatisticas(statsRes);
          setObras(Array.isArray(obrasRes) ? obrasRes : []);
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarMetricas();
  }, [user, isGuest, navigate]);

  if (loading) {
    return (
      <div className="w-full text-artDark min-h-screen antialiased font-sans flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-3"></i>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Carregando painel de estatísticas...
          </p>
        </div>
      </div>
    );
  }

  // Validação de acesso segura e dinâmica (comunicação com a API)
  const planoNome = (estatisticas?.tipoPlano || estatisticas?.plano || user?.plano || "Free").toLowerCase();
  const temAcesso = Boolean(
    estatisticas?.acesso_permitido === true ||
    (estatisticas?.disponivel === true && (planoNome === "pro" || planoNome === "boost")) ||
    planoNome === "pro" ||
    planoNome === "boost"
  );

  // Total de obras ativas (sempre real e livre)
  const totalObrasAtivas = estatisticas?.obras_ativas ?? obras.length ?? 0;

  // Dados reais para usuários Pro e Boost
  const totaisReais = estatisticas?.totais || {
    visualizacoes: 0,
    curtidas: 0,
    comentarios: 0,
    salvos: 0,
    seguidores: 0,
    obras: totalObrasAtivas,
  };
  const periodosReais = estatisticas?.periodos || { seguidoresSemana: 0, seguidoresMes: 0 };
  const podioReal = estatisticas?.podioCategorias || [];

  // Dados mockados/estéticos para preenchimento de fundo dos usuários Free (evita aspecto de tela quebrada)
  const totaisSimulados = {
    visualizacoes: "4.8K",
    curtidas: "1.2K",
    comentarios: "240",
    salvos: "180",
    seguidores: "350",
    obras: totalObrasAtivas,
  };
  const periodosSimulados = { seguidoresSemana: 42, seguidoresMes: 168 };
  const podioSimulado = [
    { posicao: 1, nome: "Ilustração Digital", totalObras: 18, totalCurtidas: 850, totalSalvos: 120 },
    { posicao: 2, nome: "Arte Conceitual", totalObras: 12, totalCurtidas: 620, totalSalvos: 90 },
    { posicao: 3, nome: "Pintura Tradicional", totalObras: 9, totalCurtidas: 410, totalSalvos: 65 },
  ];

  const totaisExibidos = temAcesso ? totaisReais : totaisSimulados;
  const periodosExibidos = temAcesso ? periodosReais : periodosSimulados;
  const podioExibido = temAcesso ? podioReal : podioSimulado;

  // Obras mais vistas ordenadas
  const obrasPopulares = [...obras]
    .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
    .slice(0, 5);

  // Função auxiliar para renderizar o miolo das estatísticas (comum ao modo liberado ou simulado borrado)
  const renderizarMioloEstatisticas = () => (
    <>
      {/* Pódio de Categorias com Maior Engajamento */}
      <section className="bg-white rounded-3xl border border-black/5 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-amber-500 font-bold tracking-widest uppercase text-[10px] block mb-1">
              <i className="fa-solid fa-trophy mr-1.5"></i>
              Engajamento Qualificado
            </span>
            <h2 className="font-editorial text-3xl italic font-bold">
              Pódio das Suas Melhores Categorias
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              As categorias que mais despertaram curtidas e obras salvas pelo seu público.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {podioExibido.map((cat, idx) => {
            const ehOuro = idx === 0;
            const ehPrata = idx === 1;

            const badgeCor = ehOuro
              ? "bg-amber-100 text-amber-800 border-amber-300"
              : ehPrata
                ? "bg-gray-100 text-gray-700 border-gray-300"
                : "bg-amber-900/10 text-amber-900 border-amber-900/30";

            const medalhaIcon = ehOuro
              ? "fa-medal text-amber-500 text-3xl"
              : ehPrata
                ? "fa-medal text-gray-400 text-3xl"
                : "fa-medal text-amber-700 text-3xl";

            return (
              <div
                key={cat.nome || idx}
                className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${ehOuro
                    ? "bg-gradient-to-b from-amber-500/5 to-transparent border-amber-200 shadow-md"
                    : "bg-[#F9F8F6] border-black/5"
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeCor}`}
                    >
                      {cat.posicao}º Lugar
                    </span>
                    <h3 className="font-editorial text-2xl mt-2 text-artDark">
                      {cat.nome}
                    </h3>
                  </div>
                  <i className={`fa-solid ${medalhaIcon}`}></i>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-black/5 text-center">
                  <div>
                    <span className="text-xs font-bold text-artDark block">
                      {cat.totalObras}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase">Obras</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-500 block">
                      {cat.totalCurtidas}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase">Curtidas</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600 block">
                      {cat.totalSalvos}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase">Salvos</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grid de Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Visualizações */}
        <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center text-lg mx-auto mb-2">
            <i className="fa-solid fa-eye"></i>
          </div>
          <span className="font-editorial text-3xl italic font-black text-artDark block">
            {totaisExibidos.visualizacoes}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Visualizações
          </span>
        </div>

        {/* Curtidas */}
        <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-lg mx-auto mb-2">
            <i className="fa-solid fa-heart"></i>
          </div>
          <span className="font-editorial text-3xl italic font-black text-artDark block">
            {totaisExibidos.curtidas}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Curtidas
          </span>
        </div>

        {/* Comentários */}
        <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-artBlue/10 text-artBlue flex items-center justify-center text-lg mx-auto mb-2">
            <i className="fa-solid fa-comments"></i>
          </div>
          <span className="font-editorial text-3xl italic font-black text-artDark block">
            {totaisExibidos.comentarios}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Comentários
          </span>
        </div>

        {/* Obras Salvas */}
        <div className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg mx-auto mb-2">
            <i className="fa-solid fa-bookmark"></i>
          </div>
          <span className="font-editorial text-3xl italic font-black text-artDark block">
            {totaisExibidos.salvos}
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
            {totaisExibidos.seguidores}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Seguidores
          </span>
        </div>
      </div>

      {/* Crescimento Temporal (Semana & Mês) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl border border-black/5 p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-[10px] block mb-1">
              Crescimento Recente
            </span>
            <h3 className="font-editorial text-2xl italic">Novos Seguidores na Semana</h3>
            <p className="text-xs text-gray-400 mt-1">Conquistados nos últimos 7 dias</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-emerald-600">
              +{periodosExibidos.seguidoresSemana}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
              Alcance Mensal
            </span>
            <h3 className="font-editorial text-2xl italic">Novos Seguidores no Mês</h3>
            <p className="text-xs text-gray-400 mt-1">Conquistados nos últimos 30 dias</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-artPurple">
              +{periodosExibidos.seguidoresMes}
            </span>
          </div>
        </div>
      </div>

      {/* Obras em Destaque */}
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
            {obrasPopulares.map((obra, index) => {
              const dados = desempacotarDadosObra(obra);
              const tituloObra = dados.titulo || obra.titulo || `Obra #${obra.id}`;
              const imagemObra = obra.arquivoUrl || obra.imagem_url || obra.imagemUrl || obra.arquivo_url || "";
              const totalCurtidas = obra.totalCurtidas ?? obra.total_curtidas ?? 0;
              const totalComentarios = obra.totalComentarios ?? obra.total_comentarios ?? 0;
              const totalViews = obra.visualizacoes ?? obra.total_visualizacoes ?? 0;

              return (
                <Link
                  key={obra.id}
                  to={`/obra/${obra.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#F9F8F6] rounded-2xl border border-black/5 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className="text-lg font-black text-gray-300 w-6 text-center shrink-0">
                      #{index + 1}
                    </span>

                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-black/5">
                      <img
                        src={getMediaUrl(imagemObra)}
                        alt={tituloObra}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="min-w-0 max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md">
                      <h3 className="font-bold text-sm text-artDark group-hover:text-artPurple transition-colors truncate" title={tituloObra}>
                        {tituloObra}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {obra.categoria?.nomeCategoria || (obra.categorias?.[0]?.nomeCategoria) || "Arte"} • {obra.dataPostagem ? new Date(obra.dataPostagem).toLocaleDateString("pt-BR") : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 text-xs font-bold text-gray-500 sm:justify-end">
                    <span className="flex items-center gap-1.5" title="Visualizações">
                      <i className="fa-solid fa-eye text-artPurple"></i>
                      {totalViews}
                    </span>

                    <span className="flex items-center gap-1.5" title="Curtidas">
                      <i className="fa-solid fa-heart text-red-500"></i>
                      {totalCurtidas}
                    </span>

                    <span className="flex items-center gap-1.5" title="Comentários">
                      <i className="fa-solid fa-comment text-artBlue"></i>
                      {totalComentarios}
                    </span>

                    <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-artDark group-hover:translate-x-1 transition-transform ml-2"></i>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
          {/* 1. PRESERVAÇÃO DO TOPO (100% NÍTIDO E NAVEGÁVEL) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-artPurple font-bold tracking-widest uppercase text-xs sm:text-sm">
                  Painel de Criador
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${planoNome === "boost"
                      ? "bg-artOrange text-white shadow-xs"
                      : planoNome === "pro"
                        ? "bg-artPurple text-white shadow-xs"
                        : "bg-artGreen text-white shadow-xs"
                    }`}
                >
                  Plano {planoNome.toUpperCase()}
                </span>
              </div>
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl italic leading-[1.05]">
                Métricas & Estatísticas<span className="text-artOrange not-italic">.</span>
              </h1>
              <p className="text-base text-gray-500 mt-3 font-light">
                Acompanhe o engajamento das suas obras, o pódio de categorias e o crescimento de seguidores.
              </p>
            </div>

            <Link
              to="/perfil"
              className="bg-white border border-black/5 text-artDark px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center w-fit shadow-xs"
            >
              ← Ver Meu Perfil
            </Link>
          </div>

          {/* CARD DE OBRAS PUBLICADAS (NÍTIDO E COM DADO REAL, INDEPENDENTE DO PLANO) */}
          <div className="bg-white rounded-3xl border border-black/5 p-5 sm:p-6 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center text-xl shrink-0 shadow-sm">
                <i className="fa-solid fa-palette"></i>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block mb-0.5">
                  Seu Portfólio Atual
                </span>
                <h3 className="font-editorial text-2xl italic font-bold">
                  Obras Publicadas
                </h3>
                <p className="text-xs text-gray-400">
                  Todas as suas criações ativas e visíveis na comunidade.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-black/5">
              <span className="font-editorial text-4xl sm:text-5xl font-black text-artDark block leading-none">
                {totalObrasAtivas}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1 block">
                Obras Ativas
              </span>
            </div>
          </div>

          {/* RENDERIZAÇÃO CONDICIONAL DO MIOLO: COM BLOQUEIO RELATIVO OU TOTALMENTE LIBERADO */}
          {!temAcesso ? (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-sm">

              {/* 1. CONTEÚDO BORRADO AO FUNDO */}
              <div className="blur-xl opacity-60 pointer-events-none select-none">
                {renderizarMioloEstatisticas()}
              </div>

              {/* 2. OVERLAY DARK GLASS COM CARD CENTRAL (FRENTE) */}
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/30 p-6 backdrop-blur-sm">

                {/* O Card Modal Flutuante */}
                <div className="flex w-full max-w-2xl flex-col items-center rounded-3xl border border-white/10 bg-[#121212]/70 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-2xl transition-all">

                  {/* Ícone de Cadeado Minimalista */}
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-inner">
                    <i className="fa-solid fa-lock text-3xl text-white/80"></i>
                  </div>

                  {/* Título com Gradiente Oficial */}
                  <h3 className="mb-4 bg-gradient-to-r from-artPurple via-artOrange to-artBlue bg-clip-text text-3xl sm:text-4xl font-editorial font-bold leading-tight text-transparent">
                    Para acessar as estatísticas, mude o plano
                  </h3>

                  {/* Texto Explicativo */}
                  <p className="mb-8 max-w-md text-sm sm:text-base text-gray-300 font-sans">
                    Suas métricas completas, o pódio de categorias e o crescimento de seguidores estarão disponíveis após a assinatura do plano PRO.
                  </p>

                  {/* Botão de Upgrade */}
                  <Link
                    to="/planos"
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-white text-artDark shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                  >
                    Mudar de Plano
                    <i className="fa-solid fa-arrow-right text-artOrange group-hover:translate-x-1 transition-transform"></i>
                  </Link>

                </div>
              </div>
            </div>
          ) : (
            renderizarMioloEstatisticas()
          )}
        </div>
      </div>
  );
}