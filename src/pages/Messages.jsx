import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConversationItem from "../components/ConversationItem";
import MessageBubble from "../components/MessageBubble";

const initialConversations = {
  "ricardo-aris": {
    id: "ricardo-aris",
    name: "Ricardo Aris",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    status: "Online",
    messages: [
      { sender: "them", text: "Olá! Vi suas obras têxteis no feed e fiquei apaixonado pelo conceito. Você teria disponibilidade para um projeto customizado este mês?", time: "14:20" },
      { sender: "me", text: "Olá Ricardo! Muito obrigada pelo carinho. Sim, estou com a agenda aberta para duas novas curadorias personalizadas. O que você tem em mente?", time: "14:25" }
    ],
    order: {
      id: 1,
      cliente: "Ricardo Aris",
      tipo: "Arte digital personalizada",
      descricao: "Solicitou uma arte abstrata em tons de azul para capa musical de projeto autoral.",
      status: "Pendente",
      prazo: "7 dias",
      valor: "R$ 350,00",
    }
  },
  "helena-matos": {
    id: "helena-matos",
    name: "Helena Matos",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    status: "Offline",
    messages: [
      { sender: "them", text: "Olá Marina! Recebi a última ilustração editorial. O cliente amou a paleta de cores!", time: "Ontem" },
      { sender: "me", text: "Que ótimo, Helena! Fico muito feliz que tenha gostado. Qualquer novo projeto é só me chamar!", time: "Ontem" }
    ],
    order: {
      id: 2,
      cliente: "Helena Matos",
      tipo: "Ilustração editorial",
      descricao: "Pedido de ilustração comercial para campanha visual de marca de cosméticos sustentáveis.",
      status: "Em andamento",
      prazo: "12 dias",
      valor: "R$ 620,00",
    }
  },
  "lucas-ferreira": {
    id: "lucas-ferreira",
    name: "Lucas Ferreira",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    status: "Online",
    messages: [
      { sender: "them", text: "Conseguimos fechar a modelagem 3D pelo valor de R$ 900?", time: "2 dias atrás" },
      { sender: "me", text: "Sim, Lucas! Já finalizei o arquivo e as texturas. O link de download já foi liberado.", time: "2 dias atrás" }
    ],
    order: {
      id: 3,
      cliente: "Lucas Ferreira",
      tipo: "Modelagem 3D",
      descricao: "Criação de objeto 3D decorativo realista para apresentação digital de produto.",
      status: "Finalizada",
      prazo: "Concluída",
      valor: "R$ 900,00",
    }
  }
};

