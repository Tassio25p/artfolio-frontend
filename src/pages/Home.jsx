import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { feedService, obrasService, usuarioService, getUser, getToken } from "../services/api";

const filtros = [
  { id: "Tudo", label: "Tudo" },
  { id: "Têxtil", label: "Têxtil" },
  { id: "Digital", label: "Digital" },
  { id: "3D Assets", label: "3D Assets" },
  { id: "Ilustração", label: "Ilustração" },
];

export default function Home() {
  const [filtroAtual, setFiltroAtual] = useState("Tudo");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getUser();
  const tipoUsuario = currentUser?.tipo_conta || "cliente";
  const isArtista = tipoUsuario === "artista";

  const carregarFeed = async () => {
    try {
      if (!getToken()) {
        setLoading(false);
        return;
      }
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
  }, []);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleToggleLike = async (postId, estaCurtido) => {
    try {
      if (estaCurtido) {
        await obrasService.descurtir(postId);
      } else {
        await obrasService.curtir(postId);
      }
      // Atualizar localmente
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

  const handleToggleFollow = async (usuarioId, estaSeguindo) => {
    try {
      if (estaSeguindo) {
        await usuarioService.deixarDeSeguir(usuarioId);
      } else {
        await usuarioService.seguir(usuarioId);
      }
      // Atualizar localmente todas as postagens daquele autor no feed
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

  const postsFiltrados = posts.filter((post) => {
    if (filtroAtual === "Tudo") return true;
    const nomeCat = post.categoria?.nomeCategoria || "";
    return nomeCat.toLowerCase().includes(filtroAtual.toLowerCase());
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
          <header className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
              <div>
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                  Feed Social
                </span>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl italic leading-none">
                  O que há de <br />
                  <span className="text-artDark not-italic">novo hoje.</span>
                </h1>

                <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                  Explore obras da comunidade, descubra novos artistas, interaja
                  com curtidas e comentários em tempo real.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {isArtista ? (
                  <Link
                    to="/criar-obra"
                    className="bg-artDark text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Nova Obra
                  </Link>
                ) : (
                  <Link
                    to="/buscar"
                    className="bg-artDark text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
                  >
                    <i className="fa-solid fa-magnifying-glass mr-2"></i>
                    Buscar Obras
                  </Link>
                )}

                <Link
                  to="/perfil"
                  className="bg-white border border-black/5 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
                >
                  Meu Perfil
                </Link>
              </div>
            </div>

            {noticeMessage && (
              <div className={`${noticeStyles[noticeType]} border rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold`}>
                <i className="fa-solid fa-circle-info mr-2"></i>
                {noticeMessage}
              </div>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {filtros.map((filtro) => (
                <button
                  key={filtro.id}
                  type="button"
                  onClick={() => setFiltroAtual(filtro.id)}
                  className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    filtroAtual === filtro.id
                      ? "bg-artDark text-white shadow-md shadow-black/10"
                      : "bg-white border border-black/5 text-gray-400 hover:text-artDark hover:border-artPurple"
                  }`}
                >
                  {filtro.label}
                </button>
              ))}
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
                    Seja o primeiro a publicar ou tente selecionar outra categoria.
                  </p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                  {postsFiltrados.map((post) => (
                    <FeedCard
                      key={post.id}
                      post={post}
                      currentUserId={currentUser?.id}
                      onToggleLike={() => handleToggleLike(post.id, post.curtido_por_mim)}
                      onToggleFollow={() => handleToggleFollow(post.usuario?.id, post.seguindo_usuario)}
                    />
                  ))}
                </div>
              )}
            </section>

            <aside className="xl:col-span-3 space-y-5">
              <div className="bg-artDark text-white rounded-[2rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica do dia
                </span>

                <h2 className="font-editorial text-2xl italic leading-tight">
                  Publique com contexto.
                </h2>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Obras com legenda clara e boa visualização recebem mais
                  interações e curtidas na comunidade.
                </p>

                {isArtista ? (
                  <Link
                    to="/criar-obra"
                    className="inline-block mt-5 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all"
                  >
                    Criar publicação
                  </Link>
                ) : (
                  <Link
                    to="/buscar"
                    className="inline-block mt-5 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all"
                  >
                    Explorar obras
                  </Link>
                )}

                <i className="fa-solid fa-lightbulb absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeedCard({ post, currentUserId, onToggleLike, onToggleFollow }) {
  const isMe = currentUserId === post.usuario?.id;

  return (
    <article className="break-inside-avoid bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group mb-6">
      <Link to={`/obra/${post.id}`} className="block overflow-hidden">
        <img
          src={post.arquivoUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"}
          alt={post.legenda || "Obra"}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {post.categoria?.nomeCategoria && (
            <span className="bg-artPurple/10 text-artPurple px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
              {post.categoria.nomeCategoria}
            </span>
          )}

          <span className="text-[10px] text-gray-400 font-bold">
            {post.dataPostagem ? new Date(post.dataPostagem).toLocaleDateString() : ""}
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
            <div className="w-9 h-9 rounded-full bg-artPurple overflow-hidden shrink-0">
              {post.usuario?.fotoPerfil ? (
                <img
                  src={post.usuario.fotoPerfil}
                  alt={post.usuario.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-artPurple flex items-center justify-center text-white text-xs font-bold">
                  {post.usuario?.nome?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{post.usuario?.nome || "Artista"}</p>
              <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                {post.usuario?.tipo_conta || "artista"} • {post.seguidores} seguidores
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

        {/* Bar de Interação */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={onToggleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                post.curtido_por_mim ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              <i className={post.curtido_por_mim ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
              <span>{post.likes}</span>
            </button>

            <Link
              to={`/obra/${post.id}`}
              className="flex items-center gap-1.5 text-gray-400 hover:text-artBlue transition-colors"
            >
              <i className="fa-regular fa-comment"></i>
              <span>{post.comentarios}</span>
            </Link>
          </div>

          <Link
            to={`/obra/${post.id}`}
            className="w-8 h-8 rounded-full bg-artDark text-white hover:bg-artPurple transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}