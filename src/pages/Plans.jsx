import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const planoAtual = "FREE";

const planos = [
  {
    id: "FREE",
    nome: "Free",
    apelido: "Entusiasta",
    descricao: "Para quem está começando a montar seu portfólio.",
    preco: "Grátis",
    destaque: false,
    cor: "text-artGreen",
    fundoIcone: "bg-artGreen/10",
    botao: "Plano atual",
    recursos: [
      { texto: "Até 10 obras no portfólio", ativo: true },
      { texto: "Perfil público básico", ativo: true },
      { texto: "Salvar obras favoritas", ativo: true },
      { texto: "Mensagens básicas", ativo: true },
      { texto: "Solicitar encomendas", ativo: true },
      { texto: "Estatísticas avançadas", ativo: false },
      { texto: "Destaque no feed", ativo: false },
      { texto: "Selo Pro no perfil", ativo: false },
    ],
  },
  {
    id: "PREMIUM",
    nome: "Premium",
    apelido: "Artista",
    descricao: "Para artistas que querem mais controle do portfólio.",
    preco: "R$ 29,90",
    destaque: true,
    cor: "text-artPurple",
    fundoIcone: "bg-artPurple/10",
    botao: "Assinar futuramente",
    recursos: [
      { texto: "Até 50 obras no portfólio", ativo: true },
      { texto: "Perfil público completo", ativo: true },
      { texto: "Área de encomendas", ativo: true },
      { texto: "Mensagens comerciais", ativo: true },
      { texto: "Estatísticas intermediárias", ativo: true },
      { texto: "Mais visibilidade no feed", ativo: true },
      { texto: "Destaque manual de obras", ativo: false },
      { texto: "Relatórios avançados", ativo: false },
    ],
  },
  {
    id: "PRO",
    nome: "Pro",
    apelido: "Profissional",
    descricao: "Para artistas profissionais que desejam mais destaque.",
    preco: "R$ 49,90",
    destaque: false,
    cor: "text-artBlue",
    fundoIcone: "bg-artBlue/10",
    botao: "Assinar futuramente",
    recursos: [
      { texto: "Obras ilimitadas", ativo: true },
      { texto: "Perfil com selo Pro", ativo: true },
      { texto: "Área de encomendas completa", ativo: true },
      { texto: "Mensagens comerciais", ativo: true },
      { texto: "Estatísticas avançadas", ativo: true },
      { texto: "Destaque de obras no feed", ativo: true },
      { texto: "Relatórios de desempenho", ativo: true },
      { texto: "Prioridade visual no portfólio", ativo: true },
    ],
  },
];

const comparativo = [
  {
    recurso: "Limite de obras",
    free: "10 obras",
    premium: "50 obras",
    pro: "Ilimitado",
  },
  {
    recurso: "Mensagens",
    free: "Básicas",
    premium: "Comerciais",
    pro: "Comerciais",
  },
  {
    recurso: "Encomendas",
    free: "Solicitar",
    premium: "Receber e gerenciar",
    pro: "Receber e gerenciar",
  },
  {
    recurso: "Estatísticas",
    free: "Limitadas",
    premium: "Intermediárias",
    pro: "Avançadas",
  },
  {
    recurso: "Destaque no feed",
    free: "Não incluso",
    premium: "Parcial",
    pro: "Incluso",
  },
];

