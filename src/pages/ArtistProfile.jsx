import PortfolioCard from "../components/PortfolioCard"
import Sidebar from "../components/Sidebar"

export default function ArtistProfile() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen">
        <section className="bg-white border-b border-black/5 pt-10 pb-8 px-6 lg:px-14">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
              <div className="relative group">
                <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-3 -right-3 bg-artOrange text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
              </div>

              <div className="flex-1">
                <span className="text-artPurple font-bold tracking-widest uppercase text-xs mb-2 block">
                  Artista Verificado
                </span>

                <h1 className="font-editorial text-5xl lg:text-6xl leading-none mb-4">
                  Marina <span className="italic">Silva.</span>
                </h1>

                <p className="max-w-2xl text-gray-500 leading-relaxed text-sm lg:text-base font-light">
                  Explorando a intersecção entre o artesanato têxtil e a modelagem 3D.
                  Baseada em São Paulo, transformando sentimentos em formas tangíveis desde 2018.
                </p>

                <div className="flex gap-6 mt-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <div className="flex flex-col">
                    <span className="text-artDark text-xl font-black">1.2k</span>
                    Seguidores
                  </div>

                  <div className="flex flex-col">
                    <span className="text-artDark text-xl font-black">48</span>
                    Obras
                  </div>

                  <div className="flex flex-col">
                    <span className="text-artDark text-xl font-black">Pro</span>
                    Plano
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-artDark text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-artPurple transition-all">
                  Seguir
                </button>

                <button className="border border-black px-6 py-3 rounded-full text-sm font-bold hover:bg-black hover:text-white transition-all">
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Mensagem
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 lg:p-14 bg-[#F9F8F6]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
              <h3 className="font-editorial text-3xl italic">
                Portfolio Profissional
              </h3>

              <div className="flex space-x-4 text-xs font-bold uppercase tracking-widest">
                <a href="#" className="text-artDark border-b-2 border-artDark">
                  Todas
                </a>

                <a href="#" className="text-gray-400 hover:text-artDark transition-colors">
                  Digital
                </a>

                <a href="#" className="text-gray-400 hover:text-artDark transition-colors">
                  Físico
                </a>
              </div>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              <PortfolioCard
                image="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800"
                category="Pintura Digital"
                title="Fragmentos de Vidro"
                color="text-artOrange"
              />

              <PortfolioCard
                image="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800"
                category="Têxtil"
                title="Conexões de Algodão"
                color="text-artBlue"
              />

              <PortfolioCard
                image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
                category="3D Model"
                title="Ecos da Metrópole"
                color="text-artPurple"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}