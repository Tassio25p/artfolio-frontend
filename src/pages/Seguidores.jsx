import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService, getMediaUrl } from "../services/api";

const filtros = [
  { id: "Todos", label: "Todos" },
  { id: "artista", label: "Artistas" },
  { id: "cliente", label: "Clientes" },
];

export default function Seguidores() {
  const [searchParams] = useSearchParams();
  const { user: authUser } = useAuth();
  
  const targetId = searchParams.get("usuario_id") || authUser?.id;
  const isOwner = authUser && String(authUser.id) === String(targetId);

  const [seguidores, setSeguidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtual, setFiltroAtual] = useState("Todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const carregarSeguidores = async () => {
    if (!targetId) return;
    try {
      setLoading(true);
      const lista = await usuarioService.listarSeguidores(targetId);
      setSeguidores(lista);
    } catch (err) {
      console.error("Erro ao carregar seguidores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSeguidores();
  }, [targetId]);

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleToggleFollowItem = async (usrItem) => {
    try {
      if (usrItem.seguindo) {
        await usuarioService.deixarDeSeguir(usrItem.id);
        setSeguidores((prev) =>
          prev.map((item) =>
            item.id === usrItem.id
              ? { ...item, seguindo: false }
              : item
          )
        );
        mostrarAviso(`Você deixou de seguir ${usrItem.nome}.`);
      } else {
        await usuarioService.seguir(usrItem.id);
        setSeguidores((prev) =>
          prev.map((item) =>
            item.id === usrItem.id
              ? { ...item, seguindo: true }
              : item
          )
        );
        mostrarAviso(`Você começou a seguir ${usrItem.nome}!`);
      }
    } catch (err) {
      mostrarAviso(err.message || "Erro ao alterar relacionamento.", "error");
    }
  };

  const seguidoresFiltrados = seguidores.filter((item) => {
    const termo = termoBusca.toLowerCase();
    const correspondeBusca =
      (item.nome || "").toLowerCase().includes(termo) ||
      (item.email || "").toLowerCase().includes(termo) ||
      (item.biografia || "").toLowerCase().includes(termo);

    const correspondeFiltro =
      filtroAtual === "Todos" || item.tipo_conta === filtroAtual;

    return correspondeBusca && correspondeFiltro;
  });

  const totalArtistas = seguidores.filter((s) => s.tipo_conta === "artista").length;
  const seguindoDeVolta = seguidores.filter((s) => s.seguindo).length;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-xs sm:text-sm mb-2.5 block">
                Comunidade artística
              </span>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">
                Seguidores<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-base text-gray-500 mt-4 max-w-xl leading-relaxed font-light">
                {isOwner
                  ? "Veja quem acompanha seu trabalho, descubra novas conexões e fortaleça sua presença dentro do Artfolio."
                  : "Veja pessoas que acompanham este perfil dentro da comunidade Artfolio."}
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

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{seguidores.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Total de Seguidores
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{seguindoDeVolta}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Você também segue
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalArtistas}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Artistas
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-artDark text-white rounded-[1.7rem] p-6 relative overflow-hidden shadow-xl">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Dica de conexão ✨
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight mb-2">
                  Interaja com quem acompanha você.
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Responder mensagens, seguir de volta e prestigiar produções cria laços genuínos na nossa comunidade artística.
                </p>

                <i className="fa-solid fa-heart absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
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
                      Pessoas que seguem este perfil
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

                {loading ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-12 text-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-3"></i>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Carregando seguidores...
                    </p>
                  </div>
                ) : seguidoresFiltrados.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 sm:p-12 text-center">
                    <i className="fa-solid fa-users-slash text-4xl text-gray-200 mb-4"></i>

                    <h3 className="font-editorial text-3xl italic">
                      Nenhum seguidor encontrado.
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Este perfil ainda não possui seguidores correspondentes ao filtro informado.
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
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-artPurple/10 shrink-0">
                            {seguidor.fotoPerfil ? (
                              <img
                                src={getMediaUrl(seguidor.fotoPerfil)}
                                alt={seguidor.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-editorial text-2xl text-artPurple">
                                {seguidor.nome?.charAt(0)?.toUpperCase() || "A"}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <h3 className="font-bold text-base">
                                {seguidor.nome}
                              </h3>

                              <span className="bg-white border border-black/5 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-400">
                                {seguidor.tipo_conta === "artista" ? "Artista" : "Cliente"}
                              </span>
                            </div>

                            {seguidor.biografia && (
                              <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-light">
                                {seguidor.biografia}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-2">
                          <Link
                            to={`/artista/${seguidor.id}`}
                            className="px-4 py-2.5 rounded-full bg-white border border-black/5 text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                          >
                            Ver perfil
                          </Link>

                          {!seguidor.isMe && (
                            <button
                              type="button"
                              onClick={() => handleToggleFollowItem(seguidor)}
                              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                                seguidor.seguindo
                                  ? "bg-white border border-black/5 text-gray-500 hover:bg-red-500 hover:text-white"
                                  : seguidor.segueDeVolta
                                  ? "bg-artOrange text-white hover:bg-artDark shadow-md shadow-artOrange/20"
                                  : "bg-artDark text-white hover:bg-artPurple"
                              }`}
                            >
                              {seguidor.seguindo
                                ? "Seguindo"
                                : seguidor.segueDeVolta
                                ? "Seguir de volta"
                                : "Seguir"}
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
      </div>
  );
}