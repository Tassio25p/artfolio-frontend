import { useState } from "react";
import { obrasService } from "../services/api";

const motivos = [
  "Plágio ou obra copiada",
  "Uso de personagem/marca protegida",
  "Conteúdo ofensivo",
  "Conteúdo impróprio",
  "Spam ou golpe",
  "Outro motivo",
];

export default function ModalDenuncia({
  aberto,
  onFechar,
  tipo = "obra",
  alvo = "conteúdo",
  postagemId = null,
  onSucesso = null,
  onErro = null,
}) {
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erroLocal, setErroLocal] = useState("");

  if (!aberto) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLocal("");

    if (!motivo) {
      setErroLocal("Selecione um motivo para realizar a denúncia.");
      return;
    }

    try {
      setLoading(true);

      if (postagemId) {
        await obrasService.denunciarObra(postagemId, {
          motivo,
          descricao: descricao.trim() || null,
        });

        if (onSucesso) {
          onSucesso("Denúncia enviada com sucesso para a moderação.");
        }
      } else {
        if (onSucesso) {
          onSucesso("Denúncia registrada com sucesso.");
        }
      }

      setMotivo("");
      setDescricao("");
      onFechar();
    } catch (err) {
      const msg = err.message || "Erro ao enviar denúncia.";
      setErroLocal(msg);
      if (onErro) onErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-xl rounded-[2rem] border border-black/5 shadow-2xl shadow-black/20 overflow-hidden">
        <div className="bg-artDark text-white p-6 relative overflow-hidden">
          <button
            type="button"
            onClick={onFechar}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-artDark transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
            Central de denúncias
          </span>

          <h2 className="font-editorial text-4xl italic leading-none">
            Denunciar {tipo === "perfil" ? "perfil" : "obra"}.
          </h2>

          <p className="text-sm text-gray-400 mt-3 max-w-md leading-relaxed">
            Sua denúncia será enviada para análise da moderação. Use este
            recurso para sinalizar plágio, conteúdo impróprio ou uso indevido de
            imagem.
          </p>

          <i className="fa-solid fa-flag absolute -right-6 -bottom-8 text-[8rem] text-white/5 rotate-12"></i>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {erroLocal && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-[1.2rem] p-3 text-xs font-bold">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {erroLocal}
            </div>
          )}

          <div className="bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
              Conteúdo denunciado
            </span>

            <p className="text-sm font-bold text-artDark">{alvo}</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Motivo da denúncia *
            </label>

            <select
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                setErroLocal("");
              }}
              className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm font-bold text-artDark"
              required
            >
              <option value="" disabled>
                Selecione um motivo
              </option>

              {motivos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Descrição opcional
            </label>

            <textarea
              rows="4"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Explique melhor o motivo da denúncia..."
              className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm resize-none leading-relaxed"
            ></textarea>
          </div>

          <div className="bg-artOrange/5 border border-artOrange/10 rounded-[1.5rem] p-4">
            <h3 className="text-sm font-bold mb-1">
              <i className="fa-solid fa-shield-halved text-artOrange mr-2"></i>
              Análise da moderação
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed font-light">
              Após o envio, a denúncia ficará disponível no painel de moderação
              para ser analisada por um moderador ou administrador.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onFechar}
              disabled={loading}
              className="flex-1 bg-[#F9F8F6] border border-black/5 px-6 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Enviando...
                </>
              ) : (
                "Enviar Denúncia"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}