import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConversationItem from "../components/ConversationItem";
import MessageBubble from "../components/MessageBubble";

const initialConversations = {
  "ricardo-aris": {
    id: "ricardo-aris",
    name: "Ricardo Aris",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    status: "Online",
    messages: [
      {
        sender: "them",
        text: "Olá! Vi suas obras têxteis no feed e fiquei apaixonado pelo conceito. Você teria disponibilidade para um projeto customizado este mês?",
        time: "14:20",
      },
      {
        sender: "me",
        text: "Olá Ricardo! Muito obrigada pelo carinho. Sim, estou com a agenda aberta para duas novas curadorias personalizadas. O que você tem em mente?",
        time: "14:25",
      },
    ],
    order: {
      id: 1,
      cliente: "Ricardo Aris",
      tipo: "Arte digital personalizada",
      descricao:
        "Solicitou uma arte abstrata em tons de azul para capa musical de projeto autoral.",
      status: "Pendente",
      prazo: "7 dias",
      valor: "R$ 350,00",
    },
  },
  "helena-matos": {
    id: "helena-matos",
    name: "Helena Matos",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    status: "Offline",
    messages: [
      {
        sender: "them",
        text: "Olá Marina! Recebi a última ilustração editorial. O cliente amou a paleta de cores!",
        time: "Ontem",
      },
      {
        sender: "me",
        text: "Que ótimo, Helena! Fico muito feliz que tenha gostado. Qualquer novo projeto é só me chamar!",
        time: "Ontem",
      },
    ],
    order: {
      id: 2,
      cliente: "Helena Matos",
      tipo: "Ilustração editorial",
      descricao:
        "Pedido de ilustração comercial para campanha visual de marca de cosméticos sustentáveis.",
      status: "Em andamento",
      prazo: "12 dias",
      valor: "R$ 620,00",
    },
  },
  "lucas-ferreira": {
    id: "lucas-ferreira",
    name: "Lucas Ferreira",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    status: "Online",
    messages: [
      {
        sender: "them",
        text: "Conseguimos fechar a modelagem 3D pelo valor de R$ 900?",
        time: "2 dias atrás",
      },
      {
        sender: "me",
        text: "Sim, Lucas! Já finalizei o arquivo e as texturas. O link de download já foi liberado.",
        time: "2 dias atrás",
      },
    ],
    order: {
      id: 3,
      cliente: "Lucas Ferreira",
      tipo: "Modelagem 3D",
      descricao:
        "Criação de objeto 3D decorativo realista para apresentação digital de produto.",
      status: "Finalizada",
      prazo: "Concluída",
      valor: "R$ 900,00",
    },
  },
};

const getStatusClass = (status) => {
  if (status === "Pendente") return "bg-artOrange/10 text-artOrange";
  if (status === "Em andamento") return "bg-artBlue/10 text-artBlue";
  if (status === "Finalizada") return "bg-artPurple/10 text-artPurple";
  if (status === "Recusada") return "bg-red-50 text-red-500";

  return "bg-gray-100 text-gray-400";
};

