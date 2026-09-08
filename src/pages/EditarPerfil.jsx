import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService, usuarioService, getMediaUrl } from "../services/api";

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

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("info"); // "info" | "success" | "error"

  const isArtista = tipoConta === "artista";

  const nomeSeparado = nome.trim().split(" ");
  const primeiroNome = nomeSeparado[0] || "Perfil";
  const restanteNome = nomeSeparado.slice(1).join(" ");

  // Carregar dados do usuário ao montar o componente
  const { user: authUser, refreshUser } = useAuth();

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
      } catch (error) {
        mostrarAviso("Erro ao carregar dados do perfil. Faça login novamente.", "error");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const mostrarAviso = (mensagem, tipo = "info") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 5000);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      mostrarAviso("Selecione apenas arquivos de imagem (JPG, PNG, WEBP).", "error");
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
      mostrarAviso("Foto de perfil atualizada com sucesso!", "success");
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