
export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-16 border-r border-black/5 flex flex-col justify-between items-center py-8 z-50 bg-[#F9F8F6]">
      <a
        href="#"
        className="font-editorial text-2xl font-black text-artOrange rotate-180 [writing-mode:vertical-rl] uppercase"
      >
        Artfolio
      </a>

      <div className="space-y-8 flex flex-col items-center text-gray-400">
        <a href="#" className="text-artDark text-lg">
          <i className="fa-solid fa-house"></i>
        </a>

        <a href="#" className="hover:text-artPurple transition-colors text-lg">
          <i className="fa-solid fa-magnifying-glass"></i>
        </a>

        <a href="#" className="hover:text-artBlue transition-colors text-lg">
          <i className="fa-solid fa-plus-circle"></i>
        </a>
      </div>

      <div className="w-8 h-8 rounded-full bg-artPurple"></div>
    </nav>
  )
}