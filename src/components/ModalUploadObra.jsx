import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { obrasService, planosService, authService, categoriaService, getMediaUrl } from "../services/api";
import { SETORES_ARTISTICOS } from "../constants/categories";
import { empacotarDadosObra, desempacotarDadosObra } from "../utils/obraHelper";
import WatermarkOverlay from "./WatermarkOverlay";
import EmojiPicker from "./EmojiPicker";

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
  const [desafioAtual, setDesafioAtual] = useState(null);

  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [showEmojiTitulo, setShowEmojiTitulo] = useState(false);
  const [showEmojiDesc, setShowEmojiDesc] = useState(false);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [avisoCategorias, setAvisoCategorias] = useState(false);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [setorFiltro, setSetorFiltro] = useState("todas");

  // Opções: Download permitido (padrão true), Marca d'água, Proteção contra print, Redução de Qualidade e Preço Base
  const [permitirDownload, setPermitirDownload] = useState(true);
  const [marcaDagua, setMarcaDagua] = useState(false);
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

  const getIconeArquivo = (tipo, _ext) => {
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
        const [plano, usuario, desafio] = await Promise.all([
          planosService.obterMeuPlano().catch(() => ({ tipo: "Free" })),
          authService.getMe().catch(() => null),
          categoriaService.obterDesafioAtual().catch(() => null),
        ]);
        setMeuPlano(plano);
        setUsuarioAtual(usuario);
        setDesafioAtual(desafio);

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
            setPermitirDownload(dados.bloquearDownload !== undefined ? !dados.bloquearDownload : true);
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
              const img = new Image();
              img.onload = () => {
                const width = img.naturalWidth || img.width;
                const height = img.naturalHeight || img.height;
                const resolucao = width && height ? `${width} × ${height}` : null;
                const mp = width && height ? ((width * height) / 1000000).toFixed(1) : null;
                resolve({
                  url: reader.result,
                  tipo: "image",
                  name: file.name,
                  size: file.size,
                  ext,
                  width,
                  height,
                  resolucao,
                  mp,
                });
              };
              img.onerror = () => {
                resolve({
                  url: reader.result,
                  tipo: "image",
                  name: file.name,
                  size: file.size,
                  ext,
                });
              };
              img.src = reader.result;
            };
            reader.readAsDataURL(file);
          } else if (tipo === "video") {
            const blobUrl = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.onloadedmetadata = () => {
              const width = video.videoWidth;
              const height = video.videoHeight;
              const resolucao = width && height ? `${width} × ${height}` : null;
              resolve({
                url: blobUrl,
                tipo: "video",
                name: file.name,
                size: file.size,
                ext,
                width,
                height,
                resolucao,
              });
            };
            video.onerror = () => {
              resolve({
                url: blobUrl,
                tipo: "video",
                name: file.name,
                size: file.size,
                ext,
              });
            };
            video.src = blobUrl;
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
      const finalBloquearDownload = !permitirDownload;
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
          <div className="lg:col-span-5 flex flex-col relative z-10">
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
                          onLoad={(e) => {
                            const naturalW = e.currentTarget.naturalWidth;
                            const naturalH = e.currentTarget.naturalHeight;
                            if (naturalW && naturalH && (!previewAtual?.resolucao || !previewAtual?.width)) {
                              setImagensPreviews((prev) => {
                                const copy = [...prev];
                                if (copy[slideAtual]) {
                                  copy[slideAtual] = {
                                    ...copy[slideAtual],
                                    width: naturalW,
                                    height: naturalH,
                                    resolucao: `${naturalW} × ${naturalH}`,
                                    mp: ((naturalW * naturalH) / 1000000).toFixed(1),
                                  };
                                }
                                return copy;
                              });
                            }
                          }}
                          className="w-full h-full max-h-[380px] object-contain transition-all duration-300"
                        />
                      ) : tipoAtual === "video" ? (
                        <video
                          src={urlAtual?.startsWith("http") || urlAtual?.startsWith("/") ? getMediaUrl(urlAtual) : urlAtual}
                          controls
                          onLoadedMetadata={(e) => {
                            const videoW = e.currentTarget.videoWidth;
                            const videoH = e.currentTarget.videoHeight;
                            if (videoW && videoH && (!previewAtual?.resolucao || !previewAtual?.width)) {
                              setImagensPreviews((prev) => {
                                const copy = [...prev];
                                if (copy[slideAtual]) {
                                  copy[slideAtual] = {
                                    ...copy[slideAtual],
                                    width: videoW,
                                    height: videoH,
                                    resolucao: `${videoW} × ${videoH}`,
                                  };
                                }
                                return copy;
                              });
                            }
                          }}
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

                      {/* Badge de Resolução da Imagem / Vídeo em Destaque — Sempre Visível e Chamativo */}
                      {previewAtual?.resolucao && (
                        <div className="absolute top-3 left-3 z-30 pointer-events-none transition-all">
                          <div className="bg-neutral-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/30 shadow-xl flex items-center gap-2.5 text-white ring-1 ring-black/40">
                            <span className="w-5 h-5 rounded-lg bg-artOrange/20 border border-artOrange/40 flex items-center justify-center text-artOrange text-[10px]">
                              <i className="fa-solid fa-expand"></i>
                            </span>
                            <div className="flex flex-col text-left">
                              <span className="text-[11px] font-black tracking-wider leading-none text-white drop-shadow-xs">
                                {previewAtual.resolucao} px
                              </span>
                              <span className="text-[9px] text-gray-300 font-bold leading-tight mt-0.5">
                                {previewAtual.mp ? `${previewAtual.mp} MP • ` : ""}{reduzirQualidade ? "Modo Prévia" : "100% Original"}
                              </span>
                            </div>
                          </div>
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
                        <div className="absolute bottom-3 left-3 z-30 pointer-events-none">
                          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 shadow-lg flex items-center gap-1.5">
                            <i className="fa-solid fa-tag text-emerald-600 text-[10px]"></i>
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-artDark block truncate text-[11px]">
                        {arquivosSelecionados[slideAtual]?.name || "arquivo_selecionado"}
                      </span>
                      {imagensPreviews[slideAtual]?.resolucao && (
                        <span className="bg-artBlue/10 text-artBlue border border-artBlue/25 text-[9px] font-black px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                          <i className="fa-solid fa-expand text-[8px]"></i>
                          <span>{imagensPreviews[slideAtual].resolucao} px</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium mt-0.5 block truncate">
                      {arquivosSelecionados[slideAtual]?.size
                        ? `${(arquivosSelecionados[slideAtual].size / (1024 * 1024)).toFixed(2)} MB • `
                        : ""}
                      {imagensPreviews[slideAtual]?.resolucao
                        ? `Resolução: ${imagensPreviews[slideAtual].resolucao} px • `
                        : ""}
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

          {/* COLUNA DIREITA: Dados da Publicação com Painel Arquitetural Colorido e Overlay Garantido */}
          <div className={`lg:col-span-7 flex flex-col justify-between relative ${showEmojiTitulo || showEmojiDesc ? "z-[100]" : "z-20"}`}>
            <div className={`bg-gradient-to-br from-white/95 via-purple-50/40 to-orange-50/40 p-4 sm:p-5 rounded-[2rem] border-2 border-artPurple/15 shadow-sm space-y-3.5 relative ${showEmojiTitulo || showEmojiDesc ? "z-[100]" : "z-20"} backdrop-blur-md`}>
              {/* Orbes de Luz Difusa Decorativa no Card devidamente isolados sem overflow-hidden no container principal */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-artPurple/15 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-artOrange/15 rounded-full blur-2xl"></div>
              </div>

              {/* Barra de Subtítulo do Painel */}
              <div className="flex items-center justify-between border-b border-artPurple/10 pb-2 relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-artPurple flex items-center gap-2">
                  <i className="fa-solid fa-sliders text-xs"></i> Detalhes & Categorização
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Layout Compacto</span>
              </div>

              {/* 1. Título & Legenda Integrados */}
              <div className={`grid grid-cols-1 sm:grid-cols-12 gap-3 relative ${showEmojiTitulo || showEmojiDesc ? "z-[100]" : "z-20"}`}>
                {/* Título da Obra */}
                <div className={`sm:col-span-5 bg-white/90 border border-artPurple/20 hover:border-artPurple/40 focus-within:border-artPurple rounded-2xl p-3 shadow-2xs transition-all relative ${showEmojiTitulo ? "z-[100]" : "z-20"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-md bg-artPurple/15 text-artPurple flex items-center justify-center text-[9px]">
                        <i className="fa-solid fa-paintbrush"></i>
                      </span>
                      <span>Título</span>
                    </label>

                    <div className={`relative ${showEmojiTitulo ? "z-[100]" : ""}`}>
                      <button
                        type="button"
                        onClick={() => setShowEmojiTitulo((prev) => !prev)}
                        className={`text-[10px] flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded-lg hover:bg-black/5 cursor-pointer ${
                          showEmojiTitulo ? "text-artPurple bg-artPurple/10 font-bold" : "text-gray-400 hover:text-artPurple"
                        }`}
                        title="Inserir Emojis"
                      >
                        <i className="fa-regular fa-face-smile"></i>
                        <span>Emojis</span>
                      </button>
                      <EmojiPicker
                        isOpen={showEmojiTitulo}
                        onClose={() => setShowEmojiTitulo(false)}
                        onSelect={(emoji) => {
                          setTitulo((prev) => prev + (emoji.startsWith(":") ? ` ${emoji} ` : emoji));
                        }}
                        position="bottom"
                        className="!right-auto !left-0 max-w-[320px]"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Nome da criação (opcional)..."
                    maxLength={100}
                    className="w-full bg-artPurple/[0.02] border border-artPurple/15 rounded-xl px-3 py-2 text-xs font-medium text-artDark placeholder:text-gray-400 focus:bg-white focus:border-artPurple outline-none transition-all"
                  />
                </div>

                {/* Descrição / Legenda */}
                <div className={`sm:col-span-7 bg-white/90 border border-artOrange/20 hover:border-artOrange/40 focus-within:border-artOrange rounded-2xl p-3 shadow-2xs transition-all relative ${showEmojiDesc ? "z-[100]" : "z-10"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-md bg-artOrange/15 text-artOrange flex items-center justify-center text-[9px]">
                        <i className="fa-solid fa-feather"></i>
                      </span>
                      <span>História ou Legenda</span>
                    </label>

                    <div className={`relative ${showEmojiDesc ? "z-[100]" : ""}`}>
                      <button
                        type="button"
                        onClick={() => setShowEmojiDesc((prev) => !prev)}
                        className={`text-[10px] flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded-lg hover:bg-black/5 cursor-pointer ${
                          showEmojiDesc ? "text-artOrange bg-artOrange/10 font-bold" : "text-gray-400 hover:text-artOrange"
                        }`}
                        title="Inserir Emojis na Legenda"
                      >
                        <i className="fa-regular fa-face-smile"></i>
                        <span>Emojis</span>
                      </button>
                      <EmojiPicker
                        isOpen={showEmojiDesc}
                        onClose={() => setShowEmojiDesc(false)}
                        onSelect={(emoji) => {
                          setDescricao((prev) => prev + (emoji.startsWith(":") ? ` ${emoji} ` : emoji));
                        }}
                        position="bottom"
                        className="right-0 max-w-[320px]"
                      />
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Inspirações, técnicas ou conceito da obra..."
                    className="w-full bg-artOrange/[0.02] border border-artOrange/15 rounded-xl px-3 py-1.5 text-xs font-medium text-artDark placeholder:text-gray-400 focus:bg-white focus:border-artOrange outline-none resize-none leading-relaxed transition-all"
                  />
                </div>
              </div>

              {/* Resolução da Imagem & Detalhes Técnicos em Destaque */}
              <div className="bg-white/95 border-2 border-artBlue/30 rounded-2xl p-3.5 shadow-2xs space-y-2 relative overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-artBlue/15 text-artBlue flex items-center justify-center text-[10px]">
                      <i className="fa-solid fa-expand"></i>
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-artDark">
                      Resolução da Imagem & Especificações
                    </span>
                  </div>
                  {imagensPreviews[slideAtual]?.resolucao ? (
                    <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <i className="fa-solid fa-circle-check text-[9px]"></i> Detectada Automaticamente
                    </span>
                  ) : (
                    <span className="bg-artBlue/10 text-artBlue border border-artBlue/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Selecione um arquivo para ver a resolução
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                  <div className="bg-artBlue/[0.05] border border-artBlue/20 rounded-xl p-2 flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Resolução</span>
                    <span className="text-xs font-black text-artBlue mt-0.5 truncate">
                      {imagensPreviews[slideAtual]?.resolucao ? `${imagensPreviews[slideAtual].resolucao} px` : "—"}
                    </span>
                  </div>

                  <div className="bg-artPurple/[0.05] border border-artPurple/20 rounded-xl p-2 flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Megapixels</span>
                    <span className="text-xs font-black text-artPurple mt-0.5 truncate">
                      {imagensPreviews[slideAtual]?.mp ? `${imagensPreviews[slideAtual].mp} MP` : imagensPreviews[slideAtual]?.resolucao ? "Alta Resolução" : "—"}
                    </span>
                  </div>

                  <div className="bg-artOrange/[0.05] border border-artOrange/20 rounded-xl p-2 flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Tamanho</span>
                    <span className="text-xs font-black text-artOrange mt-0.5 truncate">
                      {arquivosSelecionados[slideAtual]?.size
                        ? `${(arquivosSelecionados[slideAtual].size / (1024 * 1024)).toFixed(2)} MB`
                        : "—"}
                    </span>
                  </div>

                  <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-xl p-2 flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Modo de Qualidade</span>
                    <span className="text-xs font-black text-emerald-600 mt-0.5 truncate">
                      {reduzirQualidade ? "Modo Prévia" : "100% Original"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Preço Base & Proteções Lado a Lado (Grid 2 Colunas) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 relative z-0">
                {/* Coluna 1: Preço Base & Habilitar Download */}
                <div className="sm:col-span-4 bg-white/90 border border-emerald-500/25 rounded-2xl p-3 shadow-2xs space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-artDark flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-tag text-emerald-600"></i>
                        <span>Preço Base (opcional)</span>
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
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
                        className="w-full bg-emerald-500/[0.02] border border-emerald-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-artDark placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Card Permitir Download formatado no mesmo padrão da Proteção Avançada */}
                  <label
                    className={`flex flex-col justify-between items-center text-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                      permitirDownload
                        ? "bg-emerald-500/[0.08] border-emerald-500/30 shadow-xs"
                        : "bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] border-emerald-500/15"
                    }`}
                    title="Permitir que usuários e compradores baixem esta obra"
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs mb-1">
                        <i className={`fa-solid ${permitirDownload ? "fa-circle-check" : "fa-download"}`}></i>
                      </div>
                      <span className="text-[11px] font-bold text-artDark leading-tight">Permitir Download</span>
                      <span className="text-[9px] text-gray-500 leading-tight mt-0.5">Libera o download da arte</span>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-emerald-500/15 w-full flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={permitirDownload}
                        onChange={(e) => setPermitirDownload(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </label>
                </div>

                {/* Coluna 2: Proteção Avançada (Marca d'água, Anti-Print, Redução) */}
                <div className="sm:col-span-8 bg-white/90 border border-artPurple/20 rounded-2xl p-3 shadow-2xs space-y-2 relative flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                      <i className="fa-solid fa-lock text-artPurple"></i>
                      <span>Proteção Avançada</span>
                    </label>
                    {!isProOuBoost ? (
                      <span className="bg-artPurple/10 text-artPurple border border-artPurple/20 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                        Pro & Boost
                      </span>
                    ) : (
                      <span className="text-[9px] text-artPurple font-bold">Ativado</span>
                    )}
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 ${!isProOuBoost ? "opacity-50 select-none pointer-events-none" : ""}`}>
                    {/* Marca d'água */}
                    <label
                      className={`flex flex-col justify-between items-center text-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isProOuBoost && marcaDagua
                          ? "bg-artPurple/[0.08] border-artPurple/30 shadow-xs"
                          : "bg-artPurple/[0.03] hover:bg-artPurple/[0.06] border-artPurple/10"
                      }`}
                      title="Marca d'água Artfolio com seu nome"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className="w-7 h-7 rounded-lg bg-artPurple/10 text-artPurple flex items-center justify-center text-xs mb-1">
                          <i className="fa-solid fa-fingerprint"></i>
                        </div>
                        <span className="text-[11px] font-bold text-artDark leading-tight">Marca D'água</span>
                        <span className="text-[9px] text-gray-500 leading-tight mt-0.5">Assinatura na obra</span>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-artPurple/10 w-full flex items-center justify-center">
                        <input
                          type="checkbox"
                          disabled={!isProOuBoost}
                          checked={isProOuBoost && marcaDagua}
                          onChange={(e) => setMarcaDagua(e.target.checked)}
                          className="w-4 h-4 text-artPurple rounded accent-artPurple cursor-pointer"
                        />
                      </div>
                    </label>

                    {/* Anti-Print */}
                    <label
                      className={`flex flex-col justify-between items-center text-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isProOuBoost && bloquearPrint
                          ? "bg-artBlue/[0.08] border-artBlue/30 shadow-xs"
                          : "bg-artBlue/[0.03] hover:bg-artBlue/[0.06] border-artBlue/10"
                      }`}
                      title="Proteção contra printscreen e capturas de tela"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className="w-7 h-7 rounded-lg bg-artBlue/10 text-artBlue flex items-center justify-center text-xs mb-1">
                          <i className="fa-solid fa-camera"></i>
                        </div>
                        <span className="text-[11px] font-bold text-artDark leading-tight">Anti-Print</span>
                        <span className="text-[9px] text-gray-500 leading-tight mt-0.5">Bloqueia capturas</span>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-artBlue/10 w-full flex items-center justify-center">
                        <input
                          type="checkbox"
                          disabled={!isProOuBoost}
                          checked={isProOuBoost && bloquearPrint}
                          onChange={(e) => setBloquearPrint(e.target.checked)}
                          className="w-4 h-4 text-artBlue rounded accent-artBlue cursor-pointer"
                        />
                      </div>
                    </label>

                    {/* Modo Prévia (Redução de Resolução para Proteção) */}
                    <label
                      className={`flex flex-col justify-between items-center text-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isProOuBoost && reduzirQualidade
                          ? "bg-amber-500/[0.08] border-amber-500/30 shadow-xs"
                          : "bg-amber-500/[0.03] hover:bg-amber-500/[0.06] border-amber-500/10"
                      }`}
                      title="Reduz resolução para modo prévia protegido contra cópias de alta definição"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs mb-1">
                          <i className="fa-solid fa-compress"></i>
                        </div>
                        <span className="text-[11px] font-bold text-artDark leading-tight">Modo Prévia</span>
                        <span className="text-[9px] text-gray-500 leading-tight mt-0.5">Reduz resolução</span>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-amber-500/10 w-full flex items-center justify-center">
                        <input
                          type="checkbox"
                          disabled={!isProOuBoost}
                          checked={isProOuBoost && reduzirQualidade}
                          onChange={(e) => setReduzirQualidade(e.target.checked)}
                          className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Opção da Paleta Cromática da Obra */}
              <div className="bg-white/90 border border-artOrange/20 rounded-2xl p-3 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-artOrange/15 text-artOrange flex items-center justify-center text-[9px]">
                      <i className="fa-solid fa-palette"></i>
                    </span>
                    <span>Paleta Cromática</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <span className="text-[11px] font-bold text-gray-600">Exibir paleta HEX</span>
                    <input
                      type="checkbox"
                      checked={exibirPaleta}
                      onChange={(e) => setExibirPaleta(e.target.checked)}
                      className="w-3.5 h-3.5 text-artOrange rounded focus:ring-artOrange border-gray-300 cursor-pointer accent-artOrange"
                    />
                  </label>
                </div>

                {exibirPaleta && (
                  <div className="space-y-2 pt-1.5 border-t border-black/5 animate-fadeIn">
                    {/* Opção Auto vs Custom */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
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
                        <i className="fa-solid fa-wand-magic-sparkles text-[9px]"></i>
                        <span>Auto (Extrair da Imagem)</span>
                      </label>

                      <label className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
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
                        <i className="fa-solid fa-paint-brush text-[9px]"></i>
                        <span>Manual (5 Cores)</span>
                      </label>
                    </div>

                    {modoPaleta === "custom" && (
                      <div className="p-2 bg-[#F9F8F6] rounded-xl border border-artPurple/20 space-y-1.5 animate-fadeIn">
                        <div className="grid grid-cols-5 gap-1.5">
                          {coresCustomizadas.map((cor, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <div className="relative w-full h-8 rounded-lg overflow-hidden shadow-xs border border-black/10 flex items-center justify-center cursor-pointer group">
                                <input
                                  type="color"
                                  value={cor}
                                  onChange={(e) => {
                                    const nova = [...coresCustomizadas];
                                    nova[idx] = e.target.value.toUpperCase();
                                    setCoresCustomizadas(nova);
                                  }}
                                  className="absolute inset-0 w-[150%] h-[150%] -top-2 -left-2 cursor-pointer opacity-0"
                                  title="Clique para escolher a cor"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: cor }} />
                                <i className="fa-solid fa-eye-dropper text-white text-[9px] absolute drop-shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></i>
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
                                className="w-full text-center text-[9px] font-mono font-bold bg-white border border-gray-200 rounded py-0.5 outline-none focus:border-artPurple uppercase"
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
              <div className="bg-white/90 border border-artBlue/20 rounded-2xl p-3 shadow-2xs space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-artDark flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-artBlue/15 text-artBlue flex items-center justify-center text-[9px]">
                      <i className="fa-solid fa-swatchbook"></i>
                    </span>
                    <span>Categorias ({categoriasSelecionadas.length}/3)</span>
                  </label>
                  {categoriasSelecionadas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCategoriasSelecionadas([])}
                      className="text-[10px] font-bold text-gray-400 hover:text-artOrange transition-colors cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Alerta animado de limite de 3 categorias */}
                {avisoCategorias && (
                  <div className="px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-artOrange text-[10px] font-bold flex items-center gap-1.5 animate-fadeIn">
                    <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                    <span>Máximo de 3 categorias. Desmarque uma para adicionar outra.</span>
                  </div>
                )}

                {/* Tags Selecionadas */}
                {categoriasSelecionadas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {categoriasSelecionadas.map((cat) => (
                      <span
                        key={cat}
                        className="bg-gradient-to-r from-artPurple via-artOrange to-artBlue text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCategoria(cat)}
                          className="hover:text-amber-200 hover:scale-125 transition-transform"
                          title="Remover"
                        >
                          <i className="fa-solid fa-xmark text-[9px]"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Desafio Semanal Ativo */}
                {desafioAtual && (
                  <div className="p-2 rounded-xl bg-gradient-to-r from-artPurple/10 via-artOrange/10 to-artBlue/10 border border-artPurple/20 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-artPurple to-artOrange text-white flex items-center justify-center text-[10px] shadow-2xs shrink-0">
                        <i className="fa-solid fa-bolt"></i>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-artPurple block leading-none">
                          ⚡ Desafio Semanal
                        </span>
                        <h4 className="text-[11px] font-bold text-artDark truncate leading-tight">
                          {desafioAtual.nomeCategoria}
                        </h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleCategoria(desafioAtual.nomeCategoria)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        categoriasSelecionadas.includes(desafioAtual.nomeCategoria)
                          ? "bg-artPurple text-white shadow-2xs"
                          : "bg-white border border-artPurple/40 text-artPurple hover:bg-artPurple hover:text-white"
                      }`}
                    >
                      <i className={`fa-solid ${categoriasSelecionadas.includes(desafioAtual.nomeCategoria) ? "fa-check" : "fa-plus"} text-[8px]`}></i>
                      <span>{categoriasSelecionadas.includes(desafioAtual.nomeCategoria) ? "Participando" : "Participar"}</span>
                    </button>
                  </div>
                )}

                {/* Seletor Compacto com Setinhas e Todas as Subcategorias */}
                <div className="bg-[#F9F8F6] border border-artBlue/15 rounded-xl p-2 space-y-2">
                  {/* Pílulas de Setores com Setinhas de Navegação */}
                  <div className="relative group/setores">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("modal-setores-scroll");
                        if (el) el.scrollBy({ left: -140, behavior: "smooth" });
                      }}
                      className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-md border border-black/10 flex items-center justify-center text-[9px] text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Rolar setores para a esquerda"
                    >
                      <i className="fa-solid fa-chevron-left text-[7px]"></i>
                    </button>

                    <div
                      id="modal-setores-scroll"
                      className="flex gap-1 overflow-x-auto pb-0.5 scroll-smooth no-scrollbar px-3"
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
                            className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 flex items-center gap-1 border cursor-pointer ${
                              isSelected
                                ? `${setor.corBg} border-transparent shadow-2xs scale-105`
                                : "bg-white text-gray-600 border-black/5 hover:bg-gray-100"
                            }`}
                          >
                            <i className={`${setor.icone} text-[8px]`}></i>
                            <span>{setor.nome}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("modal-setores-scroll");
                        if (el) el.scrollBy({ left: 140, behavior: "smooth" });
                      }}
                      className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-md border border-black/10 flex items-center justify-center text-[9px] text-artDark hover:bg-gray-100 z-20 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Rolar setores para a direita"
                    >
                      <i className="fa-solid fa-chevron-right text-[7px]"></i>
                    </button>
                  </div>

                  {/* Campo de Busca Rápida */}
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass text-[10px] text-artBlue absolute left-2.5 top-1/2 -translate-y-1/2"></i>
                    <input
                      type="text"
                      value={buscaCategoria}
                      onChange={(e) => setBuscaCategoria(e.target.value)}
                      placeholder="Filtrar categorias ou subcategorias..."
                      className="w-full bg-white border border-artBlue/20 rounded-lg pl-7 pr-2 py-1 text-[11px] text-artDark placeholder:text-gray-400 focus:ring-1 focus:ring-artBlue/40 outline-none"
                    />
                  </div>

                  {/* Grade com TODAS as Subcategorias Disponíveis e Rolagem */}
                  <div className="max-h-28 overflow-y-auto flex flex-wrap gap-1 p-0.5 custom-scrollbar">
                    {categoriasFiltradas.map((cat) => {
                      const isSelected = categoriasSelecionadas.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleToggleCategoria(cat)}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-all border ${
                            isSelected
                              ? "bg-gradient-to-r from-artPurple via-artOrange to-artBlue text-white border-transparent shadow-2xs font-bold scale-105"
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

