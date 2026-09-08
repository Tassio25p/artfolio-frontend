import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import { ToastProvider } from "./contexts/ToastContext";

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
import TermosUso from "./pages/TermosUso";
import OnboardingPerfil from "./pages/OnboardingPerfil";
import Seguidores from "./pages/Seguidores";
import Seguindo from "./pages/Seguindo";
import EditarObras from "./pages/EditarObras";
import Salvos from "./pages/Salvos";
import Encomendas from "./pages/Encomendas";
import Estatisticas from "./pages/Estatisticas";
import Buscar from "./pages/Buscar";
import Admin from "./pages/Admin";

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Rotas completamente públicas (fora do AppLayout / sem Sidebar) */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/termos" element={<TermosUso />} />

        {/* Onboarding exclusivo do Artista recém-cadastrado (fora do layout) */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPerfil /></ProtectedRoute>} />

        {/* Rotas agrupadas sob o AppLayout (compartilham a Sidebar persistente) */}
        <Route element={<AppLayout />}>
          {/* Rotas híbridas (Visitante / Autenticado) */}
          <Route path="/feed" element={<ProtectedRoute allowGuest={true}><Home /></ProtectedRoute>} />
          <Route path="/buscar" element={<ProtectedRoute allowGuest={true}><Buscar /></ProtectedRoute>} />
          <Route path="/obra/:id" element={<DetalhesObra />} />
          <Route path="/artista/:id" element={<ProtectedRoute allowGuest={true}><ArtistProfile /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute allowGuest={true}><ArtistProfile /></ProtectedRoute>} />

          {/* Rotas restritas (Apenas Autenticados) */}
          <Route path="/planos" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          <Route path="/mensagens" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="/criar-obra" element={<ProtectedRoute><CriarObra /></ProtectedRoute>} />
          <Route path="/editar-obra/:id" element={<ProtectedRoute><EditarObras /></ProtectedRoute>} />
          <Route path="/editar-perfil" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
          <Route path="/meu-portfolio" element={<ProtectedRoute><MeuPortfolio /></ProtectedRoute>} />
          <Route path="/seguidores" element={<ProtectedRoute><Seguidores /></ProtectedRoute>} />
          <Route path="/seguindo" element={<ProtectedRoute><Seguindo /></ProtectedRoute>} />
          <Route path="/salvos" element={<ProtectedRoute><Salvos /></ProtectedRoute>} />
          <Route path="/encomendas" element={<ProtectedRoute><Encomendas /></ProtectedRoute>} />
          <Route path="/estatisticas" element={<ProtectedRoute><Estatisticas /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Route>

        {/* Rota de fallback para páginas não encontradas (fora do layout) */}
        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
    </ToastProvider>
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