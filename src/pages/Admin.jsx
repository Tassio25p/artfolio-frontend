import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { adminService, getMediaUrl } from "../services/api";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();

  // Permissões
  const papel = (user?.papel || user?.tipo_conta || "").toLowerCase();
  const isAuthorized = papel === "admin" || papel === "moderador";
  const isAdmin = papel === "admin";

  // Estados principais
  const [areaAtual, setAreaAtual] = useState("geral");
  const [metricas, setMetricas] = useState({
    obras_pendentes: 0,
    denuncias_abertas: 0,
    usuarios_sinalizados: 0,
    logs_recentes: 0,
  });
  const [loadingMetricas, setLoadingMetricas] = useState(false);

  // Estados de dados
  const [obrasQuarentena, setObrasQuarentena] = useState([]);
  const [loadingObras, setLoadingObras] = useState(false);

  const [denunciasChat, setDenunciasChat] = useState([]);
  const [loadingDenuncias, setLoadingDenuncias] = useState(false);
  const [filtroStatusDenuncia, setFiltroStatusDenuncia] = useState("");

  const [usuariosSinalizados, setUsuariosSinalizados] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const [logsAuditoria, setLogsAuditoria] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Feedback e Notificação
  const [aviso, setAviso] = useState(null); // { tipo: "sucesso" | "erro", mensagem: string }

  // Modais
  const [obraParaRejeitar, setObraParaRejeitar] = useState(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [processandoRejeicao, setProcessandoRejeicao] = useState(false);

  const [obraParaVisualizar, setObraParaVisualizar] = useState(null);

  // Modal Auditoria de Chat
  const [chatAuditModal, setChatAuditModal] = useState(null); // dados de auditoria
  const [loadingAuditChat, setLoadingAuditChat] = useState(false);

  // Modal Sanção de Usuário
  const [usuarioParaSancao, setUsuarioParaSancao] = useState(null);
  const [tipoSancao, setTipoSancao] = useState("advertir"); // advertir, suspender, banir
  const [diasSuspensao, setDiasSuspensao] = useState(7);
  const [motivoSancao, setMotivoSancao] = useState("");
  const [processandoSancao, setProcessandoSancao] = useState(false);

  // Modal Resolver/Descartar Denúncia
  const [denunciaParaResolver, setDenunciaParaResolver] = useState(null);
  const [statusResolucao, setStatusResolucao] = useState("resolvida");
  const [notaModerador, setNotaModerador] = useState("");
  const [processandoResolucao, setProcessandoResolucao] = useState(false);

  const mostrarAviso = useCallback((mensagem, tipo = "sucesso") => {
    setAviso({ mensagem, tipo });
    setTimeout(() => setAviso(null), 5000);
  }, []);

  // Carregar métricas
  const carregarMetricas = useCallback(async () => {
    try {
      setLoadingMetricas(true);
      const res = await adminService.obterMetricas();
      if (res) {
        setMetricas({
          obras_pendentes: res.obras_pendentes || 0,
          denuncias_abertas: res.denuncias_abertas || 0,
          usuarios_sinalizados: res.usuarios_sinalizados || 0,
          logs_recentes: res.logs_recentes || 0,
        });
      }
    } catch (err) {
      console.warn("Não foi possível obter métricas em tempo real:", err);
    } finally {
      setLoadingMetricas(false);
    }
  }, []);

  // Carregar obras em quarentena
  const carregarObras = useCallback(async () => {
    try {
      setLoadingObras(true);
      const res = await adminService.listarObrasQuarentena();
      setObrasQuarentena(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn("Erro ao listar quarentena:", err);
    } finally {
      setLoadingObras(false);
    }
  }, []);

  // Carregar denúncias de chat
  const carregarDenuncias = useCallback(async (status = "") => {
    try {
      setLoadingDenuncias(true);
      const res = await adminService.listarDenunciasChat(status);
      setDenunciasChat(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn("Erro ao listar denúncias:", err);
    } finally {
      setLoadingDenuncias(false);
    }
  }, []);

  // Carregar usuários sinalizados
  const carregarUsuarios = useCallback(async () => {
    try {
      setLoadingUsuarios(true);
      const res = await adminService.listarUsuariosSinalizados();
      setUsuariosSinalizados(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn("Erro ao listar usuários sinalizados:", err);
    } finally {
      setLoadingUsuarios(false);
    }
  }, []);

  // Carregar logs de auditoria
  const carregarLogs = useCallback(async () => {
    try {
      setLoadingLogs(true);
      const res = await adminService.listarLogs(50, 0);
      setLogsAuditoria(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn("Erro ao listar logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  // Carregar dados conforme área ativa
  useEffect(() => {
    if (!isAuthorized) return;
    carregarMetricas();

    if (areaAtual === "geral") {
      carregarObras();
      carregarDenuncias();
      carregarUsuarios();
      carregarLogs();
    } else if (areaAtual === "quarentena") {
      carregarObras();
    } else if (areaAtual === "denuncias") {
      carregarDenuncias(filtroStatusDenuncia);
    } else if (areaAtual === "usuarios") {
      carregarUsuarios();
    } else if (areaAtual === "logs") {
      carregarLogs();
    }
  }, [
    isAuthorized,
    areaAtual,
    filtroStatusDenuncia,
    carregarMetricas,
    carregarObras,
    carregarDenuncias,
    carregarUsuarios,
    carregarLogs,
  ]);

  // Ações de Quarentena
  const handleAprovarObra = async (obraId) => {
    try {
      await adminService.julgarObra(obraId, { acao: "aprovar" });
      setObrasQuarentena((prev) => prev.filter((o) => o.id !== obraId));
      setMetricas((prev) => ({
        ...prev,
        obras_pendentes: Math.max(0, prev.obras_pendentes - 1),
        logs_recentes: prev.logs_recentes + 1,
      }));
      mostrarAviso(`Obra #${obraId} aprovada e publicada no feed com sucesso!`);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao aprovar obra.", "erro");
    }
  };

  const handleConfirmarRejeicao = async () => {
    if (!obraParaRejeitar) return;
    try {
      setProcessandoRejeicao(true);
      await adminService.julgarObra(obraParaRejeitar.id, {
        acao: "rejeitar",
        motivo: motivoRejeicao.trim() || "Violação das diretrizes da comunidade",
      });
      setObrasQuarentena((prev) => prev.filter((o) => o.id !== obraParaRejeitar.id));
      setMetricas((prev) => ({
        ...prev,
        obras_pendentes: Math.max(0, prev.obras_pendentes - 1),
        logs_recentes: prev.logs_recentes + 1,
      }));
      mostrarAviso(`Obra #${obraParaRejeitar.id} rejeitada. Notificação formal enviada ao artista.`);
      setObraParaRejeitar(null);
      setMotivoRejeicao("");
    } catch (err) {
      mostrarAviso(err.message || "Erro ao rejeitar obra.", "erro");
    } finally {
      setProcessandoRejeicao(false);
    }
  };

  // Ações de Auditoria de Chat
  const handleAbrirAuditoria = async (denunciaId) => {
    try {
      setLoadingAuditChat(true);
      const res = await adminService.auditarChat(denunciaId);
      setChatAuditModal(res);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao carregar histórico de auditoria do chat.", "erro");
    } finally {
      setLoadingAuditChat(false);
    }
  };

  // Resolução de Denúncia
  const handleConfirmarResolucao = async () => {
    if (!denunciaParaResolver) return;
    try {
      setProcessandoResolucao(true);
      await adminService.atualizarDenuncia(denunciaParaResolver.id, {
        status: statusResolucao,
        nota_moderador: notaModerador.trim() || null,
      });

      // Atualiza lista local
      setDenunciasChat((prev) =>
        prev.map((d) =>
          d.id === denunciaParaResolver.id
            ? { ...d, status: statusResolucao, nota_moderador: notaModerador }
            : d
        )
      );

      if (statusResolucao === "resolvida") {
        setMetricas((prev) => ({
          ...prev,
          denuncias_abertas: Math.max(0, prev.denuncias_abertas - 1),
          logs_recentes: prev.logs_recentes + 1,
        }));
      }

      mostrarAviso(`Denúncia #${denunciaParaResolver.id} marcada como '${statusResolucao}'.`);
      setDenunciaParaResolver(null);
      setNotaModerador("");
      // Se estava com modal de auditoria aberto, atualiza também
      if (chatAuditModal && chatAuditModal.denuncia_id === denunciaParaResolver.id) {
        setChatAuditModal(null);
      }
    } catch (err) {
      mostrarAviso(err.message || "Erro ao atualizar status da denúncia.", "erro");
    } finally {
      setProcessandoResolucao(false);
    }
  };

  // Aplicação de Sanções
  const handleConfirmarSancao = async () => {
    if (!usuarioParaSancao) return;
    try {
      setProcessandoSancao(true);
      await adminService.aplicarSancaoUsuario(usuarioParaSancao.id, {
        acao: tipoSancao,
        dias_suspensao: tipoSancao === "suspender" ? Number(diasSuspensao) : undefined,
        motivo: motivoSancao.trim() || undefined,
      });

      mostrarAviso(
        `Sanção '${tipoSancao.toUpperCase()}' aplicada com sucesso ao usuário ${usuarioParaSancao.nome}.`
      );

      // Atualizar lista de usuários
      carregarUsuarios();
      carregarMetricas();

      setUsuarioParaSancao(null);
      setMotivoSancao("");
    } catch (err) {
      mostrarAviso(err.message || "Erro ao aplicar sanção disciplinar.", "erro");
    } finally {
      setProcessandoSancao(false);
    }
  };

  // Tela de Acesso Negado se não for moderador ou admin
  if (!authLoading && !isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-black/5 rounded-[2rem] p-8 text-center shadow-xl shadow-black/5">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
            <i className="fa-solid fa-lock"></i>
          </div>
          <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
            Acesso Restrito
          </span>
          <h1 className="font-editorial text-3xl italic mb-3">
            Área de Moderação
          </h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Seu perfil atual ({user?.papel || user?.tipo_conta || "visitante"}) não possui privilégios de moderador ou administrador para visualizar este painel.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/feed"
              className="bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
            >
              Voltar para o Feed
            </Link>
            <Link
              to="/login"
              className="bg-[#F9F8F6] text-gray-600 px-6 py-3 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
            >
              Entrar com outra conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const areas = [
    { id: "geral", label: "Visão Geral", icon: "fa-solid fa-chart-pie" },
    { id: "quarentena", label: "Quarentena", icon: "fa-solid fa-shield-halved", badge: metricas.obras_pendentes },
    { id: "denuncias", label: "Denúncias", icon: "fa-solid fa-flag", badge: metricas.denuncias_abertas },
    { id: "usuarios", label: "Usuários", icon: "fa-solid fa-users-gear" },
    { id: "logs", label: "Logs de Auditoria", icon: "fa-solid fa-clock-rotate-left" },
  ];

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block">
                {isAdmin ? "Painel Administrativo" : "Painel de Moderação"}
              </span>
              <span className="bg-artPurple/10 text-artPurple px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                {papel.toUpperCase()}
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
              Moderação<span className="italic text-artOrange">.</span>
            </h1>

            <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
              Gestão ativa da integridade da comunidade: quarentena de obras, auditoria de chats denunciados e histórico formal de sanções.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                carregarMetricas();
                carregarObras();
                carregarDenuncias();
                mostrarAviso("Dados sincronizados com o servidor.");
              }}
              className="bg-white border border-black/5 px-4 py-3 rounded-full text-xs font-bold hover:bg-gray-50 text-gray-700 transition-all flex items-center gap-2 shadow-sm"
              title="Atualizar dados"
            >
              <i className={`fa-solid fa-arrows-rotate ${loadingMetricas ? "animate-spin" : ""}`}></i>
              Atualizar
            </button>

            <Link
              to="/feed"
              className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Feed
            </Link>

            <Link
              to="/notificacoes"
              className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
            >
              <i className="fa-regular fa-bell mr-2"></i>
              Notificações
            </Link>
          </div>
        </header>

        {/* Mensagem de Aviso Flutuante */}
        {aviso && (
          <div
            className={`border rounded-[1.3rem] px-5 py-3.5 mb-6 text-xs font-bold flex items-center justify-between transition-all ${
              aviso.tipo === "erro"
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-artOrange/10 text-artOrange border-artOrange/20"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <i className={`fa-solid ${aviso.tipo === "erro" ? "fa-circle-xmark" : "fa-circle-check"}`}></i>
              <span>{aviso.mensagem}</span>
            </div>
            <button
              type="button"
              onClick={() => setAviso(null)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Métricas Top Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setAreaAtual("quarentena")}
            className={`rounded-[1.7rem] p-5 border cursor-pointer transition-all hover:scale-[1.02] ${
              areaAtual === "quarentena"
                ? "bg-artOrange/5 border-artOrange shadow-md"
                : "bg-white border-black/5 hover:border-black/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Obras em Quarentena
              </span>
              <div className="w-8 h-8 rounded-full bg-artOrange/10 text-artOrange flex items-center justify-center text-xs">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>
            <p className="text-3xl font-black text-artDark">
              {loadingMetricas ? "..." : metricas.obras_pendentes}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Aguardando aprovação</p>
          </div>

          <div
            onClick={() => setAreaAtual("denuncias")}
            className={`rounded-[1.7rem] p-5 border cursor-pointer transition-all hover:scale-[1.02] ${
              areaAtual === "denuncias"
                ? "bg-artBlue/5 border-artBlue shadow-md"
                : "bg-white border-black/5 hover:border-black/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Denúncias Abertas
              </span>
              <div className="w-8 h-8 rounded-full bg-artBlue/10 text-artBlue flex items-center justify-center text-xs">
                <i className="fa-solid fa-flag"></i>
              </div>
            </div>
            <p className="text-3xl font-black text-artDark">
              {loadingMetricas ? "..." : metricas.denuncias_abertas}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Conversas e condutas</p>
          </div>

          <div
            onClick={() => setAreaAtual("usuarios")}
            className={`rounded-[1.7rem] p-5 border cursor-pointer transition-all hover:scale-[1.02] ${
              areaAtual === "usuarios"
                ? "bg-artPurple/5 border-artPurple shadow-md"
                : "bg-white border-black/5 hover:border-black/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Usuários Sinalizados
              </span>
              <div className="w-8 h-8 rounded-full bg-artPurple/10 text-artPurple flex items-center justify-center text-xs">
                <i className="fa-solid fa-user-slash"></i>
              </div>
            </div>
            <p className="text-3xl font-black text-artDark">
              {loadingMetricas ? "..." : metricas.usuarios_sinalizados}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Com infrações ou denúncias</p>
          </div>

          <div
            onClick={() => setAreaAtual("logs")}
            className={`rounded-[1.7rem] p-5 border cursor-pointer transition-all hover:scale-[1.02] ${
              areaAtual === "logs"
                ? "bg-gray-100 border-gray-400 shadow-md"
                : "bg-white border-black/5 hover:border-black/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Logs de Auditoria
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
            </div>
            <p className="text-3xl font-black text-artDark">
              {loadingMetricas ? "..." : metricas.logs_recentes}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Ações registradas</p>
          </div>
        </section>

        {/* Layout com Sidebar de Navegação e Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Navegação de Abas */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <h2 className="font-editorial text-2xl italic mb-4">Navegação</h2>

              <div className="space-y-2">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setAreaAtual(area.id)}
                    className={`w-full px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-left transition-all flex items-center justify-between ${
                      areaAtual === area.id
                        ? "bg-artDark text-white shadow-md shadow-black/10"
                        : "bg-[#F9F8F6] text-gray-500 hover:text-artDark hover:bg-[#eae7df]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <i className={area.icon}></i>
                      {area.label}
                    </span>
                    {typeof area.badge === "number" && area.badge > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          areaAtual === area.id
                            ? "bg-artOrange text-white"
                            : "bg-artOrange/10 text-artOrange"
                        }`}
                      >
                        {area.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Caixa Informativa */}
            <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                Auditoria Imutável
              </span>
              <h3 className="font-editorial text-2xl italic leading-tight">
                Transparência e Responsabilidade
              </h3>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Todas as aprovações, rejeições e sanções são assinadas pelo moderador logado e gravadas de forma permanente no banco de dados.
              </p>
              <i className="fa-solid fa-scale-balanced absolute -right-4 -bottom-4 text-[5.5rem] text-white/5 rotate-12"></i>
            </div>
          </aside>

          {/* Área Central de Conteúdo */}
          <main className="lg:col-span-9 space-y-6">
            {/* ========================================================= */}
            {/* ABA: QUARENTENA DE OBRAS                                 */}
            {/* ========================================================= */}
            {(areaAtual === "geral" || areaAtual === "quarentena") && (
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Controle de Conteúdo
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Quarentena de Obras
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-artOrange/10 text-artOrange px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {obrasQuarentena.length} pendentes
                    </span>
                  </div>
                </div>

                {loadingObras ? (
                  <div className="py-12 text-center text-gray-400">
                    <i className="fa-solid fa-spinner animate-spin text-2xl mb-2"></i>
                    <p className="text-xs font-bold">Carregando obras em análise...</p>
                  </div>
                ) : obrasQuarentena.length === 0 ? (
                  <div className="py-12 text-center bg-[#F9F8F6] rounded-[1.5rem] p-6 border border-dashed border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3 text-xl">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <h3 className="font-bold text-gray-700">Nenhuma obra na quarentena</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Todas as postagens estão aprovadas ou já foram julgadas pela moderação.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {obrasQuarentena.map((obra) => (
                      <article
                        key={obra.id}
                        className="bg-[#F9F8F6] rounded-[1.6rem] p-4 sm:p-5 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col md:flex-row md:items-center gap-4"
                      >
                        {/* Thumbnail / Mídia */}
                        <div
                          onClick={() => setObraParaVisualizar(obra)}
                          className="w-full md:w-36 h-36 md:h-28 rounded-[1.2rem] overflow-hidden bg-gray-200 shrink-0 cursor-pointer group relative"
                          title="Clique para ampliar"
                        >
                          <img
                            src={getMediaUrl(obra.arquivoUrl)}
                            alt={obra.legenda || "Obra em quarentena"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <i className="fa-solid fa-magnifying-glass-plus text-lg"></i>
                          </div>
                        </div>

                        {/* Metadados */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="bg-artOrange/10 text-artOrange px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                              {obra.status || "Quarentena"}
                            </span>
                            {obra.categorias && obra.categorias.map((cat, idx) => (
                              <span
                                key={idx}
                                className="bg-white border border-black/5 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-gray-500 uppercase"
                              >
                                {cat}
                              </span>
                            ))}
                            {obra.dataPostagem && (
                              <span className="text-[10px] text-gray-400 font-medium ml-auto">
                                {new Date(obra.dataPostagem).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-base text-gray-900 truncate">
                            {obra.legenda || `Obra #${obra.id} (Sem título)`}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <span>
                              Artista: <strong>{obra.artista_nome}</strong> ({obra.artista_email || `ID #${obra.idUsuario}`})
                            </span>
                          </p>

                          <div className="mt-2 text-[11px] text-artOrange font-semibold flex items-center gap-1.5">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>Revisão obrigatória antes da publicação pública no feed.</span>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex md:flex-col gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAprovarObra(obra.id)}
                            className="flex-1 md:flex-none bg-artDark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-green-600 transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <i className="fa-solid fa-check"></i>
                            Aprovar
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setObraParaRejeitar(obra);
                              setMotivoRejeicao("");
                            }}
                            className="flex-1 md:flex-none bg-white border border-black/5 text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1.5"
                          >
                            <i className="fa-solid fa-xmark"></i>
                            Rejeitar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* ABA: DENÚNCIAS DE CHAT E CONDUTA                         */}
            {/* ========================================================= */}
            {(areaAtual === "geral" || areaAtual === "denuncias") && (
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Integridade e Segurança
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Denúncias de Chat
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filtroStatusDenuncia}
                      onChange={(e) => setFiltroStatusDenuncia(e.target.value)}
                      className="bg-[#F9F8F6] border border-black/5 text-xs font-bold rounded-full px-4 py-2 text-gray-700 outline-none"
                    >
                      <option value="">Todas</option>
                      <option value="pendente">Apenas Pendentes</option>
                      <option value="resolvida">Resolvidas</option>
                      <option value="descartada">Descartadas</option>
                    </select>

                    <span className="bg-artBlue/10 text-artBlue px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {denunciasChat.length}
                    </span>
                  </div>
                </div>

                {loadingDenuncias ? (
                  <div className="py-12 text-center text-gray-400">
                    <i className="fa-solid fa-spinner animate-spin text-2xl mb-2"></i>
                    <p className="text-xs font-bold">Carregando denúncias...</p>
                  </div>
                ) : denunciasChat.length === 0 ? (
                  <div className="py-12 text-center bg-[#F9F8F6] rounded-[1.5rem] p-6 border border-dashed border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-artBlue flex items-center justify-center mx-auto mb-3 text-xl">
                      <i className="fa-solid fa-comments"></i>
                    </div>
                    <h3 className="font-bold text-gray-700">Nenhuma denúncia registrada</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      O chat e as interações estão em conformidade com as diretrizes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {denunciasChat.map((denuncia) => {
                      const isPendente = (denuncia.status || "").toLowerCase() === "pendente";
                      return (
                        <article
                          key={denuncia.id}
                          className="bg-[#F9F8F6] rounded-[1.6rem] p-5 border border-black/5 hover:bg-white hover:shadow-lg transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-white border border-black/5 text-gray-500 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">
                                  Conversa #{denuncia.conversa_id}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                    isPendente
                                      ? "bg-artOrange/10 text-artOrange"
                                      : denuncia.status === "resolvida"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-200 text-gray-600"
                                  }`}
                                >
                                  {denuncia.status}
                                </span>
                                {denuncia.criado_em && (
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(denuncia.criado_em).toLocaleDateString("pt-BR", {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                )}
                              </div>

                              <h3 className="font-bold text-base text-gray-900">
                                {denuncia.motivo}
                              </h3>
                            </div>

                            {/* Botão de Auditoria do Chat */}
                            <button
                              type="button"
                              onClick={() => handleAbrirAuditoria(denuncia.id)}
                              className="bg-artDark text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-artPurple transition-all flex items-center gap-2 shrink-0 shadow-sm"
                            >
                              <i className="fa-solid fa-eye"></i>
                              Inspecionar Chat
                            </button>
                          </div>

                          {denuncia.descricao && (
                            <p className="text-xs text-gray-600 bg-white/70 rounded-xl p-3 mb-3 italic border border-black/5">
                              "{denuncia.descricao}"
                            </p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 pt-2 border-t border-black/5">
                            <div>
                              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                Denunciante
                              </span>
                              <strong>{denuncia.denunciante_nome}</strong> (ID #{denuncia.denunciante_id})
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                                Denunciado (Infrator)
                              </span>
                              <strong className="text-red-600">{denuncia.denunciado_nome}</strong> (ID #{denuncia.denunciado_id})
                            </div>
                          </div>

                          {denuncia.nota_moderador && (
                            <div className="mt-3 text-xs bg-artBlue/5 text-artBlue rounded-xl p-2.5 font-medium border border-artBlue/10">
                              <strong>Nota do Moderador:</strong> {denuncia.nota_moderador}
                            </div>
                          )}

                          {/* Ações de Desfecho */}
                          {isPendente && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-black/5">
                              <button
                                type="button"
                                onClick={() => {
                                  setDenunciaParaResolver(denuncia);
                                  setStatusResolucao("resolvida");
                                  setNotaModerador("");
                                }}
                                className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-700 transition-all"
                              >
                                <i className="fa-solid fa-check mr-1.5"></i>
                                Marcar como Resolvida
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setDenunciaParaResolver(denuncia);
                                  setStatusResolucao("descartada");
                                  setNotaModerador("");
                                }}
                                className="bg-white border border-black/5 text-gray-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-100 transition-all"
                              >
                                <i className="fa-solid fa-ban mr-1.5"></i>
                                Descartar Denúncia
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setUsuarioParaSancao({
                                    id: denuncia.denunciado_id,
                                    nome: denuncia.denunciado_nome,
                                  });
                                  setTipoSancao("advertir");
                                  setMotivoSancao(`Denúncia #${denuncia.id}: ${denuncia.motivo}`);
                                }}
                                className="bg-artOrange/10 text-artOrange px-4 py-1.5 rounded-full text-xs font-bold hover:bg-artOrange hover:text-white transition-all ml-auto"
                              >
                                <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                                Sancionar Infrator
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* ABA: USUÁRIOS SINALIZADOS                                */}
            {/* ========================================================= */}
            {(areaAtual === "geral" || areaAtual === "usuarios") && (
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Disciplina e Conformidade
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Usuários Sinalizados
                    </h2>
                  </div>

                  <span className="bg-artPurple/10 text-artPurple px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {usuariosSinalizados.length} usuários
                  </span>
                </div>

                {loadingUsuarios ? (
                  <div className="py-12 text-center text-gray-400">
                    <i className="fa-solid fa-spinner animate-spin text-2xl mb-2"></i>
                    <p className="text-xs font-bold">Carregando usuários...</p>
                  </div>
                ) : usuariosSinalizados.length === 0 ? (
                  <div className="py-12 text-center bg-[#F9F8F6] rounded-[1.5rem] p-6 border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400">Nenhum usuário com infrações no momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usuariosSinalizados.map((u) => {
                      const estaSuspenso = u.suspenso_ate && new Date(u.suspenso_ate) > new Date();
                      const estaBanido = u.ativo === false;

                      return (
                        <article
                          key={u.id}
                          className="bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={getMediaUrl(u.fotoPerfil)}
                                alt={u.nome}
                                className="w-11 h-11 rounded-full object-cover bg-gray-200 shrink-0"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-sm text-gray-900 truncate">
                                  {u.nome}
                                </h4>
                                <p className="text-[11px] text-gray-400 truncate">
                                  {u.email || `ID #${u.id}`} • Papel: {u.papel}
                                </p>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                                  estaBanido
                                    ? "bg-red-100 text-red-600"
                                    : estaSuspenso
                                    ? "bg-artOrange/10 text-artOrange"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {estaBanido
                                  ? "Banido"
                                  : estaSuspenso
                                  ? "Suspenso"
                                  : "Ativo"}
                              </span>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1 mb-4">
                              <p>
                                <strong>Denúncias recebidas:</strong> {u.total_denuncias}
                              </p>
                              {estaSuspenso && (
                                <p className="text-artOrange font-semibold text-[11px]">
                                  Suspenso até:{" "}
                                  {new Date(u.suspenso_ate).toLocaleDateString("pt-BR")}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-3 border-t border-black/5">
                            <button
                              type="button"
                              onClick={() => {
                                setUsuarioParaSancao(u);
                                setTipoSancao("advertir");
                                setMotivoSancao("");
                              }}
                              className="bg-white border border-black/5 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all flex-1 text-center"
                            >
                              Advertir
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setUsuarioParaSancao(u);
                                setTipoSancao("suspender");
                                setDiasSuspensao(7);
                                setMotivoSancao("");
                              }}
                              className="bg-white border border-black/5 text-artOrange px-3 py-1.5 rounded-full text-xs font-bold hover:bg-artOrange hover:text-white transition-all flex-1 text-center"
                            >
                              Suspender
                            </button>

                            {isAdmin && !estaBanido && (
                              <button
                                type="button"
                                onClick={() => {
                                  setUsuarioParaSancao(u);
                                  setTipoSancao("banir");
                                  setMotivoSancao("");
                                }}
                                className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-600 hover:text-white transition-all text-center"
                              >
                                Banir
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* ABA: LOGS DE AUDITORIA                                   */}
            {/* ========================================================= */}
            {(areaAtual === "geral" || areaAtual === "logs") && (
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Registro Permanente
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Logs de Auditoria
                    </h2>
                  </div>

                  <span className="bg-gray-100 text-gray-600 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {logsAuditoria.length} registros
                  </span>
                </div>

                {loadingLogs ? (
                  <div className="py-12 text-center text-gray-400">
                    <i className="fa-solid fa-spinner animate-spin text-2xl mb-2"></i>
                    <p className="text-xs font-bold">Carregando logs...</p>
                  </div>
                ) : logsAuditoria.length === 0 ? (
                  <div className="py-12 text-center bg-[#F9F8F6] rounded-[1.5rem] p-6 border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400">Nenhum log registrado ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {logsAuditoria.map((log) => (
                      <article
                        key={log.id}
                        className="bg-[#F9F8F6] rounded-[1.3rem] p-4 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-artDark text-white flex items-center justify-center shrink-0 text-xs">
                            <i className="fa-solid fa-fingerprint"></i>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 uppercase tracking-wider text-[10px] bg-white px-2 py-0.5 rounded border border-black/5">
                                {log.acao}
                              </span>
                              <span className="text-gray-500 font-semibold">
                                {log.alvo_tipo} #{log.alvo_id}
                              </span>
                            </div>
                            {log.detalhes && (
                              <p className="text-gray-600 mt-1">{log.detalhes}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0 text-[11px] text-gray-400">
                          <p className="font-semibold text-gray-700">
                            {log.moderador_nome || `Mod #${log.moderador_id}`}
                          </p>
                          <p>
                            {log.criado_em
                              ? new Date(log.criado_em).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODAL: AUDITORIA COMPLETA DE CHAT COM MENSAGENS APAGADAS      */}
      {/* ============================================================= */}
      {chatAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-black/10 overflow-hidden">
            {/* Header Modal */}
            <div className="p-6 border-b border-black/5 flex items-center justify-between bg-[#F9F8F6]">
              <div>
                <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                  Auditoria Forense de Chat
                </span>
                <h3 className="font-editorial text-2xl italic text-gray-900">
                  Denúncia #{chatAuditModal.denuncia_id} • Conversa #{chatAuditModal.conversa_id}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Motivo: <strong>{chatAuditModal.motivo}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setChatAuditModal(null)}
                className="w-10 h-10 rounded-full bg-white border border-black/5 text-gray-500 hover:text-artDark hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Timeline de Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {chatAuditModal.mensagens.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-bold">
                  Nenhuma mensagem registrada nesta conversa.
                </div>
              ) : (
                chatAuditModal.mensagens.map((msg) => {
                  const ehInfrator = msg.idRemetente === chatAuditModal.denunciado_id;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-[1.4rem] border transition-all ${
                        msg.foi_apagada
                          ? "bg-red-50/80 border-red-200 text-red-950"
                          : ehInfrator
                          ? "bg-amber-50/60 border-amber-200 text-amber-950"
                          : "bg-white border-black/5 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            {msg.nomeRemetente}
                          </span>
                          {ehInfrator && (
                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">
                              Denunciado
                            </span>
                          )}
                          {msg.idRemetente === chatAuditModal.denunciante_id && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">
                              Denunciante
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {msg.foi_editada && (
                            <span className="text-[10px] text-amber-600 font-bold">
                              <i className="fa-solid fa-pen mr-1"></i>
                              (editada)
                            </span>
                          )}
                          {msg.dataEnvio && (
                            <span className="text-[10px] text-gray-400">
                              {new Date(msg.dataEnvio).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* BADGE CRÍTICO DE MENSAGEM APAGADA */}
                      {msg.foi_apagada && (
                        <div className="mb-2 inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase shadow-sm">
                          <i className="fa-solid fa-trash-can"></i>
                          [MENSAGEM APAGADA PELO USUÁRIO]
                        </div>
                      )}

                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.conteudo || <span className="italic text-gray-400">(Mensagem sem texto)</span>}
                      </p>

                      {msg.arquivoUrl && (
                        <div className="mt-3">
                          <img
                            src={getMediaUrl(msg.arquivoUrl)}
                            alt="Anexo no chat"
                            className="max-h-48 rounded-xl object-cover border border-black/10"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Modal com Ações Rápidas de Julgamento */}
            <div className="p-4 sm:p-5 border-t border-black/5 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsuarioParaSancao({
                      id: chatAuditModal.denunciado_id,
                      nome: `Usuário #${chatAuditModal.denunciado_id}`,
                    });
                    setTipoSancao("advertir");
                    setMotivoSancao(`Denúncia #${chatAuditModal.denuncia_id}: ${chatAuditModal.motivo}`);
                  }}
                  className="bg-artOrange/10 text-artOrange px-4 py-2 rounded-full text-xs font-bold hover:bg-artOrange hover:text-white transition-all"
                >
                  <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                  Advertir Infrator
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsuarioParaSancao({
                      id: chatAuditModal.denunciado_id,
                      nome: `Usuário #${chatAuditModal.denunciado_id}`,
                    });
                    setTipoSancao("suspender");
                    setDiasSuspensao(7);
                    setMotivoSancao(`Denúncia #${chatAuditModal.denuncia_id}: ${chatAuditModal.motivo}`);
                  }}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                >
                  <i className="fa-solid fa-user-clock mr-1"></i>
                  Suspender Infrator
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDenunciaParaResolver({ id: chatAuditModal.denuncia_id });
                    setStatusResolucao("resolvida");
                    setNotaModerador("");
                  }}
                  className="bg-green-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-green-700 transition-all shadow-sm"
                >
                  <i className="fa-solid fa-check mr-1.5"></i>
                  Resolver Denúncia
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDenunciaParaResolver({ id: chatAuditModal.denuncia_id });
                    setStatusResolucao("descartada");
                    setNotaModerador("");
                  }}
                  className="bg-[#F9F8F6] text-gray-600 px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: REJEITAR OBRA COM MOTIVO FORMAL                        */}
      {/* ============================================================= */}
      {obraParaRejeitar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 shadow-2xl border border-black/10">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 text-xl">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <span className="text-red-600 font-bold tracking-widest uppercase text-[10px] block mb-1">
              Recusa de Publicação
            </span>
            <h3 className="font-editorial text-2xl italic mb-2">
              Rejeitar Obra #{obraParaRejeitar.id}
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              A obra será arquivada e o artista (<strong>{obraParaRejeitar.artista_nome}</strong>) receberá uma notificação do sistema informando o motivo da quebra das diretrizes.
            </p>

            {/* Presets de motivos */}
            <div className="mb-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Motivos Frequentes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Violação de direitos autorais",
                  "Conteúdo ofensivo ou inapropriado",
                  "Uso indevido de imagem/marca",
                  "Qualidade abaixo das diretrizes",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMotivoRejeicao(preset)}
                    className="bg-[#F9F8F6] hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-black/5 transition-all text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                Justificativa Formal para o Artista
              </label>
              <textarea
                rows={3}
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
                placeholder="Descreva o motivo que será enviado na notificação ao artista..."
                className="w-full bg-[#F9F8F6] border border-black/10 rounded-2xl p-3 text-xs text-gray-900 outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={processandoRejeicao}
                onClick={handleConfirmarRejeicao}
                className="flex-1 bg-red-600 text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {processandoRejeicao ? "Rejeitando..." : "Confirmar Rejeição"}
              </button>

              <button
                type="button"
                onClick={() => setObraParaRejeitar(null)}
                className="bg-[#F9F8F6] text-gray-600 px-5 py-3 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: APLICAR SANÇÃO DISCIPLINAR A USUÁRIO                   */}
      {/* ============================================================= */}
      {usuarioParaSancao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 shadow-2xl border border-black/10">
            <div className="w-12 h-12 rounded-full bg-artOrange/10 text-artOrange flex items-center justify-center mb-4 text-xl">
              <i className="fa-solid fa-gavel"></i>
            </div>
            <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
              Ação Disciplinar
            </span>
            <h3 className="font-editorial text-2xl italic mb-1">
              Sancionar {usuarioParaSancao.nome}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Selecione a ação proporcional à conduta do usuário:
            </p>

            {/* Tipo de Sanção */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setTipoSancao("advertir")}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                  tipoSancao === "advertir"
                    ? "bg-artDark text-white border-artDark"
                    : "bg-[#F9F8F6] text-gray-600 border-black/5 hover:bg-gray-100"
                }`}
              >
                Advertir
              </button>

              <button
                type="button"
                onClick={() => setTipoSancao("suspender")}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                  tipoSancao === "suspender"
                    ? "bg-artOrange text-white border-artOrange"
                    : "bg-[#F9F8F6] text-gray-600 border-black/5 hover:bg-gray-100"
                }`}
              >
                Suspender
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setTipoSancao("banir")}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                    tipoSancao === "banir"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-[#F9F8F6] text-red-600 border-black/5 hover:bg-red-50"
                  }`}
                >
                  Banir
                </button>
              )}
            </div>

            {/* Se for suspensão, campo de dias */}
            {tipoSancao === "suspender" && (
              <div className="mb-4 bg-artOrange/5 border border-artOrange/15 rounded-2xl p-3.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-artOrange block mb-1.5">
                  Duração da Suspensão
                </label>
                <div className="flex gap-2">
                  {[3, 7, 15, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDiasSuspensao(d)}
                      className={`flex-1 py-1.5 rounded-full text-xs font-bold border ${
                        diasSuspensao === d
                          ? "bg-artOrange text-white border-artOrange"
                          : "bg-white text-gray-700 border-black/10"
                      }`}
                    >
                      {d} dias
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Motivo */}
            <div className="mb-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                Motivo / Justificativa
              </label>
              <textarea
                rows={3}
                value={motivoSancao}
                onChange={(e) => setMotivoSancao(e.target.value)}
                placeholder="Informe o motivo da sanção que será registrado e notificado ao usuário..."
                className="w-full bg-[#F9F8F6] border border-black/10 rounded-2xl p-3 text-xs text-gray-900 outline-none focus:border-artOrange transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={processandoSancao}
                onClick={handleConfirmarSancao}
                className="flex-1 bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all disabled:opacity-50"
              >
                {processandoSancao ? "Aplicando..." : "Aplicar Sanção"}
              </button>

              <button
                type="button"
                onClick={() => setUsuarioParaSancao(null)}
                className="bg-[#F9F8F6] text-gray-600 px-5 py-3 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: RESOLVER / DESCARTAR DENÚNCIA                          */}
      {/* ============================================================= */}
      {denunciaParaResolver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 shadow-2xl border border-black/10">
            <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
              Desfecho da Moderação
            </span>
            <h3 className="font-editorial text-2xl italic mb-2">
              {statusResolucao === "resolvida" ? "Resolver Denúncia" : "Descartar Denúncia"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Denúncia #{denunciaParaResolver.id}. Insira uma nota interna de justificativa do moderador.
            </p>

            <div className="mb-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                Nota do Moderador (Opcional)
              </label>
              <textarea
                rows={3}
                value={notaModerador}
                onChange={(e) => setNotaModerador(e.target.value)}
                placeholder="Explique as medidas tomadas ou a justificativa para arquivamento..."
                className="w-full bg-[#F9F8F6] border border-black/10 rounded-2xl p-3 text-xs text-gray-900 outline-none focus:border-artBlue transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={processandoResolucao}
                onClick={handleConfirmarResolucao}
                className={`flex-1 px-5 py-3 rounded-full text-xs font-bold text-white transition-all disabled:opacity-50 ${
                  statusResolucao === "resolvida"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-artDark hover:bg-gray-800"
                }`}
              >
                {processandoResolucao ? "Salvando..." : "Confirmar"}
              </button>

              <button
                type="button"
                onClick={() => setDenunciaParaResolver(null)}
                className="bg-[#F9F8F6] text-gray-600 px-5 py-3 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: PREVIEW DE IMAGEM FULL-SIZE DA QUARENTENA              */}
      {/* ============================================================= */}
      {obraParaVisualizar && (
        <div
          onClick={() => setObraParaVisualizar(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-artDark rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-4 flex items-center justify-between text-white border-b border-white/10">
              <span className="font-bold text-sm">
                {obraParaVisualizar.legenda || `Obra #${obraParaVisualizar.id}`}
              </span>
              <button
                type="button"
                onClick={() => setObraParaVisualizar(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="max-h-[75vh] p-4 flex items-center justify-center bg-black">
              <img
                src={getMediaUrl(obraParaVisualizar.arquivoUrl)}
                alt="Preview da obra"
                className="max-h-[70vh] max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}