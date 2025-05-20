import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import EmpresaSelector from "@/components/EmpresaSelector";
import { useEmpresas } from "@/contexts/EmpresasContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User2, Building, Check } from "lucide-react";

type HeaderProps = {
  toggleSidebar: () => void;
  fiscalModule?: boolean;
  onVisualizationChange?: (type: "escritorio" | "empresa") => void;
};

export default function Header({ toggleSidebar, fiscalModule = false, onVisualizationChange }: HeaderProps) {
  const { user } = useAuth();
  const { actingAsEmpresa, userType } = useEmpresas();
  const [isEscritorioView, setIsEscritorioView] = useState(userType === 'Escritorio');
  
  useEffect(() => {
    // Sincronizar com o tipo de usuário ao carregar
    setIsEscritorioView(userType === 'Escritorio' && !actingAsEmpresa);
  }, [userType, actingAsEmpresa]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const avatarUrl = user?.profileImageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Fechar a pesquisa expandida quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 bg-white border-b border-primary/10 shadow-sm z-40 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {fiscalModule ? (
          <div className="flex items-center">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-primary hover:bg-primary/5"
              >
                <span className="material-icons">arrow_back</span>
              </Button>
            </Link>
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-800">{(fiscalModule || isEscritorioView) ? "Módulo Fiscal" : "Dashboard"}</h2>
              <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">v1.0</Badge>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 inline-flex items-center"
                onClick={toggleSidebar}
              >
                <span className="material-icons mr-1">menu</span>
                <span className="text-sm">Menu</span>
              </Button>
              
              <div className="ml-2">
                <h1 className="text-xl font-bold">
                  <span style={{color: "#d9bb42"}}>NIX</span>
                  <span className="text-gray-600">CON</span>
                </h1>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex md:items-center">
              <h1 className="text-2xl font-bold mr-8">
                <span className="text-[#d9bb42]">NIX</span>
                <span className="text-[#4a4a4a]">CON</span>
              </h1>
              
              <div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-500 hover:text-[#d9bb42]"
                >
                  <span className="material-icons">filter_list</span>
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Mobile Search Button */}
        {!fiscalModule && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          >
            <span className="material-icons">search</span>
          </Button>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Seletor de empresas funcional com o estilo da imagem de referência */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden sm:flex sm:items-center sm:border sm:border-gray-200 sm:rounded-md sm:px-3 sm:py-1.5 sm:bg-white cursor-pointer hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                    {isEscritorioView ? "NX" : "CA"}
                  </span>
                  <span className="text-sm text-gray-700">
                    {isEscritorioView ? "NIXCON" : "Comércio ABC"}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Alterar Visualização</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                if (onVisualizationChange) onVisualizationChange("escritorio");
                setIsEscritorioView(true);
                window.location.href = "/admin/painel";
              }}>
                <User2 className="mr-2 h-4 w-4 text-[#d9bb42]" />
                <span>Visão do Escritório</span>
                {(fiscalModule || isEscritorioView) && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Empresas</DropdownMenuLabel>
              <DropdownMenuItem 
                className={!fiscalModule && !isEscritorioView ? "bg-gray-50" : ""}
                onClick={() => {
                  if (onVisualizationChange) onVisualizationChange("empresa");
                  setIsEscritorioView(false);
                  window.location.href = "/";
                }}
              >
                <Building className="mr-2 h-4 w-4 text-[#d9bb42]" />
                <span>Comércio ABC</span>
                {(!fiscalModule && !isEscritorioView) && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (onVisualizationChange) onVisualizationChange("empresa");
                window.location.href = "/";
              }}>
                <Building className="mr-2 h-4 w-4 text-[#d9bb42]" />
                <span>Grupo Aurora</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (onVisualizationChange) onVisualizationChange("empresa");
                window.location.href = "/";
              }}>
                <Building className="mr-2 h-4 w-4 text-[#d9bb42]" />
                <span>Holding XYZ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-primary/5"
              >
                <span className="material-icons text-muted-foreground">notifications</span>
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-3 font-medium border-b">
                Notificações (3)
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-muted/50 cursor-pointer border-b border-border/40">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-icons text-primary text-sm">description</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Novo documento recebido</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Nota fiscal de serviço recebida de cliente XYZ
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          há 30 minutos
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-center text-primary hover:text-primary">
                  Ver todas as notificações
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Chat/WhatsApp */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-primary/5"
              >
                <span className="material-icons text-muted-foreground">chat</span>
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                  5
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <div className="px-4 py-3 font-medium border-b">
                Mensagens Recentes
              </div>
              <Link href="/whatsapp">
                <DropdownMenuItem>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/whatsapp-logo.png" />
                      <AvatarFallback className="bg-green-500 text-white">
                        <span className="material-icons text-sm">whatsapp</span>
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">5 mensagens não lidas</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                <span className="text-primary text-sm">Ver todas as mensagens</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0 ml-1">
                <Avatar className="h-9 w-9 border-2 border-primary/10">
                  <AvatarImage src={avatarUrl} alt={user?.firstName || "Usuário"} />
                  <AvatarFallback className="bg-muted">
                    <span className="material-icons">person</span>
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1">
              <div className="px-4 pt-3 pb-2">
                <p className="font-medium">{user?.firstName || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
              <DropdownMenuSeparator />
              <Link href="/settings/profile">
                <DropdownMenuItem>
                  <span className="material-icons mr-2 text-sm">person</span>
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>
                  <span className="material-icons mr-2 text-sm">settings</span>
                  <span>Configurações</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/api/logout">
                <DropdownMenuItem>
                  <span className="material-icons mr-2 text-sm">logout</span>
                  <span>Sair</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Bar - Expanded */}
      {!fiscalModule && isSearchExpanded && (
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-muted-foreground text-sm">search</span>
              </span>
              <Input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 h-10 border-primary/20 rounded-full w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 flex items-center"
                onClick={() => setIsSearchExpanded(false)}
              >
                <span className="material-icons text-muted-foreground">close</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
