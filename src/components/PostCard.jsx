import { useState } from "react";
import { Link } from "react-router-dom";
import MenuOpcoes from "./MenuOpcoes";
import ModalDenuncia from "./ModalDenuncia";

const colorClasses = {
  artPurple: "bg-artPurple",
  artBlue: "bg-artBlue",
  artOrange: "bg-artOrange",
  artDark: "bg-artDark",
};

export default function PostCard({
  id = 1,
  image,
  avatar,
  user,
  title,
  description,
  tag,
  likes,
  comments,
  color = "artPurple",
}) {
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);

  const avatarColor = colorClasses[color] || "bg-artPurple";

  const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <article className="relative break-inside-avoid bg-white rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-black/5">
        <Link
          to={`/obra/${id}`}
          className="absolute inset-0 z-10"
          aria-label={`Ver detalhes da obra ${title}`}
        />

        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-auto group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
            {tag && (
              <div className="bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                {tag}
              </div>
            )}

            <MenuOpcoes
              tipo="obra"
              detalhesLink={`/obra/${id}`}
              onDenunciar={() => setModalDenunciaAberto(true)}
            />
          </div>
        </div>

        <div className="relative z-20 p-6">
          <div className="flex items-center space-x-3 mb-5">
            <div
              className={`w-8 h-8 rounded-full ${avatarColor} overflow-hidden`}
            >
              {avatar && (
                <img
                  src={avatar}
                  alt={user}
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <span className="text-xs font-bold tracking-tight">{user}</span>
          </div>

          <h4 className="font-editorial text-2xl italic leading-tight group-hover:text-artPurple transition-colors">
            {title}
          </h4>

          {description && (
            <p className="text-sm text-gray-400 mt-2 font-light line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-5 pt-5 border-t border-black/5 flex justify-between items-center">
            <div className="flex space-x-5 text-gray-400">
              <button
                type="button"
                onClick={handleActionClick}
                className="relative z-30 hover:text-artOrange transition-colors flex items-center space-x-1"
              >
                <i className="fa-regular fa-heart"></i>
                <span className="text-[10px] font-bold">{likes}</span>
              </button>

              <button
                type="button"
                onClick={handleActionClick}
                className="relative z-30 hover:text-artBlue transition-colors flex items-center space-x-1"
              >
                <i className="fa-regular fa-comment"></i>
                <span className="text-[10px] font-bold">{comments}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleActionClick}
              className="relative z-30 text-artDark hover:scale-110 transition-transform"
              title="Salvar obra"
            >
              <i className="fa-regular fa-bookmark"></i>
            </button>
          </div>
        </div>
      </article>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        tipo="obra"
        alvo={title}
      />
    </>
  );
}