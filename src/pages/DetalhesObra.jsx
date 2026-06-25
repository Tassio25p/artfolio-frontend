import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MenuOpcoes from "../components/MenuOpcoes";
import ModalDenuncia from "../components/ModalDenuncia";

const obraDetalhe = {
  id: 1,
  titulo: "Abstração em Tons de Púrpura",
  tituloDestaque: "Púrpura.",
  categoria: "Pintura Digital",
  statusModeracao: "Aprovada",
  statusDisponibilidade: "Disponível",
  descricao:
    "Uma composição visual inspirada na mistura entre memória, movimento e camadas emocionais. A obra explora formas orgânicas, cores intensas e texturas digitais.",
  imagem:
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop",
  tags: ["ArteDigital", "Fantasia", "Original"],
  curtidas: 42,
  comentarios: 8,
  views: "1.2k",
  tipo: "Original Digital",
  ano: 2026,
  artista: {
    nome: "Marina Silva",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
  },
};

const comentariosVisuais = [
  {
    id: 1,
    autor: "Gabriel Duarte",
    data: "Hoje",
    texto:
      "A composição ficou incrível, principalmente o contraste das texturas.",
    cor: "bg-artBlue",
  },
  {
    id: 2,
    autor: "Helena Matos",
    data: "Ontem",
    texto: "Essa obra transmite muito movimento. Gostei demais do conceito.",
    cor: "bg-artOrange",
  },
];

