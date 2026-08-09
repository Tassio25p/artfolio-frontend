import { getStoredToken } from "../contexts/AuthContext";

const API_BASE_URL = "http://127.0.0.1:8000";

// --- Gerenciamento de Autenticação / Token ---

/**
 * Obtém o token armazenado para uso nas requisições.
 * Delega para getStoredToken() do AuthContext que respeita o "Lembrar acesso".
 *
 * NOTA: getToken() e getUser() são mantidos como exports para compatibilidade
 * com componentes que ainda os usam diretamente. A fonte primária de dados
 * do usuário é o AuthContext (via useAuth()).
 */
export const getToken = () => getStoredToken();

export const getUser = () => {
  // Fallback legado — dados do usuário devem vir do AuthContext.
  // Mantido para componentes que ainda importam getUser() mas não foram migrados.
  const user = localStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => localStorage.setItem("usuario", JSON.stringify(user));

export const removeToken = () => {
  localStorage.removeItem("artfolio_token");
  localStorage.removeItem("artfolio_remember");
  sessionStorage.removeItem("artfolio_token");
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// --- Função utilitária para requisições ---

/**
 * Flag para evitar disparar múltiplos eventos auth:expired em sequência.
 * Quando uma requisição retorna 401, o evento é disparado uma única vez
 * e o flag é resetado após um curto delay.
 */
let authExpiredDispatched = false;

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    // Interceptor de 401 — token expirado ou inválido
    if (response.status === 401 && !authExpiredDispatched) {
      authExpiredDispatched = true;
      // Dispara evento customizado para o AuthContext tratar o logout
      window.dispatchEvent(new Event("auth:expired"));
      // Reseta o flag após 2 segundos para permitir novo disparo caso necessário
      setTimeout(() => {
        authExpiredDispatched = false;
      }, 2000);
    }

    const errorMsg = data?.detail || data?.message || `Erro ${response.status}: Falha na requisição`;
    throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
  }

  return data;
}

// --- Serviços de Autenticação ---
export const authService = {
  /**
   * Login via api.js — NOTA: Para novos componentes, prefira usar
   * login() do AuthContext (via useAuth()) que gerencia o estado global.
   * Este método é mantido para compatibilidade com imports existentes.
   */
  async login(email, senha) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
    return response;
  },

  async cadastrar(dadosUsuario) {
    return await apiRequest("/auth/cadastro", {
      method: "POST",
      body: JSON.stringify(dadosUsuario),
    });
  },

  async getMe() {
    const usuario = await apiRequest("/auth/me");
    return usuario;
  },

  logout() {
    removeToken();
  },
};

// --- Serviços do Feed ---
export const feedService = {
  async obterFeed() {
    return await apiRequest("/feed");
  },
};

