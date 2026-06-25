import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const obrasPendentes = [
  {
    id: 1,
    titulo: "Arte Azul Veloz",
    autor: "Carlos Mendes",
    categoria: "Pintura Digital",
    status: "Pendente",
    enviadoEm: "Hoje",
    alerta: "Possível personagem/marca protegida",
    risco: "Alto",
    imagem:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    titulo: "Cidade Neon",
    autor: "Helena Matos",
    categoria: "3D Art",
    status: "Em análise",
    enviadoEm: "Ontem",
    alerta: "Verificar originalidade da imagem",
    risco: "Médio",
    imagem:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    titulo: "Mascote Estilizado",
    autor: "Rafael Lima",
    categoria: "Ilustração",
    status: "Pendente",
    enviadoEm: "2 dias",
    alerta: "Possível personagem famoso",
    risco: "Alto",
    imagem:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
  },
];

const denuncias = [
  {
    id: 1,
    tipo: "Obra",
    alvo: "Fragmentos de Vidro",
    denunciado: "Marina Silva",
    denunciante: "Gabriel Duarte",
    motivo: "Plágio ou obra copiada",
    status: "Aberta",
    tempo: "12 min",
  },
  {
    id: 2,
    tipo: "Perfil",
    alvo: "Perfil de Ricardo Aris",
    denunciado: "Ricardo Aris",
    denunciante: "Helena Matos",
    motivo: "Spam ou comportamento suspeito",
    status: "Em análise",
    tempo: "1 h",
  },
  {
    id: 3,
    tipo: "Obra",
    alvo: "Mascote Estilizado",
    denunciado: "Rafael Lima",
    denunciante: "Lucas Ferreira",
    motivo: "Uso de personagem/marca protegida",
    status: "Aberta",
    tempo: "Ontem",
  },
];

const usuariosSinalizados = [
  {
    id: 1,
    nome: "Rafael Lima",
    motivo: "3 obras recusadas",
    status: "Monitoramento",
    denuncias: 4,
  },
  {
    id: 2,
    nome: "Ricardo Aris",
    motivo: "2 denúncias recebidas",
    status: "Em análise",
    denuncias: 2,
  },
];

const logs = [
  {
    id: 1,
    acao: "Obra aprovada",
    responsavel: "Moderador Ana",
    tempo: "Hoje",
  },
  {
    id: 2,
    acao: "Denúncia marcada como em análise",
    responsavel: "Admin Artfolio",
    tempo: "Ontem",
  },
  {
    id: 3,
    acao: "Obra recusada por possível violação",
    responsavel: "Moderador João",
    tempo: "2 dias",
  },
];

const areas = [
  { id: "geral", label: "Visão Geral" },
  { id: "quarentena", label: "Quarentena" },
  { id: "denuncias", label: "Denúncias" },
  { id: "usuarios", label: "Usuários" },
  { id: "logs", label: "Logs" },
];

const riscoClasses = {
  Alto: "bg-red-50 text-red-500",
  Médio: "bg-artOrange/10 text-artOrange",
  Baixo: "bg-artBlue/10 text-artBlue",
};

const statusClasses = {
  Pendente: "bg-artOrange/10 text-artOrange",
  "Em análise": "bg-artBlue/10 text-artBlue",
  Aberta: "bg-artOrange/10 text-artOrange",
  Resolvida: "bg-artPurple/10 text-artPurple",
  Monitoramento: "bg-artPurple/10 text-artPurple",
};

export default function Admin() {
  const [areaAtual, setAreaAtual] = useState("geral");
  const [noticeMessage, setNoticeMessage] = useState("");

  const tipoAcesso = "admin"; // Pode ser "admin" ou "moderador"
  const isAdmin = tipoAcesso === "admin";

  const mostrarAviso = (mensagem) => {
    setNoticeMessage(mensagem);
    setTimeout(() => setNoticeMessage(""), 4000);
  };

  const handleAcaoBackend = (mensagem) => {
    mostrarAviso(mensagem);
  };

  const podeMostrar = (area) => {
    return areaAtual === "geral" || areaAtual === area;
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                {isAdmin ? "Painel administrativo" : "Painel de moderação"}
              </span>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-none">
                Moderação<span className="italic text-artOrange">.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Área para analisar obras em quarentena, denúncias de usuários,
                perfis sinalizados e possíveis violações de direitos autorais ou
                regras da comunidade.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/feed"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Feed
              </Link>

              <Link
                to="/notificacoes"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 text-center"
              >
                Ver Notificações
              </Link>
            </div>
          </header>

          {noticeMessage && (
            <div className="bg-artOrange/10 text-artOrange border border-artOrange/10 rounded-[1.3rem] px-5 py-3 mb-6 text-xs font-bold">
              <i className="fa-solid fa-circle-info mr-2"></i>
              {noticeMessage}
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{obrasPendentes.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Obras pendentes
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{denuncias.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Denúncias abertas
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">
                {usuariosSinalizados.length}
              </p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Usuários sinalizados
              </span>
            </div>

            <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
              <p className="text-2xl font-black">{logs.length}</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Logs recentes
              </span>
            </div>
          </section>

          <section className="bg-artOrange/5 border border-artOrange/10 rounded-[1.7rem] p-5 mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-2xl bg-artOrange/10 text-artOrange flex items-center justify-center shrink-0">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  Área restrita a moderadores e administradores
                </h2>

                <p className="text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
                  Futuramente, o acesso será controlado pelo login e pelo papel
                  do usuário. Moderadores analisam conteúdos e denúncias.
                  Administradores possuem acesso completo ao painel.
                </p>
              </div>
            </div>

            <span className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold text-artOrange text-center">
              <i className="fa-solid fa-user-shield mr-2"></i>
              Papel atual: {isAdmin ? "Admin" : "Moderador"}
            </span>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h2 className="font-editorial text-2xl italic mb-4">Áreas</h2>

                <div className="space-y-2">
                  {areas.map((area) => {
                    const areaRestritaAdmin =
                      area.id === "usuarios" && !isAdmin;

                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => {
                          if (areaRestritaAdmin) {
                            mostrarAviso(
                              "A gestão completa de usuários será exclusiva do administrador."
                            );
                            return;
                          }

                          setAreaAtual(area.id);
                        }}
                        className={`w-full px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left transition-all ${
                          areaAtual === area.id
                            ? "bg-artDark text-white shadow-md shadow-black/10"
                            : areaRestritaAdmin
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-[#F9F8F6] text-gray-400 hover:text-artDark hover:bg-[#eae7df]"
                        }`}
                      >
                        {area.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-artDark text-white rounded-[1.7rem] p-5 relative overflow-hidden">
                <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                  Permissões
                </span>

                <h3 className="font-editorial text-2xl italic leading-tight">
                  Plano não é o mesmo que papel.
                </h3>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  O plano define recursos comerciais do artista. O papel define
                  permissões do sistema, como usuário, moderador ou
                  administrador.
                </p>

                <i className="fa-solid fa-user-shield absolute -right-5 -bottom-6 text-[6rem] text-white/5 rotate-12"></i>
              </div>

              <div className="bg-white rounded-[1.7rem] p-5 border border-black/5">
                <h2 className="font-editorial text-2xl italic mb-4">
                  Ações rápidas
                </h2>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setAreaAtual("quarentena")}
                    className="w-full bg-[#F9F8F6] px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left hover:bg-artDark hover:text-white transition-all"
                  >
                    Ver pendentes
                  </button>

                  <button
                    type="button"
                    onClick={() => setAreaAtual("denuncias")}
                    className="w-full bg-[#F9F8F6] px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left hover:bg-artDark hover:text-white transition-all"
                  >
                    Ver denúncias
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (isAdmin) {
                        setAreaAtual("usuarios");
                      } else {
                        mostrarAviso(
                          "Usuários bloqueados serão gerenciados pelo administrador."
                        );
                      }
                    }}
                    className="w-full bg-[#F9F8F6] px-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-left hover:bg-artDark hover:text-white transition-all"
                  >
                    Usuários bloqueados
                  </button>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-9 space-y-5">
              {podeMostrar("quarentena") && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                        Área de quarentena
                      </span>

                      <h2 className="font-editorial text-3xl italic">
                        Obras aguardando análise
                      </h2>
                    </div>

                    <span className="bg-artOrange/10 text-artOrange px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {obrasPendentes.length} pendentes
                    </span>
                  </div>

                  <div className="space-y-4">
                    {obrasPendentes.map((obra) => (
                      <article
                        key={obra.id}
                        className="group bg-[#F9F8F6] rounded-[1.7rem] p-4 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="w-full lg:w-36 h-36 lg:h-24 rounded-[1.3rem] overflow-hidden bg-gray-100 shrink-0">
                            <img
                              src={obra.imagem}
                              alt={obra.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                  statusClasses[obra.status] ||
                                  "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {obra.status}
                              </span>

                              <span className="bg-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-400 border border-black/5">
                                {obra.categoria}
                              </span>

                              <span
                                className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                  riscoClasses[obra.risco] ||
                                  "bg-gray-100 text-gray-400"
                                }`}
                              >
                                Risco {obra.risco}
                              </span>
                            </div>

                            <h3 className="font-bold text-lg leading-tight">
                              {obra.titulo}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              Enviado por <strong>{obra.autor}</strong> •{" "}
                              {obra.enviadoEm}
                            </p>

                            <p className="text-xs text-artOrange font-bold mt-2">
                              <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                              {obra.alerta}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleAcaoBackend(
                                  "A aprovação real da obra será integrada ao backend."
                                )
                              }
                              className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
                            >
                              Aprovar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleAcaoBackend(
                                  "A recusa real da obra será integrada ao backend."
                                )
                              }
                              className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:bg-artOrange hover:text-white transition-all"
                            >
                              Recusar
                            </button>

                            <Link
                              to={`/obra/${obra.id}`}
                              className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:bg-artBlue hover:text-white transition-all text-center"
                            >
                              Detalhes
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {podeMostrar("denuncias") && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                        Denúncias
                      </span>

                      <h2 className="font-editorial text-3xl italic">
                        Denúncias recentes
                      </h2>
                    </div>

                    <span className="bg-artBlue/10 text-artBlue px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {denuncias.length} novas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {denuncias.map((denuncia) => (
                      <article
                        key={denuncia.id}
                        className="bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-artBlue/10 text-artBlue flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-flag"></i>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-1">
                            <span className="bg-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-400 border border-black/5">
                              {denuncia.tipo}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                statusClasses[denuncia.status] ||
                                "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {denuncia.status}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm">
                            {denuncia.alvo}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                            {denuncia.motivo} • Denunciado:{" "}
                            <strong>{denuncia.denunciado}</strong> •
                            Denunciante:{" "}
                            <strong>{denuncia.denunciante}</strong> •{" "}
                            {denuncia.tempo}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAcaoBackend(
                                "A análise real da denúncia será integrada ao backend."
                              )
                            }
                            className="bg-artDark text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artPurple transition-all"
                          >
                            Analisar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAcaoBackend(
                                "A resolução real da denúncia será integrada ao backend."
                              )
                            }
                            className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:bg-artOrange hover:text-white transition-all"
                          >
                            Resolver
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {podeMostrar("usuarios") && isAdmin && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
                  <div className="mb-6">
                    <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Monitoramento administrativo
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Usuários sinalizados
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {usuariosSinalizados.map((usuario) => (
                      <article
                        key={usuario.id}
                        className="bg-[#F9F8F6] rounded-[1.5rem] p-4 border border-black/5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-bold">{usuario.nome}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {usuario.motivo}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                              statusClasses[usuario.status] ||
                              "bg-artPurple/10 text-artPurple"
                            }`}
                          >
                            {usuario.status}
                          </span>
                        </div>

                        <div className="flex justify-between mt-4 text-xs text-gray-400 font-bold">
                          <span>{usuario.denuncias} denúncias</span>
                          <span>Revisar perfil</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                          <Link
                            to="/perfil"
                            className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all text-center"
                          >
                            Ver perfil
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleAcaoBackend(
                                "O bloqueio real de usuário será integrado ao backend e ficará restrito ao administrador."
                              )
                            }
                            className="bg-white border border-black/5 px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:bg-artOrange hover:text-white transition-all"
                          >
                            Bloquear
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {podeMostrar("logs") && (
                <div className="bg-white rounded-[2rem] border border-black/5 p-4 sm:p-5 lg:p-6">
                  <div className="mb-6">
                    <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Histórico administrativo
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Logs recentes
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {logs.map((log) => (
                      <article
                        key={log.id}
                        className="bg-[#F9F8F6] rounded-[1.3rem] p-4 border border-black/5"
                      >
                        <h3 className="font-bold text-sm">{log.acao}</h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {log.responsavel} • {log.tempo}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}