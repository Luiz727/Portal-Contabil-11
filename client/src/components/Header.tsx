import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useViewMode } from '../contexts/ViewModeContext';
import ViewModeSelector from './ViewModeSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  LogOut, 
  Menu, 
  MessageCircle, 
  Settings, 
  User,
  Calendar,
  FileText,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Logo do NIXCON (pode ser substituído por uma imagem real)
const NIXCONLogo = () => (
  <div className="flex items-center">
    <div className="font-bold text-xl text-primary mr-1">NIX</div>
    <div className="font-bold text-xl text-gray-700">CON</div>
  </div>
);

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, logout } = useAuth();
  const { viewMode, viewModeName } = useViewMode();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Iniciais do usuário para o Avatar
  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Notificações de exemplo
  const notifications = [
    { id: 1, title: "Nota Fiscal Rejeitada", message: "A NF-e 12345 foi rejeitada pela SEFAZ", time: "15 minutos atrás", type: "error" },
    { id: 2, title: "Novo Documento", message: "Cliente ABC enviou um novo documento", time: "1 hora atrás", type: "info" },
    { id: 3, title: "Lembrete", message: "Reunião com o contador às 15h", time: "3 horas atrás", type: "warning" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-4">
          {/* Menu hamburguer para dispositivos móveis */}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <NIXCONLogo />
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Seletor de modo de visualização */}
          <div className="hidden md:block">
            <ViewModeSelector />
          </div>
          
          {/* Notificações */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Notificações</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500">Nenhuma notificação</p>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-lg border ${
                          notification.type === 'error' 
                            ? 'border-red-200 bg-red-50' 
                            : notification.type === 'warning'
                            ? 'border-amber-200 bg-amber-50'
                            : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="font-semibold">{notification.title}</div>
                        <div className="text-sm text-gray-600">{notification.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-primary text-white">{getInitials()}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Agenda</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Documentos</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Mensagens</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Ajuda</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout?.()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;