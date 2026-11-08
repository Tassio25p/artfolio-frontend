import { useState, useEffect, useCallback } from "react";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { obrasService, usuarioService, categoriaService, getMediaUrl } from "../services/api";
import ModalComoFuncionaDesafio from "../components/ModalComoFuncionaDesafio";
import { SETORES_ARTISTICOS } from "../constants/categories";
import { renderTextWithEmojis } from "../utils/artfolioEmojis";

export default function Buscar() {
  const [termoBusca, setTermoBusca] = useState("");
  const [abaPrincipal, setAbaPrincipal] = useState("trending"); // "trending" | "catalogo"
  const [setorSelecionado, setSetorSelecionado] = useState("todas");
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
  const [desafioAtual, setDesafioAtual] = useState(null);
  const [modalComoFuncionaAberto, setModalComoFuncionaAberto] = useState(false);
  const [tipoResultado, setTipoResultado] = useState("todos"); // "todos" | "obras" | "artistas"
  const [limiteExibicao, setLimiteExibicao] = useState(20);

  const [obras, setObras] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    categoriaService.obterDesafioAtual().then(setDesafioAtual).catch(() => null);
  }, []);

  // Carregar dados reais do PostgreSQL / Redis Trending
  const realizarBusca = useCallback(async () => {
    setCarregando(true);
    try {
      if (!termoBusca.trim() && abaPrincipal === "trending") {
        const [emAltaRes, artistasRes] = await Promise.all([
          obrasService.obterEmAlta(),
          usuarioService.listarArtistas(),
        ]);
        setObras(Array.isArray(emAltaRes) ? emAltaRes : []);
        setArtistas(Array.isArray(artistasRes) ? artistasRes : []);
      } else {
        const [obrasRes, artistasRes] = await Promise.all([
          obrasService.listarObras({ busca: termoBusca.trim() || undefined }),
          usuarioService.listarArtistas({ busca: termoBusca.trim() || undefined }),
        ]);
        setObras(Array.isArray(obrasRes) ? obrasRes : []);
        setArtistas(Array.isArray(artistasRes) ? artistasRes : []);
      }
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setCarregando(false);
    }
  }, [termoBusca, abaPrincipal]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      realizarBusca();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [realizarBusca]);

  useEffect(() => {
    const handleModerationSync = (e) => {
      const { obraId, usuarioId } = e.detail || {};
      setObras((prev) =>
        prev.filter((obra) => {
          const matchObra = obraId && Number(obra.id) === Number(obraId);
          const autorId = obra.usuario?.id ?? obra.idUsuario;
          const matchAutor = usuarioId && Number(autorId) === Number(usuarioId);
          return !matchObra && !matchAutor;
        })
      );
      if (usuarioId) {
        setArtistas((prev) => prev.filter((artista) => Number(artista.id) !== Number(usuarioId)));
      }
    };
    window.addEventListener("artfolio_moderation_sync", handleModerationSync);
    return () => window.removeEventListener("artfolio_moderation_sync", handleModerationSync);
  }, []);

  // Setor ativo atual
  const setorAtivoObj = SETORES_ARTISTICOS.find((s) => s.id === setorSelecionado);

  // Filtrar obras por categoria/setor selecionado
  const obrasFiltradas = obras.filter((obra) => {
    // 1. Filtro de Subcategoria específica
    if (subcategoriaSelecionada) {
      const subLower = subcategoriaSelecionada.toLowerCase();
      const matchLegenda = (obra.legenda || "").toLowerCase().includes(subLower);
      const matchCatDireta = (obra.categoria?.nomeCategoria || "").toLowerCase().includes(subLower);
      const matchListaCats = (obra.categorias || []).some((c) =>
        (c.nomeCategoria || "").toLowerCase().includes(subLower)
      );
      return matchLegenda || matchCatDireta || matchListaCats;
    }

    // 3. Filtro por Setor Macro
    if (setorSelecionado && setorSelecionado !== "todas") {
      const setor = SETORES_ARTISTICOS.find((s) => s.id === setorSelecionado);
      if (!setor) return true;

      const subcats = setor.subcategorias.map((sc) => sc.toLowerCase());
      const setorNomeLower = setor.nome.toLowerCase();

      const nomeCatDireta = (obra.categoria?.nomeCategoria || "").toLowerCase();
      const matchSetorDireto =
        nomeCatDireta.includes(setorNomeLower) || subcats.some((sc) => nomeCatDireta.includes(sc));

      const matchSetorNaLista = (obra.categorias || []).some((c) => {
        const cNome = (c.nomeCategoria || "").toLowerCase();
        return cNome.includes(setorNomeLower) || subcats.some((sc) => cNome.includes(sc));
      });

      return matchSetorDireto || matchSetorNaLista;
    }

    return true;
  });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 lg:p-10 max-w-[1500px] mx-auto">
        {/* Header & Busca */}
        <div className="mb-8">
          <span className="text-artPurple font-bold tracking-widest uppercase text-xs sm:text-sm mb-2.5 block">
            Vitrine Global & Descoberta
          </span>
          <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl italic leading-[1.05] mb-4">
            Explorar no Artfolio<span className="not-italic text-artOrange">.</span>
          </h1>
          <p className="text-base text-gray-500 max-w-2xl leading-relaxed font-light mb-6">
            Descubra criações em destaque, explore por setores artísticos ou encontre obras e artistas pelo nome.
          </p>

          {/* Banner do Desafio da Semana em Destaque no Buscar */}
          {desafioAtual && (
            <div className="bg-gradient-to-r from-[#241442] via-[#1c1236] to-artDark text-white rounded-3xl p-5 sm:p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-2 border-artPurple/40 shadow-xl relative overflow-hidden group animate-fadeIn">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-artPurple via-indigo-600 to-artBlue text-white flex items-center justify-center text-xl shrink-0 shadow-lg shadow-artPurple/40">
                  <i className="fa-solid fa-bolt text-artOrange"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-artPurple/30 text-artOrange border border-artOrange/40 font-bold tracking-widest uppercase text-[10px] px-2.5 py-0.5 rounded-full">
                      ⚡ Desafio da Semana
                    </span>
                    <span className="text-gray-300 text-[10px] font-semibold">Tema Rotativo Oficial</span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl italic font-bold">
                    {desafioAtual.nomeCategoria}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed font-light">
                    Participe criando obras com a categoria <strong className="text-white font-semibold">{desafioAtual.nomeCategoria}</strong> ou veja as criações em destaque de toda a comunidade.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setModalComoFuncionaAberto(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <i className="fa-regular fa-circle-question text-artOrange text-xs"></i>
                  <span>Como funciona</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAbaPrincipal("catalogo");
                    if (termoBusca === desafioAtual.nomeCategoria) {
                      setTermoBusca("");
                    } else {
                      setTermoBusca(desafioAtual.nomeCategoria);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    termoBusca === desafioAtual.nomeCategoria
                      ? "bg-artOrange text-white shadow-md shadow-artOrange/30"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  <i className="fa-solid fa-filter text-xs"></i>
                  <span>{termoBusca === desafioAtual.nomeCategoria ? "Limpar Filtro do Desafio" : "Ver Obras do Desafio"}</span>
                </button>

                <Link
                  to="/criar-obra"
                  className="bg-gradient-to-r from-artPurple via-indigo-600 to-artBlue text-white px-5 py-2.5 rounded-full text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-artPurple/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>Participar</span>
                </Link>
              </div>
              <i className="fa-solid fa-trophy absolute -right-6 -bottom-8 text-[8rem] text-white/[0.04] rotate-12 pointer-events-none"></i>
            </div>
          )}

          {/* Banner Motivacional "Espaço Criativo" (Seguindo a mesma ordem do Feed) */}
          <div className="bg-gradient-to-r from-artDark via-[#1E1E24] to-artDark text-white rounded-3xl p-5 sm:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-artOrange via-amber-500 to-artPurple text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-artOrange/25">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-artOrange font-bold tracking-widest uppercase text-[10px]">
                    Espaço Criativo
                  </span>
                  <span className="w-1 h-1 rounded-full bg-artOrange"></span>
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Comunidade Artfolio</span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl italic font-bold">
                  Não se acanhe! Mostre a todos a sua obra-prima.
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed font-light">
                  Compartilhe suas criações com a comunidade, conecte-se com novos admiradores e faça sua arte aparecer no top dos tops!
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 w-full md:w-auto">
              <Link
                to="/criar-obra"
                className="w-full md:w-auto bg-gradient-to-r from-artOrange to-[#e55039] text-white px-6 py-3 rounded-full text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-artOrange/20 inline-flex items-center justify-center gap-2 text-center"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                Publicar Obra
              </Link>
            </div>

            <i className="fa-solid fa-palette absolute -right-6 -bottom-8 text-[8rem] text-white/[0.03] rotate-12 pointer-events-none"></i>
          </div>

          {/* Linha de Controle: Abas Principais + Filtros de Tipo na Mesma Linha */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
            {/* Abas Principais */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setAbaPrincipal("trending");
                  setTermoBusca("");
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  abaPrincipal === "trending" && !termoBusca
                    ? "bg-gradient-to-r from-artOrange to-amber-500 text-white shadow-md shadow-artOrange/25 scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-black/5 shadow-2xs"
                }`}
              >
                <i className="fa-solid fa-fire text-xs"></i>
                <span>Em Alta (Trending TOP 50)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAbaPrincipal("catalogo");
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  abaPrincipal === "catalogo" || termoBusca
                    ? "bg-artDark text-white shadow-md shadow-black/10 scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-black/5 shadow-2xs"
                }`}
              >
                <i className="fa-solid fa-compass text-xs"></i>
                <span>Explorar Catálogo</span>
              </button>
            </div>

            {/* Filtros Rápidos de Tipo ao Lado */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-black/5 shadow-2xs self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setTipoResultado("todos")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tipoResultado === "todos"
                    ? "bg-artDark text-white shadow-2xs"
                    : "text-gray-600 hover:text-artDark"
                }`}
              >
                Tudo
              </button>

              <button
                type="button"
                onClick={() => setTipoResultado("obras")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tipoResultado === "obras"
                    ? "bg-artPurple text-white shadow-2xs"
                    : "text-gray-600 hover:text-artPurple"
                }`}
              >
                Obras{termoBusca.trim() ? ` (${obrasFiltradas.length})` : ""}
              </button>

              <button
                type="button"
                onClick={() => setTipoResultado("artistas")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tipoResultado === "artistas"
                    ? "bg-artOrange text-white shadow-2xs"
                    : "text-gray-600 hover:text-artOrange"
                }`}
              >
                Artistas{termoBusca.trim() ? ` (${artistas.length})` : ""}
              </button>
            </div>
          </div>

          {/* Input de Busca */}
          <div className="relative max-w-2xl">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Busque por obras, artistas, estilos ou técnicas..."
              className="w-full bg-white border border-black/5 rounded-full pl-12 pr-6 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm shadow-sm"
            />
            {termoBusca && (
              <button
                type="button"
                onClick={() => setTermoBusca("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-artDark text-xs cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>


          {/* Setores Artísticos (Macro-Categorias com Carrossel e Chevrons) */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                Setores Artísticos & Macro-Categorias
              </span>
              {setorSelecionado !== "todas" && (
                <button
                  type="button"
                  onClick={() => {
                    setSetorSelecionado("todas");
                    setSubcategoriaSelecionada("");
                  }}
                  className="text-[10px] text-artOrange hover:underline font-bold"
                >
                  Limpar Filtro
                </button>
              )}
            </div>

            <div className="relative group/setores">
              {/* Botão de Rolar para a Esquerda */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("busca-setores-scroll-container");
                  if (el) el.scrollBy({ left: -260, behavior: "smooth" });
                }}
                className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-black/10 items-center justify-center text-xs text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 hover:scale-110"
                title="Rolar para esquerda"
              >
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
              </button>

              <div
                id="busca-setores-scroll-container"
                className="flex gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
              >
                {SETORES_ARTISTICOS.map((setor) => {
                  const isSelected = setorSelecionado === setor.id;
                  return (
                    <button
                      key={setor.id}
                      type="button"
                      onClick={() => {
                        setSetorSelecionado(setor.id);
                        setSubcategoriaSelecionada("");
                      }}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 shrink-0 ${isSelected
                          ? `${setor.corBg} shadow-md scale-105 border-transparent`
                          : "bg-white text-gray-600 border-black/5 hover:bg-gray-50 shadow-xs"
                        }`}
                    >
                      <i className={setor.icone}></i>
                      <span>{setor.nome}</span>
                    </button>
                  );
                })}
              </div>

              {/* Botão de Rolar para a Direita */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("busca-setores-scroll-container");
                  if (el) el.scrollBy({ left: 260, behavior: "smooth" });
                }}
                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-black/10 items-center justify-center text-xs text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 hover:scale-110"
                title="Rolar para direita"
              >
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Subcategorias do Setor Ativo */}
          {setorAtivoObj && setorAtivoObj.subcategorias && setorAtivoObj.subcategorias.length > 0 && (
            <div className="mt-3 bg-white rounded-2xl p-3 border border-black/5 flex flex-wrap gap-1.5 animate-fadeIn shadow-xs">
              <button
                type="button"
                onClick={() => setSubcategoriaSelecionada("")}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${subcategoriaSelecionada === ""
                    ? "bg-artDark text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Todas do Setor
              </button>
              {setorAtivoObj.subcategorias.map((sub) => {
                const isSubSelected = subcategoriaSelecionada === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubcategoriaSelecionada(sub)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isSubSelected
                        ? "bg-artPurple text-white shadow-sm"
                        : "bg-[#F9F8F6] text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Resultados */}
        {carregando ? (
          <div className="bg-white rounded-[2.5rem] border border-black/5 p-12 text-center shadow-sm">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-3"></i>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Pesquisando catálogo...
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Seção de Artistas - Exibida APENAS se o usuário pesquisar ativamente por nome ou selecionar a aba Artistas */}
            {(termoBusca.trim().length > 0 || tipoResultado === "artistas") && artistas.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="font-editorial text-2xl italic font-bold">
                    Artistas Encontrados
                  </h2>
                  <span className="text-xs font-bold text-gray-400">
                    {artistas.length} {artistas.length === 1 ? "artista" : "artistas"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {artistas.map((art) => (
                    <Link
                      key={art.id}
                      to={`/artista/${art.id}`}
                      className="bg-white rounded-[2rem] border border-black/5 p-5 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all text-center flex flex-col items-center group"
                    >
                      <div className="w-20 h-20 rounded-full bg-artPurple/10 overflow-hidden mb-3 border-2 border-white shadow-md">
                        {art.fotoPerfil ? (
                          <img
                            src={getMediaUrl(art.fotoPerfil)}
                            alt={art.nome}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-artPurple flex items-center justify-center text-white font-bold text-xl">
                            {art.nome?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                        )}
                      </div>

                      <h3 className="font-editorial text-xl italic font-bold text-artDark group-hover:text-artPurple transition-colors">
                        {art.nome}
                      </h3>

                      <span className="text-[9px] font-bold uppercase tracking-widest text-artPurple bg-artPurple/10 px-2.5 py-0.5 rounded-full mt-1">
                        {art.tipo_conta || "Artista"}
                      </span>

                      {art.biografia && (
                        <p className="text-xs text-gray-400 line-clamp-2 mt-2 font-light">
                          {renderTextWithEmojis(art.biografia)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Seção de Obras */}
            {(tipoResultado === "todos" || tipoResultado === "obras") && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="font-editorial text-2xl italic font-bold">
                    Obras Encontradas
                  </h2>
                  <span className="text-xs font-bold text-gray-400">
                    {obrasFiltradas.length} {obrasFiltradas.length === 1 ? "obra" : "obras"}
                  </span>
                </div>

                {obrasFiltradas.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] border border-black/5 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                      <i className="fa-solid fa-shapes"></i>
                    </div>
                    <h3 className="font-editorial text-2xl italic mb-1">
                      Nenhuma obra encontrada
                    </h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                      Tente buscar com outro termo ou selecionar outra categoria artística no catálogo.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {obrasFiltradas.slice(0, limiteExibicao).map((obra) => (
                        <PostCard key={obra.id} post={obra} />
                      ))}
                    </div>

                    {obrasFiltradas.length > limiteExibicao && (
                      <div className="mt-10 flex flex-col items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLimiteExibicao((prev) => prev + 20)}
                          className="bg-white hover:bg-gray-50 text-artDark border border-black/10 px-8 py-3.5 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2.5 cursor-pointer group"
                        >
                          <i className="fa-solid fa-arrow-down text-artOrange group-hover:translate-y-0.5 transition-transform"></i>
                          <span>Ver mais publicações (+20)</span>
                          <span className="text-gray-400 font-medium">({obrasFiltradas.length - limiteExibicao} restantes)</span>
                        </button>
                        <span className="text-[11px] text-gray-400 font-medium">
                          Exibindo {Math.min(limiteExibicao, obrasFiltradas.length)} de {obrasFiltradas.length} obras
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ModalComoFuncionaDesafio
        aberto={modalComoFuncionaAberto}
        onFechar={() => setModalComoFuncionaAberto(false)}
        desafioAtual={desafioAtual}
      />
    </div>
  );
}