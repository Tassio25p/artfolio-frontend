import { api } from "./api";

export const marcarComoLida = async (conversaId) => {
  try {
    const { data } = await api.patch(`/chat/conversas/${conversaId}/ler`);
    return data;
  } catch (err) {
    console.warn("[mensagemService] Erro ao marcar como lida:", err);
    return null;
  }
};

export default {
  marcarComoLida,
};
