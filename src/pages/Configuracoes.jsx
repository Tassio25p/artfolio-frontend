import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService, usuarioService, planosService, categoriaService, getMediaUrl } from "../services/api";

export default function Configuracoes() {
  const navigate = useNavigate();
  const { user: authUser, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState("conta");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dados da aba Conta
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoConta, setTipoConta] = useState("cliente");
  const [avatar, setAvatar] = useState("");
  const [mostrarMolduraLed, setMostrarMolduraLed] = useState(true);
  const [mostrarBadgePlano, setMostrarBadgePlano] = useState(true);
  const [corLedHex, setCorLedHex] = useState(() => {
    return localStorage.getItem("artfolio_boost_led_color") || "#FF793F";
  });
  const [mensagemCta, setMensagemCta] = useState("");
  const [planoInfo, setPlanoInfo] = useState(null);

  // Tópicos de Interesse do Usuário (até 5)
  const [listaCategorias, setListaCategorias] = useState([]);
  const [minhasPreferencias, setMinhasPreferencias] = useState([]);
  const [salvandoPreferencias, setSalvandoPreferencias] = useState(false);

  // Dados da aba Segurança
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  // Dados de privacidade (manter local até backend suportar)
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [mostrarStats, setMostrarStats] = useState(false);

  // Dados de notificações (manter local até backend suportar)
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSistema, setNotifSistema] = useState(true);
  const [notifModeracao, setNotifModeracao] = useState(true);

  // Dados de encomendas (manter local até backend suportar)
  const [aceitaEncomendas, setAceitaEncomendas] = useState(true);
  const [valorMinimo, setValorMinimo] = useState("150,00");
  const [prazoPadrao, setPrazoPadrao] = useState("10");

  // Dados reais de bloqueados persistidos no localStorage
  const [bloqueados, setBloqueados] = useState(() => {
    const saved = localStorage.getItem("artfolio_blocked_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [buscaBloqueado, setBuscaBloqueado] = useState("");
  const [artistasCadastrados, setArtistasCadastrados] = useState([]);

  const isArtista = tipoConta === "artista" || tipoConta === "galeria";
  const isPlanoFree = (planoInfo?.tipo || "Free").toLowerCase() === "free";
  const isPlanoBoost = (planoInfo?.tipo || "Free").toLowerCase() === "boost";

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [usuario, todosArtistas, planoData, prefs, cats] = await Promise.all([
          authService.getMe(),
          usuarioService.listarArtistas().catch(() => []),
          planosService.obterMeuPlano().catch(() => null),
          usuarioService.obterPreferencias().catch(() => []),
          categoriaService.listar().catch(() => []),
        ]);
        setNome(usuario.nome || "");
        setEmail(usuario.email || "");
        setTelefone(usuario.telefone || "");
        setTipoConta(usuario.tipo_conta || "cliente");
        setAvatar(usuario.fotoPerfil || "");
        setMostrarMolduraLed(usuario.mostrar_moldura_led !== false);
        setMostrarBadgePlano(usuario.mostrar_badge_plano !== false);
        if (usuario.cor_led_hex || usuario.led_color) {
          setCorLedHex(usuario.cor_led_hex || usuario.led_color);
          localStorage.setItem("artfolio_boost_led_color", usuario.cor_led_hex || usuario.led_color);
        }
        setMensagemCta(usuario.mensagem_cta || "");
        setPlanoInfo(planoData);
        setArtistasCadastrados(Array.isArray(todosArtistas) ? todosArtistas : []);
        setListaCategorias(Array.isArray(cats) ? cats : []);
        if (Array.isArray(prefs)) {
          setMinhasPreferencias(prefs.map((p) => p.idCategoria));
        }
      } catch (error) {
        mostrarAviso("Erro ao carregar dados. Faça login novamente.", "error");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [navigate]);

  const handleSalvarPreferencias = async () => {
    setSalvandoPreferencias(true);
    try {
      await usuarioService.salvarPreferencias(minhasPreferencias);
      mostrarAviso("Tópicos de interesse salvos com sucesso!", "success");
    } catch (err) {
      mostrarAviso(err.message || "Erro ao salvar tópicos de interesse.", "error");
    } finally {
      setSalvandoPreferencias(false);
    }
  };

  const menuItems = [
    {
      id: "conta",
      label: "Conta",
      icon: "fa-solid fa-user",
      hoverClass: "hover:text-artPurple hover:bg-artPurple/10 hover:border-artPurple/20",
    },
    {
      id: "seguranca",
      label: "Segurança",
      icon: "fa-solid fa-shield-halved",
      hoverClass: "hover:text-artBlue hover:bg-artBlue/10 hover:border-artBlue/20",
    },
    {
      id: "privacidade",
      label: "Privacidade",
      icon: "fa-solid fa-eye-slash",
      hoverClass: "hover:text-artGreen hover:bg-artGreen/10 hover:border-artGreen/20",
    },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: "fa-solid fa-bell",
      hoverClass: "hover:text-artOrange hover:bg-artOrange/10 hover:border-artOrange/20",
    },
    {
      id: "bloqueados",
      label: "Bloqueados",
      icon: "fa-solid fa-ban",
      hoverClass: "hover:text-red-500 hover:bg-red-50 hover:border-red-200",
    },
    ...(isArtista
      ? [
          {
            id: "assinatura",
            label: "Assinatura",
            icon: "fa-solid fa-gem",
            hoverClass: "hover:text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/20",
          },
        ]
      : []),
  ];

  const handleSave = async (event) => {
    event.preventDefault();

    if (activeTab === "conta") {
      setSaving(true);
      try {
        const usuarioAtual = authUser;
        const dados = {};

        if (nome !== (usuarioAtual?.nome || "")) dados.nome = nome;
        if (telefone !== (usuarioAtual?.telefone || "")) dados.telefone = telefone || null;
        dados.mostrar_moldura_led = mostrarMolduraLed;
        dados.mostrar_badge_plano = mostrarBadgePlano;
        
        if (isPlanoBoost) {
          dados.cor_led_hex = corLedHex;
          dados.mensagem_cta = mensagemCta || null;
        }

        localStorage.setItem("artfolio_mostrar_moldura_led", String(mostrarMolduraLed));
        localStorage.setItem("artfolio_mostrar_badge_plano", String(mostrarBadgePlano));
        localStorage.setItem("artfolio_boost_led_color", corLedHex);

        const usuarioAtualizado = await usuarioService.atualizarPerfil(dados);
        setNome(usuarioAtualizado.nome || "");
        setTelefone(usuarioAtualizado.telefone || "");
        setEmail(usuarioAtualizado.email || "");
        setTipoConta(usuarioAtualizado.tipo_conta || "cliente");
        setAvatar(usuarioAtualizado.fotoPerfil || "");
        setMostrarMolduraLed(usuarioAtualizado.mostrar_moldura_led !== false);
        setMostrarBadgePlano(usuarioAtualizado.mostrar_badge_plano !== false);
        if (usuarioAtualizado.cor_led_hex || usuarioAtualizado.led_color) {
          setCorLedHex(usuarioAtualizado.cor_led_hex || usuarioAtualizado.led_color);
        }
        setMensagemCta(usuarioAtualizado.mensagem_cta || "");

        // Disparar evento para atualizar sidebar e perfil instantaneamente
        window.dispatchEvent(
          new CustomEvent("artfolio_profile_prefs_changed", {
            detail: {
              corLedHex,
              mostrarBadgePlano,
              mostrarMolduraLed,
            },
          })
        );

        // Sincronizar contexto global do usuário
        if (typeof refreshUser === "function") {
          await refreshUser();
        }

        mostrarAviso("Dados da conta e preferências salvos com sucesso!", "success");
      } catch (error) {
        mostrarAviso(error.message || "Erro ao salvar alterações.", "error");
      } finally {
        setSaving(false);
      }
    } else {
      mostrarAviso(
        "Essas configurações foram salvas localmente."
      );
    }
  };

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmacaoSenha) {
      mostrarAviso("Preencha todos os campos de senha.", "error");
      return;
    }

    if (novaSenha.length < 6) {
      mostrarAviso("A nova senha deve ter no mínimo 6 caracteres.", "error");
      return;
    }

    if (novaSenha !== confirmacaoSenha) {
      mostrarAviso("A nova senha e a confirmação não coincidem.", "error");
      return;
    }

    setSaving(true);
    try {
      await usuarioService.alterarSenha({
        senhaAtual,
        novaSenha,
        confirmacaoSenha,
      });

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacaoSenha("");

      mostrarAviso("Senha alterada com sucesso!", "success");
    } catch (error) {
      mostrarAviso(error.message || "Erro ao alterar senha.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTipoContaChange = (event) => {
    const novoTipo = event.target.value;
    setTipoConta(novoTipo);

    if (
      novoTipo === "cliente" &&
      (activeTab === "encomendas" || activeTab === "assinatura")
    ) {
      setActiveTab("conta");
    }
  };

  const handleAcaoFutura = (mensagem) => {
    mostrarAviso(mensagem);
  };

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/10",
    success: "bg-green-50 text-green-600 border-green-200",
    error: "bg-red-50 text-red-500 border-red-200",
  };

  const noticeIcons = {
    info: "fa-solid fa-circle-info",
    success: "fa-solid fa-circle-check",
    error: "fa-solid fa-circle-exclamation",
  };

  if (loading) {
    return (
      <div className="w-full text-artDark antialiased min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Carregando configurações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Preferências da conta
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Configurações
                <span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Ajuste sua conta, segurança, privacidade, notificações,
                preferências comerciais e assinatura dentro do Artfolio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/editar-perfil"
                className="bg-white border border-black/5 px-6 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-pen mr-2"></i>
                Editar Perfil
              </Link>

              <button
                type="submit"
                form="form-configuracoes"
                disabled={saving}
                className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple hover:shadow-lg hover:shadow-artPurple/20 transition-all active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk mr-2"></i>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </header>

          {noticeMessage && (
            <div className={`${noticeStyles[noticeType]} border rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold`}>
              <i className={`${noticeIcons[noticeType]} mr-2`}></i>
              {noticeMessage}
            </div>
          )}

          <form
            id="form-configuracoes"
            onSubmit={handleSave}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Menu
                </h2>

                <div className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-all duration-300 flex items-center gap-2.5 border border-transparent cursor-pointer ${
                        activeTab === item.id
                          ? "bg-artDark text-white shadow-md shadow-black/10"
                          : `bg-[#F9F8F6] text-gray-400 ${item.hoverClass}`
                      }`}
                    >
                      <i className={`${item.icon} text-xs transition-colors`}></i>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden shadow-xl shadow-black/5">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Tipo de conta
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  {isArtista ? "Perfil artístico" : "Perfil de cliente"}
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  O tipo de conta define quais recursos aparecem na interface.
                </p>
        <div className="mt-4 bg-white/10 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest">
                  {tipoConta}
                </div>

                <i className="fa-solid fa-user-gear absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
              </div>

              {isArtista && (
                <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                  <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
                    Plano atual
                  </span>

                  <h3 className="font-editorial text-2xl italic leading-tight">
                    {planoInfo?.tipo === "Boost"
                      ? "Artfolio Boost"
                      : planoInfo?.tipo === "Pro"
                      ? "Artfolio Pro"
                      : "Artfolio Free"}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setActiveTab("assinatura")}
                    className="mt-4 w-full bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-sm"
                  >
                    Ver assinatura
                  </button>
                </div>
              )}
            </aside>

            <section className="lg:col-span-9 space-y-5">
              {activeTab === "conta" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                        Dados principais
                      </span>

                      <h2 className="font-editorial text-3xl italic">
                        Informações da conta
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg shadow-black/10">
                      {avatar ? (
                        <img
                          src={getMediaUrl(avatar)}
                          alt="Perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-artPurple flex items-center justify-center text-white font-bold text-sm">
                          {nome?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Nome completo
                      </label>

                      <input
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        E-mail
                      </label>

                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none text-sm opacity-60 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">O e-mail não pode ser alterado.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Telefone
                      </label>

                      <input
                        type="text"
                        value={telefone}
                        onChange={(event) => setTelefone(event.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Tipo de conta
                      </label>

                      <input
                        type="text"
                        value={tipoConta}
                        disabled
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none text-sm capitalize opacity-60 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">O tipo de conta é gerenciado pelo sistema.</p>
                    </div>
                  </div>

                  {/* Seção de Personalização Visual e Negociação */}
                  <div className="mt-8 pt-6 border-t border-black/5 space-y-6">
                    <div>
                      <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                        Personalização & Perfil
                      </span>
                      <h3 className="font-editorial text-2xl italic mb-4">
                        Destaque Visual e Negociação
                      </h3>
                    </div>

                    {/* Personalização Estética (Fundo, Nick e LED) */}
                    <div className="bg-[#F9F8F6] rounded-[1.5rem] p-5 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-artDark flex items-center gap-1.5">
                            <i className="fa-solid fa-palette text-artOrange"></i>
                            Personalização Estética (Fundo, Nick e LED)
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          A personalização completa de cores de LED, cor do nome/nick, selo de plano e plano de fundo do perfil agora fica centralizada na página de <strong>Editar Perfil</strong>.
                        </p>
                      </div>

                      <Link
                        to="/editar-perfil"
                        className="bg-artOrange hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <i className="fa-solid fa-sliders text-[11px]"></i>
                        <span>Personalizar em Editar Perfil</span>
                      </Link>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Mensagem Pré-Pronta / Pitch de Vendas (Chat)
                        </label>
                        {!isPlanoBoost && (
                          <span className="bg-artOrange/15 text-artOrange border border-artOrange/30 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <i className="fa-solid fa-lock text-[8px]"></i>
                            Exclusivo Boost
                          </span>
                        )}
                      </div>

                      <textarea
                        rows={3}
                        value={mensagemCta}
                        disabled={!isPlanoBoost}
                        onChange={(event) => setMensagemCta(event.target.value)}
                        placeholder={
                          !isPlanoBoost
                            ? "Recurso exclusivo do plano Boost. Assine o Artfolio Boost para criar seu pitch de vendas pré-definido e enviar com um clique no chat!"
                            : "Ex: Olá! Trabalho com encomendas personalizadas e minhas vagas estão abertas. Posso te enviar minha tabela de valores?"
                        }
                        className={`w-full rounded-2xl px-5 py-4 outline-none text-sm leading-relaxed resize-none transition-all ${
                          !isPlanoBoost
                            ? "bg-[#F9F8F6] border border-black/5 opacity-60 cursor-not-allowed text-gray-400"
                            : "bg-[#F9F8F6] focus:bg-white border border-transparent focus:border-artOrange/30 focus:ring-4 focus:ring-artOrange/10"
                        }`}
                      />
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {!isPlanoBoost ? (
                          <span>
                            Personalize seu pitch de vendas e dispare com agilidade dentro do chat assinando o{" "}
                            <button
                              type="button"
                              onClick={() => setActiveTab("assinatura")}
                              className="text-artOrange font-bold hover:underline"
                            >
                              Artfolio Boost
                            </button>
                            .
                          </span>
                        ) : (
                          "Atalho rápido: você poderá disparar essa mensagem pré-configurada diretamente dentro do chat com um único clique no botão de raio."
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Seção de Tópicos e Categorias de Interesse */}
                  <div className="mt-8 pt-6 border-t border-black/5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                          Feed & Interesses Pessoais
                        </span>
                        <h3 className="font-editorial text-2xl italic">
                          Tópicos de Interesse ({minhasPreferencias.length}/5 selecionados)
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Escolha até 5 categorias que você mais gosta para priorizarmos no seu Feed pessoal.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSalvarPreferencias}
                        disabled={salvandoPreferencias}
                        className="bg-artOrange text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artDark transition-all shadow-md shadow-artOrange/20 self-start sm:self-auto disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                      >
                        {salvandoPreferencias ? (
                          <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                        ) : (
                          <i className="fa-solid fa-floppy-disk text-xs"></i>
                        )}
                        <span>Salvar Tópicos</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1 no-scrollbar">
                      {listaCategorias.map((cat) => {
                        const isSelected = minhasPreferencias.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setMinhasPreferencias((prev) => prev.filter((id) => id !== cat.id));
                              } else {
                                if (minhasPreferencias.length >= 5) {
                                  mostrarAviso("Você pode selecionar no máximo 5 tópicos de interesse.", "warning");
                                  return;
                                }
                                setMinhasPreferencias((prev) => [...prev, cat.id]);
                              }
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-artOrange text-white border-artOrange shadow-xs"
                                : "bg-[#F9F8F6] text-gray-600 border-black/5 hover:bg-gray-200"
                            }`}
                          >
                            <i className={isSelected ? "fa-solid fa-check text-[10px]" : "fa-solid fa-plus text-[10px]"}></i>
                            <span>{cat.nomeCategoria}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seguranca" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Proteção
                    </span>

                    <h2 className="font-editorial text-3xl italic flex items-center gap-2.5">
                      <i className="fa-solid fa-shield-halved text-artBlue not-italic text-2xl"></i>
                      <span>Segurança da conta</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Senha atual
                      </label>

                      <input
                        type="password"
                        value={senhaAtual}
                        onChange={(event) => setSenhaAtual(event.target.value)}
                        placeholder="Digite sua senha atual"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Nova senha
                      </label>

                      <input
                        type="password"
                        value={novaSenha}
                        onChange={(event) => setNovaSenha(event.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Confirmar nova senha
                      </label>

                      <input
                        type="password"
                        value={confirmacaoSenha}
                        onChange={(event) => setConfirmacaoSenha(event.target.value)}
                        placeholder="Repita a nova senha"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAlterarSenha}
                    disabled={saving}
                    className="mt-5 bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-artOrange transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Alterando...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-key mr-2"></i>
                        Alterar Senha
                      </>
                    )}
                  </button>

                  <div className="mt-5 bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4 flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-lock text-base"></i>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        Dica de segurança
                      </h3>

                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Utilize uma senha forte com pelo menos 6 caracteres.
                        Evite senhas curtas e reutilizadas em outros serviços.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacidade" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Preferências
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Privacidade
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <ToggleOption
                      title="Perfil público"
                      description="Permitir que visitantes encontrem seu perfil e suas obras aprovadas."
                      active={perfilPublico}
                      onToggle={() => setPerfilPublico(!perfilPublico)}
                    />

                    <ToggleOption
                      title="Mostrar estatísticas no perfil"
                      description={
                        isPlanoFree
                          ? "Exibir métricas públicas de engajamento no portfólio (Recurso exclusivo dos planos Pro e Boost)."
                          : "Exibir visualizações e curtidas publicamente no portfólio."
                      }
                      active={isPlanoFree ? false : mostrarStats}
                      disabled={isPlanoFree}
                      badge={
                        isPlanoFree ? (
                          <span className="bg-artPurple/15 text-artPurple border border-artPurple/30 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                            <i className="fa-solid fa-lock text-[8px]"></i>
                            Exclusivo Pro / Boost
                          </span>
                        ) : null
                      }
                      onToggle={() => setMostrarStats(!mostrarStats)}
                    />
                  </div>
                </div>
              )}

              {activeTab === "notificacoes" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Alertas
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Notificações
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <ToggleOption
                      title="Notificações por e-mail"
                      description="Receber avisos sobre novas mensagens, interações e atualizações importantes."
                      active={notifEmail}
                      onToggle={() => setNotifEmail(!notifEmail)}
                    />

                    <ToggleOption
                      title="Notificações dentro do sistema"
                      description="Receber alertas dentro do painel do Artfolio."
                      active={notifSistema}
                      onToggle={() => setNotifSistema(!notifSistema)}
                    />

                    <ToggleOption
                      title="Alertas da comunidade"
                      description="Receber avisos quando outros artistas interagirem com suas obras."
                      active={notifModeracao}
                      onToggle={() => setNotifModeracao(!notifModeracao)}
                    />
                  </div>
                </div>
              )}

              {activeTab === "bloqueados" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-red-500 font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Filtros de interação & Segurança
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Contas bloqueadas
                    </h2>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    Usuários bloqueados são silenciados para você. As notificações e mensagens diretas deles não serão exibidas no seu painel.
                  </p>

                  {bloqueados.length > 0 && (
                    <div className="relative mb-4">
                      <i className="fa-solid fa-magnifying-glass text-xs text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                      <input
                        type="text"
                        value={buscaBloqueado}
                        onChange={(e) => setBuscaBloqueado(e.target.value)}
                        placeholder="Pesquisar entre as contas bloqueadas..."
                        className="w-full bg-[#F9F8F6] border border-black/5 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 ring-artPurple/20 transition-all placeholder:text-gray-400"
                      />
                    </div>
                  )}

                  {(() => {
                    const filtrados = bloqueados.filter((blockedId) => {
                      if (!buscaBloqueado.trim()) return true;
                      const artistaObj = artistasCadastrados.find((a) => a.id === blockedId);
                      const nomeExibicao = artistaObj?.nome || `Usuário #${blockedId}`;
                      return nomeExibicao.toLowerCase().includes(buscaBloqueado.trim().toLowerCase());
                    });

                    if (bloqueados.length === 0) {
                      return (
                        <div className="bg-[#F9F8F6] rounded-2xl p-8 text-center text-gray-400 text-sm italic">
                          Nenhuma conta bloqueada no momento.
                        </div>
                      );
                    }

                    if (filtrados.length === 0) {
                      return (
                        <div className="bg-[#F9F8F6] rounded-2xl p-6 text-center text-gray-400 text-xs italic">
                          Nenhum usuário bloqueado encontrado para "{buscaBloqueado}".
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-black/5">
                        {filtrados.map((blockedId) => {
                          const artistaObj = artistasCadastrados.find((a) => a.id === blockedId);
                          const nomeExibicao = artistaObj?.nome || `Usuário #${blockedId}`;
                          const fotoExibicao = artistaObj?.fotoPerfil ? getMediaUrl(artistaObj.fotoPerfil) : "";

                          return (
                            <div
                              key={blockedId}
                              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
                            >
                              <div className="flex items-center gap-3">
                                {fotoExibicao ? (
                                  <img
                                    src={fotoExibicao}
                                    alt={nomeExibicao}
                                    className="w-10 h-10 rounded-full object-cover border border-black/5"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                    {nomeExibicao.charAt(0)}
                                  </div>
                                )}

                                <div>
                                  <span className="font-bold text-sm text-artDark block">
                                    {nomeExibicao}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    Status: Silenciado / Bloqueado
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const novos = bloqueados.filter((id) => id !== blockedId);
                                  setBloqueados(novos);
                                  localStorage.setItem("artfolio_blocked_users", JSON.stringify(novos));
                                  mostrarAviso(`${nomeExibicao} foi desbloqueado com sucesso!`, "success");
                                }}
                                className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 w-fit"
                              >
                                Desbloquear
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeTab === "assinatura" && isArtista && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Assinatura e Benefícios
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Seu Plano no Artfolio
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <PlanoCard
                      ativo={(planoInfo?.tipo || "Free").toLowerCase() === "free"}
                      titulo="Artfolio Free"
                      subtitulo="Essencial"
                      preco="Grátis"
                      periodo="sempre gratuito"
                      cor="artGreen"
                      recursos={[
                        "Postagem simples (1 página)",
                        "Chat livre e ilimitado",
                        "Moldura LED verde no perfil",
                      ]}
                      botao={(planoInfo?.tipo || "Free").toLowerCase() === "free" ? "Plano Atual" : "Selecionar"}
                      onClick={() => navigate("/planos")}
                    />

                    <PlanoCard
                      ativo={(planoInfo?.tipo || "").toLowerCase() === "pro"}
                      destaque
                      titulo="Artfolio Pro"
                      subtitulo="Profissional"
                      preco="R$ 29,90"
                      periodo="por mês"
                      cor="artPurple"
                      recursos={[
                        "Múltiplas páginas por post",
                        "Painel de Analytics e Pódio",
                        "Moldura LED roxa no perfil",
                      ]}
                      botao={(planoInfo?.tipo || "").toLowerCase() === "pro" ? "Plano Atual" : "Fazer Upgrade"}
                      onClick={() => navigate("/planos")}
                    />

                    <PlanoCard
                      ativo={(planoInfo?.tipo || "").toLowerCase() === "boost"}
                      titulo="Artfolio Boost"
                      subtitulo="Alcance Máximo"
                      preco="R$ 49,90"
                      periodo="por mês"
                      cor="artOrange"
                      recursos={[
                        "Arquivos até 100 MB",
                        "Mensagem inicial customizável",
                        "Moldura LED laranja no perfil",
                      ]}
                      botao={(planoInfo?.tipo || "").toLowerCase() === "boost" ? "Plano Atual" : "Fazer Upgrade"}
                      onClick={() => navigate("/planos")}
                    />
                  </div>

                  <div className="bg-artPurple/5 border border-artPurple/20 rounded-[1.5rem] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-artDark">Deseja mudar ou conhecer todos os recursos?</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Veja o comparativo detalhado e selecione o plano ideal para a sua carreira artística.
                      </p>
                    </div>
                    <Link
                      to="/planos"
                      className="bg-artDark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all shrink-0"
                    >
                      Ver Grade de Planos →
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </form>
        </div>
      </div>
  );
}

function ToggleOption({ title, description, active, onToggle, disabled = false, badge = null }) {
  return (
    <div className={`bg-[#F9F8F6] rounded-[1.5rem] p-4 flex items-center justify-between gap-4 ${disabled ? "opacity-60" : ""}`}>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm">{title}</h3>
          {badge}
        </div>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={disabled ? undefined : onToggle}
        disabled={disabled}
        className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${
          disabled ? "bg-gray-200 cursor-not-allowed" : active ? "bg-artPurple" : "bg-gray-300"
        }`}
      >
        <span
          className={`w-6 h-6 rounded-full bg-white block transition-all ${
            active && !disabled ? "translate-x-6" : "translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
}

function PlanoCard({ ativo, destaque, titulo, subtitulo, preco, periodo, cor = "artDark", recursos = [], botao, onClick }) {
  const configs = {
    artGreen: {
      corNome: "text-artGreen",
      corBorda: "border-artGreen/30 hover:border-artGreen",
      corBadge: "bg-artGreen text-white shadow-md shadow-artGreen/30",
      corBotao: "bg-[#F9F8F6] text-artDark border border-black/10 hover:bg-artGreen hover:text-white",
    },
    artPurple: {
      corNome: "text-artPurple",
      corBorda: "border-artPurple shadow-xl shadow-artPurple/15",
      corBadge: "bg-artPurple text-white shadow-md shadow-artPurple/30",
      corBotao: "bg-artPurple text-white hover:bg-indigo-700 shadow-lg shadow-artPurple/25",
    },
    artOrange: {
      corNome: "text-artOrange",
      corBorda: "border-artOrange/40 hover:border-artOrange",
      corBadge: "bg-artOrange text-white shadow-md shadow-artOrange/30",
      corBotao: "bg-artOrange text-white hover:bg-orange-600 shadow-lg shadow-artOrange/25",
    },
  };

  const cfg = configs[cor] || configs.artGreen;

  return (
    <div
      className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between ${
        ativo
          ? "ring-2 ring-artDark shadow-2xl scale-[1.02]"
          : cfg.corBorda
      }`}
    >
      {/* Badge de Destaque ou Plano Atual */}
      {ativo ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-artDark text-white px-3.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <i className="fa-solid fa-circle-check text-emerald-400 text-[9px]"></i>
          Seu Plano Ativo
        </span>
      ) : destaque ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-artPurple text-white px-3.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-md whitespace-nowrap">
          Mais Popular
        </span>
      ) : null}

      <div>
        <div className="flex items-center justify-between mb-3 mt-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.corNome}`}>
            {subtitulo}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${cfg.corBadge}`}>
            {titulo.replace("Artfolio ", "")}
          </span>
        </div>

        <h3 className="font-editorial text-2xl mb-1">{titulo}</h3>

        <div className="mb-5 flex items-baseline gap-1.5">
          <span className="font-editorial text-3xl font-bold">{preco}</span>
          <span className="text-xs text-gray-400 font-light">/{periodo}</span>
        </div>

        <ul className="text-xs text-gray-600 space-y-2 mb-6">
          {recursos.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <i className={`fa-solid fa-check text-[10px] mt-0.5 ${cfg.corNome}`}></i>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`w-full py-3 rounded-full text-xs font-bold transition-all ${
          ativo
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
            : cfg.corBotao
        }`}
      >
        {botao}
      </button>
    </div>
  );
}