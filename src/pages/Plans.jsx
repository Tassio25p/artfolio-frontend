import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { planosService } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";

export default function Plans() {
  const { addToast } = useToast();
  const { user: authUser } = useAuth();
  const [meuPlano, setMeuPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assinandoId, setAssinandoId] = useState(null);

  const carregarMeuPlano = async () => {
    try {
      const dados = await planosService.obterMeuPlano();
      setMeuPlano(dados);
    } catch {
      setMeuPlano({
        tipo: "Free",
        nomeExibicao: "Artfolio Free",
        cor: "artGreen",
        precoPlano: 0.0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMeuPlano();
  }, []);

  const handleAssinar = async (plano) => {
    if (!authUser) {
      addToast("Faça login na sua conta para assinar ou trocar de plano.", "Atenção", "aviso");
      return;
    }

    if (meuPlano?.tipo?.toLowerCase() === plano.tipo.toLowerCase()) {
      addToast(`Você já está aproveitando os benefícios do plano ${plano.nome}.`, "Plano Ativo", "info");
      return;
    }

    try {
      setAssinandoId(plano.id);
      const res = await planosService.assinarPlano(plano.id);
      setMeuPlano(res);
      addToast(`Parabéns! Seu plano agora é ${plano.nome}. Os novos recursos já estão liberados!`, "Sucesso!", "sucesso");
    } catch (err) {
      addToast(err.message || "Não foi possível alterar de plano. Tente novamente.", "Erro", "erro");
    } finally {
      setAssinandoId(null);
    }
  };

  // Cards com alinhamento rigoroso linha por linha (exatamente 9 linhas sincronizadas)
  const planos = [
    {
      id: 1,
      tipo: "Free",
      nome: "Artfolio Free",
      subtitulo: "Essencial",
      tagline: "Para quem está começando a expor seus trabalhos na comunidade.",
      preco: "Grátis",
      periodo: "sempre gratuito",
      destaque: false,
      corNome: "text-artGreen",
      corBorda: "border-artGreen/30 hover:border-artGreen",
      corBadge: "bg-artGreen text-white shadow-md shadow-artGreen/30",
      corLed: "ring-4 ring-[#00B894] shadow-[0_0_15px_#00B894,0_0_30px_rgba(0,184,148,0.7)]",
      corBotao: "bg-[#F9F8F6] text-artDark border border-black/10 hover:bg-artGreen hover:text-white",
      recursos: [
        { texto: "Portfólio com biografia e links externos", ativo: true },
        { texto: "Qualidade original preservada", ativo: true },
        { texto: "Postagem simples (1 página)", ativo: true },
        { texto: "Chat livre e ilimitado", ativo: true },
        { texto: "Moldura LED e tag verde Free no perfil", ativo: true },
        { texto: "Estatísticas completas", ativo: false },
        { texto: "Mensagem inicial customizável", ativo: false },
        { texto: "Destaque segmentado no feed", ativo: false },
        { texto: "Prioridade orgânica em novos públicos", ativo: false },
      ],
    },
    {
      id: 2,
      tipo: "Pro",
      nome: "Artfolio Pro",
      subtitulo: "Profissional",
      tagline: "Para artistas que buscam presença profissional, métricas e carrosséis.",
      preco: "R$ 29,90",
      periodo: "por mês",
      destaque: true,
      corNome: "text-artPurple",
      corBorda: "border-artPurple shadow-xl shadow-artPurple/15",
      corBadge: "bg-artPurple text-white shadow-md shadow-artPurple/30",
      corLed: "ring-4 ring-[#6C5CE7] shadow-[0_0_15px_#6C5CE7,0_0_30px_rgba(108,92,231,0.7)]",
      corBotao: "bg-artPurple text-white hover:bg-indigo-700 shadow-lg shadow-artPurple/25",
      recursos: [
        { texto: "Portfólio com biografia e links externos", ativo: true },
        { texto: "Qualidade original preservada", ativo: true },
        { texto: "Múltiplas páginas por post", ativo: true },
        { texto: "Chat livre e ilimitado", ativo: true },
        { texto: "Moldura LED e tag roxa Pro no perfil", ativo: true },
        { texto: "Estatísticas completas", ativo: true },
        { texto: "Mensagem inicial customizável", ativo: true },
        { texto: "Destaque segmentado no feed", ativo: false },
        { texto: "Prioridade orgânica em novos públicos", ativo: false },
      ],
    },
    {
      id: 3,
      tipo: "Boost",
      nome: "Artfolio Boost",
      subtitulo: "Alcance Máximo",
      tagline: "Para acelerar seu alcance sem pay-to-win. Destaque inteligente para novos públicos.",
      preco: "R$ 49,90",
      periodo: "por mês",
      destaque: false,
      corNome: "text-artOrange",
      corBorda: "border-artOrange/40 hover:border-artOrange",
      corBadge: "bg-artOrange text-white shadow-md shadow-artOrange/30",
      corLed: "ring-4 ring-[#FF793F] shadow-[0_0_15px_#FF793F,0_0_30px_rgba(255,121,63,0.7)]",
      corBotao: "bg-artOrange text-white hover:bg-orange-600 shadow-lg shadow-artOrange/25",
      recursos: [
        { texto: "Portfólio com biografia e links externos", ativo: true },
        { texto: "Qualidade original preservada", ativo: true },
        { texto: "Múltiplas páginas por post", ativo: true },
        { texto: "Chat livre e ilimitado", ativo: true },
        { texto: "Moldura LED e tag laranja Boost no perfil", ativo: true },
        { texto: "Estatísticas completas", ativo: true },
        { texto: "Mensagem inicial customizável", ativo: true },
        { texto: "Destaque segmentado no feed", ativo: true },
        { texto: "Prioridade orgânica em novos públicos", ativo: true },
      ],
    },
  ];

  // Tabela comparativa simétrica e rigorosamente alinhada linha por linha
  const comparativo = [
    {
      funcionalidade: "Portfólio",
      free: "Biografia e links externos",
      pro: "Biografia e links externos",
      boost: "Biografia e links externos",
      isRiscado: { free: false, pro: false, boost: false },
    },
    {
      funcionalidade: "Resolução",
      free: "Qualidade original preservada",
      pro: "Qualidade original preservada",
      boost: "Qualidade original preservada",
      isRiscado: { free: false, pro: false, boost: false },
    },
    {
      funcionalidade: "Postagens",
      free: "Postagem simples (1 página)",
      pro: "Múltiplas páginas por post",
      boost: "Múltiplas páginas por post",
      isRiscado: { free: false, pro: false, boost: false },
    },
    {
      funcionalidade: "Chat",
      free: "Livre e ilimitado",
      pro: "Livre e ilimitado",
      boost: "Livre e ilimitado",
      isRiscado: { free: false, pro: false, boost: false },
    },
    {
      funcionalidade: "Identidade",
      free: "Moldura LED e tag verde Free",
      pro: "Moldura LED e tag roxa Pro",
      boost: "Moldura LED e tag laranja Boost",
      isRiscado: { free: false, pro: false, boost: false },
    },
    {
      funcionalidade: "Estatísticas",
      free: "Estatísticas completas",
      pro: "Estatísticas completas",
      boost: "Estatísticas completas",
      isRiscado: { free: true, pro: false, boost: false },
    },
    {
      funcionalidade: "Mensagem CTA",
      free: "Mensagem inicial customizável",
      pro: "Mensagem inicial customizável",
      boost: "Mensagem inicial customizável",
      isRiscado: { free: true, pro: false, boost: false },
    },
    {
      funcionalidade: "Visibilidade",
      free: "Destaque segmentado no feed",
      pro: "Destaque segmentado no feed",
      boost: "Destaque segmentado no feed",
      isRiscado: { free: true, pro: true, boost: false },
    },
    {
      funcionalidade: "Prioridade",
      free: "Prioridade orgânica em novos públicos",
      pro: "Prioridade orgânica em novos públicos",
      boost: "Prioridade orgânica em novos públicos",
      isRiscado: { free: true, pro: true, boost: false },
    },
  ];

  const planoAtivoTipo = meuPlano?.tipo || "Free";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-artPurple/10 border border-artPurple/20 text-artPurple px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <i className="fa-solid fa-gem text-xs"></i>
            Planos e Ferramentas Profissionais
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Evolua sua arte. <br />
            <span className="italic text-artOrange">Destaque seu talento.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            No Artfolio, você nunca paga taxas ou porcentagens sobre suas vendas. Nossos planos focam em profissionalização, visibilidade qualificada e personalização de perfil.
          </p>
        </header>

        {/* Cards dos 3 Planos com alinhamento rigoroso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {planos.map((plano) => {
            const ehPlanoAtual = planoAtivoTipo.toLowerCase() === plano.tipo.toLowerCase();
            const estaAssinando = assinandoId === plano.id;

            return (
              <div
                key={plano.id}
                className={`relative rounded-3xl p-7 sm:p-8 bg-white border transition-all duration-300 flex flex-col justify-between ${ehPlanoAtual ? "ring-2 ring-artDark shadow-2xl scale-[1.02]" : plano.corBorda
                  }`}
              >
                {/* Badge de Destaque ou Plano Atual */}
                {ehPlanoAtual ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-artDark text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
                    Seu Plano Ativo
                  </span>
                ) : plano.destaque ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-artPurple text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
                    Mais Popular
                  </span>
                ) : null}

                <div>
                  {/* Topo do Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${plano.corNome}`}>
                        {plano.subtitulo}
                      </span>
                      <h3 className="font-editorial text-2xl sm:text-3xl mt-0.5">{plano.nome}</h3>
                    </div>

                    {/* Mockup miniatura do LED com luz neon brilhosa */}
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center p-1 relative">
                      <div className={`w-9 h-9 rounded-xl bg-gray-200 overflow-hidden ${plano.corLed} flex items-center justify-center text-xs font-bold`}>
                        <i className="fa-solid fa-palette text-gray-500"></i>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed min-h-[38px] mb-6">
                    {plano.tagline}
                  </p>

                  {/* Preço */}
                  <div className="mb-6 pb-6 border-b border-black/5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight">
                        {plano.preco}
                      </span>
                      {plano.periodo && (
                        <span className="text-xs text-gray-400 font-medium">/{plano.periodo}</span>
                      )}
                    </div>
                  </div>

                  {/* Lista de Recursos rigorosamente alinhada */}
                  <ul className="space-y-3 mb-8">
                    {plano.recursos.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs min-h-[22px]">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${rec.ativo ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-300"
                            }`}
                        >
                          <i className={`fa-solid ${rec.ativo ? "fa-check" : "fa-xmark"} text-[9px]`}></i>
                        </span>
                        <span className={rec.ativo ? "text-gray-700 font-medium" : "text-gray-400 line-through opacity-60"}>
                          {rec.texto}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botão de Ação */}
                <div>
                  <button
                    type="button"
                    disabled={ehPlanoAtual || estaAssinando || loading}
                    onClick={() => handleAssinar(plano)}
                    className={`w-full py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${ehPlanoAtual
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                      : plano.corBotao
                      }`}
                  >
                    {estaAssinando ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Atualizando...
                      </>
                    ) : ehPlanoAtual ? (
                      <>
                        <i className="fa-solid fa-check"></i>
                        Plano Atual
                      </>
                    ) : plano.id === 1 ? (
                      "Voltar para Free"
                    ) : (
                      `Mudar para ${plano.nome}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabela Comparativa de Recursos (Visão Lado a Lado Rigorosa) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-black/5 shadow-sm mb-14">
          <div className="text-center mb-8">
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
              Visão Lado a Lado
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl">Comparativo dos Planos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/5 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Funcionalidades</th>
                  <th className="py-4 px-4 text-artGreen">Free</th>
                  <th className="py-4 px-4 text-artPurple">Pro</th>
                  <th className="py-4 px-4 text-artOrange">Boost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {comparativo.map((linha, index) => (
                  <tr key={index} className="hover:bg-[#F9F8F6]/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-800">{linha.funcionalidade}</td>
                    <td className={`py-4 px-4 ${linha.isRiscado.free ? "text-gray-400 line-through opacity-60" : "text-gray-700 font-medium"}`}>
                      {linha.free}
                    </td>
                    <td className={`py-4 px-4 ${linha.isRiscado.pro ? "text-gray-400 line-through opacity-60" : "text-artPurple font-medium"}`}>
                      {linha.pro}
                    </td>
                    <td className={`py-4 px-4 ${linha.isRiscado.boost ? "text-gray-400 line-through opacity-60" : "text-artOrange font-medium"}`}>
                      {linha.boost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Rodapé explicativo / Transparência */}
        <div className="bg-[#121212] text-white rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-artPurple/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="font-editorial text-2xl sm:text-3xl mb-3">
              Transparência e Respeito aos Artistas
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-light">
              Não cobramos comissões sobre suas vendas nem intermediamos pagamentos. Todas as negociações feitas via chat são 100% suas, sem taxas embutidas. Seu sucesso pertence a você.
            </p>
            <Link
              to="/termos"
              className="inline-block text-[11px] font-bold text-artOrange hover:underline uppercase tracking-widest"
            >
              Conheça nossos Termos de Uso e Política de Planos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}