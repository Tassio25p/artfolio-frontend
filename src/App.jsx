import { Routes, Route, Link } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Messages from "./pages/Messages";
import CriarObra from "./pages/CriarObra";
import DetalhesObra from "./pages/DetalhesObra";
import MeuPortfolio from "./pages/MeuPortfolio";
import EditarPerfil from "./pages/EditarPerfil";
import ArtistProfile from "./pages/ArtistProfile";
import Notificacoes from "./pages/Notificacoes";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Seguidores from "./pages/Seguidores";
import Seguindo from "./pages/Seguindo";
import EditarObras from "./pages/EditarObras";
import Salvos from "./pages/Salvos";
import Encomendas from "./pages/Encomendas";
import Estatisticas from "./pages/Estatisticas";
import Buscar from "./pages/Buscar";
import Admin from "./pages/Admin";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  return (
    <>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Área principal */}
        <Route path="/feed" element={<Home />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/planos" element={<Plans />} />
        <Route path="/mensagens" element={<Messages />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/configuracoes" element={<Configuracoes />} />

        {/* Obras */}
        <Route path="/criar-obra" element={<CriarObra />} />
        <Route path="/obra/:id" element={<DetalhesObra />} />
        <Route path="/editar-obra/:id" element={<EditarObras />} />

        {/* Perfil e portfólio */}
        <Route path="/perfil" element={<ArtistProfile />} />
        <Route path="/artista/:id" element={<ArtistProfile />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/meu-portfolio" element={<MeuPortfolio />} />
        <Route path="/seguidores" element={<Seguidores />} />
        <Route path="/seguindo" element={<Seguindo />} />

        {/* Recursos do usuário */}
        <Route path="/salvos" element={<Salvos />} />
        <Route path="/encomendas" element={<Encomendas />} />
        <Route path="/estatisticas" element={<Estatisticas />} />

        {/* Administração */}
        <Route path="/admin" element={<Admin />} />

        {/* Rota inexistente */}
        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
      <Chatbot />
    </>
  );
}

function PaginaNaoEncontrada() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark flex items-center justify-center p-6 font-sans">
      <div className="bg-white border border-black/5 rounded-[2rem] p-8 max-w-md text-center shadow-xl shadow-black/5">
        <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-3">
          Página não encontrada
        </span>

        <h1 className="font-editorial text-5xl italic leading-none mb-4">
          Rota inválida.
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          A página acessada não existe ou ainda não foi criada dentro do
          Artfolio.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center bg-artDark text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-artOrange transition-all"
        >
          Voltar para início
        </Link>
      </div>
    </div>
  );
}

export default App;