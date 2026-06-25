import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const usuarioAtual = {
  nome: "Marina Silva",
  email: "marina@email.com",
  telefone: "(11) 99999-0000",
  tipoConta: "artista",
  plano: "FREE",
  perfilPublico: true,
  mostrarStats: false,
  notifEmail: true,
  notifSistema: true,
  notifModeracao: true,
  aceitaEncomendas: true,
  valorMinimo: "150,00",
  prazoPadrao: "10",
  bloqueados: ["Lucas Ferreira", "Gabriel Duarte"],
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
};

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("conta");
  const [noticeMessage, setNoticeMessage] = useState("");

  const [nome, setNome] = useState(usuarioAtual.nome);
  const [email, setEmail] = useState(usuarioAtual.email);
  const [telefone, setTelefone] = useState(usuarioAtual.telefone);
  const [tipoConta, setTipoConta] = useState(usuarioAtual.tipoConta);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [perfilPublico, setPerfilPublico] = useState(
    usuarioAtual.perfilPublico
  );
  const [mostrarStats, setMostrarStats] = useState(usuarioAtual.mostrarStats);

  const [notifEmail, setNotifEmail] = useState(usuarioAtual.notifEmail);
  const [notifSistema, setNotifSistema] = useState(
    usuarioAtual.notifSistema
  );
  const [notifModeracao, setNotifModeracao] = useState(
    usuarioAtual.notifModeracao
  );

  const [aceitaEncomendas, setAceitaEncomendas] = useState(
    usuarioAtual.aceitaEncomendas
  );
  const [valorMinimo, setValorMinimo] = useState(usuarioAtual.valorMinimo);
  const [prazoPadrao, setPrazoPadrao] = useState(usuarioAtual.prazoPadrao);

  const isArtista = tipoConta === "artista" || tipoConta === "galeria";

  const menuItems = [
    { id: "conta", label: "Conta", icon: "fa-solid fa-user" },
    {
      id: "seguranca",
      label: "Segurança",
      icon: "fa-solid fa-shield-halved",
    },
    {
      id: "privacidade",
      label: "Privacidade",
      icon: "fa-solid fa-eye-slash",
    },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: "fa-solid fa-bell",
    },
    ...(isArtista
      ? [
          {
            id: "encomendas",
            label: "Encomendas",
            icon: "fa-solid fa-handshake",
          },
        ]
      : []),
    {
      id: "bloqueados",
      label: "Bloqueados",
      icon: "fa-solid fa-ban",
    },
    ...(isArtista
      ? [
          {
            id: "assinatura",
            label: "Assinatura",
            icon: "fa-solid fa-crown",
          },
        ]
      : []),
  ];

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleSave = (event) => {
    event.preventDefault();

    mostrarAviso(
      "Com o backend integrado, estas configurações serão salvas no PostgreSQL."
    );
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

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
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
                className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple hover:shadow-lg hover:shadow-artPurple/20 transition-all active:scale-95 shrink-0"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                Salvar Alterações
              </button>
            </div>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
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

              <div className="bg-artDark rounded-[1.7rem] p-5 text-white relative overflow-hidden shadow-xl shadow-black/5">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Tipo de conta
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  {isArtista ? "Perfil artístico" : "Perfil de cliente"}
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  O tipo de conta define quais recursos aparecem na interface. O
                  backend fará esse controle real futuramente.
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
                    {usuarioAtual.plano === "PRO"
                      ? "Artfolio PRO"
                      : "Artfolio Free"}
                  </h3>

                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    A troca real de plano será controlada futuramente pelo
                    backend e pelo sistema de assinatura.
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveTab("assinatura")}
                    className="mt-4 w-full bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
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

                    <div className="w-12 h-12 rounded-full bg-artPurple overflow-hidden border-2 border-white shadow-lg shadow-black/10">
                      <img
                        src={usuarioAtual.avatar}
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
                        onChange={(event) => setEmail(event.target.value)}
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
                        onChange={(event) => setTelefone(event.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Tipo de conta
                      </label>

                      <select
                        value={tipoConta}
                        onChange={handleTipoContaChange}
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      >
                        <option value="cliente">Cliente</option>
                        <option value="artista">Artista</option>
                        <option value="galeria">Galeria</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 bg-artBlue/5 border border-artBlue/10 rounded-[1.5rem] p-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      A alteração real dos dados da conta será feita futuramente
                      pelo backend com validação, autenticação e persistência no
                      PostgreSQL.
                    </p>
                  </div>
                </div>
              )}

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
                      <h3 className="text-sm font-bold">
                        Dica de segurança
                      </h3>

                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        A troca real de senha será validada pelo backend. Evite
                        senhas curtas e reutilizadas em outros serviços.
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
                      description="Exibir visualizações e curtidas publicamente no portfólio."
                      active={mostrarStats}
                      onToggle={() => setMostrarStats(!mostrarStats)}
                    />
                  </div>

                  <div className="mt-5 bg-artBlue/5 border border-artBlue/10 rounded-[1.5rem] p-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      No backend, estas preferências controlarão o que aparece
                      no perfil público, no feed e nas páginas de obra.
                    </p>
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
                      title="Alertas de moderação"
                      description="Receber avisos quando suas obras mudarem de status na quarentena."
                      active={notifModeracao}
                      onToggle={() => setNotifModeracao(!notifModeracao)}
                    />
                  </div>
                </div>
              )}

              {activeTab === "encomendas" && isArtista && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                        Área comercial
                      </span>

                      <h2 className="font-editorial text-3xl italic">
                        Preferências de encomendas
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setAceitaEncomendas(!aceitaEncomendas)
                      }
                      className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${
                        aceitaEncomendas ? "bg-artBlue" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full bg-white block transition-all ${
                          aceitaEncomendas
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Ajuste se você está aberto a solicitações de artes ou
                    projetos personalizados de clientes.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Valor mínimo inicial (R$)
                      </label>

                      <input
                        type="text"
                        disabled={!aceitaEncomendas}
                        value={valorMinimo}
                        onChange={(event) =>
                          setValorMinimo(event.target.value)
                        }
                        placeholder="Ex: 150,00"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artBlue/20 text-sm disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Prazo padrão em dias
                      </label>

                      <input
                        type="number"
                        disabled={!aceitaEncomendas}
                        value={prazoPadrao}
                        onChange={(event) =>
                          setPrazoPadrao(event.target.value)
                        }
                        placeholder="Ex: 7"
                        className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artBlue/20 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="mt-5 bg-artBlue/5 border border-artBlue/10 rounded-[1.5rem] p-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Quando o backend estiver integrado, essas preferências
                      ajudarão a controlar se o botão de encomenda aparece no
                      perfil público do artista.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "bloqueados" && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-red-400 font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Filtros de interação
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Contas bloqueadas
                    </h2>
                  </div>

                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Usuários bloqueados não poderão enviar mensagens, solicitar
                    encomendas ou interagir com seu perfil quando o backend
                    estiver integrado.
                  </p>

                  {usuarioAtual.bloqueados.length === 0 ? (
                    <div className="bg-[#F9F8F6] rounded-2xl p-8 text-center text-gray-400 text-sm italic">
                      Nenhuma conta bloqueada.
                    </div>
                  ) : (
                    <div className="divide-y divide-black/5">
                      {usuarioAtual.bloqueados.map((user) => (
                        <div
                          key={user}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center font-bold text-xs text-gray-600">
                              {user.charAt(0)}
                            </div>

                            <span className="font-bold text-sm">{user}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleAcaoFutura(
                                `O desbloqueio real de ${user} será integrado ao backend.`
                              )
                            }
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                          >
                            Desbloquear futuramente
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "assinatura" && isArtista && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6 transition-all duration-300">
                  <div className="mb-6">
                    <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Monetização
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Plano de assinatura
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <PlanoCard
                      ativo={usuarioAtual.plano === "FREE"}
                      titulo="FREE"
                      subtitulo="Plano gratuito"
                      descricao={[
                        "Limite de postagens básico",
                        "Receber mensagens de clientes",
                        "Estatísticas avançadas bloqueadas",
                      ]}
                      botao="Plano atual"
                      onClick={() =>
                        handleAcaoFutura(
                          "A alteração real de plano será integrada ao backend."
                        )
                      }
                    />

                    <PlanoCard
                      ativo={usuarioAtual.plano === "PRO"}
                      destaque
                      titulo="PRO"
                      subtitulo="R$ 29,90 / mês"
                      descricao={[
                        "Obras ilimitadas",
                        "Estatísticas de visualização completas",
                        "Destaque de portfólio no feed",
                      ]}
                      botao="Assinar futuramente"
                      onClick={() =>
                        handleAcaoFutura(
                          "A assinatura real do plano PRO será integrada futuramente."
                        )
                      }
                    />
                  </div>

                  <div className="bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      O sistema de planos será integrado ao backend e ao banco de
                      dados. Por enquanto, esta tela representa apenas a
                      interface visual da assinatura.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}

function ToggleOption({ title, description, active, onToggle }) {
  return (
    <div className="bg-[#F9F8F6] rounded-[1.5rem] p-4 flex items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-sm">{title}</h3>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`w-14 h-8 rounded-full p-1 transition-all shrink-0 ${
          active ? "bg-artPurple" : "bg-gray-300"
        }`}
      >
        <span
          className={`w-6 h-6 rounded-full bg-white block transition-all ${
            active ? "translate-x-6" : "translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
}

function PlanoCard({ ativo, destaque, titulo, subtitulo, descricao, botao, onClick }) {
  return (
    <div
      className={`p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden ${
        ativo
          ? destaque
            ? "border-artPurple bg-artPurple/5"
            : "border-artDark bg-[#F9F8F6]"
          : "border-black/5 hover:border-black/10"
      }`}
    >
      <h3 className="font-editorial text-2xl mb-1">{titulo}</h3>

      <p
        className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${
          destaque ? "text-artPurple" : "text-gray-400"
        }`}
      >
        {subtitulo}
      </p>

      <ul className="text-xs text-gray-500 space-y-2 mb-6">
        {descricao.map((item) => (
          <li key={item}>
            <i
              className={`fa-solid fa-check mr-2 ${
                destaque ? "text-artPurple" : "text-artOrange"
              }`}
            ></i>
            {item}
          </li>
        ))}
      </ul>

      {ativo ? (
        <span
          className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
            destaque ? "bg-artPurple text-white" : "bg-artDark text-white"
          }`}
        >
          Ativo
        </span>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`w-full px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
            destaque
              ? "bg-artPurple text-white hover:bg-artDark"
              : "bg-white border border-black/10 hover:bg-artDark hover:text-white"
          }`}
        >
          {botao}
        </button>
      )}
    </div>
  );
}