// Default Encomendas for sync
const defaultEncomendas = [
  {
    id: 1,
    cliente: "Ricardo Aris",
    tipo: "Arte digital personalizada",
    descricao: "Solicitou uma arte abstrata em tons de azul para capa musical de projeto autoral.",
    status: "Pendente",
    prazo: "7 dias",
    valor: "R$ 350,00",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    cliente: "Helena Matos",
    tipo: "Ilustração editorial",
    descricao: "Pedido de ilustração comercial para campanha visual de marca de cosméticos sustentáveis.",
    status: "Em andamento",
    prazo: "12 dias",
    valor: "R$ 620,00",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    cliente: "Lucas Ferreira",
    tipo: "Modelagem 3D",
    descricao: "Criação de objeto 3D decorativo realista para apresentação digital de produto.",
    status: "Finalizada",
    prazo: "Concluída",
    valor: "R$ 900,00",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
];

export default function Messages() {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState("ricardo-aris");
  const [inputMessage, setInputMessage] = useState("");
  const [showOrderSidebar, setShowOrderSidebar] = useState(true);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [successAlert, setSuccessAlert] = useState("");

  // Initialize and synchronize Encomendas in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("artfolio_encomendas");
    if (!saved) {
      localStorage.setItem("artfolio_encomendas", JSON.stringify(defaultEncomendas));
    } else {
      // Sync initialConversations status with saved encomendas
      const list = JSON.parse(saved);
      setConversations(prev => {
        const next = { ...prev };
        list.forEach(order => {
          const key = Object.keys(next).find(k => next[k].name.toLowerCase() === order.cliente.toLowerCase());
          if (key && next[key].order) {
            next[key].order.status = order.status;
            next[key].order.prazo = order.prazo;
            next[key].order.valor = order.valor;
          }
        });
        return next;
      });
    }
  }, []);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeChatId]);

  // Handle Redirect state from Encomendas screen
  useEffect(() => {
    if (location.state && location.state.activeOrder) {
      const order = location.state.activeOrder;
      const matchedId = Object.keys(conversations).find(
        key => conversations[key].name.toLowerCase() === order.cliente.toLowerCase()
      );
      if (matchedId) {
        setActiveChatId(matchedId);
        setConversations(prev => ({
          ...prev,
          [matchedId]: {
            ...prev[matchedId],
            order: {
              ...prev[matchedId].order,
              status: order.status,
              valor: order.valor,
              prazo: order.prazo,
              descricao: order.descricao || prev[matchedId].order.descricao
            }
          }
        }));
      }
    }
  }, [location.state]);

  const activeChat = conversations[activeChatId];

  // Send message logic
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setConversations((prev) => {
      const chat = prev[activeChatId];
      return {
        ...prev,
        [activeChatId]: {
          ...chat,
          messages: [
            ...chat.messages,
            { sender: "me", text: inputMessage, time: timeString }
          ]
        }
      };
    });

    setInputMessage("");
  };

  // Upload/Attach file handler
  const handleAttachFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const now = new Date();
      const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      setConversations((prev) => {
        const chat = prev[activeChatId];
        return {
          ...prev,
          [activeChatId]: {
            ...chat,
            messages: [
              ...chat.messages,
              { sender: "me", text: `📎 Arquivo anexo: ${file.name}`, time: timeString }
            ]
          }
        };
      });

      setSuccessAlert(`Arquivo "${file.name}" enviado!`);
      setTimeout(() => setSuccessAlert(""), 3000);
    }
  };

  // Clear chat history handler
  const handleClearChat = () => {
    setConversations(prev => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        messages: [{ sender: "them", text: `Histórico limpo. Diga Olá para iniciar a conversa!`, time: "Agora" }]
      }
    }));
    setShowChatMenu(false);
    setSuccessAlert("Histórico limpo.");
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  // Block user handler
  const handleBlockUser = () => {
    const saved = localStorage.getItem("artfolio_bloqueados");
    const blockedList = saved ? JSON.parse(saved) : ["Lucas Ferreira", "Gabriel Duarte"];
    
    if (!blockedList.includes(activeChat.name)) {
      blockedList.push(activeChat.name);
      localStorage.setItem("artfolio_bloqueados", JSON.stringify(blockedList));
    }

    setSuccessAlert(`Usuário ${activeChat.name} bloqueado.`);
    setShowChatMenu(false);
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  // Update order status logic inside state & localStorage
  const handleUpdateOrderStatus = (newStatus) => {
    // 1. Update local chat state
    setConversations((prev) => {
      const chat = prev[activeChatId];
      if (!chat.order) return prev;
      return {
        ...prev,
        [activeChatId]: {
          ...chat,
          order: {
            ...chat.order,
            status: newStatus,
            prazo: newStatus === "Finalizada" ? "Concluída" : chat.order.prazo
          }
        }
      };
    });

    // 2. Update localStorage encomendas list so Encomendas.jsx stays synchronized!
    const saved = localStorage.getItem("artfolio_encomendas");
    const list = saved ? JSON.parse(saved) : defaultEncomendas;
    const updatedList = list.map(item => {
      if (item.cliente.toLowerCase() === activeChat.name.toLowerCase()) {
        return {
          ...item,
          status: newStatus,
          prazo: newStatus === "Finalizada" ? "Concluída" : item.prazo
        };
      }
      return item;
    });
    localStorage.setItem("artfolio_encomendas", JSON.stringify(updatedList));

    setSuccessAlert(`Encomenda atualizada para "${newStatus}"`);
    setTimeout(() => setSuccessAlert(""), 3000);
  };

  return (
    <div className="bg-white text-artDark h-screen antialiased font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 h-screen flex">
        
        {/* Left column: Inbox List */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-black/5 flex flex-col bg-white shrink-0 z-10">
          <div className="p-8 lg:p-10 shrink-0">
            <h2 className="font-editorial text-4xl mb-2">
              Inbox.
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Suas conexões artísticas
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 no-scrollbar">
            {Object.values(conversations).map((chat) => (
              <div key={chat.id} onClick={() => setActiveChatId(chat.id)}>
                <ConversationItem
                  active={activeChatId === chat.id}
                  name={chat.name}
                  message={chat.messages[chat.messages.length - 1].text}
                  time={chat.messages[chat.messages.length - 1].time}
                  image={chat.avatar}
                />
              </div>
            ))}
          </div>
        </aside>

        {/* Center column: Chat Area */}
        <section className="flex-1 flex flex-col bg-[#F9F8F6] relative overflow-hidden">
          {/* Chat Header */}
          <header className="p-6 bg-white border-b border-black/5 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-4">
              <span className="font-editorial text-2xl italic">
                {activeChat.name}
              </span>

              <span className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest ${
                activeChat.status === "Online" ? "bg-artGreen/10 text-artGreen" : "bg-gray-100 text-gray-400"
              }`}>
                {activeChat.status}
              </span>
            </div>

            <div className="flex items-center gap-2 relative">
              {successAlert && (
                <span className="text-[10px] bg-artGreen/10 text-artGreen px-3 py-2 rounded-full font-bold">
                  {successAlert}
                </span>
              )}

              {activeChat.order && (
                <button
                  onClick={() => setShowOrderSidebar(!showOrderSidebar)}
                  className={`px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    showOrderSidebar
                      ? "bg-artBlue/10 border-artBlue/20 text-artBlue"
                      : "bg-white border-black/5 text-gray-400 hover:text-artDark"
                  }`}
                  title="Ver Detalhes do Pedido"
                >
                  <i className="fa-solid fa-handshake"></i>
                  {showOrderSidebar ? "Ocultar Pedido" : "Ver Pedido"}
                </button>
              )}

              {/* Three Dots Button & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    showChatMenu ? "bg-artDark text-white border-artDark" : "border-black/5 hover:bg-gray-50"
                  }`}
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>

                {showChatMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowChatMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-[1.2rem] py-2 shadow-2xl z-40 animate-slide-in">
                      <button
                        onClick={handleClearChat}
                        className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-[#F9F8F6] hover:text-artDark flex items-center gap-2"
                      >
                        <i className="fa-solid fa-trash text-red-400"></i>
                        Limpar Histórico
                      </button>
                      <button
                        onClick={handleBlockUser}
                        className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-[#F9F8F6] hover:text-red-500 flex items-center gap-2"
                      >
                        <i className="fa-solid fa-ban text-red-500"></i>
                        Bloquear Contato
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Messages Bubble History */}
          <div className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-6 no-scrollbar">
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

          {/* Chat Input Footer */}
          <footer className="p-6 lg:p-8 bg-white border-t border-black/5 shrink-0">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Escreva sua mensagem para ${activeChat.name}...`}
                className="w-full bg-[#F9F8F6] py-4 pl-6 pr-28 rounded-full border-none outline-none focus:ring-2 ring-artPurple/20 transition-all font-light text-sm"
              />

              <div className="absolute right-3 flex items-center space-x-1">
                {/* File Attachment Label Trigger */}
                <label className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-400 transition-colors flex items-center justify-center cursor-pointer">
                  <i className="fa-solid fa-paperclip"></i>
                  <input
                    type="file"
                    onChange={handleAttachFile}
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-artDark text-white hover:bg-artPurple hover:shadow-lg hover:shadow-artPurple/25 transition-all flex items-center justify-center"
                >
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
              </div>
            </form>
          </footer>
        </section>

        {/* Right column: Order Context Sidebar (if visible) */}
        {activeChat.order && showOrderSidebar && (
          <aside className="w-80 lg:w-96 border-l border-black/5 bg-white flex flex-col shrink-0 z-10 transition-all duration-300 animate-slide-in">
            <div className="p-8 border-b border-black/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-artOrange/10 text-artOrange flex items-center justify-center text-sm">
                  <i className="fa-solid fa-handshake"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Detalhes da Encomenda</h3>
                  <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Pedido #{activeChat.order.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowOrderSidebar(false)}
                className="text-gray-400 hover:text-artDark text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              
              {/* Order Status Badge */}
              <div className="bg-[#F9F8F6] rounded-2xl p-4 border border-black/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Status</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    activeChat.order.status === "Pendente"
                      ? "bg-artOrange/10 text-artOrange"
                      : activeChat.order.status === "Em andamento"
                      ? "bg-artBlue/10 text-artBlue"
                      : activeChat.order.status === "Finalizada"
                      ? "bg-artPurple/10 text-artPurple"
                      : "bg-red-50 text-red-500"
                  }`}>
                    {activeChat.order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-black/5">
                    <p className="font-black text-sm">{activeChat.order.prazo}</p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Prazo</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-black/5">
                    <p className="font-black text-sm">{activeChat.order.valor}</p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Valor</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">Tipo do Pedido</span>
                <p className="font-bold text-base text-artDark leading-tight">{activeChat.order.tipo}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">Descrição do Cliente</span>
                <p className="text-xs text-gray-500 leading-relaxed font-light">{activeChat.order.descricao}</p>
              </div>

              {/* Action Buttons based on Status */}
              <div className="pt-4 border-t border-black/5 space-y-2 shrink-0">
                {activeChat.order.status === "Pendente" && (
                  <>
                    <button
                      onClick={() => handleUpdateOrderStatus("Em andamento")}
                      className="w-full bg-artDark text-white py-3 rounded-full text-xs font-bold hover:bg-artPurple hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-check"></i>
                      Aceitar Encomenda
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus("Recusada")}
                      className="w-full bg-white border border-red-100 text-red-500 py-3 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-xmark"></i>
                      Recusar Pedido
                    </button>
                  </>
                )}

                {activeChat.order.status === "Em andamento" && (
                  <button
                    onClick={() => handleUpdateOrderStatus("Finalizada")}
                    className="w-full bg-artPurple text-white py-3 rounded-full text-xs font-bold hover:bg-artDark hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-circle-check"></i>
                    Marcar como Concluída
                  </button>
                )}

                {activeChat.order.status === "Finalizada" && (
                  <div className="bg-artPurple/5 text-artPurple text-center p-4 rounded-2xl border border-artPurple/10 text-xs font-medium">
                    <i className="fa-solid fa-circle-check mr-1.5"></i>
                    Esta encomenda foi finalizada com sucesso!
                  </div>
                )}

                {activeChat.order.status === "Recusada" && (
                  <div className="bg-red-50 text-red-500 text-center p-4 rounded-2xl border border-red-100 text-xs font-medium">
                    <i className="fa-solid fa-circle-xmark mr-1.5"></i>
                    Esta encomenda foi recusada.
                  </div>
                )}
              </div>

            </div>
          </aside>
        )}
      </main>
    </div>
  );
}