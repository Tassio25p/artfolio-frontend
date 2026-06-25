import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const categorias = [
  { value: "pintura-digital", label: "Pintura Digital" },
  { value: "modelagem-3d", label: "Modelagem 3D" },
  { value: "artesanato-croche", label: "Artesanato / Crochê" },
  { value: "desenho-manual", label: "Desenho Manual" },
  { value: "ilustracao", label: "Ilustração" },
  { value: "arte-conceitual", label: "Arte Conceitual" },
];

function CriarObra() {
  const [titulo, setTitulo] = useState("");
  const [legenda, setLegenda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const categoriaSelecionada = categorias.find(
    (item) => item.value === categoria
  );

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImagePreview(null);
      setNomeArquivo("");
      mostrarAviso("Selecione apenas arquivos de imagem.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setNomeArquivo(file.name);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!imagePreview) {
      mostrarAviso("Anexe uma imagem antes de preparar o envio da obra.");
      return;
    }

    mostrarAviso(
      "Com o backend integrado, esta obra será enviada para a quarentena com status Pendente."
    );
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Área do Artista
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Enviar Obra <br />
                <span className="italic text-artPurple">para Análise.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-4 max-w-2xl leading-relaxed">
                Antes de aparecer no Feed e no perfil público, a obra ficará com
                status pendente e seguirá para a área de quarentena, onde será
                analisada pela moderação.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/meu-portfolio"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-layer-group mr-2"></i>
                Meu Portfólio
              </Link>

              <span className="bg-artOrange/10 text-artOrange px-5 py-3 rounded-full text-xs font-bold text-center">
                <i className="fa-solid fa-clock mr-2"></i>
                Status inicial: Pendente
              </span>
            </div>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-8 lg:gap-10"
          >
            <div className="lg:w-7/12">
              <label className="group relative flex flex-col items-center justify-center w-full h-[300px] sm:h-[390px] lg:h-[470px] border-2 border-dashed border-gray-200 rounded-[2rem] sm:rounded-[2.3rem] bg-white hover:bg-gray-50 hover:border-artBlue transition-all cursor-pointer overflow-hidden">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview da obra"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                      <i className="fa-solid fa-rotate text-3xl mb-2"></i>

                      <p className="text-sm font-bold">
                        Clique para alterar a imagem
                      </p>

                      {nomeArquivo && (
                        <span className="text-[10px] mt-2 opacity-80">
                          {nomeArquivo}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-6">
                    <i className="fa-solid fa-cloud-arrow-up text-5xl text-gray-200 group-hover:text-artBlue transition-colors mb-4"></i>

                    <p className="text-sm text-gray-400 font-medium">
                      Selecione a imagem da sua obra ou{" "}
                      <span className="text-artBlue underline">
                        busque no computador
                      </span>
                    </p>

                    <p className="text-[10px] text-gray-300 uppercase mt-2">
                      JPG, PNG, WEBP ou GIF
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="mt-5 bg-artOrange/5 border border-artOrange/10 rounded-[1.7rem] p-5 flex gap-4">
                <div className="w-11 h-11 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                    Atenção aos direitos autorais
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed font-light">
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
                  value={titulo}
                  onChange={(event) => setTitulo(event.target.value)}
                  placeholder="Ex: Fragmentos de Vidro"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                  required
                />
              </div>

              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Descrição da Obra
                </label>

                <textarea
                  rows="4"
                  value={legenda}
                  onChange={(event) => setLegenda(event.target.value)}
                  placeholder="Explique o conceito, inspiração ou detalhes da criação."
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Categoria
                </label>

                <select
                  value={categoria}
                  onChange={(event) => setCategoria(event.target.value)}
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Selecione o tipo de arte
                  </option>

                  {categorias.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-artBlue/5 p-5 rounded-[1.7rem] border border-artBlue/10">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                  <i className="fa-solid fa-shield-halved mr-2"></i>
                  Processo de Moderação
                </h4>

                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Após o envio, sua obra ficará com status{" "}
                  <strong className="text-artDark font-bold">Pendente</strong> e
                  entrará na{" "}
                  <strong className="text-artDark font-bold">
                    área de quarentena
                  </strong>
                  . Apenas obras aprovadas pela moderação aparecem no Feed.
                </p>
              </div>

              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3">
                  Resumo do envio
                </h4>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Título</span>
                    <strong className="text-artDark text-right">
                      {titulo || "Não informado"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Categoria</span>
                    <strong className="text-artDark text-right">
                      {categoriaSelecionada?.label || "Não selecionada"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Imagem</span>
                    <strong className="text-artDark text-right">
                      {imagePreview ? "Anexada" : "Pendente"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Status</span>
                    <strong className="text-artOrange text-right">
                      Pendente
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[1.7rem] border border-black/5 p-5">
                <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 accent-artPurple"
                    required
                  />

                  <span className="text-xs leading-relaxed">
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

              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                O envio real da obra, upload da imagem e registro no PostgreSQL
                serão integrados futuramente com o backend FastAPI.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CriarObra;