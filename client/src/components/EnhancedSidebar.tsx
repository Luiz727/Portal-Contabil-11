import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

type NavItemProps = {
  icon: string;
  label: string;
  href: string;
  active: boolean;
  badge?: string;
  badgeColor?: string;
};

// Componente para item de navegação simples
const NavItem = ({ icon, label, href, active, badge, badgeColor = "primary" }: NavItemProps) => {
  return (
    <Link href={href}>
      <div 
        className={`nav-link d-flex align-items-center px-3 py-2 rounded-2 mb-1 ${active ? 'active bg-primary text-white' : 'text-white-50'}`}
        style={{ textDecoration: 'none', cursor: 'pointer' }}
      >
        <span className="material-icons me-2 small">{icon}</span>
        <span className="flex-grow-1">{label}</span>
        {badge && (
          <span className={`badge rounded-pill bg-${badgeColor} ms-2`}>{badge}</span>
        )}
      </div>
    </Link>
  );
};

// Componente para seção com sub-menus colapsáveis
const NavSection = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  icon?: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-2">
      <div 
        className="d-flex align-items-center px-3 py-2 text-white-50 rounded-2 mb-1"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        {icon && <span className="material-icons me-2 small">{icon}</span>}
        <h6 className="text-uppercase fw-light text-white-50 mb-0 small">{title}</h6>
        <span className="material-icons ms-auto small">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>
      <div className={`nav flex-column ms-3 ${isOpen ? 'd-block' : 'd-none'}`}>
        {children}
      </div>
    </div>
  );
};

export default function EnhancedSidebar() {
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
      <div className="d-flex flex-column bg-dark text-white h-100 overflow-auto" style={{ width: '280px' }}>
        {/* Logo */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <span className="material-icons me-2">account_balance</span>
            <h1 className="fs-5 fw-semibold mb-0">ContaSmart</h1>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow-1 p-3 overflow-auto">
          {/* Dashboard */}
          <div className="mb-4">
            <NavItem 
              href="/" 
              icon="dashboard" 
              label="Dashboard" 
              active={location === "/" || location === ""} 
            />
          </div>
          
          {/* Documentos */}
          <NavSection title="Documentos" icon="folder" defaultOpen={location.includes('/documents') || location.includes('/invoice')}>
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
              badge="Novo"
              badgeColor="info"
            />
          </NavSection>
          
          {/* Tarefas */}
          <NavSection title="Tarefas" icon="check_circle" defaultOpen={location.includes('/tasks')}>
            <NavItem 
              href="/tasks" 
              icon="list" 
              label="Todas as Tarefas" 
              active={location === "/tasks"} 
              badge="3"
              badgeColor="danger"
            />
            
            <NavItem 
              href="/tasks/my-tasks" 
              icon="person" 
              label="Minhas Tarefas" 
              active={location === "/tasks/my-tasks"} 
            />
            
            <NavItem 
              href="/tasks/new" 
              icon="add" 
              label="Nova Tarefa" 
              active={location === "/tasks/new"} 
            />
          </NavSection>
          
          {/* Clientes */}
          <NavSection title="Clientes" icon="people" defaultOpen={location.includes('/clients')}>
            <NavItem 
              href="/clients" 
              icon="people" 
              label="Gestão de Clientes" 
              active={location === "/clients"} 
            />
            
            <NavItem 
              href="/client-portal" 
              icon="dashboard" 
              label="Portal do Cliente" 
              active={location === "/client-portal"} 
            />
          </NavSection>

          {/* Comunicação */}
          <NavSection title="Comunicação" icon="chat" defaultOpen={location.includes('/communication')}>
            <NavItem 
              href="/whatsapp" 
              icon="chat" 
              label="WhatsApp" 
              active={location === "/whatsapp"} 
              badge="5"
              badgeColor="success"
            />
          </NavSection>

          {/* Financeiro */}
          <NavSection title="Financeiro" icon="account_balance" defaultOpen={location.includes('/financial')}>
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

          {/* Cadastros */}
          <NavSection title="Cadastros" icon="add_circle" defaultOpen={location.includes('/registrations')}>
            <NavItem 
              href="/registrations/products" 
              icon="inventory_2" 
              label="Produtos" 
              active={location === "/registrations/products"} 
            />
            
            <NavItem 
              href="/registrations/services" 
              icon="miscellaneous_services" 
              label="Serviços" 
              active={location === "/registrations/services"} 
            />
            
            <NavItem 
              href="/registrations/carriers" 
              icon="local_shipping" 
              label="Transportadoras" 
              active={location === "/registrations/carriers"} 
            />
            
            <NavItem 
              href="/registrations/kits" 
              icon="category" 
              label="Kits" 
              active={location === "/registrations/kits"} 
            />
          </NavSection>

          {/* Ferramentas */}
          <NavSection title="Ferramentas" icon="build" defaultOpen={location.includes('/tools')}>
            <NavItem 
              href="/tools/data-import-export" 
              icon="import_export" 
              label="Importação/Exportação" 
              active={location === "/tools/data-import-export"} 
            />
            
            <NavItem 
              href="/tools/doc-reader" 
              icon="document_scanner" 
              label="Leitor de Documentos" 
              active={location === "/tools/doc-reader"} 
            />
            
            <NavItem 
              href="/tools/xml-vault" 
              icon="security" 
              label="Cofre de XML" 
              active={location === "/tools/xml-vault"} 
            />
          </NavSection>

          {/* Relatórios */}
          <NavSection title="Relatórios" icon="bar_chart" defaultOpen={location.includes('/reports')}>
            <NavItem 
              href="/reports" 
              icon="bar_chart" 
              label="Relatórios Gerais" 
              active={location === "/reports"} 
            />
            
            <NavItem 
              href="/reports/fiscal" 
              icon="receipt_long" 
              label="Relatórios Fiscais" 
              active={location === "/reports/fiscal"} 
            />
          </NavSection>

          {/* Sistema */}
          <NavSection title="Sistema" icon="settings" defaultOpen={location.includes('/settings')}>
            <NavItem 
              href="/settings" 
              icon="settings" 
              label="Configurações" 
              active={location === "/settings"} 
            />
            
            <NavItem 
              href="/user-management" 
              icon="manage_accounts" 
              label="Gestão de Usuários" 
              active={location === "/user-management"} 
            />
            
            <NavItem 
              href="/backup" 
              icon="backup" 
              label="Backup" 
              active={location === "/backup"} 
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