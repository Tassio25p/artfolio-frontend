import { useState, useEffect, useCallback } from "react";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { feedService, obrasService, usuarioService, categoriaService } from "../services/api";
import ModalDenuncia from "../components/ModalDenuncia";
import ModalConversao from "../components/ModalConversao";
import ModalComoFuncionaDesafio from "../components/ModalComoFuncionaDesafio";

export default function Home() {
  const [desafioAtual, setDesafioAtual] = useState(null);
  const [desafioFiltroAtivo, setDesafioFiltroAtivo] = useState(false);
  const [modalComoFuncionaAberto, setModalComoFuncionaAberto] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recarregando, setRecarregando] = useState(false);
  const [preferenciasUsuario, setPreferenciasUsuario] = useState([]);
  const [todasCategorias, setTodasCategorias] = useState([]);
  const [categoriaFiltroAtiva, setCategoriaFiltroAtiva] = useState(null);
  const [limiteExibicao, setLimiteExibicao] = useState(20);

  const { user: currentUser, isGuest } = useAuth();

  // Modal de Conversão para Visitante
  const [modalConversaoAberto, setModalConversaoAberto] = useState(false);
  const [acaoTentada, setAcaoTentada] = useState("interagir");

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const carregarFeed = useCallback(async () => {
    try {
      const [feedData, desafioData, prefsData, catsData] = await Promise.all([
        feedService.obterFeed(),
        categoriaService.obterDesafioAtual().catch(() => null),
        currentUser?.id && !isGuest ? usuarioService.obterPreferencias().catch(() => []) : Promise.resolve([]),
        categoriaService.listar().catch(() => []),
      ]);
      if (Array.isArray(feedData)) {
        setPosts(feedData);
      }
      setDesafioAtual(desafioData);
      setPreferenciasUsuario(Array.isArray(prefsData) ? prefsData : []);
      setTodasCategorias(Array.isArray(catsData) ? catsData : []);
    } catch (err) {
      console.error("Erro ao carregar o feed:", err);
      mostrarAviso(err.message || "Erro ao carregar o feed de postagens.", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, isGuest]);

  const handleRecarregarFeed = async () => {
    setRecarregando(true);
    await carregarFeed();
    setRecarregando(false);
    mostrarAviso("Feed atualizado com sucesso!", "info");
  };

  useEffect(() => {
    carregarFeed();
  }, [carregarFeed]);

  useEffect(() => {
    const handleModerationSync = (e) => {
      const { obraId, usuarioId } = e.detail || {};
      setPosts((prev) =>
        prev.filter((post) => {
          const matchObra = obraId && Number(post.id) === Number(obraId);
          const autorId = post.usuario?.id ?? post.idUsuario;
          const matchAutor = usuarioId && Number(autorId) === Number(usuarioId);
          return !matchObra && !matchAutor;
        })
      );
    };
    window.addEventListener("artfolio_moderation_sync", handleModerationSync);
    return () => window.removeEventListener("artfolio_moderation_sync", handleModerationSync);
  }, []);

  const handleToggleLike = async (postId, estaCurtido) => {
    if (isGuest) {
      setAcaoTentada("curtir esta obra");
      setModalConversaoAberto(true);
      return;
    }

    try {
      if (estaCurtido) {
        await obrasService.descurtir(postId);
      } else {
        await obrasService.curtir(postId);
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              curtido_por_mim: !estaCurtido,
              likes: estaCurtido ? Math.max(0, post.likes - 1) : post.likes + 1,
            };
          }
          return post;
        })
      );
    } catch (err) {
      mostrarAviso(err.message || "Erro ao alterar curtida.", "error");
    }
  };

  const handleToggleSave = async (postId, estaSalvo) => {
    if (isGuest) {
      setAcaoTentada("salvar esta obra nos seus favoritos");
      setModalConversaoAberto(true);
      return;
    }

    try {
      if (estaSalvo) {
        await obrasService.removerSalvo(postId);
        mostrarAviso("Obra removida dos favoritos com sucesso.", "info");
      } else {
        await obrasService.salvarObra(postId);
        mostrarAviso("Obra salva nos favoritos!", "info");
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              salvo_por_mim: !estaSalvo,
            };
          }
          return post;
        })
      );
    } catch (err) {
      mostrarAviso(err.message || "Erro ao alterar salvamento da obra.", "error");
    }
  };

  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [denunciaAtual, setDenunciaAtual] = useState({ idPostagem: null, alvo: "" });

  const handleAbrirDenuncia = (post) => {
    if (isGuest) {
      setAcaoTentada("denunciar uma publicação");
      setModalConversaoAberto(true);
      return;
    }

    setDenunciaAtual({
      idPostagem: post.id,
      alvo: post.legenda || `Obra #${post.id} por ${post.usuario?.nome || "Artista"}`,
    });
    setModalDenunciaAberto(true);
  };

  const handleToggleFollow = async (usuarioId, estaSeguindo) => {
    if (isGuest) {
      setAcaoTentada("seguir artistas");
      setModalConversaoAberto(true);
      return;
    }

    try {
      if (estaSeguindo) {
        await usuarioService.deixarDeSeguir(usuarioId);
      } else {
        await usuarioService.seguir(usuarioId);
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.usuario?.id === usuarioId) {
            return {
              ...post,
              seguindo_usuario: !estaSeguindo,
              seguidores: estaSeguindo ? Math.max(0, post.seguidores - 1) : post.seguidores + 1,
            };
          }
          return post;
        })
      );
    } catch (err) {
      mostrarAviso(err.message || "Erro ao alterar relacionamento de seguir.", "error");
    }
  };

  // --- Lógica do Feed "Para Você" ---
  // 1. Filtrar obras que não sejam de perfil privado (a menos que seja o próprio usuário autor)
  const postsVisiveis = posts.filter(
    (post) => !post.usuario || post.usuario.perfil_publico !== false || Number(post.usuario.id) === Number(currentUser?.id)
  );

  const temPreferencias = Array.isArray(preferenciasUsuario) && preferenciasUsuario.length > 0;

  // 2. Categorias preferidas com nomes mapeados
  const categoriasPreferidasObjs = preferenciasUsuario.map((pref) => {
    const idCat = pref.idCategoria || pref.id;
    const catEncontrada = todasCategorias.find((c) => Number(c.id) === Number(idCat));
    return catEncontrada || { id: idCat, nomeCategoria: pref.nomeCategoria || `Categoria #${idCat}` };
  });

  // 3. Montar a lista do Feed Para Você
  let postsParaVoce;

  if (desafioFiltroAtivo && desafioAtual) {
    const desLower = desafioAtual.nomeCategoria.toLowerCase();
    postsParaVoce = postsVisiveis.filter((p) =>
      (p.legenda || "").toLowerCase().includes(desLower) ||
      (p.categoria?.nomeCategoria || "").toLowerCase().includes(desLower)
    );
  } else if (categoriaFiltroAtiva) {
    // Filtro específico ao clicar na categoria favorita (ex: "Fotografia" -> mostra as mais recomendadas desta categoria)
    const catFiltroLower = categoriaFiltroAtiva.toLowerCase();
    postsParaVoce = postsVisiveis
      .filter((post) => {
        const catNome = (post.categoria?.nomeCategoria || "").toLowerCase();
        const matchNome = catNome.includes(catFiltroLower);
        const matchLista = Array.isArray(post.categorias) && post.categorias.some((c) =>
          (c.nomeCategoria || "").toLowerCase().includes(catFiltroLower)
        );
        const matchLegenda = (post.legenda || "").toLowerCase().includes(catFiltroLower);
        return matchNome || matchLista || matchLegenda;
      })
      .sort((a, b) => {
        // Mais recomendadas da categoria selecionada
        const scoreA = (Number(a.likes) || 0) * 3 + (Number(a.comentarios) || 0) * 2 + (Number(a.visualizacoes) || 0);
        const scoreB = (Number(b.likes) || 0) * 3 + (Number(b.comentarios) || 0) * 2 + (Number(b.visualizacoes) || 0);
        return scoreB - scoreA;
      });
  } else if (temPreferencias) {
    const idsPrefs = preferenciasUsuario.map((p) => Number(p.idCategoria || p.id));
    const nomesPrefs = categoriasPreferidasObjs.map((c) => (c.nomeCategoria || "").toLowerCase()).filter(Boolean);

    postsParaVoce = postsVisiveis.filter((post) => {
      // Obras das categorias favoritas
      const catId = Number(post.categoria?.id || post.idCategoria);
      const catNome = (post.categoria?.nomeCategoria || "").toLowerCase();
      const matchId = idsPrefs.includes(catId);
      const matchNome = nomesPrefs.some((np) => catNome.includes(np));
      const matchLista = Array.isArray(post.categorias) && post.categorias.some((c) =>
        idsPrefs.includes(Number(c.id)) || nomesPrefs.some((np) => (c.nomeCategoria || "").toLowerCase().includes(np))
      );

      // Postagens de pessoas que o usuário segue (mesmo que de outras categorias)
      const matchSeguindo = Boolean(post.seguindo_usuario);

      return matchId || matchNome || matchLista || matchSeguindo;
    });
  } else {
    // Caso sem preferências selecionadas: exibir os mais famosos / em alta (ordenados por score de engajamento)
    postsParaVoce = [...postsVisiveis].sort((a, b) => {
      const scoreA = (Number(a.likes) || 0) * 3 + (Number(a.comentarios) || 0) * 2 + (Number(a.visualizacoes) || 0);
      const scoreB = (Number(b.likes) || 0) * 3 + (Number(b.comentarios) || 0) * 2 + (Number(b.visualizacoes) || 0);
      return scoreB - scoreA;
    });
  }

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/10",
    error: "bg-red-50 text-red-500 border-red-200",
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 lg:p-10 max-w-[1500px] mx-auto">
          {/* Banner de Aviso para Visitantes */}
          {isGuest && (
            <div className="bg-artBlue/10 border border-artBlue/20 rounded-[2rem] p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-artBlue text-white flex items-center justify-center text-lg shrink-0 shadow-md shadow-artBlue/20">
                  <i className="fa-solid fa-eye"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-artDark">
                    Você está navegando como Visitante ({currentUser?.nome || "Convidado"})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-light">
                    Aproveite para explorar o feed. Para curtir, comentar, publicar obras ou conversar com artistas, crie sua conta de Artista.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <Link
                  to="/cadastro"
                  className="bg-artDark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange transition-all text-center flex-1 sm:flex-none shadow-md"
                >
                  Criar Conta de Artista
                </Link>

                <Link
                  to="/login"
                  className="bg-white border border-black/10 text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center flex-1 sm:flex-none"
                >
                  Fazer Login
                </Link>
              </div>
            </div>
          )}

          <header className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
              <div>
                <span className="text-artPurple font-bold tracking-widest uppercase text-xs sm:text-sm mb-2.5 block">
                  Galeria & Feed
                </span>

                <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl italic leading-[1.05]">
                  O que há de <br />
                  <span className="text-artDark not-italic">novo hoje<span className="text-artOrange">.</span></span>
                </h1>

                <p className="text-base text-gray-500 mt-4 max-w-2xl leading-relaxed font-light">
                  Explore obras de toda a comunidade, descubra novos criadores e acompanhe publicações em tempo real.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Botão Padrão de Recarregar Feed com Ícone Giratório */}
                <button
                  type="button"
                  onClick={handleRecarregarFeed}
                  disabled={recarregando || loading}
                  className="bg-white border border-black/10 px-5 py-3.5 rounded-full text-sm font-bold text-artDark hover:bg-gray-50 hover:border-artDark transition-all text-center flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                  title="Atualizar postagens do feed"
                >
                  <i className={`fa-solid fa-arrows-rotate text-xs text-artPurple ${recarregando ? "fa-spin" : ""}`}></i>
                  <span>{recarregando ? "Atualizando..." : "Recarregar Feed"}</span>
                </button>

                {isGuest ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAcaoTentada("publicar uma nova obra");
                      setModalConversaoAberto(true);
                    }}
                    className="bg-artOrange text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artDark transition-all shadow-xl shadow-artOrange/20 text-center flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-plus"></i>
                    Nova Obra
                  </button>
                ) : (
                  <Link
                    to="/criar-obra"
                    className="bg-artDark text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 text-center flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-plus"></i>
                    Nova Obra
                  </Link>
                )}

                <Link
                  to="/buscar"
                  className="bg-white border border-black/5 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Buscar Obras
                </Link>
              </div>
            </div>

            {noticeMessage && (
              <div className={`${noticeStyles[noticeType]} border rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold`}>
                <i className="fa-solid fa-circle-info mr-2"></i>
                {noticeMessage}
              </div>
            )}

            {/* Banner do Desafio da Semana Ativo (Art Prompt) */}
            {desafioAtual && (
              <div className="bg-gradient-to-r from-[#241442] via-[#1c1236] to-artDark text-white rounded-3xl p-5 sm:p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-2 border-artPurple/40 shadow-xl relative overflow-hidden group">
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
                      {desafioAtual.data_fim_desafio && (
                        <span className="bg-white/10 text-white border border-white/15 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                          <i className="fa-regular fa-clock mr-1 text-artOrange"></i>
                          Prazo até{" "}
                          {new Date(desafioAtual.data_fim_desafio).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-editorial text-2xl sm:text-3xl italic font-bold">
                      {desafioAtual.nomeCategoria}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed font-light">
                      Participe do desafio oficial da semana! Crie e publique sua interpretação com a categoria <strong className="text-white font-semibold">{desafioAtual.nomeCategoria}</strong> para destaque exclusivo.
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                  {/* Botão Como Funciona (Abre popup sobreposto) */}
                  <button
                    type="button"
                    onClick={() => setModalComoFuncionaAberto(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <i className="fa-regular fa-circle-question text-artOrange text-xs"></i>
                    <span>Como funciona</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesafioFiltroAtivo(!desafioFiltroAtivo)}
                    className={`px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      desafioFiltroAtivo
                        ? "bg-artOrange text-white shadow-md shadow-artOrange/30"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    <i className="fa-solid fa-filter text-xs"></i>
                    <span>{desafioFiltroAtivo ? "Remover Filtro do Desafio" : "Ver Obras do Desafio"}</span>
                  </button>

                  {!isGuest && (
                    <Link
                      to="/criar-obra"
                      className="bg-gradient-to-r from-artPurple via-indigo-600 to-artBlue text-white px-5 py-3 rounded-full text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-artPurple/30 inline-flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                      <span>Participar</span>
                    </Link>
                  )}
                </div>
                <i className="fa-solid fa-trophy absolute -right-6 -bottom-8 text-[8rem] text-white/[0.04] rotate-12 pointer-events-none"></i>
              </div>
            )}

            {/* Banner Motivacional "Espaço Criativo" no topo */}
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
                {isGuest ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAcaoTentada("criar uma publicação");
                      setModalConversaoAberto(true);
                    }}
                    className="w-full md:w-auto bg-artOrange text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-white hover:text-artDark transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                    Criar conta de Artista
                  </button>
                ) : (
                  <Link
                    to="/criar-obra"
                    className="w-full md:w-auto bg-gradient-to-r from-artOrange to-[#e55039] text-white px-6 py-3 rounded-full text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-artOrange/20 inline-flex items-center justify-center gap-2 text-center"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                    Publicar Obra
                  </Link>
                )}
              </div>

              <i className="fa-solid fa-palette absolute -right-6 -bottom-8 text-[8rem] text-white/[0.03] rotate-12 pointer-events-none"></i>
            </div>

            {/* Status Bar do Feed (For You + Tópicos Favoritos) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 flex-wrap">
                {temPreferencias ? (
                  <>
                    {/* 1ª Opção: For You */}
                    <button
                      type="button"
                      onClick={() => setCategoriaFiltroAtiva(null)}
                      className={`text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                        categoriaFiltroAtiva === null
                          ? "bg-gradient-to-r from-artPurple via-indigo-600 to-artBlue text-white shadow-sm scale-105"
                          : "bg-[#F9F8F6] text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <i className="fa-solid fa-sparkles text-amber-300 text-xs"></i>
                      <span>For You</span>
                    </button>

                    {/* Categorias Favoritas ao Lado */}
                    {categoriasPreferidasObjs.map((cat) => {
                      const isAtiva = categoriaFiltroAtiva?.toLowerCase() === (cat.nomeCategoria || "").toLowerCase();
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            if (isAtiva) {
                              setCategoriaFiltroAtiva(null);
                            } else {
                              setCategoriaFiltroAtiva(cat.nomeCategoria);
                            }
                          }}
                          className={`font-bold text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                            isAtiva
                              ? "bg-artPurple text-white border-artPurple shadow-xs scale-105"
                              : "bg-artPurple/10 hover:bg-artPurple/20 text-artPurple border-artPurple/20"
                          }`}
                          title={`Ver as mais recomendadas de ${cat.nomeCategoria}`}
                        >
                          <span>#{cat.nomeCategoria}</span>
                          {isAtiva && <i className="fa-solid fa-xmark text-[9px] ml-0.5"></i>}
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-artOrange to-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                      <i className="fa-solid fa-fire text-white text-xs"></i>
                      Mais Famosos & Em Alta
                    </span>
                    <p className="text-xs text-gray-500 font-medium">
                      Exibindo as obras com maior engajamento e destaque na comunidade.
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                {!isGuest && (
                  <Link
                    to="/configuracoes"
                    className="text-xs font-bold text-artPurple hover:text-artOrange flex items-center gap-1.5 transition-colors"
                  >
                    <i className="fa-solid fa-sliders text-xs"></i>
                    <span>{temPreferencias ? "Editar Interesses" : "Definir meus Tópicos"}</span>
                  </Link>
                )}

                <Link
                  to="/buscar"
                  className="bg-[#F9F8F6] hover:bg-gray-100 text-artDark border border-black/5 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-compass text-xs text-artPurple"></i>
                  <span>Explorar Categorias na Busca</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Grid de Obras do Feed Para Você */}
          <div className="w-full">
            {loading ? (
              <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center shadow-xs">
                <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                  Carregando feed para você...
                </p>
              </div>
            ) : postsParaVoce.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-black/5 p-10 text-center shadow-xs">
                <i className="fa-solid fa-palette text-4xl text-gray-200 mb-4"></i>

                <h2 className="font-editorial text-3xl italic">
                  Nenhuma obra encontrada para os seus tópicos.
                </h2>

                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  Ainda não há novas publicações recentes para as categorias selecionadas. Você pode ajustar seus tópicos de interesse em Configurações ou explorar a aba de busca.
                </p>

                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    to="/configuracoes"
                    className="bg-artPurple text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Ajustar Interesses
                  </Link>
                  <Link
                    to="/buscar"
                    className="bg-gray-100 text-artDark px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
                  >
                    Ir para a Busca
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {postsParaVoce.slice(0, limiteExibicao).map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={currentUser?.id}
                      isGuest={isGuest}
                      onToggleLike={() => handleToggleLike(post.id, post.curtido_por_mim)}
                      onToggleSave={() => handleToggleSave(post.id, post.salvo_por_mim)}
                      onToggleFollow={() => handleToggleFollow(post.usuario?.id, post.seguindo_usuario)}
                      onDenunciar={() => handleAbrirDenuncia(post)}
                      mostrarAviso={mostrarAviso}
                    />
                  ))}
                </div>

                {postsParaVoce.length > limiteExibicao && (
                  <div className="mt-10 flex flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLimiteExibicao((prev) => prev + 20)}
                      className="bg-white hover:bg-gray-50 text-artDark border border-black/10 px-8 py-3.5 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2.5 cursor-pointer group"
                    >
                      <i className="fa-solid fa-arrow-down text-artOrange group-hover:translate-y-0.5 transition-transform"></i>
                      <span>Ver mais publicações (+20)</span>
                      <span className="text-gray-400 font-medium">({postsParaVoce.length - limiteExibicao} restantes)</span>
                    </button>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Exibindo {Math.min(limiteExibicao, postsParaVoce.length)} de {postsParaVoce.length} publicações
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        postagemId={denunciaAtual.idPostagem}
        alvo={denunciaAtual.alvo}
        onSucesso={(msg) => mostrarAviso(msg, "info")}
        onErro={(msg) => mostrarAviso(msg, "error")}
      />

      <ModalConversao
        isOpen={modalConversaoAberto}
        onClose={() => setModalConversaoAberto(false)}
        acao={acaoTentada}
      />

      <ModalComoFuncionaDesafio
        aberto={modalComoFuncionaAberto}
        onFechar={() => setModalComoFuncionaAberto(false)}
        desafioAtual={desafioAtual}
      />
    </div>
  );
}