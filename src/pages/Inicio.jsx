import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ModalConversao from "../components/ModalConversao";

const obrasDestaque = [
  {
    id: 1,
    titulo: "Fragmentos de Vidro",
    artista: "Marina Silva",
    categoria: "Pintura Digital",
    status: "Aprovada",
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    titulo: "Conexões de Algodão",
    artista: "Helena Matos",
    categoria: "Têxtil",
    status: "Aprovada",
    imagem:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    titulo: "Ecos da Metrópole",
    artista: "Gabriel Duarte",
    categoria: "3D Art",
    status: "Aprovada",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
];

const perfis = [
  {
    titulo: "Artista",
    subtitulo: "Criador & Profissional",
    descricao:
      "Conta completa para publicar obras, montar portfólio profissional com certificados, receber solicitações e interagir na comunidade.",
    icone: "fa-solid fa-palette",
    cor: "text-artOrange",
    fundo: "bg-artOrange/10",
    borda: "border-artOrange/20",
    cta: "Criar Conta de Artista",
    to: "/cadastro",
  },
  {
    titulo: "Visitante",
    subtitulo: "Apreciador & Guest",
    descricao:
      "Acesso livre para conhecer a plataforma, explorar o feed de obras aprovadas e visualizar perfis artísticos sem necessidade de cadastro.",
    icone: "fa-solid fa-eye",
    cor: "text-artBlue",
    fundo: "bg-artBlue/10",
    borda: "border-artBlue/20",
    cta: "Entrar como Visitante",
    to: "/feed",
    isGuestAction: true,
  },
];

export default function Inicio() {
  const navigate = useNavigate();
  const { enterAsGuest } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);
  const [acaoTentada, setAcaoTentada] = useState("interagir");

  const handleEntrarComoVisitante = () => {
    enterAsGuest();
    navigate("/feed");
  };

  const handleInteracaoRestrita = (acao) => {
    setAcaoTentada(acao);
    setModalAberto(true);
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans flex flex-col justify-between">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      {/* Header com Navegação Focada: "Como funciona" e "Modos de Acesso" */}
      <header className="relative z-10 px-5 lg:px-10 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-editorial text-3xl font-black text-artOrange tracking-tight"
          >
            Artfolio
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <a
              href="#como-funciona"
              className="hover:text-artDark transition-colors"
            >
              Como funciona
            </a>

            <a href="#perfis" className="hover:text-artDark transition-colors">
              Modos de Acesso
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Botão Visitante em tom azul com ícone de olhinho */}
            <button
              type="button"
              onClick={handleEntrarComoVisitante}
              className="hidden sm:inline-flex items-center gap-2 bg-artBlue/10 text-artBlue border border-artBlue/20 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artBlue hover:text-white transition-all shadow-sm"
            >
              <i className="fa-solid fa-eye text-xs"></i>
              Visitante
            </button>

            {/* Botão Entrar em tom branco com ícone de login */}
            <Link
              to="/login"
              className="bg-white border border-black/10 text-artDark px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-right-to-bracket text-xs"></i>
              Entrar
            </Link>

            {/* Botão Criar Conta em tom alaranjado com ícone de palhetinha */}
            <Link
              to="/cadastro"
              className="bg-artOrange text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-artDark transition-all shadow-lg shadow-artOrange/20 flex items-center gap-2"
            >
              <i className="fa-solid fa-palette text-xs"></i>
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section id="como-funciona" className="px-5 lg:px-10 py-8 lg:py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
                Plataforma Artística Digital
              </span>

              <h1 className="font-editorial text-5xl lg:text-7xl leading-none mb-5">
                Mostre sua arte para o{" "}
                <span className="italic text-artOrange">mundo.</span>
              </h1>

              <p className="text-gray-500 text-sm lg:text-base leading-relaxed max-w-2xl font-light">
                O Artfolio conecta artistas e admiradores em um ecossistema autêntico feito para publicar obras, montar portfólios profissionais, conversar e valorizar talentos criativos.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/cadastro"
                  className="bg-artDark text-white px-7 py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 flex items-center gap-2"
                >
                  <i className="fa-solid fa-palette text-xs"></i>
                  Criar conta de Artista
                </Link>

                <button
                  type="button"
                  onClick={handleEntrarComoVisitante}
                  className="bg-white border border-artBlue/30 text-artBlue px-6 py-4 rounded-full text-sm font-bold hover:bg-artBlue hover:text-white transition-all shadow-md shadow-artBlue/5 flex items-center gap-2"
                >
                  <i className="fa-solid fa-eye text-xs"></i>
                  Entrar como Visitante
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 max-w-lg">
                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black text-artOrange">120+</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Artistas
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    PF e PJ
                  </p>
                </div>

                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black text-artPurple">500+</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Obras
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Curadoria ativa
                  </p>
                </div>

                <div className="bg-white rounded-[1.5rem] p-4 border border-black/5">
                  <p className="text-2xl font-black text-artBlue">LGPD</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Privacidade
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Minimização de dados
                  </p>
                </div>
              </div>
            </div>

            {/* Destaque Visual Hero — Ao clicar motiva login/visitante em vez de ativar visitante direto */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="bg-white rounded-[2.5rem] p-4 border border-black/5 shadow-2xl shadow-black/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="rounded-[2rem] overflow-hidden h-[340px] lg:h-[430px]">
                    <img
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"
                      alt="Arte em destaque"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-artPurple text-[10px] font-black uppercase tracking-widest">
                        Obra em destaque
                      </span>

                      <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                        Curadoria
                      </span>
                    </div>

                    <h2 className="font-editorial text-3xl italic leading-none mt-2">
                      Abstração em Tons de Púrpura
                    </h2>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-artPurple overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
                            alt="Artista"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span className="text-xs font-bold">Marina Silva</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleInteracaoRestrita("acessar a obra de Marina Silva")}
                        className="w-9 h-9 rounded-full bg-artDark text-white hover:bg-artOrange transition-all flex items-center justify-center"
                        title="Ver detalhes"
                      >
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-4 top-8 bg-artOrange text-white rounded-2xl px-4 py-3 shadow-xl rotate-[-6deg] hidden md:block">
                  <p className="text-xl font-black">OK</p>
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Moderada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Modos de Acesso: Artista vs Visitante */}
        <section id="perfis" className="px-5 lg:px-10 py-10">
          <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] border border-black/5 p-6 lg:p-10 shadow-xl shadow-black/5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                  Modos de Experiência
                </span>

                <h2 className="font-editorial text-3xl lg:text-4xl italic">
                  Escolha como deseja explorar o Artfolio.
                </h2>
              </div>

              <span className="text-xs text-gray-400 font-light max-w-xs">
                Acesso flexível para criadores e para quem apenas deseja apreciar boas produções artísticas.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {perfis.map((perfil) => (
                <article
                  key={perfil.titulo}
                  className={`bg-[#F9F8F6] rounded-[2rem] p-6 lg:p-8 border ${perfil.borda} flex flex-col justify-between hover:shadow-lg transition-all`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${perfil.fundo} ${perfil.cor} flex items-center justify-center text-2xl`}
                      >
                        <i className={perfil.icone}></i>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white px-3 py-1 rounded-full border border-black/5">
                        {perfil.subtitulo}
                      </span>
                    </div>

                    <h3 className="font-editorial text-3xl font-bold text-artDark mb-2">
                      {perfil.titulo}
                    </h3>

                    <p className="text-sm text-gray-500 leading-relaxed font-light mb-6">
                      {perfil.descricao}
                    </p>
                  </div>

                  {perfil.isGuestAction ? (
                    <button
                      type="button"
                      onClick={handleEntrarComoVisitante}
                      className="w-full bg-artBlue text-white py-3.5 rounded-full text-xs font-bold hover:bg-artDark transition-all shadow-md shadow-artBlue/10 flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-eye text-xs"></i>
                      {perfil.cta}
                    </button>
                  ) : (
                    <Link
                      to={perfil.to}
                      className="w-full bg-artOrange text-white py-3.5 rounded-full text-xs font-bold hover:bg-artDark transition-all shadow-md shadow-artOrange/10 text-center flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-palette text-xs"></i>
                      {perfil.cta}
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Galeria Aberta — Chamada limpa para o feed sem cards fixos de obras */}
        <section className="px-5 lg:px-10 pb-12">
          <div className="max-w-6xl mx-auto bg-artDark text-white rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-black/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Galeria Aberta
                </span>

                <h2 className="font-editorial text-4xl lg:text-5xl leading-tight mb-3">
                  Descubra produções artísticas <span className="italic text-artOrange">autênticas.</span>
                </h2>

                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Conheça centenas de produções de pintura digital, modelagem 3D, arte têxtil, ilustração e muito mais no nosso feed curado.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleInteracaoRestrita("explorar o feed completo de obras")}
                className="bg-artOrange text-white px-8 py-4 rounded-full text-xs font-bold hover:bg-white hover:text-artDark transition-all shadow-xl shadow-artOrange/20 shrink-0 flex items-center justify-center gap-2 active:scale-95"
              >
                Explorar Feed Completo
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

            <i className="fa-solid fa-compass absolute -right-8 -bottom-8 text-[12rem] text-white/5 rotate-12 pointer-events-none"></i>
          </div>
        </section>
      </main>

      {/* Footer Discreto com Link para os Termos */}
      <footer className="relative z-10 border-t border-black/5 bg-white/50 backdrop-blur-sm py-6 px-5 lg:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Artfolio. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/termos" target="_blank" rel="noopener noreferrer" className="hover:text-artDark transition-colors underline">
              Termos de Uso e Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>

      {/* Modal de Conversão ao tentar interagir */}
      <ModalConversao
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        acao={acaoTentada}
      />
    </div>
  );
}