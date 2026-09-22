import axios from "axios";
import { getStoredToken, getStoredRefreshToken, storeToken, clearAllAuthStorage } from "../contexts/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000");

// --- Gerenciamento de Autenticação / Token ---
export const getToken = () => getStoredToken();
export const getRefreshToken = () => getStoredRefreshToken();

export const getUser = () => {
  const user = localStorage.getItem("usuario");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => localStorage.setItem("usuario", JSON.stringify(user));

export const removeToken = () => {
  clearAllAuthStorage();
};

// --- Configuração da Instância Central do Axios ---
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let authExpiredDispatched = false;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function renovarSessaoSilenciosa() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error("Nenhum refresh token disponível.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Falha ao renovar token de acesso.");
  }

  const data = await response.json();
  if (data.access_token) {
    storeToken(data.access_token, data.refresh_token || refreshToken);
    return data.access_token;
  }
  throw new Error("Token de acesso inválido retornado na renovação.");
}

// Interceptor de Requisição: Injeta automaticamente o Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta: Tratamento global de Rate Limiting (429) e Renovação Silenciosa de Sessão (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 429) {
      const data = error.response.data;
      const mensagem =
        data?.mensagem ||
        data?.detail ||
        "Você fez muitas requisições em pouco tempo. Aguarde um minuto e tente novamente.";

      window.dispatchEvent(
        new CustomEvent("artfolio:toast", {
          detail: {
            titulo: "Muitas Requisições",
            mensagem: mensagem,
            tipo: "erro",
          },
        })
      );
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/cadastro")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const novoToken = await renovarSessaoSilenciosa();
        processQueue(null, novoToken);
        originalRequest.headers["Authorization"] = `Bearer ${novoToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (!authExpiredDispatched) {
          authExpiredDispatched = true;
          window.dispatchEvent(new Event("auth:expired"));
          setTimeout(() => {
            authExpiredDispatched = false;
          }, 2000);
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --- Função utilitária para requisições com Fetch e auto-refresh ---
async function apiRequest(endpoint, options = {}, isRetry = false) {
  let token = getToken();
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
    const fallbackBase = API_BASE_URL.includes("127.0.0.1")
      ? API_BASE_URL.replace("127.0.0.1", "localhost")
      : API_BASE_URL.replace("localhost", "127.0.0.1");

    try {
      response = await fetch(`${fallbackBase}${endpoint}`, {
        ...options,
        headers,
      });
    } catch {
      throw new Error(
        "Não foi possível conectar ao servidor backend (FastAPI na porta 8000). Verifique se o servidor backend está em execução."
      );
    }
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    // Tentativa de silent refresh em 401 no fetch
    if (
      response.status === 401 &&
      !isRetry &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/refresh") &&
      !endpoint.includes("/auth/cadastro")
    ) {
      try {
        const novoToken = await renovarSessaoSilenciosa();
        return await apiRequest(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${novoToken}`,
          },
        }, true);
      } catch {
        if (!authExpiredDispatched) {
          authExpiredDispatched = true;
          window.dispatchEvent(new Event("auth:expired"));
          setTimeout(() => {
            authExpiredDispatched = false;
          }, 2000);
        }
      }
    }

    if (response.status === 429) {
      const msg =
        data?.mensagem ||
        data?.detail ||
        "Você fez muitas requisições em pouco tempo. Aguarde um minuto e tente novamente.";
      window.dispatchEvent(
        new CustomEvent("artfolio:toast", {
          detail: {
            titulo: "Muitas Requisições",
            mensagem: msg,
            tipo: "erro",
          },
        })
      );
      throw new Error(msg);
    }

    let errorMsg = `Erro ${response.status}: Falha na requisição`;
    if (typeof data?.detail === "string") {
      errorMsg = data.detail;
    } else if (data?.detail?.mensagem) {
      errorMsg = data.detail.mensagem;
    } else if (data?.detail?.detail) {
      errorMsg = data.detail.detail;
    } else if (typeof data?.mensagem === "string") {
      errorMsg = data.mensagem;
    } else if (typeof data?.message === "string") {
      errorMsg = data.message;
    }

    const err = new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    err.status = response.status;
    err.data = data;
    err.nao_verificado = Boolean(
      data?.nao_verificado ||
      data?.detail?.nao_verificado ||
      (response.status === 403 && (
        String(errorMsg).toLowerCase().includes("não verificado") ||
        String(errorMsg).toLowerCase().includes("nao verificado") ||
        String(errorMsg).toLowerCase().includes("ativ")
      ))
    );
    err.response = { status: response.status, data };
    throw err;
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

  async verificarEmail(email, codigo) {
    return await apiRequest("/auth/verificar-email", {
      method: "POST",
      body: JSON.stringify({ email, codigo }),
    });
  },

  async reenviarCodigo(email) {
    return await apiRequest("/auth/reenviar-codigo", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async esqueciSenha(email) {
    try {
      return await apiRequest("/auth/esqueci-senha", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      if (err.status === 404) {
        return await apiRequest("/auth/reenviar-codigo", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
      }
      throw err;
    }
  },

  async atualizarSenha(email, codigo, nova_senha) {
    try {
      return await apiRequest("/auth/atualizar-senha", {
        method: "POST",
        body: JSON.stringify({ email, codigo, nova_senha }),
      });
    } catch (err) {
      if (err.status === 404) {
        return await apiRequest("/auth/redefinir-senha", {
          method: "POST",
          body: JSON.stringify({ email, codigo, nova_senha }),
        });
      }
      throw err;
    }
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

  async obterEmAlta() {
    try {
      return await apiRequest("/explorar/em-alta");
    } catch (err) {
      console.error("Erro ao carregar Em Alta:", err);
      return [];
    }
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

  async alternarFixar(id) {
    return await apiRequest(`/postagens/${id}/fixar`, {
      method: "PATCH",
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

  async obterEstatisticasGerais() {
    try {
      return await apiRequest("/usuarios/estatisticas/gerais");
    } catch {
      return { total_artistas: 0, total_obras: 0, total_categorias: 0 };
    }
  },

  async obterPreferencias() {
    try {
      return await apiRequest("/usuarios/me/preferencias");
    } catch {
      return [];
    }
  },

  async obterEstatisticasPainel(artistaId) {
    try {
      return await apiRequest(`/artistas/${artistaId}/estatisticas-painel`);
    } catch {
      return null;
    }
  },

  async salvarPreferencias(idCategorias) {
    return await apiRequest("/usuarios/me/preferencias", {
      method: "PUT",
      body: JSON.stringify({ idCategorias }),
    });
  },

  async alterarSenha(dados) {
    return await apiRequest("/usuarios/me/senha", {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  },

  async excluirConta() {
    return await apiRequest("/usuarios/me", {
      method: "DELETE",
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

  async buscarUsuariosChat(termo) {
    try {
      if (!termo || !termo.trim()) return [];
      const res = await apiRequest(`/usuarios/buscar?q=${encodeURIComponent(termo.trim())}`);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },
};

// --- Serviços de Notificações ---
export const notificacaoService = {
  async listar(tipo = null, apenasNaoLidas = false, limite = 50, offset = 0) {
    try {
      const params = new URLSearchParams();
      if (tipo && tipo !== "Todas") params.append("tipo", tipo.toLowerCase());
      if (apenasNaoLidas) params.append("apenas_nao_lidas", "true");
      if (limite) params.append("limite", String(limite));
      if (offset) params.append("offset", String(offset));

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await apiRequest(`/notificacoes${queryStr}`);
      return Array.isArray(res?.notificacoes) ? res.notificacoes : Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },
  async contarNaoLidas() {
    try {
      return await apiRequest("/notificacoes/nao-lidas");
    } catch {
      return { quantidade: 0 };
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

// --- Serviços de Administração e Moderação ---
export const adminService = {
  async obterMetricas() {
    return await apiRequest("/admin/metricas");
  },
  async obterEstatisticas() {
    return await apiRequest("/admin/metricas");
  },
  async listarObrasQuarentena() {
    return await apiRequest("/admin/obras/quarentena");
  },
  async listarObrasPendentes() {
    return await apiRequest("/admin/obras/quarentena");
  },
  async julgarObra(obraId, { acao, motivo }) {
    return await apiRequest(`/admin/obras/${obraId}/julgar`, {
      method: "PATCH",
      body: JSON.stringify({ acao, motivo }),
    });
  },
  async aprovarObra(id) {
    return await apiRequest(`/admin/obras/${id}/julgar`, {
      method: "PATCH",
      body: JSON.stringify({ acao: "aprovar" }),
    });
  },
  async recusarObra(id, motivo) {
    return await apiRequest(`/admin/obras/${id}/julgar`, {
      method: "PATCH",
      body: JSON.stringify({ acao: "rejeitar", motivo }),
    });
  },
  async listarDenunciasChat(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return await apiRequest(`/admin/denuncias${query}`);
  },
  async listarDenuncias(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return await apiRequest(`/admin/denuncias${query}`);
  },
  async auditarChat(denunciaId) {
    return await apiRequest(`/admin/denuncias/${denunciaId}/auditoria-chat`);
  },
  async atualizarDenuncia(denunciaId, { status, nota_moderador }) {
    return await apiRequest(`/admin/denuncias/${denunciaId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, nota_moderador }),
    });
  },
  async resolverDenuncia(id, resolucao) {
    return await apiRequest(`/admin/denuncias/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "resolvida", nota_moderador: resolucao }),
    });
  },
  async aplicarSancaoUsuario(usuarioId, { acao, dias_suspensao, motivo }) {
    return await apiRequest(`/admin/usuarios/${usuarioId}/sancao`, {
      method: "PATCH",
      body: JSON.stringify({ acao, dias_suspensao, motivo }),
    });
  },
  async listarLogs(limit = 50, offset = 0) {
    return await apiRequest(`/admin/logs?limit=${limit}&offset=${offset}`);
  },
  async listarUsuariosSinalizados() {
    return await apiRequest("/admin/usuarios/sinalizados");
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
    return await apiRequest(`/chat/mensagens/${mensagemId}`, {
      method: "DELETE",
    });
  },
  async deletarMensagensLote(mensagemIds) {
    return await apiRequest("/chat/mensagens/excluir-lote", {
      method: "POST",
      body: JSON.stringify({ mensagem_ids: mensagemIds }),
    });
  },
  async editarMensagem(mensagemId, { conteudo }) {
    return await apiRequest(`/chat/mensagens/${mensagemId}`, {
      method: "PATCH",
      body: JSON.stringify({ conteudo }),
    });
  },
  async denunciarConversa({ denunciado_id, conversa_id, motivo, descricao }) {
    return await apiRequest("/chat/denuncias", {
      method: "POST",
      body: JSON.stringify({ denunciado_id, conversa_id, motivo, descricao }),
    });
  },
  async marcarComoLida(conversaId) {
    try {
      const { data } = await api.patch(`/chat/conversas/${conversaId}/ler`);
      return data;
    } catch (err) {
      console.warn("[mensagemService] Erro ao marcar como lida:", err);
      return null;
    }
  },
};

export const marcarComoLida = async (conversaId) => {
  try {
    const { data } = await api.patch(`/chat/conversas/${conversaId}/ler`);
    return data;
  } catch (err) {
    console.warn("[mensagemService] Erro ao marcar como lida:", err);
    return null;
  }
};

export const editarMensagem = async (mensagemId, dados) => {
  return mensagemService.editarMensagem(mensagemId, dados);
};

export const denunciarConversa = async (dados) => {
  return mensagemService.denunciarConversa(dados);
};

// --- Serviços de Planos e Assinaturas ---
export const planosService = {
  async listarPlanos() {
    try {
      return await apiRequest("/planos");
    } catch {
      return [];
    }
  },
  async obterMeuPlano() {
    return await apiRequest("/planos/meu-plano");
  },
  async assinarPlano(planoId) {
    return await apiRequest(`/planos/assinar/${planoId}`, {
      method: "POST",
    });
  },
};

// --- Serviços de Pagamentos (Stripe) ---
export const pagamentoService = {
  async criarCheckoutSessao(dados) {
    return await apiRequest("/pagamentos/criar-checkout-sessao", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },
};

// --- Serviços de Categorias ---
export const categoriaService = {
  async listar() {
    try {
      return await apiRequest("/categorias");
    } catch {
      return [];
    }
  },
};



export default {
  api,
  authService,
  obrasService,
  usuarioService,
  categoriaService,
  notificacaoService,
  feedService,
  adminService,
  mensagemService,
  planosService,
  pagamentoService,
  getMediaUrl,
};
