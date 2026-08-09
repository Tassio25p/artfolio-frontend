import React, { useState, useRef, useEffect } from 'react';
import { assistenteService } from '../../services/api';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false); 
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversaId, setConversaId] = useState(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Olá! Sou o Assistente IA. Como posso ajudar você hoje?' }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simular pulsação aleatoriamente quando fechado para chamar atenção
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      if (!isOpen) {
        setIsWaiting(true);
        setTimeout(() => setIsWaiting(false), 4000);
      }
    }, 15000);
    return () => clearInterval(pulseInterval);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsWaiting(false); 
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await assistenteService.enviarMensagem(userText, conversaId);
      if (res && res.idConversa) {
        setConversaId(res.idConversa);
      }

      const aiText = res?.resposta || 'Resposta recebida, mas sem conteúdo.';

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
      }]);
    } catch (error) {
      console.error('Erro ao se comunicar com o agente IA:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: error.message || 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.',
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputAreaState = () => {
    if (isTyping) return "loading";
    if (inputText.trim().length > 0) return "filled";
    return "empty";
  };

  // Renderiza o conteúdo da mensagem, interpretando marcadores [IMAGEM] e [NOME]
  const renderMessageContent = (text, sender) => {
    if (sender === 'user') return text;

    // Verifica se a mensagem contém marcadores de obra
    if (!text.includes('[IMAGEM]') && !text.includes('[NOME]')) {
      return text;
    }

    // Separa as obras pelo divisor ---
    const blocos = text.split('---').map(b => b.trim()).filter(Boolean);

    const obras = blocos.map((bloco, index) => {
      const imgMatch = bloco.match(/\[IMAGEM\]\s*(\S+)/);
      const nomeMatch = bloco.match(/\[NOME\]\s*(.+)/);

      const imgUrl = imgMatch ? imgMatch[1] : null;
      const nome = nomeMatch ? nomeMatch[1].trim() : null;

      if (!imgUrl && !nome) return null;

      return (
        <div key={index} className="chatbot-obra-card">
          {imgUrl && (
            <div className="chatbot-obra-img-wrapper">
              <img
                src={imgUrl}
                alt={nome || 'Obra de arte'}
                className="chatbot-obra-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          {nome && <p className="chatbot-obra-nome">{nome}</p>}
        </div>
      );
    }).filter(Boolean);

    if (obras.length === 0) return text;

    // Extrai texto antes do primeiro [IMAGEM] como introdução
    const introMatch = text.match(/^(.*?)\[IMAGEM\]/s);
    const intro = introMatch ? introMatch[1].trim() : '';

    return (
      <div className="chatbot-obras-container">
        {intro && <p className="chatbot-obras-intro">{intro}</p>}
        <div className="chatbot-obras-grid">
          {obras}
        </div>
      </div>
    );
  };

  return (
    <div className="chatbot-wrapper">
      {/* Botão Flutuante */}
      <button 
        className={`chatbot-btn ${(isWaiting || isHovered) && !isOpen ? 'waiting' : ''}`}
        onClick={toggleChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Abrir chat com Inteligência Artificial"
      >
        <svg className="chatbot-btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="chatbot-tooltip">Converse com nossa IA</span>
      </button>

      {/* Janela de Chat */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0711 19.0711L16.2426 16.2426M19.0711 4.92893L16.2426 7.75736M4.92893 4.92893L7.75736 7.75736M4.92893 19.0711L7.75736 16.2426" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="chatbot-title-container">
              <h3 className="chatbot-title">Assistente IA</h3>
              <p className="chatbot-status">
                <span className="chatbot-status-dot"></span>
                Online
              </p>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button className="chatbot-icon-btn" onClick={() => setIsOpen(false)} aria-label="Minimizar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="chatbot-icon-btn" onClick={() => setIsOpen(false)} aria-label="Fechar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chatbot-message-row ${msg.sender}`}>
              <div className={`chatbot-bubble ${msg.sender === 'ai' && msg.text.includes('[IMAGEM]') ? 'chatbot-bubble-wide' : ''}`}>
                {renderMessageContent(msg.text, msg.sender)}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chatbot-message-row ai">
              <div className="chatbot-typing">
                <span className="chatbot-dot"></span>
                <span className="chatbot-dot"></span>
                <span className="chatbot-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chatbot-input-area" data-state={handleInputAreaState()}>
          <form className="chatbot-input-container" onSubmit={handleSendMessage}>
            <button type="button" className="chatbot-attach-btn" aria-label="Anexar arquivo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            
            <textarea
              className="chatbot-textarea"
              placeholder="Digite sua mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="1"
            />
            
            <button 
              type="submit" 
              className="chatbot-send-btn" 
              disabled={!inputText.trim() || isTyping}
              aria-label="Enviar mensagem"
            >
              <svg className="chatbot-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
