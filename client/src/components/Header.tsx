import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useViewMode } from '../contexts/ViewModeContext';
import ViewModeSelector from './ViewModeSelector';
import EmpresaSelector from './EmpresaSelector';
import { 
  Bell, 
  Menu, 
  MessageSquare, 
  User, 
  LogOut, 
  Settings,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { viewMode } = useViewMode();
  const [unreadNotifications] = useState(3);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/assets/logo.svg"
            alt="NIXCON"
            className="h-8 w-auto"
          />
          <span className="ml-2 hidden text-lg font-bold text-gray-900 md:inline-block">
            NIXCON
          </span>
        </div>

        {/* View mode selector */}
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:block">
            <ViewModeSelector />
          </div>

          {/* Empresa selector (only shown when in 'empresa' view mode) */}
          <div className="hidden md:block">
            <EmpresaSelector />
          </div>

          {/* Notification button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem className="flex cursor-pointer flex-col items-start p-3">
                  <div className="font-semibold">Nova declaração disponível</div>
                  <div className="text-xs text-gray-500">19/05/2025 - 14:30</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex cursor-pointer flex-col items-start p-3">
                  <div className="font-semibold">Vencimento de imposto próximo</div>
                  <div className="text-xs text-gray-500">18/05/2025 - 10:15</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex cursor-pointer flex-col items-start p-3">
                  <div className="font-semibold">Documento enviado para assinatura</div>
                  <div className="text-xs text-gray-500">17/05/2025 - 16:45</div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-center font-medium text-primary">
                Ver todas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages button */}
          <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
            <MessageSquare className="h-5 w-5" />
          </button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 rounded-full p-1 text-gray-700 hover:bg-gray-100">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user?.name || 'User'} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name || 'Usuário'}</span>
                  <span className="text-xs text-gray-500">{user?.email || 'usuario@exemplo.com'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => useAuth().logout()}>
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