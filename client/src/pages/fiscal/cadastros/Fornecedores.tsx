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
  Factory,
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
  User,
  TruckIcon
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

type Fornecedor = {
  id: number;
  nome: string;
  nomeFantasia?: string;
  documento: string;
  inscricaoEstadual?: string;
  email: string;
  telefone: string;
  contato?: string;
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
  categoria?: string;
  ultimaCompra?: string;
  totalCompras: number;
};

const FornecedoresCadastro: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    {
      id: 1,
      nome: 'Distribuidora de Produtos Eletrônicos Ltda',
      nomeFantasia: 'TechDistr',
      documento: '23.456.789/0001-12',
      inscricaoEstadual: '234567890',
      email: 'contato@techdistribuidora.com.br',
      telefone: '(11) 4567-8901',
      contato: 'Marcelo Santos',
      endereco: {
        cep: '04571-010',
        logradouro: 'Av. Engenheiro Luís Carlos Berrini',
        numero: '1500',
        complemento: 'Andar 15',
        bairro: 'Cidade Monções',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      categoria: 'Eletrônicos',
      ultimaCompra: '10/05/2023',
      totalCompras: 187350.45
    },
    {
      id: 2,
      nome: 'Indústria Metalúrgica Nacional S.A.',
      nomeFantasia: 'MetalNac',
      documento: '34.567.890/0001-23',
      inscricaoEstadual: '345678901',
      email: 'vendas@metalnac.com.br',
      telefone: '(31) 3456-7890',
      contato: 'Amanda Oliveira',
      endereco: {
        cep: '32210-180',
        logradouro: 'Av. das Indústrias',
        numero: '850',
        bairro: 'Distrito Industrial',
        cidade: 'Contagem',
        estado: 'MG'
      },
      ativo: true,
      categoria: 'Metalurgia',
      ultimaCompra: '05/05/2023',
      totalCompras: 245780.90
    },
    {
      id: 3,
      nome: 'Importadora de Componentes Eletrônicos Ltda',
      nomeFantasia: 'ImportComp',
      documento: '45.678.901/0001-34',
      inscricaoEstadual: '456789012',
      email: 'compras@importcomp.com.br',
      telefone: '(11) 9876-5432',
      contato: 'Rafael Lima',
      endereco: {
        cep: '01310-100',
        logradouro: 'Rua Augusta',
        numero: '1200',
        complemento: 'Conj. 45',
        bairro: 'Consolação',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: false,
      categoria: 'Componentes',
      ultimaCompra: '15/01/2023',
      totalCompras: 98750.25
    },
    {
      id: 4,
      nome: 'Distribuidora de Material de Escritório ME',
      nomeFantasia: 'Office Supplies',
      documento: '56.789.012/0001-45',
      inscricaoEstadual: '567890123',
      email: 'vendas@officesupplies.com.br',
      telefone: '(21) 2345-6789',
      contato: 'Patricia Silva',
      endereco: {
        cep: '20040-002',
        logradouro: 'Rua do Passeio',
        numero: '70',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ'
      },
      ativo: true,
      categoria: 'Papelaria',
      ultimaCompra: '12/05/2023',
      totalCompras: 45600.80
    },
    {
      id: 5,
      nome: 'Fábrica de Móveis Corporativos S.A.',
      nomeFantasia: 'MoveisCorpArt',
      documento: '67.890.123/0001-56',
      inscricaoEstadual: '678901234',
      email: 'comercial@moveiscorpart.com.br',
      telefone: '(41) 3422-1234',
      contato: 'Fernando Costa',
      endereco: {
        cep: '82510-100',
        logradouro: 'Rodovia do Contorno Norte',
        numero: '5000',
        bairro: 'Boqueirão',
        cidade: 'Curitiba',
        estado: 'PR'
      },
      ativo: true,
      categoria: 'Mobiliário',
      ultimaCompra: '08/05/2023',
      totalCompras: 187350.00
    }
  ]);

  const [modalFornecedor, setModalFornecedor] = useState<Fornecedor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDocumento, setFiltroDocumento] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('');

  const handleNovoClick = () => {
    setModalFornecedor({
      id: 0,
      nome: '',
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

  const handleEditClick = (fornecedor: Fornecedor) => {
    setModalFornecedor({ ...fornecedor });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDuplicarClick = (fornecedor: Fornecedor) => {
    setModalFornecedor({
      ...fornecedor,
      id: 0,
      nome: `${fornecedor.nome} (Cópia)`,
      documento: '',
      ultimaCompra: undefined,
      totalCompras: 0
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleExcluirClick = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    }
  };

  const handleModalSave = () => {
    if (!modalFornecedor) return;

    if (modalMode === 'new') {
      // Adicionar novo fornecedor
      const newId = Math.max(...fornecedores.map(f => f.id), 0) + 1;
      setFornecedores([...fornecedores, { ...modalFornecedor, id: newId }]);
    } else {
      // Editar fornecedor existente
      setFornecedores(fornecedores.map(f => f.id === modalFornecedor.id ? modalFornecedor : f));
    }

    setIsModalOpen(false);
    setModalFornecedor(null);
  };

  const filteredFornecedores = fornecedores.filter(fornecedor => {
    const matchNome = fornecedor.nome.toLowerCase().includes(filtroNome.toLowerCase()) || 
                     (fornecedor.nomeFantasia?.toLowerCase().includes(filtroNome.toLowerCase()) || false);
    const matchDocumento = fornecedor.documento.includes(filtroDocumento);
    const matchCategoria = filtroCategoria === '' || fornecedor.categoria === filtroCategoria;
    const matchAtivo = filtroAtivo === '' || 
                     (filtroAtivo === 'ativo' && fornecedor.ativo) || 
                     (filtroAtivo === 'inativo' && !fornecedor.ativo);

    return matchNome && matchDocumento && matchCategoria && matchAtivo;
  });

  const categorias = Array.from(new Set(fornecedores.filter(f => f.categoria).map(f => f.categoria as string)));

  return (
    <FiscalMenuWrapper activeSection="cadastros">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cadastro de Fornecedores</h1>
            <p className="text-muted-foreground">
              Gerencie os fornecedores para emissão de documentos fiscais e compras
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
              Novo Fornecedor
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos">
          <div className="flex justify-between mb-4">
            <TabsList>
              <TabsTrigger value="todos">Todos os Fornecedores</TabsTrigger>
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
                placeholder="CNPJ" 
                className="w-40"
                value={filtroDocumento}
                onChange={(e) => setFiltroDocumento(e.target.value)}
              />
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
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
                  {filteredFornecedores.length > 0 ? (
                    filteredFornecedores.map(fornecedor => (
                      <TableRow key={fornecedor.id}>
                        <TableCell>
                          <div className="font-medium">{fornecedor.nome}</div>
                          {fornecedor.nomeFantasia && (
                            <div className="text-xs text-muted-foreground">{fornecedor.nomeFantasia}</div>
                          )}
                          {fornecedor.categoria && (
                            <Badge variant="outline" className="mt-1">{fornecedor.categoria}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{fornecedor.documento}</div>
                          <div className="text-xs text-muted-foreground">CNPJ</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />{fornecedor.email}
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <Phone className="h-3 w-3 mr-1" />{fornecedor.telefone}
                          </div>
                          {fornecedor.contato && (
                            <div className="flex items-center text-xs mt-1 text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />{fornecedor.contato}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {fornecedor.endereco.cidade}/{fornecedor.endereco.estado}
                        </TableCell>
                        <TableCell>
                          {fornecedor.ultimaCompra || 'Nunca'}
                        </TableCell>
                        <TableCell>
                          {fornecedor.totalCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                          {fornecedor.ativo ? (
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
                              <DropdownMenuItem onClick={() => handleEditClick(fornecedor)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicarClick(fornecedor)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Registrar Compra
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleExcluirClick(fornecedor.id)} className="text-red-600">
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
                        Nenhum fornecedor encontrado.
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
                  {fornecedores.filter(f => f.ativo).map(fornecedor => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <div className="font-medium">{fornecedor.nome}</div>
                        {fornecedor.nomeFantasia && (
                          <div className="text-xs text-muted-foreground">{fornecedor.nomeFantasia}</div>
                        )}
                        {fornecedor.categoria && (
                          <Badge variant="outline" className="mt-1">{fornecedor.categoria}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{fornecedor.documento}</div>
                        <div className="text-xs text-muted-foreground">CNPJ</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />{fornecedor.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1" />{fornecedor.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {fornecedor.endereco.cidade}/{fornecedor.endereco.estado}
                      </TableCell>
                      <TableCell>
                        {fornecedor.ultimaCompra || 'Nunca'}
                      </TableCell>
                      <TableCell>
                        {fornecedor.totalCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                            <DropdownMenuItem onClick={() => handleEditClick(fornecedor)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(fornecedor)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(fornecedor.id)} className="text-red-600">
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
                  {fornecedores.filter(f => !f.ativo).map(fornecedor => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>
                        <div className="font-medium">{fornecedor.nome}</div>
                        {fornecedor.nomeFantasia && (
                          <div className="text-xs text-muted-foreground">{fornecedor.nomeFantasia}</div>
                        )}
                        {fornecedor.categoria && (
                          <Badge variant="outline" className="mt-1">{fornecedor.categoria}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{fornecedor.documento}</div>
                        <div className="text-xs text-muted-foreground">CNPJ</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />{fornecedor.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1" />{fornecedor.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {fornecedor.endereco.cidade}/{fornecedor.endereco.estado}
                      </TableCell>
                      <TableCell>
                        {fornecedor.ultimaCompra || 'Nunca'}
                      </TableCell>
                      <TableCell>
                        {fornecedor.totalCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                            <DropdownMenuItem onClick={() => handleEditClick(fornecedor)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(fornecedor)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(fornecedor.id)} className="text-red-600">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Fornecedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fornecedores.length}</div>
              <p className="text-xs text-muted-foreground">
                {fornecedores.filter(f => f.ativo).length} ativos / {fornecedores.filter(f => !f.ativo).length} inativos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Compras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fornecedores.reduce((acc, c) => acc + c.totalCompras, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-xs text-muted-foreground">
                Média por fornecedor: {(fornecedores.reduce((acc, c) => acc + c.totalCompras, 0) / fornecedores.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categorias.length}</div>
              <p className="text-xs text-muted-foreground">
                Mais populares: {categorias.length > 0 ? categorias[0] : 'Nenhuma'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Última Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fornecedores.length > 0 ? 
                  fornecedores
                    .filter(f => f.ultimaCompra)
                    .sort((a, b) => new Date(b.ultimaCompra || '').getTime() - new Date(a.ultimaCompra || '').getTime())[0]?.ultimaCompra || 'Nenhuma' 
                  : 'Nenhuma'}
              </div>
              <p className="text-xs text-muted-foreground">
                Data da compra mais recente
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para adicionar/editar fornecedor */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalMode === 'new' ? 'Novo Fornecedor' : 'Editar Fornecedor'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {modalMode === 'new' ? 'adicionar um novo' : 'editar o'} fornecedor.
            </DialogDescription>
          </DialogHeader>

          {modalFornecedor && (
            <Tabs defaultValue="geral">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="fiscal">Dados Fiscais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="geral" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">CNPJ</Label>
                  <Input 
                    id="documento" 
                    value={modalFornecedor.documento} 
                    onChange={(e) => setModalFornecedor({...modalFornecedor, documento: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nome">Razão Social</Label>
                  <Input 
                    id="nome" 
                    value={modalFornecedor.nome} 
                    onChange={(e) => setModalFornecedor({...modalFornecedor, nome: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input 
                    id="nomeFantasia" 
                    value={modalFornecedor.nomeFantasia || ''} 
                    onChange={(e) => setModalFornecedor({...modalFornecedor, nomeFantasia: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={modalFornecedor.email} 
                      onChange={(e) => setModalFornecedor({...modalFornecedor, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      value={modalFornecedor.telefone} 
                      onChange={(e) => setModalFornecedor({...modalFornecedor, telefone: e.target.value})}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contato">Nome do Contato</Label>
                    <Input 
                      id="contato" 
                      value={modalFornecedor.contato || ''} 
                      onChange={(e) => setModalFornecedor({...modalFornecedor, contato: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select 
                      value={modalFornecedor.categoria || ''}
                      onValueChange={(value) => setModalFornecedor({...modalFornecedor, categoria: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {categorias.map(categoria => (
                          <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                        ))}
                        <SelectItem value="nova">+ Nova Categoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="ativo" 
                    checked={modalFornecedor.ativo}
                    onCheckedChange={(checked) => 
                      setModalFornecedor({...modalFornecedor, ativo: checked === true})
                    }
                  />
                  <label
                    htmlFor="ativo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Fornecedor Ativo
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="endereco" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input 
                      id="cep" 
                      value={modalFornecedor.endereco.cep} 
                      onChange={(e) => setModalFornecedor({
                        ...modalFornecedor, 
                        endereco: {...modalFornecedor.endereco, cep: e.target.value}
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
                    value={modalFornecedor.endereco.logradouro} 
                    onChange={(e) => setModalFornecedor({
                      ...modalFornecedor, 
                      endereco: {...modalFornecedor.endereco, logradouro: e.target.value}
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input 
                      id="numero" 
                      value={modalFornecedor.endereco.numero} 
                      onChange={(e) => setModalFornecedor({
                        ...modalFornecedor, 
                        endereco: {...modalFornecedor.endereco, numero: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input 
                      id="complemento" 
                      value={modalFornecedor.endereco.complemento || ''} 
                      onChange={(e) => setModalFornecedor({
                        ...modalFornecedor, 
                        endereco: {...modalFornecedor.endereco, complemento: e.target.value}
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro" 
                    value={modalFornecedor.endereco.bairro} 
                    onChange={(e) => setModalFornecedor({
                      ...modalFornecedor, 
                      endereco: {...modalFornecedor.endereco, bairro: e.target.value}
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input 
                      id="cidade" 
                      value={modalFornecedor.endereco.cidade} 
                      onChange={(e) => setModalFornecedor({
                        ...modalFornecedor, 
                        endereco: {...modalFornecedor.endereco, cidade: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={modalFornecedor.endereco.estado}
                      onValueChange={(value) => setModalFornecedor({
                        ...modalFornecedor, 
                        endereco: {...modalFornecedor.endereco, estado: value}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                    <Input 
                      id="inscricaoEstadual" 
                      value={modalFornecedor.inscricaoEstadual || ''} 
                      onChange={(e) => setModalFornecedor({...modalFornecedor, inscricaoEstadual: e.target.value})}
                      placeholder="Deixe em branco para ISENTO"
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
                        <p>Preencha corretamente os dados fiscais do fornecedor para garantir a correta emissão de documentos fiscais.</p>
                      </div>
                    </div>
                  </div>
                </div>
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

export default FornecedoresCadastro;