import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

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
        className={`nav-link d-flex align-items-center px-3 py-2 rounded-2 mb-1 ${active ? 'active bg-primary text-white' : 'text-white-50'}`}
        style={{ textDecoration: 'none', cursor: 'pointer' }}
      >
        <span className="material-icons me-2 small">{icon}</span>
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
    <div className="mb-4">
      <h6 className="text-uppercase fw-light text-white-50 fs-7 px-3 mb-2 mt-4">{title}</h6>
      <div className="nav flex-column">
        {children}
      </div>
    </div>
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
    <aside className="flex-shrink-0">
      <div className="d-flex flex-column bg-dark text-white h-100 overflow-auto" style={{ width: '250px' }}>
        {/* Logo */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <span className="material-icons me-2">account_balance</span>
            <h1 className="fs-5 fw-semibold mb-0">ContaSmart</h1>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow-1 p-3 overflow-auto">
          <NavSection title="Principal">
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
          </NavSection>

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
              label="Calculadora de Impostos" 
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
        <div className="border-top border-secondary p-3">
          <div className="d-flex align-items-center">
            <img 
              className="rounded-circle object-fit-cover"
              style={{ width: '32px', height: '32px' }}
              src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
              alt="Foto de perfil do usuário" 
            />
            <div className="ms-2">
              <p className="mb-0 small fw-medium text-white">
                {"Usuário"}
              </p>
              <p className="mb-0 small text-white-50">{"Cliente"}</p>
            </div>
            <a href="/api/logout" className="ms-auto text-white-50 btn btn-link p-0">
              <span className="material-icons small">logout</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
