import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getUser, getToken, notificacaoService } from "../services/api";

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
    title: "Salvos",
    icon: "fa-solid fa-bookmark",
    to: "/salvos",
    active: "bg-white text-artPurple shadow-md ring-1 ring-artPurple/10",
    hover: "hover:text-artPurple hover:bg-artPurple/5",
  },
  {
    title: "Encomendas",
    icon: "fa-solid fa-handshake",
    to: "/encomendas",
    active: "bg-white text-artOrange shadow-md ring-1 ring-artOrange/10",
    hover: "hover:text-artOrange hover:bg-artOrange/5",
  },
  {
    title: "Notificações",
    icon: "fa-solid fa-bell",
    to: "/notificacoes",
    active: "bg-white text-artPurple shadow-md ring-1 ring-artPurple/10",
    hover: "hover:text-artPurple hover:bg-artPurple/5",
    isNotificacao: true,
  },
];

const artistaItems = [
  {
    title: "Portfólio",
    icon: "fa-solid fa-images",
    to: "/meu-portfolio",
    active: "bg-white text-artOrange shadow-md ring-1 ring-artOrange/10",
    hover: "hover:text-artOrange hover:bg-artOrange/5",
  },
  {
    title: "Criar",
    icon: "fa-solid fa-plus",
    to: "/criar-obra",
    active: "bg-white text-artBlue shadow-md ring-1 ring-artBlue/10",
    hover: "hover:text-artBlue hover:bg-artBlue/5",
  },
  {
    title: "Estatísticas",
    icon: "fa-solid fa-chart-line",
    to: "/estatisticas",
    active: "bg-white text-artBlue shadow-md ring-1 ring-artBlue/10",
    hover: "hover:text-artBlue hover:bg-artBlue/5",
  },
  {
    title: "Planos",
    icon: "fa-solid fa-crown",
    to: "/planos",
    active: "bg-white text-artOrange shadow-md ring-1 ring-artOrange/10",
    hover: "hover:text-artOrange hover:bg-artOrange/5",
  },
];

const adminItems = [
  {
    title: "Admin",
    icon: "fa-solid fa-shield-halved",
    to: "/admin",
    active: "bg-white text-artOrange shadow-md ring-1 ring-artOrange/10",
    hover: "hover:text-artOrange hover:bg-artOrange/5",
  },
];

const finalItems = [
  {
    title: "Config",
    icon: "fa-solid fa-gear",
    to: "/configuracoes",
    active: "bg-white text-artDark shadow-md ring-1 ring-black/5",
    hover: "hover:text-artDark hover:bg-artDark/5",
  },
];

function getMenuByUser(tipoUsuario) {
  if (tipoUsuario === "admin" || tipoUsuario === "moderador") {
    return [...baseItems, ...adminItems, ...finalItems];
  }

  if (tipoUsuario === "artista") {
    return [...baseItems, ...artistaItems, ...finalItems];
  }

  return [...baseItems, ...finalItems];
}

export default function Sidebar() {
  const [naoLidas, setNaoLidas] = useState(0);
  const usuario = getUser();
  const tipoUsuario = usuario?.tipo_conta || "cliente";
  const fotoPerfil = usuario?.fotoPerfil || null;
  const menuItems = getMenuByUser(tipoUsuario);

  useEffect(() => {
    async function checarNotificacoes() {
      if (getToken()) {
        try {
          const res = await notificacaoService.contarNaoLidas();
          if (res && typeof res.quantidade === "number") {
            setNaoLidas(res.quantidade);
          }
        } catch {
          // Fallback silencioso
        }
      }
    }
    checarNotificacoes();
  }, []);

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

      <NavLink
        to="/perfil"
        title="Perfil"
        className={({ isActive }) =>
          `group relative w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform overflow-hidden ${
            isActive ? "ring-4 ring-artPurple/20 scale-110" : ""
          } ${fotoPerfil ? "" : "bg-artPurple"}`
        }
      >
        {fotoPerfil ? (
          <img
            src={fotoPerfil}
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
            {usuario?.nome?.charAt(0)?.toUpperCase() || "U"}
          </span>
        )}

        <span className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Perfil
        </span>
      </NavLink>
    </nav>
  );
}