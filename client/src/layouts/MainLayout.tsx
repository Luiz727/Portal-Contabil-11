import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'wouter';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-amber-600">
            <Link href="/dashboard">NIXCON</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard">
                  <div className={`block px-4 py-2 rounded cursor-pointer ${location === '/dashboard' ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Dashboard
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/clients">
                  <div className={`block px-4 py-2 rounded cursor-pointer ${location === '/clients' ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Clientes
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/fiscal">
                  <div className={`block px-4 py-2 rounded cursor-pointer ${location === '/fiscal' ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Módulo Fiscal
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/financial">
                  <div className={`block px-4 py-2 rounded cursor-pointer ${location === '/financial' ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Financeiro
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/reports">
                  <div className={`block px-4 py-2 rounded cursor-pointer ${location === '/reports' ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Relatórios
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/settings">
                  <div className={`block px-4 py-2 rounded cursor-pointer ${location === '/settings' ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Configurações
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <div className={`block px-4 py-2 rounded cursor-pointer ${location.startsWith('/admin') ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    Administração
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;