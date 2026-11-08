import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TermosUso() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/cadastro");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased selection:bg-artPurple selection:text-white">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      {/* Header Fixo e Elegante */}
      <header className="relative z-10 px-6 lg:px-12 py-5 border-b border-black/5 bg-white/85 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="font-editorial text-2xl lg:text-3xl font-black text-artOrange tracking-tight flex items-center gap-2"
          >
            <span>Artfolio</span>
          </Link>

          <button
            type="button"
            onClick={handleVoltar}
            className="text-xs font-bold uppercase tracking-widest text-artPurple hover:text-artOrange transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Voltar
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-10 lg:py-14">
        <div className="bg-white rounded-[2.5rem] border border-black/5 p-8 lg:p-14 shadow-xl shadow-black/5">
          {/* Badge de Versão do Documento */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-artPurple/10 text-artPurple border border-artPurple/20 font-bold tracking-widest uppercase text-[10px] px-3 py-1 rounded-full">
              Documento Legal • Versão 2.0
            </span>
            <span className="bg-green-50 text-green-700 border border-green-200 font-bold tracking-widest uppercase text-[10px] px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Em vigor
            </span>
          </div>

          <h1 className="font-editorial text-4xl lg:text-5xl leading-tight mb-3">
            Termos de Uso e <span className="italic text-artPurple">Política de Privacidade</span>
          </h1>

          <p className="text-sm text-gray-500 font-light max-w-2xl mb-10 leading-relaxed">
            Bem-vindo(a) ao Artfolio. Por favor, leia atentamente as diretrizes, direitos, responsabilidades e práticas de privacidade que regem a nossa plataforma artística.
          </p>

          {/* Índice Rápido de Seções */}
          <nav aria-label="Sumário dos termos" className="bg-[#F9F8F6] p-5 rounded-2xl border border-black/5 mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
              Sumário de Cláusulas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              <a href="#secao-1" className="hover:text-artOrange transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black/5 flex items-center justify-center font-bold text-[10px]">1</span>
                Aceitação dos Termos e Cadastro
              </a>
              <a href="#secao-2" className="hover:text-artOrange transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black/5 flex items-center justify-center font-bold text-[10px]">2</span>
                Natureza da Plataforma, Papéis e Elegibilidade
              </a>
              <a href="#secao-3" className="hover:text-artOrange transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black/5 flex items-center justify-center font-bold text-[10px]">3</span>
                Privacidade, Proteção de Dados e Anonimização (LGPD)
              </a>
              <a href="#secao-4" className="hover:text-artOrange transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black/5 flex items-center justify-center font-bold text-[10px]">4</span>
                Direitos Autorais, Preservação e Propriedade Intelectual
              </a>
              <a href="#secao-5" className="hover:text-artOrange transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black/5 flex items-center justify-center font-bold text-[10px]">5</span>
                Transações Financeiras e Encomendas
              </a>
              <a href="#secao-6" className="hover:text-artOrange transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black/5 flex items-center justify-center font-bold text-[10px]">6</span>
                Planos de Assinatura e Limites de Armazenamento
              </a>
              <a href="#secao-7" className="hover:text-artOrange transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white border border-black/5 flex items-center justify-center font-bold text-[10px]">7</span>
                Conduta, Infrações e Segurança (Blacklist)
              </a>
            </div>
          </nav>

          {/* Seções dos Termos */}
          <div className="space-y-10 text-sm text-gray-600 leading-relaxed font-normal">
            
            {/* 1. Aceitação dos Termos e Cadastro */}
            <section id="secao-1" className="bg-[#F9F8F6] p-7 rounded-2xl border border-black/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-artOrange/10 text-artOrange flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="font-bold text-base text-artDark">
                  Aceitação dos Termos e Cadastro
                </h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  Ao criar uma conta no Artfolio, você concorda explicitamente com os Termos de Serviço e a Política de Privacidade.
                </p>
                <p>
                  Para garantir a conformidade legal e a segurança de ambas as partes, o sistema registrará automaticamente a data e a versão do termo aceito em nosso banco de dados.
                </p>
                <p className="font-semibold text-artDark">
                  Caso não concorde com qualquer disposição, não prossiga com o cadastro.
                </p>
              </div>
            </section>

            {/* 2. Natureza da Plataforma, Papéis e Elegibilidade */}
            <section id="secao-2" className="p-7 rounded-2xl border border-black/5 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-artPurple/10 text-artPurple flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="font-bold text-base text-artDark">
                  Natureza da Plataforma, Papéis e Elegibilidade
                </h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  O Artfolio é uma plataforma dedicada à divulgação, catalogação, portfólio e conexões artísticas entre criadores e admiradores de arte.
                </p>
                <p>
                  A plataforma permite o cadastro de <strong>Pessoas Físicas (PF)</strong> e <strong>Pessoas Jurídicas (PJ)</strong>.
                </p>
                <p>
                  Respeitando o princípio da minimização de dados da LGPD, não é obrigatório fornecer o CPF ou CNPJ apenas para navegar de forma básica.
                </p>
              </div>
            </section>

            {/* 3. Privacidade, Proteção de Dados e Anonimização (LGPD) */}
            <section id="secao-3" className="p-7 rounded-2xl border border-blue-100 bg-blue-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="font-bold text-base text-artDark">
                  Privacidade, Proteção de Dados e Anonimização (LGPD)
                </h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  O Artfolio está em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
                </p>
                <p>
                  Coletamos apenas os dados essenciais para identificação e utilizamos suas categorias favoritas exclusivamente para personalizar o feed de forma orgânica.
                </p>
                <p>
                  Caso o usuário solicite o encerramento da conta, aplicamos o procedimento de <strong>"deleção lógica com anonimização"</strong>. Seus dados pessoais sensíveis (como E-mail, CPF/CNPJ, Telefone e Foto de Perfil) serão apagados definitivamente do sistema, e o nome será alterado para <span className="font-mono bg-white px-2 py-0.5 rounded border border-black/5 text-xs text-gray-700">"Usuário Removido"</span>.
                </p>
                <p>
                  Registros contábeis e históricos de assinaturas pagas serão mantidos de forma anônima estritamente para o cumprimento de obrigações legais.
                </p>
                <p>
                  O histórico de mensagens privadas no Chat é mantido armazenado no servidor para fins de segurança e auditoria contra assédios, mesmo que uma das contas seja desativada. Já as curtidas e seguidores removidos sofrem deleção física definitiva do banco de dados.
                </p>
              </div>
            </section>

            {/* 4. Direitos Autorais, Preservação e Propriedade Intelectual */}
            <section id="secao-4" className="p-7 rounded-2xl border border-amber-100 bg-amber-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h2 className="font-bold text-base text-artDark">
                  Direitos Autorais, Preservação e Propriedade Intelectual
                </h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  Você mantém todos os direitos de propriedade intelectual sobre as obras publicadas; o Artfolio não reivindica a autoria do seu trabalho.
                </p>
                <p>
                  Você concede à plataforma apenas uma licença para hospedar e exibir seu conteúdo para outros usuários e recrutadores.
                </p>
                <p className="font-semibold text-artDark">
                  É política estrita da plataforma garantir 100% da preservação da resolução e qualidade original das obras enviadas, nunca aplicando compressão destrutiva.
                </p>
              </div>
            </section>

            {/* 5. Transações Financeiras e Encomendas */}
            <section id="secao-5" className="p-7 rounded-2xl border border-black/5 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-artPurple/10 text-artPurple flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <h2 className="font-bold text-base text-artDark">
                  Transações Financeiras e Encomendas
                </h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  O Artfolio opera exclusivamente como vitrine de portfólios e canal de conexão.
                </p>
                <p>
                  A plataforma <strong>não processa pagamentos, não retém comissões</strong> sobre as vendas de artes e não atua como intermediador financeiro.
                </p>
                <p>
                  Toda a negociação de valores, detalhes e prazos ocorre de forma livre e sob demanda através do Chat interno, sendo a transação financeira uma responsabilidade externa exclusiva dos próprios usuários.
                </p>
              </div>
            </section>

            {/* 6. Planos de Assinatura e Limites de Armazenamento */}
            <section id="secao-6" className="p-7 rounded-2xl border border-purple-100 bg-purple-50/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-artPurple/10 text-artPurple flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <h2 className="font-bold text-base text-artDark">
                  Planos de Assinatura e Limites de Armazenamento
                </h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  O Artfolio oferece acesso gratuito e planos de assinatura Premium (<strong>Pro</strong> e <strong>Boost</strong>) com recursos avançados.
                </p>
                <p>
                  O sistema garante a integridade financeira estabelecendo a regra de que cada usuário pode ter apenas <strong>uma (1) assinatura ativa por vez</strong>.
                </p>
                <p>
                  A capacidade de postagem é controlada exclusivamente pelo peso do arquivo em Megabytes e pela estrutura (ex: 10 MB e 1 página para o Free; até 50 MB ou 100 MB em formato carrossel para os planos pagos).
                </p>
              </div>
            </section>

            {/* 7. Conduta, Infrações e Segurança (Blacklist) */}
            <section id="secao-7" className="bg-red-50/60 p-7 rounded-2xl border border-red-200/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-sm">
                  7
                </div>
                <h2 className="font-bold text-base text-red-700">
                  Conduta, Infrações e Segurança (Blacklist)
                </h2>
              </div>
              <div className="space-y-3 pl-11 text-gray-700">
                <p>
                  Contas que violarem direitos autorais, praticarem condutas abusivas, fraudulentas ou assédio no Chat serão suspensas ou banidas.
                </p>
                <p>
                  Usuários banidos por infrações graves terão seu documento de identificação (CPF ou CNPJ) permanentemente registrado em nossa lista de restrição (<strong>Blacklist</strong>).
                </p>
                <p className="font-semibold text-red-800">
                  Travas automáticas no banco de dados impedirão definitivamente que o infrator utilize o mesmo documento para criar novas contas na plataforma.
                </p>
              </div>
            </section>
          </div>

          {/* Rodapé dos Termos */}
          <div className="mt-12 pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Documento Oficial • Versão 2.0 • Artfolio TCC
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-print"></i> Imprimir
              </button>
              
              <button
                type="button"
                onClick={handleVoltar}
                className="bg-artDark text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
              >
                Voltar à navegação
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
