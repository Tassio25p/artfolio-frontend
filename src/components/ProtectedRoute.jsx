import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute — Protege rotas que exigem autenticação ou permite acesso de Visitante (Guest).
 *
 * @param {boolean} allowGuest - Se true, permite que usuários em modo visitante (isGuest) acessem a página.
 */
export default function ProtectedRoute({ children, allowGuest = false }) {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-artPurple/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-artPurple animate-spin"></div>
          </div>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  // Permitido se estiver autenticado como artista OU se a rota permite visitante e o usuário é visitante
  if (isAuthenticated || (allowGuest && isGuest)) {
    return children;
  }

  // Não autenticado / Não permitido para visitante
  return <Navigate to="/login" state={{ from: location }} replace />;
}
