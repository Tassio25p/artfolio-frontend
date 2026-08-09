const API_BASE_URL = "http://127.0.0.1:8000";

// --- Gerenciamento de Autenticação / Token ---
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

export const getUser = () => {
  const user = localStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};
export const setUser = (user) => localStorage.setItem("usuario", JSON.stringify(user));

// --- Função utilitária para requisições ---
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
    const errorMsg = data?.detail || data?.message || `Erro ${response.status}: Falha na requisição`;
    throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
  }

  return data;
}

// --- Serviços de Autenticação ---
export const authService = {
  async login(email, senha) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });

    if (response.access_token) {
      setToken(response.access_token);
      if (response.usuario) {
        setUser(response.usuario);
      }
    }
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
    if (usuario) {
      setUser(usuario);
    }
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
};

// --- Serviços de Usuário (Perfil / Seguir) ---
export const usuarioService = {
  async atualizarPerfil(dados) {
    const usuario = await apiRequest("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify(dados),
    });
    if (usuario) {
      setUser(usuario);
    }
    return usuario;
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
