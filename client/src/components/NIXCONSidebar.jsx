import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar,
  Calculator, 
  BarChart3, 
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Use as imagens que você forneceu
import logoFull from '../assets/logo-nixcon-full.png';
import logoIcon from '../assets/logo-nixcon-icon.png';

const SidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <div className={`flex items-center px-4 py-2.5 text-sm ${active ? 'bg-primary/10' : 'hover:bg-gray-100'} rounded-md transition-colors`}>
      <Link href={to} className="flex items-center w-full">
        <Icon size={18} className="mr-3 text-[#d9bb42]" />
        <span className="text-[rgb(55,65,81)]">{label}</span>
      </Link>
    </div>
  );
};

const SidebarSection = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="uppercase text-xs font-semibold text-gray-500 px-4 mb-2">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default function NIXCONSidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <aside className={`bg-white border-r border-gray-200 ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <div className="p-4 border-b border-gray-200 mb-2 flex items-center justify-between">
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
          <img 
            src={collapsed ? logoIcon : logoFull}
            alt="NIXCON Logo" 
            className="h-8" 
          />
        </div>
        
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-primary"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
      
      {collapsed && (
        <div className="flex justify-center my-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      
      <div className="px-2 py-4">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          to="/" 
          active={location === "/"} 
        />
        
        <SidebarItem 
          icon={Users} 
          label="Clientes" 
          to="/clients" 
          active={location === "/clients"} 
        />
        
        <SidebarItem 
          icon={FileText} 
          label="Documentos" 
          to="/documents" 
          active={location === "/documents"} 
        />
        
        <SidebarItem 
          icon={Calendar} 
          label="Calendário" 
          to="/calendar" 
          active={location === "/calendar"} 
        />
        
        <SidebarSection title="Módulos">
          <SidebarItem 
            icon={Calculator} 
            label="Módulo Fiscal" 
            to="/fiscal" 
            active={location.startsWith("/fiscal")} 
          />
          
          <SidebarItem 
            icon={Calculator} 
            label="Calculadora" 
            to="/tax-calculator" 
            active={location === "/tax-calculator"} 
          />
          
          <SidebarItem 
            icon={BarChart3} 
            label="Relatórios" 
            to="/reports" 
            active={location === "/reports"} 
          />
        </SidebarSection>
        
        <SidebarSection title="Comunicação">
          <SidebarItem 
            icon={MessageSquare} 
            label="WhatsApp" 
            to="/whatsapp" 
            active={location === "/whatsapp"} 
          />
        </SidebarSection>
        
        <SidebarSection title="Sistema">
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            to="/settings" 
            active={location === "/settings"} 
          />
        </SidebarSection>
      </div>
    </aside>
  );
}