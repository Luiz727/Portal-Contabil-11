import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  MessageSquare,
  Wallet,
  Package2,
  ArrowLeftRight,
  BarChart2,
  Puzzle,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  collapsed?: boolean;
};

const NavItem = ({ icon, label, href, active, collapsed = false }: NavItemProps) => {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center py-2 px-3 rounded-md mb-1 text-sm font-medium transition-colors cursor-pointer",
        "hover:bg-primary/10 hover:text-primary",
        active 
          ? "bg-primary/15 text-primary" 
          : "text-foreground/80"
      )}>
        <div className="mr-2 h-5 w-5">{icon}</div>
        {!collapsed && <span>{label}</span>}
      </div>
    </Link>
  );
};

type NavSectionProps = {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
};

const NavSection = ({ title, children, collapsed = false }: NavSectionProps) => {
  return (
    <div className="mb-6">
      {!collapsed && (
        <h6 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h6>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

// Componente principal do Sidebar
export default function EnhancedSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // Verifica o tamanho da tela ao carregar e quando redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else if (window.innerWidth > 1200) {
        setCollapsed(false);
      }
    };

    // Executa uma vez ao montar
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Configuração dos ícones para cada item de navegação
  const getIcon = (name: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      dashboard: <LayoutDashboard size={20} />,
      tasks: <FileText size={20} />,
      clients: <Users size={20} />,
      documents: <FileText size={20} />,
      invoices: <Receipt size={20} />,
      fiscal: <Receipt size={20} />,
      whatsapp: <MessageSquare size={20} />,
      financial: <Wallet size={20} />,
      inventory: <Package2 size={20} />,
      reconciliation: <ArrowLeftRight size={20} />,
      reports: <BarChart2 size={20} />,
      integrations: <Puzzle size={20} />,
      settings: <Settings size={20} />
    };
    return iconMap[name] || <FileText size={20} />;
  };

  // Versão para desktop/tablet
  const DesktopSidebar = () => (
    <div className={cn(
      "h-screen flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Cabeçalho com logo */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-bold text-lg">ContaSmart</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navegação principal */}
      <nav className="flex-grow p-2 overflow-y-auto">
        <NavSection title="Principal" collapsed={collapsed}>
          <NavItem 
            href="/" 
            icon={getIcon("dashboard")}
            label="Dashboard" 
            active={location === "/" || location === ""} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/tasks" 
            icon={getIcon("tasks")}
            label="Tarefas" 
            active={location === "/tasks"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/clients" 
            icon={getIcon("clients")}
            label="Clientes" 
            active={location === "/clients"} 
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Documentos" collapsed={collapsed}>
          <NavItem 
            href="/documents" 
            icon={getIcon("documents")}
            label="Gerenciador" 
            active={location === "/documents"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/invoices" 
            icon={getIcon("invoices")}
            label="Calculadora de Impostos" 
            active={location === "/invoices"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/fiscal" 
            icon={getIcon("fiscal")}
            label="Módulo Fiscal" 
            active={location.startsWith("/fiscal")} 
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Comunicação" collapsed={collapsed}>
          <NavItem 
            href="/whatsapp" 
            icon={getIcon("whatsapp")}
            label="WhatsApp" 
            active={location === "/whatsapp"} 
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Financeiro" collapsed={collapsed}>
          <NavItem 
            href="/financial" 
            icon={getIcon("financial")}
            label="Fluxo de Caixa" 
            active={location === "/financial"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/inventory" 
            icon={getIcon("inventory")}
            label="Controle de Estoque" 
            active={location === "/inventory"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/reconciliation" 
            icon={getIcon("reconciliation")}
            label="Conciliação Bancária" 
            active={location === "/reconciliation"} 
            collapsed={collapsed}
          />
        </NavSection>

        <NavSection title="Sistema" collapsed={collapsed}>
          <NavItem 
            href="/reports" 
            icon={getIcon("reports")}
            label="Relatórios" 
            active={location === "/reports"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/integrations" 
            icon={getIcon("integrations")}
            label="Integrações" 
            active={location === "/integrations"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/settings" 
            icon={getIcon("settings")}
            label="Configurações" 
            active={location === "/settings"} 
            collapsed={collapsed}
          />
          
          <NavItem 
            href="/admin/configuracoes" 
            icon={<ShieldCheck size={20} />}
            label="Administração" 
            active={location.startsWith("/admin")} 
            collapsed={collapsed}
          />
        </NavSection>
      </nav>

      {/* Perfil do usuário */}
      <div className="p-3 border-t border-border flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
            alt="Foto de perfil" 
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        {!collapsed && (
          <>
            <div className="ml-2 flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Usuário</p>
              <p className="text-xs text-muted-foreground truncate">Cliente</p>
            </div>
            
            <a 
              href="/api/logout" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={18} />
            </a>
          </>
        )}
      </div>
    </div>
  );

  // Versão para mobile (off-canvas)
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[85%] max-w-[300px]">
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <span className="font-bold text-lg">ContaSmart</span>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <X size={18} />
              </Button>
            </SheetTrigger>
          </div>

          <nav className="flex-grow p-3 overflow-y-auto">
            <NavSection title="Principal">
              <NavItem 
                href="/" 
                icon={getIcon("dashboard")}
                label="Dashboard" 
                active={location === "/" || location === ""} 
                collapsed={false}
              />
              
              <NavItem 
                href="/tasks" 
                icon={getIcon("tasks")}
                label="Tarefas" 
                active={location === "/tasks"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/clients" 
                icon={getIcon("clients")}
                label="Clientes" 
                active={location === "/clients"} 
                collapsed={false}
              />
            </NavSection>

            <NavSection title="Documentos">
              <NavItem 
                href="/documents" 
                icon={getIcon("documents")}
                label="Gerenciador" 
                active={location === "/documents"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/invoices" 
                icon={getIcon("invoices")}
                label="Calculadora de Impostos" 
                active={location === "/invoices"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/fiscal" 
                icon={getIcon("fiscal")}
                label="Módulo Fiscal" 
                active={location.startsWith("/fiscal")} 
                collapsed={false}
              />
            </NavSection>

            <NavSection title="Comunicação">
              <NavItem 
                href="/whatsapp" 
                icon={getIcon("whatsapp")}
                label="WhatsApp" 
                active={location === "/whatsapp"} 
                collapsed={false}
              />
            </NavSection>

            <NavSection title="Financeiro">
              <NavItem 
                href="/financial" 
                icon={getIcon("financial")}
                label="Fluxo de Caixa" 
                active={location === "/financial"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/inventory" 
                icon={getIcon("inventory")}
                label="Controle de Estoque" 
                active={location === "/inventory"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/reconciliation" 
                icon={getIcon("reconciliation")}
                label="Conciliação Bancária" 
                active={location === "/reconciliation"} 
                collapsed={false}
              />
            </NavSection>

            <NavSection title="Sistema">
              <NavItem 
                href="/reports" 
                icon={getIcon("reports")}
                label="Relatórios" 
                active={location === "/reports"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/integrations" 
                icon={getIcon("integrations")}
                label="Integrações" 
                active={location === "/integrations"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/settings" 
                icon={getIcon("settings")}
                label="Configurações" 
                active={location === "/settings"} 
                collapsed={false}
              />
              
              <NavItem 
                href="/admin/configuracoes" 
                icon={<ShieldCheck size={20} />}
                label="Administração" 
                active={location.startsWith("/admin")} 
                collapsed={false}
              />
            </NavSection>
          </nav>

          <div className="p-3 border-t border-border">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                  alt="Foto de perfil" 
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              
              <div className="ml-2 flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Usuário</p>
                <p className="text-xs text-muted-foreground truncate">Cliente</p>
              </div>
              
              <a 
                href="/api/logout" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={18} />
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <div className="block md:hidden">
        <MobileSidebar />
      </div>
    </>
  );
}