import React from "react";
import Sidebar from "../components/Sidebar";

const preferencias = [
  {
    titulo: "Notificações por e-mail",
    descricao: "Receber avisos sobre mensagens, curtidas e comentários.",
    ativo: true,
  },
  {
    titulo: "Perfil público",
    descricao: "Permitir que visitantes encontrem seu portfólio no feed.",
    ativo: true,
  },
  {
    titulo: "Mostrar estatísticas",
    descricao: "Exibir visualizações e curtidas no seu perfil público.",
    ativo: false,
  },
];

export default function Configuracoes() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Preferências da conta
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Configurações
                <span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl">
                Ajuste sua conta, segurança, privacidade e preferências de uso
                dentro do Artfolio.
              </p>
            </div>

            <button className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10">
              <i className="fa-solid fa-floppy-disk mr-2"></i>
              Salvar Alterações
            </button>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Menu
                </h2>

                <div className="space-y-2">
                  <button className="w-full bg-artDark text-white px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left">
                    Conta
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Segurança
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Privacidade
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Notificações
                  </button>

                  <button className="w-full bg-[#F9F8F6] text-gray-400 hover:text-artDark px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-colors">
                    Assinatura
                  </button>
                </div>
              </div>

              <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Conta Pro
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Seu plano está ativo.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Você possui prioridade no feed, estatísticas de perfil e obras
                  ilimitadas.
                </p>

                <button className="mt-4 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all">
                  Gerenciar Plano
                </button>

                <i className="fa-solid fa-crown absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            <section className="lg:col-span-9 space-y-5">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Dados principais
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Informações da conta
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-artPurple overflow-hidden border-2 border-white shadow-lg shadow-black/10">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
                      alt="Perfil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Nome completo
                    </label>

                    <input
                      type="text"
                      defaultValue="Marina Silva"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      E-mail
                    </label>

                    <input
                      type="email"
                      defaultValue="marina@email.com"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Telefone
                    </label>

                    <input
                      type="text"
                      defaultValue="(11) 99999-0000"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Tipo de conta
                    </label>

                    <select
                      defaultValue="artista"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    >
                      <option value="artista">Artista</option>
                      <option value="galeria">Galeria</option>
                      <option value="colecionador">Colecionador</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="mb-6">
                  <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                    Proteção
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Segurança
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Senha atual
                    </label>

                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Nova senha
                    </label>

                    <input
                      type="password"
                      placeholder="Digite a nova senha"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-5 bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">Dica de segurança</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Use uma senha forte com letras, números e símbolos para
                      proteger sua conta.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="mb-6">
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                    Preferências
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Privacidade e notificações
                  </h2>
                </div>

                <div className="space-y-3">
                  {preferencias.map((item) => (
                    <div
                      key={item.titulo}
                      className="bg-[#F9F8F6] rounded-[1.5rem] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-bold text-sm">{item.titulo}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.descricao}
                        </p>
                      </div>

                      <button
                        className={`w-14 h-8 rounded-full p-1 transition-all ${
                          item.ativo ? "bg-artPurple" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full bg-white block transition-all ${
                            item.ativo ? "ml-6" : "ml-0"
                          }`}
                        ></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-red-100 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-red-400 font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Zona de risco
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Encerrar conta
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 max-w-xl">
                      Ao excluir sua conta, suas obras, mensagens e informações
                      de perfil serão removidas da plataforma.
                    </p>
                  </div>

                  <button className="bg-red-50 text-red-500 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
                    Excluir Conta
                  </button>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}