import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService, getMediaUrl } from "../services/api";

const filtros = [
  { id: "Todos", label: "Todos" },
  { id: "artista", label: "Artistas" },
  { id: "cliente", label: "Clientes" },
];

export default function Seguindo() {
  const [searchParams] = useSearchParams();
  const { user: authUser } = useAuth();

  const targetId = searchParams.get("usuario_id") || authUser?.id;
  const isOwner = authUser && String(authUser.id) === String(targetId);

  const [seguindoLista, setSeguindoLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtual, setFiltroAtual] = useState("Todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const carregarSeguindo = async () => {
    if (!targetId) return;
    try {
      setLoading(true);
      const lista = await usuarioService.listarSeguindo(targetId);
      setSeguindoLista(lista);
    } catch (err) {
      console.error("Erro ao carregar lista de pessoas seguidas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSeguindo();
  }, [targetId]);

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleDeixarDeSeguir = async (usrItem) => {
    try {
      await usuarioService.deixarDeSeguir(usrItem.id);
      setSeguindoLista((prev) => prev.filter((item) => item.id !== usrItem.id));
      mostrarAviso(`Você deixou de seguir ${usrItem.nome}.`);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao deixar de seguir.", "error");
    }
  };

  const seguindoFiltrados = seguindoLista.filter((item) => {
    const termo = termoBusca.toLowerCase();
    const correspondeBusca =
      (item.nome || "").toLowerCase().includes(termo) ||
      (item.email || "").toLowerCase().includes(termo) ||
      (item.biografia || "").toLowerCase().includes(termo);

    const correspondeFiltro =
      filtroAtual === "Todos" || item.tipo_conta === filtroAtual;

    return correspondeBusca && correspondeFiltro;
  });

  const totalArtistas = seguindoLista.filter((s) => s.tipo_conta === "artista").length;

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
                Seguindo<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                {isOwner
                  ? "Acompanhe as atualizações dos artistas e perfis que você escolheu seguir dentro do Artfolio."
                  : "Perfis acompanhados por este usuário na plataforma."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={targetId ? `/artista/${targetId}` : "/perfil"}
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Perfil
              </Link>

              {isOwner && (
                <Link
                  to="/seguidores"
                  className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
                >
                  Ver Seguidores
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

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{seguindoLista.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Pessoas Seguidas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalArtistas}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Artistas Acompanhados
              </span>
            </div>
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
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Minhas conexões
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Pessoas acompanhadas
                    </h2>
                  </div>

                  <div className="relative w-full md:w-72">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

                    <input
                      type="text"
                      value={termoBusca}
                      onChange={(event) => setTermoBusca(event.target.value)}
                      placeholder="Buscar por nome..."
                      className="w-full bg-[#F9F8F6] rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-12 text-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-3"></i>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Carregando pessoas seguidas...
                    </p>
                  </div>
                ) : seguindoFiltrados.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 sm:p-12 text-center">
                    <i className="fa-solid fa-users-slash text-4xl text-gray-200 mb-4"></i>

                    <h3 className="font-editorial text-3xl italic">
                      Nenhuma pessoa encontrada.
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Você ainda não está seguindo nenhum usuário correspondente ao filtro.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {seguindoFiltrados.map((seguido) => (
                      <article
                        key={seguido.id}
                        className="group bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-artPurple/10 shrink-0">
                            {seguido.fotoPerfil ? (
                              <img
                                src={getMediaUrl(seguido.fotoPerfil)}
                                alt={seguido.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-editorial text-2xl text-artPurple">
                                {seguido.nome?.charAt(0)?.toUpperCase() || "A"}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <h3 className="font-bold text-base">
                                {seguido.nome}
                              </h3>

                              <span className="bg-white border border-black/5 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-400">
                                {seguido.tipo_conta === "artista" ? "Artista" : "Cliente"}
                              </span>
                            </div>

                            {seguido.biografia && (
                              <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-light">
                                {seguido.biografia}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-2">
                          <Link
                            to={`/artista/${seguido.id}`}
                            className="px-4 py-2.5 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                          >
                            Ver perfil
                          </Link>

                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => handleDeixarDeSeguir(seguido)}
                              className="px-4 py-2.5 rounded-full text-xs font-bold bg-white border border-black/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              Deixar de seguir
                            </button>
                          )}
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