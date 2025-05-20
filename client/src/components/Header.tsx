import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import EmpresaSelector from "@/components/EmpresaSelector";
import { useEmpresas } from "@/contexts/EmpresasContext";

type HeaderProps = {
  toggleSidebar: () => void;
  fiscalModule?: boolean;
};

export default function Header({ toggleSidebar, fiscalModule = false }: HeaderProps) {
  const { user } = useAuth();
  const { actingAsEmpresa } = useEmpresas();
  const [searchQuery, setSearchQuery] = useState("");
  const avatarUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Would implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {fiscalModule ? (
          <div className="flex items-center">
            <Link href="/">
              <button
                type="button"
                className="flex items-center text-primary mr-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="material-icons">arrow_back</span>
              </button>
            </Link>
            <span className="flex items-center">
              <span className="text-lg font-medium">Módulo Fiscal</span>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-500 text-white rounded-full">v1.0</span>
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none"
                onClick={toggleSidebar}
              >
                <span className="material-icons">menu</span>
                <span className="ml-2 text-sm">Menu</span>
              </button>
              <div className="ml-3">
                <div className="flex items-center">
                  <img src="/src/assets/icon-nixcon.png" alt="NIXCON" className="h-6 mr-2" />
                  <h1 className="text-lg font-medium">NIXCON</h1>
                </div>
              </div>
            </div>

            <div className="hidden md:flex md:items-center">
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">search</span>
                    </span>
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center space-x-3">
          {/* Seletor de empresas para usuários do escritório */}
          <EmpresaSelector />

          <button 
            type="button"
            className="relative p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <span className="material-icons">notifications</span>
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold leading-4 text-center">3</span>
          </button>

          <button 
            type="button"
            className="relative p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => window.location.href = "/whatsapp"}
          >
            <span className="material-icons">chat</span>
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-primary-500 text-white text-xs font-bold leading-4 text-center">5</span>
          </button>

          <div className="hidden md:block border-l border-gray-200 h-6 mx-2"></div>

          <div className="flex items-center relative group">
            <button className="focus:outline-none">
              <img 
                className="h-8 w-8 rounded-full object-cover"
                src={avatarUrl} 
                alt="Foto de perfil do usuário" 
              />
            </button>
            
            <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/settings/profile">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Perfil
                </div>
              </Link>
              <Link href="/settings">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Configurações
                </div>
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="/api/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Sair
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
