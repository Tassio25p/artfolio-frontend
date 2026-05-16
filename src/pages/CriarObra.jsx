import React from "react";
import Sidebar from "../components/Sidebar";

function CriarObra() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Obra enviada para análise! Ela ficará pendente até ser aprovada pela moderação.");
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] mb-2 block">
              Nova Obra
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
              Enviar Obra <br />
              <span className="italic text-artPurple">para Análise.</span>
            </h1>

            <p className="text-sm text-gray-500 mt-4 max-w-2xl leading-relaxed">
              Antes de aparecer no Feed e no seu perfil, a obra passará por uma
              análise de moderação para evitar conteúdo impróprio, plágio ou uso
              indevido de personagens, marcas e obras de terceiros.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-8 lg:gap-10"
          >
            <div className="lg:w-7/12">
              <label className="group relative flex flex-col items-center justify-center w-full h-[390px] border-2 border-dashed border-gray-200 rounded-[2.3rem] bg-white hover:bg-gray-50 hover:border-artBlue transition-all cursor-pointer overflow-hidden">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-6">
                  <i className="fa-solid fa-cloud-arrow-up text-5xl text-gray-200 group-hover:text-artBlue transition-colors mb-4"></i>

                  <p className="text-sm text-gray-400 font-medium">
                    Arraste sua obra ou{" "}
                    <span className="text-artBlue underline">
                      busque no computador
                    </span>
                  </p>

                  <p className="text-[10px] text-gray-300 uppercase mt-2">
                    JPG, PNG, GIF ou MP4 Máx 50MB
                  </p>
                </div>

                <input type="file" className="hidden" />
              </label>

              <div className="mt-5 bg-artOrange/5 border border-artOrange/10 rounded-[1.7rem] p-5 flex gap-4">
                <div className="w-11 h-11 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                    Atenção aos direitos autorais
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Não envie imagens com personagens famosos, marcas
                    registradas, logos, obras copiadas ou artes de terceiros sem
                    autorização. Conteúdos assim podem ser recusados pela
                    moderação.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-5/12 space-y-5">
              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Título da Obra
                </label>

                <input
                  type="text"
                  placeholder="Ex: Fragmentos de Vidro"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                  required
                />
              </div>

              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Legenda da Obra
                </label>

                <textarea
                  rows="4"
                  placeholder="O que inspirou esta criação?"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Categoria
                </label>

                <select
                  defaultValue=""
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Selecione o tipo de arte
                  </option>
                  <option value="pintura-digital">Pintura Digital</option>
                  <option value="modelagem-3d">Modelagem 3D</option>
                  <option value="artesanato-croche">
                    Artesanato / Crochê
                  </option>
                  <option value="desenho-manual">Desenho Manual</option>
                  <option value="ilustracao">Ilustração</option>
                  <option value="arte-conceitual">Arte Conceitual</option>
                </select>
              </div>

              <div className="bg-artBlue/5 p-5 rounded-[1.7rem] border border-artBlue/10">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                  <i className="fa-solid fa-shield-halved mr-2"></i>
                  Processo de Moderação
                </h4>

                <p className="text-sm text-gray-500 leading-relaxed">
                  Após o envio, sua obra ficará com status{" "}
                  <strong className="text-artDark">Pendente</strong>. Um
                  moderador ou administrador poderá aprovar ou recusar a
                  publicação. Apenas obras aprovadas aparecem no Feed.
                </p>
              </div>

              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 accent-artPurple"
                    required
                  />

                  <span>
                    Declaro que esta obra é de minha autoria ou que possuo
                    autorização para publicá-la no Artfolio.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-artDark text-white py-5 rounded-full font-bold hover:bg-artBlue transition-all shadow-xl shadow-black/10 flex items-center justify-center space-x-3 active:scale-95"
              >
                <span>Enviar para Análise</span>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CriarObra;