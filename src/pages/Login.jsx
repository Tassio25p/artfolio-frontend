import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrarAcesso, setLembrarAcesso] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, senha);
      mostrarAviso("Login realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/feed");
      }, 1000);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao realizar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        <section className="lg:col-span-5 bg-white flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="font-editorial text-3xl font-black text-artOrange inline-block mb-10"
            >
              Artfolio
            </Link>

            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
              Acesso do usuário
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none mb-5">
              Fazer <span className="italic text-artOrange">Login.</span>
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Entre com seu e-mail e senha para acessar o feed, publicar obras,
              conversar, acompanhar encomendas e gerenciar sua conta dentro do
              Artfolio.
            </p>

            {noticeMessage && (
              <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold leading-relaxed">
                <i className="fa-solid fa-circle-info mr-2"></i>
                {noticeMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
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
                  className="font-bold text-artPurple hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar no Artfolio"}
                <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-arrow-right"} ml-2`}></i>
              </button>
            </form>

            <div className="mt-8 bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5">
              <p className="text-sm text-gray-500 leading-relaxed">
                Ainda não possui uma conta?{" "}
                <Link
                  to="/cadastro"
                  className="font-bold text-artOrange hover:underline"
                >
                  Criar cadastro
                </Link>
              </p>
            </div>

            <div className="mt-5 bg-artPurple/5 border border-artPurple/10 rounded-[1.5rem] p-4">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2">
                Integração futura
              </h2>

              <p className="text-xs text-gray-500 leading-relaxed">
                No backend, o login validará as credenciais, retornará um token
                JWT e enviará dados como nome, e-mail, papel do usuário e plano
                ativo.
              </p>
            </div>

            <Link
              to="/"
              className="inline-block mt-5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Voltar para início
            </Link>
          </div>
        </section>

        <section className="hidden lg:block lg:col-span-7 relative overflow-hidden bg-artBlue">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop"
            alt="Arte de fundo"
            className="w-full h-full object-cover mix-blend-multiply opacity-80 scale-105"
          />

          <div className="absolute inset-0 flex items-center p-16 text-white">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block mb-4">
                Entrada no sistema
              </span>

              <h2 className="font-editorial text-7xl italic leading-none max-w-xl">
                Acesse seu universo criativo.
              </h2>

              <p className="text-sm text-white/70 max-w-md mt-6 leading-relaxed">
                Depois da autenticação real, cada usuário será direcionado para
                a área correta conforme seu papel: cliente, artista, moderador ou
                administrador.
              </p>

              <div className="mt-8 bg-white/10 border border-white/10 rounded-[1.7rem] p-5 max-w-md">
                <h3 className="text-sm font-bold mb-3">
                  Caminho futuro após o login
                </h3>

                <div className="space-y-3 text-xs text-white/70">
                  <p>
                    <strong className="text-white">1.</strong> Backend valida
                    e-mail e senha
                  </p>

                  <p>
                    <strong className="text-white">2.</strong> Sistema recebe o
                    token JWT
                  </p>

                  <p>
                    <strong className="text-white">3.</strong> Frontend libera
                    telas conforme papel e permissões
                  </p>

                  <p>
                    <strong className="text-white">4.</strong> Usuário acessa
                    feed, portfólio, admin ou recursos permitidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}