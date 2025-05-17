import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

type HeaderProps = {
  toggleSidebar: () => void;
  fiscalModule?: boolean;
};

export default function Header({ toggleSidebar, fiscalModule = false }: HeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Would implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <Button
            variant="outline"
            onClick={toggleSidebar}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 focus:outline-none hover:bg-primary-50"
          >
            <span className="material-icons">menu</span>
            <span>Menu</span>
          </Button>
          <div className="ml-3">
            <h1 className="text-lg font-medium">ContaSmart</h1>
          </div>
        </div>

        <div className="hidden md:flex md:items-center">
          <div className="relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-neutral-400 text-sm">search</span>
                </span>
                <Input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="relative p-1 text-neutral-500 hover:text-neutral-600 focus:outline-none"
          >
            <span className="material-icons">notifications</span>
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold leading-4 text-center">3</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="relative p-1 text-neutral-500 hover:text-neutral-600 focus:outline-none"
            onClick={() => window.location.href = "/whatsapp"}
          >
            <span className="material-icons">chat</span>
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-blue-500 text-white text-xs font-bold leading-4 text-center">5</span>
          </Button>

          <div className="border-l border-neutral-200 h-6 mx-2 hidden md:block"></div>

          <div className="flex items-center md:hidden">
            <img 
              className="h-8 w-8 rounded-full object-cover" 
              src={user?.profileImageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
              alt="Foto de perfil do usuário" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