export default function Messages() {
  const messagesEndRef = useRef(null);

  const [conversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState("ricardo-aris");
  const [inputMessage, setInputMessage] = useState("");
  const [showOrderSidebar, setShowOrderSidebar] = useState(true);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [mobileView, setMobileView] = useState("inbox");

  const tipoUsuario = " cliente"; // mude para "artista" para view do artista; 
  const isArtista = tipoUsuario === "artista";

  const activeChat = conversations[activeChatId];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId]);

  const showNotice = (message) => {
    setNoticeMessage(message);
    setTimeout(() => setNoticeMessage(""), 3000);
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setMobileView("chat");
    setShowChatMenu(false);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (!inputMessage.trim()) return;

    showNotice("O envio real de mensagens será integrado ao backend.");
  };

  const handleAttachFile = () => {
    showNotice("O envio de arquivos será integrado ao backend.");
  };

  const handleClearChat = () => {
    setShowChatMenu(false);
    showNotice("A limpeza do histórico será integrada ao backend.");
  };

  const handleBlockUser = () => {
    setShowChatMenu(false);
    showNotice("O bloqueio de usuários será integrado ao backend.");
  };

  const handleUpdateOrderStatus = () => {
    showNotice("A atualização da encomenda será integrada ao backend.");
  };

  return (
    <div className="bg-white text-artDark h-screen antialiased font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 h-screen flex overflow-hidden">
        <aside
          className={`${
            mobileView === "chat" ? "hidden" : "flex"
          } md:flex w-full md:w-80 lg:w-96 border-r border-black/5 flex-col bg-white shrink-0 z-10`}
        >
          <div className="p-6 lg:p-10 shrink-0">
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
              Mensagens
            </span>

            <h2 className="font-editorial text-4xl mb-2">Inbox.</h2>

            <p className="text-xs text-gray-400 leading-relaxed">
              Converse com clientes, artistas e acompanhe negociações de
              encomendas.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 no-scrollbar">
            {Object.values(conversations).map((chat) => (
              <button
                type="button"
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className="w-full text-left"
              >
                <ConversationItem
                  active={activeChatId === chat.id}
                  name={chat.name}
                  message={chat.messages[chat.messages.length - 1].text}
                  time={chat.messages[chat.messages.length - 1].time}
                  image={chat.avatar}
                />
              </button>
            ))}
          </div>
        </aside>

        <section
          className={`${
            mobileView === "inbox" ? "hidden" : "flex"
          } md:flex flex-1 flex-col bg-[#F9F8F6] relative overflow-hidden`}
        >
          <header className="p-4 sm:p-6 bg-white border-b border-black/5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileView("inbox")}
                className="md:hidden w-10 h-10 rounded-full bg-[#F9F8F6] border border-black/5 flex items-center justify-center"
              >
                <i className="fa-solid fa-arrow-left text-sm"></i>
              </button>

              <img
                src={activeChat.avatar}
                alt={activeChat.name}
                className="w-11 h-11 rounded-2xl object-cover"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-editorial text-2xl italic truncate">
                    {activeChat.name}
                  </span>

                  <span
                    className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest ${
                      activeChat.status === "Online"
                        ? "bg-artGreen/10 text-artGreen"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {activeChat.status}
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">
                  {activeChat.order
                    ? "Conversa vinculada a uma encomenda"
                    : "Conversa direta"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
              {noticeMessage && (
                <span className="text-[10px] bg-artOrange/10 text-artOrange px-3 py-2 rounded-full font-bold">
                  {noticeMessage}
                </span>
              )}

              {activeChat.order && (
                <button
                  type="button"
                  onClick={() => setShowOrderSidebar(!showOrderSidebar)}
                  className={`hidden lg:flex px-4 py-2 rounded-full border text-xs font-bold transition-all items-center gap-1.5 ${
                    showOrderSidebar
                      ? "bg-artBlue/10 border-artBlue/20 text-artBlue"
                      : "bg-white border-black/5 text-gray-400 hover:text-artDark"
                  }`}
                  title="Ver detalhes do pedido"
                >
                  <i className="fa-solid fa-handshake"></i>
                  {showOrderSidebar ? "Ocultar Pedido" : "Ver Pedido"}
                </button>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    showChatMenu
                      ? "bg-artDark text-white border-artDark"
                      : "border-black/5 hover:bg-gray-50"
                  }`}
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>

                {showChatMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowChatMenu(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white border border-black/5 rounded-[1.2rem] py-2 shadow-2xl z-40 animate-slide-in">
                      <button
                        type="button"
                        onClick={handleClearChat}
                        className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-[#F9F8F6] hover:text-artDark flex items-center gap-2"
                      >
                        <i className="fa-solid fa-trash text-red-400"></i>
                        Limpar histórico
                      </button>

                      <button
                        type="button"
                        onClick={handleBlockUser}
                        className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-[#F9F8F6] hover:text-red-500 flex items-center gap-2"
                      >
                        <i className="fa-solid fa-ban text-red-500"></i>
                        Bloquear contato
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {activeChat.order && (
            <div className="lg:hidden bg-white border-b border-black/5 px-4 py-3">
              <div className="bg-[#F9F8F6] rounded-2xl p-4 border border-black/5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                      Encomenda #{activeChat.order.id}
                    </p>

                    <h3 className="font-bold text-sm leading-tight">
                      {activeChat.order.tipo}
                    </h3>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusClass(
                      activeChat.order.status
                    )}`}
                  >
                    {activeChat.order.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {activeChat.order.descricao}
                </p>
              </div>
            </div>
          )}

          <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto space-y-6 no-scrollbar">
            {activeChat.messages.map((msg, index) => (
              <MessageBubble
                key={index}
                sent={msg.sender === "me"}
                text={msg.text}
                time={msg.time}
              />
            ))}

            <div ref={messagesEndRef} />
          </div>

          <footer className="p-4 sm:p-6 lg:p-8 bg-white border-t border-black/5 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="max-w-4xl mx-auto relative flex items-center"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                placeholder={`Escreva sua mensagem para ${activeChat.name}...`}
                className="w-full bg-[#F9F8F6] py-4 pl-5 sm:pl-6 pr-28 rounded-full border-none outline-none focus:ring-2 ring-artPurple/20 transition-all font-light text-sm"
              />

              <div className="absolute right-3 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleAttachFile}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-400 transition-colors flex items-center justify-center"
                  title="Anexar arquivo"
                >
                  <i className="fa-solid fa-paperclip"></i>
                </button>

                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-artDark text-white hover:bg-artPurple hover:shadow-lg hover:shadow-artPurple/25 transition-all flex items-center justify-center"
                  title="Enviar mensagem"
                >
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
              </div>
            </form>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              O envio real de mensagens, arquivos e histórico será integrado ao
              backend futuramente.
            </p>
          </footer>
        </section>

        {activeChat.order && showOrderSidebar && (
          <aside className="hidden lg:flex w-80 xl:w-96 border-l border-black/5 bg-white flex-col shrink-0 z-10 transition-all duration-300 animate-slide-in">
            <div className="p-6 xl:p-8 border-b border-black/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-artOrange/10 text-artOrange flex items-center justify-center text-sm">
                  <i className="fa-solid fa-handshake"></i>
                </div>

                <div>
                  <h3 className="font-bold text-sm">Detalhes da Encomenda</h3>
                  <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">
                    Pedido #{activeChat.order.id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOrderSidebar(false)}
                className="text-gray-400 hover:text-artDark text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              <div className="bg-[#F9F8F6] rounded-2xl p-4 border border-black/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    Status
                  </span>

                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusClass(
                      activeChat.order.status
                    )}`}
                  >
                    {activeChat.order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-black/5">
                    <p className="font-black text-sm">
                      {activeChat.order.prazo}
                    </p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                      Prazo
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-black/5">
                    <p className="font-black text-sm">
                      {activeChat.order.valor}
                    </p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                      Valor
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">
                  Tipo do Pedido
                </span>

                <p className="font-bold text-base text-artDark leading-tight">
                  {activeChat.order.tipo}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">
                  Descrição do Cliente
                </span>

                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  {activeChat.order.descricao}
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 space-y-2 shrink-0">
                {isArtista ? (
                  <>
                    {activeChat.order.status === "Pendente" && (
                      <>
                        <button
                          type="button"
                          onClick={handleUpdateOrderStatus}
                          className="w-full bg-artDark text-white py-3 rounded-full text-xs font-bold hover:bg-artPurple hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <i className="fa-solid fa-check"></i>
                          Aceitar Encomenda
                        </button>

                        <button
                          type="button"
                          onClick={handleUpdateOrderStatus}
                          className="w-full bg-white border border-red-100 text-red-500 py-3 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <i className="fa-solid fa-xmark"></i>
                          Recusar Pedido
                        </button>
                      </>
                    )}

                    {activeChat.order.status === "Em andamento" && (
                      <button
                        type="button"
                        onClick={handleUpdateOrderStatus}
                        className="w-full bg-artPurple text-white py-3 rounded-full text-xs font-bold hover:bg-artDark hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-circle-check"></i>
                        Marcar como Concluída
                      </button>
                    )}

                    {activeChat.order.status === "Finalizada" && (
                      <div className="bg-artPurple/5 text-artPurple text-center p-4 rounded-2xl border border-artPurple/10 text-xs font-medium">
                        <i className="fa-solid fa-circle-check mr-1.5"></i>
                        Esta encomenda foi finalizada com sucesso.
                      </div>
                    )}

                    {activeChat.order.status === "Recusada" && (
                      <div className="bg-red-50 text-red-500 text-center p-4 rounded-2xl border border-red-100 text-xs font-medium">
                        <i className="fa-solid fa-circle-xmark mr-1.5"></i>
                        Esta encomenda foi recusada.
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                      As ações de encomenda serão salvas no PostgreSQL quando o
                      backend FastAPI for integrado.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="bg-artBlue/5 text-artBlue text-center p-4 rounded-2xl border border-artBlue/10 text-xs font-medium">
                      <i className="fa-solid fa-clock mr-1.5"></i>
                      Acompanhe aqui o andamento da sua solicitação.
                    </div>

                    <Link
                      to="/encomendas"
                      className="w-full bg-artDark text-white py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-bag-shopping"></i>
                      Ver minhas encomendas
                    </Link>
                  </>
                )}
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}