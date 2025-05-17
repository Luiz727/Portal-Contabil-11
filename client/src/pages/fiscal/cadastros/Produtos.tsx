import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Search,
  Plus,
  Trash2,
  Pencil,
  Copy,
  FileText,
  BarChart2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import FiscalMenuWrapper from '@/components/fiscal/FiscalMenuWrapper';

type Produto = {
  id: number;
  codigo: string;
  descricao: string;
  preco: number;
  unidade: string;
  ncm: string;
  cest: string;
  origem: string;
  ativo: boolean;
  estoque: number;
  categoria: string;
  marca: string;
  foto?: string;
};

const ProdutosCadastro: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: 1,
      codigo: 'P001',
      descricao: 'Notebook Dell Inspiron',
      preco: 3499.90,
      unidade: 'UN',
      ncm: '84713019',
      cest: '2107000',
      origem: '0',
      ativo: true,
      estoque: 15,
      categoria: 'Eletrônicos',
      marca: 'Dell'
    },
    {
      id: 2,
      codigo: 'P002',
      descricao: 'Mouse Sem Fio Logitech',
      preco: 89.90,
      unidade: 'UN',
      ncm: '84716053',
      cest: '2106200',
      origem: '0',
      ativo: true,
      estoque: 42,
      categoria: 'Periféricos',
      marca: 'Logitech'
    },
    {
      id: 3,
      codigo: 'P003',
      descricao: 'Teclado Mecânico Gamer',
      preco: 249.90,
      unidade: 'UN',
      ncm: '84716052',
      cest: '2106100',
      origem: '0',
      ativo: true,
      estoque: 28,
      categoria: 'Periféricos',
      marca: 'Redragon'
    },
    {
      id: 4,
      codigo: 'P004',
      descricao: 'Monitor 24" Full HD',
      preco: 899.90,
      unidade: 'UN',
      ncm: '85285220',
      cest: '2105900',
      origem: '2',
      ativo: false,
      estoque: 0,
      categoria: 'Monitores',
      marca: 'LG'
    },
    {
      id: 5,
      codigo: 'P005',
      descricao: 'SSD 480GB Kingston',
      preco: 349.90,
      unidade: 'UN',
      ncm: '84717012',
      cest: '2107100',
      origem: '0',
      ativo: true,
      estoque: 55,
      categoria: 'Armazenamento',
      marca: 'Kingston'
    }
  ]);

  const [modalProduto, setModalProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit'>('new');

  const [filtroDescricao, setFiltroDescricao] = useState('');
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('');

  const handleNovoClick = () => {
    setModalProduto({
      id: 0,
      codigo: '',
      descricao: '',
      preco: 0,
      unidade: 'UN',
      ncm: '',
      cest: '',
      origem: '0',
      ativo: true,
      estoque: 0,
      categoria: '',
      marca: ''
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleEditClick = (produto: Produto) => {
    setModalProduto({ ...produto });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDuplicarClick = (produto: Produto) => {
    setModalProduto({
      ...produto,
      id: 0,
      codigo: `${produto.codigo}-COPIA`,
      descricao: `${produto.descricao} (Cópia)`
    });
    setModalMode('new');
    setIsModalOpen(true);
  };

  const handleExcluirClick = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  const handleModalSave = () => {
    if (!modalProduto) return;

    if (modalMode === 'new') {
      // Adicionar novo produto
      const newId = Math.max(...produtos.map(p => p.id), 0) + 1;
      setProdutos([...produtos, { ...modalProduto, id: newId }]);
    } else {
      // Editar produto existente
      setProdutos(produtos.map(p => p.id === modalProduto.id ? modalProduto : p));
    }

    setIsModalOpen(false);
    setModalProduto(null);
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchDescricao = produto.descricao.toLowerCase().includes(filtroDescricao.toLowerCase());
    const matchCodigo = produto.codigo.toLowerCase().includes(filtroCodigo.toLowerCase());
    const matchCategoria = filtroCategoria === '' || produto.categoria === filtroCategoria;
    const matchAtivo = filtroAtivo === '' || 
                     (filtroAtivo === 'ativo' && produto.ativo) || 
                     (filtroAtivo === 'inativo' && !produto.ativo);

    return matchDescricao && matchCodigo && matchCategoria && matchAtivo;
  });

  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));
  const marcas = Array.from(new Set(produtos.map(p => p.marca)));

  return (
    <FiscalMenuWrapper activeSection="cadastros">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cadastro de Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie os produtos disponíveis para emissão de documentos fiscais
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
              Novo Produto
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos">
          <div className="flex justify-between mb-4">
            <TabsList>
              <TabsTrigger value="todos">Todos os Produtos</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="inativos">Inativos</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Input 
                placeholder="Buscar por código" 
                className="w-40"
                value={filtroCodigo}
                onChange={(e) => setFiltroCodigo(e.target.value)}
              />
              <Input 
                placeholder="Buscar por descrição" 
                className="w-60"
                value={filtroDescricao}
                onChange={(e) => setFiltroDescricao(e.target.value)}
              />
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                    <TableHead className="w-16">Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-24">Preço</TableHead>
                    <TableHead className="w-20">Unidade</TableHead>
                    <TableHead className="w-28">NCM</TableHead>
                    <TableHead className="w-28">Categoria</TableHead>
                    <TableHead className="w-20">Estoque</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-28 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProdutos.length > 0 ? (
                    filteredProdutos.map(produto => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.codigo}</TableCell>
                        <TableCell>{produto.descricao}</TableCell>
                        <TableCell>
                          {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>{produto.unidade}</TableCell>
                        <TableCell>{produto.ncm}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>{produto.estoque}</TableCell>
                        <TableCell>
                          {produto.ativo ? (
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
                              <DropdownMenuItem onClick={() => handleEditClick(produto)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicarClick(produto)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleExcluirClick(produto.id)} className="text-red-600">
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
                      <TableCell colSpan={9} className="text-center py-4">
                        Nenhum produto encontrado.
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
                    <TableHead className="w-16">Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-24">Preço</TableHead>
                    <TableHead className="w-20">Unidade</TableHead>
                    <TableHead className="w-28">NCM</TableHead>
                    <TableHead className="w-28">Categoria</TableHead>
                    <TableHead className="w-20">Estoque</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-28 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.filter(p => p.ativo).map(produto => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.codigo}</TableCell>
                      <TableCell>{produto.descricao}</TableCell>
                      <TableCell>
                        {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>{produto.ncm}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>{produto.estoque}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClick(produto)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(produto)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(produto.id)} className="text-red-600">
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
                    <TableHead className="w-16">Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-24">Preço</TableHead>
                    <TableHead className="w-20">Unidade</TableHead>
                    <TableHead className="w-28">NCM</TableHead>
                    <TableHead className="w-28">Categoria</TableHead>
                    <TableHead className="w-20">Estoque</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-28 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.filter(p => !p.ativo).map(produto => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.codigo}</TableCell>
                      <TableCell>{produto.descricao}</TableCell>
                      <TableCell>
                        {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>{produto.ncm}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>{produto.estoque}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClick(produto)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarClick(produto)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExcluirClick(produto.id)} className="text-red-600">
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
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{produtos.length}</div>
              <p className="text-xs text-muted-foreground">
                {produtos.filter(p => p.ativo).length} ativos / {produtos.filter(p => !p.ativo).length} inativos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor do Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {produtos.reduce((acc, p) => acc + (p.preco * p.estoque), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-xs text-muted-foreground">
                {produtos.reduce((acc, p) => acc + p.estoque, 0)} itens em estoque
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
                Mais produtos em: {categorias.reduce((max, cat) => {
                  const count = produtos.filter(p => p.categoria === cat).length;
                  return count > max.count ? { name: cat, count } : max;
                }, { name: '', count: 0 }).name}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Marcas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marcas.length}</div>
              <p className="text-xs text-muted-foreground">
                Mais produtos em: {marcas.reduce((max, marca) => {
                  const count = produtos.filter(p => p.marca === marca).length;
                  return count > max.count ? { name: marca, count } : max;
                }, { name: '', count: 0 }).name}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para adicionar/editar produto */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalMode === 'new' ? 'Novo Produto' : 'Editar Produto'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {modalMode === 'new' ? 'adicionar um novo' : 'editar o'} produto.
            </DialogDescription>
          </DialogHeader>

          {modalProduto && (
            <Tabs defaultValue="geral">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
                <TabsTrigger value="fiscal">Dados Fiscais</TabsTrigger>
                <TabsTrigger value="estoque">Estoque</TabsTrigger>
              </TabsList>
              
              <TabsContent value="geral" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input 
                      id="codigo" 
                      value={modalProduto.codigo} 
                      onChange={(e) => setModalProduto({...modalProduto, codigo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Select 
                      value={modalProduto.marca}
                      onValueChange={(value) => setModalProduto({...modalProduto, marca: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {marcas.map(marca => (
                          <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                        ))}
                        <SelectItem value="nova">+ Nova Marca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input 
                    id="descricao" 
                    value={modalProduto.descricao} 
                    onChange={(e) => setModalProduto({...modalProduto, descricao: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço</Label>
                    <Input 
                      id="preco" 
                      type="number" 
                      value={modalProduto.preco} 
                      onChange={(e) => setModalProduto({...modalProduto, preco: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select 
                      value={modalProduto.categoria}
                      onValueChange={(value) => setModalProduto({...modalProduto, categoria: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                        <SelectItem value="nova">+ Nova Categoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="ativo" 
                    checked={modalProduto.ativo}
                    onCheckedChange={(checked) => 
                      setModalProduto({...modalProduto, ativo: checked === true})
                    }
                  />
                  <label
                    htmlFor="ativo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Produto Ativo
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="fiscal" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ncm">NCM</Label>
                    <Input 
                      id="ncm" 
                      value={modalProduto.ncm} 
                      onChange={(e) => setModalProduto({...modalProduto, ncm: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Nomenclatura Comum do Mercosul</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cest">CEST</Label>
                    <Input 
                      id="cest" 
                      value={modalProduto.cest} 
                      onChange={(e) => setModalProduto({...modalProduto, cest: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Código Especificador da Substituição Tributária</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origem">Origem</Label>
                    <Select 
                      value={modalProduto.origem}
                      onValueChange={(value) => setModalProduto({...modalProduto, origem: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Nacional</SelectItem>
                        <SelectItem value="1">1 - Estrangeira (Importação direta)</SelectItem>
                        <SelectItem value="2">2 - Estrangeira (Adquirida no mercado interno)</SelectItem>
                        <SelectItem value="3">3 - Nacional com mais de 40% de conteúdo estrangeiro</SelectItem>
                        <SelectItem value="4">4 - Nacional produzida via leis de incentivo</SelectItem>
                        <SelectItem value="5">5 - Nacional com menos de 40% de conteúdo estrangeiro</SelectItem>
                        <SelectItem value="6">6 - Estrangeira (Importação direta) sem similar nacional</SelectItem>
                        <SelectItem value="7">7 - Estrangeira (Mercado interno) sem similar nacional</SelectItem>
                        <SelectItem value="8">8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Origem da mercadoria</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select 
                      value={modalProduto.unidade}
                      onValueChange={(value) => setModalProduto({...modalProduto, unidade: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UN">UN - Unidade</SelectItem>
                        <SelectItem value="PC">PC - Peça</SelectItem>
                        <SelectItem value="CX">CX - Caixa</SelectItem>
                        <SelectItem value="KG">KG - Quilograma</SelectItem>
                        <SelectItem value="MT">MT - Metro</SelectItem>
                        <SelectItem value="M2">M2 - Metro Quadrado</SelectItem>
                        <SelectItem value="M3">M3 - Metro Cúbico</SelectItem>
                        <SelectItem value="LT">LT - Litro</SelectItem>
                        <SelectItem value="GR">GR - Grama</SelectItem>
                        <SelectItem value="PR">PR - Par</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Unidade de medida do produto</p>
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
                        <p>Preencha corretamente os dados fiscais do produto para garantir a correta tributação nas notas fiscais.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="estoque" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Estoque Atual</Label>
                    <Input 
                      id="estoque" 
                      type="number" 
                      value={modalProduto.estoque} 
                      onChange={(e) => setModalProduto({...modalProduto, estoque: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                    <Input id="estoque_minimo" type="number" defaultValue="5" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="local_estoque">Local de Estoque</Label>
                    <Input id="local_estoque" placeholder="Ex: Prateleira A3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo_barras">Código de Barras</Label>
                    <Input id="codigo_barras" placeholder="Ex: 7891234567890" />
                  </div>
                </div>
                
                <div className="rounded-md bg-amber-50 p-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Atenção</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>As alterações de estoque são registradas automaticamente no histórico do produto. Para ajustes de estoque, utilize a opção específica de ajuste no menu de estoque.</p>
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

export default ProdutosCadastro;