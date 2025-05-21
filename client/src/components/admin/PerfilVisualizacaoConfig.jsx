import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VIEW_MODES, VIEW_MODE_NAMES } from "@/contexts/ViewModeContext";
import { cn } from "@/lib/utils";

// Estrutura básica dos menus da aplicação
const DEFAULT_MENU_STRUCTURE = {
  principal: [
    { id: 'dashboard', label: 'Dashboard', permissao: true },
    { id: 'tarefas', label: 'Tarefas', permissao: true },
    { id: 'clientes', label: 'Clientes', permissao: true },
  ],
  documentos: [
    { id: 'gerenciador', label: 'Gerenciador de Documentos', permissao: true },
    { id: 'calculadora', label: 'Calculadora de Impostos', permissao: true },
    { id: 'fiscal', label: 'Módulo Fiscal', permissao: true },
  ],
  comunicacao: [
    { id: 'whatsapp', label: 'WhatsApp', permissao: true },
  ],
  financeiro: [
    { id: 'fluxo', label: 'Fluxo de Caixa', permissao: true },
    { id: 'estoque', label: 'Controle de Estoque', permissao: true },
    { id: 'conciliacao', label: 'Conciliação Bancária', permissao: true },
  ],
  sistema: [
    { id: 'relatorios', label: 'Relatórios', permissao: true },
    { id: 'integracoes', label: 'Integrações', permissao: true },
    { id: 'configuracoes', label: 'Configurações', permissao: true },
    { id: 'admin', label: 'Administração', permissao: true },
  ]
};

// Definição das permissões padrão por tipo de visualização
const DEFAULT_PERMISSIONS = {
  [VIEW_MODES.ACCOUNTING_OFFICE]: {
    permissoes: { ...DEFAULT_MENU_STRUCTURE },
    descricao: 'Acesso completo a todas as funcionalidades do sistema'
  },
  [VIEW_MODES.CLIENT_COMPANY]: {
    permissoes: {
      principal: DEFAULT_MENU_STRUCTURE.principal.map(item => ({ ...item })),
      documentos: DEFAULT_MENU_STRUCTURE.documentos.map(item => ({ ...item })),
      comunicacao: DEFAULT_MENU_STRUCTURE.comunicacao.map(item => ({ ...item })),
      financeiro: DEFAULT_MENU_STRUCTURE.financeiro.map(item => ({ ...item })),
      sistema: DEFAULT_MENU_STRUCTURE.sistema.map(item => ({ 
        ...item, 
        permissao: item.id !== 'admin' 
      })),
    },
    descricao: 'Acesso às funcionalidades destinadas às empresas clientes'
  },
  [VIEW_MODES.EXTERNAL_ACCOUNTANT]: {
    permissoes: {
      principal: DEFAULT_MENU_STRUCTURE.principal.map(item => ({ ...item })),
      documentos: DEFAULT_MENU_STRUCTURE.documentos.map(item => ({ ...item })),
      comunicacao: DEFAULT_MENU_STRUCTURE.comunicacao.map(item => ({ ...item, permissao: false })),
      financeiro: DEFAULT_MENU_STRUCTURE.financeiro.map(item => ({ ...item, permissao: false })),
      sistema: DEFAULT_MENU_STRUCTURE.sistema.map(item => ({ 
        ...item, 
        permissao: ['relatorios', 'configuracoes'].includes(item.id)
      })),
    },
    descricao: 'Acesso às funcionalidades contábeis sem recursos administrativos'
  },
  [VIEW_MODES.EXTERNAL_USER]: {
    permissoes: {
      principal: DEFAULT_MENU_STRUCTURE.principal.map(item => ({ 
        ...item, 
        permissao: item.id === 'dashboard' 
      })),
      documentos: DEFAULT_MENU_STRUCTURE.documentos.map(item => ({ 
        ...item, 
        permissao: item.id === 'calculadora' 
      })),
      comunicacao: DEFAULT_MENU_STRUCTURE.comunicacao.map(item => ({ ...item, permissao: false })),
      financeiro: DEFAULT_MENU_STRUCTURE.financeiro.map(item => ({ ...item, permissao: false })),
      sistema: DEFAULT_MENU_STRUCTURE.sistema.map(item => ({ 
        ...item, 
        permissao: item.id === 'configuracoes' 
      })),
    },
    descricao: 'Acesso limitado a módulos específicos sem recursos administrativos'
  }
};

