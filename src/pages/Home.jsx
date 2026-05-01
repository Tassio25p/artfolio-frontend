import Sidebar from "../components/Sidebar"
import PostCard from "../components/PostCard"

export default function Home() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen">
        <div className="p-8 lg:p-16 max-w-[1600px] mx-auto">
          <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-xs mb-2 block">
                Curadoria Diária
              </span>

              <h1 className="font-editorial text-6xl italic leading-none">
                O que há de <br />
                <span className="text-artDark not-italic">novo hoje.</span>
              </h1>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
              <button className="bg-artDark text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Tudo
              </button>

              <button className="bg-white border border-black/5 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-artPurple transition-all">
                Têxtil
              </button>

              <button className="bg-white border border-black/5 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-artOrange transition-all">
                Digital
              </button>

              <button className="bg-white border border-black/5 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-artBlue transition-all">
                3D Assets
              </button>
            </div>
          </header>

          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
            <PostCard
              image="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
              user="Marina Silva"
              title="Abstração em Tons de Púrpura"
              tag="Original"
              likes="42"
              comments="8"
              color="artPurple"
            />

            <PostCard
              image="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800"
              user="Gabriel Duarte"
              title="Escultura Têxtil #02"
              description="Uma exploração física sobre o movimento das fibras naturais no espaço urbano."
              likes="31"
              comments="5"
              color="artBlue"
            />
          </div>
        </div>
      </main>
    </div>
  )
}