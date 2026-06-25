import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    user: "Marina Silva",
    title: "Abstração em Tons de Púrpura",
    category: "Digital",
    status: "Aprovada",
    tag: "Original",
    likes: "42",
    comments: "8",
    description:
      "Estudo visual com cores intensas, formas abstratas e composição voltada para expressão emocional.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    user: "Gabriel Duarte",
    title: "Escultura Têxtil #02",
    category: "Têxtil",
    status: "Aprovada",
    tag: "Têxtil",
    likes: "31",
    comments: "5",
    description:
      "Uma exploração física sobre o movimento das fibras naturais no espaço urbano.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
    user: "Helena Matos",
    title: "Fragmentos de Vidro",
    category: "Ilustração",
    status: "Aprovada",
    tag: "Digital",
    likes: "64",
    comments: "12",
    description:
      "Ilustração experimental com texturas, transparências e formas fragmentadas.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100",
    user: "Luan Rocha",
    title: "Ecos da Metrópole",
    category: "3D Assets",
    status: "Aprovada",
    tag: "3D Art",
    likes: "87",
    comments: "19",
    description:
      "Estudo visual sobre arquitetura, luz e movimento em grandes centros urbanos.",
  },
];

const artistas = [
  {
    nome: "Marina Silva",
    area: "Pintura Digital",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    obras: 48,
  },
  {
    nome: "Gabriel Duarte",
    area: "Arte Têxtil",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    obras: 32,
  },
  {
    nome: "Helena Matos",
    area: "Ilustração",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
    obras: 64,
  },
];

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

  const tipoUsuario = "artista";
  const isArtista = tipoUsuario === "artista";

  const postsAprovados = posts.filter((post) => post.status === "Aprovada");

  const postsFiltrados = postsAprovados.filter((post) => {
    if (filtroAtual === "Tudo") return true;
    return post.category === filtroAtual;
  });

  const totalCategorias = new Set(postsAprovados.map((post) => post.category))
    .size;

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleAcaoFutura = () => {
    mostrarAviso(
      "Essa interação será integrada futuramente ao backend com o usuário logado."
    );
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
                  Curadoria diária
                </span>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl italic leading-none">
                  O que há de <br />
                  <span className="text-artDark not-italic">novo hoje.</span>
                </h1>

                <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                  Explore obras aprovadas pela moderação, descubra artistas
                  independentes e acompanhe criações em destaque dentro da
                  comunidade Artfolio.
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
              <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
                <i className="fa-solid fa-circle-info mr-2"></i>
                {noticeMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <ResumoCard
                valor={postsAprovados.length}
                label="Obras aprovadas"
                detalhe="Prévia visual"
              />

              <ResumoCard
                valor={artistas.length}
                label="Artistas em destaque"
                detalhe="Comunidade"
              />

              <ResumoCard
                valor={totalCategorias}
                label="Categorias"
                detalhe="Feed filtrável"
              />

              <ResumoCard
                valor="OK"
                label="Moderação"
                detalhe="Apenas aprovadas"
              />
            </div>

            <div className="bg-artBlue/5 border border-artBlue/10 rounded-[1.7rem] p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-2xl bg-artBlue/10 text-artBlue flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest">
                    Feed público moderado
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                    No sistema real, o feed exibirá apenas obras aprovadas pela
                    moderação. Obras pendentes ou recusadas ficam fora da área
                    pública.
                  </p>
                </div>
              </div>

              <Link
                to="/meu-portfolio"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                Ver portfólio
              </Link>
            </div>

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
              {postsFiltrados.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-black/5 p-10 text-center">
                  <i className="fa-solid fa-palette text-4xl text-gray-200 mb-4"></i>

                  <h2 className="font-editorial text-3xl italic">
                    Nenhuma obra encontrada.
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    Tente selecionar outra categoria do feed.
                  </p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                  {postsFiltrados.map((post) => (
                    <FeedCard
                      key={post.id}
                      post={post}
                      onAction={handleAcaoFutura}
                    />
                  ))}
                </div>
              )}
            </section>

            <aside className="xl:col-span-3 space-y-5">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-editorial text-2xl italic">
                    Artistas em alta
                  </h2>

                  <i className="fa-solid fa-sparkles text-artOrange"></i>
                </div>

                <div className="space-y-4">
                  {artistas.map((artista) => (
                    <div
                      key={artista.nome}
                      className="flex items-center gap-3 bg-[#F9F8F6] rounded-[1.3rem] p-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-artPurple overflow-hidden shrink-0">
                        <img
                          src={artista.avatar}
                          alt={artista.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold truncate">
                          {artista.nome}
                        </h3>

                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 truncate">
                          {artista.area}
                        </p>

                        <p className="text-[10px] text-gray-400 mt-1">
                          {artista.obras} obras aprovadas
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAcaoFutura}
                        className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-artDark hover:text-white transition-all shrink-0"
                      >
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[2rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica do dia
                </span>

                <h2 className="font-editorial text-2xl italic leading-tight">
                  Publique com contexto.
                </h2>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Obras com descrição, processo criativo e categoria clara
                  ajudam a moderação e deixam o portfólio mais profissional.
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

              <div className="bg-white rounded-[2rem] border border-black/5 p-5">
                <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Plano atual
                </span>

                <h2 className="font-editorial text-2xl italic leading-tight">
                  Free
                </h2>

                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Os planos Premium e Pro liberam recursos como estatísticas,
                  destaques e ferramentas comerciais para artistas.
                </p>

                <Link
                  to="/planos"
                  className="inline-block mt-5 bg-[#F9F8F6] px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
                >
                  Ver planos
                </Link>
              </div>

              <div className="bg-artPurple/5 border border-artPurple/10 rounded-[2rem] p-5">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Integração futura
                </span>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Curtidas, comentários, salvos, recomendações e artistas
                  seguidos serão controlados pelo backend com o usuário
                  autenticado.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function ResumoCard({ valor, label, detalhe }) {
  return (
    <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
      <p className="text-2xl font-black">{valor}</p>

      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
        {label}
      </span>

      <p className="text-[10px] text-gray-400 mt-2">{detalhe}</p>
    </div>
  );
}

function FeedCard({ post, onAction }) {
  return (
    <article className="break-inside-avoid bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group mb-6">
      <Link to={`/obra/${post.id}`} className="block overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-artPurple/10 text-artPurple px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
            {post.category}
          </span>

          <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
            {post.status}
          </span>

          {post.tag && (
            <span className="bg-artOrange/10 text-artOrange px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
              {post.tag}
            </span>
          )}
        </div>

        <h2 className="font-editorial text-2xl italic leading-none">
          {post.title}
        </h2>

        {post.description && (
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            {post.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-5">
          <div className="w-9 h-9 rounded-full bg-artPurple overflow-hidden shrink-0">
            <img
              src={post.avatar}
              alt={post.user}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{post.user}</p>

            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
              Artista
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/5">
          <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
            <span>
              <i className="fa-regular fa-heart mr-1"></i>
              {post.likes}
            </span>

            <span>
              <i className="fa-regular fa-comment mr-1"></i>
              {post.comments}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAction}
              className="w-9 h-9 rounded-full bg-[#F9F8F6] text-gray-400 hover:bg-artOrange/10 hover:text-artOrange transition-all"
            >
              <i className="fa-regular fa-heart"></i>
            </button>

            <button
              type="button"
              onClick={onAction}
              className="w-9 h-9 rounded-full bg-[#F9F8F6] text-gray-400 hover:bg-artBlue/10 hover:text-artBlue transition-all"
            >
              <i className="fa-regular fa-bookmark"></i>
            </button>

            <Link
              to={`/obra/${post.id}`}
              className="w-9 h-9 rounded-full bg-artDark text-white hover:bg-artPurple transition-all flex items-center justify-center"
            >
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}