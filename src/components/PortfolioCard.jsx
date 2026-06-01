export default function PortfolioCard({ image, category, title, color = "text-artPurple" }) {
  return (
    <div className="break-inside-avoid group relative rounded-[2rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-500">
      <img
        src={image}
        alt={title}
        className="w-full group-hover:scale-105 transition-transform duration-700"
      />

      <div className="p-5">
        <span className={`text-[10px] font-black uppercase ${color} tracking-widest`}>
          {category}
        </span>

        <h4 className="font-bold text-lg mt-1 group-hover:text-artPurple transition-colors">
          {title}
        </h4>
      </div>
    </div>
  )
}