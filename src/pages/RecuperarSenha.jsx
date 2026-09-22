import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function RecuperarSenha() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info"); // "error" | "success" | "info"
  const [loading, setLoading] = useState(false);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => {
      setNoticeMessage("");
    }, 6000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo) {
      mostrarAviso("Por favor, introduza o seu endereço de e-mail.", "error");
      return;
    }

    setLoading(true);
    setNoticeMessage("");

    try {
      let resultado;
      if (authService.esqueciSenha) {
        resultado = await authService.esqueciSenha(emailLimpo);
      } else {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/auth/esqueci-senha`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailLimpo }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || data.mensagem || "Erro ao solicitar recuperação de senha.");
        }
        resultado = data;
      }

      const mensagemSucesso =
        resultado?.mensagem ||
        "Código de verificação enviado com sucesso para o seu e-mail!";

      mostrarAviso(mensagemSucesso, "success");

      // Redirecionamento automático para a tela de verificação de código com o e-mail no state
      setTimeout(() => {
        navigate("/verificar-codigo", {
          state: {
            email: emailLimpo,
            modo: "recuperacao",
            origem: "recuperar",
            mensagem: "Introduza o código de verificação de 6 dígitos enviado para o seu e-mail para redefinir o seu acesso.",
          },
        });
      }, 1200);
    } catch (err) {
      let mensagemErro = "Não foi possível enviar o código. Verifique se o e-mail está correto.";

      if (err.response?.data?.detail) {
        mensagemErro = err.response.data.detail;
      } else if (err.message) {
        if (
          err.message.toLowerCase().includes("failed to fetch") ||
          err.message.toLowerCase().includes("networkerror") ||
          err.message.toLowerCase().includes("não foi possível conectar")
        ) {
          mensagemErro = "Não foi possível conectar ao servidor backend (FastAPI). Verifique se o servidor está em execução.";
        } else {
          mensagemErro = err.message;
        }
      }

      mostrarAviso(mensagemErro, "error");
    } finally {
      setLoading(false);
    }
  };

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <section className="w-full max-w-5xl bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Coluna Esquerda - Identidade Visual e Instruções de Segurança */}
          <div className="lg:col-span-5 bg-artPurple text-white p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop"
              alt="Arte de fundo"
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 scale-105 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50 pointer-events-none"></div>

            <div className="relative z-10">
              <Link
                to="/"
                className="font-editorial text-3xl font-black text-artOrange inline-block mb-10 hover:opacity-90 transition-opacity"
              >
                Artfolio
              </Link>

              <span className="text-white/80 font-bold tracking-widest uppercase text-[10px] mb-3 block">
                Recuperação de acesso
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Recuperar{" "}
                <span className="italic text-artOrange block">senha.</span>
              </h1>

              <p className="text-sm text-white/80 mt-5 leading-relaxed font-light">
                Insere o teu e-mail associado para receberes o código de verificação de redefinição de acesso.
              </p>
            </div>

            <div className="mt-8 space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-artOrange/20 border border-artOrange text-artOrange flex items-center justify-center text-xs font-bold shadow-sm">
                  01
                </div>

                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-white">
                    Informar e-mail
                  </p>
                  <p className="text-[11px] text-white/60">
                    Solicitar código OTP de 6 dígitos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 opacity-70">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">
                  02
                </div>

                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-white/80">
                    Verificar e redefinir
                  </p>
                  <p className="text-[11px] text-white/50">
                    Validar o código e criar nova senha
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white/5 border border-white/10 rounded-[1.7rem] p-5 relative z-10 backdrop-blur-xs">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-artOrange"></i>
                Segurança da conta
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed">
                Nunca compartilhe o seu código com ninguém. O Artfolio nunca solicitará sua senha ou códigos de verificação por redes sociais ou mensagens externas.
              </p>
            </div>

            <i className="fa-solid fa-key absolute -right-8 -bottom-10 text-[11rem] text-white/5 rotate-12 pointer-events-none"></i>
          </div>

          {/* Coluna Direita - Formulário de Envio de E-mail */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Redefinir acesso
              </span>

              <h2 className="font-editorial text-4xl lg:text-5xl leading-none mb-3">
                Vamos recuperar sua conta.
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed mb-6 font-light">
                Insere o teu e-mail associado para receberes o código de verificação de redefinição de acesso.
              </p>

              {noticeMessage && (
                <div
                  className={`${
                    noticeStyles[noticeType] || noticeStyles.info
                  } border rounded-[1.3rem] px-5 py-3.5 mb-6 text-xs font-bold leading-relaxed flex items-start gap-3 transition-all`}
                >
                  <i
                    className={`mt-0.5 ${
                      noticeType === "error"
                        ? "fa-solid fa-circle-exclamation text-red-500"
                        : noticeType === "success"
                        ? "fa-solid fa-circle-check text-emerald-500"
                        : "fa-solid fa-circle-info text-artOrange"
                    }`}
                  ></i>
                  <span className="flex-1">{noticeMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email-recuperacao"
                    className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2"
                  >
                    E-mail cadastrado
                  </label>

                  <div className="relative">
                    <input
                      id="email-recuperacao"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/30 text-sm transition-all text-artDark placeholder-gray-400"
                      required
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                      <span>A enviar código...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar código de verificação</span>
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-500">
                <Link
                  to="/login"
                  className="font-bold text-artPurple hover:underline flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-arrow-left text-xs"></i>
                  Voltar para login
                </Link>

                <span className="hidden sm:inline text-gray-300">•</span>

                <Link
                  to="/cadastro"
                  className="font-bold text-artOrange hover:underline"
                >
                  Criar nova conta
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
                >
                  <i className="fa-solid fa-house text-xs"></i>
                  Voltar para início
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}