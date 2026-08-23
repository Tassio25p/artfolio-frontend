import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PortfolioCard from "../components/PortfolioCard";
import Sidebar from "../components/Sidebar";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import ModalConversao from "../components/ModalConversao";
import ModalPortfolioApresentacao from "../components/ModalPortfolioApresentacao";
import ModalCompartilhar from "../components/ModalCompartilhar";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, usuarioService, getMediaUrl } from "../services/api";

export default function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [modalConversaoAberto, setModalConversaoAberto] = useState(false);
  const [modalPortfolioAberto, setModalPortfolioAberto] = useState(false);
  const [modalCompartilharAberto, setModalCompartilharAberto] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");

  const [acaoTentada, setAcaoTentada] = useState("interagir");
  const [abaAtiva, setAbaAtiva] = useState("obras"); // "obras" | "favoritos"
  const [loading, setLoading] = useState(true);

  // Dados do perfil
  const [perfil, setPerfil] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Obras do artista e Obras salvas
  const [obrasPublicas, setObrasPublicas] = useState([]);
  const [obrasSalvas, setObrasSalvas] = useState([]);
  const [carregandoSalvas, setCarregandoSalvas] = useState(false);

  const { user: authUser, isGuest, isAuthenticated } = useAuth();

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      if (!id && isGuest) {
        setLoading(false);
        return;
      }

      const isProprioPerfil = !id || (authUser && String(id) === String(authUser.id));
      const targetId = id || authUser?.id;

      if (!targetId) {
        setLoading(false);
        return;
      }

      let dadosPerfil = null;
      try {
        dadosPerfil = await usuarioService.obterPerfil(targetId);
      } catch {
        if (isProprioPerfil && authUser) {
          dadosPerfil = authUser;
        } else {
          dadosPerfil = {
            id: targetId,
            nome: `Artista #${targetId}`,
            biografia: "",
            email: "",
            tipo_conta: "artista",
            fotoPerfil: "",
            instagram: "",
            behance: "",
            website: "",
            portfolio: "",
            trajetoria: "",
            especializacoes: "",
            certificados: "[]",
            seguidoresCount: 0,
            seguindoCount: 0,
            obrasCount: 0,
          };
        }
      }

      const souDono = !isGuest && (isProprioPerfil || dadosPerfil?.relacionamento?.isMe || (authUser && String(authUser.id) === String(dadosPerfil?.id)));
      setIsOwner(souDono);

      setPerfil({
        id: dadosPerfil.id || targetId,
        nome: dadosPerfil.nome || (isProprioPerfil ? authUser?.nome : `Artista #${targetId}`) || "Artista",
        biografia: dadosPerfil.biografia || "",
        email: dadosPerfil.email || (isProprioPerfil ? authUser?.email : "") || "",
        tipoConta: dadosPerfil.tipo_conta || "artista",
        avatar: dadosPerfil.fotoPerfil || (isProprioPerfil ? authUser?.fotoPerfil : "") || "",
        instagram: dadosPerfil.instagram || (isProprioPerfil ? authUser?.instagram : "") || "",
        behance: dadosPerfil.behance || (isProprioPerfil ? authUser?.behance : "") || "",
        website: dadosPerfil.website || (isProprioPerfil ? authUser?.website : "") || "",
        portfolio: dadosPerfil.portfolio || (isProprioPerfil ? authUser?.portfolio : "") || "",
        trajetoria: dadosPerfil.trajetoria || "",
        especializacoes: dadosPerfil.especializacoes || "",
        certificados: dadosPerfil.certificados || "[]",
        telefone: dadosPerfil.telefone || "",
        seguidores: dadosPerfil.seguidoresCount || 0,
        seguindo: dadosPerfil.seguindoCount || 0,
        obras: dadosPerfil.obrasCount || 0,
        relacionamento: dadosPerfil.relacionamento || {},
      });

      // Carregar obras do usuário
      try {
        const obras = await obrasService.listarObras({ usuario_id: targetId });
        if (Array.isArray(obras) && obras.length > 0) {
          setObrasPublicas(
            obras.map((obra) => ({
              id: obra.id,
              image: obra.arquivoUrl || obra.arquivo_url || "",
              category:
                (obra.categorias && obra.categorias[0]?.nomeCategoria) ||
                obra.categoria?.nomeCategoria ||
                obra.categoria?.nome ||
                "Arte",
              title: obra.legenda || "Sem título",
              color: "text-artOrange",
              tipo: "Digital",
            }))
          );
        } else {
          setObrasPublicas([]);
        }
      } catch {
        setObrasPublicas([]);
      }

      // Se for o próprio perfil, carregar obras salvas para a aba Favoritos
      if (souDono) {
        setCarregandoSalvas(true);
        try {
          const salvas = await obrasService.listarSalvas();
          setObrasSalvas(Array.isArray(salvas) ? salvas : []);
        } catch {
          setObrasSalvas([]);
        } finally {
          setCarregandoSalvas(false);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, [id, authUser, isGuest]);

  const handleToggleFollow = async () => {
    if (isGuest || !isAuthenticated) {
      setAcaoTentada("seguir este artista");
      setModalConversaoAberto(true);
      return;
    }

    if (!perfil || !perfil.id) return;
    try {
      const estaSeguindo = perfil.relacionamento?.seguindo;
      if (estaSeguindo) {
        await usuarioService.deixarDeSeguir(perfil.id);
        setPerfil((prev) => ({
          ...prev,
          seguidores: Math.max(0, (prev.seguidores || 1) - 1),
          relacionamento: {
            ...prev.relacionamento,
            seguindo: false,
          },
        }));
      } else {
        await usuarioService.seguir(perfil.id);
        setPerfil((prev) => ({
          ...prev,
          seguidores: (prev.seguidores || 0) + 1,
          relacionamento: {
            ...prev.relacionamento,
            seguindo: true,
          },
        }));
      }
    } catch (err) {
      console.error("Erro ao alterar relacionamento de seguir:", err);
    }
  };

  const handleAcaoRestritaVisitante = (acao) => {
    if (isGuest || !isAuthenticated) {
      setAcaoTentada(acao);
      setModalConversaoAberto(true);
      return true;
    }
    return false;
  };

  const mostrarAviso = (msg) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  // Se o visitante acessou /perfil (sem ID de artista)
  if (isGuest && !id) {
    return (
      <div className="bg-[#F9F8F6] text-artDark antialiased min-h-screen font-sans">
        <Sidebar />
        <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-black/5 p-8 text-center shadow-xl shadow-black/5 animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-artBlue/10 text-artBlue flex items-center justify-center text-2xl mx-auto mb-6 shadow-md shadow-artBlue/10">
              <i className="fa-solid fa-eye"></i>
            </div>

            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
              Modo Visitante Ativo
            </span>

            <h2 className="font-editorial text-3xl font-bold leading-tight mb-3">
              Você ainda não possui um <span className="italic text-artOrange">Perfil de Artista.</span>
            </h2>

            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-light">
              Navegando como <strong>{authUser?.nome || "Visitante"}</strong>, você pode explorar e buscar obras livremente. Para expor seu próprio portfólio, publicar criações e salvar favoritos, cadastre-se hoje mesmo!
            </p>

            <div className="space-y-3">
              <Link
                to="/cadastro"
                className="w-full inline-flex items-center justify-center gap-2 bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                <i className="fa-solid fa-palette text-xs"></i>
                Criar Minha Conta de Artista
              </Link>

              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F9F8F6] text-artDark border border-black/5 py-3 rounded-full text-sm font-bold hover:bg-artPurple hover:text-white transition-all active:scale-95"
              >
                Fazer Login
              </Link>

              <Link
                to="/feed"
                className="inline-block text-xs font-bold text-gray-400 hover:text-artDark uppercase tracking-widest pt-2"
              >
                ← Voltar para o Feed
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading || !perfil) {
    return (
      <div className="bg-[#F9F8F6] text-artDark antialiased min-h-screen font-sans">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
              Carregando perfil...
            </p>
          </div>
        </main>
      </div>
    );
  }

  const nomeParts = (perfil.nome || "Artista").trim().split(" ");
  const primeiroNome = nomeParts[0];
  const sobrenome = nomeParts.slice(1).join(" ");

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen">
        {/* Banner Alerta de Mensagem */}
        {noticeMessage && (
          <div className="fixed top-5 right-5 z-50 bg-artDark text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-fadeIn">
            <i className="fa-solid fa-check-circle text-artOrange mr-2"></i>
            {noticeMessage}
          </div>
        )}

        <section className="bg-white border-b border-black/5 px-4 sm:px-6 lg:px-10 py-7">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-2 flex justify-center lg:justify-start">
                <div className="relative group w-fit">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-gray-100">
                    {perfil.avatar ? (
                      <img
                        src={getMediaUrl(perfil.avatar)}
                        alt={`Avatar de ${perfil.nome}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-artPurple/10 flex items-center justify-center">
                        <span className="text-5xl font-editorial text-artPurple/40">
                          {perfil.nome?.charAt(0)?.toUpperCase() || "A"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute -bottom-2 -right-2 bg-artOrange text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block">
                    Artista Verificado
                  </span>

                  <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                    Portfólio Ativo
                  </span>
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-5xl leading-none mb-3">
                  {primeiroNome} {sobrenome && <span className="italic">{sobrenome}</span>}
                </h1>

                {perfil.biografia && (
                  <p className="max-w-2xl mx-auto lg:mx-0 text-gray-500 leading-relaxed text-sm font-light">
                    {perfil.biografia}
                  </p>
                )}

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                  <span className="bg-artPurple/10 text-artPurple px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {perfil.tipoConta || "Artista"}
                  </span>

                  <span className="bg-artBlue/10 text-artBlue px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Portfólio Público
                  </span>

                  {isOwner && (
                    <span className="bg-artOrange/10 text-artOrange px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Meu Perfil
                    </span>
                  )}
                </div>
              </div>

              {/* Estatísticas e Ações */}
              <div className="lg:col-span-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Link
                    to={`/seguidores${perfil?.id ? `?usuario_id=${perfil.id}` : ""}`}
                    className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all text-center lg:text-left"
                  >
                    <span className="text-artDark text-xl font-black block">
                      {perfil.seguidores}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Seguidores
                    </span>
                  </Link>

                  <Link
                    to={`/seguindo${perfil?.id ? `?usuario_id=${perfil.id}` : ""}`}
                    className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all text-center lg:text-left"
                  >
                    <span className="text-artDark text-xl font-black block">
                      {perfil.seguindo}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Seguindo
                    </span>
                  </Link>

                  <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 text-center lg:text-left">
                    <span className="text-artDark text-xl font-black block">
                      {obrasPublicas.length || perfil.obras}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Obras
                    </span>
                  </div>
                </div>

                {isOwner ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
                    <Link
                      to="/editar-perfil"
                      className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all text-center"
                    >
                      <i className="fa-solid fa-pen mr-2"></i>
                      Editar Perfil
                    </Link>

                    <Link
                      to="/criar-obra"
                      className="bg-gradient-to-r from-artPurple via-indigo-600 to-artBlue text-white px-4 py-2.5 rounded-full text-xs font-bold hover:opacity-95 transition-all text-center shadow-md shadow-artPurple/20 flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                      Nova Obra
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {perfil.relacionamento?.seguindo ? (
                      <button
                        type="button"
                        onClick={handleToggleFollow}
                        className="flex-1 bg-artDark/10 text-artDark border border-black/10 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                      >
                        <i className="fa-solid fa-user-check mr-2"></i>
                        Seguindo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleToggleFollow}
                        className="flex-1 bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange transition-all flex items-center justify-center"
                      >
                        <i className="fa-solid fa-user-plus mr-2"></i>
                        Seguir
                      </button>
                    )}

                    {isGuest ? (
                      <button
                        type="button"
                        onClick={() => handleAcaoRestritaVisitante("enviar mensagens para este artista")}
                        className="flex-1 bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue hover:text-white transition-all text-center"
                      >
                        <i className="fa-solid fa-paper-plane mr-2"></i>
                        Mensagem
                      </button>
                    ) : (
                      <Link
                        to="/mensagens"
                        className="flex-1 bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue hover:text-white transition-all text-center"
                      >
                        <i className="fa-solid fa-paper-plane mr-2"></i>
                        Mensagem
                      </Link>
                    )}

                    <MenuOpcoes
                      tipo="perfil"
                      detalhesLink={`/artista/${perfil.id}`}
                      onDenunciar={() => {
                        if (isGuest) {
                          handleAcaoRestritaVisitante("denunciar um perfil");
                        } else {
                          setModalDenunciaAberto(true);
                        }
                      }}
                      onCompartilhar={() => setModalCompartilharAberto(true)}
                      onCopiarLinkSuccess={mostrarAviso}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Links e Botão de Portfólio & Apresentação */}
        <section className="bg-white border-b border-black/5 px-4 sm:px-6 lg:px-10 py-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
            {perfil.instagram && (
              <a
                href={`https://instagram.com/${perfil.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-artOrange transition-colors bg-[#F9F8F6] border border-black/5 px-4 py-2 rounded-full"
              >
                <i className="fa-brands fa-instagram text-sm text-artOrange"></i>
                <span>@{perfil.instagram.replace('@', '')}</span>
              </a>
            )}

            {perfil.behance && (
              <a
                href={perfil.behance.startsWith("http") ? perfil.behance : `https://behance.net/${perfil.behance}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-artBlue transition-colors bg-[#F9F8F6] border border-black/5 px-4 py-2 rounded-full"
              >
                <i className="fa-brands fa-behance text-sm text-artBlue"></i>
                <span>Behance</span>
              </a>
            )}

            {perfil.website && (
              <a
                href={perfil.website.startsWith("http") ? perfil.website : `https://${perfil.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-artDark transition-colors bg-[#F9F8F6] border border-black/5 px-4 py-2 rounded-full"
              >
                <i className="fa-solid fa-globe text-sm text-artPurple"></i>
                <span>Website</span>
              </a>
            )}

            {/* Botão de Portfólio / Certificados */}
            <button
              type="button"
              onClick={() => setModalPortfolioAberto(true)}
              className="flex items-center gap-2 bg-artOrange/10 text-artOrange border border-artOrange/20 px-4 py-2 rounded-full font-bold hover:bg-artOrange hover:text-white transition-all shadow-sm ml-auto sm:ml-0"
            >
              <i className="fa-solid fa-file-contract text-sm"></i>
              <span>Portfólio & Certificados ({isOwner ? "Editar" : "Ver"})</span>
            </button>
          </div>
        </section>

        {/* Abas do Perfil: Obras Publicadas vs Favoritos/Salvos */}
        <section className="px-4 sm:px-6 lg:px-10 pt-8 pb-4">
          <div className="max-w-6xl mx-auto flex items-center gap-3 border-b border-black/5 pb-3">
            <button
              type="button"
              onClick={() => setAbaAtiva("obras")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                abaAtiva === "obras"
                  ? "bg-artDark text-white shadow-md"
                  : "bg-white text-gray-500 border border-black/5 hover:bg-gray-50"
              }`}
            >
              <i className="fa-solid fa-palette"></i>
              <span>Obras ({obrasPublicas.length})</span>
            </button>

            {isOwner && (
              <button
                type="button"
                onClick={() => setAbaAtiva("favoritos")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  abaAtiva === "favoritos"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "bg-white text-gray-500 border border-black/5 hover:bg-gray-50 hover:text-amber-500"
                }`}
              >
                <i className="fa-solid fa-bookmark"></i>
                <span>Favoritos / Salvos ({obrasSalvas.length})</span>
              </button>
            )}
          </div>
        </section>

        {/* Conteúdo da Aba Ativa */}
        <section className="px-4 sm:px-6 lg:px-10 pb-12">
          <div className="max-w-6xl mx-auto">
            {abaAtiva === "obras" ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Galeria de Obras
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Produções de {primeiroNome}
                    </h2>
                  </div>

                  <span className="text-xs font-bold text-gray-400">
                    {obrasPublicas.length} {obrasPublicas.length === 1 ? "obra publicada" : "obras publicadas"}
                  </span>
                </div>

                {obrasPublicas.length === 0 ? (
                  <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center shadow-sm">
                    <i className="fa-solid fa-palette text-4xl text-gray-200 mb-4"></i>
                    <h3 className="font-editorial text-3xl italic mb-2">Nenhuma obra cadastrada ainda.</h3>
                    <p className="text-sm text-gray-400">
                      {isOwner
                        ? "Comece publicando suas primeiras criações para montar seu portfólio!"
                        : "Este artista ainda não publicou obras."}
                    </p>
                    {isOwner && (
                      <Link
                        to="/criar-obra"
                        className="inline-block mt-5 bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-artOrange transition-all shadow-md"
                      >
                        Publicar Primeira Obra
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {obrasPublicas.map((obra) => (
                      <PortfolioCard key={obra.id} obra={obra} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Aba de Favoritos / Obras Salvas */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Coleção Pessoal
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Minhas Obras Favoritadas
                    </h2>
                  </div>

                  <span className="text-xs font-bold text-gray-400">
                    {obrasSalvas.length} {obrasSalvas.length === 1 ? "favorito" : "favoritos"}
                  </span>
                </div>

                {carregandoSalvas ? (
                  <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-amber-500 mb-3"></i>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Carregando obras salvas...
                    </p>
                  </div>
                ) : obrasSalvas.length === 0 ? (
                  <div className="bg-white rounded-[2rem] border border-black/5 p-12 text-center shadow-sm">
                    <i className="fa-solid fa-bookmark text-4xl text-gray-200 mb-4"></i>
                    <h3 className="font-editorial text-3xl italic mb-2">Nenhuma obra salva nos favoritos.</h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                      Navegue pelo Feed e clique no ícone de favorito amarelo para salvar suas referências artísticas aqui.
                    </p>
                    <Link
                      to="/feed"
                      className="inline-block mt-5 bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-amber-500 transition-all shadow-md"
                    >
                      Explorar Feed
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {obrasSalvas.map((obra) => (
                      <Link
                        key={obra.id}
                        to={`/obra/${obra.id}`}
                        className="group bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col"
                      >
                        <div className="relative h-56 bg-gray-100 overflow-hidden">
                          <img
                            src={getMediaUrl(obra.arquivoUrl)}
                            alt={obra.legenda || "Obra Salva"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                            <i className="fa-solid fa-bookmark text-xs"></i>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-artPurple block mb-1">
                              {obra.categoria?.nomeCategoria || "Arte"}
                            </span>
                            <h3 className="font-editorial text-xl italic group-hover:text-amber-500 transition-colors line-clamp-1">
                              {obra.legenda || `Obra #${obra.id}`}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Por <strong>{obra.usuario?.nome || "Artista"}</strong>
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-gray-400 font-bold">
                            <span>Ver Detalhes</span>
                            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform text-artDark"></i>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de Apresentação / Edição de Portfólio & Certificados */}
      <ModalPortfolioApresentacao
        isOpen={modalPortfolioAberto}
        onClose={() => setModalPortfolioAberto(false)}
        perfil={perfil}
        isOwner={isOwner}
        onAtualizarPerfil={carregarPerfil}
      />

      {/* Modal de Compartilhamento de Perfil */}
      <ModalCompartilhar
        isOpen={modalCompartilharAberto}
        onClose={() => setModalCompartilharAberto(false)}
        titulo={perfil?.nome}
        onCopiarSucesso={mostrarAviso}
      />

      {/* Modal de Denúncia */}
      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        alvo={`Perfil de ${perfil?.nome || "Artista"}`}
        onSucesso={(msg) => mostrarAviso(msg)}
        onErro={(msg) => mostrarAviso(msg)}
      />

      {/* Modal de Conversão ao tentar interagir como visitante */}
      <ModalConversao
        isOpen={modalConversaoAberto}
        onClose={() => setModalConversaoAberto(false)}
        acao={acaoTentada}
      />
    </div>
  );
}