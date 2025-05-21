import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useEmpresas } from '@/contexts/EmpresasContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Building, Users, LayoutDashboard, CreditCard, FileText, Share2, Settings } from "lucide-react";

const DadosEmpresaForm = ({ empresa, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    site: '',
    observacoes: '',
    ativo: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if (empresa) {
      setFormData({
        nome: empresa.nome || '',
        cnpj: empresa.cnpj || '',
        endereco: empresa.endereco || '',
        cidade: empresa.cidade || '',
        estado: empresa.estado || '',
        cep: empresa.cep || '',
        telefone: empresa.telefone || '',
        email: empresa.email || '',
        site: empresa.site || '',
        observacoes: empresa.observacoes || '',
        ativo: empresa.ativo !== false
      });
    }
  }, [empresa]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Dados salvos",
      description: "As informações da empresa foram atualizadas com sucesso"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Empresa</Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="site">Site</Label>
        <Input
          id="site"
          name="site"
          value={formData.site}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          className="w-full min-h-[100px] p-2 border rounded-md"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="ativo"
          name="ativo"
          checked={formData.ativo}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="ativo">Empresa ativa</Label>
      </div>

      <Button type="submit" className="w-full md:w-auto">Salvar Alterações</Button>
    </form>
  );
};

const UsuariosEmpresaTab = ({ empresa }) => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "João Silva", email: "joao@exemplo.com", cargo: "Gerente", ativo: true },
    { id: 2, nome: "Maria Oliveira", email: "maria@exemplo.com", cargo: "Financeiro", ativo: true },
    { id: 3, nome: "Pedro Santos", email: "pedro@exemplo.com", cargo: "Contador", ativo: false }
  ]);
  const { toast } = useToast();

  const toggleUsuarioStatus = (id) => {
    setUsuarios(prev => prev.map(u => 
      u.id === id ? { ...u, ativo: !u.ativo } : u
    ));
    toast({
      title: "Status atualizado",
      description: "O status do usuário foi atualizado com sucesso"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Usuários da Empresa</h3>
        <Button>Adicionar Usuário</Button>
      </div>
      
      <div className="border rounded-md divide-y">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{usuario.nome}</p>
              <p className="text-sm text-muted-foreground">{usuario.email}</p>
              <p className="text-xs text-muted-foreground">Cargo: {usuario.cargo}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={usuario.ativo}
                  onCheckedChange={() => toggleUsuarioStatus(usuario.id)}
                />
                <span className="text-sm">{usuario.ativo ? 'Ativo' : 'Inativo'}</span>
              </div>
              <Button variant="outline" size="sm">Editar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModulosAcessoTab = ({ empresa }) => {
  const [modulos, setModulos] = useState([
    { id: 'fiscal', nome: 'Módulo Fiscal', ativo: true },
    { id: 'estoque', nome: 'Controle de Estoque', ativo: true },
    { id: 'financeiro', nome: 'Financeiro', ativo: true },
    { id: 'documentos', nome: 'Gerenciador de Documentos', ativo: true },
    { id: 'nfe', nome: 'Emissão de NFe', ativo: true },
    { id: 'nfse', nome: 'Emissão de NFSe', ativo: false },
    { id: 'impostos', nome: 'Calculadora de Impostos', ativo: true },
    { id: 'bancario', nome: 'Integração Bancária', ativo: false }
  ]);
  const { toast } = useToast();

  const toggleModulo = (id) => {
    setModulos(prev => prev.map(m => 
      m.id === id ? { ...m, ativo: !m.ativo } : m
    ));
    toast({
      title: "Módulo atualizado",
      description: "As permissões de acesso aos módulos foram atualizadas"
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Módulos Habilitados</h3>
      <p className="text-sm text-muted-foreground">
        Configure quais módulos esta empresa terá acesso
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modulos.map(modulo => (
          <div 
            key={modulo.id} 
            className="border rounded-md p-4 flex items-center justify-between"
          >
            <p className="font-medium">{modulo.nome}</p>
            <Switch 
              checked={modulo.ativo}
              onCheckedChange={() => toggleModulo(modulo.id)}
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <Button>Salvar Configurações</Button>
      </div>
    </div>
  );
};

const IntegracoesFiscaisTab = ({ empresa }) => {
  const [integracoes, setIntegracoes] = useState({
    integraMais: {
      habilitado: true,
      token: 'ab125c3d4e5f6g7h8i9j0',
      ambiente: 'producao'
    },
    certificadoDigital: {
      habilitado: true,
      validade: '2025-12-31',
      senha: '******'
    },
    configuracaoNFe: {
      serie: '1',
      proximoNumero: '1001',
      ambiente: 'producao'
    }
  });
  const { toast } = useToast();

  const salvarIntegracoes = () => {
    toast({
      title: "Integrações salvas",
      description: "As configurações de integrações fiscais foram atualizadas"
    });
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Integra Notas</h3>
            <p className="text-sm text-muted-foreground">Configuração para emissão de notas fiscais</p>
          </div>
          <Switch 
            checked={integracoes.integraMais.habilitado}
            onCheckedChange={() => setIntegracoes(prev => ({
              ...prev,
              integraMais: { 
                ...prev.integraMais, 
                habilitado: !prev.integraMais.habilitado 
              }
            }))}
          />
        </div>
        
        {integracoes.integraMais.habilitado && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="tokenIntegra">Token de Acesso</Label>
              <Input 
                id="tokenIntegra"
                value={integracoes.integraMais.token}
                onChange={(e) => setIntegracoes(prev => ({
                  ...prev,
                  integraMais: { ...prev.integraMais, token: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ambienteIntegra">Ambiente</Label>
              <select 
                id="ambienteIntegra"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={integracoes.integraMais.ambiente}
                onChange={(e) => setIntegracoes(prev => ({
                  ...prev,
                  integraMais: { ...prev.integraMais, ambiente: e.target.value }
                }))}
              >
                <option value="producao">Produção</option>
                <option value="homologacao">Homologação</option>
                <option value="teste">Teste</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Certificado Digital</h3>
            <p className="text-sm text-muted-foreground">Configuração do certificado para assinatura digital</p>
          </div>
          <Switch 
            checked={integracoes.certificadoDigital.habilitado}
            onCheckedChange={() => setIntegracoes(prev => ({
              ...prev,
              certificadoDigital: { 
                ...prev.certificadoDigital, 
                habilitado: !prev.certificadoDigital.habilitado 
              }
            }))}
          />
        </div>
        
        {integracoes.certificadoDigital.habilitado && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="validadeCert">Validade</Label>
              <Input 
                id="validadeCert"
                type="date"
                value={integracoes.certificadoDigital.validade}
                onChange={(e) => setIntegracoes(prev => ({
                  ...prev,
                  certificadoDigital: { ...prev.certificadoDigital, validade: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senhaCert">Senha do Certificado</Label>
              <Input 
                id="senhaCert"
                type="password"
                value={integracoes.certificadoDigital.senha}
                onChange={(e) => setIntegracoes(prev => ({
                  ...prev,
                  certificadoDigital: { ...prev.certificadoDigital, senha: e.target.value }
                }))}
              />
            </div>
            <div className="col-span-2">
              <Button variant="outline" className="w-full">Fazer Upload do Certificado</Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="border rounded-md p-4 space-y-4">
        <h3 className="text-lg font-medium">Configuração de NF-e</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serieNFe">Série</Label>
            <Input 
              id="serieNFe"
              value={integracoes.configuracaoNFe.serie}
              onChange={(e) => setIntegracoes(prev => ({
                ...prev,
                configuracaoNFe: { ...prev.configuracaoNFe, serie: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proxNumNFe">Próximo Número</Label>
            <Input 
              id="proxNumNFe"
              value={integracoes.configuracaoNFe.proximoNumero}
              onChange={(e) => setIntegracoes(prev => ({
                ...prev,
                configuracaoNFe: { ...prev.configuracaoNFe, proximoNumero: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ambienteNFe">Ambiente</Label>
            <select 
              id="ambienteNFe"
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={integracoes.configuracaoNFe.ambiente}
              onChange={(e) => setIntegracoes(prev => ({
                ...prev,
                configuracaoNFe: { ...prev.configuracaoNFe, ambiente: e.target.value }
              }))}
            >
              <option value="producao">Produção</option>
              <option value="homologacao">Homologação</option>
            </select>
          </div>
        </div>
      </div>
      
      <Button onClick={salvarIntegracoes}>Salvar Todas as Configurações</Button>
    </div>
  );
};

const ConfiguracoesEmpresaPage = () => {
  const { empresaAtual, empresas } = useEmpresas();
  const [empresa, setEmpresa] = useState(null);
  
  // Empresa de exemplo para desenvolvimento
  const empresaExemplo = {
    id: 'emp1',
    nome: 'Comércio ABC',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua Exemplo, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    telefone: '(11) 98765-4321',
    email: 'contato@comercioabc.com.br',
    site: 'www.comercioabc.com.br',
    observacoes: 'Cliente desde 2020',
    ativo: true
  };
  
  useEffect(() => {
    // Se existir uma empresa selecionada no contexto, usa ela
    if (empresaAtual) {
      setEmpresa(empresaAtual);
    } else if (empresas && empresas.length > 0) {
      setEmpresa(empresas[0]);
    } else {
      // Se não, usa a empresa de exemplo
      setEmpresa(empresaExemplo);
    }
  }, [empresaAtual, empresas]);
  
  // Salva os dados da empresa (mock)
  const handleSalvarEmpresa = (dadosEmpresa) => {
    setEmpresa(dadosEmpresa);
    // Aqui chamaria a API para persistir os dados
  };

  if (!empresa) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nixcon-dark">Configurações da Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações e permissões da empresa usuária
          </p>
        </div>
      </div>

      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="dados" className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-[#d9bb42]" />
            <span className="hidden md:inline">Dados da Empresa</span>
            <span className="inline md:hidden">Dados</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-[#d9bb42]" />
            <span className="hidden md:inline">Usuários</span>
            <span className="inline md:hidden">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="modulos" className="flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-2 text-[#d9bb42]" />
            <span className="hidden md:inline">Módulos & Permissões</span>
            <span className="inline md:hidden">Módulos</span>
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-[#d9bb42]" />
            <span className="hidden md:inline">Integrações Fiscais</span>
            <span className="inline md:hidden">Fiscal</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center">
            <Settings className="h-4 w-4 mr-2 text-[#d9bb42]" />
            <span className="hidden md:inline">Configurações Avançadas</span>
            <span className="inline md:hidden">Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Cadastrais</CardTitle>
              <CardDescription>
                Informações básicas da empresa usuária
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DadosEmpresaForm empresa={empresa} onSave={handleSalvarEmpresa} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários da Empresa</CardTitle>
              <CardDescription>
                Gerencie os usuários vinculados a esta empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsuariosEmpresaTab empresa={empresa} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modulos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Módulos e Permissões</CardTitle>
              <CardDescription>
                Configure os módulos disponíveis para esta empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModulosAcessoTab empresa={empresa} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fiscal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Fiscais</CardTitle>
              <CardDescription>
                Configure certificados digitais e integrações com sistemas fiscais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegracoesFiscaisTab empresa={empresa} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Ajustes e configurações avançadas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Backup e Restauração</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Exportar Dados</Button>
                  <Button variant="outline">Importar Dados</Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notificações</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-fiscal">Alertas Fiscais</Label>
                      <Switch id="notify-fiscal" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-vencimentos">Alertas de Vencimentos</Label>
                      <Switch id="notify-vencimentos" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-tarefas">Notificações de Tarefas</Label>
                      <Switch id="notify-tarefas" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-destructive">Zona de Perigo</h3>
                  <p className="text-sm text-muted-foreground">
                    Estas ações são irreversíveis e devem ser usadas com cuidado
                  </p>
                  <div className="pt-2">
                    <Button variant="destructive">Limpar Todos os Dados</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesEmpresaPage;