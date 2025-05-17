import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Pencil,
  Copy,
  FileText,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Filter,
  MoreHorizontal,
  Download,
  Upload,
  Phone,
  Mail,
  Building2,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FiscalMenuWrapper from '@/components/fiscal/FiscalMenuWrapper';

type Cliente = {
  id: number;
  nome: string;
  nomeFantasia?: string;
  tipo: 'PF' | 'PJ';
  documento: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  ativo: boolean;
  grupo?: string;
  ultimaCompra?: string;
  totalCompras: number;
};

const ClientesCadastro: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: 'Silva Comércio de Eletrônicos Ltda',
      nomeFantasia: 'Silva Eletrônicos',
      tipo: 'PJ',
      documento: '12.345.678/0001-90',
      inscricaoEstadual: '123456789',
      email: 'contato@silvaeletronicos.com.br',
      telefone: '(11) 3456-7890',
      endereco: {
        cep: '01310-200',
        logradouro: 'Avenida Paulista',
        numero: '1500',
        complemento: 'Sala 250',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      grupo: 'Varejo',
      ultimaCompra: '15/05/2023',
      totalCompras: 58450.75
    },
    {
      id: 2,
      nome: 'João Almeida Silva',
      tipo: 'PF',
      documento: '123.456.789-10',
      email: 'joao.silva@email.com',
      telefone: '(11) 98765-4321',
      endereco: {
        cep: '04567-000',
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Jardim Europa',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      ultimaCompra: '10/05/2023',
      totalCompras: 1250.50
    },
    {
      id: 3,
      nome: 'Distribuidora Santos S.A.',
      nomeFantasia: 'Santos Distribuidora',
      tipo: 'PJ',
      documento: '98.765.432/0001-10',
      inscricaoEstadual: '987654321',
      inscricaoMunicipal: '12345',
      email: 'comercial@santosdist.com.br',
      telefone: '(21) 3333-4444',
      endereco: {
        cep: '20031-170',
        logradouro: 'Avenida Rio Branco',
        numero: '500',
        complemento: 'Andar 15',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ'
      },
      ativo: true,
      grupo: 'Atacado',
      ultimaCompra: '08/05/2023',
      totalCompras: 125680.90
    },
    {
      id: 4,
      nome: 'Maria Souza Confecções ME',
      nomeFantasia: 'Souza Confecções',
      tipo: 'PJ',
      documento: '45.678.901/0001-23',
      inscricaoEstadual: '456789012',
      email: 'maria@souzaconfeccoes.com.br',
      telefone: '(31) 2222-3333',
      endereco: {
        cep: '30130-110',
        logradouro: 'Rua dos Carijós',
        numero: '150',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        estado: 'MG'
      },
      ativo: false,
      grupo: 'Varejo',
      ultimaCompra: '02/03/2023',
      totalCompras: 28750.30
    },
    {
      id: 5,
      nome: 'Ana Paula Ferreira',
      tipo: 'PF',
      documento: '987.654.321-00',
      email: 'ana.ferreira@email.com',
      telefone: '(11) 97777-8888',
      endereco: {
        cep: '01426-000',
        logradouro: 'Alameda Santos',
        numero: '455',
        complemento: 'Apto 95',
        bairro: 'Cerqueira César',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      ultimaCompra: '12/05/2023',
      totalCompras: 5680.25
    }
  ]);

  const [modalCliente, setModalCliente] = useState<Cliente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDocumento, setFiltroDocumento] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('');

  const handleNovoClick = () => {
    setModalCliente({
      id: 0,
      nome: '',
      tipo: 'PJ',
      documento: '',
      email: '',
      telefone: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: ''
      },
      ativo: true,
      totalCompras: 0
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleEditClick = (cliente: Cliente) => {
    setModalCliente({ ...cliente });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDuplicarClick = (cliente: Cliente) => {
    setModalCliente({
      ...cliente,
      id: 0,
      nome: `${cliente.nome} (Cópia)`,
      documento: '',
      ultimaCompra: undefined,
      totalCompras: 0
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleExcluirClick = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const handleModalSave = () => {
    if (!modalCliente) return;

    if (modalMode === 'new') {
      // Adicionar novo cliente
      const newId = Math.max(...clientes.map(c => c.id), 0) + 1;
      setClientes([...clientes, { ...modalCliente, id: newId }]);
    } else {
      // Editar cliente existente
      setClientes(clientes.map(c => c.id === modalCliente.id ? modalCliente : c));
    }

    setIsModalOpen(false);
    setModalCliente(null);
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchNome = cliente.nome.toLowerCase().includes(filtroNome.toLowerCase()) || 
                     (cliente.nomeFantasia?.toLowerCase().includes(filtroNome.toLowerCase()) || false);
    const matchDocumento = cliente.documento.includes(filtroDocumento);
    const matchGrupo = filtroGrupo === '' || cliente.grupo === filtroGrupo;
    const matchAtivo = filtroAtivo === '' || 
                     (filtroAtivo === 'ativo' && cliente.ativo) || 
                     (filtroAtivo === 'inativo' && !cliente.ativo);

    return matchNome && matchDocumento && matchGrupo && matchAtivo;
  });

  const grupos = Array.from(new Set(clientes.filter(c => c.grupo).map(c => c.grupo)));

  return (
    <FiscalMenuWrapper activeSection="cadastros">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cadastro de Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie os clientes para emissão de documentos fiscais
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={handleNovoClick}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos">
          <div className="flex justify-between mb-4">
            <TabsList>
              <TabsTrigger value="todos">Todos os Clientes</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="inativos">Inativos</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Input 
                placeholder="Buscar por nome" 
                className="w-60"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
              />
              <Input 
                placeholder="CPF/CNPJ" 
                className="w-40"
                value={filtroDocumento}
                onChange={(e) => setFiltroDocumento(e.target.value)}
              />
              <Select value={filtroGrupo} onValueChange={setFiltroGrupo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os grupos</SelectItem>
                  {grupos.map(grupo => (
                    <SelectItem key={grupo} value={grupo}>{grupo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="todos" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome / Nome Fantasia</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Última Compra</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.length > 0 ? (
                    filteredClientes.map(cliente => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <div className="font-medium">{cliente.nome}</div>
                          {cliente.nomeFantasia && (
                            <div className="text-xs text-muted-foreground">{cliente.nomeFantasia}</div>
                          )}
                          {cliente.grupo && (
                            <Badge variant="outline" className="mt-1">{cliente.grupo}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{cliente.documento}</div>
                          <div className="text-xs text-muted-foreground">{cliente.tipo === 'PJ' ? 'CNPJ' : 'CPF'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />{cliente.email}
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <Phone className="h-3 w-3 mr-1" />{cliente.telefone}
                          </div>
                        </TableCell>
                        <TableCell>
                          {cliente.endereco.cidade}/{cliente.endereco.estado}
                        </TableCell>
                        <TableCell>
                          {cliente.ultimaCompra || 'Nunca'}
                        </TableCell>
                        <TableCell>
                          {cliente.totalCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                          {cliente.ativo ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditClick(cliente)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicarClick(cliente)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Emitir Nota
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleExcluirClick(cliente.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="ativos" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome / Nome Fantasia</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Última Compra</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.filter(c => c.ativo).map(cliente => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div className="font-medium">{cliente.nome}</div>
                        {cliente.nomeFantasia && (
                          <div className="text-xs text-muted-foreground">{cliente.nomeFantasia}</div>
                        )}
                        {cliente.grupo && (
                          <Badge variant="outline" className="mt-1">{cliente.grupo}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{cliente.documento}</div>
                        <div className="text-xs text-muted-foreground">{cliente.tipo === 'PJ' ? 'CNPJ' : 'CPF'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />{cliente.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1" />{cliente.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {cliente.endereco.cidade}/{cliente.endereco.estado}
                      </TableCell>
                      <TableCell>
                        {cliente.ultimaCompra || 'Nunca'}
                      </TableCell>
                      <TableCell>
                        {cliente.totalCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditClick(cliente)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(cliente)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Emitir Nota
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(cliente.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="inativos" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome / Nome Fantasia</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Última Compra</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.filter(c => !c.ativo).map(cliente => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div className="font-medium">{cliente.nome}</div>
                        {cliente.nomeFantasia && (
                          <div className="text-xs text-muted-foreground">{cliente.nomeFantasia}</div>
                        )}
                        {cliente.grupo && (
                          <Badge variant="outline" className="mt-1">{cliente.grupo}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{cliente.documento}</div>
                        <div className="text-xs text-muted-foreground">{cliente.tipo === 'PJ' ? 'CNPJ' : 'CPF'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />{cliente.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1" />{cliente.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {cliente.endereco.cidade}/{cliente.endereco.estado}
                      </TableCell>
                      <TableCell>
                        {cliente.ultimaCompra || 'Nunca'}
                      </TableCell>
                      <TableCell>
                        {cliente.totalCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditClick(cliente)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(cliente)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(cliente.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Estatísticas básicas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.length}</div>
              <p className="text-xs text-muted-foreground">
                {clientes.filter(c => c.ativo).length} ativos / {clientes.filter(c => !c.ativo).length} inativos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pessoas Jurídicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.filter(c => c.tipo === 'PJ').length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((clientes.filter(c => c.tipo === 'PJ').length / clientes.length) * 100)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pessoas Físicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.filter(c => c.tipo === 'PF').length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((clientes.filter(c => c.tipo === 'PF').length / clientes.length) * 100)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clientes.reduce((acc, c) => acc + c.totalCompras, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-xs text-muted-foreground">
                Média de {(clientes.reduce((acc, c) => acc + c.totalCompras, 0) / clientes.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por cliente
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para adicionar/editar cliente */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalMode === 'new' ? 'Novo Cliente' : 'Editar Cliente'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {modalMode === 'new' ? 'adicionar um novo' : 'editar o'} cliente.
            </DialogDescription>
          </DialogHeader>

          {modalCliente && (
            <Tabs defaultValue="geral">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="fiscal">Dados Fiscais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="geral" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoPessoa">Tipo de Pessoa</Label>
                    <Select 
                      value={modalCliente.tipo}
                      onValueChange={(value: 'PF' | 'PJ') => setModalCliente({...modalCliente, tipo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PF">Pessoa Física</SelectItem>
                        <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documento">{modalCliente.tipo === 'PJ' ? 'CNPJ' : 'CPF'}</Label>
                    <Input 
                      id="documento" 
                      value={modalCliente.documento} 
                      onChange={(e) => setModalCliente({...modalCliente, documento: e.target.value})}
                      placeholder={modalCliente.tipo === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nome">{modalCliente.tipo === 'PJ' ? 'Razão Social' : 'Nome Completo'}</Label>
                  <Input 
                    id="nome" 
                    value={modalCliente.nome} 
                    onChange={(e) => setModalCliente({...modalCliente, nome: e.target.value})}
                  />
                </div>
                
                {modalCliente.tipo === 'PJ' && (
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input 
                      id="nomeFantasia" 
                      value={modalCliente.nomeFantasia || ''} 
                      onChange={(e) => setModalCliente({...modalCliente, nomeFantasia: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={modalCliente.email} 
                      onChange={(e) => setModalCliente({...modalCliente, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      value={modalCliente.telefone} 
                      onChange={(e) => setModalCliente({...modalCliente, telefone: e.target.value})}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grupo">Grupo</Label>
                    <Select 
                      value={modalCliente.grupo || ''}
                      onValueChange={(value) => setModalCliente({...modalCliente, grupo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {grupos.map(grupo => (
                          <SelectItem key={grupo} value={grupo}>{grupo}</SelectItem>
                        ))}
                        <SelectItem value="novo">+ Novo Grupo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox 
                      id="ativo" 
                      checked={modalCliente.ativo}
                      onCheckedChange={(checked) => 
                        setModalCliente({...modalCliente, ativo: checked === true})
                      }
                    />
                    <label
                      htmlFor="ativo"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Cliente Ativo
                    </label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="endereco" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input 
                      id="cep" 
                      value={modalCliente.endereco.cep} 
                      onChange={(e) => setModalCliente({
                        ...modalCliente, 
                        endereco: {...modalCliente.endereco, cep: e.target.value}
                      })}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <Button type="button" variant="outline" className="mb-0.5">
                      Buscar CEP
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input 
                    id="logradouro" 
                    value={modalCliente.endereco.logradouro} 
                    onChange={(e) => setModalCliente({
                      ...modalCliente, 
                      endereco: {...modalCliente.endereco, logradouro: e.target.value}
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input 
                      id="numero" 
                      value={modalCliente.endereco.numero} 
                      onChange={(e) => setModalCliente({
                        ...modalCliente, 
                        endereco: {...modalCliente.endereco, numero: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input 
                      id="complemento" 
                      value={modalCliente.endereco.complemento || ''} 
                      onChange={(e) => setModalCliente({
                        ...modalCliente, 
                        endereco: {...modalCliente.endereco, complemento: e.target.value}
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro" 
                    value={modalCliente.endereco.bairro} 
                    onChange={(e) => setModalCliente({
                      ...modalCliente, 
                      endereco: {...modalCliente.endereco, bairro: e.target.value}
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input 
                      id="cidade" 
                      value={modalCliente.endereco.cidade} 
                      onChange={(e) => setModalCliente({
                        ...modalCliente, 
                        endereco: {...modalCliente.endereco, cidade: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={modalCliente.endereco.estado}
                      onValueChange={(value) => setModalCliente({
                        ...modalCliente, 
                        endereco: {...modalCliente.endereco, estado: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="fiscal" className="space-y-4 pt-4">
                {modalCliente.tipo === 'PJ' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                        <Input 
                          id="inscricaoEstadual" 
                          value={modalCliente.inscricaoEstadual || ''} 
                          onChange={(e) => setModalCliente({...modalCliente, inscricaoEstadual: e.target.value})}
                          placeholder="Deixe em branco para ISENTO"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                        <Input 
                          id="inscricaoMunicipal" 
                          value={modalCliente.inscricaoMunicipal || ''} 
                          onChange={(e) => setModalCliente({...modalCliente, inscricaoMunicipal: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-blue-50 p-4 mt-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Informação Fiscal</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>Preencha corretamente os dados fiscais do cliente para garantir a correta emissão de documentos fiscais.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {modalCliente.tipo === 'PF' && (
                  <div className="rounded-md bg-amber-50 p-4 mt-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Atenção</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>Para pessoas físicas, não é necessário preencher informações de inscrição estadual ou municipal.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleModalSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FiscalMenuWrapper>
  );
};

export default ClientesCadastro;