// Componente para perfis personalizados
const PerfisPersonalizados = () => {
  const [perfis, setPerfis] = useState([
    { 
      id: 'contador_empresa', 
      nome: 'Contador da Empresa', 
      baseadoEm: VIEW_MODES.CLIENT_COMPANY,
      permissoes: { ...DEFAULT_PERMISSIONS[VIEW_MODES.CLIENT_COMPANY].permissoes }
    },
    { 
      id: 'financeiro', 
      nome: 'Financeiro', 
      baseadoEm: VIEW_MODES.CLIENT_COMPANY,
      permissoes: { 
        ...DEFAULT_PERMISSIONS[VIEW_MODES.CLIENT_COMPANY].permissoes,
        sistema: DEFAULT_PERMISSIONS[VIEW_MODES.CLIENT_COMPANY].permissoes.sistema.map(item => ({
          ...item,
          permissao: ['relatorios', 'configuracoes'].includes(item.id)
        }))
      }
    }
  ]);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [novoPerfil, setNovoPerfil] = useState({
    nome: '',
    baseadoEm: VIEW_MODES.CLIENT_COMPANY
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const { toast } = useToast();

  // Selecionar um perfil para edição
  const selecionarPerfil = (perfil) => {
    setPerfilSelecionado(perfil);
    setModoEdicao(true);
  };

  // Criar novo perfil
  const criarNovoPerfil = () => {
    if (!novoPerfil.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o novo perfil",
        variant: "destructive"
      });
      return;
    }

    const id = novoPerfil.nome.toLowerCase().replace(/\s+/g, '_');
    const perfilExistente = perfis.find(p => p.id === id);
    
    if (perfilExistente) {
      toast({
        title: "Perfil já existe",
        description: "Já existe um perfil com este nome",
        variant: "destructive"
      });
      return;
    }

    const novoPerfiBB = {
      id,
      nome: novoPerfil.nome,
      baseadoEm: novoPerfil.baseadoEm,
      permissoes: { ...DEFAULT_PERMISSIONS[novoPerfil.baseadoEm].permissoes }
    };

    setPerfis([...perfis, novoPerfiBB]);
    setPerfilSelecionado(novoPerfiBB);
    setModoEdicao(true);
    setNovoPerfil({ nome: '', baseadoEm: VIEW_MODES.CLIENT_COMPANY });
    
    toast({
      title: "Perfil criado",
      description: `O perfil ${novoPerfil.nome} foi criado com sucesso`,
    });
  };

  // Atualizar permissão de um item de menu
  const togglePermissao = (categoria, itemId) => {
    if (!perfilSelecionado) return;

    const novasPermissoes = { ...perfilSelecionado.permissoes };
    
    novasPermissoes[categoria] = novasPermissoes[categoria].map(item => {
      if (item.id === itemId) {
        return { ...item, permissao: !item.permissao };
      }
      return item;
    });

    setPerfilSelecionado({
      ...perfilSelecionado,
      permissoes: novasPermissoes
    });
  };

  // Salvar alterações no perfil selecionado
  const salvarPerfil = () => {
    const novosPerfis = perfis.map(p => 
      p.id === perfilSelecionado.id ? perfilSelecionado : p
    );
    
    setPerfis(novosPerfis);
    
    toast({
      title: "Perfil atualizado",
      description: `As permissões para ${perfilSelecionado.nome} foram atualizadas`,
    });
  };

  // Excluir perfil
  const excluirPerfil = () => {
    if (!perfilSelecionado) return;
    
    const novosPerfis = perfis.filter(p => p.id !== perfilSelecionado.id);
    setPerfis(novosPerfis);
    setPerfilSelecionado(null);
    setModoEdicao(false);
    
    toast({
      title: "Perfil excluído",
      description: `O perfil ${perfilSelecionado.nome} foi excluído`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Perfis Personalizados</CardTitle>
          <CardDescription>
            Crie e gerencie perfis personalizados com permissões específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Lista de perfis */}
            <div className="w-full md:w-1/3">
              <div className="p-4 border rounded-md space-y-3">
                <h3 className="font-medium text-sm">Perfis Disponíveis</h3>
                <ScrollArea className="h-[240px]">
                  <div className="space-y-2">
                    {perfis.map(perfil => (
                      <div 
                        key={perfil.id}
                        className={cn(
                          "p-2 border rounded-md cursor-pointer hover:bg-gray-50",
                          perfilSelecionado?.id === perfil.id && "bg-primary/10 border-primary/30"
                        )}
                        onClick={() => selecionarPerfil(perfil)}
                      >
                        <p className="font-medium">{perfil.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          Baseado em: {VIEW_MODE_NAMES[perfil.baseadoEm]}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <Separator className="my-2" />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Adicionar Novo Perfil</h3>
                  <Input 
                    placeholder="Nome do perfil"
                    value={novoPerfil.nome}
                    onChange={(e) => setNovoPerfil({...novoPerfil, nome: e.target.value})}
                  />
                  <select 
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={novoPerfil.baseadoEm}
                    onChange={(e) => setNovoPerfil({...novoPerfil, baseadoEm: e.target.value})}
                  >
                    {Object.keys(VIEW_MODES).map(key => (
                      <option key={key} value={VIEW_MODES[key]}>
                        {VIEW_MODE_NAMES[VIEW_MODES[key]]}
                      </option>
                    ))}
                  </select>
                  <Button 
                    onClick={criarNovoPerfil}
                    className="w-full"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Perfil
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Edição de permissões */}
            <div className="w-full md:w-2/3 border rounded-md p-4">
              {perfilSelecionado && modoEdicao ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{perfilSelecionado.nome}</h2>
                      <p className="text-sm text-muted-foreground">
                        Configuração de permissões
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setModoEdicao(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={excluirPerfil}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                      <Button 
                        size="sm"
                        onClick={salvarPerfil}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.keys(perfilSelecionado.permissoes).map(categoria => (
                      <div key={categoria} className="border rounded-md p-3">
                        <h3 className="font-medium mb-2 capitalize">
                          {categoria}
                        </h3>
                        <div className="space-y-2">
                          {perfilSelecionado.permissoes[categoria].map(item => (
                            <div 
                              key={item.id} 
                              className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded-md"
                            >
                              <span className="text-sm">{item.label}</span>
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`${categoria}-${item.id}`} className="text-xs">
                                  {item.permissao ? 'Permitido' : 'Bloqueado'}
                                </Label>
                                <Switch 
                                  id={`${categoria}-${item.id}`}
                                  checked={item.permissao}
                                  onCheckedChange={() => togglePermissao(categoria, item.id)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <p className="text-muted-foreground">
                    Selecione um perfil para editar suas permissões ou crie um novo perfil personalizado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para visualizações padrão
const VisualizacoesBase = () => {
  const [visualizacoes, setVisualizacoes] = useState(DEFAULT_PERMISSIONS);
  const [modoAtual, setModoAtual] = useState(VIEW_MODES.ACCOUNTING_OFFICE);
  const { toast } = useToast();

  // Atualizar permissão de um item de menu
  const togglePermissao = (categoria, itemId) => {
    const novasPermissoes = { ...visualizacoes };
    
    novasPermissoes[modoAtual].permissoes[categoria] = 
      novasPermissoes[modoAtual].permissoes[categoria].map(item => {
        if (item.id === itemId) {
          return { ...item, permissao: !item.permissao };
        }
        return item;
      });

    setVisualizacoes(novasPermissoes);
  };

  // Salvar alterações nas permissões padrão
  const salvarAlteracoes = () => {
    // Aqui poderia ter uma chamada à API para persistir as alterações
    toast({
      title: "Configurações salvas",
      description: `As permissões para ${VIEW_MODE_NAMES[modoAtual]} foram atualizadas`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Permissões de Visualização</CardTitle>
          <CardDescription>
            Configure as permissões padrão para cada tipo de visualização do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={VIEW_MODES.ACCOUNTING_OFFICE}
            onValueChange={setModoAtual}
          >
            <TabsList className="grid grid-cols-4 mb-4">
              {Object.keys(VIEW_MODES).map(key => (
                <TabsTrigger key={key} value={VIEW_MODES[key]}>
                  {VIEW_MODE_NAMES[VIEW_MODES[key]]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.keys(VIEW_MODES).map(key => (
              <TabsContent key={key} value={VIEW_MODES[key]}>
                <div className="border rounded-md p-3 mb-4">
                  <h3 className="font-medium">Descrição</h3>
                  <p className="text-sm text-muted-foreground">
                    {visualizacoes[VIEW_MODES[key]].descricao}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {Object.keys(visualizacoes[VIEW_MODES[key]].permissoes).map(categoria => (
                    <div key={categoria} className="border rounded-md p-3">
                      <h3 className="font-medium mb-2 capitalize">
                        {categoria}
                      </h3>
                      <div className="space-y-2">
                        {visualizacoes[VIEW_MODES[key]].permissoes[categoria].map(item => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded-md"
                          >
                            <span className="text-sm">{item.label}</span>
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`${VIEW_MODES[key]}-${categoria}-${item.id}`} className="text-xs">
                                {item.permissao ? 'Permitido' : 'Bloqueado'}
                              </Label>
                              <Switch 
                                id={`${VIEW_MODES[key]}-${categoria}-${item.id}`}
                                checked={item.permissao}
                                onCheckedChange={() => togglePermissao(categoria, item.id)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button onClick={salvarAlteracoes}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente principal
export default function PerfilVisualizacaoConfig() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="visualizacoes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="visualizacoes">Visualizações Base</TabsTrigger>
          <TabsTrigger value="perfis">Perfis Personalizados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualizacoes">
          <VisualizacoesBase />
        </TabsContent>
        
        <TabsContent value="perfis">
          <PerfisPersonalizados />
        </TabsContent>
      </Tabs>
    </div>
  );
}