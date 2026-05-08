import Sidebar from "../components/Sidebar"
import PlanCard from "../components/PlanCard"

export default function Plans() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen px-5 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-3 block">
              Planos e permissões
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-tight">
              Escolha seu <br />
              <span className="italic text-artOrange">legado.</span>
            </h1>

            <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
              Cada plano libera recursos diferentes dentro do Artfolio. No
              futuro, o sistema usará a sessão do usuário para identificar o
              plano ativo e controlar o acesso às funcionalidades.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <PlanCard
              name="Entusiasta"
              description="Para quem está começando a expor."
              price="Grátis"
              buttonText="Plano Atual"
              iconColor="text-artGreen"
              features={[
                { text: "Até 10 obras no portfólio" },
                { text: "Feed comunitário" },
                { text: "Salvar obras favoritas" },
                { text: "Mensagens básicas" },
                { text: "Estatísticas avançadas", disabled: true },
                { text: "Destaque no Feed", disabled: true },
                { text: "Área de encomendas", disabled: true },
                { text: "Selo de verificado", disabled: true },
              ]}
            />

            <PlanCard
              dark
              popular
              name="Curador Pro"
              description="Para artistas profissionais."
              price="R$ 49"
              priceColor="text-artPurple"
              buttonText="Assinar Agora"
              iconColor="text-artPurple"
              features={[
                { text: "Obras ilimitadas" },
                { text: "Selo de artista verificado" },
                { text: "Estatísticas de visualização" },
                { text: "Prioridade no Feed Global" },
                { text: "Área de encomendas" },
                { text: "Destaque de obras" },
                { text: "Mensagens comerciais" },
                { text: "Perfil com prioridade" },
              ]}
            />

            <PlanCard
              name="Galeria"
              description="Para coletivos, negócios e galerias."
              price="R$ 199"
              priceColor="text-artBlue"
              buttonText="Contatar Vendas"
              iconColor="text-artBlue"
              features={[
                { text: "Múltiplos perfis de artista" },
                { text: "Gerenciamento de equipe" },
                { text: "Taxa de venda reduzida" },
                { text: "Suporte VIP" },
                { text: "Destaque comercial" },
                { text: "Relatórios avançados" },
                { text: "Curadoria de artistas" },
                { text: "Campanhas e exposições" },
              ]}
            />
          </section>

          <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white rounded-[2rem] border border-black/5 p-6">
              <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-2">
                Controle por sessão
              </span>

              <h2 className="font-editorial text-3xl italic mb-3">
                O sistema vai liberar recursos conforme o plano.
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                Quando o usuário fizer login, a sessão vai guardar informações
                como nome, id, e-mail e plano atual. Com isso, o frontend poderá
                mostrar ou bloquear áreas como estatísticas, encomendas, destaque
                no feed e limite de obras.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="bg-[#F9F8F6] rounded-[1.3rem] p-4 border border-black/5">
                  <p className="font-black text-lg">Grátis</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Acesso básico
                  </span>
                </div>

                <div className="bg-[#F9F8F6] rounded-[1.3rem] p-4 border border-black/5">
                  <p className="font-black text-lg">Pro</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Recursos premium
                  </span>
                </div>

                <div className="bg-[#F9F8F6] rounded-[1.3rem] p-4 border border-black/5">
                  <p className="font-black text-lg">Galeria</p>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    Uso comercial
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-artDark text-white rounded-[2rem] p-6 relative overflow-hidden">
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                Pensando no backend
              </span>

              <h2 className="font-editorial text-3xl italic leading-tight">
                Cada usuário terá permissões diferentes.
              </h2>

              <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                Depois, no backend, o plano do usuário será usado para validar se
                ele pode acessar estatísticas, encomendas, destaques, quantidade
                de obras e recursos premium.
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-lock text-artPurple"></i>
                  Recursos bloqueados mostram aviso de upgrade
                </div>

                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-crown text-artOrange"></i>
                  Recursos Pro exigem assinatura ativa
                </div>

                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-user-check text-artBlue"></i>
                  Sessão identifica o usuário logado
                </div>
              </div>

              <i className="fa-solid fa-crown absolute -right-6 -bottom-8 text-[8rem] text-white/5 rotate-12"></i>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}