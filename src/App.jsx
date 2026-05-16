import { Routes, Route } from "react-router-dom";

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
import EditarObra from "./pages/EditarObras";
import Salvos from "./pages/Salvos";
import Encomendas from "./pages/Encomendas";
import Estatisticas from "./pages/Estatisticas";
import Buscar from "./pages/Buscar";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
   
      <Route path="/" element={<Inicio />} />
      <Route path="/feed" element={<Home />} />
      <Route path="/planos" element={<Plans />} />
      <Route path="/mensagens" element={<Messages />} />
      <Route path="/criar-obra" element={<CriarObra />} />
      <Route path="/obra/:id" element={<DetalhesObra />} />
      <Route path="/meu-portfolio" element={<MeuPortfolio />} />
      <Route path="/editar-perfil" element={<EditarPerfil />} />
      <Route path="/perfil" element={<ArtistProfile />} />
      <Route path="/notificacoes" element={<Notificacoes />} />
      <Route path="/configuracoes" element={<Configuracoes />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/seguidores" element={<Seguidores />} />
      <Route path="/seguindo" element={<Seguindo />} />
      <Route path="/editar-obra/:id" element={<EditarObra />} />
      <Route path="/salvos" element={<Salvos />} />
      <Route path="/encomendas" element={<Encomendas />} />
      <Route path="/estatisticas" element={<Estatisticas />} />
      <Route path="/buscar" element={<Buscar />} />
      <Route path="/Admin" element={<Admin />} />
    </Routes>
  );
}

export default App;