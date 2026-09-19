import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, getMediaUrl } from "../services/api";

const filtros = [
  { id: "Todas", label: "Todas" },
  { id: "artista", label: "Artistas" },
  { id: "cliente", label: "Clientes" },
];

export default function Salvos() {
  const { user: authUser } = useAuth();

  const [obrasSalvas, setObrasSalvas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtual, setFiltroAtual] = useState("Todas");
  const [termoBusca, setTermoBusca] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [denunciaAtual, setDenunciaAtual] = useState({ idPostagem: null, alvo: "" });

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const carregarObrasSalvas = async () => {
    try {
      setLoading(true);
      const lista = await obrasService.listarSalvas();
      if (Array.isArray(lista)) {
        setObrasSalvas(lista);
      }
    } catch (err) {
      console.error("Erro ao carregar obras salvas:", err);
      mostrarAviso("Erro ao carregar sua lista de obras salvas.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarObrasSalvas();
  }, []);

  const handleRemoverSalvo = async (obraId) => {
    try {
      await obrasService.removerSalvo(obraId);
      setObrasSalvas((prev) => prev.filter((o) => o.id !== obraId));
      mostrarAviso("Obra removida dos salvos com sucesso.", "success");
    } catch (err) {
      mostrarAviso(err.message || "Erro ao remover obra dos salvos.", "error");
    }
  };

  const handleAbrirDenuncia = (obra) => {
    setDenunciaAtual({
      idPostagem: obra.id,
      alvo: obra.legenda || `Obra #${obra.id} por ${obra.usuario?.nome || "Artista"}`,
    });
    setModalDenunciaAberto(true);
  };

  const obrasFiltradas = obrasSalvas.filter((obra) => {
    const termo = termoBusca.toLowerCase();

    const correspondeBusca =
      (obra.legenda || "").toLowerCase().includes(termo) ||
      (obra.usuario?.nome || "").toLowerCase().includes(termo) ||
      (obra.categoria?.nomeCategoria || "").toLowerCase().includes(termo);

    const correspondeFiltro =
      filtroAtual === "Todas" || obra.usuario?.tipo_conta === filtroAtual;

    return correspondeBusca && correspondeFiltro;
  });

  const totalArtistas = new Set(
    obrasSalvas.map((obra) => obra.usuario?.nome).filter(Boolean)
  ).size;

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/10",
    success: "bg-green-50 text-green-600 border-green-200",
    error: "bg-red-50 text-red-500 border-red-200",
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-xs sm:text-sm mb-2.5 block">
                Galeria pessoal
              </span>

              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">
                Salvos<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-base text-gray-500 mt-4 max-w-xl leading-relaxed font-light">
                Guarde referências, obras que inspiram seu trabalho e
                projetos que você deseja acompanhar ou encomendar no futuro.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/feed"
                className="bg-white border border-black/5 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                Explorar Feed
              </Link>
            </div>
          </header>

          {noticeMessage && (
            <div className={`${noticeStyles[noticeType]} border rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold`}>
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{obrasSalvas.length}</p>

              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Obras Salvas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{totalArtistas}</p>

              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Artistas Distintos
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
                      Sua coleção
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Obras registradas
                    </h2>
                  </div>

                  <div className="relative w-full md:w-72">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

                    <input
                      type="text"
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                      placeholder="Buscar obra salva..."
                      className="w-full bg-[#F9F8F6] rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-12 text-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>

                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Carregando suas obras salvas...
                    </p>
                  </div>
                ) : obrasFiltradas.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 sm:p-12 text-center">
                    <i className="fa-solid fa-bookmark text-4xl text-gray-200 mb-4"></i>

                    <h3 className="font-editorial text-3xl italic">
                      Nenhuma obra salva.
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Explore o feed e salve obras de artistas que você aprecia.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {obrasFiltradas.map((obra) => (
                      <article
                        key={obra.id}
                        className="group bg-[#F9F8F6] rounded-[1.7rem] border border-black/5 overflow-hidden flex flex-col hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                      >
                        <div className="relative h-56 bg-artDark/5 overflow-hidden">
                          <img
                            src={getMediaUrl(obra.arquivoUrl)}
                            alt={obra.legenda || "Obra Salva"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <div className="absolute top-3 right-3 z-10">
                            <MenuOpcoes
                              tipo="obra"
                              detalhesLink={`/obra/${obra.id}`}
                              isSalvo={true}
                              onSalvar={() => handleRemoverSalvo(obra.id)}
                              onDenunciar={() => handleAbrirDenuncia(obra)}
                              onCopiarLinkSuccess={(msg) => mostrarAviso(msg, "success")}
                            />
                          </div>

                          {obra.categoria?.nomeCategoria && (
                            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-artDark border border-black/5">
                              {obra.categoria.nomeCategoria}
                            </span>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/obra/${obra.id}`}
                              className="font-editorial text-xl italic hover:text-artPurple transition-colors line-clamp-1 block mb-2"
                            >
                              {obra.legenda || `Obra #${obra.id}`}
                            </Link>

                            <div className="flex items-center gap-2">
                              <Link
                                to={
                                  authUser?.id === obra.usuario?.id
                                    ? "/perfil"
                                    : `/artista/${obra.usuario?.id}`
                                }
                                className="text-xs font-bold text-gray-600 hover:text-artPurple transition-colors"
                              >
                                {obra.usuario?.nome || "Artista"}
                              </Link>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleRemoverSalvo(obra.id)}
                              className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                            >
                              <i className="fa-solid fa-bookmark text-amber-500"></i>
                              Remover dos salvos
                            </button>

                            <Link
                              to={`/obra/${obra.id}`}
                              className="w-8 h-8 rounded-full bg-artDark text-white hover:bg-artPurple transition-all flex items-center justify-center"
                            >
                              <i className="fa-solid fa-arrow-right text-xs"></i>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </section>
        </div>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        postagemId={denunciaAtual.idPostagem}
        alvo={denunciaAtual.alvo}
        onSucesso={(msg) => mostrarAviso(msg, "success")}
        onErro={(msg) => mostrarAviso(msg, "error")}
      />
    </div>
  );
}