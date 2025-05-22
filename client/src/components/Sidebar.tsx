import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Home, FileText, Calculator, Settings } from 'lucide-react';

// Definição dos itens de navegação
export const NAV_ITEMS = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    title: 'Fiscal',
    path: '/fiscal',
    icon: FileText,
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    title: 'Calculadora',
    path: '/tax-calculator',
    icon: Calculator,
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    title: 'Configurações',
    path: '/settings',
    icon: Settings,
    roles: ['admin', 'superadmin'],
  },
];

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Filtra os itens de navegação com base no papel do usuário
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  });

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-brand-gray text-white hover:bg-brand-gold transition-colors"
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar para Desktop e Mobile (quando aberto) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 bg-brand-gray text-white w-64 transition-transform transform 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static
        `}
      >
        {/* Logo placeholder */}
        <div className="flex items-center justify-center h-16 border-b border-brand-gold/20">
          <span className="text-xl font-bold text-brand-gold">NIXCON</span>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location === item.path;
              
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a
                      className={`
                        flex items-center px-4 py-3 rounded-md cursor-pointer transition-colors
                        ${isActive 
                          ? 'bg-brand-gold text-white' 
                          : 'text-white hover:bg-brand-gold/70'}
                      `}
                    >
                      <IconComponent size={18} className="mr-3" />
                      <span>{item.title}</span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay para fechar o menu em dispositivos móveis */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;