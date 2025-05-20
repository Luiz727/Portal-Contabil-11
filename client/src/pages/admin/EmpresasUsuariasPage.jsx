import React, { useState } from 'react';
import { 
  Building,
  Search, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Copy,
  CheckCircle,
  XCircle,
  Clock 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const EmpresasUsuariasPage = () => {
  // Estados para controle da interface
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('empresas');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Estado para o formulário de nova empresa
  const [novaEmpresa, setNovaEmpresa] = useState({
    id: '',
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    regime: 'simples_nacional',
    email: '',
    telefone: '',
    ativa: true,
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });
  
  // Dados simulados de empresas
  const [empresas, setEmpresas] = useState([
    {
      id: '1',
      razaoSocial: 'Comércio ABC Ltda',
      nomeFantasia: 'Comércio ABC',
      cnpj: '12.345.678/0001-90',
      inscricaoEstadual: '123456789',
      regime: 'simples_nacional',
      email: 'contato@comercioabc.com.br',
      telefone: '(11) 3456-7890',
      ativa: true,
      endereco: {
        logradouro: 'Av. Paulista',
        numero: '1000',
        complemento: 'Sala 110',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100'
      }
    },
    {
      id: '2',
      razaoSocial: 'Grupo Aurora Empreendimentos S.A.',
      nomeFantasia: 'Grupo Aurora',
      cnpj: '23.456.789/0001-12',
      inscricaoEstadual: '234567890',
      regime: 'lucro_presumido',
      email: 'contato@grupoaurora.com.br',
      telefone: '(11) 4567-8901',
      ativa: true,
      endereco: {
        logradouro: 'Rua dos Andradas',
        numero: '500',
        complemento: 'Andar 5',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01208-000'
      }
    },
    {
      id: '3',
      razaoSocial: 'Holding XYZ Participações Ltda',
      nomeFantasia: 'Holding XYZ',
      cnpj: '34.567.890/0001-23',
      inscricaoEstadual: '345678901',
      regime: 'lucro_real',
      email: 'contato@holdingxyz.com.br',
      telefone: '(11) 5678-9012',
      ativa: true,
      endereco: {
        logradouro: 'Av. Brigadeiro Faria Lima',
        numero: '3500',
        complemento: 'Conj. 2010',
        bairro: 'Itaim Bibi',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04538-132'
      }
    }
  ]);
  
  // Histórico de alterações simulado
  const historicoAlteracoes = [
    {
      id: '1',
      data: '20/05/2025 14:35',
      usuario: 'João Silva',
      empresa: 'Comércio ABC',
      acao: 'Edição de dados cadastrais',
      detalhes: 'Alteração de regime tributário: Simples Nacional → Lucro Presumido'
    },
    {
      id: '2',
      data: '15/05/2025 09:12',
      usuario: 'Ana Santos',
      empresa: 'Grupo Aurora',
      acao: 'Cadastro de empresa',
      detalhes: 'Nova empresa cadastrada no sistema'
    },
    {
      id: '3',
      data: '10/05/2025 16:43',
      usuario: 'Carlos Oliveira',
      empresa: 'Distribuidora ABC (Inativa)',
      acao: 'Inativação de empresa',
      detalhes: 'Empresa marcada como inativa no sistema'
    }
  ];

  // Filtrar empresas com base no termo de busca
  const empresasFiltradas = empresas.filter(empresa => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      empresa.razaoSocial.toLowerCase().includes(searchTermLower) ||
      empresa.nomeFantasia.toLowerCase().includes(searchTermLower) ||
      empresa.cnpj.toLowerCase().includes(searchTermLower)
    );
  });
  
  // Manipular mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos aninhados como endereco.logradouro
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNovaEmpresa(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNovaEmpresa(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Manipular seleção de regime tributário
  const handleRegimeChange = (value) => {
    setNovaEmpresa(prev => ({
      ...prev,
      regime: value
    }));
  };
  
  // Adicionar nova empresa
  const handleAddEmpresa = () => {
    const newId = (empresas.length + 1).toString();
    setEmpresas([
      ...empresas,
      {
        ...novaEmpresa,
        id: newId
      }
    ]);
    
    // Limpar formulário
    setNovaEmpresa({
      id: '',
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      regime: 'simples_nacional',
      email: '',
      telefone: '',
      ativa: true,
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    });
    
    setIsAddDialogOpen(false);
  };
  
  // Mapear regime tributário para exibição amigável
  const mapRegimeToLabel = (regime) => {
    const regimes = {
      'simples_nacional': 'Simples Nacional',
      'lucro_presumido': 'Lucro Presumido',
      'lucro_real': 'Lucro Real',
      'mei': 'MEI'
    };
    return regimes[regime] || regime;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#d9bb42]/10 flex items-center justify-center rounded-lg">
          <Building size={20} className="text-[#d9bb42]" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Empresas Usuárias</h1>
      </div>
      <p className="text-gray-500 mb-6">Gerencie as empresas clientes do escritório contábil.</p>
      
      <Tabs defaultValue="empresas" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="empresas" 
            className="py-3 data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white"
          >
            Empresas
          </TabsTrigger>
          <TabsTrigger 
            value="historico" 
            className="py-3 data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white"
          >
            Histórico de Alterações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresas" className="mt-0">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#d9bb42] hover:bg-[#c5aa3a] text-white flex items-center gap-2">
                    <Plus size={16} />
                    <span>Nova Empresa</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
                    <DialogDescription>
                      Preencha os dados da empresa cliente do escritório contábil.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <h3 className="font-medium text-gray-700">Dados Principais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="razaoSocial">Razão Social</Label>
                        <Input
                          id="razaoSocial"
                          name="razaoSocial"
                          value={novaEmpresa.razaoSocial}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                        <Input
                          id="nomeFantasia"
                          name="nomeFantasia"
                          value={novaEmpresa.nomeFantasia}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          name="cnpj"
                          value={novaEmpresa.cnpj}
                          onChange={handleInputChange}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                        <Input
                          id="inscricaoEstadual"
                          name="inscricaoEstadual"
                          value={novaEmpresa.inscricaoEstadual}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={novaEmpresa.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          value={novaEmpresa.telefone}
                          onChange={handleInputChange}
                          placeholder="(00) 0000-0000"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="regime">Regime Tributário</Label>
                      <Select 
                        onValueChange={handleRegimeChange} 
                        defaultValue={novaEmpresa.regime}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o regime tributário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                          <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                          <SelectItem value="lucro_real">Lucro Real</SelectItem>
                          <SelectItem value="mei">MEI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <h3 className="font-medium text-gray-700 mt-2">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="grid gap-2 md:col-span-4">
                        <Label htmlFor="endereco.logradouro">Logradouro</Label>
                        <Input
                          id="endereco.logradouro"
                          name="endereco.logradouro"
                          value={novaEmpresa.endereco.logradouro}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2 md:col-span-1">
                        <Label htmlFor="endereco.numero">Número</Label>
                        <Input
                          id="endereco.numero"
                          name="endereco.numero"
                          value={novaEmpresa.endereco.numero}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2 md:col-span-1">
                        <Label htmlFor="endereco.complemento">Complemento</Label>
                        <Input
                          id="endereco.complemento"
                          name="endereco.complemento"
                          value={novaEmpresa.endereco.complemento}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="endereco.bairro">Bairro</Label>
                        <Input
                          id="endereco.bairro"
                          name="endereco.bairro"
                          value={novaEmpresa.endereco.bairro}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="endereco.cidade">Cidade</Label>
                        <Input
                          id="endereco.cidade"
                          name="endereco.cidade"
                          value={novaEmpresa.endereco.cidade}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2 md:col-span-1">
                        <Label htmlFor="endereco.estado">Estado</Label>
                        <Input
                          id="endereco.estado"
                          name="endereco.estado"
                          value={novaEmpresa.endereco.estado}
                          onChange={handleInputChange}
                          maxLength={2}
                        />
                      </div>
                      
                      <div className="grid gap-2 md:col-span-1">
                        <Label htmlFor="endereco.cep">CEP</Label>
                        <Input
                          id="endereco.cep"
                          name="endereco.cep"
                          value={novaEmpresa.endereco.cep}
                          onChange={handleInputChange}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-[#d9bb42] hover:bg-[#c5aa3a]" 
                      onClick={handleAddEmpresa}
                    >
                      Salvar Empresa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome Fantasia</TableHead>
                  <TableHead className="w-[150px]">CNPJ</TableHead>
                  <TableHead>Razão Social</TableHead>
                  <TableHead className="w-[150px]">Regime Tributário</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresasFiltradas.length > 0 ? (
                  empresasFiltradas.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell className="font-medium">{empresa.nomeFantasia}</TableCell>
                      <TableCell>{empresa.cnpj}</TableCell>
                      <TableCell>{empresa.razaoSocial}</TableCell>
                      <TableCell>{mapRegimeToLabel(empresa.regime)}</TableCell>
                      <TableCell>
                        {empresa.ativa ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ativa
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            Inativa
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                            <Eye size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-700">
                            <Edit size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma empresa encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="mt-0">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Histórico de Alterações</h2>
              <p className="text-sm text-gray-500">Registro de todas as modificações feitas nas empresas usuárias.</p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Data e Hora</TableHead>
                  <TableHead className="w-[150px]">Usuário</TableHead>
                  <TableHead className="w-[200px]">Empresa</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoAlteracoes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{item.data}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.usuario}</TableCell>
                    <TableCell>{item.empresa}</TableCell>
                    <TableCell>{item.acao}</TableCell>
                    <TableCell>{item.detalhes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmpresasUsuariasPage;