import React, { useState, useEffect } from "react";
import { usuarioService, getMediaUrl } from "../services/api";

export default function ModalPortfolioApresentacao({
  isOpen,
  onClose,
  perfil,
  isOwner,
  onAtualizarPerfil,
}) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [enviandoCertificado, setEnviandoCertificado] = useState(false);
  const [msgFeedback, setMsgFeedback] = useState("");

  // Formulário de edição
  const [trajetoria, setTrajetoria] = useState("");
  const [especializacoes, setEspecializacoes] = useState("");
  const [certificados, setCertificados] = useState([]);

  // Novo certificado a adicionar
  const [novoCertTitulo, setNovoCertTitulo] = useState("");
  const [novoCertInstituicao, setNovoCertInstituicao] = useState("");
  const [novoCertAno, setNovoCertAno] = useState("");
  const [novoCertArquivoUrl, setNovoCertArquivoUrl] = useState("");
  const [novoCertNomeArquivo, setNovoCertNomeArquivo] = useState("");

  useEffect(() => {
    if (perfil) {
      setTrajetoria(perfil.trajetoria || "");
      setEspecializacoes(perfil.especializacoes || "");
      try {
        const certs = typeof perfil.certificados === "string"
          ? JSON.parse(perfil.certificados || "[]")
          : perfil.certificados || [];
        setCertificados(Array.isArray(certs) ? certs : []);
      } catch {
        setCertificados([]);
      }
    }
  }, [perfil, isOpen]);

  if (!isOpen || !perfil) return null;

  const handleUploadCertificado = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviandoCertificado(true);
    setMsgFeedback("");
    try {
      const res = await usuarioService.uploadCertificado(file);
      setNovoCertArquivoUrl(res.url);
      setNovoCertNomeArquivo(res.nome || file.name);
      setMsgFeedback("Arquivo anexado com sucesso!");
    } catch (err) {
      setMsgFeedback(err.message || "Erro ao fazer upload do documento.");
    } finally {
      setEnviandoCertificado(false);
    }
  };

  const handleAdicionarCertificado = () => {
    if (!novoCertTitulo.trim()) {
      setMsgFeedback("Informe o título da formação/certificado.");
      return;
    }

    const novo = {
      id: Date.now().toString(),
      titulo: novoCertTitulo.trim(),
      instituicao: novoCertInstituicao.trim(),
      ano: novoCertAno.trim(),
      arquivoUrl: novoCertArquivoUrl,
      nomeArquivo: novoCertNomeArquivo,
    };

    setCertificados((prev) => [...prev, novo]);
    setNovoCertTitulo("");
    setNovoCertInstituicao("");
    setNovoCertAno("");
    setNovoCertArquivoUrl("");
    setNovoCertNomeArquivo("");
    setMsgFeedback("");
  };

  const handleRemoverCertificado = (certId) => {
    setCertificados((prev) => prev.filter((c) => c.id !== certId));
  };

  const handleSalvarTudo = async () => {
    setSalvando(true);
    setMsgFeedback("");
    try {
      await usuarioService.atualizarPerfil({
        trajetoria: trajetoria.trim(),
        especializacoes: especializacoes.trim(),
        certificados: JSON.stringify(certificados),
      });

      setMsgFeedback("Portfólio e currículo artístico atualizados com sucesso!");
      setModoEdicao(false);
      if (onAtualizarPerfil) {
        onAtualizarPerfil();
      }
    } catch (err) {
      setMsgFeedback(err.message || "Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-black/5 shadow-2xl relative">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-file-contract"></i>
            </div>
            <div>
              <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block">
                Portfólio & Currículo Artístico
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl italic font-bold">
                {perfil.nome || "Artista"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && !modoEdicao && (
              <button
                type="button"
                onClick={() => setModoEdicao(true)}
                className="bg-artDark text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-artOrange transition-all flex items-center gap-1.5 shadow-sm"
              >
                <i className="fa-solid fa-pen text-[11px]"></i>
                Editar
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors flex items-center justify-center text-sm"
              title="Fechar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {msgFeedback && (
          <div className="mt-4 p-3 bg-artOrange/10 border border-artOrange/20 rounded-2xl text-xs font-bold text-artOrange flex items-center gap-2">
            <i className="fa-solid fa-circle-info"></i>
            <span>{msgFeedback}</span>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="mt-6 space-y-6 text-sm">
          {modoEdicao ? (
            /* Modo de Edição */
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5">
                  Trajetória Artística & Biografia Profissional
                </label>
                <textarea
                  value={trajetoria}
                  onChange={(e) => setTrajetoria(e.target.value)}
                  placeholder="Descreva sua formação, principais marcos da carreira, exposições, influências e pesquisas..."
                  rows={4}
                  className="w-full bg-[#F9F8F6] border border-black/10 rounded-2xl p-4 outline-none focus:ring-2 ring-artOrange/30 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5">
                  Especializações, Linguagens & Técnicas
                </label>
                <input
                  type="text"
                  value={especializacoes}
                  onChange={(e) => setEspecializacoes(e.target.value)}
                  placeholder="Ex: Pintura a óleo, Ilustração Vetorial 3D, Gravura em Metal, Aquarela..."
                  className="w-full bg-[#F9F8F6] border border-black/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-artOrange/30 text-sm"
                />
              </div>

              {/* Seção de Adicionar Certificado */}
              <div className="p-4 bg-[#F9F8F6] rounded-2xl border border-black/5 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-widest text-artDark flex items-center gap-1.5">
                  <i className="fa-solid fa-plus-circle text-artOrange"></i>
                  Adicionar Certificado / Documento
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={novoCertTitulo}
                    onChange={(e) => setNovoCertTitulo(e.target.value)}
                    placeholder="Título / Formação *"
                    className="bg-white border border-black/10 rounded-xl px-3 py-2 text-xs outline-none col-span-1 sm:col-span-2"
                  />
                  <input
                    type="text"
                    value={novoCertAno}
                    onChange={(e) => setNovoCertAno(e.target.value)}
                    placeholder="Ano (Ex: 2024)"
                    className="bg-white border border-black/10 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={novoCertInstituicao}
                  onChange={(e) => setNovoCertInstituicao(e.target.value)}
                  placeholder="Instituição / Galeria / Emissor"
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs outline-none"
                />

                <div className="flex items-center gap-3 pt-1">
                  <label className="bg-white border border-black/10 text-artDark hover:bg-gray-50 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                    <i className="fa-solid fa-paperclip text-artOrange"></i>
                    {enviandoCertificado ? "Enviando..." : "Anexar Arquivo (PDF / Imagem)"}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleUploadCertificado}
                      disabled={enviandoCertificado}
                      className="hidden"
                    />
                  </label>

                  {novoCertNomeArquivo && (
                    <span className="text-xs text-emerald-600 font-bold truncate max-w-[200px]">
                      <i className="fa-solid fa-check mr-1"></i>
                      {novoCertNomeArquivo}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleAdicionarCertificado}
                    className="ml-auto bg-artOrange text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-artDark transition-all"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Lista de Certificados em Edição */}
              {certificados.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                    Documentos Adicionados ({certificados.length})
                  </span>
                  {certificados.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-black/5 shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-artDark truncate">{cert.titulo}</p>
                        <p className="text-[10px] text-gray-400">
                          {cert.instituicao} {cert.ano ? `• ${cert.ano}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverCertificado(cert.id)}
                        className="text-red-400 hover:text-red-600 text-xs p-1"
                        title="Remover"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Botões Salvar / Cancelar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setModoEdicao(false)}
                  disabled={salvando}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSalvarTudo}
                  disabled={salvando}
                  className="bg-artDark text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-artOrange transition-all shadow-md flex items-center gap-2"
                >
                  {salvando && <i className="fa-solid fa-spinner fa-spin"></i>}
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </div>
          ) : (
            /* Modo de Visualização Dinâmica */
            <div className="space-y-6">
              {/* Biografia / Trajetória */}
              <div>
                <h3 className="font-editorial text-xl italic font-bold mb-2 text-artDark flex items-center gap-2">
                  <i className="fa-solid fa-compass text-artOrange text-base"></i>
                  Trajetória Artística
                </h3>
                <p className="text-gray-600 leading-relaxed font-light whitespace-pre-line bg-[#F9F8F6] p-4 rounded-2xl border border-black/5">
                  {perfil.trajetoria || perfil.biografia || "Nenhuma biografia profissional cadastrada ainda pelo artista."}
                </p>
              </div>

              {/* Especializações */}
              {perfil.especializacoes && (
                <div>
                  <h3 className="font-editorial text-xl italic font-bold mb-2 text-artDark flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-artPurple text-base"></i>
                    Especializações & Técnicas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {perfil.especializacoes.split(",").map((esp, i) => (
                      <span
                        key={i}
                        className="bg-artPurple/10 text-artPurple border border-artPurple/20 px-3 py-1.5 rounded-full text-xs font-bold"
                      >
                        {esp.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificados e Documentos Reais */}
              <div>
                <h3 className="font-editorial text-xl italic font-bold mb-3 text-artDark flex items-center gap-2">
                  <i className="fa-solid fa-award text-amber-500 text-base"></i>
                  Certificações, Formações & Documentos
                </h3>

                {certificados.length === 0 ? (
                  <p className="text-xs text-gray-400 italic p-4 bg-[#F9F8F6] rounded-2xl border border-black/5 text-center">
                    Nenhum documento ou certificado anexado até o momento.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certificados.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 bg-[#F9F8F6] rounded-2xl border border-black/5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
                              {cert.ano || "Certificado"}
                            </span>
                            <i className="fa-solid fa-certificate text-amber-500"></i>
                          </div>
                          <h4 className="font-bold text-sm text-artDark line-clamp-1">{cert.titulo}</h4>
                          {cert.instituicao && (
                            <p className="text-xs text-gray-500 mt-0.5">{cert.instituicao}</p>
                          )}
                        </div>

                        {cert.arquivoUrl && (
                          <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between gap-2">
                            <a
                              href={getMediaUrl(cert.arquivoUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-artPurple hover:underline flex items-center gap-1.5"
                            >
                              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                              Visualizar
                            </a>
                            <a
                              href={getMediaUrl(cert.arquivoUrl)}
                              download={cert.nomeArquivo || `${cert.titulo}.pdf`}
                              className="text-xs font-bold text-artOrange hover:underline flex items-center gap-1.5"
                            >
                              <i className="fa-solid fa-download text-[10px]"></i>
                              Baixar
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
