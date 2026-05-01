export default function MessageBubble({ text, time, sent = false }) {
  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"}`}>
      <div className="max-w-md">
        <div
          className={`p-6 rounded-[2rem] shadow-sm ${
            sent
              ? "bg-artDark text-white rounded-tr-none shadow-xl"
              : "bg-white text-gray-600 rounded-tl-none"
          }`}
        >
          <p className="text-sm leading-relaxed opacity-90">
            {text}
          </p>
        </div>

        <span
          className={`text-[9px] mt-2 block uppercase font-bold tracking-widest ${
            sent
              ? "text-artPurple text-right mr-2"
              : "text-gray-400 ml-2"
          }`}
        >
          {time} • {sent ? "Enviada" : "Recebida"}
        </span>
      </div>
    </div>
  )
}