import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PortfolioCard from "../components/PortfolioCard";
import Sidebar from "../components/Sidebar";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import { authService, obrasService, getUser, getToken } from "../services/api";

const filtros = ["Todas", "Digital", "Físico", "3D"];

export default function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [filtroAtual, setFiltroAtual] = useState("Todas");
  const [loading, setLoading] = useState(true);

  // Dados do perfil
  const [perfil, setPerfil] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Obras do artista
  const [obrasPublicas, setObrasPublicas] = useState([]);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (!getToken()) {
        navigate("/login");
        return;
      }

      try {
        // Se não tem ID na URL, é o perfil do próprio usuário
        if (!id) {
          const usuario = await authService.getMe();
          setPerfil({
            nome: usuario.nome || "",
            biografia: usuario.biografia || "",
            email: usuario.email || "",
            tipoConta: usuario.tipo_conta || "cliente",
            avatar: usuario.fotoPerfil || "",
            instagram: usuario.instagram || "",
            behance: usuario.behance || "",
            website: usuario.website || "",
            portfolio: usuario.portfolio || "",
            telefone: usuario.telefone || "",
            // Dados que serão integrados futuramente
            seguidores: "0",
            seguindo: 0,
            obras: 0,
            visualizacoes: "0",
            curtidas: 0,
            encomendas: 0,
            plano: "FREE",
            categoria: usuario.tipo_conta === "artista" ? "Artista" : "Cliente",
            categoriaResumo: usuario.tipo_conta === "artista" ? "Artista" : "Cliente",
          });
          setIsOwner(true);

          // Carregar obras do usuário
          try {
            const obras = await obrasService.listarObras({ usuario_id: usuario.id });
            setObrasPublicas(
              obras.map((obra) => ({
                id: obra.id,
                image: obra.arquivoUrl || obra.arquivo_url || "",
                category: obra.categoria?.nome || "Sem categoria",
                title: obra.legenda || "Sem título",
                color: "text-artOrange",
                tipo: "Digital",
              }))
            );
            // Atualizar contagem de obras
            setPerfil((prev) => prev ? { ...prev, obras: obras.length } : prev);
          } catch {
            // Sem obras ainda — não é erro
          }
        } else {
          // Perfil de outro artista — usa dados do localStorage para comparar
          const usuarioLogado = getUser();
          const isMe = usuarioLogado && String(usuarioLogado.id) === String(id);

          if (isMe) {
            const usuario = await authService.getMe();
            setPerfil({
              nome: usuario.nome || "",
              biografia: usuario.biografia || "",
              email: usuario.email || "",
              tipoConta: usuario.tipo_conta || "cliente",
              avatar: usuario.fotoPerfil || "",
              instagram: usuario.instagram || "",
              behance: usuario.behance || "",
              website: usuario.website || "",
              portfolio: usuario.portfolio || "",
              telefone: usuario.telefone || "",
              seguidores: "0",
              seguindo: 0,
              obras: 0,
              visualizacoes: "0",
              curtidas: 0,
              encomendas: 0,
              plano: "FREE",
              categoria: usuario.tipo_conta === "artista" ? "Artista" : "Cliente",
              categoriaResumo: usuario.tipo_conta === "artista" ? "Artista" : "Cliente",
            });
            setIsOwner(true);

            try {
              const obras = await obrasService.listarObras({ usuario_id: usuario.id });
              setObrasPublicas(
                obras.map((obra) => ({
                  id: obra.id,
                  image: obra.arquivoUrl || obra.arquivo_url || "",
                  category: obra.categoria?.nome || "Sem categoria",
                  title: obra.legenda || "Sem título",
                  color: "text-artOrange",
                  tipo: "Digital",
                }))
              );
              setPerfil((prev) => prev ? { ...prev, obras: obras.length } : prev);
            } catch {
              // Sem obras
            }
          } else {
            // Perfil de outro usuário — dados limitados disponíveis
            // Futuramente terá um endpoint GET /usuarios/:id
            setPerfil({
              nome: "Artista",
              biografia: "",
              email: "",
              tipoConta: "artista",
              avatar: "",
              instagram: "",
              behance: "",
              website: "",
              portfolio: "",
              telefone: "",
              seguidores: "0",
              seguindo: 0,
              obras: 0,
              visualizacoes: "0",
              curtidas: 0,
              encomendas: 0,
              plano: "FREE",
              categoria: "Artista",
              categoriaResumo: "Artista",
            });
            setIsOwner(false);

            try {
              const obras = await obrasService.listarObras({ usuario_id: id });
              setObrasPublicas(
                obras.map((obra) => ({
                  id: obra.id,
                  image: obra.arquivoUrl || obra.arquivo_url || "",
                  category: obra.categoria?.nome || "Sem categoria",
                  title: obra.legenda || "Sem título",
                  color: "text-artOrange",
                  tipo: "Digital",
                }))
              );
            } catch {
              // Sem obras
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [id, navigate]);

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

  const primeiroNome = perfil.nome.split(" ")[0];
  const sobrenome = perfil.nome.split(" ").slice(1).join(" ");

  const obrasFiltradas = obrasPublicas.filter((obra) => {
    if (filtroAtual === "Todas") return true;
    return obra.tipo === filtroAtual;
  });

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen">
        <section className="bg-white border-b border-black/5 px-4 sm:px-6 lg:px-10 py-7">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-2 flex justify-center lg:justify-start">
                <div className="relative group w-fit">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-gray-100">
                    {perfil.avatar ? (
                      <img
                        src={perfil.avatar}
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
                    {perfil.tipoConta === "artista" ? "Artista Verificado" : "Perfil Artfolio"}
                  </span>

                  <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                    Perfil Aprovado
                  </span>
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-5xl leading-none mb-3">
                  {primeiroNome} <span className="italic">{sobrenome || "."}</span>
                </h1>

                {perfil.biografia && (
                  <p className="max-w-2xl mx-auto lg:mx-0 text-gray-500 leading-relaxed text-sm font-light">
                    {perfil.biografia}
                  </p>
                )}

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                  <span className="bg-artPurple/10 text-artPurple px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {perfil.categoria}
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

              <div className="lg:col-span-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Link
                    to="/seguidores"
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
                    to={isOwner ? "/meu-portfolio" : "/perfil"}
                    className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all text-center lg:text-left"
                  >
                    <span className="text-artDark text-xl font-black block">
                      {perfil.obras}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      Obras
                    </span>
                  </Link>

                  {isOwner ? (
                    <Link
                      to="/planos"
                      className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all text-center lg:text-left"
                    >
                      <span className="text-artDark text-xl font-black block uppercase">
                        {perfil.plano}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                        Plano
                      </span>
                    </Link>
                  ) : (
                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3 border border-black/5 text-center lg:text-left">
                      <span className="text-artDark text-xl font-black block">
                        {perfil.categoriaResumo}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                        Categoria
                      </span>
                    </div>
                  )}
                </div>

                {isOwner ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2">
                    <Link
                      to="/editar-perfil"
                      className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all text-center"
                    >
                      <i className="fa-solid fa-pen mr-2"></i>
                      Editar Perfil
                    </Link>

                    <Link
                      to="/meu-portfolio"
                      className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                    >
                      <i className="fa-solid fa-layer-group mr-2"></i>
                      Gerenciar
                    </Link>

                    <Link
                      to="/criar-obra"
                      className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue hover:text-white transition-all text-center"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Nova Obra
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
                    <button
                      type="button"
                      className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
                    >
                      <i className="fa-solid fa-user-plus mr-2"></i>
                      Seguir
                    </button>

                    <Link
                      to="/mensagens"
                      className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue hover:text-white transition-all text-center"
                    >
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Mensagem
                    </Link>

                    <Link
                      to="/encomendas"
                      className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange hover:text-white transition-all text-center"
                    >
                      <i className="fa-solid fa-bag-shopping mr-2"></i>
                      Solicitar Encomenda
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

        <section className="px-4 sm:px-6 lg:px-10 py-6 bg-[#F9F8F6]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-5">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h3 className="font-editorial text-2xl italic mb-4">Sobre</h3>

                <div className="space-y-3 text-sm">
                  {perfil.email && (
                    <div className="flex items-center gap-3 text-gray-500 break-all">
                      <i className="fa-solid fa-envelope text-artDark w-4 shrink-0"></i>
                      {perfil.email}
                    </div>
                  )}

                  {perfil.telefone && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <i className="fa-solid fa-phone text-artBlue w-4 shrink-0"></i>
                      {perfil.telefone}
                    </div>
                  )}

                  {perfil.instagram && (
                    <a
                      href={`https://instagram.com/${perfil.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-500 hover:text-artPurple transition-colors"
                    >
                      <i className="fa-brands fa-instagram text-artPurple w-4 shrink-0"></i>
                      @{perfil.instagram}
                    </a>
                  )}

                  {perfil.behance && (
                    <a
                      href={`https://behance.net/${perfil.behance}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-500 hover:text-artBlue transition-colors"
                    >
                      <i className="fa-brands fa-behance text-artBlue w-4 shrink-0"></i>
                      {perfil.behance}
                    </a>
                  )}

                  {perfil.website && (
                    <a
                      href={perfil.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-500 hover:text-artOrange transition-colors break-all"
                    >
                      <i className="fa-solid fa-link text-artOrange w-4 shrink-0"></i>
                      {perfil.website}
                    </a>
                  )}

                  {perfil.portfolio && (
                    <a
                      href={perfil.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-500 hover:text-artOrange transition-colors break-all"
                    >
                      <i className="fa-solid fa-briefcase text-artOrange w-4 shrink-0"></i>
                      {perfil.portfolio}
                    </a>
                  )}
                </div>
              </div>

              {isOwner ? (
                <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden">
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                    Plano {perfil.plano}
                  </span>

                  <h3 className="font-editorial text-2xl italic leading-tight">
                    {perfil.plano === "PRO"
                      ? "Perfil com prioridade no feed."
                      : "Perfil básico gratuito."}
                  </h3>

                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Faça upgrade para destacar seu portfólio e acessar recursos extras.
                  </p>

                  <Link
                    to="/planos"
                    className="inline-block mt-4 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all relative z-10"
                  >
                    Ver Plano
                  </Link>

                  <i className="fa-solid fa-crown absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
                </div>
              ) : (
                <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden">
                  <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
                    Encomendas
                  </span>

                  <h3 className="font-editorial text-2xl italic leading-tight">
                    Disponível para artes personalizadas.
                  </h3>

                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Entre em contato com o artista para conversar sobre uma obra,
                    orçamento ou projeto personalizado.
                  </p>

                  <Link
                    to="/encomendas"
                    className="inline-block mt-4 bg-white text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange hover:text-white transition-all relative z-10"
                  >
                    Solicitar Encomenda
                  </Link>

                  <i className="fa-solid fa-palette absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
                </div>
              )}

              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h3 className="font-editorial text-2xl italic mb-4">
                  Destaques
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Visualizações</span>
                    <strong>{perfil.visualizacoes}</strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Curtidas</span>
                    <strong>{perfil.curtidas}</strong>
                  </div>

                  {isOwner ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Encomendas</span>
                      <strong>{perfil.encomendas}</strong>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Obras públicas</span>
                      <strong>{obrasPublicas.length}</strong>
                    </div>
                  )}
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
                    <span className="text-xs font-black">
                      {perfil.seguidores}
                    </span>
                  </Link>

                  <Link
                    to="/seguindo"
                    className="flex items-center justify-between bg-[#F9F8F6] rounded-[1.2rem] px-4 py-3 hover:bg-artDark hover:text-white transition-all"
                  >
                    <span className="text-sm font-bold">
                      <i className="fa-solid fa-user-check mr-2"></i>
                      Seguindo
                    </span>
                    <span className="text-xs font-black">
                      {perfil.seguindo}
                    </span>
                  </Link>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-9">
              <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Galeria Pública
                    </span>

                    <h3 className="font-editorial text-3xl italic">
                      Portfólio Profissional
                    </h3>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2 text-[10px] font-bold uppercase tracking-widest">
                    {filtros.map((filtro) => (
                      <button
                        key={filtro}
                        type="button"
                        onClick={() => setFiltroAtual(filtro)}
                        className={`whitespace-nowrap border-b-2 pb-1 transition-colors ${
                          filtroAtual === filtro
                            ? "text-artDark border-artDark"
                            : "text-gray-400 border-transparent hover:text-artDark"
                        }`}
                      >
                        {filtro}
                      </button>
                    ))}
                  </div>
                </div>

                {obrasFiltradas.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-[1.7rem] p-8 border border-black/5 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white mx-auto flex items-center justify-center text-gray-300 mb-4">
                      <i className="fa-regular fa-folder-open text-xl"></i>
                    </div>

                    <h4 className="font-bold text-lg">
                      Nenhuma obra encontrada
                    </h4>

                    <p className="text-sm text-gray-500 mt-2">
                      {isOwner
                        ? "Você ainda não publicou nenhuma obra. Comece criando sua primeira!"
                        : "Não há obras públicas neste filtro no momento."}
                    </p>

                    {isOwner && (
                      <Link
                        to="/criar-obra"
                        className="inline-flex items-center mt-4 bg-artDark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
                      >
                        <i className="fa-solid fa-plus mr-2"></i>
                        Criar Obra
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="columns-1 md:columns-2 xl:columns-3 gap-5 space-y-5">
                    {obrasFiltradas.map((obra) => (
                      <PortfolioCard
                        key={obra.id}
                        image={obra.image}
                        category={obra.category}
                        title={obra.title}
                        color={obra.color}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        tipo="perfil"
        alvo={perfil.nome}
      />
    </div>
  );
}