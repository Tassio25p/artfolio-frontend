import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { obrasService, planosService } from "../services/api";
import { SETORES_ARTISTICOS, getEstiloCategoria } from "../constants/categories";

// Lista plana de todas as categorias individuais disponíveis
const CATEGORIAS_PLANAS = Array.from(
  new Set(SETORES_ARTISTICOS.flatMap((setor) => setor.subcategorias))
).filter(Boolean);

export default function ModalUploadObra({ isOpen = true, onClose, isPage = false }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Plano do usuário ativo
  const [meuPlano, setMeuPlano] = useState(null);

  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [setorFiltro, setSetorFiltro] = useState("todas");

  // Estados de arquivo e mídias (suporte a carrossel Pro/Boost)
  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
  const [imagensPreviews, setImagensPreviews] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  // Estados de interface e requisição
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    const carregarPlano = async () => {
      try {
        const plano = await planosService.obterMeuPlano();
        setMeuPlano(plano);
      } catch {
        setMeuPlano({ tipo: "Free" });
      }
    };
    carregarPlano();
  }, []);

  if (!isOpen) return null;

  const isProOuBoost =
    meuPlano?.tipo?.toLowerCase() === "pro" || meuPlano?.tipo?.toLowerCase() === "boost";

  // Setor selecionado no modal
  const setorAtivoModal = SETORES_ARTISTICOS.find((s) => s.id === setorFiltro);

  // Filtragem dinâmica de categorias (alinhada 100% com Feed e Busca)
  const categoriasFiltradas = (() => {
    if (buscaCategoria.trim()) {
      const termo = buscaCategoria.trim().toLowerCase();
      const todas = [
        ...SETORES_ARTISTICOS.filter((s) => s.id !== "todas").map((s) => s.nome),
        ...CATEGORIAS_PLANAS,
      ];
      return Array.from(new Set(todas)).filter((c) => c.toLowerCase().includes(termo));
    }

    if (setorFiltro === "todas" || !setorAtivoModal) {
      return CATEGORIAS_PLANAS;
    }

    return [setorAtivoModal.nome, ...(setorAtivoModal.subcategorias || [])];
  })();

  const handleToggleCategoria = (catNome) => {
    setCategoriasSelecionadas((prev) => {
      if (prev.includes(catNome)) {
        return prev.filter((c) => c !== catNome);
      } else {
        return [...prev, catNome];
      }
    });
  };

  const processarArquivos = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);

    // Validação de limite de 1 página para o plano Free
    if (!isProOuBoost && filesArray.length > 1) {
      setMensagemErro(
        "Seu plano atual é Free (1 página por obra). Faça upgrade para o Artfolio Pro ou Boost para publicar carrosséis com múltiplas páginas sem perda de qualidade!"
      );
      return;
    }

    if (filesArray.length > 10) {
      setMensagemErro("O limite máximo para uma publicação em carrossel é de 10 arquivos.");
      return;
    }

    const tiposValidos = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    for (const file of filesArray) {
      if (!tiposValidos.includes(file.type.toLowerCase())) {
        setMensagemErro("Formato não suportado. Por favor, envie imagens JPEG, PNG ou WEBP.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setMensagemErro(`O arquivo ${file.name} excede o limite máximo permitido de 15MB.`);
        return;
      }
    }

    setMensagemErro("");
    setArquivosSelecionados(filesArray);
    setSlideAtual(0);

    // Gerar prévias das imagens
    const previewsNovos = [];
    let carregados = 0;
    filesArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewsNovos[index] = reader.result;
        carregados++;
        if (carregados === filesArray.length) {
          setImagensPreviews([...previewsNovos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    processarArquivos(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processarArquivos(files);
    }
  };

  const handleRemoverImagem = (indexParaRemover) => {
    const novosArquivos = arquivosSelecionados.filter((_, idx) => idx !== indexParaRemover);
    const novasPreviews = imagensPreviews.filter((_, idx) => idx !== indexParaRemover);
    setArquivosSelecionados(novosArquivos);
    setImagensPreviews(novasPreviews);
    setSlideAtual((prev) => Math.max(0, Math.min(prev, novosArquivos.length - 1)));
    if (novosArquivos.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    if (arquivosSelecionados.length === 0 && imagensPreviews.length === 0) {
      setMensagemErro("Por favor, selecione ao menos uma arte para publicar.");
      return;
    }

    if (categoriasSelecionadas.length === 0) {
      setMensagemErro("Selecione ao menos uma categoria para sua obra.");
      return;
    }

    setLoading(true);

    try {
      // Upload dos arquivos preservando 100% da resolução original
      const urlsUpload = [];
      for (const file of arquivosSelecionados) {
        const uploadRes = await obrasService.uploadImagem(file);
        urlsUpload.push(uploadRes.url);
      }

      // Monta legenda combinando título e descrição
      let legendaMontada = titulo.trim();
      if (descricao.trim()) {
        legendaMontada = legendaMontada
          ? `${legendaMontada}\n\n${descricao.trim()}`
          : descricao.trim();
      }

      const payload = {
        legenda: legendaMontada || undefined,
        nomesCategorias: categoriasSelecionadas,
        arquivoUrl: urlsUpload[0] || imagensPreviews[0],
        arquivos: urlsUpload.length > 1 ? urlsUpload : undefined,
      };

      const novaObra = await obrasService.criarObra(payload);
      setMensagemSucesso("Obra publicada com sucesso! Redirecionando...");

      setTimeout(() => {
        if (onClose) onClose();
        if (novaObra && novaObra.id) {
          navigate(`/obra/${novaObra.id}`);
        } else {
          navigate("/meu-portfolio");
        }
      }, 1200);
    } catch (err) {
      console.error("Erro ao publicar obra:", err);
      setMensagemErro(err.message || "Falha ao publicar a obra. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFecharOuVoltar = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const cardContent = (
    <div className="bg-[#FCFBF9]/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-black/10 shadow-2xl shadow-black/15 overflow-hidden w-full max-w-5xl mx-auto my-auto relative transition-all text-artDark">
      {/* Barra de Acento Arquitetural Oficial (Gradiente Tricolor) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-artPurple via-artOrange to-artBlue"></div>

      {/* Luz Difusa Arquitetural (Acentos sutis) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-artPurple/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-artOrange/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Cabeçalho do Card */}
      <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-black/5 flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block">
              Compartilhe sua arte
            </span>
            {isProOuBoost ? (
              <span className="bg-artPurple/10 text-artPurple border border-artPurple/25 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <i className="fa-solid fa-layer-group text-[8px]"></i>
                Carrossel Liberado
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-300/60 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
                Plano Free
              </span>
            )}
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-artDark font-bold tracking-tight leading-none">
            Nova Publicação
          </h2>
        </div>

        <button
          type="button"
          onClick={handleFecharOuVoltar}
          className="w-10 h-10 rounded-full bg-white border border-black/10 text-gray-500 hover:text-artDark hover:bg-gray-100 transition-all flex items-center justify-center text-sm shadow-xs"
          title="Fechar"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 relative z-10">
        {/* Mensagens de Feedback */}
        {mensagemErro && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in backdrop-blur-sm shadow-xs">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-sm shrink-0 text-amber-600"></i>
              <span>{mensagemErro}</span>
            </div>
            {!isProOuBoost && mensagemErro.includes("Free") && (
              <Link
                to="/planos"
                className="shrink-0 bg-artPurple text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-sm"
              >
                Conhecer Planos →
              </Link>
            )}
          </div>
        )}

        {mensagemSucesso && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in backdrop-blur-sm shadow-xs">
            <i className="fa-solid fa-circle-check text-sm text-emerald-600"></i>
            <span>{mensagemSucesso}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUNA ESQUERDA: Upload e Preview com Carrossel */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-artOrange/10 text-artOrange flex items-center justify-center text-[10px]">
                  <i className="fa-solid fa-image"></i>
                </span>
                <span>Arquivo da Obra</span>
              </label>
              {isProOuBoost && (
                <span className="text-[10px] text-artPurple font-bold">Carrossel Ativo</span>
              )}
            </div>

            {imagensPreviews.length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group flex-1 min-h-[380px] border-2 border-dashed rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-artPurple bg-artPurple/10 scale-[1.01] shadow-xl shadow-artPurple/15"
                    : "border-artPurple/35 bg-gradient-to-b from-artPurple/[0.06] via-[#FCFBF9] to-artOrange/[0.06] hover:border-artPurple hover:shadow-xl hover:shadow-artPurple/10"
                }`}
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-artPurple/20 via-artOrange/20 to-artBlue/20 border-2 border-white shadow-md text-artPurple group-hover:text-artOrange flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-all duration-300">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>

                <h3 className="font-editorial text-2xl text-artDark font-bold mb-1.5 leading-snug">
                  Solte sua arte aqui
                </h3>

                <p className="text-xs text-gray-500 max-w-[240px] leading-relaxed">
                  Arraste seu arquivo ou{" "}
                  <span className="text-artOrange font-bold underline underline-offset-4 decoration-artOrange/40 group-hover:decoration-artOrange group-hover:text-artPurple transition-all">
                    Selecione no dispositivo
                  </span>
                </p>

                <div className="mt-5 inline-flex items-center gap-2 bg-white/95 border border-artPurple/20 text-gray-600 font-bold px-4 py-1.5 rounded-full shadow-xs text-[11px]">
                  <i className="fa-solid fa-wand-magic-sparkles text-artOrange text-xs"></i>
                  <span>JPEG, PNG, WEBP • 100% Original</span>
                </div>

                <p className="text-[10px] text-gray-400 mt-3">
                  {isProOuBoost
                    ? "Carrossel de até 10 imagens liberado"
                    : "Resolução original preservada"}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={isProOuBoost}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-3">
                {/* Palco da Prévia com Navegação de Slides caso Carrossel */}
                <div className="relative rounded-[2rem] overflow-hidden border border-black/10 bg-artDark shadow-inner group min-h-[320px] max-h-[400px] flex items-center justify-center">
                  <img
                    src={imagensPreviews[slideAtual]}
                    alt={`Prévia ${slideAtual + 1}`}
                    className="w-full h-full max-h-[380px] object-contain transition-all duration-300"
                  />

                  {/* Controles de Slide se tiver mais de 1 imagem */}
                  {imagensPreviews.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideAtual((prev) =>
                            prev === 0 ? imagensPreviews.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center text-xs transition-all shadow-md border border-white/10"
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideAtual((prev) =>
                            prev === imagensPreviews.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center text-xs transition-all shadow-md border border-white/10"
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>

                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        {slideAtual + 1} / {imagensPreviews.length}
                      </span>
                    </>
                  )}

                  {/* Botão de Remover o Slide Atual (sem vermelho, usando artOrange) */}
                  <button
                    type="button"
                    onClick={() => handleRemoverImagem(slideAtual)}
                    className="absolute top-3 right-3 bg-artOrange hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    title="Remover Imagem Atual"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>

                {/* Miniaturas dos Slides */}
                {imagensPreviews.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                    {imagensPreviews.map((preview, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSlideAtual(idx)}
                        className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          idx === slideAtual
                            ? "border-artPurple scale-105 shadow-md shadow-artPurple/30"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={preview} alt="Miniatura" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Informações da imagem e Troca */}
                <div className="flex items-center justify-between bg-white border border-black/10 rounded-2xl p-3 text-xs shadow-2xs backdrop-blur-sm">
                  <div className="truncate pr-2">
                    <span className="font-bold text-artDark block truncate">
                      {arquivosSelecionados[slideAtual]?.name || "imagem.png"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {arquivosSelecionados.length > 1
                        ? `Carrossel com ${arquivosSelecionados.length} imagens`
                        : `${((arquivosSelecionados[0]?.size || 0) / (1024 * 1024)).toFixed(2)} MB`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#F9F8F6] border border-black/10 text-artDark hover:text-artOrange hover:border-artOrange/40 px-3.5 py-1.5 rounded-xl font-bold text-[11px] transition-all whitespace-nowrap shadow-2xs"
                  >
                    {isProOuBoost ? "Adicionar/Trocar" : "Trocar Imagem"}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={isProOuBoost}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: Dados da Publicação com Painel Arquitetural Colorido */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-gradient-to-br from-white/95 via-purple-50/40 to-orange-50/40 p-5 sm:p-7 rounded-[2rem] border-2 border-artPurple/15 shadow-sm space-y-5 relative overflow-hidden backdrop-blur-md">
              {/* Orbes de Luz Difusa Decorativa no Card */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-artPurple/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-artOrange/15 rounded-full blur-2xl pointer-events-none"></div>

              {/* Barra de Subtítulo do Painel */}
              <div className="flex items-center justify-between border-b border-artPurple/10 pb-3 relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-artPurple flex items-center gap-2">
                  <i className="fa-solid fa-sliders text-xs"></i> Detalhes & Categorização
                </span>
                <span className="text-[10px] font-bold text-artOrange bg-artOrange/10 border border-artOrange/25 px-3 py-0.5 rounded-full">
                  Curadoria Artística
                </span>
              </div>

              {/* Título da Obra */}
              <div className="bg-white/90 border border-artPurple/20 hover:border-artPurple/40 focus-within:border-artPurple focus-within:ring-4 focus-within:ring-artPurple/10 rounded-2xl p-3.5 shadow-2xs transition-all relative z-10">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-lg bg-artPurple/15 text-artPurple flex items-center justify-center text-[10px] shadow-2xs">
                    <i className="fa-solid fa-paintbrush"></i>
                  </span>
                  <span>
                    Título da Obra <span className="text-gray-400 font-normal lowercase">(opcional)</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Dê um nome marcante à sua criação..."
                  maxLength={100}
                  className="w-full bg-artPurple/[0.02] border border-artPurple/15 rounded-xl px-3.5 py-2.5 text-sm font-medium text-artDark placeholder:text-gray-400 focus:bg-white focus:border-artPurple outline-none transition-all"
                />
              </div>

              {/* Descrição / Legenda */}
              <div className="bg-white/90 border border-artOrange/20 hover:border-artOrange/40 focus-within:border-artOrange focus-within:ring-4 focus-within:ring-artOrange/10 rounded-2xl p-3.5 shadow-2xs transition-all relative z-10">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-lg bg-artOrange/15 text-artOrange flex items-center justify-center text-[10px] shadow-2xs">
                    <i className="fa-solid fa-feather"></i>
                  </span>
                  <span>História, Conceito ou Técnica</span>
                </label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Conte um pouco sobre as inspirações, ferramentas ou conceitos desta obra..."
                  className="w-full bg-artOrange/[0.02] border border-artOrange/15 rounded-xl p-3 text-sm font-medium text-artDark placeholder:text-gray-400 focus:bg-white focus:border-artOrange outline-none resize-none leading-relaxed transition-all"
                />
              </div>

              {/* Categorias */}
              <div className="bg-white/90 border border-artBlue/25 rounded-2xl p-4 shadow-2xs transition-all relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-artBlue/15 text-artBlue flex items-center justify-center text-[10px] shadow-2xs">
                      <i className="fa-solid fa-swatchbook"></i>
                    </span>
                    <span>Categorias Selecionadas ({categoriasSelecionadas.length})</span>
                  </label>
                  {categoriasSelecionadas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCategoriasSelecionadas([])}
                      className="text-[10px] font-bold text-gray-400 hover:text-artOrange transition-colors"
                    >
                      Limpar todas
                    </button>
                  )}
                </div>

                {categoriasSelecionadas.length === 0 ? (
                  <p className="text-xs text-gray-400 italic mb-3 flex items-center gap-1.5 py-1">
                    <i className="fa-solid fa-circle-info text-artBlue text-xs"></i>
                    Nenhuma categoria selecionada. Clique nas opções abaixo para adicionar.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                    {categoriasSelecionadas.map((cat) => (
                      <span
                        key={cat}
                        className="bg-gradient-to-r from-artPurple via-artOrange to-artBlue text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-sm shadow-artPurple/25 hover:shadow-md transition-all animate-fade-in"
                      >
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCategoria(cat)}
                          className="hover:text-amber-200 hover:scale-125 transition-transform"
                          title="Remover Categoria"
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Busca e Lista de Categorias com Setores Artísticos */}
                <div className="bg-[#F9F8F6]/90 border border-artBlue/15 rounded-xl p-3 shadow-inner">
                  {/* Pílulas dos Setores Artísticos (Alinhado com Feed e Busca) */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-2">
                    {SETORES_ARTISTICOS.map((setor) => {
                      const isSelected = setorFiltro === setor.id;
                      return (
                        <button
                          key={setor.id}
                          type="button"
                          onClick={() => {
                            setSetorFiltro(setor.id);
                            setBuscaCategoria("");
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 border ${
                            isSelected
                              ? `${setor.corBg} border-transparent shadow-xs scale-105`
                              : "bg-white text-gray-600 border-black/5 hover:bg-gray-100"
                          }`}
                        >
                          <i className={`${setor.icone} text-[8px]`}></i>
                          <span>{setor.nome.replace("Artes ", "")}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Campo de Busca */}
                  <div className="relative mb-2">
                    <i className="fa-solid fa-magnifying-glass text-xs text-artBlue absolute left-3 top-1/2 -translate-y-1/2"></i>
                    <input
                      type="text"
                      value={buscaCategoria}
                      onChange={(e) => setBuscaCategoria(e.target.value)}
                      placeholder="Filtrar categorias ou subcategorias..."
                      className="w-full bg-white border border-artBlue/20 rounded-xl pl-9 pr-3 py-2 text-xs text-artDark placeholder:text-gray-400 focus:ring-2 focus:ring-artBlue/30 transition-all outline-none"
                    />
                  </div>

                  {/* Pílulas de Categorias Disponíveis */}
                  <div className="max-h-36 overflow-y-auto flex flex-wrap gap-1.5 no-scrollbar p-1">
                    {categoriasFiltradas.slice(0, 40).map((cat) => {
                      const isSelected = categoriasSelecionadas.includes(cat);
                      const estilo = getEstiloCategoria(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleToggleCategoria(cat)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border ${
                            isSelected
                              ? "bg-gradient-to-r from-artPurple via-artOrange to-artBlue text-white border-transparent shadow-xs font-bold scale-105"
                              : "bg-white text-gray-700 border-black/5 hover:border-artPurple/40 hover:bg-artPurple/10 hover:text-artPurple"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Finais */}
            <div className="pt-6 mt-4 border-t border-black/5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleFecharOuVoltar}
                disabled={loading}
                className="px-6 py-3.5 rounded-full text-xs font-bold text-gray-500 hover:text-artDark hover:bg-black/5 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-artDark hover:bg-gradient-to-r hover:from-artPurple hover:via-artOrange hover:to-artBlue text-white px-9 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-artDark/15 hover:shadow-artOrange/30 hover:scale-105 flex items-center gap-2.5 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Publicando em alta qualidade...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-up-from-bracket text-sm"></i>
                    <span>Publicar Obra</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  if (isPage) {
    return (
      <div className="w-full max-w-5xl mx-auto py-2">
        {cardContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {cardContent}
    </div>
  );
}
