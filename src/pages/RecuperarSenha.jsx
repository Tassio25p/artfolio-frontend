import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    mostrarAviso(
      "A recuperação real de senha será integrada futuramente ao backend. Depois, a API validará o e-mail e enviará um link ou código de redefinição."
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <section className="w-full max-w-5xl bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 bg-artPurple text-white p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop"
              alt="Arte de fundo"
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 scale-105 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/50 pointer-events-none"></div>

            <div className="relative z-10">
              <Link
                to="/"
                className="font-editorial text-3xl font-black text-artOrange inline-block mb-12"
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
                Informe o e-mail usado no cadastro. Quando o backend estiver
                integrado, o sistema enviará instruções seguras para redefinir sua
                senha.
              </p>
            </div>

            <div className="mt-8 space-y-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-artOrange text-artOrange flex items-center justify-center text-xs font-bold">
                  01
                </div>

                <p className="text-xs uppercase font-bold tracking-widest">
                  Informar e-mail
                </p>
              </div>

              <div className="flex items-center gap-4 opacity-70">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">
                  02
                </div>

                <p className="text-xs uppercase font-bold tracking-widest">
                  Redefinir senha
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white/5 border border-white/10 rounded-[1.7rem] p-5">
              <h3 className="text-sm font-bold mb-2">
                <i className="fa-solid fa-shield-halved text-artPurple mr-2"></i>
                Segurança da conta
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                Nunca compartilhe sua senha. O Artfolio não solicita senhas,
                códigos ou dados sensíveis por telefone, redes sociais ou
                mensagens externas.
              </p>
            </div>

            <div className="mt-5 bg-white/5 border border-white/10 rounded-[1.7rem] p-5">
              <h3 className="text-sm font-bold mb-2">
                Integração futura
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                A API poderá gerar um token temporário de recuperação, validar o
                prazo de expiração e permitir a criação de uma nova senha com
                segurança.
              </p>
            </div>

            <i className="fa-solid fa-key absolute -right-8 -bottom-10 text-[11rem] text-white/5 rotate-12"></i>
          </div>

          <div className="lg:col-span-7 p-8 lg:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Redefinir acesso
              </span>

              <h2 className="font-editorial text-4xl lg:text-5xl leading-none mb-5">
                Vamos recuperar sua conta.
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Digite o e-mail cadastrado na plataforma. Na versão integrada ao
                backend, enviaremos um link ou código de recuperação para esse
                endereço.
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
                    E-mail cadastrado
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Digite seu e-mail"
                    className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                  Enviar instruções
                  <i className="fa-solid fa-paper-plane ml-2"></i>
                </button>
              </form>

              <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-500">
                <Link
                  to="/login"
                  className="font-bold text-artPurple hover:underline"
                >
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

              <Link
                to="/"
                className="inline-block mt-6 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar para início
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}