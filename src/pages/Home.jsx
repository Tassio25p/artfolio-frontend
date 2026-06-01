import Sidebar from "../components/Sidebar"
import PostCard from "../components/PostCard"
import { Link } from "react-router-dom"

const posts = [
  {
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    user: "Marina Silva",
    title: "Abstração em Tons de Púrpura",
    tag: "Original",
    likes: "42",
    comments: "8",
    color: "artPurple",
  },
  {
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800",
    user: "Gabriel Duarte",
    title: "Escultura Têxtil #02",
    description:
      "Uma exploração física sobre o movimento das fibras naturais no espaço urbano.",
    likes: "31",
    comments: "5",
    color: "artBlue",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
    user: "Helena Matos",
    title: "Fragmentos de Vidro",
    tag: "Digital",
    likes: "64",
    comments: "12",
    color: "artOrange",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    user: "Luan Rocha",
    title: "Ecos da Metrópole",
    description:
      "Estudo visual sobre arquitetura, luz e movimento em grandes centros urbanos.",
    likes: "87",
    comments: "19",
    color: "artPurple",
  },
]

const artistas = [
  {
    nome: "Marina Silva",
    area: "Pintura Digital",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
  },
  {
    nome: "Gabriel Duarte",
    area: "Arte Têxtil",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
  },
  {
    nome: "Helena Matos",
    area: "Ilustração",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
  },
]

export default function Home() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen">
        <div className="p-5 lg:p-10 max-w-[1500px] mx-auto">
          <header className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
              <div>
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                  Curadoria diária
                </span>

                <h1 className="font-editorial text-5xl lg:text-6xl italic leading-none">
                  O que há de <br />
                  <span className="text-artDark not-italic">novo hoje.</span>
                </h1>

                <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                  Explore obras recentes, descubra artistas independentes e
                  acompanhe criações em destaque dentro da comunidade Artfolio.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/criar-obra"
                  className="bg-artDark text-white px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  Nova Obra
                </Link>

                <Link
                  to="/perfil"
                  className="bg-white border border-black/5 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all"
                >
                  Meu Perfil
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <p className="text-2xl font-black">8.5k</p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Obras publicadas
                </span>
              </div>

              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <p className="text-2xl font-black">1.2k</p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Artistas ativos
                </span>
              </div>

              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <p className="text-2xl font-black">156</p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Destaques da semana
                </span>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              <button className="bg-artDark text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Tudo
              </button>

              <button className="bg-white border border-black/5 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark hover:border-artPurple transition-all">
                Têxtil
              </button>

              <button className="bg-white border border-black/5 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark hover:border-artOrange transition-all">
                Digital
              </button>

              <button className="bg-white border border-black/5 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark hover:border-artBlue transition-all">
                3D Assets
              </button>

              <button className="bg-white border border-black/5 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-artDark hover:border-artPurple transition-all">
                Ilustração
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-9">
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.title}
                    image={post.image}
                    avatar={post.avatar}
                    user={post.user}
                    title={post.title}
                    tag={post.tag}
                    description={post.description}
                    likes={post.likes}
                    comments={post.comments}
                    color={post.color}
                  />
                ))}
              </div>
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

                      <div className="flex-1">
                        <h3 className="text-sm font-bold">{artista.nome}</h3>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                          {artista.area}
                        </p>
                      </div>

                      <button className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-artDark hover:text-white transition-all">
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
                  Obras com descrições, processo criativo e categoria clara
                  tendem a receber mais interação no feed.
                </p>

                <Link
                  to="/criar-obra"
                  className="inline-block mt-5 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all"
                >
                  Criar publicação
                </Link>

                <i className="fa-solid fa-lightbulb absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-5">
                <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Plano atual
                </span>

                <h2 className="font-editorial text-2xl italic leading-tight">
                  Entusiasta
                </h2>

                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Faça upgrade para destacar suas obras no feed e acessar
                  estatísticas de visualização.
                </p>

                <Link
                  to="/planos"
                  className="inline-block mt-5 bg-[#F9F8F6] px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
                >
                  Ver planos
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}