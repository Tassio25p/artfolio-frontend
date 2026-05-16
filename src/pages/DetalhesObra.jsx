import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";

function DetalhesObra() {
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-xl shadow-black/5 relative">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop"
                alt="Obra Abstração em Tons de Púrpura"
                className="w-full h-[320px] lg:h-[500px] object-cover"
              />

              <div className="absolute top-5 right-5">
                <MenuOpcoes
                  tipo="obra"
                  detalhesLink="/obra/1"
                  onDenunciar={() => setModalDenunciaAberto(true)}
                />
              </div>
            </div>
          </section>

          <section className="lg:col-span-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px]">
                  Pintura Digital
                </span>

                <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  Aprovada
                </span>
              </div>

              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-artDark hover:text-white transition-all"
                title="Salvar obra"
              >
                <i className="fa-regular fa-bookmark"></i>
              </button>
            </div>

            <h1 className="font-editorial text-4xl lg:text-5xl leading-none mb-4">
              Abstração em Tons de{" "}
              <span className="italic text-artPurple">Púrpura.</span>
            </h1>

            <p className="text-gray-500 leading-relaxed font-light text-sm mb-5">
              Uma composição visual inspirada na mistura entre memória,
              movimento e camadas emocionais. A obra explora formas orgânicas,
              cores intensas e texturas digitais.
            </p>

            <div className="bg-white rounded-[1.7rem] p-4 border border-black/5 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-artPurple overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
                    alt="Marina Silva"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    Artista
                  </p>
                  <h3 className="font-bold text-base">Marina Silva</h3>
                </div>

                <Link
                  to="/perfil"
                  className="px-4 py-2.5 rounded-full border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all"
                >
                  Ver Perfil
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white rounded-[1.3rem] p-4 border border-black/5">
                <p className="text-xl font-black">42</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  Curtidas
                </span>
              </div>

              <div className="bg-white rounded-[1.3rem] p-4 border border-black/5">
                <p className="text-xl font-black">8</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  Coment.
                </span>
              </div>

              <div className="bg-white rounded-[1.3rem] p-4 border border-black/5">
                <p className="text-xl font-black">1.2k</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  Views
                </span>
              </div>
            </div>

            <div className="bg-artPurple/5 rounded-[1.7rem] p-5 border border-artPurple/10 mb-5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3">
                Sobre a obra
              </h4>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Tipo</span>
                  <strong className="text-artDark">Original Digital</strong>
                </div>

                <div className="flex justify-between">
                  <span>Ano</span>
                  <strong className="text-artDark">2026</strong>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <strong className="text-artPurple">Disponível</strong>
                </div>

                <div className="flex justify-between">
                  <span>Moderação</span>
                  <strong className="text-artBlue">Aprovada</strong>
                </div>
              </div>
            </div>

            <div className="bg-artOrange/5 rounded-[1.7rem] p-4 border border-artOrange/10 mb-5">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">
                    Segurança da comunidade
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Caso identifique plágio, uso indevido de personagem/marca ou
                    conteúdo impróprio, use os três pontinhos para denunciar a
                    obra.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10">
                <i className="fa-solid fa-heart mr-2"></i>
                Curtir
              </button>

              <Link
                to="/mensagens"
                className="flex-1 bg-white border border-black/5 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-paper-plane mr-2"></i>
                Mensagem
              </Link>
            </div>
          </section>
        </div>

        <section className="max-w-6xl mx-auto mt-8 bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-editorial text-3xl italic">Comentários</h2>

            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              8 comentários
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-artBlue"></div>

              <div className="flex-1 bg-[#F9F8F6] rounded-[1.3rem] p-4">
                <div className="flex justify-between mb-1">
                  <strong className="text-sm">Gabriel Duarte</strong>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-gray-400 uppercase font-bold">
                      Hoje
                    </span>

                    <button
                      type="button"
                      onClick={() => setModalDenunciaAberto(true)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Denunciar comentário"
                    >
                      <i className="fa-solid fa-ellipsis text-xs"></i>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  A composição ficou incrível, principalmente o contraste das
                  texturas.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-artOrange"></div>

              <div className="flex-1 bg-[#F9F8F6] rounded-[1.3rem] p-4">
                <div className="flex justify-between mb-1">
                  <strong className="text-sm">Helena Matos</strong>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-gray-400 uppercase font-bold">
                      Ontem
                    </span>

                    <button
                      type="button"
                      onClick={() => setModalDenunciaAberto(true)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Denunciar comentário"
                    >
                      <i className="fa-solid fa-ellipsis text-xs"></i>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Essa obra transmite muito movimento. Gostei demais do conceito.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <input
              type="text"
              placeholder="Escreva um comentário..."
              className="flex-1 bg-[#F9F8F6] rounded-full px-5 py-3.5 outline-none focus:ring-2 ring-artPurple/20 text-sm"
            />

            <button className="w-11 h-11 rounded-full bg-artDark text-white hover:bg-artPurple transition-all">
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </section>
      </main>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        tipo="obra"
        alvo="Abstração em Tons de Púrpura"
      />
    </div>
  );
}

export default DetalhesObra;