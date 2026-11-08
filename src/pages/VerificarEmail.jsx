import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";

export default function VerificarEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Estados dos campos
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");

  // Estados de controle e feedback de interface
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info"); // "error" | "success" | "info"
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [contadorReenvio, setContadorReenvio] = useState(0);

  const mostrarAviso = React.useCallback((mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
  }, []);

  // Inicialização do e-mail vindo de state do router ou query params
  useEffect(() => {
    const emailVindoDoState = location.state?.email;
    const params = new URLSearchParams(location.search);
    const emailVindoDaQuery = params.get("email");

    const emailInicial = emailVindoDoState || emailVindoDaQuery || "";
    if (emailInicial) {
      setEmail(emailInicial);
    }

    // Se o utilizador acabou de se registar e veio com aviso no state
    if (location.state?.mensagem) {
      mostrarAviso(location.state.mensagem, "info");
    }
  }, [location, mostrarAviso]);

  // Contagem decrescente para permitir novo reenvio
  useEffect(() => {
    let timer;
    if (contadorReenvio > 0) {
      timer = setTimeout(() => {
        setContadorReenvio((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [contadorReenvio]);

  /**
   * Manipula a digitação do código OTP:
   * - Permite apenas números (0-9)
   * - Limita estritamente em 6 caracteres
   */
  const handleCodigoChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCodigo(rawVal);
    // Limpa erro ao digitar
    if (noticeType === "error") {
      setNoticeMessage("");
    }
  };

  /**
   * Submissão do código OTP para validação na API
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailLimpo = email.trim();
    const codigoLimpo = codigo.trim();

    if (!emailLimpo) {
      mostrarAviso("Por favor, introduza o seu endereço de e-mail.", "error");
      return;
    }

    if (!codigoLimpo || codigoLimpo.length !== 6) {
      mostrarAviso("O código de verificação deve conter exatamente 6 dígitos numéricos.", "error");
      return;
    }

    setLoading(true);
    setNoticeMessage("");

    try {
      let resultado;
      if (authService.verificarEmail) {
        resultado = await authService.verificarEmail(emailLimpo, codigoLimpo);
      } else {
        // Fallback direto via fetch para máxima resiliência
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/auth/verificar-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailLimpo, codigo: codigoLimpo }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Erro ao validar o código.");
        }
        resultado = data;
      }

      const isModoRecuperacao =
        location.pathname === "/verificar-codigo" ||
        location.state?.origem === "recuperar" ||
        location.state?.modo === "recuperacao";

      if (isModoRecuperacao) {
        mostrarAviso(
          "Código validado com sucesso! A redirecionar para definir a nova palavra-passe...",
          "success"
        );
        setTimeout(() => {
          navigate("/redefinir-senha", {
            state: {
              email: emailLimpo,
              codigo: codigoLimpo,
            },
            replace: true,
          });
        }, 1200);
        return;
      }

      mostrarAviso(
        resultado?.mensagem || "E-mail verificado com sucesso! Redirecionando para o login...",
        "success"
      );

      // Redirecionamento após confirmação
      setTimeout(() => {
        navigate("/login", {
          state: {
            mensagemSucesso: "E-mail verificado com sucesso! A sua conta está ativa. Já pode iniciar sessão.",
          },
          replace: true,
        });
      }, 1500);
    } catch (err) {
      let mensagemErro = "Não foi possível validar o código de verificação.";

      if (err.response?.data?.detail) {
        mensagemErro = err.response.data.detail;
      } else if (err.message) {
        if (
          err.message.toLowerCase().includes("failed to fetch") ||
          err.message.toLowerCase().includes("networkerror")
        ) {
          mensagemErro = "Não foi possível contactar o servidor backend. Verifique a sua conexão.";
        } else {
          mensagemErro = err.message;
        }
      }

      mostrarAviso(mensagemErro, "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reenvio de novo código OTP via API
   */
  const handleReenviarCodigo = async () => {
    const emailLimpo = email.trim();
    if (!emailLimpo) {
      mostrarAviso("Introduza o seu e-mail para receber um novo código.", "error");
      return;
    }

    if (contadorReenvio > 0 || reenviando) return;

    setReenviando(true);
    try {
      if (authService.reenviarCodigo) {
        await authService.reenviarCodigo(emailLimpo);
      } else {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/auth/reenviar-codigo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailLimpo }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Erro ao reenviar código.");
        }
      }

      mostrarAviso("Novo código enviado para o seu e-mail! Verifique a sua caixa de entrada.", "info");
      setContadorReenvio(60); // Aguarda 60 segundos antes de novo reenvio
    } catch (err) {
      mostrarAviso(
        err.response?.data?.detail || err.message || "Erro ao solicitar reenvio do código.",
        "error"
      );
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      {/* Elementos visuais de fundo em degradê sutil */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-artOrange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-artPurple/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cartão Centralizado */}
      <div className="w-full max-w-md bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-8 relative z-10 transition-all duration-300">
        
        {/* Cabeçalho do Cartão */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-artOrange/20 to-amber-500/20 border border-artOrange/30 text-artOrange mb-4 shadow-lg shadow-artOrange/10">
            {/* Ícone de Email com Escudo */}
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Verificar E-mail
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Introduza o código de 6 dígitos enviado para o seu endereço de e-mail para ativar a sua conta Artfolio.
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

        {/* Formulário de Verificação */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de E-mail */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Endereço de E-mail
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-gray-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-artOrange focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          {/* Campo de Código OTP (6 dígitos) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="codigo-otp" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Código de 6 Dígitos
              </label>
              <span className="text-xs text-gray-400 font-mono">
                {codigo.length}/6 dígitos
              </span>
            </div>

            <div className="relative">
              <input
                id="codigo-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                autoFocus
                value={codigo}
                onChange={handleCodigoChange}
                placeholder="••••••"
                className="w-full bg-gray-950/90 border border-white/15 rounded-xl px-4 py-3.5 text-center text-2xl md:text-3xl font-mono font-bold tracking-widest text-artOrange placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-artOrange focus:border-transparent transition-all shadow-inner"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Consulte a sua caixa de entrada ou pasta de spam.
            </p>
          </div>

          {/* Botão Principal de Submissão */}
          <button
            type="submit"
            disabled={loading || codigo.length !== 6}
            className="w-full bg-gradient-to-r from-artOrange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-artOrange/20 hover:shadow-artOrange/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-artOrange transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <span>A verificar código...</span>
              </>
            ) : (
              <span>Confirmar e Ativar Conta</span>
            )}
          </button>
        </form>

        {/* Rodapé do Cartão com Opção de Reenvio */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <span>Não recebeu o código?</span>
            <button
              type="button"
              onClick={handleReenviarCodigo}
              disabled={contadorReenvio > 0 || reenviando}
              className="text-artOrange hover:text-amber-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
            >
              {reenviando
                ? "A reenviar..."
                : contadorReenvio > 0
                ? `Aguarde ${contadorReenvio}s`
                : "Reenviar código"}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/login" className="hover:text-gray-300 transition-colors">
              Voltar ao Login
            </Link>
            <span>&bull;</span>
            <Link to="/cadastro" className="hover:text-gray-300 transition-colors">
              Criar Outra Conta
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
