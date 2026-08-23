import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { obrasService } from "../services/api";
import { SETORES_ARTISTICOS } from "../constants/categories";

// Lista plana de todas as categorias individuais disponíveis
const CATEGORIAS_PLANAS = Array.from(
  new Set(SETORES_ARTISTICOS.flatMap((setor) => setor.subcategorias))
).filter(Boolean);

export default function ModalUploadObra({ isOpen = true, onClose, isPage = false }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState(["Ilustração Digital"]);
  const [buscaCategoria, setBuscaCategoria] = useState("");

  // Estados de arquivo e mídias
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [imagemPreview, setImagemPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // Estados de interface e requisição
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  if (!isOpen) return null;

  // Filtragem dinâmica de categorias pela busca
  const categoriasFiltradas = CATEGORIAS_PLANAS.filter((cat) =>
    cat.toLowerCase().includes(buscaCategoria.trim().toLowerCase())
  );

  const handleToggleCategoria = (catNome) => {
    setCategoriasSelecionadas((prev) => {
      if (prev.includes(catNome)) {
        if (prev.length === 1) return prev; // Mantém ao menos uma categoria selecionada
        return prev.filter((c) => c !== catNome);
      } else {
        return [...prev, catNome];
      }
    });
  };

  const processarArquivo = (file) => {
    if (!file) return;

    // Validar tipo de arquivo
    const tiposValidos = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!tiposValidos.includes(file.type.toLowerCase())) {
      setMensagemErro("Formato não suportado. Por favor, envie imagens JPEG, PNG ou WEBP.");
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMensagemErro("O arquivo selecionado excede o limite máximo de 10MB.");
      return;
    }

    setMensagemErro("");
    setArquivoSelecionado(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processarArquivo(file);
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
      processarArquivo(files[0]);
    }
  };

  const handleRemoverImagem = () => {
    setImagemPreview("");
    setArquivoSelecionado(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    if (!arquivoSelecionado && !imagemPreview) {
      setMensagemErro("Por favor, selecione uma arte para publicar.");
      return;
    }

    if (categoriasSelecionadas.length === 0) {
      setMensagemErro("Selecione ao menos uma categoria para sua obra.");
      return;
    }

    setLoading(true);

    try {
      let urlFinal = imagemPreview;

      // Realiza upload para o Cloudinary se houver um arquivo físico selecionado
      if (arquivoSelecionado) {
        const uploadRes = await obrasService.uploadImagem(arquivoSelecionado);
        urlFinal = uploadRes.url;
      }

      // Monta legenda combinando título e descrição caso fornecidos
      let legendaMontada = titulo.trim();
      if (descricao.trim()) {
        legendaMontada = legendaMontada
          ? `${legendaMontada}\n\n${descricao.trim()}`
          : descricao.trim();
      }

      const payload = {
        legenda: legendaMontada || undefined,
        nomesCategorias: categoriasSelecionadas,
        arquivoUrl: urlFinal,
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
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/10 overflow-hidden w-full max-w-5xl mx-auto my-auto relative transition-all">
      {/* Cabeçalho do Card */}
      <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <div>
          <span className="text-artOrange font-extrabold tracking-widest uppercase text-[10px] block mb-0.5">
            Artfolio Creator
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-artDark tracking-tight">
            Publicar Nova Obra
          </h2>
        </div>

        <button
          type="button"
          onClick={handleFecharOuVoltar}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-artDark flex items-center justify-center transition-colors text-sm font-bold shadow-sm"
          title="Fechar"
        >
          ✕
        </button>
      </div>

      {/* Alertas de Feedback */}
      {mensagemErro && (
        <div className="mx-6 sm:mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5">
          <i className="fa-solid fa-circle-exclamation text-sm"></i>
          <span>{mensagemErro}</span>
        </div>
      )}

      {mensagemSucesso && (
        <div className="mx-6 sm:mx-8 mt-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5">
          <i className="fa-solid fa-circle-check text-sm"></i>
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Formulário em 2 Colunas */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: Área de Mídia / Upload */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
            Arte Visual / Mídia
          </label>

          {!imagemPreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 min-h-[340px] border-2 border-dashed rounded-[2rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-artOrange bg-artOrange/5 scale-[1.01]"
                  : "border-gray-200 hover:border-artOrange/60 hover:bg-orange-50/30"
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-100/70 text-artOrange flex items-center justify-center text-2xl mb-4 shadow-sm">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>

              <p className="font-bold text-sm text-artDark max-w-[220px] leading-snug">
                Arraste e solte sua arte ou <span className="text-artOrange underline underline-offset-2">Selecione o arquivo</span>
              </p>

              <span className="text-[11px] text-gray-400 font-medium mt-3 bg-gray-100 px-3 py-1 rounded-full">
                JPEG, PNG, WEBP | Máx 10MB
              </span>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="relative rounded-[2rem] overflow-hidden border border-gray-200 bg-gray-50 shadow-inner group min-h-[300px] flex items-center justify-center">
                <img
                  src={imagemPreview}
                  alt="Prévia da Obra"
                  className="w-full h-full max-h-[380px] object-contain transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={handleRemoverImagem}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  title="Remover Imagem"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>

              {/* Informações da imagem e Ações secundárias */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200/70 rounded-2xl p-3 text-xs">
                <div className="truncate pr-2">
                  <span className="font-bold text-artDark block truncate">
                    {arquivoSelecionado ? arquivoSelecionado.name : "imagem_carregada.png"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {arquivoSelecionado
                      ? `${(arquivoSelecionado.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Pronta para publicação"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-gray-200 text-gray-700 hover:text-artOrange hover:border-artOrange px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors whitespace-nowrap shadow-sm"
                >
                  Trocar
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: Dados da Publicação */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Título da Obra */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Título da Obra / Legenda
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Sonho Neon em Cyberpunk 2077"
                className="w-full bg-gray-50 border border-gray-200 focus:border-artOrange focus:bg-white rounded-2xl px-4 py-3 text-sm text-artDark font-medium outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Descrição / Processo Criativo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Descrição & Processo Criativo
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte sobre os softwares, técnicas, inspirações ou paleta utilizada..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 focus:border-artOrange focus:bg-white rounded-2xl p-4 text-sm text-artDark outline-none transition-all placeholder:text-gray-400 resize-none font-light leading-relaxed"
              />
            </div>

            {/* Categorias & Tags em Pílulas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                  Categorias & Tags
                </label>
                <span className="text-[11px] font-extrabold text-artOrange bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/50">
                  {categoriasSelecionadas.length} selecionada(s)
                </span>
              </div>

              {/* Campo de Busca Rápida de Tags */}
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input
                  type="text"
                  value={buscaCategoria}
                  onChange={(e) => setBuscaCategoria(e.target.value)}
                  placeholder="Buscar categoria ou tag..."
                  className="w-full bg-gray-50 border border-gray-200 focus:border-artOrange focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs text-artDark font-medium outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Pílulas Fluidas de Categorias */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 py-1 scrollbar-thin scrollbar-thumb-gray-200">
                {categoriasFiltradas.length > 0 ? (
                  categoriasFiltradas.map((cat) => {
                    const isSelected = categoriasSelecionadas.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleToggleCategoria(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-artOrange text-white shadow-md shadow-artOrange/20 scale-[1.02]"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200/60"
                        }`}
                      >
                        <span>#{cat}</span>
                        {isSelected && <i className="fa-solid fa-check text-[10px]"></i>}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 italic py-2">
                    Nenhuma categoria encontrada para "{buscaCategoria}".
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleFecharOuVoltar}
              className="px-6 py-3.5 rounded-2xl text-xs font-bold text-gray-500 hover:text-artDark hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading || (!imagemPreview && !arquivoSelecionado)}
              className="bg-artOrange hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xl shadow-artOrange/25 hover:shadow-artOrange/40 transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Publicar Obra</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );

  if (isPage) {
    return cardContent;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      {cardContent}
    </div>
  );
}
