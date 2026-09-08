export default function ConversationItem({
  name,
  message,
  time,
  image,
  active = false,
  onHide,
}) {
  return (
    <div
      className={`p-4 sm:p-5 rounded-[1.8rem] flex items-center space-x-3.5 cursor-pointer transition-all relative group ${
        active
          ? "bg-artPurple/5 border-l-4 border-artPurple shadow-xs"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden border-2 border-white shrink-0 shadow-xs">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <div className="flex justify-between items-center mb-0.5">
          <span
            className={`font-bold text-xs tracking-tight truncate ${
              active ? "text-artDark font-extrabold" : "text-gray-700"
            }`}
          >
            {name}
          </span>

          <span
            className={`text-[9px] font-bold uppercase shrink-0 ml-1 ${
              active ? "text-artPurple" : "text-gray-400"
            }`}
          >
            {time}
          </span>
        </div>

        <p
          className={`text-xs truncate ${
            active ? "text-artPurple font-medium" : "text-gray-400 font-light"
          }`}
        >
          {message}
        </p>
      </div>

      {/* Botão sutil de X para ocultar a conversa da visualização */}
      {onHide && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onHide();
          }}
          title="Ocultar conversa da lista"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[10px] shadow-xs"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  );
}