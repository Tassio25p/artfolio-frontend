import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService, authService, getMediaUrl } from "../services/api";

const categoriasDisponiveis = [
  { id: 1, nome: "Pintura Digital", icone: "fa-solid fa-paintbrush" },
  { id: 2, nome: "Ilustração", icone: "fa-solid fa-pen-nib" },
  { id: 3, nome: "Modelagem 3D", icone: "fa-solid fa-cube" },
  { id: 4, nome: "Arte Têxtil", icone: "fa-solid fa-rug" },
  { id: 5, nome: "Artesanato", icone: "fa-solid fa-hands" },
  { id: 6, nome: "Design Gráfico", icone: "fa-solid fa-bezier-curve" },
  { id: 7, nome: "Arte Conceitual", icone: "fa-solid fa-wand-magic-sparkles" },
  { id: 8, nome: "Fotografia", icone: "fa-solid fa-camera" },
];

export default function OnboardingPerfil() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [biografia, setBiografia] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [behance, setBehance] = useState("");
  const [website, setWebsite] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  useEffect(() => {
    if (user?.biografia) setBiografia(user.biografia);
    if (user?.portfolio) setPortfolio(user.portfolio);
    if (user?.instagram) setInstagram(user.instagram);
    if (user?.behance) setBehance(user.behance);
    if (user?.website) setWebsite(user.website);
    if (user?.fotoPerfil) setFotoPreview(getMediaUrl(user.fotoPerfil));
  }, [user]);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  const handleToggleCategoria = (nomeCat) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(nomeCat)
        ? prev.filter((item) => item !== nomeCat)
        : [...prev, nomeCat]
    );
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      mostrarAviso("Selecione um arquivo de imagem válido (JPG, PNG, WEBP).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      mostrarAviso("A imagem não pode ultrapassar 5 MB.", "error");
      return;
    }

    setFotoPerfil(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Atualizar dados textuais do perfil
      await usuarioService.atualizarPerfil({
        biografia: biografia || null,
        portfolio: portfolio || null,
        instagram: instagram || null,
        behance: behance || null,
        website: website || null,
      });

      // 2. Se houver foto selecionada, fazer upload
      if (fotoPerfil) {
        await usuarioService.uploadFotoPerfil(fotoPerfil);
      }

      await refreshUser();
      mostrarAviso("Perfil configurado com sucesso! Entrando no feed...", "success");
      
      setTimeout(() => {
        navigate("/feed", { replace: true });
      }, 1200);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao salvar perfil. Tente novamente.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased py-10 px-4">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="font-editorial text-3xl font-black text-artOrange inline-block mb-3"
          >
            Artfolio
          </Link>

          <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
            Bem-vindo(a) à comunidade
          </span>

          <h1 className="font-editorial text-4xl lg:text-5xl leading-tight">
            Personalize seu perfil de <span className="italic text-artOrange">Artista.</span>
          </h1>

          <p className="text-sm text-gray-500 max-w-lg mx-auto mt-3 leading-relaxed font-light">
            Deixe sua vitrine artística atraente para quem visita o Artfolio. Você poderá atualizar essas informações a qualquer momento.
          </p>
        </div>

        {noticeMessage && (
          <div
            className={`rounded-[1.3rem] px-5 py-3.5 mb-6 text-xs font-bold leading-relaxed border ${
              noticeType === "error"
                ? "bg-red-50 text-red-600 border-red-200"
                : noticeType === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-artOrange/10 text-artOrange border-artOrange/10"
            }`}
          >
            <i className="fa-solid fa-circle-info mr-2"></i>
            {noticeMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-black/5 shadow-xl shadow-black/5 space-y-8">
          {/* Seção 1: Foto de Perfil */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-black/5">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-artPurple/10 border-2 border-artPurple/20 overflow-hidden flex items-center justify-center shadow-md">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-user text-4xl text-artPurple/40"></i>
                )}
              </div>

              <label
                htmlFor="upload-foto"
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-artOrange text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-transform"
                title="Alterar foto"
              >
                <i className="fa-solid fa-camera text-xs"></i>
              </label>

              <input
                id="upload-foto"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-bold text-base">Foto de Perfil</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-sm">
                Envie uma foto ou logotipo artístico em alta resolução (JPG, PNG ou WEBP, até 5 MB).
              </p>
            </div>
          </div>

          {/* Seção 2: Biografia */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Biografia / Apresentação Artística
            </label>
            <textarea
              rows="3"
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder="Conte um pouco sobre sua trajetória, estilo artístico, ferramentas favoritas ou inspirações..."
              className="w-full bg-[#F9F8F6] rounded-2xl p-4 outline-none focus:ring-2 ring-artOrange/20 text-sm resize-none"
            />
          </div>

          {/* Seção 3: Categorias de Interesse */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Suas Áreas e Estilos de Atuação
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categoriasDisponiveis.map((cat) => {
                const selecionada = categoriasSelecionadas.includes(cat.nome);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleCategoria(cat.nome)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all text-xs font-bold ${
                      selecionada
                        ? "bg-artOrange text-white border-artOrange shadow-md shadow-artOrange/20"
                        : "bg-[#F9F8F6] text-artDark border-black/5 hover:bg-white"
                    }`}
                  >
                    <i className={cat.icone}></i>
                    <span>{cat.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção 4: Portfólio / Certificados e Redes Sociais */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Links, Certificados e Redes Sociais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Portfólio / Certificados Externos
                </label>
                <div className="relative">
                  <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://seuportfolio.com"
                    className="w-full bg-[#F9F8F6] rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Instagram
                </label>
                <div className="relative">
                  <i className="fa-brands fa-instagram absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@seu.usuario"
                    className="w-full bg-[#F9F8F6] rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Behance
                </label>
                <div className="relative">
                  <i className="fa-brands fa-behance absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    type="text"
                    value={behance}
                    onChange={(e) => setBehance(e.target.value)}
                    placeholder="behance.net/usuario"
                    className="w-full bg-[#F9F8F6] rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Website Pessoal
                </label>
                <div className="relative">
                  <i className="fa-solid fa-globe absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://meusite.com"
                    className="w-full bg-[#F9F8F6] rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/feed"
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artDark transition-colors"
            >
              Preencher depois e ir para o Feed <i className="fa-solid fa-arrow-right ml-1"></i>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-artDark text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Salvando...
                </>
              ) : (
                <>
                  Concluir Perfil e Começar <i className="fa-solid fa-check"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
