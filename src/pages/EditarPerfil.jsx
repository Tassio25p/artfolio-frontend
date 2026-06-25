import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const categorias = [
  { value: "pintura-digital", label: "Pintura Digital" },
  { value: "modelagem-3d", label: "Modelagem 3D" },
  { value: "textil", label: "Têxtil" },
  { value: "artesanato", label: "Artesanato" },
  { value: "desenho", label: "Desenho Manual" },
  { value: "ilustracao", label: "Ilustração" },
  { value: "arte-conceitual", label: "Arte Conceitual" },
];

const perfilAtual = {
  nome: "Marina Silva",
  categoria: "pintura-digital",
  cidade: "São Paulo",
  estado: "SP",
  biografia:
    "Explorando a intersecção entre o artesanato têxtil e a modelagem 3D. Transformando sentimentos em formas tangíveis desde 2018.",
  instagram: "@marinasilva.art",
  behance: "behance.net/marinasilva",
  emailPublico: "contato@marinasilva.com",
  siteExterno: "marinasilva.com",
  imagem:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  seguidores: "1.2k",
  obras: 48,
  plano: "Pro",
};

function EditarPerfil() {
  const [nome, setNome] = useState(perfilAtual.nome);
  const [categoria, setCategoria] = useState(perfilAtual.categoria);
  const [cidade, setCidade] = useState(perfilAtual.cidade);
  const [estado, setEstado] = useState(perfilAtual.estado);
  const [biografia, setBiografia] = useState(perfilAtual.biografia);
  const [instagram, setInstagram] = useState(perfilAtual.instagram);
  const [behance, setBehance] = useState(perfilAtual.behance);
  const [emailPublico, setEmailPublico] = useState(perfilAtual.emailPublico);
  const [siteExterno, setSiteExterno] = useState(perfilAtual.siteExterno);
  const [imagePreview, setImagePreview] = useState(perfilAtual.imagem);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const tipoPerfil = "artista";
  const isArtista = tipoPerfil === "artista";

  const categoriaSelecionada = categorias.find(
    (item) => item.value === categoria
  );

  const nomeSeparado = nome.trim().split(" ");
  const primeiroNome = nomeSeparado[0] || "Perfil";
  const restanteNome = nomeSeparado.slice(1).join(" ");

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
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

    mostrarAviso(
      "Com o backend integrado, as alterações do perfil serão salvas no PostgreSQL."
    );
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                {isArtista ? "Configuração do Artista" : "Configuração da Conta"}
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Editar <span className="italic text-artOrange">Perfil.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Atualize suas informações públicas, ajuste sua biografia e
                personalize como outros usuários veem seu perfil no Artfolio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/perfil"
                className="bg-white border border-black/5 px-6 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-eye mr-2"></i>
                Ver Perfil
              </Link>

              <button
                type="submit"
                form="form-editar-perfil"
                className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                Salvar Alterações
              </button>
            </div>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <form
            id="form-editar-perfil"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <section className="lg:col-span-4">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-6 lg:sticky lg:top-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-[2.3rem] overflow-hidden border-4 border-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <label className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-artOrange text-white flex items-center justify-center shadow-lg border-4 border-white cursor-pointer hover:bg-artPurple transition-colors">
                      <i className="fa-solid fa-camera text-sm"></i>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {nomeArquivo && (
                    <span className="text-[10px] text-artBlue font-bold mb-3">
                      {nomeArquivo}
                    </span>
                  )}

                  <h2 className="font-editorial text-3xl leading-none">
                    {primeiroNome}{" "}
                    <span className="italic">
                      {restanteNome || "."}
                    </span>
                  </h2>

                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                    {isArtista ? "Artista Verificado" : "Perfil Artfolio"}
                  </p>

                  <div className="grid grid-cols-3 gap-3 w-full mt-6">
                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3">
                      <p className="text-lg font-black">
                        {perfilAtual.seguidores}
                      </p>

                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                        Seguidores
                      </span>
                    </div>

                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3">
                      <p className="text-lg font-black">{perfilAtual.obras}</p>

                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                        Obras
                      </span>
                    </div>

                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3">
                      <p className="text-lg font-black">{perfilAtual.plano}</p>

                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                        Plano
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-artPurple/5 border border-artPurple/10 rounded-[1.5rem] p-4 text-left">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">
                      Prévia pública
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      Essas informações aparecerão no seu perfil público e nas
                      obras publicadas no Feed, quando estiverem integradas ao
                      backend.
                    </p>
                  </div>

                  <div className="mt-4 bg-artBlue/5 border border-artBlue/10 rounded-[1.5rem] p-4 text-left">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">
                      Integração futura
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      A foto de perfil e os dados editados serão salvos
                      futuramente pelo backend com FastAPI e PostgreSQL.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-6">
                <h2 className="font-editorial text-3xl italic mb-6">
                  Informações principais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Nome artístico
                    </label>

                    <input
                      type="text"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Categoria principal
                    </label>

                    <select
                      value={categoria}
                      onChange={(event) => setCategoria(event.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    >
                      {categorias.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Cidade
                    </label>

                    <input
                      type="text"
                      value={cidade}
                      onChange={(event) => setCidade(event.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Estado
                    </label>

                    <input
                      type="text"
                      value={estado}
                      onChange={(event) => setEstado(event.target.value)}
                      maxLength="2"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm uppercase"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Biografia
                    </label>

                    <textarea
                      rows="4"
                      value={biografia}
                      onChange={(event) => setBiografia(event.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm resize-none leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-6">
                <h2 className="font-editorial text-3xl italic mb-6">
                  Links e contato
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Instagram
                    </label>

                    <div className="relative">
                      <i className="fa-brands fa-instagram absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>

                      <input
                        type="text"
                        value={instagram}
                        onChange={(event) => setInstagram(event.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Behance
                    </label>

                    <div className="relative">
                      <i className="fa-brands fa-behance absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>

                      <input
                        type="text"
                        value={behance}
                        onChange={(event) => setBehance(event.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      E-mail público
                    </label>

                    <div className="relative">
                      <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>

                      <input
                        type="email"
                        value={emailPublico}
                        onChange={(event) => setEmailPublico(event.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Site / Portfólio externo
                    </label>

                    <div className="relative">
                      <i className="fa-solid fa-link absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>

                      <input
                        type="text"
                        value={siteExterno}
                        onChange={(event) => setSiteExterno(event.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-6">
                <h2 className="font-editorial text-3xl italic mb-5">
                  Resumo do perfil
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Nome</span>
                    <strong className="text-artDark text-right">
                      {nome || "Não informado"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Categoria</span>
                    <strong className="text-artDark text-right">
                      {categoriaSelecionada?.label || "Não selecionada"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Localização</span>
                    <strong className="text-artDark text-right">
                      {cidade || "Cidade"} / {estado || "UF"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Tipo de perfil</span>
                    <strong className="text-artPurple text-right">
                      {isArtista ? "Artista" : "Cliente"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-artDark rounded-[2rem] p-5 sm:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden relative">
                <div className="relative z-10">
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                    Perfil profissional
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Destaque sua identidade artística.
                  </h2>

                  <p className="text-xs text-gray-400 mt-2 max-w-xl">
                    Um perfil completo aumenta a confiança de clientes,
                    colecionadores e outros artistas da comunidade.
                  </p>
                </div>

                <Link
                  to="/perfil"
                  className="relative z-10 bg-white text-artDark px-6 py-3 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all whitespace-nowrap active:scale-95 text-center"
                >
                  Ver Perfil
                </Link>

                <i className="fa-solid fa-wand-magic-sparkles absolute -right-8 -bottom-10 text-[8rem] text-white/5 rotate-12"></i>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditarPerfil;