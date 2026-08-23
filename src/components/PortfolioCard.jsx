import React from "react";
import { Link } from "react-router-dom";
import { getMediaUrl } from "../services/api";

export default function PortfolioCard(props) {
  const obra = props.obra || {};
  const id = props.id || obra.id;
  const image = props.image || obra.image || obra.arquivoUrl || obra.arquivo_url || "";
  const title = props.title || obra.title || obra.legenda || `Obra #${id || ""}`;
  const category =
    props.category ||
    obra.category ||
    (obra.categorias && obra.categorias[0]?.nomeCategoria) ||
    obra.categoria?.nomeCategoria ||
    "Arte";
  const color = props.color || obra.color || "text-artPurple";

  return (
    <Link
      to={id ? `/obra/${id}` : "#"}
      className="group bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col block"
    >
      <div className="relative h-60 bg-gray-100 overflow-hidden">
        <img
          src={getMediaUrl(image)}
          alt={title}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-artDark shadow-sm">
          {category}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${color} block mb-1`}>
            {category}
          </span>

          <h3 className="font-editorial text-xl italic group-hover:text-artOrange transition-colors line-clamp-1">
            {title}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-gray-400 font-bold">
          <span>Ver Obra</span>
          <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform text-artDark"></i>
        </div>
      </div>
    </Link>
  );
}