import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AuthContext — Contexto global de autenticação do Artfolio.
 *
 * Centraliza o estado de autenticação para toda a aplicação:
 * - user: dados do usuário autenticado (id, nome, email, tipo_conta, etc.)
 * - isAuthenticated: boolean derivado de !!user
 * - loading: true enquanto a sessão está sendo verificada ao iniciar o app
 * - login(email, senha, lembrarAcesso): realiza login e armazena token
 * - logout(mensagem?): limpa sessão e redireciona para /login
 * - refreshUser(): re-busca dados do usuário via /auth/me
 *
 * ESTRATÉGIA DE ARMAZENAMENTO (Lembrar acesso):
 * - Quando "Lembrar acesso" está MARCADO: token vai para localStorage
 *   → Persiste entre sessões do navegador (sobrevive fechar/abrir)
 * - Quando "Lembrar acesso" está DESMARCADO: token vai para sessionStorage
 *   → É apagado automaticamente ao fechar a aba/navegador
 * - Um flag "artfolio_remember" em localStorage indica qual storage contém o token
 */

const API_BASE_URL = "http://127.0.0.1:8000";

const AuthContext = createContext(null);

/**
 * Hook para acessar o contexto de autenticação em qualquer componente.
 * Uso: const { user, isAuthenticated, loading, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}

/**
 * Funções auxiliares de armazenamento de token.
 * Isoladas aqui para manter a lógica de storage em um único lugar.
 */
function getStoredToken() {
  // Verifica o flag para saber onde procurar o token
  const remember = localStorage.getItem("artfolio_remember");

  if (remember === "true") {
    return localStorage.getItem("artfolio_token");
  }

  // Se não marcou "lembrar", busca no sessionStorage
  // (também verifica localStorage caso o flag não exista mas o token antigo sim — migração)
  const sessionToken = sessionStorage.getItem("artfolio_token");
  if (sessionToken) return sessionToken;

  // Fallback: migração de token antigo do localStorage (de antes desta implementação)
  const legacyToken = localStorage.getItem("token");
  if (legacyToken) {
    // Migra para o novo formato com "lembrar acesso" ativo (comportamento anterior)
    localStorage.setItem("artfolio_token", legacyToken);
    localStorage.setItem("artfolio_remember", "true");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    return legacyToken;
  }

  return null;
}

function storeToken(token, remember) {
  if (remember) {
    localStorage.setItem("artfolio_token", token);
    localStorage.setItem("artfolio_remember", "true");
    // Limpar do sessionStorage caso exista
    sessionStorage.removeItem("artfolio_token");
  } else {
    sessionStorage.setItem("artfolio_token", token);
    localStorage.setItem("artfolio_remember", "false");
    // Limpar do localStorage caso exista
    localStorage.removeItem("artfolio_token");
  }
}

function clearAllAuthStorage() {
  localStorage.removeItem("artfolio_token");
  localStorage.removeItem("artfolio_remember");
  sessionStorage.removeItem("artfolio_token");
  // Limpar dados legados também
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState("");
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  /**
   * Busca dados do usuário autenticado via GET /auth/me.
   * Retorna os dados do usuário ou null se falhar.
   */
  const fetchCurrentUser = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Token inválido ou expirado
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }, []);

  /**
   * Restauração de sessão ao iniciar a aplicação.
   * Verifica se existe um token armazenado e se ele ainda é válido.
   */
  useEffect(() => {
    const restaurarSessao = async () => {
      const token = getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await fetchCurrentUser(token);

      if (userData) {
        setUser(userData);
      } else {
        // Token inválido/expirado — limpa tudo
        clearAllAuthStorage();
      }

      setLoading(false);
    };

    restaurarSessao();
  }, [fetchCurrentUser]);

  /**
   * Escuta evento customizado 'auth:expired' disparado pelo api.js
   * quando qualquer requisição retorna 401.
   * Realiza logout automático com mensagem amigável.
   */
  useEffect(() => {
    const handleAuthExpired = () => {
      clearAllAuthStorage();
      setUser(null);
      setSessionMessage("Sua sessão expirou. Faça login novamente.");
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [navigate]);

  /**
   * Realiza login do usuário.
   * @param {string} email
   * @param {string} senha
   * @param {boolean} lembrarAcesso - Se true, usa localStorage; senão sessionStorage
   */
  const login = useCallback(async (email, senha, lembrarAcesso = false) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Erro ao processar resposta do servidor.");
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || "Erro ao realizar login.";
      throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }

    if (!data.access_token) {
      throw new Error("Resposta de login inválida — token não recebido.");
    }

    // Armazena o token no storage correto baseado em "lembrar acesso"
    storeToken(data.access_token, lembrarAcesso);

    // Define os dados do usuário no state
    if (data.usuario) {
      setUser(data.usuario);
    } else {
      // Fallback: busca dados do usuário via /auth/me
      const userData = await fetchCurrentUser(data.access_token);
      if (userData) {
        setUser(userData);
      }
    }

    // Limpa mensagem de sessão expirada se houver
    setSessionMessage("");

    return data;
  }, [fetchCurrentUser]);

  /**
   * Realiza logout do usuário.
   * Limpa token, dados do user e redireciona para /login.
   */
  const logout = useCallback((mensagem = "") => {
    clearAllAuthStorage();
    setUser(null);
    if (mensagem) {
      setSessionMessage(mensagem);
    }
    navigate("/login", { replace: true });
  }, [navigate]);

  /**
   * Re-busca os dados do usuário autenticado (útil após editar perfil).
   */
  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    const userData = await fetchCurrentUser(token);
    if (userData) {
      setUser(userData);
    }
  }, [fetchCurrentUser]);

  const value = {
    user,
    isAuthenticated,
    loading,
    sessionMessage,
    setSessionMessage,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Exporta getStoredToken para uso pelo api.js (envio de token nas requisições).
 * Outros componentes devem usar useAuth() para acessar dados do usuário.
 */
export { getStoredToken };
