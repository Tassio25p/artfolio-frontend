const menuItems = [
  {
    title: "Início",
    icon: "fa-solid fa-house",
    href: "#",
    active: true,
    color: "text-artDark",
  },
  {
    title: "Explorar",
    icon: "fa-solid fa-magnifying-glass",
    href: "#",
    active: false,
    color: "hover:text-artPurple",
  },
  {
    title: "Criar Obra",
    icon: "fa-solid fa-plus-circle",
    href: "#",
    active: false,
    color: "hover:text-artBlue",
  },
];

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-screen w-16 border-r border-black/5 flex flex-col justify-between items-center py-8 z-50 bg-[#F9F8F6]">
      <a
        href="#"
        className="font-editorial text-2xl font-black text-artOrange rotate-180 [writing-mode:vertical-rl] [text-orientation:mixed] uppercase tracking-tight hover:text-artDark transition-colors"
      >
        Artfolio
      </a>

      <div className="flex flex-col items-center gap-7 text-gray-400">
        {menuItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            title={item.title}
            className={`group relative w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 ${
              item.active
                ? "bg-white text-artDark shadow-lg shadow-black/5"
                : item.color
            }`}
          >
            <i className={item.icon}></i>

            <span className="absolute left-14 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.title}
            </span>
          </a>
        ))}
      </div>

      <a
        href="#"
        title="Perfil"
        className="group relative w-9 h-9 rounded-full bg-artPurple border-2 border-white shadow-lg shadow-black/10 hover:scale-110 transition-transform"
      >
        <span className="absolute left-12 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-artDark text-white text-[10px] font-bold uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Perfil
        </span>
      </a>
    </nav>
  );
}