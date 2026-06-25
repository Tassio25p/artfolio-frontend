import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const planoAtual = "PRO"; // Simulação de plano atual do usuário - pode ser "FREE", "PREMIUM" ou "PRO"

const planos = {
  FREE: {
    nome: "Free",
    descricao: "Acesso básico ao portfólio e recursos iniciais.",
    liberaAvancado: false,
  },
  PREMIUM: {
    nome: "Premium",
    descricao: "Libera estatísticas intermediárias e mais recursos comerciais.",
    liberaAvancado: true,
  },
  PRO: {
    nome: "Pro",
    descricao: "Libera estatísticas completas, destaque e análise avançada.",
    liberaAvancado: true,
  },
};

const estatisticasResumo = [
  {
    titulo: "Visualizações",
    valor: "2.7k",
    detalhe: "+18% este mês",
    icone: "fa-regular fa-eye",
  },
  {
    titulo: "Curtidas",
    valor: "156",
    detalhe: "+32 novas",
    icone: "fa-regular fa-heart",
  },
  {
    titulo: "Seguidores",
    valor: "1.2k",
    detalhe: "+84 novos",
    icone: "fa-solid fa-users",
  },
  {
    titulo: "Encomendas",
    valor: "12",
    detalhe: "R$ 3.8k estimado",
    icone: "fa-solid fa-handshake",
  },
];

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
  { mes: "Jan", valor: "h-24" },
  { mes: "Fev", valor: "h-32" },
  { mes: "Mar", valor: "h-20" },
  { mes: "Abr", valor: "h-40" },
  { mes: "Mai", valor: "h-28" },
  { mes: "Jun", valor: "h-48" },
];

export default function Estatisticas() {
  const [periodo, setPeriodo] = useState("30 dias");
  const [noticeMessage, setNoticeMessage] = useState("");

  const plano = planos[planoAtual];
  const estatisticasLiberadas = plano.liberaAvancado;

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleUpgrade = () => {
    mostrarAviso(
      "A alteração real de plano será integrada futuramente ao backend e ao sistema de assinaturas."
    );
  };

  const handlePeriodo = (novoPeriodo) => {
    setPeriodo(novoPeriodo);
    mostrarAviso(
      "O filtro real por período será aplicado futuramente com dados vindos do backend."
    );
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Desempenho do artista
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Estatísticas<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Acompanhe o crescimento do perfil, visualizações das obras,
                curtidas, seguidores e interações do portfólio quando o backend
                estiver integrado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!estatisticasLiberadas && (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="bg-artPurple text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:shadow-lg transition-all text-center"
                >
                  <i className="fa-solid fa-crown mr-2"></i>
                  Upgrade futuro
                </button>
              )}

              <Link
                to="/perfil"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-user mr-2"></i>
                Ver Perfil
              </Link>

              <Link
                to="/meu-portfolio"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
              >
                Gerenciar Obras
              </Link>
            </div>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <section className="bg-white border border-black/5 rounded-[2rem] p-5 mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center shrink-0">
                <i className="fa-solid fa-crown"></i>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Plano atual
                </span>

                <h2 className="font-editorial text-3xl italic">
                  Artfolio {plano.nome}
                </h2>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {plano.descricao}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["7 dias", "30 dias", "6 meses"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePeriodo(item)}
                  className={`px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    periodo === item
                      ? "bg-artDark text-white"
                      : "bg-[#F9F8F6] text-gray-400 hover:bg-artDark hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {estatisticasResumo.map((item) => (
              <div
                key={item.titulo}
                className="bg-white rounded-[1.7rem] p-5 border border-black/5 relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center mb-4">
                  <i className={item.icone}></i>
                </div>

                <p className="text-2xl font-black">{item.valor}</p>

                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  {item.titulo}
                </span>

                <p className="text-xs text-artPurple font-bold mt-2">
                  {item.detalhe}
                </p>

                <span className="absolute top-4 right-4 bg-artOrange/10 text-artOrange px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                  Prévia
                </span>
              </div>
            ))}
          </section>

          {!estatisticasLiberadas && (
            <section className="bg-artPurple/5 border border-artPurple/10 rounded-[2rem] p-6 mb-8 flex flex-col md:flex-row gap-5 md:items-center justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-lock"></i>
                </div>

                <div>
                  <h2 className="font-editorial text-3xl italic">
                    Estatísticas avançadas bloqueadas
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                    No plano Free, o artista terá acesso limitado. Estatísticas
                    avançadas, crescimento mensal, obras com melhor desempenho e
                    análise comercial serão liberadas conforme o plano.
                  </p>
                </div>
              </div>

              <Link
                to="/planos"
                className="bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all text-center"
              >
                Ver planos
              </Link>
            </section>
          )}

          <div className="relative">
            {!estatisticasLiberadas && (
              <div className="absolute inset-0 z-20 bg-[#F9F8F6]/60 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center border border-black/5 min-h-[520px]">
                <div className="w-16 h-16 rounded-full bg-artPurple/10 text-artPurple flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-crown"></i>
                </div>

                <h2 className="font-editorial text-3xl lg:text-4xl italic mb-3 leading-none">
                  Desbloqueie análises completas
                </h2>

                <p className="text-gray-500 text-sm max-w-lg mb-6 leading-relaxed font-light">
                  Esta área representa os recursos avançados de estatísticas do
                  Artfolio. Os dados reais serão calculados futuramente pelo
                  backend com base nas visualizações, curtidas, seguidores e
                  encomendas registradas no PostgreSQL.
                </p>

                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="bg-artDark text-white px-8 py-4 rounded-full text-xs font-bold hover:bg-artPurple hover:shadow-xl hover:shadow-artPurple/20 transition-all active:scale-95"
                >
                  Solicitar upgrade futuramente
                </button>
              </div>
            )}

            <div
              className={`transition-all duration-500 ${
                !estatisticasLiberadas
                  ? "pointer-events-none select-none opacity-20 blur-[2px]"
                  : ""
              }`}
            >
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

                      <p className="text-xs text-gray-400 mt-2">
                        Dados demonstrativos da interface. No backend, os
                        valores serão calculados por período.
                      </p>
                    </div>

                    <div className="h-56 flex items-end justify-between gap-3">
                      {meses.map((item) => (
                        <div
                          key={item.mes}
                          className="flex flex-col items-center justify-end gap-2 flex-1"
                        >
                          <div
                            className={`${item.valor} w-full rounded-t-2xl bg-artPurple/80 hover:bg-artOrange transition-colors`}
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
                      Insight futuro
                    </span>

                    <h3 className="font-editorial text-2xl italic leading-tight">
                      Análises automáticas serão geradas pelo backend.
                    </h3>

                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      Futuramente, o sistema poderá indicar quais obras possuem
                      mais visualizações, melhor taxa de interação e maior
                      potencial de encomendas.
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

                      <button
                        type="button"
                        onClick={() =>
                          mostrarAviso(
                            "O filtro real de desempenho será integrado futuramente ao backend."
                          )
                        }
                        className="bg-[#F9F8F6] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all"
                      >
                        Período: {periodo}
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

                          <div className="bg-artPurple/10 text-artPurple px-4 py-2 rounded-full text-xs font-black text-center">
                            {obra.crescimento}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}