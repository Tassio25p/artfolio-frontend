import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { getMediaUrl } from "../services/api";
import { getAvatarLedStyle } from "../utils/obraHelper";

function getMenuByUser(tipo, isGuest) {
  if (isGuest || tipo === "visitante") {
    return [
      {
        title: "Feed",
        icon: "fa-solid fa-house",
        to: "/feed",
        active: "bg-white text-artPurple shadow-md ring-2 ring-artPurple/20",
        inactive: "text-artPurple/80 bg-artPurple/[0.05]",
        hoverBg: "bg-artPurple",
      },
      {
        title: "Buscar",
        icon: "fa-solid fa-magnifying-glass",
        to: "/buscar",
        active: "bg-white text-artBlue shadow-md ring-2 ring-artBlue/20",
        inactive: "text-artBlue/80 bg-artBlue/[0.05]",
        hoverBg: "bg-artBlue",
      },
    ];
  }

  const baseItems = [
    {
      title: "Feed",
      icon: "fa-solid fa-house",
      to: "/feed",
      active: "bg-white text-artPurple shadow-md ring-2 ring-artPurple/20",
      inactive: "text-artPurple/80 bg-artPurple/[0.05]",
      hoverBg: "bg-artPurple",
    },
    {
      title: "Buscar",
      icon: "fa-solid fa-magnifying-glass",
      to: "/buscar",
      active: "bg-white text-artBlue shadow-md ring-2 ring-artBlue/20",
      inactive: "text-artBlue/80 bg-artBlue/[0.05]",
      hoverBg: "bg-artBlue",
    },
    {
      title: "Mensagens",
      icon: "fa-solid fa-message",
      to: "/mensagens",
      active: "bg-white text-artGreen shadow-md ring-2 ring-artGreen/20",
      inactive: "text-artGreen/80 bg-artGreen/[0.05]",
      hoverBg: "bg-artGreen",
    },
    {
      title: "Notificações",
      icon: "fa-solid fa-bell",
      to: "/notificacoes",
      active: "bg-white text-artOrange shadow-md ring-2 ring-artOrange/20",
      inactive: "text-artOrange/80 bg-artOrange/[0.05]",
      hoverBg: "bg-artOrange",
      isNotificacao: true,
    },
    {
      title: "Assinatura",
      icon: "fa-solid fa-gem",
      to: "/planos",
      active: "bg-white text-artOrange shadow-md ring-2 ring-artOrange/20",
      inactive: "text-amber-500 bg-amber-500/[0.06]",
      hoverBg: "bg-gradient-to-r from-amber-500 to-artOrange",
    },
  ];

  const roleItems = [];

  if (tipo === "artista" || tipo === "cliente" || tipo === "admin" || tipo === "moderador") {
    roleItems.push(
      {
        title: "Criar Obra",
        icon: "fa-solid fa-plus",
        to: "/criar-obra",
        active: "bg-artDark text-white shadow-lg shadow-artDark/30 ring-2 ring-artOrange",
        inactive: "bg-gradient-to-r from-artOrange to-[#e55039] text-white shadow-md shadow-artOrange/25 hover:scale-105 hover:shadow-lg hover:shadow-artOrange/30",
        isSpecialButton: true,
      },
      {
        title: "Minhas Obras",
        icon: "fa-solid fa-palette",
        to: "/meu-portfolio",
        active: "bg-white text-artBlue shadow-md ring-2 ring-artBlue/20",
        inactive: "text-artBlue/80 bg-artBlue/[0.05]",
        hoverBg: "bg-artBlue",
      },
      {
        title: "Estatísticas",
        icon: "fa-solid fa-chart-line",
        to: "/estatisticas",
        active: "bg-white text-artPurple shadow-md ring-2 ring-artPurple/20",
        inactive: "text-artPurple/80 bg-artPurple/[0.05]",
        hoverBg: "bg-artPurple",
      }
    );
  }

  if (tipo === "admin" || tipo === "moderador") {
    roleItems.push({
      title: "Moderação",
      customLetter: "M",
      icon: "fa-solid fa-shield-halved",
      to: "/admin",
      active: "bg-artOrange text-white shadow-md shadow-artOrange/20 ring-2 ring-artOrange/30",
      inactive: "text-artOrange bg-artOrange/10",
      hoverBg: "bg-artOrange",
    });
  }

  return [...baseItems, ...roleItems];
}

