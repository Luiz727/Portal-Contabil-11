import React from "react";
import { Link, useLocation } from "wouter";
import { useViewMode } from '../contexts/ViewModeContext';
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  DollarSign,
  FileText,
  Calendar,
  Folder,
  CheckSquare,
  BarChart2,
  Settings,
  Shield,
  FileIcon,
  Layout,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  const { viewMode, isLoading } = useViewMode();

  // Function to get menu items based on current view mode
  const getMenuItems = () => {
    // Base menu items for all view modes
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' }
    ];

    // Menu items specific to each view mode
    const viewModeItems: Record<string, Array<{ id: string, label: string, icon: any, path: string, subItems?: Array<{ id: string, label: string, path: string }> }>> = {
      'escritorio': [
        { id: 'clients', label: 'Clientes', icon: Users, path: '/clients' },
        { id: 'financial', label: 'Financeiro', icon: DollarSign, path: '/financial' },
        { id: 'fiscal', label: 'Módulo Fiscal', icon: FileText, path: '/fiscal', subItems: [
          { id: 'dashboard', label: 'Dashboard Fiscal', path: '/fiscal' },
          { id: 'calculator', label: 'Calculadora de Impostos', path: '/tax-calculator' }
        ]},
        { id: 'calendar', label: 'Calendário', icon: Calendar, path: '/calendar' },
        { id: 'documents', label: 'Documentos', icon: Folder, path: '/documents' },
        { id: 'tasks', label: 'Tarefas', icon: CheckSquare, path: '/tasks' },
        { id: 'reports', label: 'Relatórios', icon: BarChart2, path: '/reports' },
        { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' },
        { id: 'admin', label: 'Administração', icon: Shield, path: '/admin' }
      ],
      'empresa': [
        { id: 'fiscal', label: 'Módulo Fiscal', icon: FileText, path: '/fiscal', subItems: [
          { id: 'dashboard', label: 'Dashboard Fiscal', path: '/fiscal' },
          { id: 'calculator', label: 'Calculadora de Impostos', path: '/tax-calculator' }
        ]},
        { id: 'financial', label: 'Financeiro', icon: DollarSign, path: '/financial' },
        { id: 'documents', label: 'Documentos', icon: Folder, path: '/documents' },
        { id: 'invoices', label: 'Notas Fiscais', icon: FileIcon, path: '/invoices' },
        { id: 'tasks', label: 'Tarefas', icon: CheckSquare, path: '/tasks' },
        { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' }
      ],
      'contador': [
        { id: 'clients', label: 'Clientes', icon: Users, path: '/clients' },
        { id: 'fiscal', label: 'Módulo Fiscal', icon: FileText, path: '/fiscal', subItems: [
          { id: 'dashboard', label: 'Dashboard Fiscal', path: '/fiscal' },
          { id: 'calculator', label: 'Calculadora de Impostos', path: '/tax-calculator' }
        ]},
        { id: 'documents', label: 'Documentos', icon: Folder, path: '/documents' },
        { id: 'tasks', label: 'Tarefas', icon: CheckSquare, path: '/tasks' },
        { id: 'calendar', label: 'Calendário', icon: Calendar, path: '/calendar' }
      ],
      'externo': [
        { id: 'documents', label: 'Documentos', icon: Folder, path: '/documents' },
        { id: 'tasks', label: 'Tarefas', icon: CheckSquare, path: '/tasks' },
        { id: 'client-portal', label: 'Portal do Cliente', icon: Layout, path: '/client-portal' }
      ]
    };

    // Combine base items with view mode specific items
    return [
      ...baseItems,
      ...(viewModeItems[viewMode] || [])
    ];
  };

  const menuItems = getMenuItems();

  if (isLoading) {
    return (
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-10 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with logo */}
          <div className="h-16 border-b border-gray-200 flex items-center px-4">
            <img
              src="/assets/logo.svg"
              alt="NIXCON"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-lg font-bold text-gray-900">
              NIXCON
            </span>
          </div>

          {/* View mode indicator */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className={`px-3 py-1.5 rounded-md ${
              viewMode === 'escritorio' 
                ? 'bg-primary/10 text-primary' 
                : viewMode === 'empresa'
                  ? 'bg-blue-100 text-blue-800'
                  : viewMode === 'contador'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
            }`}>
              <span className="text-xs font-medium">
                {viewMode === 'escritorio' 
                  ? 'Visão Escritório' 
                  : viewMode === 'empresa'
                    ? 'Visão Empresa'
                    : viewMode === 'contador'
                      ? 'Visão Contador'
                      : 'Visão Externa'}
              </span>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <Link href={item.path}>
                      <div
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                      >
                        <Icon className={cn(
                          "mr-3 h-5 w-5",
                          isActive ? "text-primary" : "text-gray-500"
                        )} />
                        {item.label}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer with version info */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>NIXCON Portal Contábil</p>
              <p>Versão 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;