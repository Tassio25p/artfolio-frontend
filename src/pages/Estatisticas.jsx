import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const obrasMaisVistas = [
  {
    id: 1,
    titulo: "Abstração em Tons de Púrpura",
    categoria: "Pintura Digital",
    views: "1.2k",
    curtidas: 42,
    crescimento: "+18%",
    imagem:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    titulo: "Ecos da Metrópole",
    categoria: "3D Art",
    views: "980",
    curtidas: 87,
    crescimento: "+24%",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    titulo: "Fragmentos de Vidro",
    categoria: "Arte Conceitual",
    views: "740",
    curtidas: 64,
    crescimento: "+11%",
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
  },
];

const meses = [
  { mes: "Jan", altura: "h-24" },
  { mes: "Fev", altura: "h-32" },
  { mes: "Mar", altura: "h-20" },
  { mes: "Abr", altura: "h-40" },
  { mes: "Mai", altura: "h-28" },
  { mes: "Jun", altura: "h-48" },
];

export default function Estatisticas() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Desempenho do artista
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Estatísticas<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Acompanhe o crescimento do seu perfil, visualizações das obras,
                curtidas, seguidores e interações do seu portfólio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/perfil"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
              >
                <i className="fa-solid fa-user mr-2"></i>
                Ver Perfil
              </Link>

              <Link
                to="/meu-portfolio"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
              >
                Gerenciar Obras
              </Link>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">2.7k</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Visualizações
              </span>
              <p className="text-xs text-artPurple font-bold mt-2">
                +18% este mês
              </p>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">156</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Curtidas
              </span>
              <p className="text-xs text-artPurple font-bold mt-2">
                +32 novas
              </p>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">1.2k</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Seguidores
              </span>
              <p className="text-xs text-artPurple font-bold mt-2">
                +84 novos
              </p>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">12</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Encomendas
              </span>
              <p className="text-xs text-artPurple font-bold mt-2">
                R$ 3.8k estimado
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="mb-6">
                  <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                    Crescimento
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Visualizações mensais
                  </h2>
                </div>

                <div className="h-56 flex items-end justify-between gap-3">
                  {meses.map((item) => (
                    <div
                      key={item.mes}
                      className="flex flex-col items-center justify-end gap-2 flex-1"
                    >
                      <div
                        className={`${item.altura} w-full rounded-t-2xl bg-artPurple/80 hover:bg-artOrange transition-colors`}
                      ></div>

                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {item.mes}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[2rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Insight
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Obras com legenda completa performam melhor.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Suas publicações com descrição detalhada tiveram mais
                  visualizações e mais tempo de permanência.
                </p>

                <Link
                  to="/criar-obra"
                  className="inline-block mt-5 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all"
                >
                  Nova publicação
                </Link>

                <i className="fa-solid fa-chart-line absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-8">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Obras em destaque
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Melhor desempenho
                    </h2>
                  </div>

                  <button className="bg-[#F9F8F6] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all">
                    Últimos 30 dias
                  </button>
                </div>

                <div className="space-y-4">
                  {obrasMaisVistas.map((obra, index) => (
                    <article
                      key={obra.id}
                      className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-artDark text-white flex items-center justify-center font-black shrink-0">
                        {index + 1}
                      </div>

                      <Link
                        to={`/obra/${obra.id}`}
                        className="w-full md:w-36 h-32 md:h-24 rounded-[1.3rem] overflow-hidden bg-gray-100 shrink-0"
                      >
                        <img
                          src={obra.imagem}
                          alt={obra.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <div className="flex-1">
                        <span className="text-artPurple text-[10px] font-black uppercase tracking-widest">
                          {obra.categoria}
                        </span>

                        <h3 className="font-bold text-lg leading-tight mt-1">
                          {obra.titulo}
                        </h3>

                        <div className="flex flex-wrap items-center gap-5 text-xs text-gray-400 font-bold mt-3">
                          <span>
                            <i className="fa-regular fa-eye mr-1"></i>
                            {obra.views} views
                          </span>

                          <span>
                            <i className="fa-regular fa-heart mr-1"></i>
                            {obra.curtidas} curtidas
                          </span>
                        </div>
                      </div>

                      <div className="bg-artPurple/10 text-artPurple px-4 py-2 rounded-full text-xs font-black">
                        {obra.crescimento}
                      </div>
                    </article>
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