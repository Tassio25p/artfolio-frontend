import React from "react";
import { Link } from "react-router-dom";

export default function TermosUso() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-6 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="font-editorial text-2xl lg:text-3xl font-black text-artOrange tracking-tight"
          >
            Artfolio
          </Link>

          <Link
            to="/cadastro"
            className="text-xs font-bold uppercase tracking-widest text-artPurple hover:underline flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Voltar ao Cadastro
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        <div className="bg-white rounded-[2.5rem] border border-black/5 p-8 lg:p-14 shadow-xl shadow-black/5">
          <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] mb-3 block">
            Documento Legal • Versão 1.0
          </span>

          <h1 className="font-editorial text-4xl lg:text-5xl leading-tight mb-8">
            Termos de Uso e <span className="italic text-artPurple">Política de Privacidade</span>
          </h1>

          <div className="space-y-8 text-sm text-gray-600 leading-relaxed font-normal">
            <section className="bg-[#F9F8F6] p-6 rounded-2xl border border-black/5">
              <h2 className="font-bold text-base text-artDark mb-2 flex items-center gap-2">
                <i className="fa-solid fa-scale-balanced text-artOrange"></i> 1. Aceitação dos Termos
              </h2>
              <p>
                Ao criar uma conta ou utilizar os serviços da plataforma Artfolio, você concorda expressamente com todos os termos e diretrizes estabelecidos neste documento. Caso não concorde com qualquer disposição, não prossiga com o cadastro.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-base text-artDark mb-2 flex items-center gap-2">
                <i className="fa-solid fa-palette text-artPurple"></i> 2. Natureza da Plataforma e Papéis
              </h2>
              <p className="mb-3">
                O Artfolio é uma plataforma dedicada à divulgação, catalogação, portfólio e conexões artísticas entre criadores e admiradores de arte.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li><strong>Artistas (PF ou PJ):</strong> Usuários devidamente cadastrados que podem publicar obras, criar portfólios, interagir na comunidade e receber solicitações.</li>
                <li><strong>Visitantes (Guests):</strong> Usuários não cadastrados que possuem acesso estritamente para visualização pública de conteúdos, sem coleta desnecessária de dados pessoais.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base text-artDark mb-2 flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-artBlue"></i> 3. Privacidade e Proteção de Dados (LGPD)
              </h2>
              <p className="mb-2">
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), o Artfolio adota o princípio da <strong>Minimização de Dados</strong> e da <strong>Finalidade</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>Coletamos apenas os dados essenciais para identificação e segurança da conta (Nome/Nick, E-mail, Senha e CPF/CNPJ).</li>
                <li>Dados de visitantes não são armazenados em tabelas permanentes.</li>
                <li>Não compartilhamos nem comercializamos seus dados com terceiros.</li>
                <li>O usuário pode solicitar a exclusão de sua conta e anonimização de seus dados a qualquer momento.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base text-artDark mb-2 flex items-center gap-2">
                <i className="fa-solid fa-copyright text-artOrange"></i> 4. Direitos Autorais e Propriedade Intelectual
              </h2>
              <p>
                Os direitos autorais de todas as obras, ilustrações, projetos e conteúdos publicados pertencem integralmente aos seus respectivos criadores. É expressamente proibida a reprodução, cópia, distribuição ou comercialização não autorizada de qualquer obra presente na plataforma.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-base text-artDark mb-2 flex items-center gap-2">
                <i className="fa-solid fa-handshake text-artPurple"></i> 5. Transações e Encomendas
              </h2>
              <p>
                O Artfolio funciona como vitrine e ponte de contato. A plataforma <strong>não intermedia pagamentos</strong> diretamente. Toda e qualquer negociação, prazo ou pagamento ocorre sob responsabilidade mútua entre o artista e o solicitante.
              </p>
            </section>

            <section className="bg-red-50/50 p-6 rounded-2xl border border-red-200/50">
              <h2 className="font-bold text-base text-red-600 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-ban text-red-500"></i> 6. Infrações e Blacklist
              </h2>
              <p className="text-gray-600">
                Contas que violarem direitos autorais, praticarem condutas abusivas, ofensivas ou fraudulentas serão banidas e seu CPF/CNPJ poderá ser registrado na lista de restrições (Blacklist) para proteger a integridade da comunidade artística.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Última atualização: {new Date().toLocaleDateString("pt-BR")} • Artfolio TCC
            </p>

            <button
              type="button"
              onClick={() => window.close()}
              className="bg-artDark text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
            >
              Fechar esta aba
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
