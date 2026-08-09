import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute — Componente que protege rotas que exigem autenticação.
 *
 * Comportamento:
 * 1. Se ainda está verificando a sessão (loading) → exibe spinner de carregamento
 * 2. Se não está autenticado → redireciona para /login, salvando a rota atual
 *    em location.state.from para redirecionamento pós-login
 * 3. Se está autenticado → renderiza os children normalmente
 *
 * Uso:
 *   <Route path="/feed" element={<ProtectedRoute><Home /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Estado de carregamento — evita flash da tela de login
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-artPurple/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-artPurple animate-spin"></div>
          </div>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            Verificando sessão...
          </p>
        </div>
      </div>
    );
  }

  // Não autenticado — redireciona para /login com a rota tentada
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Autenticado — renderiza a página protegida
  return children;
}
