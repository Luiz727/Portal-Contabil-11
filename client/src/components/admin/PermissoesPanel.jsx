import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  LockIcon, 
  ShieldAlert, 
  ShieldCheck,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Save,
  User,
  Users
} from 'lucide-react';

const SecaoPermissao = ({ titulo, descricao, permissoes, onChange, expandida = false }) => {
  const [expanded, setExpanded] = useState(expandida);

  return (
    <Card className="mb-4">
      <CardHeader 
        className="pb-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              {titulo}
            </CardTitle>
            <CardDescription className="mt-1">{descricao}</CardDescription>
          </div>
          <ArrowRight 
            className={`h-5 w-5 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(permissoes).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-2">
                  <Checkbox 
                    id={key} 
                    checked={value} 
                    onCheckedChange={(checked) => onChange(key, checked)}
                  />
                  <div className="grid gap-1">
                    <Label 
                      htmlFor={key} 
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {key.replace(/_/g, ' ')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {getDescricaoPermissao(key)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Função para gerar descrição das permissões
const getDescricaoPermissao = (permissao) => {
  const descricoes = {
    visualizar: "Permite visualizar informações",
    editar: "Permite criar e modificar registros",
    excluir: "Permite remover registros",
    exportar: "Permite exportar dados",
    imprimir: "Permite gerar e imprimir relatórios",
    aprovar: "Permite aprovar solicitações ou documentos",
    rejeitar: "Permite rejeitar solicitações ou documentos",
    configurar: "Permite alterar configurações",
    emitir: "Permite emitir documentos fiscais",
    cancelar: "Permite cancelar documentos fiscais",
    gerenciar_usuarios: "Permite gerenciar usuários do sistema",
    gerenciar_permissoes: "Permite definir permissões para outros usuários",
    reportar: "Permite gerar relatórios avançados",
    integrar: "Permite configurar integrações com outros sistemas",
  };
  
  const [acao, modulo] = permissao.split('_');
  return descricoes[acao] || `Permite ${acao.replace(/_/g, ' ')} ${modulo?.replace(/_/g, ' ') || ''}`;
};

const PermissoesPanel = () => {
  const [perfisDisponiveis, setPerfisDisponiveis] = useState([
    {
      id: 1,
      nome: 'Administrador',
      descricao: 'Acesso completo ao sistema',
      permissoes: {
        modulo_fiscal: {
          visualizar_documentos: true,
          editar_documentos: true,
          excluir_documentos: true,
          emitir_nfe: true,
          emitir_nfse: true,
          cancelar_documentos: true,
          configurar_fiscal: true,
        },
        modulo_financeiro: {
          visualizar_financeiro: true,
          editar_financeiro: true,
          excluir_financeiro: true,
          aprovar_financeiro: true,
          exportar_financeiro: true,
        },
        modulo_documentos: {
          visualizar_documentos: true,
          editar_documentos: true,
          excluir_documentos: true,
          imprimir_documentos: true,
        },
        modulo_clientes: {
          visualizar_clientes: true,
          editar_clientes: true,
          excluir_clientes: true,
        },
        modulo_administracao: {
          gerenciar_usuarios: true,
          gerenciar_permissoes: true,
          configurar_sistema: true,
        },
      }
    },
    {
      id: 2,
      nome: 'Contador',
      descricao: 'Acesso a funções contábeis e fiscais',
      permissoes: {
        modulo_fiscal: {
          visualizar_documentos: true,
          editar_documentos: true,
          excluir_documentos: false,
          emitir_nfe: true,
          emitir_nfse: true,
          cancelar_documentos: true,
          configurar_fiscal: false,
        },
        modulo_financeiro: {
          visualizar_financeiro: true,
          editar_financeiro: true,
          excluir_financeiro: false,
          aprovar_financeiro: true,
          exportar_financeiro: true,
        },
        modulo_documentos: {
          visualizar_documentos: true,
          editar_documentos: true,
          excluir_documentos: false,
          imprimir_documentos: true,
        },
        modulo_clientes: {
          visualizar_clientes: true,
          editar_clientes: true,
          excluir_clientes: false,
        },
        modulo_administracao: {
          gerenciar_usuarios: false,
          gerenciar_permissoes: false,
          configurar_sistema: false,
        },
      }
    },
    {
      id: 3,
      nome: 'Empresa Usuária - Básico',
      descricao: 'Permissões para o plano básico de empresas usuárias',
      permissoes: {
        modulo_fiscal: {
          visualizar_documentos: true,
          editar_documentos: false,
          excluir_documentos: false,
          emitir_nfe: true,
          emitir_nfse: false,
          cancelar_documentos: false,
          configurar_fiscal: false,
        },
        modulo_financeiro: {
          visualizar_financeiro: true,
          editar_financeiro: false,
          excluir_financeiro: false,
          aprovar_financeiro: false,
          exportar_financeiro: true,
        },
        modulo_documentos: {
          visualizar_documentos: true,
          editar_documentos: false,
          excluir_documentos: false,
          imprimir_documentos: true,
        },
        modulo_clientes: {
          visualizar_clientes: true,
          editar_clientes: true,
          excluir_clientes: false,
        },
        modulo_administracao: {
          gerenciar_usuarios: false,
          gerenciar_permissoes: false,
          configurar_sistema: false,
        },
      }
    }
  ]);
  
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [editandoNome, setEditandoNome] = useState('');
  const [editandoDescricao, setEditandoDescricao] = useState('');
  const [activeTab, setActiveTab] = useState('perfis');
  
  // Manipuladores de eventos
  const handleSelectPerfil = (perfil) => {
    setPerfilSelecionado(perfil);
    setEditandoNome(perfil.nome);
    setEditandoDescricao(perfil.descricao);
  };
  
  const handleAddPerfil = () => {
    const newPerfil = {
      id: Math.max(0, ...perfisDisponiveis.map(p => p.id)) + 1,
      nome: 'Novo Perfil',
      descricao: 'Descrição do novo perfil',
      permissoes: {
        modulo_fiscal: {
          visualizar_documentos: false,
          editar_documentos: false,
          excluir_documentos: false,
          emitir_nfe: false,
          emitir_nfse: false,
          cancelar_documentos: false,
          configurar_fiscal: false,
        },
        modulo_financeiro: {
          visualizar_financeiro: false,
          editar_financeiro: false,
          excluir_financeiro: false,
          aprovar_financeiro: false,
          exportar_financeiro: false,
        },
        modulo_documentos: {
          visualizar_documentos: false,
          editar_documentos: false,
          excluir_documentos: false,
          imprimir_documentos: false,
        },
        modulo_clientes: {
          visualizar_clientes: false,
          editar_clientes: false,
          excluir_clientes: false,
        },
        modulo_administracao: {
          gerenciar_usuarios: false,
          gerenciar_permissoes: false,
          configurar_sistema: false,
        },
      }
    };
    
    setPerfisDisponiveis([...perfisDisponiveis, newPerfil]);
    handleSelectPerfil(newPerfil);
  };
  
  const handleDeletePerfil = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este perfil de permissões?')) {
      const novosPerfis = perfisDisponiveis.filter(p => p.id !== id);
      setPerfisDisponiveis(novosPerfis);
      
      if (perfilSelecionado && perfilSelecionado.id === id) {
        setPerfilSelecionado(null);
        setEditandoNome('');
        setEditandoDescricao('');
      }
    }
  };
  
  const handleSavePerfil = () => {
    if (!perfilSelecionado) return;
    
    const updatedPerfis = perfisDisponiveis.map(p => {
      if (p.id === perfilSelecionado.id) {
        return {
          ...p,
          nome: editandoNome,
          descricao: editandoDescricao
        };
      }
      return p;
    });
    
    setPerfisDisponiveis(updatedPerfis);
    
    // Atualiza o perfil selecionado para refletir as alterações
    setPerfilSelecionado({
      ...perfilSelecionado,
      nome: editandoNome,
      descricao: editandoDescricao
    });
  };
  
  const handlePermissaoChange = (modulo, permissao, checked) => {
    if (!perfilSelecionado) return;
    
    const updatedPerfil = {
      ...perfilSelecionado,
      permissoes: {
        ...perfilSelecionado.permissoes,
        [modulo]: {
          ...perfilSelecionado.permissoes[modulo],
          [permissao]: checked
        }
      }
    };
    
    const updatedPerfis = perfisDisponiveis.map(p => {
      if (p.id === perfilSelecionado.id) {
        return updatedPerfil;
      }
      return p;
    });
    
    setPerfisDisponiveis(updatedPerfis);
    setPerfilSelecionado(updatedPerfil);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1">
        <Tabs 
          defaultValue="perfis" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="perfis" className="flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Perfis
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="perfis" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Perfis Disponíveis</h3>
              <Button 
                size="sm" 
                onClick={handleAddPerfil}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Novo
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-300px)] pr-3">
              <div className="space-y-2">
                {perfisDisponiveis.map(perfil => (
                  <Card 
                    key={perfil.id} 
                    className={`cursor-pointer hover:border-primary/50 transition-colors ${
                      perfilSelecionado?.id === perfil.id ? 'border-primary' : 'border-border'
                    }`}
                    onClick={() => handleSelectPerfil(perfil)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{perfil.nome}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {perfil.descricao}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePerfil(perfil.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="usuarios" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Atribua perfis de permissão aos usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A funcionalidade de gerenciamento de usuários está em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="col-span-1 lg:col-span-2">
        {perfilSelecionado ? (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                  Editar Perfil de Permissões
                </CardTitle>
                <CardDescription>
                  Configure as permissões para este perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomePerfil">Nome do Perfil</Label>
                    <Input 
                      id="nomePerfil" 
                      value={editandoNome}
                      onChange={(e) => setEditandoNome(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descricaoPerfil">Descrição</Label>
                    <Input 
                      id="descricaoPerfil" 
                      value={editandoDescricao}
                      onChange={(e) => setEditandoDescricao(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePerfil}>
                    <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <ScrollArea className="h-[calc(100vh-420px)]">
              {perfilSelecionado && (
                <div className="space-y-4 pr-3">
                  <SecaoPermissao 
                    titulo="Módulo Fiscal" 
                    descricao="Permissões relacionadas à emissão de documentos fiscais e obrigações acessórias"
                    permissoes={perfilSelecionado.permissoes.modulo_fiscal}
                    onChange={(permissao, checked) => handlePermissaoChange('modulo_fiscal', permissao, checked)}
                    expandida={true}
                  />
                  
                  <SecaoPermissao 
                    titulo="Módulo Financeiro" 
                    descricao="Permissões relacionadas à gestão financeira, fluxo de caixa e bancário"
                    permissoes={perfilSelecionado.permissoes.modulo_financeiro}
                    onChange={(permissao, checked) => handlePermissaoChange('modulo_financeiro', permissao, checked)}
                  />
                  
                  <SecaoPermissao 
                    titulo="Módulo Documentos" 
                    descricao="Permissões relacionadas ao gerenciamento de documentos e arquivos"
                    permissoes={perfilSelecionado.permissoes.modulo_documentos}
                    onChange={(permissao, checked) => handlePermissaoChange('modulo_documentos', permissao, checked)}
                  />
                  
                  <SecaoPermissao 
                    titulo="Módulo Clientes" 
                    descricao="Permissões relacionadas ao cadastro e gerenciamento de clientes"
                    permissoes={perfilSelecionado.permissoes.modulo_clientes}
                    onChange={(permissao, checked) => handlePermissaoChange('modulo_clientes', permissao, checked)}
                  />
                  
                  <SecaoPermissao 
                    titulo="Módulo Administração" 
                    descricao="Permissões relacionadas à administração do sistema e configurações avançadas"
                    permissoes={perfilSelecionado.permissoes.modulo_administracao}
                    onChange={(permissao, checked) => handlePermissaoChange('modulo_administracao', permissao, checked)}
                  />
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="flex flex-col items-center p-8 text-center">
              <LockIcon className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum Perfil Selecionado</h3>
              <p className="text-muted-foreground max-w-sm">
                Selecione um perfil de permissões à esquerda para visualizar e editar suas configurações,
                ou crie um novo perfil clicando no botão "Novo".
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PermissoesPanel;