function DetalhesObra() {
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);
  const [denunciaAtual, setDenunciaAtual] = useState({
    tipo: "obra",
    alvo: obraDetalhe.titulo,
  });
  const [comentario, setComentario] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const tipoVisualizacao = "dono"; // mude para "visitante" para view de visitante
  const isOwner = tipoVisualizacao === "dono";

  const abrirDenuncia = (tipo, alvo) => {
    setDenunciaAtual({ tipo, alvo });
    setModalDenunciaAberto(true);
  };

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 3000);
  };

  const handleAcaoBackend = (mensagem) => {
    mostrarAviso(mensagem);
  };

  const handleComentario = (event) => {
    event.preventDefault();

    if (!comentario.trim()) return;

    mostrarAviso("O envio real de comentários será integrado ao backend.");
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <section className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-xl shadow-black/5 relative">
              <img
                src={obraDetalhe.imagem}
                alt={`Obra ${obraDetalhe.titulo}`}
                className="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
              />

              <div className="absolute top-5 right-5">
                {isOwner ? (
                  <Link
                    to={`/editar-obra/${obraDetalhe.id}`}
                    className="w-11 h-11 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-artDark hover:text-white transition-all shadow-lg"
                    title="Editar obra"
                  >
                    <i className="fa-solid fa-pen text-sm"></i>
                  </Link>
                ) : (
                  <MenuOpcoes
                    tipo="obra"
                    detalhesLink={`/obra/${obraDetalhe.id}`}
                    onDenunciar={() =>
                      abrirDenuncia("obra", obraDetalhe.titulo)
                    }
                  />
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-5">
            {noticeMessage && (
              <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-5 text-xs font-bold">
                <i className="fa-solid fa-circle-info mr-2"></i>
                {noticeMessage}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px]">
                  {obraDetalhe.categoria}
                </span>

                <span className="bg-artBlue/10 text-artBlue px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  {obraDetalhe.statusModeracao}
                </span>

                {isOwner && (
                  <span className="bg-artOrange/10 text-artOrange px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                    Minha obra
                  </span>
                )}
              </div>

              {!isOwner && (
                <button
                  type="button"
                  onClick={() =>
                    handleAcaoBackend(
                      "A ação de salvar obra será integrada ao backend."
                    )
                  }
                  className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-artDark hover:text-white transition-all shrink-0"
                  title="Salvar obra"
                >
                  <i className="fa-regular fa-bookmark"></i>
                </button>
              )}
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-5xl leading-none mb-4">
              Abstração em Tons de{" "}
              <span className="italic text-artPurple">
                {obraDetalhe.tituloDestaque}
              </span>
            </h1>

            <p className="text-gray-500 leading-relaxed font-light text-sm mb-5">
              {obraDetalhe.descricao}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {obraDetalhe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-artPurple/10 text-artPurple px-3 py-1 rounded-full text-[10px] font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="bg-white rounded-[1.7rem] p-4 border border-black/5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-11 h-11 rounded-full bg-artPurple overflow-hidden shrink-0">
                    <img
                      src={obraDetalhe.artista.avatar}
                      alt={obraDetalhe.artista.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                      Artista
                    </p>

                    <h3 className="font-bold text-base">
                      {obraDetalhe.artista.nome}
                    </h3>
                  </div>
                </div>

                <Link
                  to="/perfil"
                  className="px-4 py-2.5 rounded-full border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:bg-artDark hover:text-white transition-all text-center"
                >
                  Ver Perfil
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white rounded-[1.3rem] p-4 border border-black/5">
                <p className="text-xl font-black">{obraDetalhe.curtidas}</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  Curtidas
                </span>
              </div>

              <div className="bg-white rounded-[1.3rem] p-4 border border-black/5">
                <p className="text-xl font-black">
                  {obraDetalhe.comentarios}
                </p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  Coment.
                </span>
              </div>

              <div className="bg-white rounded-[1.3rem] p-4 border border-black/5">
                <p className="text-xl font-black">{obraDetalhe.views}</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  Views
                </span>
              </div>
            </div>

            <div className="bg-artPurple/5 rounded-[1.7rem] p-5 border border-artPurple/10 mb-5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3">
                Sobre a obra
              </h4>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between gap-4">
                  <span>Tipo</span>
                  <strong className="text-artDark text-right">
                    {obraDetalhe.tipo}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Ano</span>
                  <strong className="text-artDark">{obraDetalhe.ano}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Status</span>
                  <strong className="text-artPurple">
                    {obraDetalhe.statusDisponibilidade}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Moderação</span>
                  <strong className="text-artBlue">
                    {obraDetalhe.statusModeracao}
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-artOrange/5 rounded-[1.7rem] p-4 border border-artOrange/10 mb-5">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">
                    Segurança da comunidade
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Caso identifique plágio, uso indevido de personagem/marca ou
                    conteúdo impróprio, use a opção de denúncia para acionar a
                    moderação.
                  </p>
                </div>
              </div>
            </div>

            {isOwner ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to={`/editar-obra/${obraDetalhe.id}`}
                  className="bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
                >
                  <i className="fa-solid fa-pen mr-2"></i>
                  Editar Obra
                </Link>

                <Link
                  to="/meu-portfolio"
                  className="bg-white border border-black/5 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
                >
                  <i className="fa-solid fa-layer-group mr-2"></i>
                  Gerenciar
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleAcaoBackend(
                      "A ação de curtir será integrada ao backend."
                    )
                  }
                  className="bg-artDark text-white py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
                >
                  <i className="fa-solid fa-heart mr-2"></i>
                  Curtir
                </button>

                <Link
                  to="/mensagens"
                  className="bg-white border border-black/5 py-4 rounded-full text-sm font-bold hover:bg-artDark hover:text-white transition-all text-center"
                >
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Mensagem
                </Link>

                <Link
                  to="/encomendas"
                  className="sm:col-span-2 bg-artOrange text-white py-4 rounded-full text-sm font-bold hover:bg-artDark transition-all text-center"
                >
                  <i className="fa-solid fa-bag-shopping mr-2"></i>
                  Solicitar Encomenda
                </Link>
              </div>
            )}
          </section>
        </div>

        <section className="max-w-6xl mx-auto mt-8 bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-editorial text-3xl italic">Comentários</h2>

            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {obraDetalhe.comentarios} comentários
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {comentariosVisuais.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${item.cor} shrink-0`}
                ></div>

                <div className="flex-1 bg-[#F9F8F6] rounded-[1.3rem] p-4">
                  <div className="flex justify-between gap-3 mb-1">
                    <strong className="text-sm">{item.autor}</strong>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[9px] text-gray-400 uppercase font-bold">
                        {item.data}
                      </span>

                      {!isOwner && (
                        <button
                          type="button"
                          onClick={() =>
                            abrirDenuncia("comentário", item.autor)
                          }
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          title="Denunciar comentário"
                        >
                          <i className="fa-solid fa-ellipsis text-xs"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>

          {!isOwner ? (
            <form onSubmit={handleComentario} className="mt-5 flex gap-3">
              <input
                type="text"
                value={comentario}
                onChange={(event) => setComentario(event.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 bg-[#F9F8F6] rounded-full px-5 py-3.5 outline-none focus:ring-2 ring-artPurple/20 text-sm min-w-0"
              />

              <button
                type="submit"
                className="w-11 h-11 rounded-full bg-artDark text-white hover:bg-artPurple transition-all shrink-0"
                title="Enviar comentário"
              >
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </form>
          ) : (
            <div className="mt-5 bg-[#F9F8F6] rounded-[1.4rem] p-4 text-sm text-gray-500">
              <i className="fa-solid fa-circle-info mr-2 text-artPurple"></i>
              Comentários públicos da sua obra. Respostas e gerenciamento serão
              integrados futuramente ao backend.
            </div>
          )}
        </section>
      </main>

      <ModalDenuncia
        aberto={modalDenunciaAberto}
        onFechar={() => setModalDenunciaAberto(false)}
        tipo={denunciaAtual.tipo}
        alvo={denunciaAtual.alvo}
      />
    </div>
  );
}

export default DetalhesObra;