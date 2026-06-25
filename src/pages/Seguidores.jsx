import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const seguidores = [
  {
    id: 1,
    nome: "Gabriel Duarte",
    tipo: "Artista",
    area: "Arte Têxtil",
    cidade: "Curitiba, PR",
    seguidores: "840",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    seguindo: true,
  },
  {
    id: 2,
    nome: "Helena Matos",
    tipo: "Artista",
    area: "Ilustração Digital",
    cidade: "São Paulo, SP",
    seguidores: "1.5k",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    seguindo: false,
  },
  {
    id: 3,
    nome: "Ricardo Aris",
    tipo: "Colecionador",
    area: "Pintura Conceitual",
    cidade: "Belo Horizonte, MG",
    seguidores: "620",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    seguindo: false,
  },
  {
    id: 4,
    nome: "Luan Rocha",
    tipo: "Artista",
    area: "Modelagem 3D",
    cidade: "Rio de Janeiro, RJ",
    seguidores: "2.1k",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    seguindo: true,
  },
  {
    id: 5,
    nome: "Camila Torres",
    tipo: "Galeria",
    area: "Arte Digital",
    cidade: "Campinas, SP",
    seguidores: "970",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    seguindo: false,
  },
];

const filtros = [
  { id: "Todos", label: "Todos" },
  { id: "Artista", label: "Artistas" },
  { id: "Galeria", label: "Galerias" },
  { id: "Colecionador", label: "Colecionadores" },
];

export default function Seguidores() {
  const [filtroAtual, setFiltroAtual] = useState("Todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const tipoVisualizacao = "visitante"; // Simulação de tipo de visualização - pode ser "dono" ou "visitante"
  const isOwner = tipoVisualizacao === "dono";

  const seguidoresFiltrados = seguidores.filter((seguidor) => {
    const termo = termoBusca.toLowerCase();

    const correspondeBusca =
      seguidor.nome.toLowerCase().includes(termo) ||
      seguidor.area.toLowerCase().includes(termo) ||
      seguidor.cidade.toLowerCase().includes(termo) ||
      seguidor.tipo.toLowerCase().includes(termo);

    const correspondeFiltro =
      filtroAtual === "Todos" || seguidor.tipo === filtroAtual;

    return correspondeBusca && correspondeFiltro;
  });

  const totalArtistas = seguidores.filter(
    (seguidor) => seguidor.tipo === "Artista"
  ).length;

  const totalGalerias = seguidores.filter(
    (seguidor) => seguidor.tipo === "Galeria"
  ).length;

  const seguindoDeVolta = seguidores.filter(
    (seguidor) => seguidor.seguindo
  ).length;

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleAcaoFutura = () => {
    mostrarAviso(
      "A ação real de seguir, deixar de seguir ou remover conexão será integrada ao backend."
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
                Comunidade artística
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Seguidores<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                {isOwner
                  ? "Veja quem acompanha seu trabalho, descubra novas conexões e fortaleça sua presença dentro do Artfolio."
                  : "Veja pessoas que acompanham este perfil artístico dentro da comunidade Artfolio."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/perfil"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Perfil
              </Link>

              {isOwner && (
                <Link
                  to="/seguindo"
                  className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
                >
                  Ver Seguindo
                </Link>
              )}
            </div>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">1.2k</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Seguidores
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{seguindoDeVolta}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Seguindo de volta
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalArtistas}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Artistas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalGalerias}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Galerias
              </span>
            </div>
          </section>

          <section className="bg-artPurple/5 border border-artPurple/10 rounded-[1.7rem] p-5 mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center shrink-0">
                <i className="fa-solid fa-users"></i>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  Conexões do perfil
                </h2>

                <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  No backend, esta lista será carregada conforme o perfil
                  visitado e as regras de privacidade do usuário.
                </p>
              </div>
            </div>

            <Link
              to="/mensagens"
              className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
            >
              Ver mensagens
            </Link>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Filtros
                </h2>

                <div className="space-y-2">
                  {filtros.map((filtro) => (
                    <button
                      key={filtro.id}
                      type="button"
                      onClick={() => setFiltroAtual(filtro.id)}
                      className={`w-full px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-all ${
                        filtroAtual === filtro.id
                          ? "bg-artDark text-white shadow-md shadow-black/10"
                          : "bg-[#F9F8F6] text-gray-400 hover:text-artDark hover:bg-[#eae7df]"
                      }`}
                    >
                      {filtro.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica de conexão
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Interaja com quem acompanha você.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Responder mensagens, seguir de volta e comentar obras ajuda a
                  criar uma comunidade mais forte.
                </p>

                <i className="fa-solid fa-users absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>

              <div className="bg-artBlue/5 border border-artBlue/10 rounded-[1.7rem] p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">
                  Integração futura
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Seguir, deixar de seguir e remover conexão serão ações
                  controladas pelo backend com o usuário autenticado.
                </p>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Lista de conexões
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Pessoas que seguem você
                    </h2>
                  </div>

                  <div className="relative w-full md:w-72">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

                    <input
                      type="text"
                      value={termoBusca}
                      onChange={(event) => setTermoBusca(event.target.value)}
                      placeholder="Buscar seguidor..."
                      className="w-full bg-[#F9F8F6] rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                {seguidoresFiltrados.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 sm:p-12 text-center">
                    <i className="fa-solid fa-users-slash text-4xl text-gray-200 mb-4"></i>

                    <h3 className="font-editorial text-3xl italic">
                      Nenhum seguidor encontrado.
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Tente buscar por outro nome, cidade, área ou tipo de
                      perfil.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {seguidoresFiltrados.map((seguidor) => (
                      <article
                        key={seguidor.id}
                        className="group bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-artPurple shrink-0">
                            <img
                              src={seguidor.avatar}
                              alt={seguidor.nome}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <h3 className="font-bold text-base">
                                {seguidor.nome}
                              </h3>

                              <span className="bg-white border border-black/5 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-400">
                                {seguidor.tipo}
                              </span>
                            </div>

                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                              {seguidor.area}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              <i className="fa-solid fa-location-dot mr-1 text-artPurple"></i>
                              {seguidor.cidade}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 text-xs text-gray-400 font-bold">
                          <span>
                            <i className="fa-solid fa-users mr-1"></i>
                            {seguidor.seguidores} seguidores
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 md:flex gap-2">
                          <Link
                            to="/perfil"
                            className="px-4 py-2.5 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                          >
                            Ver perfil
                          </Link>

                          {isOwner && (
                            <button
                              type="button"
                              onClick={handleAcaoFutura}
                              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                                seguidor.seguindo
                                  ? "bg-white border border-black/5 text-gray-400 hover:bg-artOrange hover:text-white"
                                  : "bg-artDark text-white hover:bg-artPurple"
                              }`}
                            >
                              {seguidor.seguindo
                                ? "Seguindo"
                                : "Seguir de volta"}
                            </button>
                          )}

                          <Link
                            to="/mensagens"
                            className="px-4 py-2.5 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artBlue hover:text-white transition-all text-center"
                          >
                            Mensagem
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}