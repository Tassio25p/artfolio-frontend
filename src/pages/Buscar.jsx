import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { obrasService, usuarioService, getMediaUrl } from "../services/api";
import { SETORES_ARTISTICOS, getEstiloCategoria } from "../constants/categories";

export default function Buscar() {
  const [termoBusca, setTermoBusca] = useState("");
  const [setorSelecionado, setSetorSelecionado] = useState("todas");
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
  const [tipoResultado, setTipoResultado] = useState("todos"); // "todos" | "obras" | "artistas"

  const [obras, setObras] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar dados reais do PostgreSQL
  const realizarBusca = async () => {
    setCarregando(true);
    try {
      const [obrasRes, artistasRes] = await Promise.all([
        obrasService.listarObras({ busca: termoBusca.trim() || undefined }),
        usuarioService.listarArtistas({ busca: termoBusca.trim() || undefined }),
      ]);
      setObras(Array.isArray(obrasRes) ? obrasRes : []);
      setArtistas(Array.isArray(artistasRes) ? artistasRes : []);
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      realizarBusca();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

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

    // 2. Filtro por Setor Macro
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
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header & Busca */}
          <div className="mb-8">
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
              Catálogo & Descoberta
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl italic leading-none mb-4">
              Buscar no Artfolio
            </h1>

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
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  tipoResultado === "todos"
                    ? "bg-artDark text-white border-artDark shadow-sm"
                    : "bg-white text-gray-600 border-black/5 hover:bg-gray-50"
                }`}
              >
                Tudo
              </button>

              <button
                type="button"
                onClick={() => setTipoResultado("obras")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  tipoResultado === "obras"
                    ? "bg-artPurple text-white border-artPurple shadow-sm"
                    : "bg-white text-gray-600 border-black/5 hover:bg-gray-50"
                }`}
              >
                Obras ({obrasFiltradas.length})
              </button>

              <button
                type="button"
                onClick={() => setTipoResultado("artistas")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  tipoResultado === "artistas"
                    ? "bg-artOrange text-white border-artOrange shadow-sm"
                    : "bg-white text-gray-600 border-black/5 hover:bg-gray-50"
                }`}
              >
                Artistas ({artistas.length})
              </button>
            </div>

            {/* Setores Artísticos (Macro-Categorias com Cores) */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Setores Artísticos
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

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${
                        isSelected
                          ? `${setor.corBg} shadow-md scale-105 border-transparent`
                          : "bg-white text-gray-600 border-black/5 hover:bg-gray-50"
                      }`}
                    >
                      <i className={setor.icone}></i>
                      <span>{setor.nome}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategorias do Setor Ativo */}
            {setorAtivoObj && setorAtivoObj.subcategorias && setorAtivoObj.subcategorias.length > 0 && (
              <div className="mt-3 bg-white rounded-2xl p-3 border border-black/5 flex flex-wrap gap-1.5 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setSubcategoriaSelecionada("")}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    subcategoriaSelecionada === ""
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
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                        isSubSelected
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
              {/* Seção de Artistas */}
              {(tipoResultado === "todos" || tipoResultado === "artistas") && artistas.length > 0 && (
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
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                      {obrasFiltradas.map((obra) => (
                        <div key={obra.id} className="break-inside-avoid">
                          <PostCard post={obra} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}