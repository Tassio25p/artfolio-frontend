import Sidebar from "../components/Sidebar"
import PlanCard from "../components/PlanCard"

export default function Plans() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 max-w-7xl mx-auto px-6 lg:px-14 py-12">
        <header className="text-center mb-12">
          <span className="text-artPurple font-bold tracking-widest uppercase text-xs mb-3 block">
            Evolua sua Arte
          </span>

          <h1 className="font-editorial text-5xl lg:text-6xl leading-tight">
            Escolha seu <br />
            <span className="italic text-artOrange">legado.</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlanCard
            name="Entusiasta"
            description="Para quem está começando a expor."
            price="Grátis"
            buttonText="Plano Atual"
            iconColor="text-artGreen"
            features={[
              { text: "Até 10 obras no portfólio" },
              { text: "Feed Comunitário" },
              { text: "Selo de Verificado", disabled: true },
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
              { text: "Obras Ilimitadas" },
              { text: "Selo de Artista Verificado" },
              { text: "Estatísticas de Visualização" },
              { text: "Prioridade no Feed Global" },
            ]}
          />

          <PlanCard
            name="Galeria"
            description="Para coletivos e negócios."
            price="R$ 199"
            priceColor="text-artBlue"
            buttonText="Contatar Vendas"
            iconColor="text-artBlue"
            features={[
              { text: "Múltiplos Perfis de Artista" },
              { text: "Taxa de Venda Reduzida" },
              { text: "Suporte VIP 24/7" },
            ]}
          />
        </div>
      </main>
    </div>
  )
}