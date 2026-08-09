import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Chatbot from "./Chatbot";

/**
 * AIChatGuard — Controle estrito de exibição do Chatbot com IA.
 * 
 * Regra: CHAT IA = FEED (/feed) + USUÁRIO AUTENTICADO (isAuthenticated && !loading)
 * 
 * Se o usuário estiver na Landing Page (/), Login (/login), Perfil (/perfil) ou qualquer outra rota,
 * ou se o usuário não estiver autenticado, o componente NENHUMA linha de HTML/CSS do chat é renderizada (unmounted).
 */
export default function AIChatGuard() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Se ainda estiver verificando a sessão (loading), evita renderizar precocemente
  if (loading) return null;

  // Renderiza SOMENTE se estiver autenticado E na rota do Feed (/feed)
  const isFeedPage = location.pathname === "/feed";

  if (!isAuthenticated || !isFeedPage) {
    return null;
  }

  return <Chatbot />;
}
