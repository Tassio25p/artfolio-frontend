import Sidebar from "../components/Sidebar"
import ConversationItem from "../components/ConversationItem"
import MessageBubble from "../components/MessageBubble"

export default function Messages() {
  return (
    <div className="bg-white text-artDark h-screen antialiased font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 h-screen flex">
        <aside className="w-full md:w-96 border-r border-black/5 flex flex-col bg-white z-10">
          <div className="p-10">
            <h2 className="font-editorial text-4xl mb-2">
              Inbox.
            </h2>

            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Suas conexões artísticas
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2">
            <ConversationItem
              active
              name="Ricardo Aris"
              message="Você aceita encomendas para..."
              time="Agora"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100"
            />

            <ConversationItem
              name="Helena Matos"
              message="Obrigada pela arte!"
              time="Ontem"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100"
            />
          </div>
        </aside>

        <section className="hidden md:flex flex-1 flex-col bg-[#F9F8F6]">
          <header className="p-8 bg-white border-b border-black/5 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="font-editorial text-2xl italic">
                Ricardo Aris
              </span>

              <span className="px-3 py-1 bg-artGreen/10 text-artGreen text-[9px] font-bold rounded-full uppercase tracking-widest">
                Online
              </span>
            </div>

            <button className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-artDark hover:text-white transition-all">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </header>

          <div className="flex-1 p-12 overflow-y-auto space-y-8">
            <MessageBubble
              text="Olá! Vi suas obras têxteis no feed e fiquei apaixonado pelo conceito. Você teria disponibilidade para um projeto customizado este mês?"
              time="14:20"
            />

            <MessageBubble
              sent
              text="Olá Ricardo! Muito obrigada pelo carinho. Sim, estou com a agenda aberta para duas novas curadorias personalizadas. O que você tem em mente?"
              time="14:25"
            />
          </div>

          <footer className="p-10 bg-white border-t border-black/5">
            <div className="max-w-4xl mx-auto relative flex items-center">
              <input
                type="text"
                placeholder="Escreva sua mensagem artística..."
                className="w-full bg-[#F9F8F6] py-5 px-8 rounded-full border-none outline-none focus:ring-2 ring-artPurple/20 transition-all font-light italic"
              />

              <div className="absolute right-4 flex space-x-2">
                <button className="w-12 h-12 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                  <i className="fa-solid fa-paperclip"></i>
                </button>

                <button className="w-12 h-12 rounded-full bg-artDark text-white hover:bg-artPurple transition-all shadow-lg shadow-black/10">
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  )
}