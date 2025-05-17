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
  TruckIcon,
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
  Car
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

type Transportadora = {
  id: number;
  nome: string;
  nomeFantasia?: string;
  documento: string;
  inscricaoEstadual?: string;
  antt?: string;
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
  tipo?: 'rodoviario' | 'aereo' | 'maritimo' | 'ferroviario';
  totalFrete: number;
};

const TransportadorasCadastro: React.FC = () => {
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([
    {
      id: 1,
      nome: 'Expressa Transportes Ltda',
      nomeFantasia: 'Expressa Transportes',
      documento: '78.901.234/0001-67',
      inscricaoEstadual: '789012345',
      antt: '12345678',
      email: 'contato@expressatransportes.com.br',
      telefone: '(11) 5678-9012',
      contato: 'Carlos Silva',
      endereco: {
        cep: '05425-070',
        logradouro: 'Rua Pinheiros',
        numero: '350',
        complemento: 'Galpão 5',
        bairro: 'Pinheiros',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      tipo: 'rodoviario',
      totalFrete: 125000.00
    },
    {
      id: 2,
      nome: 'Logística Rápida S.A.',
      nomeFantasia: 'LogRápida',
      documento: '89.012.345/0001-78',
      inscricaoEstadual: '890123456',
      antt: '87654321',
      email: 'operacoes@lograpida.com.br',
      telefone: '(21) 4567-8901',
      contato: 'Ana Paula Mendes',
      endereco: {
        cep: '20050-090',
        logradouro: 'Av. Rio Branco',
        numero: '1200',
        complemento: 'Andar 10',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ'
      },
      ativo: true,
      tipo: 'rodoviario',
      totalFrete: 245680.35
    },
    {
      id: 3,
      nome: 'Aero Cargas Transportes Aéreos Ltda',
      nomeFantasia: 'Aero Cargas',
      documento: '90.123.456/0001-89',
      inscricaoEstadual: '901234567',
      email: 'cargas@aerocargas.com.br',
      telefone: '(11) 3456-7890',
      contato: 'Marcos Oliveira',
      endereco: {
        cep: '04626-911',
        logradouro: 'Av. Washington Luís',
        numero: 'S/N',
        complemento: 'Terminal de Cargas',
        bairro: 'Campo Belo',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      tipo: 'aereo',
      totalFrete: 375450.00
    },
    {
      id: 4,
      nome: 'Marítima Transportes Internacionais S.A.',
      nomeFantasia: 'Marítima Transportes',
      documento: '01.234.567/0001-90',
      inscricaoEstadual: '012345678',
      email: 'comercial@maritimatransportes.com.br',
      telefone: '(13) 2345-6789',
      contato: 'Ricardo Santos',
      endereco: {
        cep: '11025-000',
        logradouro: 'Av. Portuária',
        numero: '500',
        bairro: 'Porto',
        cidade: 'Santos',
        estado: 'SP'
      },
      ativo: false,
      tipo: 'maritimo',
      totalFrete: 980670.45
    },
    {
      id: 5,
      nome: 'Expresso do Norte Transportes ME',
      nomeFantasia: 'Expresso do Norte',
      documento: '12.345.678/0001-01',
      inscricaoEstadual: '123456789',
      antt: '56781234',
      email: 'contato@expressodonoRodovte.com.br',
      telefone: '(92) 3456-7890',
      contato: 'Fernanda Lima',
      endereco: {
        cep: '69050-001',
        logradouro: 'Av. Djalma Batista',
        numero: '450',
        bairro: 'Chapada',
        cidade: 'Manaus',
        estado: 'AM'
      },
      ativo: true,
      tipo: 'rodoviario',
      totalFrete: 87500.00
    }
  ]);

  const [modalTransportadora, setModalTransportadora] = useState<Transportadora | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDocumento, setFiltroDocumento] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('');

  const handleNovoClick = () => {
    setModalTransportadora({
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
      totalFrete: 0
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleEditClick = (transportadora: Transportadora) => {
    setModalTransportadora({ ...transportadora });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDuplicarClick = (transportadora: Transportadora) => {
    setModalTransportadora({
      ...transportadora,
      id: 0,
      nome: `${transportadora.nome} (Cópia)`,
      documento: '',
      totalFrete: 0
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleExcluirClick = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta transportadora?')) {
      setTransportadoras(transportadoras.filter(t => t.id !== id));
    }
  };

  const handleModalSave = () => {
    if (!modalTransportadora) return;

    if (modalMode === 'new') {
      // Adicionar nova transportadora
      const newId = Math.max(...transportadoras.map(t => t.id), 0) + 1;
      setTransportadoras([...transportadoras, { ...modalTransportadora, id: newId }]);
    } else {
      // Editar transportadora existente
      setTransportadoras(transportadoras.map(t => t.id === modalTransportadora.id ? modalTransportadora : t));
    }

    setIsModalOpen(false);
    setModalTransportadora(null);
  };

  const filteredTransportadoras = transportadoras.filter(transportadora => {
    const matchNome = transportadora.nome.toLowerCase().includes(filtroNome.toLowerCase()) || 
                     (transportadora.nomeFantasia?.toLowerCase().includes(filtroNome.toLowerCase()) || false);
    const matchDocumento = transportadora.documento.includes(filtroDocumento);
    const matchTipo = filtroTipo === '' || transportadora.tipo === filtroTipo;
    const matchAtivo = filtroAtivo === '' || 
                     (filtroAtivo === 'ativo' && transportadora.ativo) || 
                     (filtroAtivo === 'inativo' && !transportadora.ativo);

    return matchNome && matchDocumento && matchTipo && matchAtivo;
  });

  const getTipoTransportadora = (tipo?: string) => {
    switch (tipo) {
      case 'rodoviario':
        return { 
          label: 'Rodoviário', 
          icon: <TruckIcon className="h-3 w-3 mr-1" />,
          badge: <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            <TruckIcon className="h-3 w-3 mr-1" />Rodoviário
          </Badge>
        };
      case 'aereo':
        return { 
          label: 'Aéreo', 
          icon: <Car className="h-3 w-3 mr-1" rotate={45} />,
          badge: <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">
            <Car className="h-3 w-3 mr-1" rotate={45} />Aéreo
          </Badge>
        };
      case 'maritimo':
        return { 
          label: 'Marítimo', 
          icon: <Car className="h-3 w-3 mr-1" />,
          badge: <Badge variant="outline" className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50 border-cyan-200">
            <Car className="h-3 w-3 mr-1" />Marítimo
          </Badge>
        };
      case 'ferroviario':
        return { 
          label: 'Ferroviário', 
          icon: <Car className="h-3 w-3 mr-1" />,
          badge: <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
            <Car className="h-3 w-3 mr-1" />Ferroviário
          </Badge>
        };
      default:
        return { 
          label: 'Não informado', 
          icon: <TruckIcon className="h-3 w-3 mr-1" />,
          badge: <Badge variant="outline">Não informado</Badge>
        };
    }
  };

  return (
    <FiscalMenuWrapper activeSection="cadastros">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cadastro de Transportadoras</h1>
            <p className="text-muted-foreground">
              Gerencie as transportadoras para emissão de documentos fiscais
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
              Nova Transportadora
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos">
          <div className="flex justify-between mb-4">
            <TabsList>
              <TabsTrigger value="todos">Todas as Transportadoras</TabsTrigger>
              <TabsTrigger value="ativos">Ativas</TabsTrigger>
              <TabsTrigger value="inativos">Inativas</TabsTrigger>
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
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="rodoviario">Rodoviário</SelectItem>
                  <SelectItem value="aereo">Aéreo</SelectItem>
                  <SelectItem value="maritimo">Marítimo</SelectItem>
                  <SelectItem value="ferroviario">Ferroviário</SelectItem>
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Total em Fretes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransportadoras.length > 0 ? (
                    filteredTransportadoras.map(transportadora => (
                      <TableRow key={transportadora.id}>
                        <TableCell>
                          <div className="font-medium">{transportadora.nome}</div>
                          {transportadora.nomeFantasia && (
                            <div className="text-xs text-muted-foreground">{transportadora.nomeFantasia}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {transportadora.tipo ? 
                            getTipoTransportadora(transportadora.tipo).badge : 
                            <Badge variant="outline">Não informado</Badge>
                          }
                        </TableCell>
                        <TableCell>
                          <div>{transportadora.documento}</div>
                          <div className="text-xs text-muted-foreground">CNPJ</div>
                          {transportadora.antt && (
                            <div className="text-xs text-muted-foreground">ANTT: {transportadora.antt}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />{transportadora.email}
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <Phone className="h-3 w-3 mr-1" />{transportadora.telefone}
                          </div>
                          {transportadora.contato && (
                            <div className="flex items-center text-xs mt-1 text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />{transportadora.contato}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {transportadora.endereco.cidade}/{transportadora.endereco.estado}
                        </TableCell>
                        <TableCell>
                          {transportadora.totalFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                          {transportadora.ativo ? (
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
                              <DropdownMenuItem onClick={() => handleEditClick(transportadora)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicarClick(transportadora)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Emitir Conhecimento
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleExcluirClick(transportadora.id)} className="text-red-600">
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
                        Nenhuma transportadora encontrada.
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Total em Fretes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transportadoras.filter(t => t.ativo).map(transportadora => (
                    <TableRow key={transportadora.id}>
                      <TableCell>
                        <div className="font-medium">{transportadora.nome}</div>
                        {transportadora.nomeFantasia && (
                          <div className="text-xs text-muted-foreground">{transportadora.nomeFantasia}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {transportadora.tipo ? 
                          getTipoTransportadora(transportadora.tipo).badge : 
                          <Badge variant="outline">Não informado</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <div>{transportadora.documento}</div>
                        <div className="text-xs text-muted-foreground">CNPJ</div>
                        {transportadora.antt && (
                          <div className="text-xs text-muted-foreground">ANTT: {transportadora.antt}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />{transportadora.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1" />{transportadora.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transportadora.endereco.cidade}/{transportadora.endereco.estado}
                      </TableCell>
                      <TableCell>
                        {transportadora.totalFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                            <DropdownMenuItem onClick={() => handleEditClick(transportadora)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(transportadora)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(transportadora.id)} className="text-red-600">
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Total em Fretes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transportadoras.filter(t => !t.ativo).map(transportadora => (
                    <TableRow key={transportadora.id}>
                      <TableCell>
                        <div className="font-medium">{transportadora.nome}</div>
                        {transportadora.nomeFantasia && (
                          <div className="text-xs text-muted-foreground">{transportadora.nomeFantasia}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {transportadora.tipo ? 
                          getTipoTransportadora(transportadora.tipo).badge : 
                          <Badge variant="outline">Não informado</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <div>{transportadora.documento}</div>
                        <div className="text-xs text-muted-foreground">CNPJ</div>
                        {transportadora.antt && (
                          <div className="text-xs text-muted-foreground">ANTT: {transportadora.antt}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />{transportadora.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-1" />{transportadora.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transportadora.endereco.cidade}/{transportadora.endereco.estado}
                      </TableCell>
                      <TableCell>
                        {transportadora.totalFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                            <DropdownMenuItem onClick={() => handleEditClick(transportadora)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(transportadora)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(transportadora.id)} className="text-red-600">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Transportadoras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transportadoras.length}</div>
              <p className="text-xs text-muted-foreground">
                {transportadoras.filter(t => t.ativo).length} ativas / {transportadoras.filter(t => !t.ativo).length} inativas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total em Fretes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transportadoras.reduce((acc, t) => acc + t.totalFrete, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-xs text-muted-foreground">
                Média por transportadora: {(transportadoras.reduce((acc, t) => acc + t.totalFrete, 0) / transportadoras.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tipos de Transporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transportadoras.filter(t => t.tipo === 'rodoviario').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Rodoviárias ({Math.round((transportadoras.filter(t => t.tipo === 'rodoviario').length / transportadoras.length) * 100)}%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maior Prestador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transportadoras.length > 0 ? 
                  transportadoras.reduce((prev, current) => (prev.totalFrete > current.totalFrete) ? prev : current).nomeFantasia || 
                  transportadoras.reduce((prev, current) => (prev.totalFrete > current.totalFrete) ? prev : current).nome : 
                  'Nenhum'}
              </div>
              <p className="text-xs text-muted-foreground">
                Transportadora com maior valor em fretes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para adicionar/editar transportadora */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalMode === 'new' ? 'Nova Transportadora' : 'Editar Transportadora'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {modalMode === 'new' ? 'adicionar uma nova' : 'editar a'} transportadora.
            </DialogDescription>
          </DialogHeader>

          {modalTransportadora && (
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
                    value={modalTransportadora.documento} 
                    onChange={(e) => setModalTransportadora({...modalTransportadora, documento: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nome">Razão Social</Label>
                  <Input 
                    id="nome" 
                    value={modalTransportadora.nome} 
                    onChange={(e) => setModalTransportadora({...modalTransportadora, nome: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input 
                    id="nomeFantasia" 
                    value={modalTransportadora.nomeFantasia || ''} 
                    onChange={(e) => setModalTransportadora({...modalTransportadora, nomeFantasia: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={modalTransportadora.email} 
                      onChange={(e) => setModalTransportadora({...modalTransportadora, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      value={modalTransportadora.telefone} 
                      onChange={(e) => setModalTransportadora({...modalTransportadora, telefone: e.target.value})}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contato">Nome do Contato</Label>
                    <Input 
                      id="contato" 
                      value={modalTransportadora.contato || ''} 
                      onChange={(e) => setModalTransportadora({...modalTransportadora, contato: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Transporte</Label>
                    <Select 
                      value={modalTransportadora.tipo || ''}
                      onValueChange={(value: 'rodoviario' | 'aereo' | 'maritimo' | 'ferroviario' | '') => 
                        setModalTransportadora({...modalTransportadora, tipo: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Não informado</SelectItem>
                        <SelectItem value="rodoviario">Rodoviário</SelectItem>
                        <SelectItem value="aereo">Aéreo</SelectItem>
                        <SelectItem value="maritimo">Marítimo</SelectItem>
                        <SelectItem value="ferroviario">Ferroviário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="ativo" 
                    checked={modalTransportadora.ativo}
                    onCheckedChange={(checked) => 
                      setModalTransportadora({...modalTransportadora, ativo: checked === true})
                    }
                  />
                  <label
                    htmlFor="ativo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Transportadora Ativa
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="endereco" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input 
                      id="cep" 
                      value={modalTransportadora.endereco.cep} 
                      onChange={(e) => setModalTransportadora({
                        ...modalTransportadora, 
                        endereco: {...modalTransportadora.endereco, cep: e.target.value}
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
                    value={modalTransportadora.endereco.logradouro} 
                    onChange={(e) => setModalTransportadora({
                      ...modalTransportadora, 
                      endereco: {...modalTransportadora.endereco, logradouro: e.target.value}
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input 
                      id="numero" 
                      value={modalTransportadora.endereco.numero} 
                      onChange={(e) => setModalTransportadora({
                        ...modalTransportadora, 
                        endereco: {...modalTransportadora.endereco, numero: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input 
                      id="complemento" 
                      value={modalTransportadora.endereco.complemento || ''} 
                      onChange={(e) => setModalTransportadora({
                        ...modalTransportadora, 
                        endereco: {...modalTransportadora.endereco, complemento: e.target.value}
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro" 
                    value={modalTransportadora.endereco.bairro} 
                    onChange={(e) => setModalTransportadora({
                      ...modalTransportadora, 
                      endereco: {...modalTransportadora.endereco, bairro: e.target.value}
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input 
                      id="cidade" 
                      value={modalTransportadora.endereco.cidade} 
                      onChange={(e) => setModalTransportadora({
                        ...modalTransportadora, 
                        endereco: {...modalTransportadora.endereco, cidade: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={modalTransportadora.endereco.estado}
                      onValueChange={(value) => setModalTransportadora({
                        ...modalTransportadora, 
                        endereco: {...modalTransportadora.endereco, estado: value}
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
                      value={modalTransportadora.inscricaoEstadual || ''} 
                      onChange={(e) => setModalTransportadora({...modalTransportadora, inscricaoEstadual: e.target.value})}
                      placeholder="Deixe em branco para ISENTO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="antt">Registro ANTT</Label>
                    <Input 
                      id="antt" 
                      value={modalTransportadora.antt || ''} 
                      onChange={(e) => setModalTransportadora({...modalTransportadora, antt: e.target.value})}
                      placeholder="Apenas para transportadoras rodoviárias"
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
                        <p>Preencha corretamente os dados fiscais da transportadora para garantir a correta emissão de documentos fiscais.</p>
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

export default TransportadorasCadastro;