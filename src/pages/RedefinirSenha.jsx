import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dados recebidos da etapa anterior (Verificação de OTP)
  const emailVindoDoState = location.state?.email || "";
  const codigoVindoDoState = location.state?.codigo || "";

  // Estados dos campos
  const [email, setEmail] = useState(emailVindoDoState);
  const [codigo, setCodigo] = useState(codigoVindoDoState);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Visibilidade das palavras-passe (UX)
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Estados de controle e feedback de interface
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info"); // "error" | "success" | "info"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailVindoDoState) {
      setEmail(emailVindoDoState);
    }
    if (codigoVindoDoState) {
      setCodigo(codigoVindoDoState);
    }

    // Se o usuário entrou diretamente na tela sem e-mail ou código no state
    if (!emailVindoDoState) {
      mostrarAviso(
        "Acesso à redefinição iniciado. Introduza o seu e-mail e o código recebido para atualizar a senha.",
        "info"
      );
    }
  }, [emailVindoDoState, codigoVindoDoState]);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
  };

  // Cálculo visual da força da senha (UX adicional para segurança)
  const calcularForcaSenha = (senha) => {
    if (!senha) return 0;
    let score = 0;
    if (senha.length >= 6) score += 25;
    if (senha.length >= 8) score += 25;
    if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) score += 25;
    if (/[0-9]/.test(senha) || /[^A-Za-z0-9]/.test(senha)) score += 25;
    return score;
  };

  const forcaSenha = calcularForcaSenha(novaSenha);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailLimpo = email.trim().toLowerCase();
    const codigoLimpo = codigo.trim();

    // 1. Validação de dados essenciais
    if (!emailLimpo) {
      mostrarAviso("O endereço de e-mail é obrigatório.", "error");
      return;
    }

    if (!codigoLimpo || codigoLimpo.length !== 6) {
      mostrarAviso("O código de verificação deve conter exatamente 6 dígitos.", "error");
      return;
    }

    // 2. Validação de tamanho mínimo
    if (novaSenha.length < 6) {
      mostrarAviso("A nova palavra-passe deve conter no mínimo 6 caracteres.", "error");
      return;
    }

    // 3. Validação de coincidência de palavras-passe
    if (novaSenha !== confirmarSenha) {
      mostrarAviso("As palavras-passe introduzidas não coincidem. Verifique os campos.", "error");
      return;
    }

    setLoading(true);
    setNoticeMessage("");

    try {
      let resultado;
      if (authService.atualizarSenha) {
        resultado = await authService.atualizarSenha(emailLimpo, codigoLimpo, novaSenha);
      } else {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/auth/atualizar-senha`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailLimpo,
            codigo: codigoLimpo,
            nova_senha: novaSenha,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || data.mensagem || "Erro ao redefinir a palavra-passe.");
        }
        resultado = data;
      }

      const mensagemSucesso =
        resultado?.mensagem ||
        "Palavra-passe atualizada com sucesso! A redirecionar para o login...";

      mostrarAviso(mensagemSucesso, "success");

      // Redirecionamento automático após 2 segundos
      setTimeout(() => {
        navigate("/login", {
          state: {
            mensagemSucesso: "Palavra-passe redefinida com sucesso! Já pode iniciar sessão com a sua nova senha.",
          },
          replace: true,
        });
      }, 2000);
    } catch (err) {
      let mensagemErro = "Não foi possível atualizar a palavra-passe. Verifique os dados e tente novamente.";

      if (err.response?.data?.detail) {
        mensagemErro =
          typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : err.response.data.detail.mensagem || "Código inválido ou expirado.";
      } else if (err.message) {
        if (
          err.message.toLowerCase().includes("failed to fetch") ||
          err.message.toLowerCase().includes("networkerror")
        ) {
          mensagemErro = "Não foi possível conectar ao servidor backend. Verifique a sua conexão.";
        } else {
          mensagemErro = err.message;
        }
      }

      mostrarAviso(mensagemErro, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      {/* Elementos visuais de fundo em degradê sutil característicos do Artfolio */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-artOrange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-artPurple/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cartão Centralizado Escuro e Elegante */}
      <div className="w-full max-w-md bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-8 relative z-10 transition-all duration-300">
        
        {/* Cabeçalho do Cartão */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-artOrange/20 to-amber-500/20 border border-artOrange/30 text-artOrange mb-4 shadow-lg shadow-artOrange/10">
            {/* Ícone de Cadeado / Segurança */}
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Nova Palavra-passe
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed font-light">
            Crie uma palavra-passe forte e segura para voltar a aceder à sua conta Artfolio.
          </p>
        </div>

        {/* Caixas de Alerta Visuais */}
        {noticeMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-3 transition-all duration-300 ${
              noticeType === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : noticeType === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {noticeType === "error" && (
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {noticeType === "success" && (
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {noticeType === "info" && (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="flex-1 leading-snug">{noticeMessage}</p>
          </div>
        )}

        {/* Formulário de Redefinição */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Se o e-mail não veio no state, permite confirmar */}
          {!emailVindoDoState && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Endereço de E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-gray-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-artOrange focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Se o código não veio no state, permite confirmar */}
          {!codigoVindoDoState && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Código de Verificação (6 dígitos)
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Ex: 482910"
                className="w-full bg-gray-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-artOrange focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Campo: Nova Palavra-passe */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="nova-senha"
                className="block text-xs font-semibold text-gray-300 uppercase tracking-wider"
              >
                Nova Palavra-passe
              </label>
              <span className="text-[11px] text-gray-400">
                Mínimo 6 caracteres
              </span>
            </div>

            <div className="relative">
              <input
                id="nova-senha"
                type={mostrarNovaSenha ? "text" : "password"}
                required
                autoFocus
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-gray-950/90 border border-white/15 rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-artOrange focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-white transition-colors"
                title={mostrarNovaSenha ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
              >
                {mostrarNovaSenha ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Barra de Força da Palavra-passe */}
            {novaSenha && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      forcaSenha <= 25
                        ? "w-1/4 bg-red-500"
                        : forcaSenha <= 50
                        ? "w-2/4 bg-amber-500"
                        : forcaSenha <= 75
                        ? "w-3/4 bg-yellow-400"
                        : "w-full bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Força da senha:</span>
                  <span className="font-semibold">
                    {forcaSenha <= 25
                      ? "Fraca"
                      : forcaSenha <= 50
                      ? "Razoável"
                      : forcaSenha <= 75
                      ? "Boa"
                      : "Excelente"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Campo: Confirmar Nova Palavra-passe */}
          <div>
            <label
              htmlFor="confirmar-senha"
              className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5"
            >
              Confirmar Nova Palavra-passe
            </label>

            <div className="relative">
              <input
                id="confirmar-senha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full bg-gray-950/90 border rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  confirmarSenha && confirmarSenha !== novaSenha
                    ? "border-red-500/50 focus:ring-red-500"
                    : confirmarSenha && confirmarSenha === novaSenha
                    ? "border-emerald-500/50 focus:ring-emerald-500"
                    : "border-white/15 focus:ring-artOrange"
                }`}
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-white transition-colors"
                title={mostrarConfirmarSenha ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
              >
                {mostrarConfirmarSenha ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Aviso visual imediato se senhas divergirem */}
            {confirmarSenha && confirmarSenha !== novaSenha && (
              <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                <span>✕</span> As palavras-passe não coincidem.
              </p>
            )}
            {confirmarSenha && confirmarSenha === novaSenha && (
              <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                <span>✓</span> As palavras-passe coincidem.
              </p>
            )}
          </div>

          {/* Botão Principal de Submissão com Degradê Artfolio */}
          <button
            type="submit"
            disabled={loading || novaSenha.length < 6 || novaSenha !== confirmarSenha}
            className="w-full mt-2 bg-gradient-to-r from-artOrange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-artOrange/20 hover:shadow-artOrange/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-artOrange transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>A atualizar palavra-passe...</span>
              </>
            ) : (
              <>
                <span>Redefinir e Concluir</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Rodapé com Navegação */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-3 text-sm text-gray-400">
          <Link
            to="/login"
            className="text-artOrange hover:text-amber-400 font-semibold transition-colors hover:underline flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Login
          </Link>

          <div className="text-xs text-gray-500">
            <span>Precisa de ajuda? </span>
            <Link to="/termos" className="hover:text-gray-300 transition-colors">
              Suporte e Termos de Uso
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
