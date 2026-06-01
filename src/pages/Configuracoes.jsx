import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("conta");
  const [successMessage, setSuccessMessage] = useState("");

  // Simulated User Data (States)
  const [nome, setNome] = useState(() => localStorage.getItem("artfolio_nome") || "Marina Silva");
  const [email, setEmail] = useState(() => localStorage.getItem("artfolio_email") || "marina@email.com");
  const [telefone, setTelefone] = useState(() => localStorage.getItem("artfolio_telefone") || "(11) 99999-0000");
  const [tipoConta, setTipoConta] = useState(() => localStorage.getItem("artfolio_tipo_conta") || "artista");

  // Simulated Plan
  const [plano, setPlano] = useState(() => localStorage.getItem("artfolio_plano") || "FREE");

  // Simulated Privacy
  const [perfilPublico, setPerfilPublico] = useState(() => localStorage.getItem("artfolio_perfil_publico") !== "false");
  const [mostrarStats, setMostrarStats] = useState(() => localStorage.getItem("artfolio_mostrar_stats") === "true");

  // Simulated Notifications
  const [notifEmail, setNotifEmail] = useState(() => localStorage.getItem("artfolio_notif_email") !== "false");
  const [notifMod, setNotifMod] = useState(() => localStorage.getItem("artfolio_notif_mod") !== "false");

  // Simulated Commercial Preferences
  const [aceitaEncomendas, setAceitaEncomendas] = useState(() => localStorage.getItem("artfolio_aceita_encomendas") !== "false");
  const [valorMinimo, setValorMinimo] = useState(() => localStorage.getItem("artfolio_valor_minimo") || "150,00");
  const [prazoPadrao, setPrazoPadrao] = useState(() => localStorage.getItem("artfolio_prazo_padrao") || "10");

  // Simulated Blocked Accounts
  const [bloqueados, setBloqueados] = useState(() => {
    const saved = localStorage.getItem("artfolio_bloqueados");
    return saved ? JSON.parse(saved) : ["Lucas Ferreira", "Gabriel Duarte"];
  });

  // Save changes handler
  const handleSave = () => {
    localStorage.setItem("artfolio_nome", nome);
    localStorage.setItem("artfolio_email", email);
    localStorage.setItem("artfolio_telefone", telefone);
    localStorage.setItem("artfolio_tipo_conta", tipoConta);
    localStorage.setItem("artfolio_plano", plano);
    localStorage.setItem("artfolio_perfil_publico", perfilPublico);
    localStorage.setItem("artfolio_mostrar_stats", mostrarStats);
    localStorage.setItem("artfolio_notif_email", notifEmail);
    localStorage.setItem("artfolio_notif_mod", notifMod);
    localStorage.setItem("artfolio_aceita_encomendas", aceitaEncomendas);
    localStorage.setItem("artfolio_valor_minimo", valorMinimo);
    localStorage.setItem("artfolio_prazo_padrao", prazoPadrao);
    localStorage.setItem("artfolio_bloqueados", JSON.stringify(bloqueados));

    setSuccessMessage("Configurações salvas com sucesso!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Toggle Plan helper
  const togglePlan = (newPlan) => {
    setPlano(newPlan);
    localStorage.setItem("artfolio_plano", newPlan);
    setSuccessMessage(`Plano alterado para ${newPlan} com sucesso!`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Unblock user handler
  const handleUnblock = (user) => {
    const updated = bloqueados.filter(item => item !== user);
    setBloqueados(updated);
    localStorage.setItem("artfolio_bloqueados", JSON.stringify(updated));
    setSuccessMessage(`Usuário ${user} desbloqueado.`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Preferências da conta
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Configurações
                <span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl">
                Ajuste sua conta, segurança, privacidade, preferências de encomendas
                e plano de assinatura dentro do Artfolio.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {successMessage && (
                <span className="text-xs bg-artGreen/10 text-artGreen px-4 py-3 rounded-full font-bold animate-pulse">
                  <i className="fa-solid fa-circle-check mr-1.5"></i>
                  {successMessage}
                </span>
              )}

              <button
                onClick={handleSave}
                className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple hover:shadow-lg hover:shadow-artPurple/20 transition-all active:scale-95 shrink-0"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                Salvar Alterações
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar de Configurações */}
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Menu
                </h2>

                <div className="flex flex-col gap-2">
                  {[
                    { id: "conta", label: "Conta", icon: "fa-solid fa-user" },
                    { id: "seguranca", label: "Segurança", icon: "fa-solid fa-shield-halved" },
                    { id: "privacidade", label: "Privacidade", icon: "fa-solid fa-eye-slash" },
                    { id: "encomendas", label: "Encomendas", icon: "fa-solid fa-handshake" },
                    { id: "bloqueados", label: "Contas Bloqueadas", icon: "fa-solid fa-ban" },
                    { id: "assinatura", label: "Assinatura", icon: "fa-solid fa-crown" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-all duration-300 flex items-center gap-2.5 ${
                        activeTab === item.id
                          ? "bg-artDark text-white shadow-md shadow-black/10"
                          : "bg-[#F9F8F6] text-gray-400 hover:text-artDark hover:bg-[#eae7df]"
                      }`}
                    >
                      <i className={item.icon}></i>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informações Rápidas do Plano */}
              <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden shadow-xl shadow-black/5">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Plano Atual
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  {plano === "PRO" ? "Artfolio PRO ativo" : "Artfolio Entusiasta"}
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  {plano === "PRO"
                    ? "Você possui acesso livre a estatísticas de perfil, visualizações de obras e encomendas de clientes."
                    : "Assine o plano PRO para desbloquear estatísticas de visualização avançadas e recursos comerciais."}
                </p>

                <button
                  onClick={() => togglePlan(plano === "PRO" ? "FREE" : "PRO")}
                  className={`mt-4 w-full px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                    plano === "PRO"
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-white hover:bg-artPurple hover:text-white text-artDark"
                  }`}
                >
                  {plano === "PRO" ? "Alternar para Free" : "Fazer Upgrade para PRO"}
                </button>

                <i className="fa-solid fa-crown absolute -right-4 -bottom-5 text-[5rem] text-white/5 rotate-12"></i>
              </div>
            </aside>

            {/* Conteúdo Dinâmico */}
            <section className="lg:col-span-9 space-y-5">
              
              {/* TAB 1: CONTA */}
              {activeTab === "conta" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                        Dados principais
                      </span>
                      <h2 className="font-editorial text-3xl italic">
                        Informações da conta
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-full bg-artPurple overflow-hidden border-2 border-white shadow-lg shadow-black/10">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
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
                        onChange={(e) => setNome(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Tipo de conta
                      </label>
                      <select
                        value={tipoConta}
                        onChange={(e) => setTipoConta(e.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      >
                        <option value="artista">Artista</option>
                        <option value="galeria">Galeria</option>
                        <option value="colecionador">Colecionador</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEGURANÇA */}
              {activeTab === "seguranca" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Proteção
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Segurança da conta
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Senha atual
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Nova senha
                      </label>
                      <input
                        type="password"
                        placeholder="Digite a nova senha"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-5 bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4 flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Dica de segurança</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Use uma senha forte com letras, números e símbolos para
                        proteger a integridade do seu portfólio.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRIVACIDADE & NOTIFICAÇÕES */}
              {activeTab === "privacidade" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Preferências
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Privacidade e Notificações
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Toggles */}
                    <div className="bg-[#F9F8F6] rounded-[1.5rem] p-4 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sm">Perfil Público</h3>
                        <p className="text-xs text-gray-400 mt-1">Permitir que visitantes encontrem seu portfólio no feed.</p>
                      </div>
                      <button
                        onClick={() => setPerfilPublico(!perfilPublico)}
                        className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${perfilPublico ? "bg-artPurple" : "bg-gray-300"}`}
                      >
                        <span className={`w-6 h-6 rounded-full bg-white block transition-all ${perfilPublico ? "translate-x-6" : "translate-x-0"}`}></span>
                      </button>
                    </div>

                    <div className="bg-[#F9F8F6] rounded-[1.5rem] p-4 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sm">Mostrar estatísticas no perfil</h3>
                        <p className="text-xs text-gray-400 mt-1">Exibir visualizações e curtidas publicamente no portfólio.</p>
                      </div>
                      <button
                        onClick={() => setMostrarStats(!mostrarStats)}
                        className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${mostrarStats ? "bg-artPurple" : "bg-gray-300"}`}
                      >
                        <span className={`w-6 h-6 rounded-full bg-white block transition-all ${mostrarStats ? "translate-x-6" : "translate-x-0"}`}></span>
                      </button>
                    </div>

                    <div className="bg-[#F9F8F6] rounded-[1.5rem] p-4 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sm">Notificações por E-mail</h3>
                        <p className="text-xs text-gray-400 mt-1">Receber avisos sobre novas mensagens e interações.</p>
                      </div>
                      <button
                        onClick={() => setNotifEmail(!notifEmail)}
                        className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${notifEmail ? "bg-artPurple" : "bg-gray-300"}`}
                      >
                        <span className={`w-6 h-6 rounded-full bg-white block transition-all ${notifEmail ? "translate-x-6" : "translate-x-0"}`}></span>
                      </button>
                    </div>

                    <div className="bg-[#F9F8F6] rounded-[1.5rem] p-4 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sm">Alertas de Moderação</h3>
                        <p className="text-xs text-gray-400 mt-1">Receber avisos instantâneos quando suas obras mudarem de status de quarentena.</p>
                      </div>
                      <button
                        onClick={() => setNotifMod(!notifMod)}
                        className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${notifMod ? "bg-artPurple" : "bg-gray-300"}`}
                      >
                        <span className={`w-6 h-6 rounded-full bg-white block transition-all ${notifMod ? "translate-x-6" : "translate-x-0"}`}></span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ENCOMENDAS */}
              {activeTab === "encomendas" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                        Área Comercial
                      </span>
                      <h2 className="font-editorial text-3xl italic">
                        Preferências de Encomendas
                      </h2>
                    </div>

                    <button
                      onClick={() => setAceitaEncomendas(!aceitaEncomendas)}
                      className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${aceitaEncomendas ? "bg-artBlue" : "bg-gray-300"}`}
                    >
                      <span className={`w-6 h-6 rounded-full bg-white block transition-all ${aceitaEncomendas ? "translate-x-6" : "translate-x-0"}`}></span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mb-6">
                    Ajuste se você está aberto a solicitações de artes ou projetos personalizados de clientes e configure as métricas padrão de negociação.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-90 transition-opacity">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Valor Mínimo Inicial (R$)
                      </label>
                      <input
                        type="text"
                        disabled={!aceitaEncomendas}
                        value={valorMinimo}
                        onChange={(e) => setValorMinimo(e.target.value)}
                        placeholder="Ex: 150,00"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artBlue/20 text-sm disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Prazo de Entrega Padrão (dias)
                      </label>
                      <input
                        type="number"
                        disabled={!aceitaEncomendas}
                        value={prazoPadrao}
                        onChange={(e) => setPrazoPadrao(e.target.value)}
                        placeholder="Ex: 7"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artBlue/20 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONTAS BLOQUEADAS */}
              {activeTab === "bloqueados" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-red-400 font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Filtros de interação
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Contas Bloqueadas
                    </h2>
                  </div>

                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Usuários bloqueados não podem enviar mensagens, solicitar encomendas ou ver publicações no seu perfil.
                  </p>

                  {bloqueados.length === 0 ? (
                    <div className="bg-[#F9F8F6] rounded-2xl p-8 text-center text-gray-400 text-sm italic">
                      Nenhuma conta bloqueada.
                    </div>
                  ) : (
                    <div className="divide-y divide-black/5">
                      {bloqueados.map((user) => (
                        <div key={user} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center font-bold text-xs text-gray-600">
                              {user.charAt(0)}
                            </div>
                            <span className="font-bold text-sm">{user}</span>
                          </div>

                          <button
                            onClick={() => handleUnblock(user)}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                          >
                            Desbloquear
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: ASSINATURA */}
              {activeTab === "assinatura" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Monetização
                    </span>
                    <h2 className="font-editorial text-3xl italic">
                      Plano de Assinatura
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {/* Plano FREE Card */}
                    <div className={`p-6 rounded-[2rem] border-2 transition-all relative ${
                      plano === "FREE"
                        ? "border-artDark bg-[#F9F8F6]"
                        : "border-black/5 hover:border-black/10"
                    }`}>
                      <h3 className="font-editorial text-2xl mb-1">FREE (Entusiasta)</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Plano Gratuito</p>
                      
                      <ul className="text-xs text-gray-500 space-y-2 mb-6">
                        <li><i className="fa-solid fa-check text-artOrange mr-2"></i>Limite de postagens básico</li>
                        <li><i className="fa-solid fa-check text-artOrange mr-2"></i>Receber mensagens de clientes</li>
                        <li><i className="fa-solid fa-xmark text-red-400 mr-2"></i>Estatísticas avançadas bloqueadas</li>
                      </ul>

                      {plano === "FREE" ? (
                        <span className="absolute top-6 right-6 bg-artDark text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                          Ativo
                        </span>
                      ) : (
                        <button
                          onClick={() => togglePlan("FREE")}
                          className="w-full bg-white border border-black/10 hover:bg-artDark hover:text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all"
                        >
                          Mudar para FREE
                        </button>
                      )}
                    </div>

                    {/* Plano PRO Card */}
                    <div className={`p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden ${
                      plano === "PRO"
                        ? "border-artPurple bg-artPurple/5"
                        : "border-black/5 hover:border-black/10"
                    }`}>
                      <h3 className="font-editorial text-2xl mb-1">PRO</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-artPurple mb-4">R$ 29,90 / mês</p>

                      <ul className="text-xs text-gray-500 space-y-2 mb-6">
                        <li><i className="fa-solid fa-check text-artPurple mr-2"></i>Obras ilimitadas</li>
                        <li><i className="fa-solid fa-check text-artPurple mr-2"></i>Estatísticas de visualização completas</li>
                        <li><i className="fa-solid fa-check text-artPurple mr-2"></i>Destaque de portfólio no feed</li>
                      </ul>

                      {plano === "PRO" ? (
                        <span className="absolute top-6 right-6 bg-artPurple text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                          Ativo
                        </span>
                      ) : (
                        <button
                          onClick={() => togglePlan("PRO")}
                          className="w-full bg-artPurple text-white hover:bg-artDark px-4 py-2.5 rounded-full text-xs font-bold transition-all hover:shadow-lg hover:shadow-artPurple/10"
                        >
                          Assinar PRO
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}