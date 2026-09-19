import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { feedService, obrasService, usuarioService, getMediaUrl } from "../services/api";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import ModalConversao from "../components/ModalConversao";
import { SETORES_ARTISTICOS, TODAS_AS_CATEGORIAS, getEstiloCategoria } from "../constants/categories";

export default function Home() {
  const [setorSelecionado, setSetorSelecionado] = useState("todas");
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser, isGuest } = useAuth();
  const tipoUsuario = currentUser?.tipo_conta || (isGuest ? "visitante" : "artista");

  // Modal de Conversão para Visitante
  const [modalConversaoAberto, setModalConversaoAberto] = useState(false);
  const [acaoTentada, setAcaoTentada] = useState("interagir");

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const carregarFeed = async () => {
    try {
      const feedData = await feedService.obterFeed();
      if (Array.isArray(feedData)) {
        setPosts(feedData);
      }
    } catch (err) {
      console.error("Erro ao carregar o feed:", err);
      mostrarAviso(err.message || "Erro ao carregar o feed de postagens.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFeed();
  }, [currentUser?.id]);

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

  // Setor ativo
  const setorAtivoObj = SETORES_ARTISTICOS.find((s) => s.id === setorSelecionado);

  const postsFiltrados = posts.filter((post) => {
    // 1. Filtro de Subcategoria específica
    if (subcategoriaSelecionada) {
      const subLower = subcategoriaSelecionada.toLowerCase();
      const matchLegenda = (post.legenda || "").toLowerCase().includes(subLower);
      const matchCatDireta = (post.categoria?.nomeCategoria || "").toLowerCase().includes(subLower);
      const matchListaCats = (post.categorias || []).some((c) =>
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

      const nomeCatDireta = (post.categoria?.nomeCategoria || "").toLowerCase();
      const matchSetorDireto =
        nomeCatDireta.includes(setorNomeLower) || subcats.some((sc) => nomeCatDireta.includes(sc));

      const matchSetorNaLista = (post.categorias || []).some((c) => {
        const cNome = (c.nomeCategoria || "").toLowerCase();
        return cNome.includes(setorNomeLower) || subcats.some((sc) => cNome.includes(sc));
      });

      return matchSetorDireto || matchSetorNaLista;
    }

    return true;
  });

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

            {/* Setores Artísticos (Macro-Categorias Vibrantes) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
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
                    const el = document.getElementById("setores-scroll-container");
                    if (el) el.scrollBy({ left: -260, behavior: "smooth" });
                  }}
                  className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-black/10 items-center justify-center text-xs text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 hover:scale-110"
                  title="Rolar para esquerda"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]"></i>
                </button>

                <div
                  id="setores-scroll-container"
                  className="flex gap-2.5 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
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
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 shrink-0 ${
                          isSelected
                            ? `${setor.corBg} border-transparent shadow-md scale-105`
                            : "bg-white text-gray-600 border-black/5 hover:bg-gray-50 shadow-sm"
                        }`}
                      >
                        <i className={`${setor.icone} text-[11px]`}></i>
                        <span>{setor.nome}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Botão de Rolar para a Direita */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("setores-scroll-container");
                    if (el) el.scrollBy({ left: 260, behavior: "smooth" });
                  }}
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-black/10 items-center justify-center text-xs text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 hover:scale-110"
                  title="Rolar para direita"
                >
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
              </div>

              {/* Subcategorias Dinâmicas do Setor Ativo */}
              {setorAtivoObj && setorAtivoObj.subcategorias && setorAtivoObj.subcategorias.length > 0 && (
                <div className="bg-white rounded-2xl p-3 border border-black/5 flex flex-wrap gap-1.5 animate-fadeIn shadow-sm">
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
          </header>

          {/* Grid de Obras (Agora ocupando 100% da largura em até 4 colunas perfeitamente simétricas) */}
          <div className="w-full">
            {loading ? (
              <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center shadow-xs">
                <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                  Carregando feed...
                </p>
              </div>
            ) : postsFiltrados.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-black/5 p-10 text-center shadow-xs">
                <i className="fa-solid fa-palette text-4xl text-gray-200 mb-4"></i>

                <h2 className="font-editorial text-3xl italic">
                  Nenhuma obra encontrada.
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Tente selecionar outra categoria ou volte mais tarde para conferir novas publicações.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {postsFiltrados.map((post) => (
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
    </div>
  );
}