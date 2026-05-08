import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const resultados = [
  {
    id: 1,
    tipo: "Obra",
    titulo: "Abstração em Tons de Púrpura",
    subtitulo: "Marina Silva",
    categoria: "Pintura Digital",
    imagem:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
    rota: "/obra/1",
  },
  {
    id: 2,
    tipo: "Artista",
    titulo: "Helena Matos",
    subtitulo: "Ilustração Digital",
    categoria: "Artista Pro",
    imagem:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rota: "/perfil",
  },
  {
    id: 3,
    tipo: "Obra",
    titulo: "Conexões de Algodão",
    subtitulo: "Gabriel Duarte",
    categoria: "Têxtil",
    imagem:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
    rota: "/obra/2",
  },
  {
    id: 4,
    tipo: "Obra",
    titulo: "Ecos da Metrópole",
    subtitulo: "Luan Rocha",
    categoria: "3D Art",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    rota: "/obra/3",
  },
];

const categorias = [
  "Tudo",
  "Pintura Digital",
  "Têxtil",
  "3D Art",
  "Ilustração",
  "Artesanato",
  "Galerias",
];

export default function Buscar() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
              Explorar Artfolio
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
              Buscar<span className="italic text-artOrange">.</span>
            </h1>

            <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
              Pesquise obras, artistas, estilos e categorias dentro da
              comunidade Artfolio.
            </p>
          </header>

          <section className="bg-white rounded-[2.2rem] border border-black/5 p-5 lg:p-6 mb-8">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>

              <input
                type="text"
                placeholder="Buscar por obra, artista, categoria ou estilo..."
                className="w-full bg-[#F9F8F6] rounded-full pl-14 pr-6 py-5 outline-none focus:ring-2 ring-artPurple/20 text-sm"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar mt-5 pb-1">
              {categorias.map((categoria, index) => (
                <button
                  key={categoria}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    index === 0
                      ? "bg-artDark text-white"
                      : "bg-[#F9F8F6] text-gray-400 hover:text-artDark hover:bg-white border border-black/5"
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Filtros
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Tipo
                    </label>

                    <select className="w-full bg-[#F9F8F6] rounded-2xl px-4 py-3 outline-none text-sm">
                      <option>Todos</option>
                      <option>Obras</option>
                      <option>Artistas</option>
                      <option>Galerias</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Ordenar por
                    </label>

                    <select className="w-full bg-[#F9F8F6] rounded-2xl px-4 py-3 outline-none text-sm">
                      <option>Mais recentes</option>
                      <option>Mais curtidas</option>
                      <option>Mais vistas</option>
                      <option>Artistas populares</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Busca inteligente
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Encontre inspirações mais rápido.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Use categorias, nomes de artistas e estilos para refinar sua
                  pesquisa dentro da plataforma.
                </p>

                <i className="fa-solid fa-magnifying-glass absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Resultados
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Encontrados para você
                    </h2>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {resultados.length} resultados
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resultados.map((item) => (
                    <Link
                      key={item.id}
                      to={item.rota}
                      className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-[1.3rem] overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={item.imagem}
                            alt={item.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-artPurple/10 text-artPurple px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                              {item.tipo}
                            </span>

                            <span className="bg-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-400 border border-black/5">
                              {item.categoria}
                            </span>
                          </div>

                          <h3 className="font-bold text-lg leading-tight group-hover:text-artPurple transition-colors">
                            {item.titulo}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {item.subtitulo}
                          </p>

                          <span className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-artDark">
                            Ver detalhes
                            <i className="fa-solid fa-arrow-right ml-2"></i>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}