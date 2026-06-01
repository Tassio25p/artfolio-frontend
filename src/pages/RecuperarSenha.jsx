import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RecuperarSenha() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Futuramente aqui vamos enviar o e-mail para o backend
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen flex items-center justify-center p-5 lg:p-10">
        <section className="w-full max-w-5xl bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 bg-artDark text-white p-8 lg:p-10 relative overflow-hidden">
            <Link
              to="/"
              className="font-editorial text-3xl font-black text-artOrange inline-block mb-12"
            >
              Artfolio
            </Link>

            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
              Recuperação de acesso
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
              Recuperar{" "}
              <span className="italic text-artPurple block">senha.</span>
            </h1>

            <p className="text-sm text-gray-400 mt-5 leading-relaxed">
              Informe o e-mail usado no cadastro. Depois disso, você será
              direcionado para o login para tentar acessar novamente.
            </p>

            <div className="mt-8 space-y-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-artPurple text-artPurple flex items-center justify-center text-xs font-bold">
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
                  Receber instruções
                </p>
              </div>

              <div className="flex items-center gap-4 opacity-40">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">
                  03
                </div>

                <p className="text-xs uppercase font-bold tracking-widest">
                  Voltar ao login
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white/5 border border-white/10 rounded-[1.7rem] p-5">
              <h3 className="text-sm font-bold mb-2">
                <i className="fa-solid fa-shield-halved text-artPurple mr-2"></i>
                Segurança da conta
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                Nunca compartilhe sua senha. O Artfolio não solicita códigos por
                telefone, redes sociais ou mensagens externas.
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

              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Digite o e-mail cadastrado na plataforma. Em uma versão com
                backend, enviaremos um link ou código de recuperação para esse
                endereço.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    E-mail cadastrado
                  </label>

                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                    required
                  />
                </div>

                <div className="bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4">
                  <h3 className="text-sm font-bold mb-1">Próximo passo</h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Após enviar, você será levado novamente para a tela de
                    login. Futuramente, essa etapa será ligada ao backend.
                  </p>
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