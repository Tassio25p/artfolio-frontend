import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
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

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

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
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen">
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
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                  Galeria & Feed
                </span>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl italic leading-none">
                  O que há de <br />
                  <span className="text-artDark not-italic">novo hoje.</span>
                </h1>

                <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed font-light">
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

              <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
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
                      className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${
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

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-9">
              {loading ? (
                <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center">
                  <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                    Carregando feed...
                  </p>
                </div>
              ) : postsFiltrados.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-black/5 p-10 text-center">
                  <i className="fa-solid fa-palette text-4xl text-gray-200 mb-4"></i>

                  <h2 className="font-editorial text-3xl italic">
                    Nenhuma obra encontrada.
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    Tente selecionar outra categoria ou volte mais tarde para conferir novas publicações.
                  </p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                  {postsFiltrados.map((post) => (
                    <FeedCard
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
            </section>

            <aside className="xl:col-span-3 space-y-5">
              <div className="bg-artDark text-white rounded-[2rem] p-6 relative overflow-hidden shadow-sm">
                <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica da Comunidade
                </span>

                <h2 className="font-editorial text-2xl italic leading-tight">
                  Publique com detalhes.
                </h2>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed font-light">
                  Obras com legendas contextualizadas, técnicas utilizadas e boa iluminação recebem até 3x mais engajamento de apreciadores.
                </p>

                {isGuest ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAcaoTentada("criar uma publicação");
                      setModalConversaoAberto(true);
                    }}
                    className="inline-block mt-5 bg-artOrange text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-white hover:text-artDark transition-all"
                  >
                    Criar conta de Artista
                  </button>
                ) : (
                  <Link
                    to="/criar-obra"
                    className="inline-block mt-5 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange hover:text-white transition-all"
                  >
                    Criar publicação
                  </Link>
                )}

                <i className="fa-solid fa-palette absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>
          </div>
        </div>
      </main>

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

function FeedCard({ post, currentUserId, isGuest, onToggleLike, onToggleSave, onToggleFollow, onDenunciar, mostrarAviso }) {
  const isMe = !isGuest && currentUserId === post.usuario?.id;
  const cats = (post.categorias && post.categorias.length > 0) ? post.categorias : (post.categoria ? [post.categoria] : []);

  return (
    <article className="break-inside-avoid bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group mb-6 relative">
      <div className="relative overflow-hidden">
        <Link to={`/obra/${post.id}`} className="block">
          <img
            src={getMediaUrl(post.arquivoUrl) || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"}
            alt={post.legenda || "Obra"}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800";
            }}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="absolute top-3 right-3 z-10">
          <MenuOpcoes
            tipo="obra"
            detalhesLink={`/obra/${post.id}`}
            isSalvo={post.salvo_por_mim}
            onSalvar={onToggleSave}
            onDenunciar={onDenunciar}
            onCopiarLinkSuccess={(msg) => mostrarAviso(msg, "info")}
          />
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c, i) => {
              const catNome = c?.nomeCategoria || c?.nome || (typeof c === "string" ? c : "Arte");
              const estilo = getEstiloCategoria(catNome) || { corTag: "bg-artPurple/10 text-artPurple" };
              return (
                <span
                  key={c?.id || i}
                  className={`${estilo.corTag || "bg-artPurple/10 text-artPurple"} px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border`}
                >
                  {catNome}
                </span>
              );
            })}
          </div>

          <span className="text-[10px] text-gray-400 font-bold">
            {post.dataPostagem ? new Date(post.dataPostagem).toLocaleDateString("pt-BR") : ""}
          </span>
        </div>

        {post.legenda && (
          <h2 className="font-editorial text-xl italic leading-snug mb-3">
            {post.legenda}
          </h2>
        )}

        {/* Autor */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-black/5">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={isMe ? "/perfil" : `/artista/${post.usuario?.id}`}
              className="w-9 h-9 rounded-full bg-artPurple overflow-hidden shrink-0 block hover:opacity-85 transition-opacity"
              title={`Ver perfil de ${post.usuario?.nome || "Artista"}`}
            >
              {post.usuario?.fotoPerfil ? (
                <img
                  src={getMediaUrl(post.usuario.fotoPerfil)}
                  alt={post.usuario.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-artPurple flex items-center justify-center text-white text-xs font-bold">
                  {post.usuario?.nome?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </Link>

            <div className="min-w-0">
              <Link
                to={isMe ? "/perfil" : `/artista/${post.usuario?.id}`}
                className="text-sm font-bold truncate block hover:text-artPurple transition-colors"
              >
                {post.usuario?.nome || "Artista"}
              </Link>
              <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                Artista • {post.seguidores || 0} seguidores
              </p>
            </div>
          </div>

          {!isMe && post.usuario?.id && (
            <button
              type="button"
              onClick={onToggleFollow}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                post.seguindo_usuario
                  ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                  : "bg-artDark text-white hover:bg-artPurple"
              }`}
            >
              {post.seguindo_usuario ? "Seguindo" : "+ Seguir"}
            </button>
          )}
        </div>

        {/* Barra de Interação */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={onToggleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                post.curtido_por_mim ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
              title={post.curtido_por_mim ? "Remover curtida" : "Curtir obra"}
            >
              <i className={post.curtido_por_mim ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
              <span>{post.likes || 0}</span>
            </button>

            {/* Botão de Favorito destacado em Amarelo quando salvo */}
            <button
              type="button"
              onClick={onToggleSave}
              className={`flex items-center gap-1.5 transition-all ${
                post.salvo_por_mim
                  ? "text-amber-500 scale-110"
                  : "text-gray-400 hover:text-amber-500"
              }`}
              title={post.salvo_por_mim ? "Remover dos favoritos" : "Salvar obra nos favoritos"}
            >
              <i className={post.salvo_por_mim ? "fa-solid fa-bookmark text-amber-500" : "fa-regular fa-bookmark"}></i>
            </button>

            <Link
              to={`/obra/${post.id}`}
              className="flex items-center gap-1.5 text-gray-400 hover:text-artBlue transition-colors"
              title="Comentários"
            >
              <i className="fa-regular fa-comment"></i>
              <span>{post.comentarios || 0}</span>
            </Link>
          </div>

          <Link
            to={`/obra/${post.id}`}
            className="w-8 h-8 rounded-full bg-artDark text-white hover:bg-artPurple transition-all flex items-center justify-center"
            title="Ver detalhes da obra"
          >
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}