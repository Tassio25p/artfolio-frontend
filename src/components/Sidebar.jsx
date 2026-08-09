import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { getMediaUrl } from "../services/api";

function getMenuByUser(tipo) {
  const baseItems = [
    {
      title: "Feed",
      icon: "fa-solid fa-house",
      to: "/feed",
      active: "bg-white text-artDark shadow-md ring-1 ring-black/5",
      hover: "hover:text-artDark hover:bg-artDark/5",
    },
    {
      title: "Buscar",
      icon: "fa-solid fa-magnifying-glass",
      to: "/buscar",
      active: "bg-white text-artPurple shadow-md ring-1 ring-artPurple/10",
      hover: "hover:text-artPurple hover:bg-artPurple/5",
    },
    {
      title: "Mensagens",
      icon: "fa-solid fa-message",
      to: "/mensagens",
      active: "bg-white text-artBlue shadow-md ring-1 ring-artBlue/10",
      hover: "hover:text-artBlue hover:bg-artBlue/5",
    },
    {
      title: "Notificações",
      icon: "fa-solid fa-bell",
      to: "/notificacoes",
      active: "bg-white text-artPurple shadow-md ring-1 ring-artPurple/10",
      hover: "hover:text-artPurple hover:bg-artPurple/5",
      isNotificacao: true,
    },
    {
      title: "Salvos",
      icon: "fa-solid fa-bookmark",
      to: "/salvos",
      active: "bg-white text-artPurple shadow-md ring-1 ring-artPurple/10",
      hover: "hover:text-artPurple hover:bg-artPurple/5",
    },
  ];

  const roleItems = [];

  if (tipo === "artista") {
    roleItems.push(
      {
        title: "Criar Obra",
        icon: "fa-solid fa-plus",
        to: "/criar-obra",
        active: "bg-artOrange text-white shadow-md shadow-artOrange/20",
        hover: "hover:text-artOrange hover:bg-artOrange/10",
      },
      {
        title: "Portfólio",
        icon: "fa-solid fa-palette",
        to: "/meu-portfolio",
        active: "bg-white text-artDark shadow-md ring-1 ring-black/5",
        hover: "hover:text-artDark hover:bg-artDark/5",
      },
      {
        title: "Estatísticas",
        icon: "fa-solid fa-chart-simple",
        to: "/estatisticas",
        active: "bg-white text-artDark shadow-md ring-1 ring-black/5",
        hover: "hover:text-artDark hover:bg-artDark/5",
      }
    );
  } else if (tipo === "cliente") {
    roleItems.push({
      title: "Encomendas",
      icon: "fa-solid fa-handshake",
      to: "/encomendas",
      active: "bg-white text-artOrange shadow-md ring-1 ring-artOrange/10",
      hover: "hover:text-artOrange hover:bg-artOrange/5",
    });
  }

  if (tipo === "admin" || tipo === "moderador") {
    roleItems.push({
      title: "Admin",
      icon: "fa-solid fa-shield-halved",
      to: "/admin",
      active: "bg-red-500 text-white shadow-md shadow-red-500/20",
      hover: "hover:text-red-500 hover:bg-red-50",
    });
  }

  const finalItems = [
    {
      title: "Config",
      icon: "fa-solid fa-gear",
      to: "/configuracoes",
      active: "bg-white text-artDark shadow-md ring-1 ring-black/5",
      hover: "hover:text-artDark hover:bg-artDark/5",
    },
  ];

  return [...baseItems, ...roleItems, ...finalItems];
}

export default function Sidebar() {
  const { unreadCount: naoLidas } = useNotifications();
  const { user, logout } = useAuth();

  const tipoUsuario = user?.tipo_conta || "cliente";
  const fotoPerfil = user?.fotoPerfil || null;
  const menuItems = getMenuByUser(tipoUsuario);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-14 border-r border-black/5 bg-[#F9F8F6] z-50 flex flex-col items-center justify-between py-5">
      <NavLink
        to="/feed"
        title="Artfolio"
        className="font-editorial text-xl font-black text-artOrange rotate-180 [writing-mode:vertical-rl] uppercase tracking-tight hover:text-artDark transition-colors"
      >
        Artfolio
      </NavLink>

      <div className="flex flex-col items-center gap-2 text-gray-400">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.to}
            title={item.title}
            className={({ isActive }) =>
              `group relative w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                isActive ? item.active : item.hover
              }`
            }
          >
            <i className={item.icon}></i>

            {item.isNotificacao && naoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {naoLidas > 9 ? "9+" : naoLidas}
              </span>
            )}

            <span className="absolute left-[3.25rem] px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {item.title} {item.isNotificacao && naoLidas > 0 ? `(${naoLidas})` : ""}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Área inferior: Logout + Avatar do perfil */}
      <div className="flex flex-col items-center gap-3">
        {/* Botão Sair da conta */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sair da conta"
          className="group relative w-8 h-8 rounded-xl flex items-center justify-center text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5"
        >
          <i className="fa-solid fa-right-from-bracket"></i>

          <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Sair
          </span>
        </button>

        {/* Avatar do perfil */}
        <NavLink
          to="/perfil"
          title="Perfil"
          className={({ isActive }) =>
            `group relative w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform overflow-hidden ${
              isActive ? "ring-2 ring-artPurple" : ""
            } ${fotoPerfil ? "" : "bg-artPurple"}`
          }
        >
          {fotoPerfil ? (
            <img
              src={getMediaUrl(fotoPerfil)}
              alt="Perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-xs font-bold flex items-center justify-center h-full">
              {user?.nome ? user.nome.charAt(0).toUpperCase() : "U"}
            </span>
          )}

          <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Meu Perfil
          </span>
        </NavLink>
      </div>
    </nav>
  );
}