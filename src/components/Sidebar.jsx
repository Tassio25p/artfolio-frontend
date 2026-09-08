import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { getMediaUrl } from "../services/api";

function getMenuByUser(tipo, isGuest) {
  if (isGuest || tipo === "visitante") {
    return [
      {
        title: "Feed",
        icon: "fa-solid fa-house",
        to: "/feed",
        active: "bg-white text-artPurple shadow-md ring-2 ring-artPurple/20",
        inactive: "text-artPurple/80 bg-artPurple/[0.05] hover:bg-artPurple/15 hover:text-artPurple",
      },
      {
        title: "Buscar",
        icon: "fa-solid fa-magnifying-glass",
        to: "/buscar",
        active: "bg-white text-artBlue shadow-md ring-2 ring-artBlue/20",
        inactive: "text-artBlue/80 bg-artBlue/[0.05] hover:bg-artBlue/15 hover:text-artBlue",
      },
    ];
  }

  const baseItems = [
    {
      title: "Feed",
      icon: "fa-solid fa-house",
      to: "/feed",
      active: "bg-white text-artPurple shadow-md ring-2 ring-artPurple/20",
      inactive: "text-artPurple/80 bg-artPurple/[0.05] hover:bg-artPurple/15 hover:text-artPurple",
    },
    {
      title: "Buscar",
      icon: "fa-solid fa-magnifying-glass",
      to: "/buscar",
      active: "bg-white text-artBlue shadow-md ring-2 ring-artBlue/20",
      inactive: "text-artBlue/80 bg-artBlue/[0.05] hover:bg-artBlue/15 hover:text-artBlue",
    },
    {
      title: "Mensagens",
      icon: "fa-solid fa-message",
      to: "/mensagens",
      active: "bg-white text-artGreen shadow-md ring-2 ring-artGreen/20",
      inactive: "text-artGreen/80 bg-artGreen/[0.05] hover:bg-artGreen/15 hover:text-artGreen",
    },
    {
      title: "Notificações",
      icon: "fa-solid fa-bell",
      to: "/notificacoes",
      active: "bg-white text-artOrange shadow-md ring-2 ring-artOrange/20",
      inactive: "text-artOrange/80 bg-artOrange/[0.05] hover:bg-artOrange/15 hover:text-artOrange",
      isNotificacao: true,
    },
    {
      title: "Assinatura",
      icon: "fa-solid fa-gem",
      to: "/planos",
      active: "bg-white text-artOrange shadow-md ring-2 ring-artOrange/20",
      inactive: "text-amber-500 bg-amber-500/[0.06] hover:bg-artOrange/15 hover:text-artOrange",
      isGradient: true,
    },
  ];

  const roleItems = [];

  // Qualquer usuário autenticado (artista) tem acesso às ferramentas criativas
  if (tipo === "artista" || tipo === "cliente") {
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
        inactive: "text-artBlue/80 bg-artBlue/[0.05] hover:bg-artBlue/15 hover:text-artBlue",
      },
      {
        title: "Estatísticas",
        icon: "fa-solid fa-chart-line",
        to: "/estatisticas",
        active: "bg-white text-artPurple shadow-md ring-2 ring-artPurple/20",
        inactive: "text-artPurple/80 bg-artPurple/[0.05] hover:bg-artPurple/15 hover:text-artPurple",
      }
    );
  }

  if (tipo === "admin" || tipo === "moderador") {
    roleItems.push({
      title: "Admin",
      icon: "fa-solid fa-shield-halved",
      to: "/admin",
      active: "bg-artOrange text-white shadow-md shadow-artOrange/20",
      inactive: "text-artOrange bg-artOrange/10 hover:bg-artOrange/20",
    });
  }

  return [...baseItems, ...roleItems];
}