// CONFIGURAÇÕES DE TAMANHO:
// - Título: 13px vertical (compacto, elegante, libera altura para os botões)
// - Botões: 42px × 42px perfeitamente quadrados (1:1)
// - Distribuição: justify-between preenchendo o espaço disponível sem exigir rolagem
const SQUARE_BTN = {
  width: "42px",
  height: "42px",
  minWidth: "42px",
  minHeight: "42px",
  maxWidth: "42px",
  maxHeight: "42px",
  aspectRatio: "1 / 1",
};

export default function Sidebar() {
  const { naoLidasCount, unreadCount, markAllAsRead } = useNotifications();
  const naoLidas = naoLidasCount ?? unreadCount ?? 0;
  const { user, isGuest, logout } = useAuth();
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const handlePrefs = () => setTick((t) => t + 1);
    window.addEventListener("artfolio_profile_prefs_changed", handlePrefs);
    return () => window.removeEventListener("artfolio_profile_prefs_changed", handlePrefs);
  }, []);

  const tipoUsuario = user?.tipo_conta || (isGuest ? "visitante" : "artista");
  const fotoPerfil = user?.fotoPerfil || null;
  const [avatarImgError, setAvatarImgError] = React.useState(false);
  const menuItems = getMenuByUser(tipoUsuario, isGuest);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed left-0 top-0 h-screen max-h-screen w-20 border-r border-black/5 bg-[#F9F8F6] z-50 flex flex-col items-center justify-between py-2 shadow-xs select-none overflow-y-auto no-scrollbar">
      {/* Barra de LED contínua de ponta a ponta */}
      <div className="absolute right-0 top-0 bottom-0 w-1.5 animate-led-flow pointer-events-none z-10"></div>

      {/* 1. TÍTULO ARTFOLIO VERTICAL (Área reservada no topo, reduzido para economizar altura) */}
      <div className="shrink-0 flex items-center justify-center pt-1 pb-1">
        <div
          title="Artfolio"
          style={{ fontSize: "13px", letterSpacing: "0.16em", lineHeight: "1" }}
          className="font-editorial font-black text-artOrange rotate-180 [writing-mode:vertical-rl] uppercase select-none inline-block text-center mx-auto cursor-default drop-shadow-2xs"
        >
          Artfolio
        </div>
      </div>

      {/* Divisor sutil entre o título e os botões */}
      <div className="w-4 h-px bg-black/10 shrink-0 my-0.5"></div>

      {/* 2. CORPO DE BOTÕES */}
      {isGuest ? (
        /* Layout empilhado e encaixado exclusivo para VISITANTE */
        <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-start gap-2.5 pt-2 my-0">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.title}
              style={SQUARE_BTN}
              className={({ isActive }) =>
                `group relative rounded-xl shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300 focus:outline-none hover:-translate-y-0.5 hover:shadow-md ${
                  isActive
                    ? `${item.active} scale-105`
                    : `${item.inactive} border border-black/5`
                }`
              }
            >
              {() => (
                <>
                  <span
                    className={`absolute inset-0 w-full h-full ${item.hoverBg || "bg-artPurple"} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none z-0`}
                  />

                  <i
                    className={`${item.icon} relative z-10 text-base transition-all duration-500 ease-out group-hover:[transform:rotateY(360deg)] group-hover:text-white`}
                  />

                  <span className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 rounded-xl bg-artDark text-white text-xs font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Divisor sutil entre navegação e entrar */}
          <div className="w-4 h-px bg-black/10 shrink-0 my-0.5"></div>

          {/* Botão de Entrar / Cadastrar empilhado logo abaixo */}
          <Link
            to="/login"
            title="Entrar ou Cadastrar"
            style={SQUARE_BTN}
            className="group relative rounded-xl bg-artPurple text-white flex items-center justify-center text-sm font-bold hover:bg-artDark transition-all duration-300 shadow-md shadow-artPurple/20 hover:-translate-y-0.5 overflow-hidden focus:outline-none shrink-0"
          >
            <i className="fa-solid fa-right-to-bracket relative z-10 text-base transition-transform duration-500 ease-out group-hover:[transform:rotateY(360deg)]"></i>
            <span className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3.5 py-1.5 rounded-xl bg-artDark text-white text-xs font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
              Entrar / Cadastrar
            </span>
          </Link>
        </div>
      ) : (
        /* Layout completo padrão para USUÁRIO LOGADO */
        <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-between py-1 max-h-[820px] my-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.title}
              style={SQUARE_BTN}
              onClick={() => {
                if (item.isNotificacao && naoLidas > 0) {
                  markAllAsRead();
                }
              }}
              className={({ isActive }) =>
                `group relative rounded-xl shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300 focus:outline-none hover:-translate-y-0.5 hover:shadow-md ${
                  isActive
                    ? `${item.active} scale-105`
                    : `${item.inactive} border border-black/5`
                }`
              }
            >
              {() => (
                <>
                  {!item.isSpecialButton && (
                    <span
                      className={`absolute inset-0 w-full h-full ${item.hoverBg || "bg-artPurple"} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none z-0`}
                    />
                  )}

                  {item.customLetter ? (
                    <span className="relative z-10 font-editorial font-black text-xl leading-none tracking-tighter transition-all duration-500 ease-out group-hover:[transform:rotateY(360deg)] group-hover:text-white select-none">
                      {item.customLetter}
                    </span>
                  ) : (
                    <i
                      className={`${item.icon} relative z-10 text-base transition-all duration-500 ease-out group-hover:[transform:rotateY(360deg)] group-hover:text-white ${
                        item.isSpecialButton ? "text-white" : ""
                      }`}
                    />
                  )}

                  {item.isNotificacao && naoLidas > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-artOrange text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#F9F8F6] animate-pulse z-20">
                      {naoLidas > 9 ? "9+" : naoLidas}
                    </span>
                  )}

                  <span className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 rounded-xl bg-artDark text-white text-xs font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Separador sutil entre navegação e ações de conta */}
          <div className="w-4 h-px bg-black/10 shrink-0"></div>
          <>
            {/* Avatar de Perfil Quadrado 1:1 */}
            <NavLink
              to="/perfil"
              title="Meu Perfil"
              style={{
                ...getAvatarLedStyle(user, true).style,
                ...SQUARE_BTN,
              }}
              className={() => {
                const led = getAvatarLedStyle(user, true);
                const temFotoValida = fotoPerfil && !avatarImgError;
                return `group relative rounded-xl border-2 border-white hover:scale-105 transition-all duration-300 overflow-hidden focus:outline-none shrink-0 flex items-center justify-center shadow-sm ${led.className} ${
                  temFotoValida ? "" : "bg-gradient-to-tr from-artPurple via-indigo-600 to-artBlue"
                }`;
              }}
            >
              {fotoPerfil && !avatarImgError ? (
                <img
                  src={getMediaUrl(fotoPerfil)}
                  alt="Perfil"
                  onError={() => setAvatarImgError(true)}
                  className="w-full h-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <span className="text-white text-base font-black flex items-center justify-center h-full w-full">
                  {user?.nome ? user.nome.charAt(0).toUpperCase() : "A"}
                </span>
              )}

              <span className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3.5 py-1.5 rounded-xl bg-artDark text-white text-xs font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Meu Perfil
              </span>
            </NavLink>

            {/* Configurações */}
            <NavLink
              to="/configuracoes"
              title="Configurações"
              style={SQUARE_BTN}
              className={({ isActive }) =>
                `group relative rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 focus:outline-none shrink-0 hover:-translate-y-0.5 hover:shadow-md ${
                  isActive
                    ? "bg-white text-artBlue shadow-md ring-2 ring-artBlue/20"
                    : "text-gray-500 bg-white/80 border border-black/5"
                }`
              }
            >
              {() => (
                <>
                  <span className="absolute inset-0 w-full h-full bg-artBlue translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none z-0" />
                  <i className="fa-solid fa-gear text-base relative z-10 transition-all duration-500 ease-out group-hover:[transform:rotateY(360deg)] group-hover:text-white"></i>

                  <span className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3.5 py-1.5 rounded-xl bg-artDark text-white text-xs font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                    Configurações
                  </span>
                </>
              )}
            </NavLink>

            {/* Sair */}
            <button
              type="button"
              onClick={handleLogout}
              title="Sair da conta"
              style={SQUARE_BTN}
              className="group relative rounded-xl flex items-center justify-center text-gray-400 bg-white/80 hover:shadow-sm border border-black/5 hover:-translate-y-0.5 overflow-hidden transition-all duration-300 focus:outline-none shrink-0 cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-artOrange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none z-0" />
              <i className="fa-solid fa-right-from-bracket text-base relative z-10 transition-all duration-500 ease-out group-hover:[transform:rotateY(360deg)] group-hover:text-white"></i>

              <span className="absolute left-20 top-1/2 -translate-y-1/2 ml-2 px-3.5 py-1.5 rounded-xl bg-artDark text-white text-xs font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Sair
              </span>
            </button>
          </>
        </div>
      )}
    </nav>
  );
}