// --- Serviços de Obras / Postagens ---
export const obrasService = {
  async listarObras(params = {}) {
    const query = new URLSearchParams();
    if (params.usuario_id) query.append("usuario_id", params.usuario_id);
    if (params.categoria_id) query.append("categoria_id", params.categoria_id);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await apiRequest(`/obras${queryString}`);
  },

  async obterObraPorId(id) {
    return await apiRequest(`/obras/${id}`);
  },

  async criarObra(dados) {
    // dados: { idCategoria, legenda, arquivoUrl }
    return await apiRequest("/postagens", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  async atualizarObra(id, dados) {
    // dados: { idCategoria?, legenda?, arquivoUrl? }
    return await apiRequest(`/postagens/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  async deletarObra(id) {
    return await apiRequest(`/postagens/${id}`, {
      method: "DELETE",
    });
  },

  // Curtidas
  async curtir(id) {
    return await apiRequest(`/postagens/${id}/like`, { method: "POST" });
  },

  async descurtir(id) {
    return await apiRequest(`/postagens/${id}/like`, { method: "DELETE" });
  },

  // Comentários
  async listarComentarios(id) {
    return await apiRequest(`/postagens/${id}/comentarios`);
  },

  async criarComentario(id, conteudo) {
    return await apiRequest(`/postagens/${id}/comentarios`, {
      method: "POST",
      body: JSON.stringify({ conteudo }),
    });
  },

  async deletarComentario(comentarioId) {
    return await apiRequest(`/comentarios/${comentarioId}`, {
      method: "DELETE",
    });
  },

  // Obras Salvas
  async salvarObra(id) {
    return await apiRequest(`/postagens/${id}/salvar`, { method: "POST" });
  },

  async removerSalvo(id) {
    return await apiRequest(`/postagens/${id}/salvar`, { method: "DELETE" });
  },

  async listarSalvas() {
    return await apiRequest("/postagens/salvas");
  },

  async checarSalvo(id) {
    return await apiRequest(`/postagens/${id}/salvo`);
  },

  // Denúncias
  async denunciarObra(id, dados) {
    return await apiRequest(`/postagens/${id}/denunciar`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },
};

// --- Helper de mídia / URL ---
export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// --- Serviços de Usuário (Perfil / Seguir) ---
export const usuarioService = {
  async atualizarPerfil(dados) {
    const usuario = await apiRequest("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify(dados),
    });
    return usuario;
  },

  async uploadFotoPerfil(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append("foto", file);

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/usuarios/me/foto`, {
      method: "PUT",
      headers,
      body: formData,
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = null;
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || `Erro ${response.status}: Falha ao carregar foto de perfil`;
      throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  },

  async removerFotoPerfil() {
    return await apiRequest("/usuarios/me/foto", {
      method: "DELETE",
    });
  },

  async alterarSenha(dados) {
    return await apiRequest("/usuarios/me/senha", {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  },

  async seguir(usuarioId) {
    return await apiRequest(`/usuarios/${usuarioId}/seguir`, {
      method: "POST",
    });
  },

  async deixarDeSeguir(usuarioId) {
    return await apiRequest(`/usuarios/${usuarioId}/seguir`, {
      method: "DELETE",
    });
  },

  async obterPerfil(usuarioId) {
    return await apiRequest(`/usuarios/${usuarioId}`);
  },

  async obterRelacionamento(usuarioId) {
    return await apiRequest(`/usuarios/${usuarioId}/relacionamento`);
  },

  async listarSeguidores(usuarioId) {
    return await apiRequest(`/usuarios/${usuarioId}/seguidores`);
  },

  async listarSeguindo(usuarioId) {
    return await apiRequest(`/usuarios/${usuarioId}/seguindo`);
  },
};

// --- Serviços de Notificações ---
export const notificacaoService = {
  async listar() {
    return await apiRequest("/notificacoes");
  },

  async contarNaoLidas() {
    return await apiRequest("/notificacoes/nao-lidas");
  },

  async marcarComoLida(id) {
    return await apiRequest(`/notificacoes/${id}/ler`, {
      method: "PATCH",
    });
  },

  async marcarTodasComoLidas() {
    return await apiRequest("/notificacoes/ler-todas", {
      method: "PATCH",
    });
  },

  async deletar(id) {
    return await apiRequest(`/notificacoes/${id}`, {
      method: "DELETE",
    });
  },
};

// --- Serviços do Assistente de IA ---
export const assistenteService = {
  async enviarMensagem(message, idConversa = null) {
    return await apiRequest("/assistente/mensagem", {
      method: "POST",
      body: JSON.stringify({ message, idConversa }),
    });
  },

  async listarConversas() {
    return await apiRequest("/assistente/conversas");
  },

  async buscarConversa(id) {
    return await apiRequest(`/assistente/conversas/${id}`);
  },
};

// --- Serviços de Administração / Moderação ---
export const adminService = {
  async listarDenuncias() {
    return await apiRequest("/admin/denuncias");
  },

  async atualizarStatusDenuncia(id, status) {
    return await apiRequest(`/admin/denuncias/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
