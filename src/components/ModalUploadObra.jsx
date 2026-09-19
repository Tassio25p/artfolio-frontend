import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { obrasService, planosService, authService, getMediaUrl } from "../services/api";
import { SETORES_ARTISTICOS, getEstiloCategoria } from "../constants/categories";
import { empacotarDadosObra, desempacotarDadosObra } from "../utils/obraHelper";
import WatermarkOverlay from "./WatermarkOverlay";

// Lista plana de todas as categorias individuais disponíveis
const CATEGORIAS_PLANAS = Array.from(
  new Set(SETORES_ARTISTICOS.flatMap((setor) => setor.subcategorias))
).filter(Boolean);

export default function ModalUploadObra({
  isOpen = true,
  onClose,
  isPage = false,
  modoEdicao = false,
  idObra = null,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Usuário e Plano do usuário ativo
  const [meuPlano, setMeuPlano] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [avisoCategorias, setAvisoCategorias] = useState(false);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [setorFiltro, setSetorFiltro] = useState("todas");

  // Opções: Marca d'água, Proteção contra download/print, Redução de Qualidade e Preço Base
  const [marcaDagua, setMarcaDagua] = useState(false);
  const [bloquearDownload, setBloquearDownload] = useState(false);
  const [bloquearPrint, setBloquearPrint] = useState(false);
  const [reduzirQualidade, setReduzirQualidade] = useState(false);
  const [precoBase, setPrecoBase] = useState("");
  const [exibirPaleta, setExibirPaleta] = useState(true);
  const [modoPaleta, setModoPaleta] = useState("auto"); // "auto" | "custom"
  const [coresCustomizadas, setCoresCustomizadas] = useState([
    "#FF793F",
    "#6C5CE7",
    "#00B894",
    "#0984E3",
    "#2D3436",
  ]);

  // Estados de arquivo e mídias (suporte a carrossel Pro/Boost e arquivos universais)
  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
  const [imagensPreviews, setImagensPreviews] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  // Estados de interface e requisição
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(modoEdicao);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const FORMATOS_ACEITOS_EXTENSOES = [
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp", ".avif",
    ".mp4", ".webm", ".mov", ".avi", ".mkv",
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".odt", ".rtf",
    ".obj", ".fbx", ".gltf", ".glb", ".stl", ".blend", ".dae", ".zip", ".rar", ".7z", ".psd", ".ai", ".eps"
  ];

  const ACCEPT_MIMES_E_EXTS = "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.odt,.rtf,.obj,.fbx,.gltf,.glb,.stl,.blend,.dae,.zip,.rar,.7z,.psd,.ai,.eps";

  const getTipoArquivo = (arquivoOuNome) => {
    const nome = typeof arquivoOuNome === "string" ? arquivoOuNome : arquivoOuNome?.name || "";
    const ext = (nome.split(".").pop() || "").toLowerCase();
    
    if (["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "avif"].includes(ext)) return "image";
    if (["mp4", "webm", "mov", "avi", "mkv", "ogg"].includes(ext)) return "video";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx", "txt", "odt", "rtf"].includes(ext)) return "doc";
    if (["ppt", "pptx"].includes(ext)) return "presentation";
    if (["obj", "fbx", "gltf", "glb", "stl", "blend", "dae"].includes(ext)) return "3d";
    if (["zip", "rar", "7z"].includes(ext)) return "archive";
    if (["psd", "ai", "eps"].includes(ext)) return "design";
    return "other";
  };

  const getIconeArquivo = (tipo, ext) => {
    switch (tipo) {
      case "video":
        return "fa-solid fa-video";
      case "pdf":
        return "fa-solid fa-file-pdf";
      case "doc":
        return "fa-solid fa-file-lines";
      case "presentation":
        return "fa-solid fa-file-powerpoint";
      case "3d":
        return "fa-solid fa-cube";
      case "archive":
        return "fa-solid fa-file-zipper";
      case "design":
        return "fa-solid fa-palette";
      default:
        return "fa-solid fa-file";
    }
  };

  // Carrega dados iniciais do usuário e da obra caso esteja em modo de edição
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [plano, usuario] = await Promise.all([
          planosService.obterMeuPlano().catch(() => ({ tipo: "Free" })),
          authService.getMe().catch(() => null),
        ]);
        setMeuPlano(plano);
        setUsuarioAtual(usuario);

        // Se estiver em modo de edição, busca a obra existente e preenche todos os campos
        if (modoEdicao && idObra) {
          setLoadingInitial(true);
          const obra = await obrasService.obterObraPorId(idObra);
          if (obra) {
            const dados = desempacotarDadosObra(obra);
            setTitulo(dados.titulo || "");
            setDescricao(dados.descricao || "");
            setPrecoBase(dados.precoBase || "");
            setMarcaDagua(Boolean(dados.marcaDagua));
            setBloquearDownload(Boolean(dados.bloquearDownload));
            setBloquearPrint(Boolean(dados.bloquearPrint));
            setReduzirQualidade(Boolean(dados.reduzirQualidade));
            setExibirPaleta(dados.exibirPaleta !== false);
            setModoPaleta(dados.modoPaleta || "auto");
            if (Array.isArray(dados.coresCustomizadas) && dados.coresCustomizadas.length === 5) {
              setCoresCustomizadas(dados.coresCustomizadas);
            }

            // Categorias (máximo 3)
            if (obra.categorias && obra.categorias.length > 0) {
              setCategoriasSelecionadas(obra.categorias.map((c) => c.nomeCategoria || c.nome || c).slice(0, 3));
            } else if (obra.categoria) {
              setCategoriasSelecionadas([obra.categoria.nomeCategoria || obra.categoria.nome || obra.categoria]);
            }

            // Mídias existentes
            const listaArquivos = [];
            if (Array.isArray(obra.arquivos) && obra.arquivos.length > 0) {
              obra.arquivos.forEach((arq) => {
                const url = typeof arq === "string" ? arq : arq?.arquivoUrl || arq?.url;
                const tipo = getTipoArquivo(url);
                const nome = url.split("/").pop() || "Arquivo";
                const ext = (nome.split(".").pop() || "FILE").toUpperCase();
                listaArquivos.push({ url, tipo, name: nome, ext, isExistente: true });
              });
            } else if (obra.arquivoUrl) {
              const url = obra.arquivoUrl;
              const tipo = getTipoArquivo(url);
              const nome = url.split("/").pop() || "Arquivo";
              const ext = (nome.split(".").pop() || "FILE").toUpperCase();
              listaArquivos.push({ url, tipo, name: nome, ext, isExistente: true });
            }

            setArquivosSelecionados(listaArquivos);
            setImagensPreviews(listaArquivos);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        setMensagemErro("Erro ao carregar os dados da publicação para edição.");
      } finally {
        setLoadingInitial(false);
      }
    };
    carregarDadosIniciais();
  }, [modoEdicao, idObra]);

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

  // Limite estrito de no máximo 3 categorias por postagem com mensagem estilizada
  const handleToggleCategoria = (catNome) => {
    setCategoriasSelecionadas((prev) => {
      if (prev.includes(catNome)) {
        setAvisoCategorias(false);
        return prev.filter((c) => c !== catNome);
      }
      if (prev.length >= 3) {
        setAvisoCategorias(true);
        setTimeout(() => setAvisoCategorias(false), 3500);
        return prev;
      }
      setAvisoCategorias(false);
      return [...prev, catNome];
    });
  };

  const processarArquivos = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const planoTipo = (meuPlano?.tipo || "free").toLowerCase();
    const isPro = planoTipo === "pro";
    const isBoost = planoTipo === "boost";
    const userIsProOuBoost = isPro || isBoost;

    // Limites de tamanho em MB por plano
    const maxMb = isBoost ? 100 : isPro ? 50 : 10;
    const planoNome = isBoost ? "Boost" : isPro ? "Pro" : "Free";

    // Validação de quantidade total de arquivos
    const totalArquivosFuturo = arquivosSelecionados.length + filesArray.length;
    if (!userIsProOuBoost && totalArquivosFuturo > 1) {
      setMensagemErro(
        `Seu plano atual é Free (1 arquivo por publicação). Faça upgrade para o Artfolio Pro (até 10 arquivos / 50MB) ou Boost (até 10 arquivos / 100MB) para adicionar mais arquivos à sua publicação!`
      );
      return;
    }

    if (totalArquivosFuturo > 10) {
      setMensagemErro(`O limite máximo para uma publicação em carrossel é de 10 arquivos. Você já possui ${arquivosSelecionados.length} selecionado(s).`);
      return;
    }

    // Validação de formato e tamanho por arquivo
    for (const file of filesArray) {
      const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
      const isValido = FORMATOS_ACEITOS_EXTENSOES.includes(ext) || file.type.startsWith("image/") || file.type.startsWith("video/");
      
      if (!isValido) {
        setMensagemErro(`O arquivo "${file.name}" possui formato não suportado. Aceitamos imagens, vídeos, PDFs, docs, apresentações, arquivos 3D e pacotes.`);
        return;
      }

      if (file.size > maxMb * 1024 * 1024) {
        const tamanhoMb = (file.size / (1024 * 1024)).toFixed(1);
        const dicaUpgrade = !userIsProOuBoost
          ? "Faça upgrade para o Pro (50MB) ou Boost (100MB)."
          : isPro
          ? "Faça upgrade para o Boost (100MB)."
          : "O tamanho máximo absoluto permitido é de 100MB.";
        setMensagemErro(`O arquivo "${file.name}" (${tamanhoMb}MB) excede o limite de ${maxMb}MB do seu plano ${planoNome}. ${dicaUpgrade}`);
        return;
      }
    }

    setMensagemErro("");

    // Gerar prévias assíncronas para cada novo arquivo adicionado incrementalmente
    const novasPreviews = await Promise.all(
      filesArray.map((file) => {
        return new Promise((resolve) => {
          const tipo = getTipoArquivo(file);
          const ext = (file.name.split(".").pop() || "ARQ").toUpperCase();
          if (tipo === "image") {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                url: reader.result,
                tipo: "image",
                name: file.name,
                size: file.size,
                ext,
              });
            };
            reader.readAsDataURL(file);
          } else if (tipo === "video") {
            const blobUrl = URL.createObjectURL(file);
            resolve({
              url: blobUrl,
              tipo: "video",
              name: file.name,
              size: file.size,
              ext,
            });
          } else {
            resolve({
              url: null,
              tipo: tipo,
              name: file.name,
              size: file.size,
              ext,
            });
          }
        });
      })
    );

    const proximaPosicao = arquivosSelecionados.length;
    setArquivosSelecionados((prev) => [...prev, ...filesArray]);
    setImagensPreviews((prev) => [...prev, ...novasPreviews]);
    setSlideAtual(proximaPosicao);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const handleRemoverImagem = (indexParaRemover, e) => {
    if (e) e.stopPropagation();
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
      setMensagemErro("Por favor, selecione ao menos uma arte para a publicação.");
      return;
    }

    setLoading(true);

    try {
      // Upload de novos arquivos (instâncias de File) ou manutenção de URLs já existentes
      const urlsUpload = [];
      for (const item of arquivosSelecionados) {
        if (item instanceof File) {
          const uploadRes = await obrasService.uploadImagem(item);
          urlsUpload.push(uploadRes.url);
        } else if (typeof item === "string") {
          urlsUpload.push(item);
        } else if (item && item.url) {
          urlsUpload.push(item.url);
        }
      }

      const protecoesAtivas = isProOuBoost;
      const finalMarcaDagua = protecoesAtivas ? marcaDagua : false;
      const finalBloquearDownload = protecoesAtivas ? bloquearDownload : false;
      const finalBloquearPrint = protecoesAtivas ? bloquearPrint : false;
      const finalReduzirQualidade = protecoesAtivas ? reduzirQualidade : false;

      // Monta dados estruturados garantindo separação e preservação de metadados
      const { legenda: legendaEstruturada } = empacotarDadosObra({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        precoBase: precoBase.trim() || null,
        marcaDagua: finalMarcaDagua,
        bloquearDownload: finalBloquearDownload,
        bloquearPrint: finalBloquearPrint,
        reduzirQualidade: finalReduzirQualidade,
        exibirPaleta,
        modoPaleta,
        coresCustomizadas: modoPaleta === "custom" ? coresCustomizadas : null,
      });

      const payload = {
        legenda: legendaEstruturada,
        titulo: titulo.trim() || undefined,
        descricao: descricao.trim() || undefined,
        precoBase: precoBase.trim() || undefined,
        preco_base: precoBase.trim() || undefined,
        marcaDagua: finalMarcaDagua,
        marca_dagua: finalMarcaDagua,
        bloquearDownload: finalBloquearDownload,
        bloquear_download: finalBloquearDownload,
        bloquearPrint: finalBloquearPrint,
        bloquear_print: finalBloquearPrint,
        reduzirQualidade: finalReduzirQualidade,
        nomesCategorias: categoriasSelecionadas,
        arquivoUrl: urlsUpload[0],
        arquivos: urlsUpload.length > 1 ? urlsUpload : undefined,
      };

      if (modoEdicao && idObra) {
        await obrasService.atualizarObra(idObra, payload);
        setMensagemSucesso("Alterações salvas com sucesso! Redirecionando...");
        setTimeout(() => {
          if (onClose) onClose();
          navigate(`/obra/${idObra}`);
        }, 1000);
      } else {
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
      }
    } catch (err) {
      console.error("Erro ao processar obra:", err);
      setMensagemErro(err.message || "Falha ao salvar a obra. Verifique sua conexão e tente novamente.");
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

  if (loadingInitial) {
    return (
      <div className="bg-[#FCFBF9]/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-black/10 shadow-2xl p-12 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-artOrange/10 border border-artOrange/20 text-artOrange flex items-center justify-center text-xl animate-spin">
          <i className="fa-solid fa-spinner"></i>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-artDark">Carregando dados da publicação...</p>
      </div>
    );
  }

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
              {modoEdicao ? "Edição de Postagem" : "Compartilhe sua arte"}
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
            {modoEdicao ? "Editar Publicação" : "Nova Publicação"}<span className="text-artOrange not-italic">.</span>
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
          {/* COLUNA ESQUERDA: Upload e Preview com Carrossel e Remoção Intuitiva */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-artOrange/10 text-artOrange flex items-center justify-center text-[10px]">
                  <i className="fa-solid fa-photo-film"></i>
                </span>
                <span>Arquivos da Obra</span>
              </label>
              {isProOuBoost && (
                <span className="text-[10px] text-artPurple font-bold">
                  {arquivosSelecionados.length > 0 ? `${arquivosSelecionados.length}/10 adicionados` : "Até 10 arquivos"}
                </span>
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
                  Adicionar Arquivo
                </h3>

                <p className="text-xs text-gray-500 max-w-[260px] leading-relaxed">
                  Arraste seu arquivo ou{" "}
                  <span className="text-artOrange font-bold underline underline-offset-4 decoration-artOrange/40 group-hover:decoration-artOrange group-hover:text-artPurple transition-all">
                    Selecione no dispositivo
                  </span>
                </p>

                <div className="mt-4 inline-flex items-center gap-2 bg-white/95 border border-artPurple/20 text-gray-700 font-bold px-3.5 py-1.5 rounded-full shadow-xs text-[10px]">
                  <i className="fa-solid fa-shapes text-artOrange text-xs"></i>
                  <span>Imagens, Vídeos, Documentos, 3D & Design</span>
                </div>

                <p className="text-[10px] text-gray-400 mt-3">
                  {meuPlano?.tipo?.toLowerCase() === "boost"
                    ? "Plano Boost: até 100MB por arquivo (até 10 arquivos)"
                    : meuPlano?.tipo?.toLowerCase() === "pro"
                    ? "Plano Pro: até 50MB por arquivo (até 10 arquivos)"
                    : "Plano Free: 1 arquivo de até 10MB"}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={isProOuBoost}
                  accept={ACCEPT_MIMES_E_EXTS}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-3">
                {/* Palco da Prévia Principal */}
                {(() => {
                  const previewAtual = imagensPreviews[slideAtual];
                  const tipoAtual = previewAtual?.tipo || "image";
                  const urlAtual = typeof previewAtual === "string" ? previewAtual : previewAtual?.url;
                  const nomeAtual = previewAtual?.name || arquivosSelecionados[slideAtual]?.name || "Arquivo";
                  const extAtual = previewAtual?.ext || (nomeAtual.split(".").pop() || "FILE").toUpperCase();
                  const sizeAtual = previewAtual?.size || arquivosSelecionados[slideAtual]?.size || 0;

                  return (
                    <div className="relative rounded-[2rem] overflow-hidden border border-black/10 bg-neutral-950 shadow-inner group min-h-[320px] max-h-[390px] flex items-center justify-center">
                      {tipoAtual === "image" ? (
                        <img
                          src={urlAtual?.startsWith("http") || urlAtual?.startsWith("/") ? getMediaUrl(urlAtual) : urlAtual}
                          alt={`Prévia ${slideAtual + 1}`}
                          className="w-full h-full max-h-[380px] object-contain transition-all duration-300"
                        />
                      ) : tipoAtual === "video" ? (
                        <video
                          src={urlAtual?.startsWith("http") || urlAtual?.startsWith("/") ? getMediaUrl(urlAtual) : urlAtual}
                          controls
                          className="w-full h-full max-h-[380px] object-contain bg-black"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-neutral-900 to-neutral-800">
                          <div className="w-20 h-20 rounded-2xl bg-white/10 text-artOrange border border-white/10 flex items-center justify-center text-3xl mb-3 shadow-inner">
                            <i className={getIconeArquivo(tipoAtual, extAtual)}></i>
                          </div>
                          <span className="font-editorial text-lg text-white font-bold truncate max-w-[260px]">
                            {nomeAtual}
                          </span>
                          <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-artOrange bg-artOrange/20 px-2.5 py-0.5 rounded-full border border-artOrange/30">
                            {extAtual} {sizeAtual > 0 ? `• ${(sizeAtual / (1024 * 1024)).toFixed(2)} MB` : ""}
                          </span>
                        </div>
                      )}

                      {/* Prévia da Marca d'água se ativada */}
                      {marcaDagua && tipoAtual === "image" && (
                        <WatermarkOverlay
                          nomeUsuario={usuarioAtual?.nome || "Artista"}
                        />
                      )}

                      {/* Tag de Redução de Qualidade se ativada */}
                      {reduzirQualidade && (
                        <div className="absolute bottom-3 right-3 z-30 pointer-events-none">
                          <div className="bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[9px] font-bold shadow-md flex items-center gap-1">
                            <i className="fa-solid fa-compress"></i>
                            <span>Modo Prévia Ativo</span>
                          </div>
                        </div>
                      )}

                      {/* Tag de Preço Base na Prévia se informado */}
                      {precoBase && (
                        <div className="absolute top-3 left-3 z-30 pointer-events-none">
                          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 shadow-lg flex items-center gap-1.5">
                            <i className="fa-solid fa-tag text-artOrange text-[10px]"></i>
                            <span className="text-[11px] font-bold text-artDark">
                              {precoBase.startsWith("R$") ? precoBase : `R$ ${precoBase}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Controles de Slide se tiver mais de 1 item */}
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
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center text-xs transition-all shadow-md border border-white/10 z-20"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center text-xs transition-all shadow-md border border-white/10 z-20"
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>

                          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full z-20">
                            {slideAtual + 1} / {imagensPreviews.length}
                          </span>
                        </>
                      )}

                      {/* Botão 'X' meio transparente mas bem visível para remover o item atual */}
                      <button
                        type="button"
                        onClick={(e) => handleRemoverImagem(slideAtual, e)}
                        className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-white/30 backdrop-blur-xs z-30"
                        title="Remover este arquivo"
                      >
                        <i className="fa-solid fa-xmark text-sm font-bold"></i>
                      </button>
                    </div>
                  );
                })()}

                {/* Carrossel de Miniaturas com Botão 'X' e Botão de Adicionar Mais */}
                <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-0.5 no-scrollbar">
                  {imagensPreviews.map((preview, idx) => {
                    const tipo = preview?.tipo || "image";
                    const url = typeof preview === "string" ? preview : preview?.url;
                    const ext = preview?.ext || "ARQ";
                    const isSelecionado = idx === slideAtual;

                    return (
                      <div key={idx} className="relative group shrink-0">
                        <button
                          type="button"
                          onClick={() => setSlideAtual(idx)}
                          className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center bg-neutral-900 ${
                            isSelecionado
                              ? "border-artPurple scale-105 shadow-md shadow-artPurple/40"
                              : "border-black/10 opacity-70 hover:opacity-100"
                          }`}
                        >
                          {tipo === "image" && url ? (
                            <img src={url?.startsWith("http") || url?.startsWith("/") ? getMediaUrl(url) : url} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-1 text-white">
                              <i className={`${getIconeArquivo(tipo, ext)} text-xs text-artOrange mb-0.5`}></i>
                              <span className="text-[8px] font-bold uppercase truncate max-w-[44px]">{ext}</span>
                            </div>
                          )}
                        </button>

                        {/* Botão 'X' meio transparente mas visível em cada miniatura */}
                        <button
                          type="button"
                          onClick={(e) => handleRemoverImagem(idx, e)}
                          className="absolute -top-1.5 -right-1.5 bg-black/75 hover:bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow border border-white/40 transition-all hover:scale-110 z-10"
                          title="Remover"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    );
                  })}

                  {/* Botão '+ Adicionar mais arquivos' diretamente na grade/linha */}
                  {isProOuBoost && arquivosSelecionados.length < 10 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-14 h-14 rounded-2xl border-2 border-dashed border-artPurple/50 hover:border-artPurple bg-artPurple/[0.06] hover:bg-artPurple/15 text-artPurple flex flex-col items-center justify-center shrink-0 transition-all cursor-pointer group shadow-2xs"
                      title="Adicionar mais um arquivo"
                    >
                      <i className="fa-solid fa-plus text-sm group-hover:scale-125 transition-transform"></i>
                      <span className="text-[8px] font-bold mt-0.5">Mais</span>
                    </button>
                  )}
                </div>

                {/* Informações da mídia ativa e Botão de Ação */}
                <div className="flex items-center justify-between bg-white border border-black/10 rounded-2xl p-3 text-xs shadow-2xs backdrop-blur-sm">
                  <div className="truncate pr-2">
                    <span className="font-bold text-artDark block truncate text-[11px]">
                      {arquivosSelecionados[slideAtual]?.name || "arquivo_selecionado"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {arquivosSelecionados.length > 1
                        ? `Item ${slideAtual + 1} de ${arquivosSelecionados.length}`
                        : "Arquivo pronto"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-artPurple/10 border border-artPurple/25 text-artPurple hover:bg-artPurple hover:text-white px-3.5 py-1.5 rounded-xl font-bold text-[11px] transition-all whitespace-nowrap shadow-2xs flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-plus text-[10px]"></i>
                    <span>{isProOuBoost ? "Adicionar Mais" : "Trocar Arquivo"}</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={isProOuBoost}
                  accept={ACCEPT_MIMES_E_EXTS}
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

              {/* Preço Base & Proteções Autorais */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 relative z-10">
                {/* Preço Base Sugerido */}
                <div className="sm:col-span-5 bg-white/90 border border-artGreen/30 hover:border-artGreen/50 focus-within:border-artGreen focus-within:ring-4 focus-within:ring-artGreen/10 rounded-2xl p-3.5 shadow-2xs transition-all">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-[10px] shadow-2xs">
                      <i className="fa-solid fa-tag"></i>
                    </span>
                    <span>Preço Base <span className="text-gray-400 font-normal lowercase">(opcional)</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      R$
                    </span>
                    <input
                      type="text"
                      value={precoBase}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d.,]/g, "");
                        setPrecoBase(val);
                      }}
                      placeholder="0,00"
                      maxLength={15}
                      className="w-full bg-emerald-500/[0.02] border border-emerald-500/20 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-artDark placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1.5 leading-tight">
                    Ficará como uma etiquetinha elegante visível para interessados.
                  </p>
                </div>

                {/* Opções de Proteção e Marca d'água */}
                <div className="sm:col-span-7 bg-white/90 border border-artPurple/20 rounded-2xl p-3.5 shadow-2xs space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-artPurple/15 text-artPurple flex items-center justify-center text-[10px] shadow-2xs">
                        <i className="fa-solid fa-shield-halved"></i>
                      </span>
                      <span>Proteção e Direitos Autorais</span>
                    </label>

                    {!isProOuBoost && (
                      <span className="bg-artPurple/10 text-artPurple border border-artPurple/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <i className="fa-solid fa-lock text-[8px]"></i>
                        Pro & Boost
                      </span>
                    )}
                  </div>

                  {!isProOuBoost && (
                    <div className="p-2 rounded-xl bg-artPurple/[0.06] border border-artPurple/20 text-[10px] text-artPurple font-medium flex items-center gap-2">
                      <i className="fa-solid fa-lock text-xs shrink-0"></i>
                      <span>Disponível nos planos <strong>Pro</strong> e <strong>Boost</strong>. Faça upgrade para proteger suas obras contra download, print e cópia.</span>
                    </div>
                  )}

                  <div className={`space-y-2.5 ${!isProOuBoost ? "opacity-50 select-none pointer-events-none blur-[0.5px]" : ""}`}>
                    {/* Toggle Marca d'água */}
                    <label className="flex items-center justify-between gap-3 p-2 rounded-xl bg-artPurple/[0.03] hover:bg-artPurple/[0.07] border border-artPurple/10 cursor-pointer transition-all">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-fingerprint text-artPurple text-xs"></i>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-artDark">Marca d'água Artfolio</span>
                          <span className="text-[9px] text-gray-400">Padrão diagonal translúcido com seu nome</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        disabled={!isProOuBoost}
                        checked={isProOuBoost && marcaDagua}
                        onChange={(e) => setMarcaDagua(e.target.checked)}
                        className="w-4 h-4 text-artPurple rounded focus:ring-artPurple border-gray-300 cursor-pointer accent-artPurple disabled:cursor-not-allowed"
                      />
                    </label>

                    {/* Toggle Impedir Download */}
                    <label className="flex items-center justify-between gap-3 p-2 rounded-xl bg-artOrange/[0.03] hover:bg-artOrange/[0.07] border border-artOrange/10 cursor-pointer transition-all">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-download text-artOrange text-xs"></i>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-artDark">Bloquear Download</span>
                          <span className="text-[9px] text-gray-400">Desativa clique direito e salvamento direto</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        disabled={!isProOuBoost}
                        checked={isProOuBoost && bloquearDownload}
                        onChange={(e) => setBloquearDownload(e.target.checked)}
                        className="w-4 h-4 text-artOrange rounded focus:ring-artOrange border-gray-300 cursor-pointer accent-artOrange disabled:cursor-not-allowed"
                      />
                    </label>

                    {/* Toggle Bloquear Printscreen */}
                    <label className="flex items-center justify-between gap-3 p-2 rounded-xl bg-artBlue/[0.03] hover:bg-artBlue/[0.07] border border-artBlue/10 cursor-pointer transition-all">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-camera text-artBlue text-xs"></i>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-artDark">Proteção contra Printscreen</span>
                          <span className="text-[9px] text-gray-400">Aplica escudo protetor e desfoque ao capturar</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        disabled={!isProOuBoost}
                        checked={isProOuBoost && bloquearPrint}
                        onChange={(e) => setBloquearPrint(e.target.checked)}
                        className="w-4 h-4 text-artBlue rounded focus:ring-artBlue border-gray-300 cursor-pointer accent-artBlue disabled:cursor-not-allowed"
                      />
                    </label>

                    {/* Toggle Redução de Qualidade (Modo Prévia) */}
                    <label className="flex items-center justify-between gap-3 p-2 rounded-xl bg-amber-500/[0.04] hover:bg-amber-500/[0.08] border border-amber-500/15 cursor-pointer transition-all">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-compress text-amber-500 text-xs"></i>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-artDark">Redução de Qualidade (Modo Prévia)</span>
                          <span className="text-[9px] text-gray-400">Exibe versão reduzida (incentiva contato para obter original em alta)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        disabled={!isProOuBoost}
                        checked={isProOuBoost && reduzirQualidade}
                        onChange={(e) => setReduzirQualidade(e.target.checked)}
                        className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 border-gray-300 cursor-pointer accent-amber-500 disabled:cursor-not-allowed"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Opção da Paleta Cromática da Obra */}
              <div className="bg-white/90 border border-artOrange/25 rounded-2xl p-4 shadow-2xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-artOrange/15 text-artOrange flex items-center justify-center text-[10px] shadow-2xs">
                      <i className="fa-solid fa-palette"></i>
                    </span>
                    <span>Paleta Cromática da Obra</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs font-bold text-gray-700">Exibir paleta HEX</span>
                    <input
                      type="checkbox"
                      checked={exibirPaleta}
                      onChange={(e) => setExibirPaleta(e.target.checked)}
                      className="w-4 h-4 text-artOrange rounded focus:ring-artOrange border-gray-300 cursor-pointer accent-artOrange"
                    />
                  </label>
                </div>

                {exibirPaleta && (
                  <div className="space-y-3 pt-2 border-t border-black/5 animate-fadeIn">
                    {/* Opção Auto vs Custom */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        modoPaleta === "auto"
                          ? "bg-artOrange/10 border-artOrange/40 text-artOrange"
                          : "bg-gray-50 border-black/5 text-gray-600 hover:bg-gray-100"
                      }`}>
                        <input
                          type="radio"
                          name="modoPaleta"
                          value="auto"
                          checked={modoPaleta === "auto"}
                          onChange={() => setModoPaleta("auto")}
                          className="hidden"
                        />
                        <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                        <span>Automático (Extrair da Imagem)</span>
                      </label>

                      <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        modoPaleta === "custom"
                          ? "bg-artPurple/10 border-artPurple/40 text-artPurple"
                          : "bg-gray-50 border-black/5 text-gray-600 hover:bg-gray-100"
                      }`}>
                        <input
                          type="radio"
                          name="modoPaleta"
                          value="custom"
                          checked={modoPaleta === "custom"}
                          onChange={() => setModoPaleta("custom")}
                          className="hidden"
                        />
                        <i className="fa-solid fa-paint-brush text-[10px]"></i>
                        <span>Personalizado (Definir 5 Cores)</span>
                      </label>
                    </div>

                    {modoPaleta === "custom" && (
                      <div className="p-3 bg-[#F9F8F6] rounded-xl border border-artPurple/20 space-y-2 animate-fadeIn">
                        <p className="text-[11px] text-gray-600 font-medium">
                          Defina ou clique no conta-gotas para escolher as 5 cores que melhor representam a sua obra:
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                          {coresCustomizadas.map((cor, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5">
                              <div className="relative w-full h-10 rounded-xl overflow-hidden shadow-xs border border-black/10 flex items-center justify-center cursor-pointer group">
                                <input
                                  type="color"
                                  value={cor}
                                  onChange={(e) => {
                                    const nova = [...coresCustomizadas];
                                    nova[idx] = e.target.value.toUpperCase();
                                    setCoresCustomizadas(nova);
                                  }}
                                  className="absolute inset-0 w-[150%] h-[150%] -top-2 -left-2 cursor-pointer opacity-0"
                                  title="Clique para escolher com o seletor de cores"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: cor }} />
                                <i className="fa-solid fa-eye-dropper text-white text-[10px] absolute drop-shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></i>
                              </div>
                              <input
                                type="text"
                                value={cor}
                                maxLength={7}
                                onChange={(e) => {
                                  const nova = [...coresCustomizadas];
                                  nova[idx] = e.target.value;
                                  setCoresCustomizadas(nova);
                                }}
                                className="w-full text-center text-[10px] font-mono font-bold bg-white border border-gray-200 rounded-lg py-0.5 outline-none focus:border-artPurple uppercase"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Categorias (Restrito a no máximo 3) */}
              <div className="bg-white/90 border border-artBlue/25 rounded-2xl p-4 shadow-2xs transition-all relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-artDark flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-artBlue/15 text-artBlue flex items-center justify-center text-[10px] shadow-2xs">
                      <i className="fa-solid fa-swatchbook"></i>
                    </span>
                    <span>Categorias ({categoriasSelecionadas.length}/3) <span className="text-gray-400 font-normal lowercase">(máx. 3)</span></span>
                  </label>
                  {categoriasSelecionadas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCategoriasSelecionadas([])}
                      className="text-[10px] font-bold text-gray-400 hover:text-artOrange transition-colors cursor-pointer"
                    >
                      Limpar todas
                    </button>
                  )}
                </div>

                {/* Alerta animado de limite de 3 categorias */}
                {avisoCategorias && (
                  <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-artOrange text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                    <i className="fa-solid fa-circle-exclamation text-xs"></i>
                    <span>Máximo de 3 categorias por publicação. Desmarque uma para adicionar outra.</span>
                  </div>
                )}

                {categoriasSelecionadas.length === 0 ? (
                  <p className="text-xs text-gray-400 italic mb-3 flex items-center gap-1.5 py-1">
                    <i className="fa-solid fa-circle-info text-artBlue text-xs"></i>
                    Nenhuma categoria selecionada (opcional, até 3). Caso não escolha, a obra será exibida em "Todas as Obras".
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
                  {/* Pílulas dos Setores Artísticos com Carrossel e Chevrons */}
                  <div className="relative group/setores mb-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("upload-setores-scroll");
                        if (el) el.scrollBy({ left: -160, behavior: "smooth" });
                      }}
                      className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-black/10 items-center justify-center text-[10px] text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Rolar para esquerda"
                    >
                      <i className="fa-solid fa-chevron-left text-[8px]"></i>
                    </button>

                    <div
                      id="upload-setores-scroll"
                      className="flex gap-2 overflow-x-auto pb-1 scroll-smooth no-scrollbar px-1"
                    >
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
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                              isSelected
                                ? `${setor.corBg} border-transparent shadow-xs scale-105`
                                : "bg-white text-gray-600 border-black/5 hover:bg-gray-100 shadow-2xs"
                            }`}
                          >
                            <i className={`${setor.icone} text-[9px]`}></i>
                            <span>{setor.nome}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("upload-setores-scroll");
                        if (el) el.scrollBy({ left: 160, behavior: "smooth" });
                      }}
                      className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border border-black/10 items-center justify-center text-[10px] text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Rolar para direita"
                    >
                      <i className="fa-solid fa-chevron-right text-[8px]"></i>
                    </button>
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
                    <span>{modoEdicao ? "Salvando alterações..." : "Publicando em alta qualidade..."}</span>
                  </>
                ) : (
                  <>
                    <i className={modoEdicao ? "fa-solid fa-floppy-disk text-sm" : "fa-solid fa-arrow-up-from-bracket text-sm"}></i>
                    <span>{modoEdicao ? "Salvar Alterações" : "Publicar Obra"}</span>
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

