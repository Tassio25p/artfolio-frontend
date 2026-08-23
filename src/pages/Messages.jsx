import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConversationItem from "../components/ConversationItem";
import MessageBubble from "../components/MessageBubble";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { mensagemService, usuarioService, getMediaUrl } from "../services/api";

export default function Messages() {
  const { addToast } = useToast();
  const { user: authUser } = useAuth();
  const messagesEndRef = useRef(null);

  const [conversas, setConversas] = useState([]);
  const [artistasDisponiveis, setArtistasDisponiveis] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rascunho de mensagem
  const [currentDraft, setCurrentDraft] = useState("");
  const [userPresence, setUserPresence] = useState("Online");

  // Menus e Modais
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [modalLimpezaAberto, setModalLimpezaAberto] = useState(false);
  const [modalNovoChatAberto, setModalNovoChatAberto] = useState(false);

  // Seleção individual de mensagens
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  // Bloqueios de contatos persistidos no localStorage
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const saved = localStorage.getItem("artfolio_blocked_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [mobileView, setMobileView] = useState("inbox");

  // Salvar bloqueados no localStorage
  useEffect(() => {
    localStorage.setItem("artfolio_blocked_users", JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  // Carregar conversas do backend PostgreSQL
  const carregarConversas = async (silencioso = false) => {
    try {
      const lista = await mensagemService.listarConversas();
      const convs = Array.isArray(lista) ? lista : [];
      setConversas(convs);

      if (convs.length > 0 && !activeChatId) {
        setActiveChatId(convs[0].id);
        setActiveChat(convs[0]);
      } else if (activeChatId) {
        const atual = convs.find((c) => c.id === activeChatId);
        if (atual) setActiveChat(atual);
      }
    } catch (err) {
      if (!silencioso) console.error("Erro ao carregar conversas:", err);
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  // Carregar outros artistas reais para iniciar novas conversas
  const carregarArtistas = async () => {
    try {
      const lista = await usuarioService.listarArtistas();
      if (Array.isArray(lista)) {
        // Filtrar a si próprio
        setArtistasDisponiveis(lista.filter((a) => a.id !== authUser?.id));
      }
    } catch (err) {
      console.error("Erro ao carregar artistas:", err);
    }
  };

  useEffect(() => {
    carregarConversas();
    carregarArtistas();

    // Auto-polling para sincronizar novas mensagens em tempo real sem precisar de F5
    const interval = setInterval(() => {
      carregarConversas(true);
    }, 2500);

    return () => clearInterval(interval);
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, activeChat?.mensagens]);

  const handleSelectChat = (chat) => {
    setActiveChatId(chat.id);
    setActiveChat(chat);
    setMobileView("chat");
    setShowChatMenu(false);
    setSelectionMode(false);
    setSelectedIndexes([]);
    setCurrentDraft("");
  };

  const handleIniciarConversaComArtista = async (artista) => {
    try {
      setModalNovoChatAberto(false);
      const conv = await mensagemService.obterOuCriarConversa(artista.id);
      await carregarConversas();
      setActiveChatId(conv.id);
      setActiveChat(conv);
      setMobileView("chat");
      addToast(`Conversa iniciada com ${artista.nome}.`, "Chat Pronto", "sucesso");
    } catch (err) {
      addToast(err.message || "Erro ao iniciar conversa.", "Erro", "erro");
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!currentDraft.trim() || !activeChatId) return;

    const texto = currentDraft.trim();
    setCurrentDraft("");

    // Otimista
    const msgOtimista = {
      id: Date.now(),
      idConversa: activeChatId,
      idRemetente: authUser?.id || 0,
      conteudo: texto,
      dataEnvio: new Date().toISOString(),
      enviado_por_mim: true,
    };

    setActiveChat((prev) => ({
      ...prev,
      mensagens: [...(prev?.mensagens || []), msgOtimista],
    }));

    try {
      await mensagemService.enviarMensagem(activeChatId, { conteudo: texto });
      await carregarConversas(true);
    } catch (err) {
      addToast("Erro ao enviar mensagem no servidor.", "Erro", "erro");
    }
  };

  const handleAttachFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatId) return;

    if (file.size > 15 * 1024 * 1024) {
      addToast("Erro ao enviar arquivo: O arquivo excede o limite permitido de 15MB.", "Arquivo Muito Grande", "erro");
      return;
    }

    try {
      addToast(`Enviando anexo ${file.name}...`, "Upload em Andamento", "info");
      const resUpload = await mensagemService.uploadAnexo(file);
      await mensagemService.enviarMensagem(activeChatId, {
        conteudo: `[Arquivo: ${file.name}]`,
        arquivoUrl: resUpload.url,
      });
      await carregarConversas(true);
      addToast("Arquivo anexado e enviado com sucesso!", "Mensagem Enviada", "sucesso");
    } catch (err) {
      console.error("Erro no upload de anexo:", err);
      addToast(err.message || "Erro ao enviar arquivo: Formato não suportado ou erro no servidor.", "Falha no Envio", "erro");
    }
  };

  const handleDeletarMensagemIndividual = async (mensagemId) => {
    if (!mensagemId) return;
    try {
      await mensagemService.deletarMensagem(mensagemId);
      setActiveChat((prev) => ({
        ...prev,
        mensagens: (prev?.mensagens || []).filter((m) => m.id !== mensagemId),
      }));
      await carregarConversas(true);
      addToast("Mensagem removida para você.", "Mensagem Excluída", "info");
    } catch (err) {
      addToast("Erro ao excluir mensagem.", "Erro", "erro");
    }
  };

  const handleLimparTudo = async () => {
    if (!activeChatId) return;
    try {
      await mensagemService.limparConversa(activeChatId);
      await carregarConversas();
      setModalLimpezaAberto(false);
      addToast("Histórico da conversa foi limpo para você com sucesso.", "Conversa Limpa", "info");
    } catch (err) {
      addToast("Erro ao limpar histórico.", "Erro", "erro");
    }
  };

  const destinatarioId = activeChat?.destinatario?.id;
  const isBlocked = destinatarioId ? blockedUsers.includes(destinatarioId) : false;

  const handleBlockUser = () => {
    setShowChatMenu(false);
    if (!destinatarioId) return;

    if (!isBlocked) {
      setBlockedUsers((prev) => [...prev, destinatarioId]);
      addToast(
        `${activeChat?.destinatario?.nome} foi bloqueado com sucesso.`,
        "Bloqueio de Contato",
        "sucesso"
      );
    } else {
      setBlockedUsers((prev) => prev.filter((id) => id !== destinatarioId));
      addToast(
        `${activeChat?.destinatario?.nome} foi desbloqueado.`,
        "Desbloqueio de Contato",
        "info"
      );
    }
  };

  return (
    <div className="bg-white text-artDark h-screen antialiased font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 h-screen flex overflow-hidden">
        {/* Painel lateral de Conversas */}
        <aside
          className={`${
            mobileView === "chat" ? "hidden" : "flex"
          } md:flex w-full md:w-80 lg:w-96 border-r border-black/5 flex-col bg-white shrink-0 z-10`}
        >
          <div className="p-6 lg:p-8 shrink-0 border-b border-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px]">
                Mensagens Diretas
              </span>

              {/* Seletor de Status do Usuário Logado */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 bg-[#F9F8F6] border border-black/5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      userPresence === "Online"
                        ? "bg-emerald-500"
                        : userPresence === "Offline"
                        ? "bg-gray-400"
                        : "bg-artOrange"
                    }`}
                  />
                  {userPresence}
                </button>

                <div className="absolute right-0 top-full mt-1 bg-white border border-black/5 rounded-xl shadow-xl py-1 hidden group-hover:block z-50 w-28 text-left">
                  {["Online", "Offline", "Invisível"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setUserPresence(st)}
                      className="w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-[#F9F8F6] hover:text-artDark"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-4xl italic leading-none">Mensagens.</h2>
              <button
                type="button"
                onClick={() => setModalNovoChatAberto(true)}
                className="w-9 h-9 rounded-full bg-artPurple/10 text-artPurple hover:bg-artPurple hover:text-white transition-all flex items-center justify-center text-xs shadow-sm"
                title="Nova Conversa"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mt-2">
              Converse diretamente com artistas, colecionadores e entusiastas da comunidade.
            </p>
          </div>

          {/* Lista de Conversas Reais */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 no-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                <i className="fa-solid fa-spinner fa-spin text-xl text-artPurple mb-2 block"></i>
                Carregando conversas...
              </div>
            ) : conversas.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <div className="w-12 h-12 rounded-full bg-artPurple/10 text-artPurple flex items-center justify-center mx-auto mb-3 text-lg">
                  <i className="fa-regular fa-comment-dots"></i>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 text-artDark">
                  Nenhuma conversa ativa
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                  Inicie um diálogo com um dos artistas da plataforma.
                </p>
                <button
                  type="button"
                  onClick={() => setModalNovoChatAberto(true)}
                  className="bg-artPurple text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-artPurple/20"
                >
                  Iniciar Conversa
                </button>
              </div>
            ) : (
              conversas.map((chat) => {
                const destNome = chat.destinatario?.nome || "Usuário Artfolio";
                const destAvatar = chat.destinatario?.fotoPerfil
                  ? getMediaUrl(chat.destinatario.fotoPerfil)
                  : "";
                const ultimaMsgTexto =
                  chat.ultimaMensagem?.conteudo ||
                  (chat.mensagens?.length > 0
                    ? chat.mensagens[chat.mensagens.length - 1].conteudo
                    : "Sem mensagens");
                const horaMsg = chat.ultimaMensagem?.dataEnvio
                  ? new Date(chat.ultimaMensagem.dataEnvio).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <button
                    type="button"
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className="w-full text-left"
                  >
                    <ConversationItem
                      active={activeChatId === chat.id}
                      name={destNome}
                      message={ultimaMsgTexto || "Anexo compartilhado"}
                      time={horaMsg}
                      image={
                        destAvatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          destNome
                        )}&backgroundColor=7c3aed,ff5c00,0066ff`
                      }
                    />
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Área Principal da Conversa */}
        <section
          className={`${
            mobileView === "inbox" ? "hidden" : "flex"
          } md:flex flex-1 flex-col bg-[#F9F8F6] relative overflow-hidden`}
        >
          {activeChat ? (
            <>
              {/* Header da Conversa */}
              <header className="p-4 sm:p-6 bg-white border-b border-black/5 flex justify-between items-center gap-4 shrink-0 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobileView("inbox")}
                    className="md:hidden w-10 h-10 rounded-full bg-[#F9F8F6] border border-black/5 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-arrow-left text-sm"></i>
                  </button>

                  <Link
                    to={destinatarioId ? `/artista/${destinatarioId}` : "/feed"}
                    className="flex items-center gap-3 min-w-0 group hover:opacity-90 transition-all"
                    title={`Ver perfil público de ${activeChat.destinatario?.nome || "Artista"}`}
                  >
                    {activeChat.destinatario?.fotoPerfil ? (
                      <img
                        src={getMediaUrl(activeChat.destinatario.fotoPerfil)}
                        alt={activeChat.destinatario?.nome}
                        className="w-12 h-12 rounded-2xl object-cover border border-black/5 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-artPurple to-artBlue text-white font-bold flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                        {activeChat.destinatario?.nome?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}

                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-editorial text-2xl italic truncate group-hover:text-artPurple transition-colors">
                          {activeChat.destinatario?.nome || "Usuário"}
                        </span>

                        <span className="bg-emerald-50 text-emerald-600 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                          {activeChat.destinatario?.tipo_conta || "Artista"}
                        </span>

                        {isBlocked && (
                          <span className="bg-red-50 text-red-500 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                            Bloqueado
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-0.5 flex items-center gap-1 group-hover:text-artOrange transition-colors">
                        <span>Ver Perfil do Artista</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-2 relative">
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

                        <div className="absolute right-0 mt-2 w-60 bg-white border border-black/5 rounded-[1.2rem] py-2 shadow-2xl z-40 animate-slide-in">
                          <button
                            type="button"
                            onClick={() => {
                              setShowChatMenu(false);
                              setModalLimpezaAberto(true);
                            }}
                            className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-[#F9F8F6] hover:text-artDark flex items-center gap-2"
                          >
                            <i className="fa-solid fa-trash text-artOrange"></i>
                            Limpar Histórico
                          </button>

                          <button
                            type="button"
                            onClick={handleBlockUser}
                            className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-[#F9F8F6] hover:text-red-500 flex items-center gap-2"
                          >
                            <i className="fa-solid fa-ban text-red-500"></i>
                            {isBlocked ? "Desbloquear contato" : "Bloquear contato"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </header>

              {/* Histórico de Mensagens */}
              <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto space-y-4 no-scrollbar">
                {(!activeChat.mensagens || activeChat.mensagens.length === 0) ? (
                  <div className="h-full flex items-center justify-center text-center p-6">
                    <div>
                      <i className="fa-regular fa-comments text-4xl text-gray-300 mb-3 block"></i>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Nenhuma mensagem nesta conversa
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Diga olá para {activeChat.destinatario?.nome}!
                      </p>
                    </div>
                  </div>
                ) : (
                  activeChat.mensagens.map((msg, index) => {
                    const isMe = msg.enviado_por_mim || msg.idRemetente === authUser?.id;
                    const horaFormatada = msg.dataEnvio
                      ? new Date(msg.dataEnvio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex items-start gap-2 group ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {isMe && (
                          <button
                            type="button"
                            onClick={() => handleDeletarMensagemIndividual(msg.id)}
                            title="Excluir mensagem para mim"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 self-center text-xs"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}

                        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <MessageBubble
                            sent={isMe}
                            text={msg.conteudo || ""}
                            time={horaFormatada}
                          />
                          {msg.arquivoUrl && (
                            <div className="mt-2 max-w-xs rounded-2xl overflow-hidden border border-black/5 shadow-md">
                              <img
                                src={getMediaUrl(msg.arquivoUrl)}
                                alt="Anexo"
                                className="w-full h-auto"
                              />
                            </div>
                          )}
                        </div>

                        {!isMe && (
                          <button
                            type="button"
                            onClick={() => handleDeletarMensagemIndividual(msg.id)}
                            title="Excluir mensagem para mim"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 self-center text-xs"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input de Mensagem */}
              <footer className="p-4 sm:p-6 lg:p-8 bg-white border-t border-black/5 shrink-0">
                {isBlocked ? (
                  <div className="bg-red-50 text-red-500 rounded-full py-3 px-6 text-center text-xs font-bold">
                    Você bloqueou este contato. Desbloqueie para enviar novas mensagens.
                  </div>
                ) : (
                  <form
                    onSubmit={handleSendMessage}
                    className="max-w-4xl mx-auto relative flex items-center"
                  >
                    <input
                      type="text"
                      value={currentDraft}
                      onChange={(e) => setCurrentDraft(e.target.value)}
                      placeholder={`Escreva sua mensagem para ${
                        activeChat.destinatario?.nome || "o artista"
                      }...`}
                      className="w-full bg-[#F9F8F6] py-4 pl-5 sm:pl-6 pr-28 rounded-full border-none outline-none focus:ring-2 ring-artPurple/20 transition-all font-light text-sm"
                    />

                    <div className="absolute right-3 flex items-center space-x-1">
                      <label
                        className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-400 transition-colors flex items-center justify-center cursor-pointer"
                        title="Anexar arquivo / imagem"
                      >
                        <i className="fa-solid fa-paperclip"></i>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleAttachFile}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={!currentDraft.trim()}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-artPurple to-artBlue text-white hover:opacity-90 shadow-md shadow-artPurple/25 transition-all flex items-center justify-center active:scale-95 disabled:opacity-40"
                        title="Enviar mensagem"
                      >
                        <i className="fa-solid fa-arrow-up"></i>
                      </button>
                    </div>
                  </form>
                )}
              </footer>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6">
              <div>
                <div className="w-16 h-16 rounded-3xl bg-artPurple/10 text-artPurple flex items-center justify-center text-2xl mx-auto mb-3">
                  <i className="fa-regular fa-comments"></i>
                </div>
                <h3 className="font-editorial text-3xl italic mb-2">Suas Conversas</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mb-4">
                  Selecione uma conversa ao lado ou inicie um novo chat com um artista da comunidade.
                </p>
                <button
                  type="button"
                  onClick={() => setModalNovoChatAberto(true)}
                  className="bg-artPurple text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-artPurple/20"
                >
                  Nova Conversa
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modal de Nova Conversa com Artista Real */}
      {modalNovoChatAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl border border-black/5 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-artPurple/10 text-artPurple flex items-center justify-center text-sm">
                  <i className="fa-solid fa-user-plus"></i>
                </div>
                <h3 className="font-editorial text-2xl italic">Iniciar Conversa</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNovoChatAberto(false)}
                className="text-gray-400 hover:text-artDark text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Selecione um artista cadastrado no Artfolio para enviar uma mensagem:
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 no-scrollbar mb-4">
              {artistasDisponiveis.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">
                  Nenhum outro artista disponível no momento.
                </div>
              ) : (
                artistasDisponiveis.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleIniciarConversaComArtista(art)}
                    className="w-full p-3 rounded-2xl bg-[#F9F8F6] hover:bg-artPurple/5 hover:border-artPurple/20 border border-transparent transition-all flex items-center gap-3 text-left group"
                  >
                    {art.fotoPerfil ? (
                      <img
                        src={getMediaUrl(art.fotoPerfil)}
                        alt={art.nome}
                        className="w-10 h-10 rounded-full object-cover border border-black/5"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-artPurple text-white font-bold flex items-center justify-center text-sm">
                        {art.nome?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-editorial text-base italic font-bold group-hover:text-artPurple transition-colors truncate">
                        {art.nome}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">
                        {art.biografia || "Artista no Artfolio"}
                      </p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-300 group-hover:text-artPurple transition-colors"></i>
                  </button>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setModalNovoChatAberto(false)}
              className="w-full bg-gray-100 text-gray-500 py-3 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Limpeza de Histórico */}
      {modalLimpezaAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl border border-black/5 animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center text-xl mb-4">
              <i className="fa-solid fa-broom"></i>
            </div>

            <h3 className="font-editorial text-3xl italic mb-2">Opções de Limpeza</h3>

            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Deseja realmente limpar todo o histórico de mensagens desta conversa com{" "}
              <strong>{activeChat?.destinatario?.nome}</strong>?
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleLimparTudo}
                className="w-full bg-red-500 text-white py-4 rounded-full text-xs font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                <i className="fa-solid fa-trash"></i>
                Limpar Todo o Histórico
              </button>

              <button
                type="button"
                onClick={() => setModalLimpezaAberto(false)}
                className="w-full bg-gray-100 text-gray-500 py-3 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}