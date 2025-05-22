import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm z-10 relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo e título - visível apenas em desktop */}
        <div className="hidden md:flex items-center">
          <Link href="/dashboard" className="text-xl font-bold text-brand-gold flex items-center">
            NIXCON Portal
          </Link>
        </div>

        {/* Espaçador para centralizar o título em mobile */}
        <div className="md:hidden flex-1"></div>
        
        {/* Título centralizado em mobile */}
        <div className="md:hidden text-center text-lg font-semibold text-brand-gold">
          NIXCON
        </div>

        {/* Ações do usuário */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Perfil do usuário */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-gray text-white flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.email ? user.email.split('@')[0] : 'Usuário'}
              </span>
            </button>
          </div>
          
          {/* Botão de logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;