export default function Plans() {
  const [noticeMessage, setNoticeMessage] = useState("");

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handlePlano = (plano) => {
    if (plano.id === planoAtual) {
      mostrarAviso("Este já é o plano ativo na prévia visual.");
      return;
    }

    mostrarAviso(
      "A assinatura real será integrada futuramente ao backend e à tabela Assinatura."
    );
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
              Planos e permissões
            </span>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Escolha seu <br />
              <span className="italic text-artOrange">legado.</span>
            </h1>

            <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
              Cada plano libera recursos diferentes dentro do Artfolio. No
              backend, o sistema vai verificar o usuário logado, a assinatura
              ativa e as permissões antes de liberar estatísticas, encomendas,
              destaque e limite de obras.
            </p>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-8 text-xs font-bold max-w-4xl mx-auto">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {planos.map((plano) => (
              <PlanoCard
                key={plano.id}
                plano={plano}
                ativo={plano.id === planoAtual}
                onClick={() => handlePlano(plano)}
              />
            ))}
          </section>

          <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
              <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-2">
                Controle por assinatura
              </span>

              <h2 className="font-editorial text-3xl italic mb-3">
                O sistema vai liberar recursos conforme o plano.
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                Quando o usuário fizer login, o backend vai retornar dados como
                id, nome, e-mail, tipo de usuário, plano atual e status da
                assinatura. Com isso, o frontend poderá mostrar ou bloquear áreas
                como estatísticas, encomendas, destaque no feed e limite de
                obras.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <ResumoPlano
                  titulo="Free"
                  descricao="Acesso básico"
                  icone="fa-solid fa-seedling"
                />

                <ResumoPlano
                  titulo="Premium"
                  descricao="Recursos comerciais"
                  icone="fa-solid fa-star"
                />

                <ResumoPlano
                  titulo="Pro"
                  descricao="Destaque e análise"
                  icone="fa-solid fa-crown"
                />
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-artDark via-purple-950 to-indigo-950 text-white rounded-[2rem] p-6 lg:p-8 relative overflow-hidden shadow-xl border border-artPurple/20">
              <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
                Evolução Artística & Alcance
              </span>

              <h2 className="font-editorial text-3xl sm:text-4xl italic leading-tight">
                Potencialize a visibilidade do seu talento.
              </h2>

              <p className="text-sm text-gray-300 mt-3 leading-relaxed font-light">
                Cada nível de plano foi desenhado para acompanhar a sua jornada, desde as primeiras publicações até a consolidação profissional na comunidade artística.
              </p>

              <div className="mt-6 space-y-3.5 text-xs font-semibold">
                <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-artPurple/20 text-artPurple flex items-center justify-center">
                    <i className="fa-solid fa-palette text-sm"></i>
                  </div>
                  <span>Exposição ilimitada de criações e coleções autorais</span>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-artOrange/20 text-artOrange flex items-center justify-center">
                    <i className="fa-solid fa-crown text-sm"></i>
                  </div>
                  <span>Selo oficial de Artista Verificado no perfil público</span>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-artBlue/20 text-artBlue flex items-center justify-center">
                    <i className="fa-solid fa-chart-line text-sm"></i>
                  </div>
                  <span>Painel de métricas, visualizações e tendências em tempo real</span>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <i className="fa-solid fa-gem text-sm"></i>
                  </div>
                  <span>Destaque prioritário no feed de descobertas e buscas</span>
                </div>
              </div>

              <i className="fa-solid fa-crown absolute -right-6 -bottom-8 text-[8rem] text-white/5 rotate-12"></i>
            </div>
          </section>

          <section className="mt-8 bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Comparativo
                </span>

                <h2 className="font-editorial text-3xl italic">
                  Diferenças entre os planos
                </h2>
              </div>

              <Link
                to="/estatisticas"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all text-center"
              >
                Ver estatísticas
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-gray-400">
                    <th className="px-4 py-3">Recurso</th>
                    <th className="px-4 py-3">Free</th>
                    <th className="px-4 py-3">Premium</th>
                    <th className="px-4 py-3">Pro</th>
                  </tr>
                </thead>

                <tbody>
                  {comparativo.map((item) => (
                    <tr key={item.recurso} className="bg-[#F9F8F6]">
                      <td className="px-4 py-4 rounded-l-2xl text-sm font-bold">
                        {item.recurso}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-500">
                        {item.free}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-500">
                        {item.premium}
                      </td>

                      <td className="px-4 py-4 rounded-r-2xl text-sm text-gray-500">
                        {item.pro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 bg-artPurple/5 border border-artPurple/10 rounded-[2rem] p-5 lg:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-artPurple/10 text-artPurple flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-circle-info"></i>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest">
                    Importante para o TCC
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                    O Artfolio não intermedia pagamentos entre comprador e
                    artista. Os planos servem para liberar recursos da plataforma
                    ao artista, como limite de obras, estatísticas, destaque e
                    ferramentas comerciais.
                  </p>
                </div>
              </div>

              <Link
                to="/meu-portfolio"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                Ir para portfólio
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function PlanoCard({ plano, ativo, onClick }) {
  return (
    <article
      className={`rounded-[2rem] border p-6 relative overflow-hidden transition-all ${
        plano.destaque
          ? "bg-artDark text-white border-artDark shadow-xl shadow-black/10 md:-translate-y-3"
          : "bg-white border-black/5"
      }`}
    >
      {plano.destaque && (
        <span className="absolute top-5 right-5 bg-artPurple text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
          Recomendado
        </span>
      )}

      {ativo && (
        <span
          className={`absolute ${
            plano.destaque ? "top-12 right-5" : "top-5 right-5"
          } bg-artOrange text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest`}
        >
          Ativo
        </span>
      )}

      <div
        className={`w-12 h-12 rounded-2xl ${plano.fundoIcone} ${plano.cor} flex items-center justify-center mb-5`}
      >
        <i className="fa-solid fa-crown"></i>
      </div>

      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${
          plano.destaque ? "text-gray-400" : "text-gray-400"
        }`}
      >
        {plano.apelido}
      </span>

      <h2 className="font-editorial text-4xl italic mt-1">
        {plano.nome}
      </h2>

      <p
        className={`text-sm mt-3 leading-relaxed ${
          plano.destaque ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {plano.descricao}
      </p>

      <div className="mt-6">
        <span className="font-black text-3xl">{plano.preco}</span>

        {plano.id !== "FREE" && (
          <span
            className={`text-xs ml-1 ${
              plano.destaque ? "text-gray-400" : "text-gray-500"
            }`}
          >
            / mês
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`w-full mt-6 px-5 py-3 rounded-full text-xs font-bold transition-all ${
          ativo
            ? plano.destaque
              ? "bg-white/10 text-white cursor-default"
              : "bg-[#F9F8F6] text-gray-400 cursor-default"
            : plano.destaque
            ? "bg-white text-artDark hover:bg-artPurple hover:text-white"
            : "bg-artDark text-white hover:bg-artPurple"
        }`}
      >
        {ativo ? "Plano atual" : plano.botao}
      </button>

      <div className="mt-6 space-y-3">
        {plano.recursos.map((recurso) => (
          <div
            key={recurso.texto}
            className={`flex items-center gap-3 text-sm ${
              recurso.ativo
                ? plano.destaque
                  ? "text-white"
                  : "text-artDark"
                : "text-gray-400"
            }`}
          >
            <i
              className={`fa-solid ${
                recurso.ativo ? "fa-check" : "fa-xmark"
              } ${recurso.ativo ? plano.cor : "text-gray-400"}`}
            ></i>

            <span>{recurso.texto}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function ResumoPlano({ titulo, descricao, icone }) {
  return (
    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-4 border border-black/5">
      <div className="w-9 h-9 rounded-xl bg-artPurple/10 text-artPurple flex items-center justify-center mb-3">
        <i className={icone}></i>
      </div>

      <p className="font-black text-lg">{titulo}</p>

      <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
        {descricao}
      </span>
    </div>
  );
}