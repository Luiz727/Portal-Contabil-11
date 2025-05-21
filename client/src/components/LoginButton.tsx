import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

// Interface do usuário autenticado
interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function LoginButton() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-[#d9bb42] border-t-transparent"></span>
        Carregando...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {user.profileImageUrl && (
            <img 
              src={user.profileImageUrl} 
              alt="Perfil" 
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium hidden md:inline">
            {user.firstName || user.email || "Usuário"}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/api/logout'}
          className="text-gray-700 hover:bg-red-50 hover:text-red-700 border-gray-300"
        >
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="default" 
      size="sm"
      onClick={() => window.location.href = '/api/login'}
      className="bg-[#d9bb42] hover:bg-[#c2a73b] text-white"
    >
      Entrar
    </Button>
  );
}