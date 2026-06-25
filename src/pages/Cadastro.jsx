import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoConta, setTipoConta] = useState("artista");
  const [categoria, setCategoria] = useState("");
  const [biografia, setBiografia] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");

  const isArtista = tipoConta === "artista";

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      mostrarAviso("As senhas não coincidem. Confira os campos antes de continuar.");
      return;
    }

    if (!aceitouTermos) {
      mostrarAviso("Você precisa aceitar os termos para continuar o cadastro.");
      return;
    }

    mostrarAviso(
      "O cadastro real será integrado futuramente ao backend. Depois, os dados serão enviados para a API, a senha será protegida e o usuário será criado no PostgreSQL."
    );
  };

  const handleLinkFuturo = () => {
    mostrarAviso(
      "Os Termos de Uso e a Política de Privacidade poderão ter páginas próprias futuramente."
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        <section className="lg:col-span-4 bg-artDark text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <div>
            <Link
              to="/"
              className="font-editorial text-3xl font-black text-artOrange inline-block mb-12"
            >
              Artfolio
            </Link>

            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
              Novo cadastro
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
              Crie sua{" "}
              <span className="italic text-artPurple block">conta.</span>
            </h1>

            <p className="text-sm text-gray-400 mt-5 leading-relaxed max-w-sm">
              Escolha como deseja usar o Artfolio. Clientes podem explorar,
              salvar e solicitar encomendas. Artistas podem publicar obras,
              montar portfólio e receber contatos.
            </p>
          </div>

          <div className="mt-10 space-y-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-artPurple text-artPurple flex items-center justify-center text-xs font-bold">
                01
              </div>

              <p className="text-xs uppercase font-bold tracking-widest">
                Criar cadastro
              </p>
            </div>

            <div className="flex items-center gap-4 opacity-70">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">
                02
              </div>

              <p className="text-xs uppercase font-bold tracking-widest">
                Validar no backend
              </p>
            </div>

            <div className="flex items-center gap-4 opacity-40">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold">
                03
              </div>

              <p className="text-xs uppercase font-bold tracking-widest">
                Fazer login
              </p>
            </div>
          </div>

          <div className="mt-10 bg-white/10 border border-white/10 rounded-[1.7rem] p-5 relative z-10">
            <h2 className="text-sm font-bold mb-2">
              Integração futura
            </h2>

            <p className="text-xs text-gray-400 leading-relaxed">
              O backend criará o usuário, protegerá a senha, validará e-mail
              único e definirá o papel inicial da conta.
            </p>
          </div>

          <i className="fa-solid fa-user-plus absolute -right-10 -bottom-10 text-[13rem] text-white/5 rotate-12"></i>
        </section>

        <section className="lg:col-span-8 bg-white p-6 lg:p-12 flex items-center">
          <div className="w-full max-w-3xl mx-auto">
            <div className="mb-8">
              <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Cadastro no Artfolio
              </span>

              <h2 className="font-editorial text-4xl lg:text-5xl leading-none">
                {isArtista ? "Comece seu portfólio." : "Comece a explorar obras."}
              </h2>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                {isArtista
                  ? "Essas informações preparam a criação do seu perfil artístico dentro da plataforma."
                  : "Essas informações preparam sua conta para explorar obras, seguir artistas e solicitar encomendas."}
              </p>
            </div>

            {noticeMessage && (
              <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold leading-relaxed">
                <i className="fa-solid fa-circle-info mr-2"></i>
                {noticeMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setTipoConta("cliente")}
                className={`text-left rounded-[1.5rem] p-5 border transition-all ${
                  tipoConta === "cliente"
                    ? "bg-artPurple/10 border-artPurple/20"
                    : "bg-[#F9F8F6] border-black/5 hover:bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center mb-4">
                  <i className="fa-solid fa-user"></i>
                </div>

                <h3 className="font-bold text-base">Cliente</h3>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Para explorar obras, salvar favoritos, conversar com artistas
                  e solicitar encomendas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTipoConta("artista")}
                className={`text-left rounded-[1.5rem] p-5 border transition-all ${
                  tipoConta === "artista"
                    ? "bg-artOrange/10 border-artOrange/20"
                    : "bg-[#F9F8F6] border-black/5 hover:bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center mb-4">
                  <i className="fa-solid fa-palette"></i>
                </div>

                <h3 className="font-bold text-base">Artista</h3>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Para criar portfólio, publicar obras, receber contatos e
                  gerenciar encomendas.
                </p>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  {isArtista ? "Nome artístico / completo" : "Nome completo"}
                </label>

                <input
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder={
                    isArtista
                      ? "Como você quer ser chamado no Artfolio?"
                      : "Digite seu nome completo"
                  }
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  E-mail
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Telefone / WhatsApp
                </label>

                <input
                  type="text"
                  value={telefone}
                  onChange={(event) => setTelefone(event.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                />
              </div>

              {isArtista && (
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Categoria principal
                  </label>

                  <select
                    value={categoria}
                    onChange={(event) => setCategoria(event.target.value)}
                    className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="pintura-digital">Pintura Digital</option>
                    <option value="ilustracao">Ilustração</option>
                    <option value="modelagem-3d">Modelagem 3D</option>
                    <option value="textil">Arte Têxtil</option>
                    <option value="artesanato">Artesanato</option>
                    <option value="design">Design</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Senha
                </label>

                <input
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Crie uma senha"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Confirmar senha
                </label>

                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  placeholder="Repita a senha"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              {isArtista && (
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Biografia inicial
                  </label>

                  <textarea
                    rows="3"
                    value={biografia}
                    onChange={(event) => setBiografia(event.target.value)}
                    placeholder="Ex: Artista digital focado em surrealismo, ilustração e arte conceitual..."
                    className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm resize-none"
                  ></textarea>
                </div>
              )}

              {!isArtista && (
                <div className="md:col-span-2 bg-artPurple/5 border border-artPurple/10 rounded-[1.5rem] p-4">
                  <h3 className="text-sm font-bold mb-1">
                    Conta de cliente
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Como cliente, você poderá explorar obras aprovadas, salvar
                    favoritos, seguir artistas, enviar mensagens e solicitar
                    encomendas.
                  </p>
                </div>
              )}

              <div className="md:col-span-2 flex items-start gap-3 text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(event) => setAceitouTermos(event.target.checked)}
                  className="mt-1 accent-artOrange"
                />

                <p>
                  Li e concordo com os{" "}
                  <button
                    type="button"
                    onClick={handleLinkFuturo}
                    className="text-artDark font-bold underline"
                  >
                    Termos de Uso
                  </button>{" "}
                  e a{" "}
                  <button
                    type="button"
                    onClick={handleLinkFuturo}
                    className="text-artDark font-bold underline"
                  >
                    Política de Privacidade
                  </button>
                  .
                </p>
              </div>

              <div className="md:col-span-2 bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4">
                <h3 className="text-sm font-bold mb-1">
                  Próximo passo
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  Quando o backend estiver pronto, o cadastro criará o usuário no
                  PostgreSQL. Depois, o login usará JWT para liberar as telas
                  conforme o tipo de conta.
                </p>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-artDark text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95 text-center"
                >
                  Criar Conta
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>

                <p className="text-sm text-gray-500">
                  Já possui conta?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-artPurple hover:underline"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>

            <Link
              to="/"
              className="inline-block mt-7 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Voltar para início
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}