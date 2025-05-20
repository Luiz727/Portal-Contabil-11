import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PlanoAssinaturaCard from '@/components/admin/PlanoAssinaturaCard';
import { 
  Dialog, 
  DialogContent,
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const GerenciamentoPlanosPage = () => {
  // Estados para o modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlano, setEditingPlano] = useState(null);
  const [novoRecurso, setNovoRecurso] = useState('');
  const [novoModulo, setNovoModulo] = useState('');
  
  // Estado do formulário
  const [formState, setFormState] = useState({
    nome: '',
    preco: '',
    descricao: '',
    recursos: [],
    modulosDisponiveis: [],
    tagModulos: ''
  });
  
  // Dados de exemplo para os planos
  const [planos, setPlanos] = useState([
    {
      id: 1,
      nome: 'Plano Básico MEI',
      preco: 49.90,
      descricao: 'Ideal para Microempreendedores Individuais.',
      recursos: [
        'Emissão de NF-e (10/mês)',
        'Cadastro de Produtos (50)',
        'Suporte Básico'
      ],
      modulosDisponiveis: ['Issuer', 'Registrations'],
      tagModulos: ''
    },
    {
      id: 2,
      nome: 'Plano Profissional PME',
      preco: 129.90,
      descricao: 'Para Pequenas e Médias Empresas em crescimento.',
      recursos: [
        'NF-e/NFS-e Ilimitadas',
        'Financeiro Completo',
        'Portal do Cliente',
        '+ 1 outros'
      ],
      modulosDisponiveis: ['Issuer', 'Financial', 'Registrations', 'Tools'],
      tagModulos: ''
    },
    {
      id: 3,
      nome: 'Plano Corporativo Avançado',
      preco: 299.90,
      descricao: 'Soluções robustas para grandes empresas.',
      recursos: [
        'Todos os Módulos',
        'API para Integração',
        'Gerente de Contas Dedicado',
        '+ 1 outros'
      ],
      tagModulos: 'Todos os Módulos'
    }
  ]);

  // Manipuladores de evento
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === 'preco' ? parseFloat(value) || '' : value
    });
  };

  const handleAddRecurso = () => {
    if (novoRecurso.trim()) {
      setFormState({
        ...formState,
        recursos: [...formState.recursos, novoRecurso.trim()]
      });
      setNovoRecurso('');
    }
  };

  const handleRemoveRecurso = (index) => {
    setFormState({
      ...formState,
      recursos: formState.recursos.filter((_, i) => i !== index)
    });
  };

  const handleAddModulo = () => {
    if (novoModulo.trim()) {
      setFormState({
        ...formState,
        modulosDisponiveis: [...formState.modulosDisponiveis, novoModulo.trim()]
      });
      setNovoModulo('');
    }
  };

  const handleRemoveModulo = (index) => {
    setFormState({
      ...formState,
      modulosDisponiveis: formState.modulosDisponiveis.filter((_, i) => i !== index)
    });
  };

  const handleEditPlano = (id) => {
    const plano = planos.find(p => p.id === id);
    if (plano) {
      setFormState({
        ...plano
      });
      setEditingPlano(id);
      setDialogOpen(true);
    }
  };

  const handleDeletePlano = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
      setPlanos(planos.filter(p => p.id !== id));
    }
  };

  const handleSavePlano = () => {
    if (editingPlano) {
      // Atualizar plano existente
      setPlanos(planos.map(p => p.id === editingPlano ? { ...formState, id: editingPlano } : p));
    } else {
      // Adicionar novo plano
      const newId = Math.max(0, ...planos.map(p => p.id)) + 1;
      setPlanos([...planos, { ...formState, id: newId }]);
    }
    
    // Resetar estado e fechar modal
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlano(null);
    setFormState({
      nome: '',
      preco: '',
      descricao: '',
      recursos: [],
      modulosDisponiveis: [],
      tagModulos: ''
    });
  };

  const handleAddPlano = () => {
    setEditingPlano(null);
    setFormState({
      nome: '',
      preco: '',
      descricao: '',
      recursos: [],
      modulosDisponiveis: [],
      tagModulos: ''
    });
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-foreground">
            Gerenciamento de Planos e Assinaturas
          </h1>
          <p className="text-muted-foreground mt-1">
            Crie, edite e gerencie os planos de assinatura disponíveis para suas empresas usuárias.
          </p>
        </div>
        <Button 
          onClick={handleAddPlano} 
          className="mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.map(plano => (
          <PlanoAssinaturaCard 
            key={plano.id} 
            plano={plano} 
            onEdit={handleEditPlano}
            onDelete={handleDeletePlano}
          />
        ))}
      </div>
      
      {/* Modal para criar/editar plano */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPlano ? 'Editar Plano' : 'Adicionar Novo Plano'}
            </DialogTitle>
            <DialogDescription>
              {editingPlano 
                ? 'Atualize as informações do plano existente.' 
                : 'Preencha os campos para criar um novo plano de assinatura.'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 px-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="nome">Nome do Plano</Label>
                  <Input 
                    id="nome" 
                    name="nome" 
                    value={formState.nome} 
                    onChange={handleInputChange} 
                    placeholder="Ex: Plano Básico"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input 
                    id="preco" 
                    name="preco" 
                    type="number" 
                    step="0.01" 
                    value={formState.preco} 
                    onChange={handleInputChange} 
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea 
                  id="descricao" 
                  name="descricao" 
                  value={formState.descricao} 
                  onChange={handleInputChange} 
                  placeholder="Descreva este plano de assinatura"
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Recursos</Label>
                <div className="mt-2 space-y-2">
                  {formState.recursos.map((recurso, index) => (
                    <div key={index} className="flex items-center">
                      <span className="flex-grow">{recurso}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveRecurso(index)}
                        className="text-destructive"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex space-x-2">
                    <Input 
                      value={novoRecurso} 
                      onChange={e => setNovoRecurso(e.target.value)} 
                      placeholder="Adicionar novo recurso" 
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleAddRecurso}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="flex items-center justify-between">
                  <span>Módulos Disponíveis</span>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="useTagModulos" 
                      className="mr-2"
                      checked={!!formState.tagModulos}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormState({
                            ...formState,
                            tagModulos: 'Todos os Módulos',
                            modulosDisponiveis: []
                          });
                        } else {
                          setFormState({
                            ...formState,
                            tagModulos: ''
                          });
                        }
                      }}
                    />
                    <label htmlFor="useTagModulos" className="text-xs font-normal">
                      Usar tag "Todos os Módulos"
                    </label>
                  </div>
                </Label>
                
                {!formState.tagModulos && (
                  <div className="mt-2 space-y-2">
                    {formState.modulosDisponiveis.map((modulo, index) => (
                      <div key={index} className="flex items-center">
                        <span className="flex-grow">{modulo}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveModulo(index)}
                          className="text-destructive"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <Input 
                        value={novoModulo} 
                        onChange={e => setNovoModulo(e.target.value)} 
                        placeholder="Adicionar novo módulo" 
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleAddModulo}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                )}
                
                {formState.tagModulos && (
                  <Input 
                    className="mt-2"
                    value={formState.tagModulos} 
                    onChange={(e) => setFormState({...formState, tagModulos: e.target.value})} 
                    placeholder="Nome da tag (ex: Todos os Módulos)" 
                  />
                )}
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlano}>
              {editingPlano ? 'Salvar Alterações' : 'Criar Plano'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciamentoPlanosPage;