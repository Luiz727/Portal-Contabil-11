import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

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
        className={cn(
          "flex items-center px-3 py-2 rounded-md mb-1 cursor-pointer transition-colors",
          active ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50 hover:text-white"
        )}
      >
        <span className="material-icons text-sm mr-2">{icon}</span>
        <span className="flex-grow">{label}</span>
        {badge && (
          <span className={cn(
            "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
            badgeColor === "primary" && "bg-primary-500 text-white",
            badgeColor === "info" && "bg-blue-500 text-white",
            badgeColor === "success" && "bg-green-500 text-white",
            badgeColor === "danger" && "bg-red-500 text-white",
            badgeColor === "warning" && "bg-yellow-500 text-white"
          )}>{badge}</span>
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
    <div className="mb-3">
      <div 
        className="flex items-center px-3 py-2 text-gray-400 rounded-md mb-1 cursor-pointer hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <span className="material-icons text-sm mr-2">{icon}</span>}
        <h6 className="uppercase text-xs font-medium text-gray-400 m-0">{title}</h6>
        <span className="material-icons text-sm ml-auto">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>
      <div className={cn("pl-3", isOpen ? "block" : "hidden")}>
        {children}
      </div>
    </div>
  );
};

export default function EnhancedSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
      
      // Auto-collapse on small screens
      if (window.innerWidth <= 1280) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <aside className="h-full flex-shrink-0">
      <div 
        className={cn(
          "flex flex-col bg-gray-900 text-white h-full overflow-auto transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center">
              <span className="material-icons mr-2">account_balance</span>
              <h1 className="text-lg font-semibold">ContaSmart</h1>
            </div>
          )}
          
          {isCollapsed && (
            <span className="material-icons mx-auto">account_balance</span>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white p-1 rounded focus:outline-none"
          >
            <span className="material-icons text-sm">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow p-3 overflow-auto">
          {/* Dashboard */}
          <div className={cn("mb-4", isCollapsed && "flex justify-center")}>
            {isCollapsed ? (
              <Link href="/">
                <div className={cn(
                  "p-2 rounded-md mb-1 cursor-pointer",
                  (location === "/" || location === "") ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">dashboard</span>
                </div>
              </Link>
            ) : (
              <NavItem 
                href="/" 
                icon="dashboard" 
                label="Dashboard" 
                active={location === "/" || location === ""} 
              />
            )}
          </div>
          
          {/* Sections - Only show full sections when not collapsed */}
          {!isCollapsed ? (
            <>
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
            </>
          ) : (
            // Collapsed view - just icons
            <div className="flex flex-col items-center space-y-4">
              <Link href="/documents">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer",
                  location === "/documents" ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">folder</span>
                </div>
              </Link>
              
              <Link href="/invoices">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer",
                  location === "/invoices" ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">receipt</span>
                </div>
              </Link>
              
              <Link href="/fiscal">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer relative",
                  location.startsWith("/fiscal") ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">receipt_long</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                </div>
              </Link>
              
              <Link href="/tasks">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer relative",
                  location === "/tasks" ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">check_circle</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
              </Link>
              
              <Link href="/clients">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer",
                  location === "/clients" ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">people</span>
                </div>
              </Link>
              
              <Link href="/whatsapp">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer relative",
                  location === "/whatsapp" ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">chat</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
              </Link>
              
              <Link href="/financial">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer",
                  location === "/financial" ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">account_balance</span>
                </div>
              </Link>
              
              <Link href="/settings">
                <div className={cn(
                  "p-2 rounded-md cursor-pointer",
                  location === "/settings" ? "bg-primary-600 text-white" : "text-gray-300 hover:bg-primary-700/50"
                )}>
                  <span className="material-icons">settings</span>
                </div>
              </Link>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-800 p-3">
          {isCollapsed ? (
            <div className="flex justify-center">
              <img 
                className="h-8 w-8 rounded-full object-cover"
                src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                alt="Foto de perfil" 
              />
            </div>
          ) : (
            <div className="flex items-center">
              <img 
                className="h-8 w-8 rounded-full object-cover"
                src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                alt="Foto de perfil" 
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-white m-0">
                  {"Usuário"}
                </p>
                <p className="text-xs text-gray-400 m-0">{"Cliente"}</p>
              </div>
              <a href="/api/logout" className="ml-auto text-gray-400 hover:text-white">
                <span className="material-icons text-sm">logout</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}