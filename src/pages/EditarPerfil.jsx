import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService, usuarioService, obrasService, getMediaUrl } from "../services/api";

const categorias = [
  { value: "pintura-digital", label: "Pintura Digital" },
  { value: "modelagem-3d", label: "Modelagem 3D" },
  { value: "textil", label: "Têxtil" },
  { value: "artesanato", label: "Artesanato" },
  { value: "desenho", label: "Desenho Manual" },
  { value: "ilustracao", label: "Ilustração" },
  { value: "arte-conceitual", label: "Arte Conceitual" },
];

function EditarPerfil() {
  const navigate = useNavigate();

  // Estados dos campos do formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [biografia, setBiografia] = useState("");
  const [instagram, setInstagram] = useState("");
  const [behance, setBehance] = useState("");
  const [website, setWebsite] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");

  // Dados extras (somente leitura, vindos da API)
  const [tipoConta, setTipoConta] = useState("cliente");
  const [email, setEmail] = useState("");
  const [fundoPerfil, setFundoPerfil] = useState("");

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info"); // "info" | "success" | "error"

  const isArtista = tipoConta === "artista";

  const nomeSeparado = nome.trim().split(" ");
  const primeiroNome = nomeSeparado[0] || "Perfil";
  const restanteNome = nomeSeparado.slice(1).join(" ");

  // Carregar dados do usuário ao montar o componente
  const { user: authUser, refreshUser } = useAuth();
  const planoUsuario = (authUser?.plano || "").toLowerCase();
  const isProOuBoost = planoUsuario === "boost" || planoUsuario === "pro";
  const isBoost = planoUsuario === "boost";
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerFileInputRef = useRef(null);

  // Estados de Estética Avançada do Perfil (Fundo, Cor do Nick e LED)
  const [corNomeHex, setCorNomeHex] = useState("");
  const [corLedHex, setCorLedHex] = useState(() => localStorage.getItem("artfolio_boost_led_color") || "#FF793F");
  const [mostrarMolduraLed, setMostrarMolduraLed] = useState(true);
  const [mostrarBadgePlano, setMostrarBadgePlano] = useState(true);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const usuario = await authService.getMe();
        setNome(usuario.nome || "");
        setTelefone(usuario.telefone || "");
        setBiografia(usuario.biografia || "");
        setInstagram(usuario.instagram || "");
        setBehance(usuario.behance || "");
        setWebsite(usuario.website || "");
        setPortfolio(usuario.portfolio || "");
        setFotoPerfil(usuario.fotoPerfil || "");
        setImagePreview(getMediaUrl(usuario.fotoPerfil) || "");
        setTipoConta(usuario.tipo_conta || "cliente");
        setEmail(usuario.email || "");

        const bgSalvo = localStorage.getItem(`artfolio_boost_profile_bg_${usuario.id}`) || usuario.fundo_perfil || "";
        setFundoPerfil(bgSalvo);

        const nickSalvo = localStorage.getItem(`artfolio_profile_nick_color_${usuario.id}`) || usuario.cor_nome_hex || usuario.corNomeHex || "";
        setCorNomeHex(nickSalvo);

        const ledSalvo = localStorage.getItem("artfolio_boost_led_color") || usuario.cor_led_hex || usuario.cor_led || "#FF793F";
        setCorLedHex(ledSalvo);

        setMostrarMolduraLed(usuario.mostrar_moldura_led !== false && localStorage.getItem("artfolio_mostrar_moldura_led") !== "false");
        setMostrarBadgePlano(usuario.mostrar_badge_plano !== false && localStorage.getItem("artfolio_mostrar_badge_plano") !== "false");
      } catch (error) {
        mostrarAviso("Erro ao carregar dados do perfil. Faça login novamente.", "error");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleFundoPerfilChange = (novoBg) => {
    setFundoPerfil(novoBg);
    if (authUser?.id) {
      localStorage.setItem(`artfolio_boost_profile_bg_${authUser.id}`, novoBg);
      window.dispatchEvent(
        new CustomEvent("artfolio_profile_prefs_changed", {
          detail: { fundoPerfil: novoBg },
        })
      );
    }
  };

  const handleCorNomeChange = (novaCor) => {
    setCorNomeHex(novaCor);
    if (authUser?.id) {
      localStorage.setItem(`artfolio_profile_nick_color_${authUser.id}`, novaCor);
      window.dispatchEvent(
        new CustomEvent("artfolio_profile_prefs_changed", {
          detail: { corNomeHex: novaCor, corNickHex: novaCor },
        })
      );
    }
  };

  const handleCorLedChange = (novaCor) => {
    setCorLedHex(novaCor);
    localStorage.setItem("artfolio_boost_led_color", novaCor);
    window.dispatchEvent(
      new CustomEvent("artfolio_profile_prefs_changed", {
        detail: { corLedHex: novaCor, corLed: novaCor },
      })
    );
  };

  const handleToggleMolduraLed = (valor) => {
    setMostrarMolduraLed(valor);
    localStorage.setItem("artfolio_mostrar_moldura_led", String(valor));
    window.dispatchEvent(
      new CustomEvent("artfolio_profile_prefs_changed", {
        detail: { mostrarMolduraLed: valor },
      })
    );
  };

  const handleToggleBadgePlano = (valor) => {
    setMostrarBadgePlano(valor);
    localStorage.setItem("artfolio_mostrar_badge_plano", String(valor));
    window.dispatchEvent(
      new CustomEvent("artfolio_profile_prefs_changed", {
        detail: { mostrarBadgePlano: valor },
      })
    );
  };

  const handleBannerFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      mostrarAviso("Selecione apenas arquivos de imagem para o banner.", "error");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      mostrarAviso("O banner excede o tamanho máximo de 15MB.", "error");
      return;
    }

    setUploadingBanner(true);
    try {
      const uploadRes = await obrasService.uploadImagem(file);
      if (uploadRes?.url) {
        handleFundoPerfilChange(uploadRes.url);
        mostrarAviso("Imagem de fundo atualizada com sucesso!", "success");
      }
    } catch (err) {
      console.error("Erro ao enviar banner:", err);
      mostrarAviso("Falha ao enviar a imagem de fundo.", "error");
    } finally {
      setUploadingBanner(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
    if (isGif && !isBoost) {
      mostrarAviso("O upload de avatar animado em formato GIF é um recurso exclusivo para assinantes do plano Artfolio Boost.", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      mostrarAviso("Selecione apenas arquivos de imagem válidos (JPG, PNG, WEBP" + (isBoost ? ", GIF" : "") + ").", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      mostrarAviso("A imagem excede o tamanho máximo permitido de 5 MB.", "error");
      return;
    }

    setUploadingPhoto(true);
    try {
      const usuarioAtualizado = await usuarioService.uploadFotoPerfil(file);
      const novaFoto = usuarioAtualizado.fotoPerfil;
      setFotoPerfil(novaFoto || "");
      setImagePreview(getMediaUrl(novaFoto) || "");
      setNomeArquivo("");
      await refreshUser();
      mostrarAviso(isGif ? "Avatar animado (GIF) atualizado com sucesso!" : "Foto de perfil atualizada com sucesso!", "success");
    } catch (error) {
      mostrarAviso(error.message || "Erro ao fazer upload da foto de perfil.", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemoverFoto = async () => {
    setUploadingPhoto(true);
    try {
      await usuarioService.removerFotoPerfil();
      setFotoPerfil("");
      setImagePreview("");
      setNomeArquivo("");
      await refreshUser();
      mostrarAviso("Foto de perfil removida com sucesso!", "success");
    } catch (error) {
      mostrarAviso(error.message || "Erro ao remover a foto de perfil.", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const dados = {};
      const usuarioAtual = authUser;

      if (nome !== (usuarioAtual?.nome || "")) dados.nome = nome;
      if (telefone !== (usuarioAtual?.telefone || "")) dados.telefone = telefone || null;
      if (biografia !== (usuarioAtual?.biografia || "")) dados.biografia = biografia || null;
      if (instagram !== (usuarioAtual?.instagram || "")) dados.instagram = instagram || null;
      if (behance !== (usuarioAtual?.behance || "")) dados.behance = behance || null;
      if (website !== (usuarioAtual?.website || "")) dados.website = website || null;
      if (portfolio !== (usuarioAtual?.portfolio || "")) dados.portfolio = portfolio || null;
      if (corNomeHex !== (usuarioAtual?.cor_nome_hex || "")) dados.cor_nome_hex = corNomeHex || null;
      if (corLedHex !== (usuarioAtual?.cor_led_hex || "")) dados.cor_led_hex = corLedHex || null;
      if (mostrarMolduraLed !== (usuarioAtual?.mostrar_moldura_led !== false)) dados.mostrar_moldura_led = mostrarMolduraLed;
      if (mostrarBadgePlano !== (usuarioAtual?.mostrar_badge_plano !== false)) dados.mostrar_badge_plano = mostrarBadgePlano;

      if (Object.keys(dados).length === 0) {
        mostrarAviso("Nenhuma alteração detectada.", "info");
        setSaving(false);
        return;
      }

      const usuarioAtualizado = await usuarioService.atualizarPerfil(dados);

      setNome(usuarioAtualizado.nome || "");
      setTelefone(usuarioAtualizado.telefone || "");
      setBiografia(usuarioAtualizado.biografia || "");
      setInstagram(usuarioAtualizado.instagram || "");
      setBehance(usuarioAtualizado.behance || "");
      setWebsite(usuarioAtualizado.website || "");
      setPortfolio(usuarioAtualizado.portfolio || "");

      await refreshUser();
      mostrarAviso("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      mostrarAviso(error.message || "Erro ao salvar alterações.", "error");
    } finally {
      setSaving(false);
    }
  };

  const noticeStyles = {
    info: "bg-artOrange/10 text-artOrange border-artOrange/10",
    success: "bg-green-50 text-green-600 border-green-200",
    error: "bg-red-50 text-red-500 border-red-200",
  };

  const noticeIcons = {
    info: "fa-solid fa-circle-info",
    success: "fa-solid fa-circle-check",
    error: "fa-solid fa-circle-exclamation",
  };

  if (loading) {
    return (
      <div className="w-full text-artDark antialiased min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-artPurple mb-4"></i>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-10">
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
                disabled={saving}
                className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk mr-2"></i>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </header>

          {noticeMessage && (
            <div className={`${noticeStyles[noticeType]} border rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold`}>
              <i className={`${noticeIcons[noticeType]} mr-2`}></i>
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
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-[2.3rem] overflow-hidden border-4 border-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 bg-gray-100 relative">
                      {uploadingPhoto ? (
                        <div className="w-full h-full bg-black/40 flex items-center justify-center text-white">
                          <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
                        </div>
                      ) : imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-artPurple/10 flex items-center justify-center">
                          <i className="fa-solid fa-user text-4xl text-artPurple/30"></i>
                        </div>
                      )}
                    </div>

                    <label className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-artOrange text-white flex items-center justify-center shadow-lg border-4 border-white cursor-pointer hover:bg-artPurple transition-colors">
                      <i className={`fa-solid ${uploadingPhoto ? "fa-spinner fa-spin" : "fa-camera"} text-sm`}></i>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onClick={(e) => { e.target.value = null; }}
                        onChange={handleFileChange}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {fotoPerfil && (
                    <button
                      type="button"
                      onClick={handleRemoverFoto}
                      disabled={uploadingPhoto}
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline flex items-center justify-center gap-1.5 mb-3"
                    >
                      <i className="fa-solid fa-trash text-[10px]"></i>
                      Remover foto
                    </button>
                  )}

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

                  <div className="mt-6 w-full">
                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3">
                      <p className="text-sm font-black text-artPurple uppercase">
                        {tipoConta}
                      </p>
                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                        Tipo de conta
                      </span>
                    </div>
                  </div>

                  {/* Personalização Estética Completa do Perfil (Fundo, Nickname, LED e Selo) */}
                  <div className="mt-4 bg-gradient-to-br from-artOrange/5 via-artPurple/5 to-transparent border border-artOrange/20 rounded-[1.5rem] p-4 text-left w-full space-y-4">
                    
                    {/* 1. SEÇÃO PLANO DE FUNDO (EXCLUSIVO BOOST) */}
                    <div className="space-y-2.5 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-artOrange flex items-center gap-1.5">
                          <i className="fa-solid fa-wand-magic-sparkles"></i>
                          Fundo do Perfil
                        </span>
                        {isBoost ? (
                          fundoPerfil && (
                            <button
                              type="button"
                              onClick={() => handleFundoPerfilChange("")}
                              className="text-[9px] font-bold text-gray-400 hover:text-red-500 cursor-pointer"
                            >
                              Redefinir
                            </button>
                          )
                        ) : (
                          <span className="bg-artOrange/10 text-artOrange border border-artOrange/25 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <i className="fa-solid fa-lock text-[8px]"></i>
                            Exclusivo Boost
                          </span>
                        )}
                      </div>

                      {!isBoost && (
                        <div className="p-2 rounded-xl bg-artOrange/[0.06] border border-artOrange/20 text-[10px] text-artOrange font-medium flex items-center gap-2">
                          <i className="fa-solid fa-lock text-xs shrink-0"></i>
                          <span>O plano de fundo personalizado (estático ou cores HEX) é exclusivo do plano <strong>Artfolio Boost</strong>.</span>
                        </div>
                      )}

                      <div className={`space-y-2.5 ${!isBoost ? "opacity-50 select-none pointer-events-none blur-[0.5px]" : ""}`}>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          Personalize o fundo do seu cabeçalho com temas, cores HEX ou imagens estáticas:
                        </p>

                        {/* Temas Pré-definidos */}
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { id: "sunset", label: "Aurora", bg: "linear-gradient(135deg, rgba(255,121,63,0.18), rgba(108,92,231,0.18), rgba(255,118,117,0.15))" },
                            { id: "cyber", label: "Cyber", bg: "linear-gradient(135deg, rgba(9,132,227,0.18), rgba(108,92,231,0.22), rgba(232,67,147,0.15))" },
                            { id: "emerald", label: "Oasis", bg: "linear-gradient(135deg, rgba(0,184,148,0.18), rgba(9,132,227,0.15), rgba(85,239,196,0.15))" },
                            { id: "dark", label: "Obsidian", bg: "linear-gradient(135deg, #1e272e, #2d3436, #000000)" },
                          ].map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              disabled={!isBoost}
                              onClick={() => handleFundoPerfilChange(preset.bg)}
                              className={`h-8 rounded-xl border text-[9px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                                fundoPerfil === preset.bg
                                  ? "border-artOrange ring-2 ring-artOrange/40 scale-105"
                                  : "border-black/10 hover:opacity-80"
                              } ${preset.id === "dark" ? "text-white" : "text-artDark"}`}
                              style={{ background: preset.bg }}
                              title={preset.label}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>

                        {/* Seletor de Cor HEX para o Fundo */}
                        <div>
                          <label className="text-[9px] font-bold uppercase text-gray-500 block mb-1 flex items-center gap-1.5">
                            <i className="fa-solid fa-palette text-artPurple text-[10px]"></i>
                            <span>Cor HEX do Fundo:</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-black/15 shrink-0 flex items-center justify-center cursor-pointer group">
                              <input
                                type="color"
                                disabled={!isBoost}
                                value={fundoPerfil.startsWith("#") ? fundoPerfil : "#FF793F"}
                                onChange={(e) => handleFundoPerfilChange(e.target.value.toUpperCase())}
                                className="absolute inset-0 w-[150%] h-[150%] -top-2 -left-2 cursor-pointer opacity-0"
                                title="Escolher cor no seletor"
                              />
                              <div
                                className="w-full h-full"
                                style={{ backgroundColor: fundoPerfil.startsWith("#") ? fundoPerfil : "#FF793F" }}
                              />
                              <i className="fa-solid fa-eye-dropper text-white text-[9px] absolute drop-shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></i>
                            </div>
                            <input
                              type="text"
                              disabled={!isBoost}
                              value={fundoPerfil.startsWith("#") ? fundoPerfil : ""}
                              onChange={(e) => handleFundoPerfilChange(e.target.value)}
                              placeholder="#FF793F"
                              maxLength={7}
                              className="w-full bg-[#F9F8F6] rounded-xl px-3 py-1.5 text-xs font-mono font-bold outline-none focus:ring-1 ring-artOrange/50 border border-black/5 uppercase"
                            />
                          </div>
                        </div>

                        {/* Upload de Imagem de Banner ou URL (Estática apenas - sem GIF/Vídeo) */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase text-gray-500 block flex items-center gap-1.5">
                            <i className="fa-solid fa-image text-artOrange text-[10px]"></i>
                            <span>Imagem Estática de Banner (JPG/PNG):</span>
                          </label>
                          
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={!isBoost || uploadingBanner}
                              onClick={() => bannerFileInputRef.current?.click()}
                              className="bg-white border border-artOrange/30 hover:border-artOrange text-artDark hover:text-artOrange px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                            >
                              <i className={uploadingBanner ? "fa-solid fa-spinner fa-spin text-artOrange" : "fa-solid fa-cloud-arrow-up text-artOrange"}></i>
                              <span>{uploadingBanner ? "Enviando..." : "Upload do PC"}</span>
                            </button>
                            
                            <input
                              type="text"
                              disabled={!isBoost}
                              value={fundoPerfil.startsWith("http") ? fundoPerfil : ""}
                              onChange={(e) => handleFundoPerfilChange(e.target.value)}
                              placeholder="Ou cole URL da imagem..."
                              className="w-full bg-[#F9F8F6] rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 ring-artOrange/50 border border-black/5"
                            />
                          </div>

                          <input
                            ref={bannerFileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleBannerFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. SEÇÃO COR DO NOME / NICKNAME NO PERFIL (EXCLUSIVO BOOST) */}
                    <div className="pt-3 border-t border-black/5 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-artPurple flex items-center gap-1.5">
                          <i className="fa-solid fa-font"></i>
                          Cor do Nome / Nick no Perfil
                        </span>
                        {isBoost ? (
                          corNomeHex && (
                            <button
                              type="button"
                              onClick={() => handleCorNomeChange("")}
                              className="text-[9px] font-bold text-gray-400 hover:text-red-500 cursor-pointer"
                            >
                              Padrão
                            </button>
                          )
                        ) : (
                          <span className="bg-artOrange/10 text-artOrange border border-artOrange/25 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <i className="fa-solid fa-lock text-[8px]"></i>
                            Exclusivo Boost
                          </span>
                        )}
                      </div>

                      {!isBoost && (
                        <div className="p-2 rounded-xl bg-artPurple/[0.06] border border-artPurple/20 text-[10px] text-artPurple font-medium flex items-center gap-2">
                          <i className="fa-solid fa-lock text-xs shrink-0"></i>
                          <span>A cor personalizada do nick é exclusiva do plano <strong>Artfolio Boost</strong>.</span>
                        </div>
                      )}

                      <div className={`space-y-2 ${!isBoost ? "opacity-50 select-none pointer-events-none blur-[0.5px]" : ""}`}>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          Destaque seu nick com a cor ideal para contrastar com seu perfil:
                        </p>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { hex: "#FFFFFF", label: "Branco" },
                            { hex: "#2D3436", label: "Preto" },
                            { hex: "#FF793F", label: "Laranja" },
                            { hex: "#6C5CE7", label: "Roxo" },
                            { hex: "#00B894", label: "Esmeralda" },
                            { hex: "#0984E3", label: "Azul" },
                            { hex: "#FDCB6E", label: "Dourado" },
                          ].map((item) => (
                            <button
                              key={item.hex}
                              type="button"
                              disabled={!isBoost}
                              onClick={() => handleCorNomeChange(item.hex)}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                corNomeHex.toUpperCase() === item.hex.toUpperCase()
                                  ? "ring-2 ring-artPurple scale-110 shadow-xs"
                                  : "border-black/10 hover:scale-105"
                              }`}
                              style={{ backgroundColor: item.hex }}
                              title={item.label}
                            >
                              {corNomeHex.toUpperCase() === item.hex.toUpperCase() && (
                                <i className={`fa-solid fa-check text-[9px] ${item.hex === "#FFFFFF" || item.hex === "#FDCB6E" ? "text-black" : "text-white"}`}></i>
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-black/15 shrink-0 flex items-center justify-center cursor-pointer group">
                            <input
                              type="color"
                              disabled={!isBoost}
                              value={corNomeHex || "#2D3436"}
                              onChange={(e) => handleCorNomeChange(e.target.value.toUpperCase())}
                              className="absolute inset-0 w-[150%] h-[150%] -top-2 -left-2 cursor-pointer opacity-0"
                              title="Escolher cor personalizada para o nick"
                            />
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: corNomeHex || "#2D3436" }}
                            />
                            <i className="fa-solid fa-eye-dropper text-white text-[9px] absolute drop-shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></i>
                          </div>
                          <input
                            type="text"
                            disabled={!isBoost}
                            value={corNomeHex}
                            onChange={(e) => handleCorNomeChange(e.target.value)}
                            placeholder="#HEX personalizado (ex: #FFFFFF)"
                            maxLength={7}
                            className="w-full bg-[#F9F8F6] rounded-xl px-3 py-1.5 text-xs font-mono font-bold outline-none focus:ring-1 ring-artPurple/50 border border-black/5 uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. SEÇÃO COR DO LED DO AVATAR (PRO & BOOST) */}
                    <div className="pt-3 border-t border-black/5 space-y-2.5 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                          <i className="fa-solid fa-lightbulb"></i>
                          Iluminação LED Neon do Avatar
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {!isProOuBoost && (
                            <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              <i className="fa-solid fa-lock text-[8px]"></i>
                              Pro & Boost
                            </span>
                          )}
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <span className="text-[10px] font-bold text-gray-500">Exibir LED</span>
                            <input
                              type="checkbox"
                              checked={mostrarMolduraLed}
                              onChange={(e) => handleToggleMolduraLed(e.target.checked)}
                              className="w-3.5 h-3.5 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                            />
                          </label>
                        </div>
                      </div>

                      {!isProOuBoost && mostrarMolduraLed && (
                        <div className="p-2 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-[10px] text-emerald-700 font-medium flex items-center gap-2">
                          <i className="fa-solid fa-circle-info text-xs shrink-0"></i>
                          <span>No plano Free a moldura LED é fixa na cor verde padrão. Troca de cor liberada nos planos <strong>Pro</strong> e <strong>Boost</strong>.</span>
                        </div>
                      )}

                      {mostrarMolduraLed && (
                        <div className={`space-y-2 animate-fadeIn ${!isProOuBoost ? "opacity-50 select-none pointer-events-none blur-[0.5px]" : ""}`}>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            Escolha a cor do brilho LED que contorna a foto do seu perfil:
                          </p>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { hex: "#FF793F", label: "Laranja Artfolio" },
                              { hex: "#6C5CE7", label: "Roxo Cyber" },
                              { hex: "#00B894", label: "Verde Neon" },
                              { hex: "#0984E3", label: "Azul Elétrico" },
                              { hex: "#E84393", label: "Rosa Magenta" },
                              { hex: "#FDCB6E", label: "Âmbar Solar" },
                              { hex: "#00CEC9", label: "Ciano Brilhante" },
                            ].map((item) => (
                              <button
                                key={item.hex}
                                type="button"
                                disabled={!isProOuBoost}
                                onClick={() => handleCorLedChange(item.hex)}
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                  corLedHex.toUpperCase() === item.hex.toUpperCase()
                                    ? "ring-2 ring-emerald-500 scale-110 shadow-xs"
                                    : "border-black/10 hover:scale-105"
                                }`}
                                style={{ backgroundColor: item.hex }}
                                title={item.label}
                              >
                                {corLedHex.toUpperCase() === item.hex.toUpperCase() && (
                                  <i className="fa-solid fa-check text-[9px] text-white"></i>
                                )}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-0.5">
                            <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-black/15 shrink-0 flex items-center justify-center cursor-pointer group">
                              <input
                                type="color"
                                disabled={!isProOuBoost}
                                value={corLedHex || "#00B894"}
                                onChange={(e) => handleCorLedChange(e.target.value.toUpperCase())}
                                className="absolute inset-0 w-[150%] h-[150%] -top-2 -left-2 cursor-pointer opacity-0"
                                title="Escolher cor personalizada para o LED"
                              />
                              <div
                                className="w-full h-full"
                                style={{ backgroundColor: corLedHex || "#00B894" }}
                              />
                              <i className="fa-solid fa-eye-dropper text-white text-[9px] absolute drop-shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></i>
                            </div>
                            <input
                              type="text"
                              disabled={!isProOuBoost}
                              value={corLedHex}
                              onChange={(e) => handleCorLedChange(e.target.value)}
                              placeholder="#FF793F"
                              maxLength={7}
                              className="w-full bg-[#F9F8F6] rounded-xl px-3 py-1.5 text-xs font-mono font-bold outline-none focus:ring-1 ring-emerald-500/50 border border-black/5 uppercase"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. SEÇÃO EXIBIR SELO DO PLANO NO PERFIL (TODOS OS PLANOS) */}
                    <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-artDark flex items-center gap-1.5">
                          <i className="fa-solid fa-award text-artOrange"></i>
                          Exibir Selo do Plano no Perfil
                        </span>
                        <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                          Mostra o selo (Free, Pro ou Boost) ao lado do seu nome.
                        </p>
                      </div>
                      
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0 ml-3">
                        <input
                          type="checkbox"
                          checked={mostrarBadgePlano}
                          onChange={(e) => handleToggleBadgePlano(e.target.checked)}
                          className="w-4 h-4 text-artOrange rounded cursor-pointer accent-artOrange"
                        />
                      </label>
                    </div>

                  </div>




                  <div className="mt-4 bg-artPurple/5 border border-artPurple/10 rounded-[1.5rem] p-4 text-left w-full">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">
                      Prévia pública
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      Essas informações aparecerão no seu perfil público e nas
                      obras publicadas no Feed.
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
                      Nome completo
                    </label>

                    <input
                      type="text"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      required
                      minLength={3}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Telefone
                    </label>

                    <input
                      type="text"
                      value={telefone}
                      onChange={(event) => setTelefone(event.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      maxLength={20}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Biografia
                      <span className="text-gray-300 ml-2 normal-case tracking-normal font-normal">
                        {biografia.length}/1000
                      </span>
                    </label>

                    <textarea
                      rows="4"
                      value={biografia}
                      onChange={(event) => setBiografia(event.target.value)}
                      maxLength={1000}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm resize-none leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sm:p-6">
                <h2 className="font-editorial text-3xl italic mb-6">
                  Redes sociais e contato
                </h2>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Instagram <span className="text-artOrange font-normal">(ex: @seuusuario)</span>
                    </label>

                    <div className="relative">
                      <i className="fa-brands fa-instagram absolute left-5 top-1/2 -translate-y-1/2 text-artOrange"></i>

                      <input
                        type="text"
                        value={instagram}
                        onChange={(event) => setInstagram(event.target.value)}
                        placeholder="usuario ou https://instagram.com/usuario"
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
                    <span className="text-gray-500">E-mail</span>
                    <strong className="text-artDark text-right">
                      {email || "Não informado"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Telefone</span>
                    <strong className="text-artDark text-right">
                      {telefone || "Não informado"}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Tipo de perfil</span>
                    <strong className="text-artPurple text-right capitalize">
                      {tipoConta}
                    </strong>
                  </div>

                  {instagram && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Instagram</span>
                      <strong className="text-artDark text-right">
                        @{instagram}
                      </strong>
                    </div>
                  )}

                  {behance && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Behance</span>
                      <strong className="text-artDark text-right">
                        {behance}
                      </strong>
                    </div>
                  )}
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
      </div>
  );
}

export default EditarPerfil;