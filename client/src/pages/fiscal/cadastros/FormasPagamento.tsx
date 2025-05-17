import React, { useState } from 'react';
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
  CreditCard,
  Search,
  Plus,
  Trash2,
  Pencil,
  Copy,
  Filter,
  MoreHorizontal,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  DollarSign,
  Banknote,
  Receipt,
  CreditCard as CreditCardIcon,
  Wallet,
  CircleDollarSign,
  Calendar,
  Coins
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

type FormaPagamento = {
  id: number;
  codigo: string;
  descricao: string;
  tipo: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | 'cheque' | 'transferencia' | 'outro';
  parcelas: number;
  ativo: boolean;
  padrao: boolean;
  usadoEm?: string;
  percentual: number;
};

const FormasPagamentoCadastro: React.FC = () => {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([
    {
      id: 1,
      codigo: '01',
      descricao: 'Dinheiro',
      tipo: 'dinheiro',
      parcelas: 1,
      ativo: true,
      padrao: true,
      usadoEm: 'NFe, NFCe',
      percentual: 35
    },
    {
      id: 2,
      codigo: '03',
      descricao: 'Cartão de Crédito',
      tipo: 'cartao_credito',
      parcelas: 1,
      ativo: true,
      padrao: false,
      usadoEm: 'NFe, NFCe',
      percentual: 30
    },
    {
      id: 3,
      codigo: '04',
      descricao: 'Cartão de Débito',
      tipo: 'cartao_debito',
      parcelas: 1,
      ativo: true,
      padrao: false,
      usadoEm: 'NFe, NFCe',
      percentual: 15
    },
    {
      id: 4,
      codigo: '17',
      descricao: 'PIX',
      tipo: 'pix',
      parcelas: 1,
      ativo: true,
      padrao: false,
      usadoEm: 'NFe, NFCe, NFSe',
      percentual: 20
    },
    {
      id: 5,
      codigo: '15',
      descricao: 'Boleto Bancário',
      tipo: 'boleto',
      parcelas: 1,
      ativo: false,
      padrao: false,
      usadoEm: 'NFe',
      percentual: 0
    }
  ]);

  const [modalFormaPagamento, setModalFormaPagamento] = useState<FormaPagamento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');

  const [filtroDescricao, setFiltroDescricao] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('');

  const handleNovoClick = () => {
    setModalFormaPagamento({
      id: 0,
      codigo: '',
      descricao: '',
      tipo: 'dinheiro',
      parcelas: 1,
      ativo: true,
      padrao: false,
      percentual: 0
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleEditClick = (formaPagamento: FormaPagamento) => {
    setModalFormaPagamento({ ...formaPagamento });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDuplicarClick = (formaPagamento: FormaPagamento) => {
    setModalFormaPagamento({
      ...formaPagamento,
      id: 0,
      descricao: `${formaPagamento.descricao} (Cópia)`,
      codigo: '',
      padrao: false
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleExcluirClick = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta forma de pagamento?')) {
      setFormasPagamento(formasPagamento.filter(f => f.id !== id));
    }
  };

  const handleModalSave = () => {
    if (!modalFormaPagamento) return;

    if (modalMode === 'new') {
      // Adicionar nova forma de pagamento
      const newId = Math.max(...formasPagamento.map(f => f.id), 0) + 1;
      setFormasPagamento([...formasPagamento, { ...modalFormaPagamento, id: newId }]);
    } else {
      // Editar forma de pagamento existente
      setFormasPagamento(formasPagamento.map(f => f.id === modalFormaPagamento.id ? modalFormaPagamento : f));
    }

    setIsModalOpen(false);
    setModalFormaPagamento(null);
  };

  const filteredFormasPagamento = formasPagamento.filter(forma => {
    const matchDescricao = forma.descricao.toLowerCase().includes(filtroDescricao.toLowerCase());
    const matchTipo = filtroTipo === '' || forma.tipo === filtroTipo;
    const matchAtivo = filtroAtivo === '' || 
                     (filtroAtivo === 'ativo' && forma.ativo) || 
                     (filtroAtivo === 'inativo' && !forma.ativo);

    return matchDescricao && matchTipo && matchAtivo;
  });

  const getTipoFormaPagamento = (tipo: string) => {
    switch (tipo) {
      case 'dinheiro':
        return { 
          label: 'Dinheiro', 
          icon: <Banknote className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <Banknote className="h-3 w-3 mr-1" />Dinheiro
          </Badge>
        };
      case 'cartao_credito':
        return { 
          label: 'Cartão de Crédito', 
          icon: <CreditCardIcon className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            <CreditCardIcon className="h-3 w-3 mr-1" />Cartão de Crédito
          </Badge>
        };
      case 'cartao_debito':
        return { 
          label: 'Cartão de Débito', 
          icon: <CreditCardIcon className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">
            <CreditCardIcon className="h-3 w-3 mr-1" />Cartão de Débito
          </Badge>
        };
      case 'pix':
        return { 
          label: 'PIX', 
          icon: <CircleDollarSign className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50 border-cyan-200">
            <CircleDollarSign className="h-3 w-3 mr-1" />PIX
          </Badge>
        };
      case 'boleto':
        return { 
          label: 'Boleto', 
          icon: <Receipt className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
            <Receipt className="h-3 w-3 mr-1" />Boleto
          </Badge>
        };
      case 'cheque':
        return { 
          label: 'Cheque', 
          icon: <Banknote className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-200">
            <Banknote className="h-3 w-3 mr-1" />Cheque
          </Badge>
        };
      case 'transferencia':
        return { 
          label: 'Transferência', 
          icon: <Wallet className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200">
            <Wallet className="h-3 w-3 mr-1" />Transferência
          </Badge>
        };
      default:
        return { 
          label: 'Outro', 
          icon: <DollarSign className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline">
            <DollarSign className="h-3 w-3 mr-1" />Outro
          </Badge>
        };
    }
  };

  return (
    <FiscalMenuWrapper activeSection="cadastros">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Formas de Pagamento</h1>
            <p className="text-muted-foreground">
              Gerencie as formas de pagamento disponíveis para documentos fiscais
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
              Nova Forma
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos">
          <div className="flex justify-between mb-4">
            <TabsList>
              <TabsTrigger value="todos">Todas</TabsTrigger>
              <TabsTrigger value="ativos">Ativas</TabsTrigger>
              <TabsTrigger value="inativos">Inativas</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Input 
                placeholder="Buscar por descrição" 
                className="w-60"
                value={filtroDescricao}
                onChange={(e) => setFiltroDescricao(e.target.value)}
              />
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Documentos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Padrão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFormasPagamento.length > 0 ? (
                    filteredFormasPagamento.map(formaPagamento => (
                      <TableRow key={formaPagamento.id}>
                        <TableCell className="font-mono">{formaPagamento.codigo}</TableCell>
                        <TableCell className="font-medium">{formaPagamento.descricao}</TableCell>
                        <TableCell>
                          {getTipoFormaPagamento(formaPagamento.tipo).badge}
                        </TableCell>
                        <TableCell>
                          {formaPagamento.parcelas > 1 ? 
                            `Até ${formaPagamento.parcelas}x` : 
                            'À vista'}
                        </TableCell>
                        <TableCell>
                          {formaPagamento.usadoEm || 'Todos'}
                        </TableCell>
                        <TableCell>
                          {formaPagamento.ativo ? (
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
                        <TableCell>
                          {formaPagamento.padrao ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Padrão
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
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
                              <DropdownMenuItem onClick={() => handleEditClick(formaPagamento)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicarClick(formaPagamento)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleExcluirClick(formaPagamento.id)} className="text-red-600">
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
                        Nenhuma forma de pagamento encontrada.
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
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Documentos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Padrão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formasPagamento.filter(f => f.ativo).map(formaPagamento => (
                    <TableRow key={formaPagamento.id}>
                      <TableCell className="font-mono">{formaPagamento.codigo}</TableCell>
                      <TableCell className="font-medium">{formaPagamento.descricao}</TableCell>
                      <TableCell>
                        {getTipoFormaPagamento(formaPagamento.tipo).badge}
                      </TableCell>
                      <TableCell>
                        {formaPagamento.parcelas > 1 ? 
                          `Até ${formaPagamento.parcelas}x` : 
                          'À vista'}
                      </TableCell>
                      <TableCell>
                        {formaPagamento.usadoEm || 'Todos'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formaPagamento.padrao ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Padrão
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
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
                            <DropdownMenuItem onClick={() => handleEditClick(formaPagamento)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(formaPagamento)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(formaPagamento.id)} className="text-red-600">
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
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Documentos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Padrão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formasPagamento.filter(f => !f.ativo).map(formaPagamento => (
                    <TableRow key={formaPagamento.id}>
                      <TableCell className="font-mono">{formaPagamento.codigo}</TableCell>
                      <TableCell className="font-medium">{formaPagamento.descricao}</TableCell>
                      <TableCell>
                        {getTipoFormaPagamento(formaPagamento.tipo).badge}
                      </TableCell>
                      <TableCell>
                        {formaPagamento.parcelas > 1 ? 
                          `Até ${formaPagamento.parcelas}x` : 
                          'À vista'}
                      </TableCell>
                      <TableCell>
                        {formaPagamento.usadoEm || 'Todos'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formaPagamento.padrao ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Padrão
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
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
                            <DropdownMenuItem onClick={() => handleEditClick(formaPagamento)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(formaPagamento)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(formaPagamento.id)} className="text-red-600">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Formas de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formasPagamento.length}</div>
              <p className="text-xs text-muted-foreground">
                {formasPagamento.filter(f => f.ativo).length} ativas / {formasPagamento.filter(f => !f.ativo).length} inativas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Forma Mais Usada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formasPagamento.sort((a, b) => b.percentual - a.percentual)[0]?.descricao || 'Nenhuma'}
              </div>
              <p className="text-xs text-muted-foreground">
                {formasPagamento.sort((a, b) => b.percentual - a.percentual)[0]?.percentual || 0}% das vendas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Formas com Parcelamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formasPagamento.filter(f => f.parcelas > 1).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((formasPagamento.filter(f => f.parcelas > 1).length / formasPagamento.length) * 100) || 0}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formasPagamento.filter(f => f.tipo === 'cartao_credito' || f.tipo === 'cartao_debito').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Formas de pagamento com cartão
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para adicionar/editar forma de pagamento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{modalMode === 'new' ? 'Nova Forma de Pagamento' : 'Editar Forma de Pagamento'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {modalMode === 'new' ? 'adicionar uma nova' : 'editar a'} forma de pagamento.
            </DialogDescription>
          </DialogHeader>

          {modalFormaPagamento && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input 
                    id="codigo" 
                    value={modalFormaPagamento.codigo} 
                    onChange={(e) => setModalFormaPagamento({...modalFormaPagamento, codigo: e.target.value})}
                    placeholder="Ex: 01"
                  />
                  <p className="text-xs text-muted-foreground">
                    Código conforme a tabela da SEFAZ
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select 
                    value={modalFormaPagamento.tipo}
                    onValueChange={(value: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | 'cheque' | 'transferencia' | 'outro') => 
                      setModalFormaPagamento({...modalFormaPagamento, tipo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input 
                  id="descricao" 
                  value={modalFormaPagamento.descricao} 
                  onChange={(e) => setModalFormaPagamento({...modalFormaPagamento, descricao: e.target.value})}
                  placeholder="Ex: Cartão de Crédito"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parcelas">Número de Parcelas</Label>
                <Input 
                  id="parcelas" 
                  type="number" 
                  value={modalFormaPagamento.parcelas} 
                  onChange={(e) => setModalFormaPagamento({
                    ...modalFormaPagamento, 
                    parcelas: parseInt(e.target.value) || 1
                  })}
                  min={1}
                  max={24}
                />
                <p className="text-xs text-muted-foreground">
                  Número máximo de parcelas permitido
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usadoEm">Usado em</Label>
                <Input 
                  id="usadoEm" 
                  value={modalFormaPagamento.usadoEm || ''} 
                  onChange={(e) => setModalFormaPagamento({...modalFormaPagamento, usadoEm: e.target.value})}
                  placeholder="Ex: NFe, NFCe, NFSe"
                />
                <p className="text-xs text-muted-foreground">
                  Em quais documentos esta forma pode ser usada
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ativo" 
                    checked={modalFormaPagamento.ativo}
                    onCheckedChange={(checked) => 
                      setModalFormaPagamento({...modalFormaPagamento, ativo: checked === true})
                    }
                  />
                  <label
                    htmlFor="ativo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Forma Ativa
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="padrao" 
                    checked={modalFormaPagamento.padrao}
                    onCheckedChange={(checked) => 
                      setModalFormaPagamento({...modalFormaPagamento, padrao: checked === true})
                    }
                  />
                  <label
                    htmlFor="padrao"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Definir como Padrão
                  </label>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="percentual">Percentual de Uso (%)</Label>
                <Input 
                  id="percentual" 
                  type="number" 
                  value={modalFormaPagamento.percentual} 
                  onChange={(e) => setModalFormaPagamento({
                    ...modalFormaPagamento, 
                    percentual: parseFloat(e.target.value) || 0
                  })}
                  min={0}
                  max={100}
                />
                <p className="text-xs text-muted-foreground">
                  Apenas para fins estatísticos
                </p>
              </div>
            </div>
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

export default FormasPagamentoCadastro;