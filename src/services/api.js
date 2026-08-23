import { getStoredToken } from "../contexts/AuthContext";

const API_BASE_URL = "http://127.0.0.1:8000";

// --- Gerenciamento de Autenticação / Token ---
export const getToken = () => getStoredToken();

export const getUser = () => {
  const user = localStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => localStorage.setItem("usuario", JSON.stringify(user));

export const removeToken = () => {
  localStorage.removeItem("artfolio_token");
  localStorage.removeItem("artfolio_remember");
  sessionStorage.removeItem("artfolio_token");
  localStorage.removeItem("artfolio_guest");
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// --- Função utilitária para requisições ---
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

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error(
      "Não foi possível conectar ao servidor backend (FastAPI na porta 8000). Verifique se o servidor backend está em execução."
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && !authExpiredDispatched) {
      authExpiredDispatched = true;
      window.dispatchEvent(new Event("auth:expired"));
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
  async login(email, senha) {
    return await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
  },

  async cadastrar(dadosUsuario) {
    return await apiRequest("/auth/cadastro", {
      method: "POST",
      body: JSON.stringify(dadosUsuario),
    });
  },

  async getMe() {
    return await apiRequest("/auth/me");
  },

  logout() {
    removeToken();
  },
};

// --- Serviços do Feed ---
export const feedService = {
  async obterFeed() {
    try {
      const feed = await apiRequest("/feed");
      if (Array.isArray(feed)) {
        return feed;
      }
      return [];
    } catch {
      try {
        const postagens = await apiRequest("/postagens");
        return Array.isArray(postagens) ? postagens : [];
      } catch {
        return [];
      }
    }
  },
};

// --- Serviços de Obras / Postagens ---
export const obrasService = {
  async listarObras(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.usuario_id) query.append("usuario_id", params.usuario_id);
      if (params.categoria_id) query.append("categoria_id", params.categoria_id);
      if (params.busca) query.append("busca", params.busca);

      const queryString = query.toString() ? `?${query.toString()}` : "";
      const res = await apiRequest(`/postagens${queryString}`);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  async obterObraPorId(id) {
    return await apiRequest(`/postagens/${id}`);
  },

  async criarObra(dados) {
    return await apiRequest("/postagens", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  async atualizarObra(id, dados) {
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

  async uploadImagem(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append("arquivo", file);

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/postagens/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
    } catch {
      throw new Error("Não foi possível conectar ao servidor backend para enviar a imagem.");
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || "Erro ao fazer upload da imagem.";
      throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  },

  async curtir(id) {
    return await apiRequest(`/postagens/${id}/like`, { method: "POST" });
  },

  async descurtir(id) {
    return await apiRequest(`/postagens/${id}/like`, { method: "DELETE" });
  },

  async listarComentarios(id) {
    try {
      return await apiRequest(`/postagens/${id}/comentarios`);
    } catch {
      return [];
    }
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

  async salvarObra(id) {
    return await apiRequest(`/postagens/${id}/salvar`, { method: "POST" });
  },

  async removerSalvo(id) {
    return await apiRequest(`/postagens/${id}/salvar`, { method: "DELETE" });
  },

  async listarSalvas() {
    try {
      return await apiRequest("/postagens/salvas");
    } catch {
      return [];
    }
  },

  async checarSalvo(id) {
    try {
      return await apiRequest(`/postagens/${id}/salvo`);
    } catch {
      return { salvo: false };
    }
  },

  async denunciarObra(id, dados) {
    return await apiRequest(`/postagens/${id}/denunciar`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },
};

// --- Helper de mídia / URL ---
export const getMediaUrl = (path, fallback = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800") => {
  if (!path) return fallback;
  if (path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (path.includes("artfolio.com") && !path.includes("localhost") && !path.includes("127.0.0.1")) {
      return fallback;
    }
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// --- Serviços de Usuário (Perfil / Seguir / Artistas / Certificados) ---
export const usuarioService = {
  async listarArtistas(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.busca) query.append("busca", params.busca);
      const queryString = query.toString() ? `?${query.toString()}` : "";
      const res = await apiRequest(`/usuarios${queryString}`);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  async obterPerfil(id) {
    try {
      return await apiRequest(`/usuarios/${id}`);
    } catch {
      return {
        id: Number(id) || null,
        nome: "Usuário",
        email: "",
        biografia: "",
        fotoPerfil: "",
        portfolio: "",
        instagram: "",
        behance: "",
        website: "",
        trajetoria: "",
        especializacoes: "",
        certificados: "[]",
        tipo_conta: "artista",
        tipo_usuario: "PF",
        seguidoresCount: 0,
        seguindoCount: 0,
        obrasCount: 0,
        curtidasTotais: 0,
        visualizacoesTotais: 0,
        relacionamento: { isMe: false, seguindo: false },
      };
    }
  },

  async atualizarPerfil(dados) {
    return await apiRequest("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  async alterarSenha(dados) {
    return await apiRequest("/usuarios/me/senha", {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  },

  async uploadFotoPerfil(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append("foto", file);

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/usuarios/me/foto`, {
        method: "PUT",
        headers,
        body: formData,
      });
    } catch {
      throw new Error("Não foi possível conectar ao servidor backend para enviar a foto.");
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || "Erro ao fazer upload da foto de perfil.";
      throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  },

  async uploadCertificado(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append("arquivo", file);

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/usuarios/me/certificados/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
    } catch {
      throw new Error("Não foi possível conectar ao servidor backend para enviar o certificado.");
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || "Erro ao fazer upload do certificado.";
      throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  },

  async removerFotoPerfil() {
    return await apiRequest("/usuarios/me/foto", {
      method: "DELETE",
    });
  },

  async seguir(id) {
    return await apiRequest(`/usuarios/${id}/seguir`, {
      method: "POST",
    });
  },

  async deixarDeSeguir(id) {
    return await apiRequest(`/usuarios/${id}/seguir`, {
      method: "DELETE",
    });
  },

  async listarSeguidores(id) {
    try {
      return await apiRequest(`/usuarios/${id}/seguidores`);
    } catch {
      return [];
    }
  },

  async listarSeguindo(id) {
    try {
      return await apiRequest(`/usuarios/${id}/seguindo`);
    } catch {
      return [];
    }
  },
};

// --- Serviços de Notificações ---
export const notificacaoService = {
  async listar() {
    try {
      const res = await apiRequest("/notificacoes");
      return Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },
  async marcarComoLida(id) {
    try {
      return await apiRequest(`/notificacoes/${id}/ler`, { method: "PATCH" });
    } catch {
      return { success: true };
    }
  },
  async marcarTodasComoLidas() {
    try {
      return await apiRequest("/notificacoes/ler-todas", { method: "PATCH" });
    } catch {
      return { success: true };
    }
  },
  async deletar(id) {
    return await apiRequest(`/notificacoes/${id}`, { method: "DELETE" });
  },
  async deletarTodas() {
    return await apiRequest("/notificacoes/todas", { method: "DELETE" });
  },
};

// --- Serviços de Administração ---
export const adminService = {
  async obterEstatisticas() {
    return await apiRequest("/admin/estatisticas");
  },
  async listarObrasPendentes() {
    try {
      return await apiRequest("/admin/obras/pendentes");
    } catch {
      return [];
    }
  },
  async aprovarObra(id) {
    return await apiRequest(`/admin/obras/${id}/aprovar`, { method: "POST" });
  },
  async recusarObra(id, motivo) {
    return await apiRequest(`/admin/obras/${id}/recusar`, {
      method: "POST",
      body: JSON.stringify({ motivo }),
    });
  },
  async listarDenuncias() {
    try {
      return await apiRequest("/admin/denuncias");
    } catch {
      return [];
    }
  },
  async resolverDenuncia(id, resolucao) {
    return await apiRequest(`/admin/denuncias/${id}/resolver`, {
      method: "POST",
      body: JSON.stringify({ resolucao }),
    });
  },
};

// --- Serviços de Conversas e Mensagens ---
export const mensagemService = {
  async listarConversas() {
    try {
      return await apiRequest("/conversas");
    } catch {
      return [];
    }
  },
  async obterOuCriarConversa(destinatarioId) {
    return await apiRequest(`/conversas/usuario/${destinatarioId}`, {
      method: "POST",
    });
  },
  async uploadAnexo(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append("arquivo", file);

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/conversas/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
    } catch {
      throw new Error("Não foi possível conectar ao servidor backend para enviar o anexo.");
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || "Erro ao fazer upload do anexo.";
      throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  },
  async enviarMensagem(conversaId, { conteudo, arquivoUrl }) {
    return await apiRequest(`/conversas/${conversaId}/mensagens`, {
      method: "POST",
      body: JSON.stringify({ conteudo, arquivoUrl }),
    });
  },
  async limparConversa(conversaId) {
    return await apiRequest(`/conversas/${conversaId}/mensagens`, {
      method: "DELETE",
    });
  },
  async deletarMensagem(mensagemId) {
    return await apiRequest(`/conversas/mensagens/${mensagemId}`, {
      method: "DELETE",
    });
  },
};

export default {
  authService,
  obrasService,
  usuarioService,
  notificacaoService,
  feedService,
  adminService,
  mensagemService,
  getMediaUrl,
};
