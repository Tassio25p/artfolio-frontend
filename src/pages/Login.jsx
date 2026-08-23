import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginGoogle, enterAsGuest, isAuthenticated, loading: authLoading, sessionMessage, setSessionMessage } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrarAcesso, setLembrarAcesso] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [loading, setLoading] = useState(false);

  // Rota que o usuário tentou acessar antes de ser redirecionado para login
  const rotaOrigem = location.state?.from?.pathname || "/feed";

  // Se veio mensagem de sucesso do cadastro, exibe
  useEffect(() => {
    if (location.state?.mensagemSucesso) {
      setNoticeMessage(location.state.mensagemSucesso);
      setNoticeType("success");
    }
  }, [location.state]);

  // Se já está autenticado, redireciona para a rota de destino
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(rotaOrigem, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, rotaOrigem]);

  // Exibe mensagem de sessão expirada vinda do AuthContext
  useEffect(() => {
    if (sessionMessage) {
      setNoticeMessage(sessionMessage);
      setNoticeType("warning");
      setSessionMessage("");
    }
  }, [sessionMessage, setSessionMessage]);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  const handleEntrarComoVisitante = () => {
    enterAsGuest();
    navigate("/feed");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);
    try {
      await loginGoogle(credentialResponse.credential);
      mostrarAviso("Login via Google realizado com sucesso! Redirecionando...", "success");
      setTimeout(() => {
        navigate(rotaOrigem, { replace: true });
      }, 800);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao fazer login com o Google.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, senha, lembrarAcesso);
      mostrarAviso("Login realizado com sucesso! Redirecionando...", "success");
      setTimeout(() => {
        navigate(rotaOrigem, { replace: true });
      }, 800);
    } catch (err) {
      let msg = "Erro ao realizar login. Verifique suas credenciais.";
      if (err.message) {
        if (err.message.toLowerCase().includes("failed to fetch") || err.message.toLowerCase().includes("networkerror") || err.message.toLowerCase().includes("não foi possível conectar")) {
          msg = "Não foi possível conectar ao servidor backend (FastAPI na porta 8000). Verifique se o servidor está em execução.";
        } else {
          msg = err.message;
        }
      }
      mostrarAviso(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/10",
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-500 border-red-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Coluna Esquerda - Formulário de Login */}
        <section className="lg:col-span-5 bg-white flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="font-editorial text-3xl font-black text-artOrange inline-block mb-8"
            >
              Artfolio
            </Link>

            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
              Área do Artista
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none mb-4">
              Fazer <span className="italic text-artOrange">Login.</span>
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-light">
              Entre com seu e-mail e senha para acessar o feed, publicar suas obras, interagir na comunidade e gerenciar seu portfólio.
            </p>

            {noticeMessage && (
              <div className={`${noticeStyles[noticeType] || noticeStyles.info} border rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold leading-relaxed flex items-start gap-2`}>
                <i className="fa-solid fa-circle-info mt-0.5"></i>
                <span>{noticeMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  E-mail
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu e-mail"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Senha
                </label>

                <input
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm pt-1">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={lembrarAcesso}
                    onChange={(event) =>
                      setLembrarAcesso(event.target.checked)
                    }
                    className="accent-artPurple"
                  />
                  Lembrar acesso
                </label>

                <Link
                  to="/recuperar-senha"
                  className="text-xs font-bold text-artPurple hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Entrando...
                  </>
                ) : (
                  <>
                    Entrar no Artfolio <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* Divisor Visual para Login Social */}
            <div className="relative flex py-3 items-center my-3">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                ou continue com
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Botão Oficial do Google */}
            <div className="flex justify-center my-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => mostrarAviso("Falha na autenticação com o Google.", "error")}
                theme="outline"
                shape="pill"
                text="continue_with"
                locale="pt-BR"
              />
            </div>

            {/* Opções Alternativas: Cadastrar como Artista OU Entrar como Visitante */}
            <div className="mt-6 space-y-3">
              <Link
                to="/cadastro"
                className="w-full bg-[#FFF5F0] text-artOrange border border-artOrange/30 rounded-[1.5rem] p-3.5 text-xs font-bold hover:bg-artOrange hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm text-center block"
              >
                <i className="fa-solid fa-palette"></i>
                Novo por aqui? Cadastrar como Artista →
              </Link>

              <button
                type="button"
                onClick={handleEntrarComoVisitante}
                className="w-full bg-artBlue/10 text-artBlue border border-artBlue/20 rounded-[1.5rem] p-3.5 text-xs font-bold hover:bg-artBlue hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-eye"></i>
                Explorar como Visitante (Sem Login)
              </button>
            </div>

            <Link
              to="/"
              className="inline-block mt-6 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Voltar para início
            </Link>
          </div>
        </section>

        {/* Coluna Direita - Banner Artístico Inspirador */}
        <section className="hidden lg:block lg:col-span-7 relative overflow-hidden bg-artBlue">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop"
            alt="Arte de fundo"
            className="w-full h-full object-cover mix-blend-multiply opacity-80 scale-105"
          />

          <div className="absolute inset-0 flex items-center p-16 text-white bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block mb-4">
                Plataforma Artística Digital
              </span>

              <h2 className="font-editorial text-6xl italic leading-tight max-w-lg mb-6">
                Acesse seu universo criativo.
              </h2>

              <p className="text-sm text-white/80 max-w-md leading-relaxed font-light mb-8">
                Descubra novas criações, compartilhe suas obras com admiradores do mundo inteiro e conecte-se com talentos autênticos da nossa comunidade.
              </p>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 max-w-md">
                <div className="w-10 h-10 rounded-xl bg-artOrange text-white flex items-center justify-center text-base shadow-md">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Feito por e para Artistas</h4>
                  <p className="text-[11px] text-white/70">Portfólios autênticos, sem intermediários.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}