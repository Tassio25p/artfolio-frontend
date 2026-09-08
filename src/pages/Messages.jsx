import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ConversationItem from "../components/ConversationItem";
import MessageBubble from "../components/MessageBubble";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { mensagemService, usuarioService, planosService, authService, getMediaUrl } from "../services/api";

export default function Messages() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const { user: authUser } = useAuth();
  const user = authUser;
  const messagesEndRef = useRef(null);

  const [conversas, setConversas] = useState([]);
  const [artistasDisponiveis, setArtistasDisponiveis] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const activeChatIdRef = useRef(activeChatId);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meuPlano, setMeuPlano] = useState(null);
  const [meuUsuario, setMeuUsuario] = useState(null);

  // Conversas ocultas persistidas no localStorage
  const [hiddenChatIds, setHiddenChatIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("artfolio_hidden_chats")) || [];
    } catch {
      return [];
    }
  });

  const ultimoChatLidoRef = useRef(null);
  const authUserIdRef = useRef(authUser?.id);
  useEffect(() => {
    authUserIdRef.current = authUser?.id;
  }, [authUser?.id]);

  const hiddenChatIdsRef = useRef(hiddenChatIds);
  useEffect(() => {
    hiddenChatIdsRef.current = hiddenChatIds;
  }, [hiddenChatIds]);

  // 1. REF PARA EVITAR STALE CLOSURE E LOOPS
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
    window.__artfolio_active_chat_id = activeChatId ? String(activeChatId) : null;
    return () => {
      window.__artfolio_active_chat_id = null;
    };
  }, [activeChatId]);

  // Indicador de digitação em tempo real
  const [outroUsuarioDigitando, setOutroUsuarioDigitando] = useState(false);
  const digitandoTimeoutRef = useRef(null);
  const ultimoEnvioDigitandoRef = useRef(0);

  // Trava de Nova Conversa exclusiva para seguidores
  const [seguidores, setSeguidores] = useState([]);
  const [carregandoSeguidores, setCarregandoSeguidores] = useState(false);

  useEffect(() => {
    localStorage.setItem("artfolio_hidden_chats", JSON.stringify(hiddenChatIds));
  }, [hiddenChatIds]);

  // Busca dinâmica de qualquer usuário para conversar
  const [termoBuscaUsuario, setTermoBuscaUsuario] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscandoUsuarios, setBuscandoUsuarios] = useState(false);

  // Rascunho de mensagem
  const [currentDraft, setCurrentDraft] = useState("");
  const [userPresence, setUserPresence] = useState("Online");

  // Menus e Modais
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [modalLimpezaAberto, setModalLimpezaAberto] = useState(false);
  const [modalNovoChatAberto, setModalNovoChatAberto] = useState(false);
  const [buscaModalTexto, setBuscaModalTexto] = useState("");
  const [resultadosModal, setResultadosModal] = useState([]);
  const [buscandoModal, setBuscandoModal] = useState(false);

  // Seleção individual de mensagens
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  // Edição de Mensagens (janela de 15 min)
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // Denúncia de Usuários / Conversas
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [denunciaMotivo, setDenunciaMotivo] = useState("Golpe / Fraude Financeira");
  const [denunciaDescricao, setDenunciaDescricao] = useState("");
  const [enviandoDenuncia, setEnviandoDenuncia] = useState(false);

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
  const carregarConversas = useCallback(async (silencioso = false) => {
    try {
      const lista = await mensagemService.listarConversas();
      const convs = Array.isArray(lista) ? lista : [];
      setConversas(convs);

      const currentId = activeChatIdRef.current;
      if (convs.length > 0 && !currentId) {
        const visiveis = convs.filter((c) => !hiddenChatIdsRef.current.includes(c.id));
        const inicial = visiveis.length > 0 ? visiveis[0] : convs[0];
        if (inicial) {
          setActiveChatId(inicial.id);
          setActiveChat(inicial);
          activeChatIdRef.current = inicial.id;
        }
      } else if (currentId) {
        const atual = convs.find((c) => c.id === currentId);
        if (atual) {
          setActiveChat(atual);
        }
      }
    } catch (err) {
      if (!silencioso) console.error("Erro ao carregar conversas:", err);
    } finally {
      if (!silencioso) setLoading(false);
    }
  }, []);

  // Carregar outros artistas reais para iniciar novas conversas
  const carregarArtistas = useCallback(async () => {
    try {
      const lista = await usuarioService.listarArtistas();
      if (Array.isArray(lista)) {
        // Filtrar a si próprio
        setArtistasDisponiveis(lista.filter((a) => a.id !== authUserIdRef.current));
      }
    } catch (err) {
      console.error("Erro ao carregar artistas:", err);
    }
  }, []);

  // Executado APENAS UMA VEZ na montagem do componente
  useEffect(() => {
    carregarConversas();
    carregarArtistas();
    planosService.obterMeuPlano().then(setMeuPlano).catch(() => null);
    authService.getMe().then(setMeuUsuario).catch(() => null);

    // Processar parâmetros de URL (CTA do perfil)
    const paramArtistaId = searchParams.get("artistaId");
    const paramMsg = searchParams.get("msg");
    if (paramArtistaId) {
      const artIdNum = Number(paramArtistaId);
      const destNome = searchParams.get("destNome") || "Artista";
      const destFoto = searchParams.get("destFoto") || "";

      const draftChat = {
        id: `draft_${artIdNum}`,
        isDraft: true,
        destinatarioId: artIdNum,
        destinatario: {
          id: artIdNum,
          nome: destNome,
          fotoPerfil: destFoto,
          tipo_conta: "artista",
        },
        mensagens: [],
      };
      setActiveChatId(draftChat.id);
      setActiveChat(draftChat);
      setMobileView("chat");

      if (paramMsg) {
        setCurrentDraft(paramMsg);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. RESTAURAR O OUVINTE EM TEMPO REAL (artfolio_sync)
  useEffect(() => {
    const handleSync = (e) => {
      console.log("[WebSocket Evento Recebido]:", e.detail);

      const payload = e.detail || {};
      const conversaRecebidaId = String(
        payload.conversa_id || 
        payload.conversaId || 
        payload.chat_id || 
        payload.id_conversa || 
        payload.mensagem?.conversa_id || 
        payload.mensagem?.idConversa ||
        ""
      );
      const chatAtualId = String(activeChatIdRef.current || "");
      const tipo = String(payload.tipo || payload.type || "").toLowerCase();

      // CASO 0: INDICADOR DE DIGITAÇÃO
      if (["digitando", "typing"].includes(tipo)) {
        const remetenteId = Number(payload.idRemetente || payload.remetente_id || payload.remetente?.id);
        const meId = Number(user?.id);
        if (chatAtualId && conversaRecebidaId && chatAtualId === conversaRecebidaId && remetenteId !== meId) {
          setOutroUsuarioDigitando(true);
          if (digitandoTimeoutRef.current) clearTimeout(digitandoTimeoutRef.current);
          digitandoTimeoutRef.current = setTimeout(() => {
            setOutroUsuarioDigitando(false);
          }, 3000);
        }
        return;
      }

      // CASO 1: RECEBIMENTO DE NOVA MENSAGEM
      if (["mensagem", "nova_mensagem", "chat_message", "new_message", "message", "chat"].includes(tipo)) {
        const rawMsg = payload.mensagem || payload.dados || payload;
        const idRemetente = rawMsg.idRemetente || rawMsg.remetente_id || rawMsg.id_remetente || rawMsg.remetente?.id || payload.idRemetente || payload.remetente_id;
        const conteudo = rawMsg.conteudo || (typeof rawMsg.mensagem === "string" ? rawMsg.mensagem : payload.conteudo || "");
        const dataEnvio = rawMsg.dataEnvio || rawMsg.dataCriacao || rawMsg.criado_em || new Date().toISOString();

        const novaMsg = {
          ...rawMsg,
          id: rawMsg.id || payload.id || `msg-${Date.now()}`,
          conversa_id: conversaRecebidaId,
          idConversa: conversaRecebidaId,
          conteudo: conteudo,
          mensagem: conteudo,
          dataEnvio: dataEnvio,
          idRemetente: idRemetente,
          remetente_id: idRemetente,
          enviado_por_mim: rawMsg.enviado_por_mim ?? (Number(idRemetente) === Number(user?.id)),
          lida: rawMsg.lida ?? false,
        };

        if (chatAtualId && conversaRecebidaId && chatAtualId === conversaRecebidaId) {
          setOutroUsuarioDigitando(false);
          if (digitandoTimeoutRef.current) clearTimeout(digitandoTimeoutRef.current);

          setActiveChat((prev) => {
            if (!prev) return prev;
            const listaAtual = Array.isArray(prev.mensagens) ? prev.mensagens : [];
            const jaExiste = listaAtual.some((m) => String(m.id) === String(novaMsg.id));
            if (jaExiste) return prev;

            return {
              ...prev,
              mensagens: [...listaAtual, novaMsg],
            };
          });

          // Marca como lida no backend se recebida de outro remetente na conversa aberta
          if (Number(idRemetente) !== Number(user?.id)) {
            mensagemService?.marcarComoLida?.(chatAtualId)?.catch?.(() => {});
          }
        }

        // Atualiza também o preview da conversa na barra lateral esquerda
        const textoPreview = payload.mensagem?.conteudo || payload.conteudo || conteudo || "Nova mensagem";
        setConversas((prevList) =>
          prevList.map((c) =>
            String(c.id) === conversaRecebidaId
              ? {
                  ...c,
                  ultima_mensagem: textoPreview,
                  ultimaMensagem: {
                    conteudo: textoPreview,
                    dataEnvio: dataEnvio,
                  },
                  atualizado_em: new Date().toISOString(),
                }
              : c
          )
        );
        return;
      }

      // CASO 2: CONFIRMAÇÃO DE LEITURA (DOIS TRAÇOS VERDES)
      if (["mensagens_lidas", "leitura", "read_receipt", "mensagem_lida"].includes(tipo)) {
        if (chatAtualId && conversaRecebidaId && chatAtualId === conversaRecebidaId) {
          setActiveChat((prev) => {
            if (!prev || !prev.mensagens) return prev;
            return {
              ...prev,
              mensagens: prev.mensagens.map((msg) =>
                Number(msg.remetente_id || msg.remetente?.id || msg.idRemetente) === Number(user?.id) || msg.enviado_por_mim
                  ? { ...msg, lida: true }
                  : msg
              ),
            };
          });
        }
        return;
      }

      // CASO 3: EDIÇÃO DE MENSAGEM EM TEMPO REAL
      if (["mensagem_editada", "message_edited"].includes(tipo)) {
        const msgId = String(payload.mensagem_id || payload.id || "");
        const novoTexto = payload.novo_conteudo || payload.conteudo;
        const editadoEm = payload.editado_em || new Date().toISOString();

        if (chatAtualId && conversaRecebidaId && chatAtualId === conversaRecebidaId) {
          setActiveChat((prev) => {
            if (!prev || !prev.mensagens) return prev;
            return {
              ...prev,
              mensagens: prev.mensagens.map((m) =>
                String(m.id) === msgId
                  ? { ...m, conteudo: novoTexto, editado_em: editadoEm }
                  : m
              ),
            };
          });
        }

        // Atualizar prévia na barra lateral
        setConversas((prev) =>
          prev.map((c) => {
            if (String(c.id) === conversaRecebidaId && String(c.ultimaMensagem?.id) === msgId) {
              return {
                ...c,
                ultima_mensagem: novoTexto,
                ultimaMensagem: {
                  ...c.ultimaMensagem,
                  conteudo: novoTexto,
                },
              };
            }
            return c;
          })
        );
        return;
      }

      // CASO 4: EXCLUSÃO DE MENSAGEM (SOFT DELETE) EM TEMPO REAL
      if (["mensagem_excluida", "message_deleted"].includes(tipo)) {
        const msgId = String(payload.mensagem_id || payload.id || "");
        const deletadoEm = payload.deletado_em || new Date().toISOString();

        if (chatAtualId && conversaRecebidaId && chatAtualId === conversaRecebidaId) {
          setActiveChat((prev) => {
            if (!prev || !prev.mensagens) return prev;
            return {
              ...prev,
              mensagens: prev.mensagens.map((m) =>
                String(m.id) === msgId
                  ? { ...m, deletado_em: deletadoEm }
                  : m
              ),
            };
          });
        }

        // Atualizar prévia na barra lateral
        setConversas((prev) =>
          prev.map((c) => {
            if (String(c.id) === conversaRecebidaId && String(c.ultimaMensagem?.id) === msgId) {
              return {
                ...c,
                ultima_mensagem: "Esta mensagem foi apagada",
                ultimaMensagem: {
                  ...c.ultimaMensagem,
                  conteudo: "Esta mensagem foi apagada",
                },
              };
            }
            return c;
          })
        );
        return;
      }
    };

    window.addEventListener("artfolio_sync", handleSync);
    return () => {
      window.removeEventListener("artfolio_sync", handleSync);
      if (digitandoTimeoutRef.current) clearTimeout(digitandoTimeoutRef.current);
    };
  }, [user?.id]);

  // Smart Scroll: Mantém a rolagem onde o usuário está lendo
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesContainerRef = useRef(null);

  const handleScrollMessages = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceFromBottom < 100;
    setIsAtBottom(atBottom);
    setShowScrollToBottom(!atBottom);
  };

  // Ao trocar de conversa, rola imediatamente para baixo
  useEffect(() => {
    if (activeChatId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setIsAtBottom(true);
      setShowScrollToBottom(false);
    }
  }, [activeChatId]);

  // Quando chegam novas mensagens, só rola se o usuário já estiver no final
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.mensagens?.length]);

  const handleSelectChat = (chat) => {
    if (!chat) return;
    setActiveChatId(chat.id);
    setActiveChat(chat);
    activeChatIdRef.current = chat.id;
    setMobileView("chat");
    setShowChatMenu(false);
    setSelectionMode(false);
    setSelectedIndexes([]);
    setCurrentDraft("");
    setIsAtBottom(true);
    setShowScrollToBottom(false);
    // Re-exibir na sidebar se estiver na lista de ocultas
    if (chat.id && hiddenChatIds.includes(chat.id)) {
      setHiddenChatIds((prev) => prev.filter((id) => id !== chat.id));
    }
  };

  const handleHideConversation = (chatId) => {
    const novosOcultos = [...new Set([...hiddenChatIds, chatId])];
    setHiddenChatIds(novosOcultos);
    localStorage.setItem("artfolio_hidden_chats", JSON.stringify(novosOcultos));

    if (activeChatId === chatId) {
      const restantes = conversas.filter(
        (c) => c.id !== chatId && !novosOcultos.includes(c.id)
      );
      if (restantes.length > 0) {
        handleSelectChat(restantes[0]);
      } else {
        setActiveChatId(null);
        setActiveChat(null);
        activeChatIdRef.current = null;
      }
    }
    addToast("Conversa ocultada da barra lateral.", "Chat", "info");
  };

  // Buscar usuários no backend
  const handleDigitarBuscaUsuario = async (texto) => {
    setTermoBuscaUsuario(texto);
    if (!texto.trim()) {
      setResultadosBusca([]);
      return;
    }

    setBuscandoUsuarios(true);
    try {
      const usuariosEncontrados = await usuarioService.buscarUsuariosChat(texto);
      setResultadosBusca(usuariosEncontrados);
    } catch {
      setResultadosBusca([]);
    } finally {
      setBuscandoUsuarios(false);
    }
  };

  const handleSelecionarUsuarioBusca = (usuario) => {
    setTermoBuscaUsuario("");
    setResultadosBusca([]);

    // Verifica se já existe conversa no estado local
    const convExistente = conversas.find((c) => c.destinatario?.id === usuario.id);
    if (convExistente) {
      handleSelectChat(convExistente);
      return;
    }

    // Abre janela em modo preliminar (só salva no banco se enviar mensagem)
    const draftChat = {
      id: `draft_${usuario.id}`,
      isDraft: true,
      destinatarioId: usuario.id,
      destinatario: {
        id: usuario.id,
        nome: usuario.nome,
        fotoPerfil: usuario.fotoPerfil,
        tipo_conta: usuario.tipo_conta,
        plano: usuario.plano,
        mostrar_moldura_led: usuario.mostrar_moldura_led,
      },
      mensagens: [],
    };
    setActiveChatId(draftChat.id);
    setActiveChat(draftChat);
    activeChatIdRef.current = draftChat.id;
    setMobileView("chat");
    setShowChatMenu(false);
    setCurrentDraft("");
  };

  const checarSeSeguidor = (artista) => {
    if (!artista) return false;
    return Boolean(
      artista.te_segue ||
      artista.segue_voce ||
      artista.is_seguidor ||
      artista.isSeguidor ||
      artista.teSegue ||
      artista.segueVoce ||
      artista.segueDeVolta ||
      seguidores.some((s) => Number(s.id) === Number(artista.id))
    );
  };

  const abrirModalNovoChat = async () => {
    setModalNovoChatAberto(true);
    setBuscaModalTexto("");
    setResultadosModal([]);
    carregarArtistas();
    if (authUser?.id) {
      setCarregandoSeguidores(true);
      try {
        const segs = await usuarioService.listarSeguidores(authUser.id);
        setSeguidores(Array.isArray(segs) ? segs : []);
      } catch {
        setSeguidores([]);
      } finally {
        setCarregandoSeguidores(false);
      }
    }
  };

  const handleDigitarBuscaModal = async (texto) => {
    setBuscaModalTexto(texto);
    if (!texto.trim()) {
      setResultadosModal([]);
      return;
    }

    setBuscandoModal(true);
    try {
      const encontrados = await usuarioService.buscarUsuariosChat(texto);
      setResultadosModal(encontrados);
    } catch {
      setResultadosModal([]);
    } finally {
      setBuscandoModal(false);
    }
  };

  const handleIniciarConversaComArtista = async (artista) => {
    // Trava de Nova Conversa: permitida exclusivamente com seguidores
    const isSeguidor = checarSeSeguidor(artista);
    if (!isSeguidor) {
      addToast(
        "Você só pode iniciar conversas com usuários que seguem o seu perfil.",
        "Acesso Restrito",
        "aviso"
      );
      return;
    }

    handleSelecionarUsuarioBusca(artista);
    setModalNovoChatAberto(false);
    setBuscaModalTexto("");
    setResultadosModal([]);
  };

  // 3. TRAVA DE LEITURA (SELECIONAR CHAT):
  // Garante que ao trocar de activeChatId, a chamada para marcar lida e carregar mensagens execute apenas uma vez por chat selecionado, sem gerar requisições contínuas.
  useEffect(() => {
    if (!activeChatId || activeChat?.isDraft) return;

    // Trava contra requisição duplicada de leitura
    if (ultimoChatLidoRef.current === activeChatId) return;
    ultimoChatLidoRef.current = activeChatId;

    mensagemService?.marcarComoLida?.(activeChatId)?.catch?.(() => {});
  }, [activeChatId, activeChat?.isDraft]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!currentDraft.trim() || !activeChatId) return;

    const texto = currentDraft.trim();
    setCurrentDraft("");

    // Se for conversa rascunho (draft), cria a conversa agora no primeiro envio
    let conversaIdReal = activeChatId;
    if (activeChat?.isDraft) {
      try {
        const novaConversa = await mensagemService.obterOuCriarConversa(activeChat.destinatarioId);
        conversaIdReal = novaConversa.id;
        setActiveChatId(novaConversa.id);
      } catch (err) {
        addToast(err.message || "Erro ao iniciar conversa.", "Erro", "erro");
        return;
      }
    }

    // Mensagem otimista com confirmação visual de envio e leitura (dois traços)
    const msgOtimista = {
      id: `otimista-${Date.now()}`,
      idConversa: conversaIdReal,
      idRemetente: authUser?.id || 0,
      conteudo: texto,
      dataEnvio: new Date().toISOString(),
      enviado_por_mim: true,
      lida: false,
    };

    setActiveChat((prev) => ({
      ...prev,
      id: conversaIdReal,
      isDraft: false,
      mensagens: [...(prev?.mensagens || []), msgOtimista],
    }));

    try {
      await mensagemService.enviarMensagem(conversaIdReal, { conteudo: texto });
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

  const handleStartEdit = (msg) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.conteudo || "");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !editingText.trim()) return;
    setSalvandoEdicao(true);
    try {
      await mensagemService.editarMensagem(editingMessageId, { conteudo: editingText.trim() });
      setActiveChat((prev) => {
        if (!prev || !prev.mensagens) return prev;
        return {
          ...prev,
          mensagens: prev.mensagens.map((m) =>
            m.id === editingMessageId
              ? { ...m, conteudo: editingText.trim(), editado_em: new Date().toISOString() }
              : m
          ),
        };
      });
      addToast("Mensagem editada com sucesso!", "Mensagem Atualizada", "sucesso");
      handleCancelEdit();
    } catch (err) {
      addToast(
        err.message || "A mensagem só pode ser editada em até 15 minutos após o envio.",
        "Não foi possível editar",
        "erro"
      );
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const handleConfirmarExclusao = async (mensagemId) => {
    if (!mensagemId) return;
    if (!window.confirm("Deseja realmente apagar esta mensagem para todos na conversa?")) return;

    try {
      await mensagemService.deletarMensagem(mensagemId);
      setActiveChat((prev) => {
        if (!prev || !prev.mensagens) return prev;
        return {
          ...prev,
          mensagens: prev.mensagens.map((m) =>
            m.id === mensagemId ? { ...m, deletado_em: new Date().toISOString() } : m
          ),
        };
      });
      addToast("Mensagem apagada com sucesso.", "Mensagem Apagada", "info");
    } catch (err) {
      addToast(err.message || "Erro ao apagar mensagem.", "Erro", "erro");
    }
  };

  const handleAbrirModalDenuncia = () => {
    setShowChatMenu(false);
    setDenunciaMotivo("Golpe / Fraude Financeira");
    setDenunciaDescricao("");
    setModalDenunciaAberto(true);
  };

  const handleEnviarDenuncia = async (e) => {
    e.preventDefault();
    if (!activeChatId || !activeChat?.destinatario?.id) return;

    setEnviandoDenuncia(true);
    try {
      await mensagemService.denunciarConversa({
        denunciado_id: activeChat.destinatario.id,
        conversa_id: activeChat.id,
        motivo: denunciaMotivo,
        descricao: denunciaDescricao.trim() || null,
      });
      addToast(
        "Denúncia registrada com sucesso! Nossa equipe de moderação irá avaliar o caso.",
        "Denúncia Enviada",
        "sucesso"
      );
      setModalDenunciaAberto(false);
      setDenunciaDescricao("");
    } catch (err) {
      addToast(err.message || "Erro ao registrar denúncia.", "Falha", "erro");
    } finally {
      setEnviandoDenuncia(false);
    }
  };

  const handleDeletarMensagemIndividual = async (mensagemId) => {
    handleConfirmarExclusao(mensagemId);
  };

  const handleDeletarMensagensSelecionadas = async () => {
    if (selectedIndexes.length === 0 || !activeChat?.mensagens) return;
    try {
      const msgsParaDeletar = selectedIndexes
        .map((idx) => activeChat.mensagens[idx]?.id)
        .filter(Boolean);
      for (const msgId of msgsParaDeletar) {
        await mensagemService.deletarMensagem(msgId).catch(() => {});
      }
      setActiveChat((prev) => ({
        ...prev,
        mensagens: (prev?.mensagens || []).filter((_, idx) => !selectedIndexes.includes(idx)),
      }));
      setSelectionMode(false);
      setSelectedIndexes([]);
      await carregarConversas(true);
      addToast("Mensagens selecionadas foram excluídas.", "Excluídas", "info");
    } catch {
      addToast("Erro ao excluir mensagens selecionadas.", "Erro", "erro");
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

  const isProOuBoost =
    (meuPlano?.tipo || meuUsuario?.plano || authUser?.tipo_plano || authUser?.plano?.tipo || "").toLowerCase() === "pro" ||
    (meuPlano?.tipo || meuUsuario?.plano || authUser?.tipo_plano || authUser?.plano?.tipo || "").toLowerCase() === "boost";

  const handleInserirMensagemPrePronta = async () => {
    let pitch = meuUsuario?.mensagem_cta || authUser?.mensagem_cta;
    if (!pitch) {
      try {
        const fresh = await authService.getMe();
        if (fresh) {
          setMeuUsuario(fresh);
          pitch = fresh.mensagem_cta;
        }
      } catch (err) {
        console.error("Erro ao buscar pitch:", err);
      }
    }

    if (pitch && pitch.trim()) {
      setCurrentDraft(pitch.trim());
      addToast("Mensagem pré-pronta inserida na caixa de texto!", "Proposta Rápida", "sucesso");
    } else {
      addToast(
        "Você ainda não configurou uma mensagem pré-pronta. Configure em Configurações > Conta.",
        "Sem Mensagem Salva",
        "info"
      );
    }
  };

  return (
    <div className="w-full bg-white text-artDark h-screen antialiased font-sans overflow-hidden">
      <div className="w-full h-screen flex overflow-hidden">
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
                onClick={abrirModalNovoChat}
                className="w-9 h-9 rounded-full bg-artPurple/10 text-artPurple hover:bg-artPurple hover:text-white transition-all flex items-center justify-center text-xs shadow-sm cursor-pointer"
                title="Nova Conversa com Seguidor"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mt-2 mb-4">
              Converse diretamente com seus seguidores da comunidade.
            </p>

            <button
              type="button"
              onClick={abrirModalNovoChat}
              className="w-full bg-gradient-to-r from-artPurple via-indigo-600 to-artBlue text-white py-3 px-4 rounded-2xl text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm shadow-artPurple/20 active:scale-98 cursor-pointer"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Nova Conversa</span>
            </button>
          </div>

          {/* Lista de Conversas Reais */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 no-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                <i className="fa-solid fa-spinner fa-spin text-xl text-artPurple mb-2 block"></i>
                Carregando conversas...
              </div>
            ) : conversas.filter((c) => !hiddenChatIds.includes(c.id)).length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <div className="w-12 h-12 rounded-full bg-artPurple/10 text-artPurple flex items-center justify-center mx-auto mb-3 text-lg">
                  <i className="fa-regular fa-comment-dots"></i>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 text-artDark">
                  Nenhuma conversa visível
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                  Inicie um diálogo com qualquer artista ou usuário.
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
              conversas
                .filter((chat) => !hiddenChatIds.includes(chat.id))
                .map((chat) => {
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
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className="w-full text-left"
                    >
                      <ConversationItem
                        active={activeChatId === chat.id}
                        name={destNome}
                        message={ultimaMsgTexto || "Anexo compartilhado"}
                        time={horaMsg}
                        onHide={() => handleHideConversation(chat.id)}
                        image={
                          destAvatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            destNome
                          )}&backgroundColor=7c3aed,ff5c00,0066ff`
                        }
                      />
                    </div>
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
              <header className="p-4 sm:p-5 bg-white border-b border-black/5 flex justify-between items-center gap-4 shrink-0 shadow-sm">
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
                        className="w-11 h-11 rounded-2xl object-cover border border-black/5 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-artPurple to-artBlue text-white font-bold flex items-center justify-center text-base shadow-sm group-hover:scale-105 transition-transform">
                        {activeChat.destinatario?.nome?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}

                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-editorial text-2xl italic truncate group-hover:text-artPurple transition-colors">
                          {activeChat.destinatario?.nome || "Usuário"}
                        </span>

                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                          {activeChat.destinatario?.tipo_conta || "Artista"}
                        </span>

                        {isBlocked && (
                          <span className="bg-red-50 text-red-500 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                            Bloqueado
                          </span>
                        )}
                      </div>

                      {outroUsuarioDigitando ? (
                        <p className="text-[11px] font-semibold text-emerald-500 mt-0.5 flex items-center gap-1.5 animate-pulse">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          Digitando...
                        </p>
                      ) : (
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-0.5 flex items-center gap-1 group-hover:text-artOrange transition-colors">
                          <span>Ver Perfil</span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                        </p>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Ações do Topo do Chat */}
                <div className="flex items-center gap-2 relative">
                  {selectionMode ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDeletarMensagensSelecionadas}
                        disabled={selectedIndexes.length === 0}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                        <span>Excluir ({selectedIndexes.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectionMode(false);
                          setSelectedIndexes([]);
                        }}
                        className="text-xs text-gray-400 hover:text-artDark px-2 py-1"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleAbrirModalDenuncia}
                        className="w-10 h-10 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center text-sm border border-black/5 cursor-pointer"
                        title="Denunciar usuário ou conversa"
                      >
                        <i className="fa-regular fa-flag"></i>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowChatMenu(!showChatMenu)}
                        className="w-10 h-10 rounded-full hover:bg-[#F9F8F6] text-gray-400 hover:text-artDark transition-colors flex items-center justify-center text-sm border border-black/5 cursor-pointer"
                        title="Opções da conversa"
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>

                      {showChatMenu && (
                        <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-black/10 py-2 z-50 text-xs animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => {
                              setShowChatMenu(false);
                              setSelectionMode(true);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-[#F9F8F6] flex items-center gap-2.5 text-artDark cursor-pointer"
                          >
                            <i className="fa-regular fa-square-check text-artPurple"></i>
                            <span>Selecionar mensagens</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowChatMenu(false);
                              setModalLimpezaAberto(true);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-500 flex items-center gap-2.5 cursor-pointer"
                          >
                            <i className="fa-solid fa-broom"></i>
                            <span>Limpar histórico</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleAbrirModalDenuncia}
                            className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2.5 border-t border-black/5 cursor-pointer"
                          >
                            <i className="fa-regular fa-flag"></i>
                            <span>Denunciar usuário</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowChatMenu(false);
                              handleBlockUser();
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-500 flex items-center gap-2.5 border-t border-black/5 cursor-pointer"
                          >
                            <i className={isBlocked ? "fa-solid fa-unlock" : "fa-solid fa-ban"}></i>
                            <span>{isBlocked ? "Desbloquear contato" : "Bloquear contato"}</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </header>

              {/* Histórico de Mensagens */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScrollMessages}
                className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto space-y-3 no-scrollbar relative"
              >
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
                    const isMe =
                      msg.enviado_por_mim ||
                      msg.idRemetente === authUser?.id ||
                      Number(msg.remetente_id || msg.remetente?.id) === Number(authUser?.id);
                    const horaFormatada = msg.dataEnvio
                      ? new Date(msg.dataEnvio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";
                    const podeEditar = Boolean(
                      isMe &&
                      !msg.deletado_em &&
                      msg.dataEnvio &&
                      Date.now() - new Date(msg.dataEnvio).getTime() < 15 * 60 * 1000
                    );

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex items-start gap-2 group ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex flex-col max-w-md ${isMe ? "items-end" : "items-start"}`}>
                          {editingMessageId === msg.id ? (
                            /* Modo de Edição Inline da Mensagem */
                            <div className="w-full min-w-[260px] sm:min-w-[320px] bg-white border-2 border-artPurple/30 rounded-3xl p-3.5 shadow-xl flex flex-col gap-2 animate-fadeIn">
                              <div className="flex items-center justify-between text-xs font-bold text-artPurple">
                                <span className="flex items-center gap-1.5">
                                  <i className="fa-solid fa-pen text-[10px]"></i>
                                  <span>Editar mensagem</span>
                                </span>
                                <span className="text-[10px] text-gray-400 font-normal">Janela de 15 min</span>
                              </div>
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSaveEdit();
                                  } else if (e.key === "Escape") {
                                    handleCancelEdit();
                                  }
                                }}
                                rows={2}
                                className="w-full p-2.5 text-xs text-artDark border border-black/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-artPurple resize-none bg-[#F9F8F6]"
                                placeholder="Altere sua mensagem..."
                                autoFocus
                              />
                              <div className="flex justify-end items-center gap-2 pt-0.5 text-xs">
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-xl font-medium cursor-pointer transition-colors"
                                  disabled={salvandoEdicao}
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveEdit}
                                  className="px-3.5 py-1 bg-artPurple text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                                  disabled={salvandoEdicao || !editingText.trim()}
                                >
                                  {salvandoEdicao ? (
                                    <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                                  ) : (
                                    <i className="fa-solid fa-check text-xs"></i>
                                  )}
                                  <span>Salvar</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            (msg.conteudo || msg.deletado_em) && (
                              <MessageBubble
                                sent={isMe}
                                text={msg.conteudo}
                                time={horaFormatada}
                                lida={msg.lida === true}
                                deletado_em={msg.deletado_em}
                                editado_em={msg.editado_em}
                                podeEditar={podeEditar}
                                onEditar={() => handleStartEdit(msg)}
                                onExcluir={() => handleConfirmarExclusao(msg.id)}
                              />
                            )
                          )}

                          {msg.arquivoUrl && !msg.deletado_em && (
                            <RenderAttachment arquivoUrl={msg.arquivoUrl} isMe={isMe} />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Indicador animado de digitação no chat */}
                {outroUsuarioDigitando && (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-2xl w-fit text-xs mb-2">
                    <span className="text-[11px] font-medium mr-1">Digitando</span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                  </div>
                )}

                <div ref={messagesEndRef} />

                {/* Botão Flutuante de Scroll para Baixo */}
                {showScrollToBottom && (
                  <button
                    type="button"
                    onClick={() => {
                      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                      setIsAtBottom(true);
                      setShowScrollToBottom(false);
                    }}
                    className="sticky bottom-4 left-1/2 -translate-x-1/2 bg-artDark/90 hover:bg-artDark text-white px-4 py-2 rounded-full shadow-2xl border border-white/20 transition-all hover:scale-105 flex items-center gap-2 z-30 animate-bounce cursor-pointer text-xs font-bold"
                    title="Rolar para as mensagens mais recentes"
                  >
                    <i className="fa-solid fa-arrow-down text-xs"></i>
                    <span>Novas mensagens</span>
                  </button>
                )}
              </div>

              {/* Input de Mensagem */}
              <footer className="p-3 sm:p-4 bg-white border-t border-black/5 shrink-0">
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
                      onChange={(e) => {
                        setCurrentDraft(e.target.value);
                        const agora = Date.now();
                        if (activeChatId && !activeChat?.isDraft && agora - ultimoEnvioDigitandoRef.current > 2000) {
                          ultimoEnvioDigitandoRef.current = agora;
                          window.dispatchEvent(
                            new CustomEvent("artfolio_enviar_socket", {
                              detail: {
                                tipo: "DIGITANDO",
                                conversa_id: activeChatId,
                                idRemetente: authUser?.id,
                              },
                            })
                          );
                        }
                      }}
                      placeholder={`Escreva sua mensagem para ${
                        activeChat.destinatario?.nome || "o artista"
                      }...`}
                      className="w-full bg-[#F9F8F6] py-4 pl-5 sm:pl-6 pr-28 rounded-full border-none outline-none focus:ring-2 ring-artPurple/20 transition-all font-light text-sm"
                    />

                    <div className="absolute right-3 flex items-center space-x-1">
                      {isProOuBoost && (
                        <button
                          type="button"
                          onClick={handleInserirMensagemPrePronta}
                          className="w-10 h-10 rounded-full hover:bg-artOrange/10 text-artOrange transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                          title="Inserir Minha Mensagem Pré-Pronta / Pitch de Vendas"
                        >
                          <i className="fa-solid fa-bolt text-sm"></i>
                        </button>
                      )}

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
                  onClick={abrirModalNovoChat}
                  className="bg-artPurple text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-artPurple/20 cursor-pointer"
                >
                  Nova Conversa
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

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

            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              <span className="font-semibold text-artPurple"><i className="fa-solid fa-shield-halved mr-1"></i>Regra de Privacidade:</span> Novas conversas só podem ser iniciadas com usuários que seguem seu perfil.
            </p>

            {/* Input de Busca de Usuário no Modal */}
            <div className="relative mb-3">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
              <input
                type="text"
                value={buscaModalTexto}
                onChange={(e) => handleDigitarBuscaModal(e.target.value)}
                placeholder="Pesquisar seguidor pelo nome..."
                className="w-full bg-[#F9F8F6] border border-black/5 rounded-2xl pl-9 pr-8 py-2.5 text-xs outline-none focus:ring-2 ring-artPurple/20 transition-all placeholder:text-gray-400"
                autoFocus
              />
              {buscaModalTexto && (
                <button
                  type="button"
                  onClick={() => {
                    setBuscaModalTexto("");
                    setResultadosModal([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-artDark text-xs cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Lista de Resultados da Busca ou Lista de Seguidores (Filtrada exclusivamente por quem segue) */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 no-scrollbar mb-4">
              {buscaModalTexto ? (
                buscandoModal ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    <i className="fa-solid fa-spinner fa-spin text-artPurple text-base mb-2 block"></i>
                    Buscando usuários...
                  </div>
                ) : (() => {
                  const filtrados = resultadosModal.filter(checarSeSeguidor);
                  if (filtrados.length === 0) {
                    return (
                      <div className="p-6 text-center text-xs text-gray-500">
                        <div className="w-12 h-12 rounded-full bg-artPurple/10 text-artPurple flex items-center justify-center mx-auto mb-3 text-lg">
                          <i className="fa-solid fa-user-lock"></i>
                        </div>
                        <p className="font-bold text-gray-700">
                          Você só pode iniciar conversas com usuários que seguem o seu perfil.
                        </p>
                      </div>
                    );
                  }
                  return filtrados.map((usr) => {
                    const usrPlano = (usr.plano || "Free").toLowerCase();
                    const ledClass =
                      usr.mostrar_moldura_led !== false
                        ? usrPlano === "boost"
                          ? "ring-2 ring-[#FF793F] shadow-[0_0_10px_#FF793F]"
                          : usrPlano === "pro"
                          ? "ring-2 ring-[#6C5CE7] shadow-[0_0_10px_#6C5CE7]"
                          : "ring-2 ring-[#00B894] shadow-[0_0_8px_#00B894]"
                        : "";

                    return (
                      <div
                        key={usr.id}
                        className="w-full p-3 rounded-2xl bg-[#F9F8F6] hover:bg-artPurple/5 hover:border-artPurple/20 border border-transparent transition-all flex items-center justify-between gap-3 text-left group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            {usr.fotoPerfil ? (
                              <img
                                src={getMediaUrl(usr.fotoPerfil)}
                                alt={usr.nome}
                                className={`w-10 h-10 rounded-full object-cover border border-black/5 ${ledClass}`}
                              />
                            ) : (
                              <div
                                className={`w-10 h-10 rounded-full bg-artPurple text-white font-bold flex items-center justify-center text-sm ${ledClass}`}
                              >
                                {usr.nome?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-editorial text-base italic font-bold group-hover:text-artPurple transition-colors truncate">
                                {usr.nome}
                              </h4>
                              <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full shadow-xs">
                                Te segue
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 truncate capitalize">
                              {usr.tipo_conta || "Artista"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to={`/artista/${usr.id}`}
                            onClick={() => setModalNovoChatAberto(false)}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-black/10 text-gray-600 hover:text-artPurple hover:border-artPurple transition-all"
                            title="Ver perfil completo"
                          >
                            <i className="fa-solid fa-user mr-1"></i> Perfil
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleIniciarConversaComArtista(usr)}
                            className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-artPurple text-white hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Iniciar conversa"
                          >
                            <i className="fa-solid fa-paper-plane text-[9px]"></i> Conversar
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()
              ) : carregandoSeguidores ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  <i className="fa-solid fa-spinner fa-spin text-artPurple text-base mb-2 block"></i>
                  Carregando seus seguidores...
                </div>
              ) : (() => {
                const baseLista = artistasDisponiveis.length > 0 ? artistasDisponiveis : seguidores;
                const filtrados = baseLista.filter(checarSeSeguidor);

                if (filtrados.length === 0) {
                  return (
                    <div className="p-6 text-center text-xs text-gray-500">
                      <div className="w-12 h-12 rounded-full bg-artPurple/10 text-artPurple flex items-center justify-center mx-auto mb-3 text-lg">
                        <i className="fa-solid fa-user-lock"></i>
                      </div>
                      <p className="font-bold text-gray-700">
                        Você só pode iniciar conversas com usuários que seguem o seu perfil.
                      </p>
                    </div>
                  );
                }

                return filtrados.map((seg) => (
                  <div
                    key={seg.id}
                    className="w-full p-3 rounded-2xl bg-[#F9F8F6] hover:bg-artPurple/5 hover:border-artPurple/20 border border-transparent transition-all flex items-center justify-between gap-3 text-left group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {seg.fotoPerfil ? (
                        <img
                          src={getMediaUrl(seg.fotoPerfil)}
                          alt={seg.nome}
                          className="w-10 h-10 rounded-full object-cover border border-black/5"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-artPurple text-white font-bold flex items-center justify-center text-sm">
                          {seg.nome?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-editorial text-base italic font-bold group-hover:text-artPurple transition-colors truncate">
                            {seg.nome}
                          </h4>
                          <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full">
                            Seguidor
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">
                          {seg.biografia || "Seguidor no Artfolio"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/artista/${seg.id}`}
                        onClick={() => setModalNovoChatAberto(false)}
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-black/10 text-gray-600 hover:text-artPurple hover:border-artPurple transition-all"
                        title="Ver perfil"
                      >
                        <i className="fa-solid fa-user mr-1"></i> Perfil
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleIniciarConversaComArtista(seg)}
                        className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-artPurple text-white hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Iniciar conversa"
                      >
                        <i className="fa-solid fa-paper-plane text-[9px]"></i> Conversar
                      </button>
                    </div>
                  </div>
                ));
              })()}
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

      {/* Modal de Denúncia de Conversa / Usuário */}
      {modalDenunciaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/5 relative animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-red-600">
                <div className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center text-sm">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 className="font-editorial text-2xl italic font-bold text-artDark">
                  Denunciar Usuário
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalDenunciaAberto(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-artDark transition-all flex items-center justify-center text-xs cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Você está registrando uma denúncia contra <strong className="text-artDark font-semibold">{activeChat?.destinatario?.nome || "este usuário"}</strong>. A denúncia será analisada pelos moderadores com sigilo e confidencialidade.
            </p>

            <form onSubmit={handleEnviarDenuncia} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Motivo da Denúncia *
                </label>
                <select
                  value={denunciaMotivo}
                  onChange={(e) => setDenunciaMotivo(e.target.value)}
                  className="w-full bg-[#F9F8F6] border border-black/10 rounded-2xl px-3.5 py-2.5 text-xs text-artDark focus:outline-none focus:ring-2 focus:ring-red-500 font-medium cursor-pointer"
                  required
                >
                  <option value="Golpe / Fraude Financeira">Golpe / Fraude Financeira</option>
                  <option value="Não entrega da arte / Desacordo comercial">Não entrega da arte / Desacordo comercial</option>
                  <option value="Linguagem Ofensiva / Assédio">Linguagem Ofensiva / Assédio</option>
                  <option value="Spam / Outro">Spam / Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Detalhes Adicionais (opcional)
                </label>
                <textarea
                  value={denunciaDescricao}
                  onChange={(e) => setDenunciaDescricao(e.target.value)}
                  rows={4}
                  placeholder="Descreva o que ocorreu para auxiliar a moderação..."
                  className="w-full bg-[#F9F8F6] border border-black/10 rounded-2xl p-3.5 text-xs text-artDark focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalDenunciaAberto(false)}
                  className="flex-1 py-3 border border-black/10 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer"
                  disabled={enviandoDenuncia}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviandoDenuncia}
                  className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {enviandoDenuncia ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      <span>Enviar Denúncia</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RenderAttachment({ arquivoUrl, isMe }) {
  if (!arquivoUrl) return null;
  const url = getMediaUrl(arquivoUrl);
  const ext = arquivoUrl.split("?")[0].split(".").pop().toLowerCase();

  const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
  const isPdf = ["pdf"].includes(ext);
  const isDoc = ["doc", "docx", "txt", "zip", "rar"].includes(ext);

  if (isVideo) {
    return (
      <div className="mt-2 max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border border-black/5 shadow-md bg-black">
        <video
          src={url}
          controls
          className="w-full max-h-72 object-contain"
          preload="metadata"
        />
      </div>
    );
  }

  if (isPdf || isDoc) {
    const nomeArquivo = arquivoUrl.split("/").pop() || "Documento.pdf";
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 flex items-center gap-3 p-3.5 rounded-2xl border transition-all max-w-xs sm:max-w-sm shadow-xs ${
          isMe
            ? "bg-artDark/90 border-white/10 text-white hover:bg-artDark"
            : "bg-white border-black/5 text-artDark hover:bg-gray-50"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0 text-lg">
          <i className={isPdf ? "fa-solid fa-file-pdf" : "fa-solid fa-file-lines"}></i>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold truncate">{nomeArquivo}</p>
          <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1 mt-0.5">
            <span>{isPdf ? "Documento PDF" : "Arquivo"}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
          </span>
        </div>
      </a>
    );
  }

  // Imagem / GIF padrão
  return (
    <div className="mt-2 max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border border-black/5 shadow-md bg-gray-100 group/img relative">
      <img
        src={url}
        alt="Anexo"
        className="w-full h-auto object-cover max-h-80"
        loading="lazy"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-xs"
        title="Abrir em tamanho original"
      >
        <i className="fa-solid fa-expand"></i>
      </a>
    </div>
  );
}