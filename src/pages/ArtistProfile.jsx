import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PortfolioCard from "../components/PortfolioCard";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";
import ModalConversao from "../components/ModalConversao";
import ModalPortfolioApresentacao from "../components/ModalPortfolioApresentacao";
import ModalCompartilhar from "../components/ModalCompartilhar";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, usuarioService, getMediaUrl } from "../services/api";
import { getAvatarLedStyle, desempacotarDadosObra } from "../utils/obraHelper";
import { renderTextWithEmojis } from "../utils/artfolioEmojis";

export default function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [modalConversaoAberto, setModalConversaoAberto] = useState(false);
  const [modalPortfolioAberto, setModalPortfolioAberto] = useState(false);
  const [modalCompartilharAberto, setModalCompartilharAberto] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");

  const [blockedUsers, setBlockedUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("artfolio_blocked_users")) || [];
    } catch {
      return [];
    }
  });

  const mostrarAviso = useCallback((msg) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(""), 4000);
  }, []);

  const [acaoTentada, setAcaoTentada] = useState("interagir");
  const [abaAtiva, setAbaAtiva] = useState("obras"); // "obras" | "favoritos"
  const [loading, setLoading] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Dados do perfil
  const [perfil, setPerfil] = useState(null);
  const [seguidoresCount, setSeguidoresCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [comissoesAbertas, setComissoesAbertas] = useState(true);
  const [salvandoComissao, setSalvandoComissao] = useState(false);

  // Obras do artista e Obras salvas
  const [obrasPublicas, setObrasPublicas] = useState([]);
  const [obrasSalvas, setObrasSalvas] = useState([]);
  const [carregandoSalvas, setCarregandoSalvas] = useState(false);

  const { user: authUser, isGuest, isAuthenticated } = useAuth();

  const handleToggleComissoes = async () => {
    if (!isOwner || salvandoComissao) return;
    setSalvandoComissao(true);
    try {
      const res = await usuarioService.alternarComissoes();
      const novoStatus = res.comissoes_abertas;
      setComissoesAbertas(novoStatus);
      setPerfil((prev) => (prev ? { ...prev, comissoes_abertas: novoStatus, comissoesAbertas: novoStatus } : prev));
      mostrarAviso(novoStatus ? "Comissões abertas para novos pedidos!" : "Comissões pausadas temporariamente.");
    } catch (err) {
      mostrarAviso(err.message || "Erro ao alternar status de comissões.");
    } finally {
      setSalvandoComissao(false);
    }
  };

  const carregarObrasSalvas = useCallback(async () => {
    setCarregandoSalvas(true);
    try {
      const salvas = await obrasService.listarSalvas();
      setObrasSalvas(Array.isArray(salvas) ? salvas : []);
    } catch {
      setObrasSalvas([]);
    } finally {
      setCarregandoSalvas(false);
    }
  }, []);

  const carregarPerfil = useCallback(async () => {
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
        setNaoEncontrado(false);
        dadosPerfil = await usuarioService.obterPerfil(targetId);
      } catch {
        if (isProprioPerfil && authUser) {
          dadosPerfil = authUser;
        } else {
          setNaoEncontrado(true);
          setPerfil(null);
          setObrasPublicas([]);
          setLoading(false);
          return;
        }
      }

      if (!dadosPerfil || !dadosPerfil.id) {
        setNaoEncontrado(true);
        setPerfil(null);
        setObrasPublicas([]);
        setLoading(false);
        return;
      }

      const souDono = !isGuest && (isProprioPerfil || dadosPerfil?.relacionamento?.isMe || (authUser && String(authUser.id) === String(dadosPerfil?.id)));
      setIsOwner(souDono);

      const localBadge = localStorage.getItem("artfolio_mostrar_badge_plano");
      const localLed = localStorage.getItem("artfolio_mostrar_moldura_led");
      const localCorLed = localStorage.getItem("artfolio_boost_led_color");

      const finalMostrarBadge = dadosPerfil.mostrar_badge_plano !== undefined
        ? dadosPerfil.mostrar_badge_plano
        : (souDono && localBadge !== null ? localBadge === "true" : true);

      const finalMostrarLed = dadosPerfil.mostrar_moldura_led !== undefined
        ? dadosPerfil.mostrar_moldura_led
        : (souDono && localLed !== null ? localLed === "true" : true);

      const planoAtual = (dadosPerfil.plano || "Free").toLowerCase();
      const isBoostPlan = planoAtual === "boost";
      const isPaidPlan = planoAtual === "pro" || planoAtual === "boost";

      const finalCorLed = isPaidPlan
        ? (dadosPerfil.cor_led_hex || dadosPerfil.cor_led || dadosPerfil.corLed || (souDono && localCorLed ? localCorLed : (isBoostPlan ? "#FF793F" : "#6C5CE7")))
        : "#00B894";
      const localBg = localStorage.getItem(`artfolio_boost_profile_bg_${dadosPerfil.id || targetId}`);
      const finalFundoPerfil = isBoostPlan
        ? (dadosPerfil.fundo_perfil || dadosPerfil.fundoPerfil || (localBg ? localBg : ""))
        : "";
      const localNickColor = localStorage.getItem(`artfolio_profile_nick_color_${dadosPerfil.id || targetId}`);
      const finalCorNome = isBoostPlan
        ? (dadosPerfil.cor_nome_hex || dadosPerfil.corNomeHex || (souDono && localNickColor ? localNickColor : ""))
        : "";

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
        plano: dadosPerfil.plano || "Free",
        corLed: finalCorLed,
        cor_led_hex: finalCorLed,
        corNomeHex: finalCorNome,
        cor_nome_hex: finalCorNome,
        fundoPerfil: finalFundoPerfil,
        fundo_perfil: finalFundoPerfil,
        mostrarMolduraLed: finalMostrarLed,
        mostrar_moldura_led: finalMostrarLed,
        mostrarBadgePlano: finalMostrarBadge,
        mostrar_badge_plano: finalMostrarBadge,
        mensagemCta: dadosPerfil.mensagem_cta || "",
        comissoes_abertas: dadosPerfil.comissoes_abertas !== undefined ? dadosPerfil.comissoes_abertas !== false : (dadosPerfil.comissoesAbertas !== undefined ? dadosPerfil.comissoesAbertas !== false : true),
        comissoesAbertas: dadosPerfil.comissoes_abertas !== undefined ? dadosPerfil.comissoes_abertas !== false : (dadosPerfil.comissoesAbertas !== undefined ? dadosPerfil.comissoesAbertas !== false : true),
        perfil_publico: dadosPerfil.perfil_publico !== undefined ? dadosPerfil.perfil_publico : true,
        perfilPublico: dadosPerfil.perfil_publico !== undefined ? dadosPerfil.perfil_publico : true,
        relacionamento: dadosPerfil.relacionamento || {},
      });

      const comissoesVal = dadosPerfil.comissoes_abertas !== undefined ? dadosPerfil.comissoes_abertas !== false : (dadosPerfil.comissoesAbertas !== undefined ? dadosPerfil.comissoesAbertas !== false : true);
      setComissoesAbertas(comissoesVal);

      setSeguidoresCount(Number(dadosPerfil.seguidoresCount || dadosPerfil.seguidores || 0));

      // Carregar obras do usuário
      try {
        const obras = await obrasService.listarObras({ usuario_id: targetId });
        if (Array.isArray(obras) && obras.length > 0) {
          setObrasPublicas(
            obras.map((obra) => {
              const dados = desempacotarDadosObra(obra);
              const imgUrl = obra.arquivoUrl || obra.imagem_url || obra.imagemUrl || obra.arquivo_url || "";
              return {
                ...obra,
                id: obra.id,
                titulo: dados.titulo || obra.titulo || `Obra #${obra.id}`,
                legenda: obra.legenda,
                descricao: dados.descricao,
                precoBase: dados.precoBase,
                marcaDagua: dados.marcaDagua,
                bloquearDownload: dados.bloquearDownload,
                bloquearPrint: dados.bloquearPrint,
                arquivoUrl: imgUrl,
                imagem_url: imgUrl,
                imagemUrl: imgUrl,
                destaque_boost: obra.destaque_boost || false,
                total_curtidas: obra.total_curtidas ?? obra.totalCurtidas ?? 0,
                totalCurtidas: obra.totalCurtidas ?? obra.total_curtidas ?? 0,
                total_comentarios: obra.total_comentarios ?? obra.totalComentarios ?? 0,
                totalComentarios: obra.totalComentarios ?? obra.total_comentarios ?? 0,
                total_salvos: obra.total_salvos ?? obra.totalSalvos ?? 0,
                totalSalvos: obra.totalSalvos ?? obra.total_salvos ?? 0,
                dataPostagem: obra.dataPostagem || obra.data_criacao,
                fixado: obra.fixado || false,
                fixado_em: obra.fixado_em,
              };
            })
          );
        } else {
          setObrasPublicas([]);
        }
      } catch {
        setObrasPublicas([]);
      }

      if (souDono) {
        carregarObrasSalvas();
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      mostrarAviso("Erro ao carregar dados do perfil.");
    } finally {
      setLoading(false);
    }
  }, [id, authUser, isGuest, mostrarAviso, carregarObrasSalvas]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  // Sincronização reativa em tempo real de seguidores via WebSocket
  useEffect(() => {
    const handleSync = (e) => {
      const dados = e.detail;
      if (!dados) return;

      const artistaId = id || perfil?.id || authUser?.id;
      if (dados.tipo === "SEGUIDOR" && Number(dados.seguido_id) === Number(artistaId)) {
        if (typeof dados.total_seguidores === "number") {
          setSeguidoresCount(dados.total_seguidores);
          setPerfil((prev) => (prev ? { ...prev, seguidores: dados.total_seguidores } : prev));
        }
      }
    };

    window.addEventListener("artfolio_sync", handleSync);
    const handleModerationSync = (e) => {
      const { obraId, usuarioId } = e.detail || {};
      const artistaId = id || perfil?.id || authUser?.id;
      if (usuarioId && Number(usuarioId) === Number(artistaId)) {
        setNaoEncontrado(true);
        setPerfil(null);
        setObrasPublicas([]);
        return;
      }
      if (obraId) {
        setObrasPublicas((prev) => prev.filter((o) => Number(o.id) !== Number(obraId)));
      }
    };
    window.addEventListener("artfolio_moderation_sync", handleModerationSync);
    return () => {
      window.removeEventListener("artfolio_sync", handleSync);
      window.removeEventListener("artfolio_moderation_sync", handleModerationSync);
    };
  }, [id, perfil?.id, authUser?.id]);

  // Sincronização imediata de preferências (cor LED e exibição de selo do plano)
  useEffect(() => {
    const handlePrefs = (e) => {
      if (isOwner && e.detail) {
        setPerfil((prev) =>
          prev
            ? {
                ...prev,
                corLed: e.detail.corLedHex || prev.corLed,
                cor_led_hex: e.detail.corLedHex || prev.cor_led_hex,
                corNomeHex: e.detail.corNomeHex !== undefined ? e.detail.corNomeHex : prev.corNomeHex,
                cor_nome_hex: e.detail.corNomeHex !== undefined ? e.detail.corNomeHex : prev.cor_nome_hex,
                fundoPerfil:
                  e.detail.fundoPerfil !== undefined
                    ? e.detail.fundoPerfil
                    : prev.fundoPerfil,
                fundo_perfil:
                  e.detail.fundoPerfil !== undefined
                    ? e.detail.fundoPerfil
                    : prev.fundo_perfil,
                mostrarBadgePlano:
                  e.detail.mostrarBadgePlano !== undefined
                    ? e.detail.mostrarBadgePlano
                    : prev.mostrarBadgePlano,
                mostrar_badge_plano:
                  e.detail.mostrarBadgePlano !== undefined
                    ? e.detail.mostrarBadgePlano
                    : prev.mostrar_badge_plano,
                mostrarMolduraLed:
                  e.detail.mostrarMolduraLed !== undefined
                    ? e.detail.mostrarMolduraLed
                    : prev.mostrarMolduraLed,
                mostrar_moldura_led:
                  e.detail.mostrarMolduraLed !== undefined
                    ? e.detail.mostrarMolduraLed
                    : prev.mostrar_moldura_led,
              }
            : prev
        );
      }
    };
    window.addEventListener("artfolio_profile_prefs_changed", handlePrefs);
    return () => window.removeEventListener("artfolio_profile_prefs_changed", handlePrefs);
  }, [isOwner]);

  const handleToggleFollow = async () => {
    if (isGuest || !isAuthenticated) {
      setAcaoTentada("seguir este artista");
      setModalConversaoAberto(true);
      return;
    }

    if (!perfil || !perfil.id) return;
    try {
      const estaSeguindo = Boolean(perfil.relacionamento?.seguindo);
      const res = estaSeguindo
        ? await usuarioService.deixarDeSeguir(perfil.id)
        : await usuarioService.seguir(perfil.id);

      const novoTotal =
        typeof res?.total_seguidores === "number"
          ? res.total_seguidores
          : estaSeguindo
          ? Math.max(0, (seguidoresCount || perfil.seguidores || 1) - 1)
          : (seguidoresCount || perfil.seguidores || 0) + 1;

      const novoSeguindo =
        typeof res?.seguindo === "boolean"
          ? res.seguindo
          : !estaSeguindo;

      setSeguidoresCount(novoTotal);
      setPerfil((prev) => ({
        ...prev,
        seguidores: novoTotal,
        relacionamento: {
          ...prev.relacionamento,
          seguindo: novoSeguindo,
        },
      }));

      if (novoSeguindo) {
        mostrarAviso(`Você começou a seguir ${perfil.nome || "o artista"}!`);
      } else {
        mostrarAviso(`Você deixou de seguir ${perfil.nome || "o artista"}.`);
      }
    } catch (err) {
      console.error("Erro ao alterar relacionamento de seguir:", err);
      mostrarAviso(err.message || "Erro ao alterar seguidor.");
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

  const isBlocked = perfil?.id ? blockedUsers.includes(perfil.id) : false;

  const handleToggleBlockUser = () => {
    if (isGuest || !isAuthenticated) {
      handleAcaoRestritaVisitante("bloquear este usuário");
      return;
    }
    if (!perfil?.id) return;
    let novos;
    if (isBlocked) {
      novos = blockedUsers.filter((blockedId) => blockedId !== perfil.id);
      mostrarAviso(`${perfil.nome} foi desbloqueado com sucesso.`);
    } else {
      novos = [...blockedUsers, perfil.id];
      mostrarAviso(`${perfil.nome} foi bloqueado com sucesso.`);
    }
    setBlockedUsers(novos);
    localStorage.setItem("artfolio_blocked_users", JSON.stringify(novos));
  };

  const handleAbrirChatCTA = () => {
    if (isGuest || !isAuthenticated) {
      handleAcaoRestritaVisitante("pedir orçamento a este artista");
      return;
    }
    const remetenteNome = authUser?.nome || "Cliente";
    const msgImutavel = `Olá! Me chamo ${remetenteNome}, gostaria de solicitar um orçamento para o seu trabalho. Obrigado!`;
    navigate(
      `/mensagens?artistaId=${perfil.id}&destNome=${encodeURIComponent(
        perfil.nome || "Artista"
      )}&destFoto=${encodeURIComponent(perfil.avatar || "")}&msg=${encodeURIComponent(
        msgImutavel
      )}`
    );
  };

  const handleToggleFixarObra = async (obraId) => {
    try {
      const res = await obrasService.alternarFixar(obraId);
      mostrarAviso(
        res.fixado
          ? "Obra fixada no topo do seu perfil com sucesso!"
          : "Obra desafixada do topo do perfil."
      );
      // Recarrega as obras para sincronizar a ordenação LIFO oficial do backend
      const targetId = id || authUser?.id;
      if (targetId) {
        const obras = await obrasService.listarObras({ usuario_id: targetId });
        if (Array.isArray(obras)) {
          setObrasPublicas(
            obras.map((obra) => {
              const dados = desempacotarDadosObra(obra);
              const imgUrl = obra.arquivoUrl || obra.imagem_url || obra.imagemUrl || obra.arquivo_url || "";
              return {
                ...obra,
                id: obra.id,
                titulo: dados.titulo || obra.titulo || `Obra #${obra.id}`,
                legenda: obra.legenda,
                descricao: dados.descricao,
                precoBase: dados.precoBase,
                marcaDagua: dados.marcaDagua,
                bloquearDownload: dados.bloquearDownload,
                bloquearPrint: dados.bloquearPrint,
                arquivoUrl: imgUrl,
                imagem_url: imgUrl,
                imagemUrl: imgUrl,
                destaque_boost: obra.destaque_boost || false,
                total_curtidas: obra.total_curtidas ?? obra.totalCurtidas ?? 0,
                totalCurtidas: obra.totalCurtidas ?? obra.total_curtidas ?? 0,
                total_comentarios: obra.total_comentarios ?? obra.totalComentarios ?? 0,
                totalComentarios: obra.totalComentarios ?? obra.total_comentarios ?? 0,
                total_salvos: obra.total_salvos ?? obra.totalSalvos ?? 0,
                totalSalvos: obra.totalSalvos ?? obra.total_salvos ?? 0,
                dataPostagem: obra.dataPostagem || obra.data_criacao,
                fixado: obra.fixado || false,
                fixado_em: obra.fixado_em,
              };
            })
          );
        }
      }
    } catch (err) {
      mostrarAviso(err.message || "Não foi possível alterar a fixação da obra.");
    }
  };

  // Se o visitante acessou /perfil (sem ID de artista)
  if (isGuest && !id) {
    return (
      <div className="w-full text-artDark antialiased min-h-screen font-sans">
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-10 flex items-center justify-center">
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
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full text-artDark antialiased min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (naoEncontrado || !perfil) {
    return (
      <div className="w-full min-h-screen bg-[#F9F8F6] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 text-center shadow-xl border border-black/5 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fa-solid fa-user-slash"></i>
          </div>
          <span className="inline-block bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Erro 404 • Usuário Indisponível
          </span>
          <h2 className="font-editorial text-3xl italic font-bold text-artDark mb-2">
            Perfil não encontrado
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">
            O perfil solicitado não existe mais, foi excluído ou teve a conta banida pela moderação da plataforma.
          </p>
          <Link
            to="/feed"
            className="inline-block bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-artOrange transition-all shadow-md"
          >
            ← Voltar para o Feed
          </Link>
        </div>
      </div>
    );
  }

  // Se o perfil for privado e quem estiver acessando não for o próprio dono
  if (perfil.perfil_publico === false && !isOwner) {
    return (
      <div className="w-full min-h-screen bg-[#F9F8F6] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 text-center shadow-xl border border-black/5 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-artPurple/10 text-artPurple flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 className="font-editorial text-3xl italic font-bold text-artDark mb-2">
            {perfil.nome || "Artista"}
          </h2>
          <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            🔒 Perfil Privado
          </span>
          <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">
            Este criador configurou sua conta como uma <strong>galeria pessoal privada</strong>. Suas obras, biografia e histórico artístico estão visíveis apenas para o próprio artista.
          </p>
          <Link
            to="/feed"
            className="inline-block bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-artOrange transition-all shadow-md"
          >
            ← Voltar para o Feed
          </Link>
        </div>
      </div>
    );
  }

  const nomeParts = (perfil.nome || "Artista").trim().split(" ");
  const primeiroNome = nomeParts[0];
  const sobrenome = nomeParts.slice(1).join(" ");
  const ledInfo = getAvatarLedStyle(perfil, isOwner);

  const isProOuBoost = ["boost", "pro"].includes((perfil.plano || "").toLowerCase());
  const temFundoPersonalizado = isProOuBoost && Boolean(perfil.fundoPerfil);

  const estiloFundoGeral = temFundoPersonalizado
    ? perfil.fundoPerfil.startsWith("http") || perfil.fundoPerfil.startsWith("data:") || perfil.fundoPerfil.startsWith("/")
      ? {
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.78), rgba(255,255,255,0.96)), url(${getMediaUrl(perfil.fundoPerfil)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }
      : { background: perfil.fundoPerfil }
    : {};

  return (
    <div
      className={`w-full min-h-screen transition-all duration-500 ${!temFundoPersonalizado ? "bg-white" : ""}`}
      style={estiloFundoGeral}
    >
      {/* Banner Alerta de Mensagem */}
        {noticeMessage && (
          <div className="fixed top-5 right-5 z-50 bg-artDark text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-fadeIn">
            <i className="fa-solid fa-check-circle text-artOrange mr-2"></i>
            {noticeMessage}
          </div>
        )}

        <section
          className={`border-b border-black/5 px-4 sm:px-6 lg:px-10 py-7 relative transition-all duration-500 ${
            !temFundoPersonalizado ? "bg-white" : ""
          }`}
        >
          {/* Banner de Aviso de Perfil Privado para o Dono */}
          {perfil.perfil_publico === false && isOwner && (
            <div className="max-w-6xl mx-auto mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm shrink-0">
                  <i className="fa-solid fa-eye-slash"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Modo Galeria Pessoal Ativo (Perfil Privado)</h4>
                  <p className="text-[11px] text-amber-800 font-light">
                    Suas obras e perfil estão visíveis somente para você. Para torná-los visíveis para a comunidade no feed e busca, ative em Configurações.
                  </p>
                </div>
              </div>
              <Link
                to="/configuracoes"
                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-4 py-2 rounded-full transition-all shadow-xs"
              >
                Gerenciar Privacidade
              </Link>
            </div>
          )}

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-2 flex justify-center lg:justify-start">
                <div className="relative group w-fit">
                  {/* Aura Difusa LED Neon Vibrante Espalhada ao Redor do Perfil */}
                  {ledInfo.ativo && (
                    <div
                      className={`absolute -inset-2.5 sm:-inset-3 rounded-[2.5rem] blur-xl opacity-80 animate-pulse -z-10 transition-all duration-700 pointer-events-none ${ledInfo.className}`}
                      style={{ background: ledInfo.cor || (ledInfo.style?.borderColor || '#FF793F') }}
                    />
                  )}

                  {/* Moldura LED Neon Intensa e Brilhante Baseada no Plano */}
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 bg-gray-100 relative ${ledInfo.className}`}
                    style={ledInfo.style}
                  >
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

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                  <h1
                    className="font-editorial text-4xl sm:text-5xl lg:text-5xl leading-none transition-colors duration-300"
                    style={{ color: perfil.corNomeHex || perfil.cor_nome_hex || undefined }}
                  >
                    {primeiroNome} {sobrenome && <span className="italic">{sobrenome}</span>}
                  </h1>

                  {/* Subtítulo / Tag Sólida do Plano ao lado do Nome (Sincronizado com o toggle de exibir badge do plano) */}
                  {perfil.mostrarBadgePlano !== false && perfil.mostrar_badge_plano !== false && (
                    <>
                      {(perfil.plano || "").toLowerCase() === "boost" && (
                        <span
                          className="text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5"
                          style={{
                            backgroundColor: ledInfo.cor || perfil.corLed || "#FF793F",
                            boxShadow: `0 4px 14px ${(ledInfo.cor || perfil.corLed || "#FF793F")}55`,
                          }}
                        >
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                          Boost
                        </span>
                      )}
                      {(perfil.plano || "").toLowerCase() === "pro" && (
                        <span className="bg-artPurple text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md shadow-artPurple/30 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                          Pro
                        </span>
                      )}
                      {((perfil.plano || "").toLowerCase() === "free" || !perfil.plano) && (
                        <span className="bg-artGreen text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md shadow-artGreen/30 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white"></span>
                          Free
                        </span>
                      )}
                    </>
                  )}

                  {/* Badge de Comissões (Quick Toggle interativo para o dono / Informativo para visitantes) */}
                  {comissoesAbertas ? (
                    <button
                      type="button"
                      onClick={isOwner ? handleToggleComissoes : undefined}
                      disabled={!isOwner || salvandoComissao}
                      title={isOwner ? "Clique para pausar/fechar encomendas" : "Este artista está aceitando novos pedidos de encomenda"}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 transition-all duration-300 ${
                        isOwner ? "cursor-pointer hover:bg-emerald-500/20 active:scale-95 hover:border-emerald-500/50 shadow-2xs" : "cursor-default"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-artGreen animate-pulse"></span>
                      <span>Comissões Abertas</span>
                      {isOwner && (
                        <i className={`fa-solid ${salvandoComissao ? "fa-spinner fa-spin" : "fa-arrows-rotate"} text-[8px] opacity-60 ml-0.5`}></i>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={isOwner ? handleToggleComissoes : undefined}
                      disabled={!isOwner || salvandoComissao}
                      title={isOwner ? "Clique para abrir encomendas" : "Este artista pausou encomendas no momento"}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/5 text-gray-500 border border-black/10 transition-all duration-300 ${
                        isOwner ? "cursor-pointer hover:bg-black/10 active:scale-95 hover:border-black/20 hover:text-gray-700 shadow-2xs" : "cursor-default"
                      }`}
                    >
                      <i className="fa-solid fa-lock text-[9px] text-gray-400"></i>
                      <span>Comissões Fechadas</span>
                      {isOwner && (
                        <i className={`fa-solid ${salvandoComissao ? "fa-spinner fa-spin" : "fa-arrows-rotate"} text-[8px] opacity-60 ml-0.5`}></i>
                      )}
                    </button>
                  )}
                </div>

                {perfil.biografia && (
                  <p className="max-w-2xl mx-auto lg:mx-0 text-gray-500 leading-relaxed text-sm font-light">
                    {renderTextWithEmojis(perfil.biografia)}
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
                      {seguidoresCount}
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
                  <div>
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
                        isBloqueado={isBlocked}
                        onBloquear={handleToggleBlockUser}
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

                    {/* Botão CTA de Negociação / Orçamento */}
                    <button
                      type="button"
                      onClick={handleAbrirChatCTA}
                      className="w-full mt-2.5 bg-gradient-to-r from-artPurple via-indigo-600 to-artOrange text-white py-2.5 px-4 rounded-full text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-artPurple/20 flex items-center justify-center gap-2 active:scale-95"
                      title="Iniciar negociação de encomenda diretamente no chat"
                    >
                      <i className="fa-solid fa-handshake"></i>
                      Pedir Orçamento
                    </button>
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

            {perfil.portfolio && (
              <a
                href={perfil.portfolio.startsWith("http") || perfil.portfolio.startsWith("/") ? getMediaUrl(perfil.portfolio) : `https://${perfil.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-artOrange transition-colors bg-[#F9F8F6] border border-black/5 px-4 py-2 rounded-full"
              >
                <i className="fa-solid fa-link text-sm text-artOrange"></i>
                <span>Portfólio Externo</span>
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
                    <h2
                      className="font-editorial text-3xl italic transition-colors duration-300"
                      style={{ color: perfil.corNomeHex || perfil.cor_nome_hex || undefined }}
                    >
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
                      <PortfolioCard
                        key={obra.id}
                        obra={obra}
                        isOwner={isOwner}
                        onToggleFixar={handleToggleFixarObra}
                        fixado={obra.fixado}
                      />
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
                    <h2
                      className="font-editorial text-3xl italic transition-colors duration-300"
                      style={{ color: perfil.corNomeHex || perfil.cor_nome_hex || undefined }}
                    >
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