export default function Sidebar() {
  const { naoLidasCount, unreadCount, markAllAsRead } = useNotifications();
  const naoLidas = naoLidasCount ?? unreadCount ?? 0;
  const { user, isGuest, logout } = useAuth();

  const tipoUsuario = user?.tipo_conta || (isGuest ? "visitante" : "artista");
  const fotoPerfil = user?.fotoPerfil || null;
  const menuItems = getMenuByUser(tipoUsuario, isGuest);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-14 border-r border-black/5 bg-[#F9F8F6] z-50 flex flex-col items-center justify-between py-5 shadow-xs">
      <NavLink
        to="/feed"
        title="Artfolio"
        className="font-editorial text-xl font-black text-artOrange rotate-180 [writing-mode:vertical-rl] uppercase tracking-tight hover:scale-105 transition-transform duration-300"
      >
        Artfolio
      </NavLink>

      <div className="flex flex-col items-center gap-2.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.title}
            onClick={() => {
              if (item.isNotificacao && naoLidas > 0) {
                markAllAsRead();
              }
            }}
            className={({ isActive }) =>
              `group relative w-10 h-10 rounded-2xl flex items-center justify-center text-sm transition-all duration-300 ${isActive ? item.active : `${item.inactive} hover:-translate-y-0.5`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i
                  className={`${item.icon} transition-all duration-300 ${item.isGradient
                    ? isActive
                      ? "bg-gradient-to-r from-artPurple via-artOrange to-artBlue bg-clip-text text-transparent"
                      : "group-hover:bg-gradient-to-r group-hover:from-artPurple group-hover:via-artOrange group-hover:to-artBlue group-hover:bg-clip-text group-hover:text-transparent"
                    : ""
                    }`}
                ></i>

                {item.isNotificacao && naoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-artOrange text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#F9F8F6] animate-pulse">
                    {naoLidas > 9 ? "9+" : naoLidas}
                  </span>
                )}

                <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                  {item.title}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {isGuest ? (
        <div className="flex flex-col items-center gap-3">
          <Link
            to="/login"
            title="Entrar ou Cadastrar"
            className="group relative w-9 h-9 rounded-2xl bg-artPurple text-white flex items-center justify-center text-xs font-bold hover:bg-artDark transition-all duration-300 shadow-md shadow-artPurple/20 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Entrar / Cadastrar
            </span>
          </Link>

          <div
            title={user?.nome || "Convidado"}
            className="group relative w-8 h-8 rounded-full bg-artBlue/10 text-artBlue border border-artBlue/30 flex items-center justify-center text-xs font-bold"
          >
            <i className="fa-solid fa-eye text-xs"></i>
            <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              {user?.nome || "Visitante"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2.5">
          <NavLink
            to="/perfil"
            title="Perfil"
            className={({ isActive }) => {
              const temLed = user?.mostrar_moldura_led !== false;
              const plano = (user?.plano?.tipo || user?.tipo_plano || "free").toLowerCase();
              const ledClass = temLed
                ? plano === "boost"
                  ? "ring-2 ring-[#FF793F] shadow-[0_0_12px_rgba(255,121,63,0.85)]"
                  : plano === "pro"
                  ? "ring-2 ring-[#6C5CE7] shadow-[0_0_12px_rgba(108,92,231,0.85)]"
                  : "ring-2 ring-[#00B894] shadow-[0_0_12px_rgba(0,184,148,0.85)]"
                : isActive
                ? "ring-2 ring-artPurple"
                : "";
              return `group relative w-8 h-8 rounded-full border border-white hover:scale-110 transition-all duration-300 overflow-hidden ${ledClass} ${
                fotoPerfil ? "" : "bg-artPurple"
              }`;
            }}
          >
            {fotoPerfil ? (
              <img
                src={getMediaUrl(fotoPerfil)}
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-bold flex items-center justify-center h-full">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : "A"}
              </span>
            )}

            <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Meu Perfil
            </span>
          </NavLink>

          <NavLink
            to="/configuracoes"
            title="Configurações"
            className={({ isActive }) =>
              `group relative w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all duration-300 ${isActive
                ? "bg-white text-artBlue shadow-md ring-2 ring-artBlue/20"
                : "text-gray-500 hover:text-artBlue hover:bg-artBlue/10 hover:-translate-y-0.5"
              }`
            }
          >
            <i className="fa-solid fa-gear transition-colors duration-300"></i>

            <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Configurações
            </span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            title="Sair da conta"
            className="group relative w-8 h-8 rounded-xl flex items-center justify-center text-xs text-gray-400 hover:text-artOrange hover:bg-artOrange/10 hover:-translate-y-0.5 transition-all duration-300"
          >
            <i className="fa-solid fa-right-from-bracket transition-colors duration-300"></i>

            <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Sair
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}