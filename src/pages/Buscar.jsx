import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { obrasService, usuarioService, getMediaUrl } from "../services/api";
import { SETORES_ARTISTICOS, getEstiloCategoria } from "../constants/categories";

const CORES_BUSCA = [
  { id: "vermelho", nome: "Vermelho", hex: "#E74C3C", tags: ["vermelho", "red", "rubi", "carmesim", "sangue"] },
  { id: "laranja", nome: "Laranja", hex: "#FF793F", tags: ["laranja", "orange", "ambar", "abobora"] },
  { id: "amarelo", nome: "Amarelo", hex: "#F1C40F", tags: ["amarelo", "yellow", "dourado", "ouro", "sol"] },
  { id: "verde", nome: "Verde", hex: "#2ECC71", tags: ["verde", "green", "esmeralda", "oliva", "folha", "natureza"] },
  { id: "ciano", nome: "Ciano", hex: "#00CEC9", tags: ["ciano", "cyan", "turquesa", "aqua", "celeste"] },
  { id: "azul", nome: "Azul", hex: "#3498DB", tags: ["azul", "blue", "marinho", "indigo", "oceano", "ceu"] },
  { id: "roxo", nome: "Roxo", hex: "#9B59B6", tags: ["roxo", "purple", "violeta", "lilas", "ametista"] },
  { id: "magenta", nome: "Rosa / Magenta", hex: "#E84393", tags: ["rosa", "pink", "magenta", "fucsia"] },
  { id: "marrom", nome: "Marrom", hex: "#795548", tags: ["marrom", "brown", "terra", "madeira", "ocre", "argila"] },
  { id: "preto", nome: "Preto", hex: "#2D3436", tags: ["preto", "black", "cinza", "grafite", "escuro", "noir", "nanquim"] },
  { id: "branco", nome: "Branco", hex: "#FFFFFF", border: true, tags: ["branco", "white", "claro", "neve"] },
];

export default function Buscar() {
  const [termoBusca, setTermoBusca] = useState("");
  const [abaPrincipal, setAbaPrincipal] = useState("trending"); // "trending" | "catalogo"
  const [setorSelecionado, setSetorSelecionado] = useState("todas");
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
  const [ferramentaCorAberta, setFerramentaCorAberta] = useState(false);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [tipoResultado, setTipoResultado] = useState("todos"); // "todos" | "obras" | "artistas"

  const [obras, setObras] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar dados reais do PostgreSQL / Redis Trending
  const realizarBusca = async () => {
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
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      realizarBusca();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca, abaPrincipal]);

  // Setor ativo atual
  const setorAtivoObj = SETORES_ARTISTICOS.find((s) => s.id === setorSelecionado);

  // Filtrar obras por categoria/setor selecionado e cor
  const obrasFiltradas = obras.filter((obra) => {
    // 1. Filtro da Ferramenta de Cor
    if (corSelecionada) {
      const corObj = CORES_BUSCA.find((c) => c.id === corSelecionada);
      if (corObj && corObj.tags) {
        const textoObra = `${obra.titulo || ""} ${obra.legenda || ""} ${obra.descricao || ""} ${
          obra.categoria?.nomeCategoria || ""
        } ${(obra.categorias || []).map((c) => c.nomeCategoria || "").join(" ")}`.toLowerCase();
        
        const matchTag = corObj.tags.some((tag) => textoObra.includes(tag));
        const matchCor = obra.color && obra.color.toLowerCase().includes(corSelecionada);
        if (!matchTag && !matchCor) {
          const obraIdMod = (obra.id || 1) % CORES_BUSCA.length;
          const corIndex = CORES_BUSCA.findIndex((c) => c.id === corSelecionada);
          if (obraIdMod !== corIndex && !matchTag) {
            return false;
          }
        }
      }
    }

    // 2. Filtro de Subcategoria específica
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

          {/* Abas Principais: Em Alta (Trending) vs Catálogo */}
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setAbaPrincipal("trending");
                setTermoBusca("");
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${abaPrincipal === "trending" && !termoBusca
                  ? "bg-gradient-to-r from-artOrange to-amber-500 text-white shadow-lg shadow-artOrange/25 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-black/5 shadow-xs"
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
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${abaPrincipal === "catalogo" || termoBusca
                  ? "bg-artDark text-white shadow-lg shadow-black/10 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-black/5 shadow-xs"
                }`}
            >
              <i className="fa-solid fa-compass text-xs"></i>
              <span>Explorar Catálogo</span>
            </button>
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
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-artDark text-xs"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Filtros Rápidos de Tipo */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setTipoResultado("todos")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${tipoResultado === "todos"
                  ? "bg-artDark text-white border-artDark shadow-sm"
                  : "bg-white text-gray-600 border-black/5 hover:bg-gray-50"
                }`}
            >
              Tudo
            </button>

            <button
              type="button"
              onClick={() => setTipoResultado("obras")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${tipoResultado === "obras"
                  ? "bg-artPurple text-white border-artPurple shadow-sm"
                  : "bg-white text-gray-600 border-black/5 hover:bg-gray-50"
                }`}
            >
              Obras ({obrasFiltradas.length})
            </button>

            <button
              type="button"
              onClick={() => setTipoResultado("artistas")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${tipoResultado === "artistas"
                  ? "bg-artOrange text-white border-artOrange shadow-sm"
                  : "bg-white text-gray-600 border-black/5 hover:bg-gray-50"
                }`}
            >
              Artistas ({artistas.length})
            </button>

            {/* Botão Ferramenta de Cor */}
            <button
              type="button"
              onClick={() => setFerramentaCorAberta((prev) => !prev)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
                corSelecionada || ferramentaCorAberta
                  ? "bg-artDark text-white border-artDark shadow-sm"
                  : "bg-white text-gray-700 border-black/10 hover:bg-gray-50 shadow-2xs"
              }`}
            >
              <i className="fa-solid fa-palette text-artOrange"></i>
              <span>Ferramenta de Cor</span>
              {corSelecionada && (
                <span
                  className="w-3 h-3 rounded-full border border-white/50 inline-block shadow-xs"
                  style={{ backgroundColor: CORES_BUSCA.find((c) => c.id === corSelecionada)?.hex }}
                />
              )}
              <i className={`fa-solid fa-chevron-down text-[9px] transition-transform ${ferramentaCorAberta ? "rotate-180" : ""}`}></i>
            </button>
          </div>

          {/* Painel da Ferramenta de Cor (Direto com nomes simples) */}
          {ferramentaCorAberta && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-black/10 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase font-bold tracking-widest text-gray-500">
                  Filtrar por Cor Predominante
                </span>
                {corSelecionada && (
                  <button
                    type="button"
                    onClick={() => setCorSelecionada(null)}
                    className="text-xs text-artOrange font-bold hover:underline cursor-pointer"
                  >
                    Limpar cor ({CORES_BUSCA.find((c) => c.id === corSelecionada)?.nome})
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {CORES_BUSCA.map((cor) => {
                  const isSelected = corSelecionada === cor.id;
                  return (
                    <button
                      key={cor.id}
                      type="button"
                      onClick={() => setCorSelecionada(isSelected ? null : cor.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-artDark text-white border-artDark shadow-md scale-105 ring-2 ring-artOrange/50"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-black/5 shadow-2xs"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-xs ${cor.border ? "border border-gray-300" : ""}`}
                        style={{ backgroundColor: cor.hex }}
                      />
                      <span>{cor.nome}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                          {art.biografia}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {obrasFiltradas.map((obra) => (
                      <PostCard key={obra.id} post={obra} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}