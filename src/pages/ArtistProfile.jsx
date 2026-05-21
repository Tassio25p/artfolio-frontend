import { useState } from "react";
import { Link } from "react-router-dom";
import PortfolioCard from "../components/PortfolioCard";
import Sidebar from "../components/Sidebar";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";

export default function ArtistProfile() {
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);

  // Futuramente isso virá da sessão:
  // usuarioLogado.id === perfilVisitado.id
  const isOwner = true;

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen">
        <section className="bg-white border-b border-black/5 px-5 lg:px-10 py-7">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-2">
                <div className="relative group w-fit">
                  <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute -bottom-2 -right-2 bg-artOrange text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block">
                    Artista Verificado
                  </span>

                  <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                    Perfil Aprovado
                  </span>
                </div>

                <h1 className="font-editorial text-4xl lg:text-5xl leading-none mb-3">
                  Marina <span className="italic">Silva.</span>
                </h1>

                <p className="max-w-2xl text-gray-500 leading-relaxed text-sm font-light">
                  Explorando a intersecção entre o artesanato têxtil e a
                  modelagem 3D. Baseada em São Paulo, transforma sentimentos em
                  formas tangíveis desde 2018.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-artPurple/10 text-artPurple px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Pintura Digital
                  </span>

                  <span className="bg-artBlue/10 text-artBlue px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Têxtil
                  </span>

                  <span className="bg-artOrange/10 text-artOrange px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    3D Art
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Link
                    to="/seguidores"
                    className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all"
                  >
                    <span className="text-artDark text-xl font-black block">
                      1.2k
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Seguidores
                    </span>
                  </Link>

                  <Link
                    to="/meu-portfolio"
                    className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all"
                  >
                    <span className="text-artDark text-xl font-black block">
                      48
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Obras
                    </span>
                  </Link>

                  <Link
                    to="/planos"
                    className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all"
                  >
                    <span className="text-artDark text-xl font-black block">
                      Pro
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Plano
                    </span>
                  </Link>
                </div>

                {isOwner ? (
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/editar-perfil"
                      className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
                    >
                      <i className="fa-solid fa-pen mr-2"></i>
                      Editar Perfil
                    </Link>

                    <Link
                      to="/meu-portfolio"
                      className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-layer-group mr-2"></i>
                      Gerenciar
                    </Link>

                    <Link
                      to="/criar-obra"
                      className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Nova Obra
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all">
                      <i className="fa-solid fa-user-plus mr-2"></i>
                      Seguir
                    </button>

                    <Link
                      to="/mensagens"
                      className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Mensagem
                    </Link>

                    <MenuOpcoes
                      tipo="perfil"
                      detalhesLink="/perfil"
                      onDenunciar={() => setModalDenunciaAberto(true)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 lg:px-10 py-6 bg-[#F9F8F6]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-5">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h3 className="font-editorial text-2xl italic mb-4">Sobre</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-500">
                    <i className="fa-solid fa-location-dot text-artPurple w-4"></i>
                    São Paulo, SP
                  </div>

                  <div className="flex items-center gap-3 text-gray-500">
                    <i className="fa-solid fa-calendar text-artOrange w-4"></i>
                    Artista desde 2018
                  </div>

                  <div className="flex items-center gap-3 text-gray-500">
                    <i className="fa-solid fa-palette text-artBlue w-4"></i>
                    Arte digital e têxtil
                  </div>

                  <div className="flex items-center gap-3 text-gray-500">
                    <i className="fa-solid fa-envelope text-artDark w-4"></i>
                    contato@marina.art
                  </div>
                </div>
              </div>

              <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Plano Pro
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Perfil com prioridade no feed.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Suas obras aparecem com mais destaque para visitantes e
                  colecionadores.
                </p>

                <Link
                  to="/planos"
                  className="inline-block mt-4 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all"
                >
                  Ver Plano
                </Link>

                <i className="fa-solid fa-crown absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
              </div>

              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h3 className="font-editorial text-2xl italic mb-4">
                  Destaques
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Visualizações</span>
                    <strong>2.7k</strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Curtidas</span>
                    <strong>156</strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Encomendas</span>
                    <strong>12</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h3 className="font-editorial text-2xl italic mb-4">
                  Conexões
                </h3>

                <div className="space-y-3">
                  <Link
                    to="/seguidores"
                    className="flex items-center justify-between bg-[#F9F8F6] rounded-[1.2rem] px-4 py-3 hover:bg-artDark hover:text-white transition-all"
                  >
                    <span className="text-sm font-bold">
                      <i className="fa-solid fa-users mr-2"></i>
                      Seguidores
                    </span>
                    <span className="text-xs font-black">1.2k</span>
                  </Link>

                  <Link
                    to="/seguindo"
                    className="flex items-center justify-between bg-[#F9F8F6] rounded-[1.2rem] px-4 py-3 hover:bg-artDark hover:text-white transition-all"
                  >
                    <span className="text-sm font-bold">
                      <i className="fa-solid fa-user-check mr-2"></i>
                      Seguindo
                    </span>
                    <span className="text-xs font-black">320</span>
                  </Link>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Galeria Pública
                    </span>

                    <h3 className="font-editorial text-3xl italic">
                      Portfólio Profissional
                    </h3>
                  </div>

                  <div className="flex space-x-4 text-[10px] font-bold uppercase tracking-widest">
                    <a href="#" className="text-artDark border-b-2 border-artDark">
                      Todas
                    </a>

                    <a
                      href="#"
                      className="text-gray-400 hover:text-artDark transition-colors"
                    >
                      Digital
                    </a>

                    <a
                      href="#"
                      className="text-gray-400 hover:text-artDark transition-colors"
                    >
                      Físico
                    </a>

                    <a
                      href="#"
                      className="text-gray-400 hover:text-artDark transition-colors"
                    >
                      3D
                    </a>
                  </div>
                </div>

                <div className="bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4 mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">
                    Moderação de obras
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Apenas obras aprovadas pela moderação aparecem no perfil
                    público e no Feed. Obras pendentes ou recusadas ficam
                    visíveis apenas no gerenciamento do portfólio.
                  </p>
                </div>

                <div className="columns-1 md:columns-2 xl:columns-3 gap-5 space-y-5">
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

                  <PortfolioCard
                    image="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
                    category="Arte Original"
                    title="Abstração em Tons de Púrpura"
                    color="text-artPurple"
                  />
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        tipo="perfil"
        alvo="Marina Silva"
      />
    </div>
  );
}