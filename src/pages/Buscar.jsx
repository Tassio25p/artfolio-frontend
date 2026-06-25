import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const resultados = [
  {
    id: 1,
    tipo: "Obra",
    titulo: "Abstração em Tons de Púrpura",
    subtitulo: "Marina Silva",
    categoria: "Pintura Digital",
    descricao: "Obra digital abstrata com cores intensas e texturas visuais.",
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
    descricao: "Artista focada em ilustrações editoriais e artes conceituais.",
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
    descricao: "Arte têxtil com composição manual e estilo autoral.",
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
    descricao: "Cena 3D inspirada em arquitetura urbana e luzes neon.",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    rota: "/obra/3",
  },
  {
    id: 5,
    tipo: "Artista",
    titulo: "Caio Mendes",
    subtitulo: "Modelagem 3D",
    categoria: "Artista Free",
    descricao: "Criador de objetos 3D, cenários digitais e artes para produtos.",
    imagem:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    rota: "/perfil",
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

const tipos = ["Todos", "Obra", "Artista", "Galeria"];

export default function Buscar() {
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaAtual, setCategoriaAtual] = useState("Tudo");
  const [tipoAtual, setTipoAtual] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("Mais recentes");

  const resultadosFiltrados = resultados.filter((item) => {
    const termo = termoBusca.toLowerCase();

    const correspondeBusca =
      item.titulo.toLowerCase().includes(termo) ||
      item.subtitulo.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo);

    const correspondeCategoria =
      categoriaAtual === "Tudo" || item.categoria === categoriaAtual;

    const correspondeTipo =
      tipoAtual === "Todos" || item.tipo === tipoAtual;

    return correspondeBusca && correspondeCategoria && correspondeTipo;
  });

  const obrasEncontradas = resultadosFiltrados.filter(
    (item) => item.tipo === "Obra"
  );

  const artistasEncontrados = resultadosFiltrados.filter(
    (item) => item.tipo === "Artista"
  );

  const semResultados = resultadosFiltrados.length === 0;

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Explorar Artfolio
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Buscar<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Pesquise obras, artistas, estilos e categorias dentro da
                comunidade Artfolio.
              </p>
            </div>

            <div className="bg-white border border-black/5 rounded-[1.4rem] px-5 py-4">
              <p className="text-2xl font-black">{resultadosFiltrados.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Resultados visuais
              </span>
            </div>
          </header>

          <section className="bg-white rounded-[2.2rem] border border-black/5 p-4 sm:p-5 lg:p-6 mb-8">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>

              <input
                type="text"
                value={termoBusca}
                onChange={(event) => setTermoBusca(event.target.value)}
                placeholder="Buscar por obra, artista, categoria ou estilo..."
                className="w-full bg-[#F9F8F6] rounded-full pl-14 pr-6 py-5 outline-none focus:ring-2 ring-artPurple/20 text-sm"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar mt-5 pb-1">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaAtual(categoria)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    categoriaAtual === categoria
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

                    <select
                      value={tipoAtual}
                      onChange={(event) => setTipoAtual(event.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-4 py-3 outline-none text-sm"
                    >
                      {tipos.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Ordenar por
                    </label>

                    <select
                      value={ordenacao}
                      onChange={(event) => setOrdenacao(event.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-4 py-3 outline-none text-sm"
                    >
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

              <div className="bg-artBlue/5 border border-artBlue/10 rounded-[1.7rem] p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">
                  Busca real futuramente
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  A busca definitiva será feita pelo backend com FastAPI e
                  PostgreSQL. Por enquanto, estes resultados servem como
                  representação visual da interface.
                </p>
              </div>
            </aside>

            <section className="lg:col-span-9 space-y-5">
              <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
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
                    {resultadosFiltrados.length} resultados
                  </span>
                </div>

                {semResultados ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 sm:p-12 text-center">
                    <i className="fa-solid fa-magnifying-glass text-4xl text-gray-200 mb-4"></i>

                    <h3 className="font-editorial text-3xl italic">
                      Nada encontrado.
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Tente buscar por outro nome, categoria ou estilo artístico.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {obrasEncontradas.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <h3 className="font-editorial text-2xl italic">
                            Obras
                          </h3>

                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {obrasEncontradas.length} encontradas
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {obrasEncontradas.map((item) => (
                            <ResultadoCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    )}

                    {artistasEncontrados.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <h3 className="font-editorial text-2xl italic">
                            Artistas
                          </h3>

                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {artistasEncontrados.length} encontrados
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {artistasEncontrados.map((item) => (
                            <ResultadoCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-artOrange/5 border border-artOrange/10 rounded-[1.7rem] p-5">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-circle-info"></i>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-2">
                      Observação para integração
                    </h3>

                    <p className="text-sm text-gray-500 leading-relaxed">
                      Quando o backend estiver pronto, esta tela poderá buscar
                      obras aprovadas, artistas ativos, categorias e portfólios
                      diretamente no PostgreSQL. Obras pendentes ou recusadas não
                      devem aparecer nos resultados públicos.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}

function ResultadoCard({ item }) {
  return (
    <Link
      to={item.rota}
      className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className={`${
            item.tipo === "Artista" ? "rounded-full" : "rounded-[1.3rem]"
          } w-24 h-24 overflow-hidden bg-gray-100 shrink-0`}
        >
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

          <p className="text-sm text-gray-500 mt-1">{item.subtitulo}</p>

          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            {item.descricao}
          </p>

          <span className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-artDark">
            {item.tipo === "Artista" ? "Ver perfil" : "Ver detalhes"}
            <i className="fa-solid fa-arrow-right ml-2"></i>
          </span>
        </div>
      </div>
    </Link>
  );
}