import React from "react";
import Sidebar from "../components/Sidebar";

function CriarObra() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Obra publicada com sucesso!");
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-6 lg:p-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <span className="text-artBlue font-bold tracking-widest uppercase text-xs mb-2 block">
              Novo Registro
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
              Publicar <br />
              <span className="italic text-artPurple">Obra de Arte.</span>
            </h1>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-10 lg:gap-14"
          >
            <div className="lg:w-7/12">
              <label className="group relative flex flex-col items-center justify-center w-full h-[420px] border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white hover:bg-gray-50 hover:border-artBlue transition-all cursor-pointer overflow-hidden">
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
            </div>

            <div className="lg:w-5/12 space-y-7">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-3">
                  Legenda da Obra
                </label>

                <textarea
                  rows="4"
                  placeholder="O que inspirou esta criação?"
                  className="w-full bg-white border-b-2 border-gray-100 p-4 focus:border-artBlue outline-none transition-colors resize-none rounded-t-xl"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-3">
                  Categoria
                </label>

                <select
                  defaultValue=""
                  className="w-full bg-white border-b-2 border-gray-100 py-4 px-2 focus:border-artBlue outline-none appearance-none cursor-pointer"
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
                </select>
              </div>

              <div className="bg-artBlue/5 p-6 rounded-3xl border border-artBlue/10">
                <h4 className="text-xs font-bold uppercase mb-2">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  Dica de Portfólio
                </h4>

                <p className="text-sm text-gray-500 leading-relaxed">
                  Obras com legendas detalhadas ajudam o público a entender
                  melhor sua criação e aumentam o engajamento no portfólio.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-artDark text-white py-5 rounded-full font-bold hover:bg-artBlue transition-all shadow-xl shadow-black/10 flex items-center justify-center space-x-3 active:scale-95"
              >
                <span>Finalizar Publicação</span>
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