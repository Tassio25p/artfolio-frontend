import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AuthContext — Contexto global de autenticação do Artfolio.
 *
 * Centraliza o estado de autenticação e visitante para toda a aplicação:
 * - user: dados do usuário autenticado ou visitante temporário
 * - isAuthenticated: boolean (true apenas para usuários reais cadastrados)
 * - isGuest: boolean (true quando navegando como Convidado/Visitante)
 * - loading: true enquanto a sessão está sendo verificada ao iniciar o app
 * - login(email, senha, lembrarAcesso): realiza login e armazena token
 * - logout(mensagem?): limpa sessão e redireciona para /login
 * - enterAsGuest(): ativa o modo Visitante sem persistência no banco
 * - exitGuest(): encerra o modo Visitante
 * - refreshUser(): re-busca dados do usuário via /auth/me
 */

const API_BASE_URL = "http://127.0.0.1:8000";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}

function getStoredToken() {
  const remember = localStorage.getItem("artfolio_remember");
  if (remember === "true") {
    return localStorage.getItem("artfolio_token");
  }

  const sessionToken = sessionStorage.getItem("artfolio_token");
  if (sessionToken) return sessionToken;

  const legacyToken = localStorage.getItem("token");
  if (legacyToken) {
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
    sessionStorage.removeItem("artfolio_token");
  } else {
    sessionStorage.setItem("artfolio_token", token);
    localStorage.setItem("artfolio_remember", "false");
    localStorage.removeItem("artfolio_token");
  }
  localStorage.removeItem("artfolio_guest");
}

function clearAllAuthStorage() {
  localStorage.removeItem("artfolio_token");
  localStorage.removeItem("artfolio_remember");
  sessionStorage.removeItem("artfolio_token");
  localStorage.removeItem("artfolio_guest");
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

function createGuestUser() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return {
    id: null,
    nome: `Convidado_${randomNum}`,
    tipo_conta: "visitante",
    tipo_usuario: "PF",
    isGuest: true,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState("");
  const navigate = useNavigate();

  const isGuest = Boolean(user?.isGuest);
  const isAuthenticated = Boolean(user && !user.isGuest);

  const fetchCurrentUser = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const restaurarSessao = async () => {
      const token = getStoredToken();

      if (token) {
        const userData = await fetchCurrentUser(token);
        if (userData) {
          setUser({ ...userData, isGuest: false });
          setLoading(false);
          return;
        } else {
          clearAllAuthStorage();
        }
      }

      // Se não há token, verifica se estava em modo visitante
      const isGuestStored = localStorage.getItem("artfolio_guest");
      if (isGuestStored === "true") {
        setUser(createGuestUser());
      }

      setLoading(false);
    };

    restaurarSessao();
  }, [fetchCurrentUser]);

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

    storeToken(data.access_token, lembrarAcesso);

    if (data.usuario) {
      setUser({ ...data.usuario, isGuest: false });
    } else {
      const userData = await fetchCurrentUser(data.access_token);
      if (userData) {
        setUser({ ...userData, isGuest: false });
      }
    }

    setSessionMessage("");
    return data;
  }, [fetchCurrentUser]);

  const loginGoogle = useCallback(async (idToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Erro ao processar resposta do servidor.");
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || "Erro ao realizar autenticação pelo Google.";
      throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }

    if (!data.access_token) {
      throw new Error("Resposta de login inválida — token não recebido.");
    }

    storeToken(data.access_token, true);

    if (data.usuario) {
      setUser({ ...data.usuario, isGuest: false });
    } else {
      const userData = await fetchCurrentUser(data.access_token);
      if (userData) {
        setUser({ ...userData, isGuest: false });
      }
    }

    setSessionMessage("");
    return data;
  }, [fetchCurrentUser]);

  const logout = useCallback((mensagem = "") => {
    clearAllAuthStorage();
    setUser(null);
    if (mensagem) {
      setSessionMessage(mensagem);
    }
    navigate("/login", { replace: true });
  }, [navigate]);

  const enterAsGuest = useCallback(() => {
    clearAllAuthStorage();
    localStorage.setItem("artfolio_guest", "true");
    const guest = createGuestUser();
    setUser(guest);
    return guest;
  }, []);

  const exitGuest = useCallback(() => {
    localStorage.removeItem("artfolio_guest");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    const userData = await fetchCurrentUser(token);
    if (userData) {
      setUser({ ...userData, isGuest: false });
    }
  }, [fetchCurrentUser]);

  const value = {
    user,
    isAuthenticated,
    isGuest,
    loading,
    sessionMessage,
    setSessionMessage,
    login,
    loginGoogle,
    logout,
    enterAsGuest,
    exitGuest,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { getStoredToken };
