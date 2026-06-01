import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Feed",
    icon: "fa-solid fa-house",
    to: "/feed",
    color: "hover:text-artDark hover:bg-artDark/5",
    activeColor: "bg-white text-artDark shadow-lg shadow-black/5 ring-1 ring-artDark/5",
  },
  {
    title: "Buscar",
    icon: "fa-solid fa-magnifying-glass",
    to: "/buscar",
    color: "hover:text-artPurple hover:bg-artPurple/5",
    activeColor: "bg-white text-artPurple shadow-lg shadow-black/5 ring-1 ring-artPurple/10",
  },
  {
    title: "Criar Obra",
    icon: "fa-solid fa-plus-circle",
    to: "/criar-obra",
    color: "hover:text-artBlue hover:bg-artBlue/5",
    activeColor: "bg-white text-artBlue shadow-lg shadow-black/5 ring-1 ring-artBlue/10",
  },
  {
    title: "Mensagens",
    icon: "fa-solid fa-message",
    to: "/mensagens",
    color: "hover:text-artBlue hover:bg-artBlue/5",
    activeColor: "bg-white text-artBlue shadow-lg shadow-black/5 ring-1 ring-artBlue/10",
  },
  {
    title: "Salvos",
    icon: "fa-solid fa-bookmark",
    to: "/salvos",
    color: "hover:text-artPurple hover:bg-artPurple/5",
    activeColor: "bg-white text-artPurple shadow-lg shadow-black/5 ring-1 ring-artPurple/10",
  },
  {
    title: "Encomendas",
    icon: "fa-solid fa-handshake",
    to: "/encomendas",
    color: "hover:text-artOrange hover:bg-artOrange/5",
    activeColor: "bg-white text-artOrange shadow-lg shadow-black/5 ring-1 ring-artOrange/10",
  },
  {
    title: "Estatísticas",
    icon: "fa-solid fa-chart-line",
    to: "/estatisticas",
    color: "hover:text-artBlue hover:bg-artBlue/5",
    activeColor: "bg-white text-artBlue shadow-lg shadow-black/5 ring-1 ring-artBlue/10",
  },
  {
    title: "Planos",
    icon: "fa-solid fa-crown",
    to: "/planos",
    color: "hover:text-artOrange hover:bg-artOrange/5",
    activeColor: "bg-white text-artOrange shadow-lg shadow-black/5 ring-1 ring-artOrange/10",
  },
  {
    title: "Notificações",
    icon: "fa-solid fa-bell",
    to: "/notificacoes",
    color: "hover:text-artPurple hover:bg-artPurple/5",
    activeColor: "bg-white text-artPurple shadow-lg shadow-black/5 ring-1 ring-artPurple/10",
  },
  {
    title: "Configurações",
    icon: "fa-solid fa-gear",
    to: "/configuracoes",
    color: "hover:text-artDark hover:bg-artDark/5",
    activeColor: "bg-white text-artDark shadow-lg shadow-black/5 ring-1 ring-artDark/5",
  },
];

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-screen w-16 border-r border-black/5 flex flex-col justify-between items-center py-6 z-50 bg-[#F9F8F6] hover:bg-[#F3F1EC] transition-all duration-700 ease-in-out hover:shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
      <NavLink
        to="/feed"
        className="font-editorial text-2xl font-black text-artOrange rotate-180 [writing-mode:vertical-rl] [text-orientation:mixed] uppercase tracking-tight hover:text-artDark transition-colors duration-300"
      >
        Artfolio
      </NavLink>

      <div className="flex flex-col items-center gap-2.5 text-gray-400">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.to}
            title={item.title}
            className={({ isActive }) =>
              `group relative w-9 h-9 rounded-2xl flex items-center justify-center text-base transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                isActive
                  ? item.activeColor
                  : item.color
              }`
            }
          >
            <i className={item.icon}></i>

            <span className="absolute left-13 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {item.title}
            </span>
          </NavLink>
        ))}
      </div>

      <NavLink
        to="/perfil"
        title="Perfil"
        className={({ isActive }) =>
          `group relative w-9 h-9 rounded-full bg-artPurple border-2 border-white shadow-lg shadow-black/10 hover:scale-110 transition-transform duration-300 ${
            isActive ? "ring-4 ring-artPurple/20 scale-110" : ""
          }`
        }
      >
        <span className="absolute left-12 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Perfil
        </span>
      </NavLink>
    </nav>
  );
}