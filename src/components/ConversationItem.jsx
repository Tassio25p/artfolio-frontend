export default function ConversationItem({
  name,
  message,
  time,
  image,
  active = false,
}) {
  return (
    <div
      className={`p-6 rounded-[2rem] flex items-center space-x-4 cursor-pointer transition-all ${
        active
          ? "bg-artPurple/5 border-l-4 border-artPurple"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span
            className={`font-bold text-sm tracking-tight ${
              active ? "text-artDark" : "text-gray-500"
            }`}
          >
            {name}
          </span>

          <span
            className={`text-[9px] font-black uppercase ${
              active ? "text-artPurple" : "text-gray-300"
            }`}
          >
            {time}
          </span>
        </div>

        <p
          className={`text-xs truncate ${
            active ? "text-artPurple font-medium" : "text-gray-400"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  )
}