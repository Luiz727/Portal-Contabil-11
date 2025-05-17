import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: string;
  label: string;
  href: string;
  active: boolean;
};

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-4 py-3 text-primary-100 rounded-md mx-2 mb-1 cursor-pointer",
          active ? "bg-primary-700" : "hover:bg-primary-700"
        )}
      >
        <span className="material-icons mr-3 text-primary-300">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
};

type NavSectionProps = {
  title: string;
  children: React.ReactNode;
};

const NavSection = ({ title, children }: NavSectionProps) => {
  return (
    <>
      <div className="px-4 mt-6 mb-2 text-xs font-semibold text-primary-200 uppercase tracking-wider">
        {title}
      </div>
      {children}
    </>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <aside className="flex flex-shrink-0">
      <div className="flex flex-col w-64 bg-primary-800 text-white h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-4 py-6 flex items-center border-b border-primary-700">
          <span className="material-icons mr-2">account_balance</span>
          <h1 className="text-xl font-semibold">ContaSmart</h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto scrollbar-hide">
          <div className="px-4 mb-2 text-xs font-semibold text-primary-200 uppercase tracking-wider">
            Principal
          </div>
          
          <NavItem 
            href="/" 
            icon="dashboard" 
            label="Dashboard" 
            active={location === "/" || location === ""} 
          />
          
          <NavItem 
            href="/tasks" 
            icon="assignment" 
            label="Tarefas" 
            active={location === "/tasks"} 
          />
          
          <NavItem 
            href="/clients" 
            icon="people" 
            label="Clientes" 
            active={location === "/clients"} 
          />

          <NavSection title="Documentos">
            <NavItem 
              href="/documents" 
              icon="folder" 
              label="Gerenciador" 
              active={location === "/documents"} 
            />
            
            <NavItem 
              href="/invoices" 
              icon="receipt" 
              label="Notas Fiscais" 
              active={location === "/invoices"} 
            />
            
            <NavItem 
              href="/fiscal" 
              icon="receipt_long" 
              label="Módulo Fiscal" 
              active={location.startsWith("/fiscal")} 
            />
          </NavSection>

          <NavSection title="Comunicação">
            <NavItem 
              href="/whatsapp" 
              icon="chat" 
              label="WhatsApp" 
              active={location === "/whatsapp"} 
            />
          </NavSection>

          <NavSection title="Financeiro">
            <NavItem 
              href="/financial" 
              icon="account_balance_wallet" 
              label="Fluxo de Caixa" 
              active={location === "/financial"} 
            />
            
            <NavItem 
              href="/inventory" 
              icon="inventory" 
              label="Controle de Estoque" 
              active={location === "/inventory"} 
            />
            
            <NavItem 
              href="/reconciliation" 
              icon="compare_arrows" 
              label="Conciliação Bancária" 
              active={location === "/reconciliation"} 
            />
          </NavSection>

          <NavSection title="Sistema">
            <NavItem 
              href="/reports" 
              icon="bar_chart" 
              label="Relatórios" 
              active={location === "/reports"} 
            />
            
            <NavItem 
              href="/integrations" 
              icon="extension" 
              label="Integrações" 
              active={location === "/integrations"} 
            />
            
            <NavItem 
              href="/settings" 
              icon="settings" 
              label="Configurações" 
              active={location === "/settings"} 
            />
          </NavSection>
        </nav>

        {/* User Profile */}
        <div className="border-t border-primary-700 p-4">
          <div className="flex items-center">
            <img 
              className="h-8 w-8 rounded-full object-cover" 
              src={user?.profileImageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
              alt="Foto de perfil do usuário" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.firstName || "Usuário"} {user?.lastName || ""}
              </p>
              <p className="text-xs text-primary-300">{user?.role === "admin" ? "Administrador" : user?.role === "accountant" ? "Contador" : "Cliente"}</p>
            </div>
            <a href="/api/logout" className="ml-auto text-primary-300 hover:text-white">
              <span className="material-icons text-sm">logout</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
