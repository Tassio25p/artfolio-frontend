export default function ConversationItem({
  name,
  message,
  time,
  image,
  active = false,
  isGroup = false,
  participantsCount = 0,
  onHide,
  presence = "Online",
  isPinned = false,
  onTogglePin,
}) {
  const getPresenceColor = (status) => {
    switch (status) {
      case "Online":
        return "bg-emerald-500";
      case "Offline":
        return "bg-gray-400";
      case "Invisível":
        return "bg-artOrange";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-[1.8rem] flex items-center space-x-3.5 cursor-pointer transition-all duration-300 relative group overflow-hidden border border-transparent ${
        active
          ? "bg-artPurple/10 border-l-4 border-l-artPurple shadow-xs"
          : "hover:bg-gradient-to-r hover:from-artPurple/10 hover:via-artOrange/5 hover:to-transparent hover:border-l-4 hover:border-l-artOrange/50 hover:shadow-2xs"
      }`}
    >
      {/* Indicador sutil quando ativo */}
      {active && (
        <span className="absolute right-2.5 top-3 w-2 h-2 rounded-full bg-artPurple animate-pulse" />
      )}

      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-xs">
          {image ? (
            <img
              src={image}
              alt={name}
              className="object-cover w-full h-full"
            />
          ) : isGroup ? (
            <div className="w-full h-full bg-gradient-to-tr from-artPurple via-indigo-600 to-artBlue text-white font-bold flex items-center justify-center text-sm shadow-inner" title="Grupo">
              <i className="fa-solid fa-users text-xs"></i>
            </div>
          ) : (
            <div className="w-full h-full bg-artPurple/10 text-artPurple font-bold flex items-center justify-center text-sm shadow-inner" title="Usuário">
              <i className="fa-solid fa-user text-xs"></i>
            </div>
          )}
        </div>

        {/* Bolinha de status de presença SOMENTE para conversas 1:1 (pessoa + pessoa, grupo não conta) */}
        {!isGroup && (
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${getPresenceColor(
              presence
            )}`}
            title={`Status: ${presence}`}
          />
        )}

        {isGroup && (
          <span className="absolute -bottom-1 -right-1 bg-artPurple text-white text-[8px] px-1 py-0.2 rounded-full shadow-xs border border-white font-bold flex items-center gap-0.5" title="Grupo">
            <i className="fa-solid fa-users text-[7px]"></i>
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 pr-6 pl-1">
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center gap-2 truncate">
            {isPinned && (
              <span
                title="Conversa Fixada no Topo"
                className="shrink-0 w-4 h-4 rounded-full bg-artPurple/15 text-artPurple flex items-center justify-center shadow-2xs"
              >
                <i className="fa-solid fa-thumbtack text-[9px] -rotate-45"></i>
              </span>
            )}
            <span
              className={`font-bold text-xs tracking-tight truncate ${
                active ? "text-artDark font-extrabold" : "text-gray-700 group-hover:text-artPurple transition-colors"
              }`}
            >
              {name}
            </span>
            {isGroup && (
              <span className="bg-artPurple/10 text-artPurple text-[8px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider shrink-0">
                Grupo {participantsCount > 0 ? `(${participantsCount})` : ""}
              </span>
            )}
          </div>

          <span
            className={`text-[9px] font-bold uppercase shrink-0 ml-1 ${
              active ? "text-artPurple" : "text-gray-400 group-hover:text-artOrange transition-colors"
            }`}
          >
            {time}
          </span>
        </div>

        <p
          className={`text-xs truncate ${
            active ? "text-artPurple font-medium" : "text-gray-400 font-light group-hover:text-gray-600 transition-colors"
          }`}
        >
          {message}
        </p>
      </div>

      {/* Botões de Ação na Linha (Fixar / Ocultar) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        {onTogglePin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            title={isPinned ? "Desafixar conversa" : "Fixar conversa no topo (máx. 3)"}
            className={`w-6 h-6 rounded-full transition-all flex items-center justify-center text-[10px] shadow-xs cursor-pointer ${
              isPinned
                ? "bg-artPurple text-white hover:bg-indigo-700"
                : "bg-gray-100 hover:bg-artPurple/10 text-gray-400 hover:text-artPurple"
            }`}
          >
            <i className="fa-solid fa-thumbtack -rotate-45"></i>
          </button>
        )}

        {onHide && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onHide();
            }}
            title="Ocultar conversa da lista"
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center text-[10px] shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
    </div>
  );
}