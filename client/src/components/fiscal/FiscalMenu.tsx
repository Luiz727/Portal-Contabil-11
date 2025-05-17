import React from 'react';
import { Link } from 'wouter';
import {
  ChevronDown,
  ShoppingCart,
  Settings,
  FileText,
  BarChart2,
  MessageSquare,
  Package,
  Users,
  Truck,
  BookOpen,
  Box,
  Tag,
  Briefcase,
  Clipboard,
  Sliders,
  User,
  Bell,
  FileDigit,
  Factory
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface FiscalMenuProps {
  activeSection?: string;
}

const FiscalMenu: React.FC<FiscalMenuProps> = ({ activeSection }) => {
  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow mb-4">
      {/* Menu Cadastros */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={activeSection === 'cadastros' ? 'default' : 'outline'} className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Cadastros
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Cadastros</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/produtos">
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Produtos</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/servicos">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Serviços</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/marcas">
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Marcas</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/categorias">
                <div className="flex items-center">
                  <Clipboard className="mr-2 h-4 w-4" />
                  <span>Categorias</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/unidades">
                <div className="flex items-center">
                  <Box className="mr-2 h-4 w-4" />
                  <span>Unidades de Medida</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/clientes">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Clientes</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/fornecedores">
                <div className="flex items-center">
                  <Factory className="mr-2 h-4 w-4" />
                  <span>Fornecedores</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/transportadoras">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Transportadoras</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/plano-contas">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Plano de Contas</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/cadastros/kits">
                <div className="flex items-center">
                  <Box className="mr-2 h-4 w-4" />
                  <span>Kits</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu Ajustes */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={activeSection === 'ajustes' ? 'default' : 'outline'} className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Ajustes
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Ajustes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/empresa">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Configurações da Empresa</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/permissoes">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Permissões</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/logs">
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Logs</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/fiscais">
                <div className="flex items-center">
                  <FileDigit className="mr-2 h-4 w-4" />
                  <span>Configurações Fiscais</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/nfe">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>NF-e</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/cte">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>CT-e</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/nfce">
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>NFC-e</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/nfse">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>NFS-e</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/matriz-fiscal">
                <div className="flex items-center">
                  <Sliders className="mr-2 h-4 w-4" />
                  <span>Matriz Fiscal</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/natureza-operacao">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Natureza de Operação</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/ajustes/estados-destino">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Estados de Destino</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu Relatórios */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={activeSection === 'relatorios' ? 'default' : 'outline'} className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4" />
            Relatórios
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Relatórios</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/produtos">
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Produtos</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/clientes">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Clientes</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/estoque">
                <div className="flex items-center">
                  <Box className="mr-2 h-4 w-4" />
                  <span>Estoque</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/vendas">
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Vendas</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/compras">
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Compras</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/servicos">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Serviços</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/caixa">
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Caixa</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/contas-pagar">
                <div className="flex items-center">
                  <FileDigit className="mr-2 h-4 w-4" />
                  <span>Contas a Pagar</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/relatorios/contas-receber">
                <div className="flex items-center">
                  <FileDigit className="mr-2 h-4 w-4" />
                  <span>Contas a Receber</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu Emissor */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={activeSection === 'emissor' ? 'default' : 'outline'} className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Emissor
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Emissor</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/nfe">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Emissão de NFe</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/nfce">
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Emissão de NFCe</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/cte">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Emissão de CTe</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/nfs">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Emissão de NFS</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/nfe-ajuste">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Emissão de NFe Ajuste</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/nfe-complementar">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Emissão de NFe Complementar</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/nfe-importacao">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Emissão de NFe Importação</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/nfe-exportacao">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Emissão de NFe Exportação</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/consultar">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Consultar Documentos</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/notas-recebidas">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Notas Recebidas</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/emissor/mdfe">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>MDF-e</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu Comunicação */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={activeSection === 'comunicacao' ? 'default' : 'outline'} className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comunicação
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Comunicação</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/fiscal/comunicacao/email">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>E-mail</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/comunicacao/whatsapp">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>WhatsApp</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/fiscal/comunicacao/parametros">
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Parâmetros</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FiscalMenu;