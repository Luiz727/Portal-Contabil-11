import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building, 
  Users, 
  Truck, 
  Package2, 
  CircleDollarSign, 
  ReceiptText, 
  FileText,
  Settings,
  Lock,
  Briefcase
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useViewMode, VIEW_MODES } from "@/contexts/ViewModeContext";

// Componente para configuração do perfil da empresa
const PerfilEmpresa = () => {
  const [formData, setFormData] = useState({
    razaoSocial: "Comércio Varejista Alfa Ltda",
    nomeFantasia: "Alfa Comércio",
    cnpj: "12.345.678/0001-90",
    inscricaoEstadual: "123456789",
    inscricaoMunicipal: "98765432",
    telefone: "(11) 98765-4321",
    email: "contato@alfacomercio.com.br",
    endereco: "Av. Paulista, 1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    regime: "Simples Nacional",
    cnae: "4712-1/00",
    responsavel: "João Silva"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Perfil da empresa atualizado com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil da Empresa</CardTitle>
        <CardDescription>
          Informações cadastrais e fiscais da empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razaoSocial">Razão Social</Label>
              <Input 
                id="razaoSocial" 
                name="razaoSocial"
                value={formData.razaoSocial}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input 
                id="nomeFantasia" 
                name="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj" 
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
              <Input 
                id="inscricaoEstadual" 
                name="inscricaoEstadual"
                value={formData.inscricaoEstadual}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
              <Input 
                id="inscricaoMunicipal" 
                name="inscricaoMunicipal"
                value={formData.inscricaoMunicipal}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone" 
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input 
                id="endereco" 
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input 
                id="bairro" 
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input 
                id="cidade" 
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input 
                id="estado" 
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input 
                id="cep" 
                name="cep"
                value={formData.cep}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="regime">Regime Tributário</Label>
              <select 
                id="regime" 
                name="regime"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={formData.regime}
                onChange={handleChange}
              >
                <option value="Simples Nacional">Simples Nacional</option>
                <option value="Lucro Presumido">Lucro Presumido</option>
                <option value="Lucro Real">Lucro Real</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnae">CNAE Principal</Label>
              <Input 
                id="cnae" 
                name="cnae"
                value={formData.cnae}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input 
                id="responsavel" 
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Componente para gerenciar usuários da empresa
const UsuariosEmpresa = () => {
  const [usuarios, setUsuarios] = useState([
    { 
      id: 1, 
      nome: 'Ana Silva', 
      email: 'ana.silva@alfacomercio.com.br', 
      cargo: 'Gerente', 
      departamento: 'Administrativo',
      ativo: true
    },
    { 
      id: 2, 
      nome: 'Carlos Santos', 
      email: 'carlos.santos@alfacomercio.com.br', 
      cargo: 'Financeiro', 
      departamento: 'Financeiro',
      ativo: true
    },
    { 
      id: 3, 
      nome: 'Marina Oliveira', 
      email: 'marina.oliveira@alfacomercio.com.br', 
      cargo: 'Vendedor', 
      departamento: 'Comercial',
      ativo: false
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários da Empresa</CardTitle>
        <CardDescription>
          Gerenciar usuários e suas permissões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>
        
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-4 p-3 font-medium text-sm border-b">
            <div className="col-span-3">Nome</div>
            <div className="col-span-3">E-mail</div>
            <div className="col-span-2">Cargo</div>
            <div className="col-span-2">Departamento</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>
          
          <ScrollArea className="h-[400px]">
            {usuarios.map(usuario => (
              <div key={usuario.id} className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-gray-50">
                <div className="col-span-3 flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${usuario.nome}`} />
                    <AvatarFallback>{usuario.nome.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{usuario.nome}</span>
                </div>
                <div className="col-span-3 flex items-center">{usuario.email}</div>
                <div className="col-span-2 flex items-center">{usuario.cargo}</div>
                <div className="col-span-2 flex items-center">{usuario.departamento}</div>
                <div className="col-span-1 flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Lock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para configurações de integração
const ConfiguracoesIntegracao = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações</CardTitle>
        <CardDescription>
          Configure as integrações com sistemas externos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Certificado Digital</CardTitle>
                <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                  Ativo
                </div>
              </div>
              <CardDescription>
                Configuração do certificado digital para emissão de notas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Validade:</span>
                  <span className="text-sm">22/05/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Emissor:</span>
                  <span className="text-sm">AC Certisign</span>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">Gerenciar Certificado</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Integra Notas</CardTitle>
                <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                  Conectado
                </div>
              </div>
              <CardDescription>
                Integração com Integra Notas para emissão de NFe/NFSe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Último sincronismo:</span>
                  <span className="text-sm">21/05/2025 15:45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Documentos sincronizados:</span>
                  <span className="text-sm">458</span>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">Configurar Integração</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Integração Bancária</CardTitle>
                <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                  Configuração Pendente
                </div>
              </div>
              <CardDescription>
                Conexão com banco para conciliação e pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Banco:</span>
                  <span className="text-sm">BTG Pactual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm">Aguardando configuração</span>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">Configurar Integração</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">API de Produtos</CardTitle>
                <div className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                  Desativado
                </div>
              </div>
              <CardDescription>
                Disponibiliza API REST para integração de produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm">Não configurado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Último acesso:</span>
                  <span className="text-sm">N/A</span>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">Ativar API</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal da página
export default function ConfiguracoesEmpresaPage() {
  const { viewMode } = useViewMode();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua empresa
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="perfil" className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            <span>Perfil da Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Integrações</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil">
          <PerfilEmpresa />
        </TabsContent>
        
        <TabsContent value="usuarios">
          <UsuariosEmpresa />
        </TabsContent>
        
        <TabsContent value="integracoes">
          <ConfiguracoesIntegracao />
        </TabsContent>
      </Tabs>
    </div>
  );
}