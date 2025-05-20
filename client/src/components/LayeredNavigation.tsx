import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useLayeredAccess, useLayeredUI } from '@/hooks/useLayeredAccess';
import { SystemModule } from '../../shared/auth/permissions';
import { useAuth } from '@/contexts/AuthContext';

// Ícones
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Users,
  CheckSquare,
  MessageSquare,
  CreditCard,
  BarChart4,
  Briefcase,
  Database,
  Settings,
  PackageOpen,
  Calculator,
  CircleDollarSign,
  ArrowRightLeft,
  Boxes
} from 'lucide-react';

interface NavigationItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  visible?: boolean;
}

const NavigationItem = ({ href, label, icon: Icon, active, visible = true }: NavigationItemProps) => {
  if (!visible) return null;
  
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
          active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-primary/5"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </a>
    </Link>
  );
};

interface NavigationSectionProps {
  title: string;
  children: React.ReactNode;
}

const NavigationSection = ({ title, children }: NavigationSectionProps) => {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-muted-foreground/70 mb-2 uppercase tracking-wider px-3">
        {title}
      </div>
      <nav className="flex flex-col gap-1">
        {children}
      </nav>
    </div>
  );
};

export default function LayeredNavigation() {
  const [location] = useLocation();
  const { canReadModule } = useAuth();
  const { isAdminLayer, isEscritorioLayer, isEmpresaLayer } = useLayeredAccess();
  const { visibleMenuItems } = useLayeredUI();
  
  return (
    <div className="h-full px-3 py-4 overflow-auto border-r border-border">
      {/* Logo da NIXCON - Sempre visível */}
      <div className="mb-5 px-3">
        <Link href="/">
          <a className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">NIXCON</h1>
          </a>
        </Link>
      </div>
      
      {/* Seção Principal - Adaptada ao perfil */}
      <NavigationSection title="Principal">
        <NavigationItem
          href="/dashboard"
          label="Dashboard"
          icon={LayoutDashboard}
          active={location === '/dashboard'}
          visible={visibleMenuItems.dashboard}
        />
        
        <NavigationItem
          href="/tarefas"
          label="Tarefas"
          icon={CheckSquare}
          active={location === '/tarefas'}
          visible={visibleMenuItems.tarefas}
        />
        
        <NavigationItem
          href="/clientes"
          label="Clientes"
          icon={Users}
          active={location === '/clientes'}
          visible={visibleMenuItems.clientes}
        />
      </NavigationSection>
      
      {/* Seção de Documentos - Para todos (com conteúdo adaptado) */}
      <NavigationSection title="Documentos">
        <NavigationItem
          href="/documentos"
          label="Gerenciador"
          icon={FileText}
          active={location === '/documentos'}
          visible={visibleMenuItems.documentos}
        />
        
        <NavigationItem
          href="/tax-calculator"
          label="Calculadora de Impostos"
          icon={Calculator}
          active={location === '/tax-calculator'}
          visible={visibleMenuItems.taxCalculator}
        />
      </NavigationSection>
      
      {/* Seção Fiscal - Apenas para Empresas e Superior */}
      {isEmpresaLayer && (
        <NavigationSection title="Fiscal">
          <NavigationItem
            href="/fiscal"
            label="Módulo Fiscal"
            icon={Receipt}
            active={location === '/fiscal'}
            visible={visibleMenuItems.fiscal}
          />
          
          <NavigationItem
            href="/fiscal/emissor"
            label="Emissor NF-e/NFS-e"
            icon={Receipt}
            active={location === '/fiscal/emissor'}
            visible={visibleMenuItems.fiscalEmissor}
          />
          
          <NavigationItem
            href="/fiscal/cadastros"
            label="Cadastros"
            icon={Database}
            active={location === '/fiscal/cadastros'}
            visible={visibleMenuItems.fiscalCadastros}
          />
          
          <NavigationItem
            href="/fiscal/relatorios"
            label="Relatórios"
            icon={BarChart4}
            active={location === '/fiscal/relatorios'}
            visible={visibleMenuItems.fiscalRelatorios}
          />
        </NavigationSection>
      )}
      
      {/* Seção Financeira - Apenas para Empresas e Superior */}
      {isEmpresaLayer && (
        <NavigationSection title="Financeiro">
          <NavigationItem
            href="/financeiro"
            label="Financeiro"
            icon={CreditCard}
            active={location === '/financeiro'}
            visible={visibleMenuItems.financeiro}
          />
          
          <NavigationItem
            href="/financeiro/fluxo-caixa"
            label="Fluxo de Caixa"
            icon={CircleDollarSign}
            active={location === '/financeiro/fluxo-caixa'}
            visible={visibleMenuItems.financeiro}
          />
          
          <NavigationItem
            href="/financeiro/conciliacao"
            label="Conciliação Bancária"
            icon={ArrowRightLeft}
            active={location === '/financeiro/conciliacao'}
            visible={visibleMenuItems.financeiro}
          />
          
          <NavigationItem
            href="/estoque"
            label="Controle de Estoque"
            icon={Boxes}
            active={location === '/estoque'}
            visible={visibleMenuItems.financeiro}
          />
        </NavigationSection>
      )}
      
      {/* Seção de Comunicação - Para todos (com conteúdo adaptado) */}
      <NavigationSection title="Comunicação">
        <NavigationItem
          href="/whatsapp"
          label="WhatsApp"
          icon={MessageSquare}
          active={location === '/whatsapp'}
          visible={visibleMenuItems.dashboard}
        />
      </NavigationSection>
      
      {/* Seção Administrativa - Apenas para Escritório e Admin */}
      {isEscritorioLayer && (
        <NavigationSection title="Administração">
          {isEscritorioLayer && (
            <NavigationItem
              href="/empresas"
              label="Empresas Usuárias"
              icon={Briefcase}
              active={location === '/empresas'}
              visible={visibleMenuItems.empresaManagement}
            />
          )}
          
          {isAdminLayer && (
            <NavigationItem
              href="/usuarios"
              label="Usuários"
              icon={Users}
              active={location === '/usuarios'}
              visible={visibleMenuItems.userManagement}
            />
          )}
          
          {isAdminLayer && (
            <NavigationItem
              href="/configuracoes-sistema"
              label="Sistema"
              icon={Settings}
              active={location === '/configuracoes-sistema'}
              visible={visibleMenuItems.systemSettings}
            />
          )}
        </NavigationSection>
      )}
      
      {/* Configurações - Para todos (com conteúdo adaptado) */}
      <NavigationSection title="Sistema">
        <NavigationItem
          href="/settings"
          label="Configurações"
          icon={Settings}
          active={location === '/settings'}
          visible={true}
        />
      </NavigationSection>
    </div>
  );
}