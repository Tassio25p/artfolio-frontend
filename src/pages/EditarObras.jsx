import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ModalConfirmarExclusao from "../components/ModalConfirmarExclusao";
import { useAuth } from "../contexts/AuthContext";
import { obrasService, getMediaUrl } from "../services/api";
import { SETORES_ARTISTICOS } from "../constants/categories";

// Lista plana de todas as categorias individuais disponíveis
const CATEGORIAS_PLANAS = Array.from(
  new Set(SETORES_ARTISTICOS.flatMap((setor) => setor.subcategorias))
).filter(Boolean);

export default function EditarObra() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const { user: currentUser, isAuthenticated } = useAuth();

  // Estados do formulário
  const [legenda, setLegenda] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  
  // Estados de imagem e mídias
  const [imagemAtualUrl, setImagemAtualUrl] = useState("");
  const [novoArquivo, setNovoArquivo] = useState(null);
  const [imagemPreviewTemp, setImagemPreviewTemp] = useState("");

  // Estatísticas e metadados
  const [obraOriginal, setObraOriginal] = useState(null);
  const [isNotOwner, setIsNotOwner] = useState(false);

  // Estados de interface e feedback
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 4500);
  };

  // Carrega os dados reais da obra ao montar a página
  useEffect(() => {
    if (!id) return;

    async function carregarObra() {
      try {
        setLoadingInitial(true);
        const obra = await obrasService.obterObraPorId(id);

        if (!obra || !obra.id) {
          mostrarAviso("Obra não encontrada.", "error");
          return;
        }

        setObraOriginal(obra);
        setLegenda(obra.legenda || "");
        setImagemAtualUrl(obra.arquivoUrl || "");

        // Hidratação das categorias da obra
        if (obra.categorias && obra.categorias.length > 0) {
          setCategoriasSelecionadas(obra.categorias.map((c) => c.nomeCategoria));
        } else if (obra.categoria) {
          setCategoriasSelecionadas([obra.categoria.nomeCategoria]);
        } else {
          setCategoriasSelecionadas(["Ilustração Digital"]);
        }

        // Validação de autorização do proprietário
        if (currentUser && obra.usuario?.id && currentUser.id !== obra.usuario.id) {
          setIsNotOwner(true);
        }
      } catch (err) {
        console.error("Erro ao carregar obra para edição:", err);
        mostrarAviso(err.message || "Erro ao carregar dados da obra.", "error");
      } finally {
        setLoadingInitial(false);
      }
    }

    carregarObra();
  }, [id, currentUser]);

  // Filtragem dinâmica de categorias
  const categoriasFiltradas = CATEGORIAS_PLANAS.filter((cat) =>
    cat.toLowerCase().includes(buscaCategoria.trim().toLowerCase())
  );

  const handleToggleCategoria = (catNome) => {
    setCategoriasSelecionadas((prev) => {
      if (prev.includes(catNome)) {
        return prev.filter((c) => c !== catNome);
      } else {
        return [...prev, catNome];
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        mostrarAviso("A nova imagem excede o limite máximo de 10MB.", "error");
        return;
      }
      setNovoArquivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreviewTemp(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverNovaImagem = () => {
    setNovoArquivo(null);
    setImagemPreviewTemp("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNoticeMessage("");

    if (categoriasSelecionadas.length === 0) {
      mostrarAviso("Selecione ao menos uma categoria para a sua obra.", "error");
      return;
    }

    setSaving(true);

    try {
      let novaUrlImagem = undefined;

      // 1. Upload para o Cloudinary se o usuário selecionou uma nova imagem
      if (novoArquivo) {
        const uploadRes = await obrasService.uploadImagem(novoArquivo);
        novaUrlImagem = uploadRes.url;
      }

      // 2. Monta o payload de atualização
      const payload = {
        legenda: legenda.trim() || undefined,
        nomesCategorias: categoriasSelecionadas,
        ...(novaUrlImagem ? { arquivoUrl: novaUrlImagem } : {}),
      };

      // 3. Chamada PUT ao backend
      await obrasService.atualizarObra(id, payload);
      mostrarAviso("Obra atualizada com sucesso! Redirecionando...", "success");

      setTimeout(() => {
        navigate(`/obra/${id}`);
      }, 1200);
    } catch (err) {
      console.error("Erro ao atualizar obra:", err);
      mostrarAviso(err.message || "Erro ao salvar alterações da obra.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirConfirmado = async () => {
    setDeleting(true);
    try {
      await obrasService.deletarObra(id);
      mostrarAviso("Obra excluída com sucesso! Redirecionando...", "success");
      setTimeout(() => navigate("/meu-portfolio"), 1200);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao excluir a obra.", "error");
      setDeleting(false);
    }
  };

  const noticeStyles = {
    info: "bg-orange-50 text-artOrange border-orange-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-red-50 text-red-600 border-red-200",
  };

  // Skeleton de Carregamento Inicial
  if (loadingInitial) {
    return (
      <div className="w-full text-artDark antialiased font-sans">
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-[450px] bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="lg:col-span-7 h-[450px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Bloqueio de Acesso para Usuário não Proprietário
  if (isNotOwner) {
    return (
      <div className="w-full text-artDark antialiased font-sans">
        <div className="w-full min-h-screen flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-xl space-y-4">
            <i className="fa-solid fa-lock text-4xl text-red-500"></i>
            <h2 className="text-xl font-bold text-artDark">Acesso Restrito</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Você não possui permissão para editar esta obra. Apenas o autor da publicação pode alterar suas informações.
            </p>
            <Link
              to={`/obra/${id}`}
              className="inline-flex items-center justify-center bg-artDark text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-artOrange transition-all shadow-md"
            >
              Voltar para a Obra
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 pb-16">
        
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
          <div>
            <span className="text-artOrange font-extrabold tracking-widest uppercase text-[10px] block mb-0.5">
              Gerenciamento de Obra
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-artDark tracking-tight">
              Editar Publicação
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/obra/${id}`}
              className="bg-white border border-gray-200 text-gray-700 hover:text-artDark hover:border-gray-400 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left text-[11px]"></i>
              <span>Cancelar</span>
            </Link>

            <button
              type="submit"
              form="form-editar-obra"
              disabled={saving}
              className="bg-artOrange hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-artOrange/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alerta de Feedback */}
        {noticeMessage && (
          <div className={`${noticeStyles[noticeType]} border rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-xs animate-fade-in`}>
            <i className="fa-solid fa-circle-info text-sm"></i>
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Formulario em 2 Colunas */}
        <form id="form-editar-obra" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUNA ESQUERDA: Prévia da Mídia & Substituição */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                Imagem da Obra
              </label>

              {/* Box de Prévia */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-stone-900 min-h-[300px] max-h-[420px] flex items-center justify-center">
                <img
                  src={imagemPreviewTemp || getMediaUrl(imagemAtualUrl)}
                  alt="Prévia da Obra"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200";
                  }}
                  className="w-full h-full max-h-[420px] object-contain"
                />

                {imagemPreviewTemp && (
                  <span className="absolute top-3 left-3 bg-artOrange text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    Nova imagem selecionada
                  </span>
                )}
              </div>

              {/* Ações de Substituição */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <i className="fa-solid fa-cloud-arrow-up text-artOrange text-sm"></i>
                  <span>Substituir Imagem</span>
                </button>

                {imagemPreviewTemp && (
                  <button
                    type="button"
                    onClick={handleRemoverNovaImagem}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-rotate-left text-[11px]"></i>
                    <span>Manter Imagem Original</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Estatísticas da Obra */}
              {obraOriginal && (
                <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                    <span className="block font-extrabold text-sm text-artDark">{obraOriginal.totalCurtidas || 0}</span>
                    <span className="text-[10px] font-medium text-gray-400">Curtidas</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                    <span className="block font-extrabold text-sm text-artDark">{obraOriginal.totalComentarios || 0}</span>
                    <span className="text-[10px] font-medium text-gray-400">Coment.</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                    <span className="block font-extrabold text-sm text-artDark">{obraOriginal.visualizacoes || 0}</span>
                    <span className="text-[10px] font-medium text-gray-400">Views</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA: Formulário de Edição de Dados */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              
              {/* Título / Legenda */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Título / Legenda da Obra
                </label>
                <textarea
                  value={legenda}
                  onChange={(e) => setLegenda(e.target.value)}
                  placeholder="Escreva a descrição, história ou técnicas da obra..."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-artOrange focus:bg-white rounded-2xl p-4 text-xs sm:text-sm text-artDark outline-none transition-all placeholder:text-gray-400 resize-none font-light leading-relaxed"
                />
              </div>

              {/* Seleção de Categorias por Pílulas */}
              <div className="space-y-3 pt-2">
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
                    className="w-full bg-gray-50 border border-gray-200 focus:border-artOrange focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs text-artDark font-medium outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Pílulas Fluidas de Categorias */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 py-1">
                  {categoriasFiltradas.length > 0 ? (
                    categoriasFiltradas.map((cat) => {
                      const isSelected = categoriasSelecionadas.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleToggleCategoria(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-artOrange text-white shadow-xs scale-[1.02]"
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

              {/* Botões de Ação Rodapé */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setModalExcluirAberto(true)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold py-2 px-3 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-trash-can text-[11px]"></i>
                  <span>Excluir Obra</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/obra/${id}`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-artDark hover:bg-gray-100 transition-all"
                  >
                    Cancelar
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-artOrange hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-artOrange/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Salvar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </form>

      {/* Modal de Confirmação de Exclusão */}
      <ModalConfirmarExclusao
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleExcluirConfirmado}
        loading={deleting}
        tituloObra={legenda}
      />
    </div>
  );
}