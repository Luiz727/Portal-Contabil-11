import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Upload, 
  Download, 
  FileText, 
  Clock 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";

const ProdutosUniversaisPage = () => {
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('listagem');
  
  // Estado para guardar os produtos
  const [produtos, setProdutos] = useState([
    { 
      codigo: 'P001', 
      nome: 'Consultoria Contábil Básica', 
      unidade: 'Hora', 
      precoCusto: 'R$ 50,00', 
      precoVenda: 'R$ 150,00' 
    },
    { 
      codigo: 'P002', 
      nome: 'Software de Gestão Financeira - Licença Mensal', 
      unidade: 'UN', 
      precoCusto: 'R$ 25,00', 
      precoVenda: 'R$ 99,90' 
    }
  ]);
  
  // Estado para o termo de busca
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para o diálogo de novo produto
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Estado para o novo produto
  const [novoProduto, setNovoProduto] = useState({
    codigo: '',
    nome: '',
    unidade: '',
    precoCusto: '',
    precoVenda: ''
  });
  
  // Filtrar produtos com base no termo de busca
  const produtosFiltrados = produtos.filter(produto => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      produto.codigo.toLowerCase().includes(searchTermLower) ||
      produto.nome.toLowerCase().includes(searchTermLower)
    );
  });
  
  // Manipular mudanças no formulário de novo produto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Adicionar novo produto
  const handleAddProduto = () => {
    setProdutos(prev => [...prev, novoProduto]);
    setNovoProduto({
      codigo: '',
      nome: '',
      unidade: '',
      precoCusto: '',
      precoVenda: ''
    });
    setIsAddDialogOpen(false);
  };
  
  // Histórico de alterações simulado
  const historicoAlteracoes = [
    { data: '20/05/2025 14:35', usuario: 'João Silva', acao: 'Importação de 25 produtos', detalhes: 'Arquivo: Produtos_Maio2025.xls' },
    { data: '15/05/2025 09:12', usuario: 'Ana Santos', acao: 'Edição de produto', detalhes: 'Código: P001, Nome: Consultoria Contábil Básica' },
    { data: '10/05/2025 16:43', usuario: 'Carlos Oliveira', acao: 'Exclusão de produto', detalhes: 'Código: P003, Nome: Treinamento ERP' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#d9bb42]/10 flex items-center justify-center rounded-lg">
          <FileText size={20} className="text-[#d9bb42]" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Cadastro de Produtos Universais</h1>
      </div>
      <p className="text-gray-500 mb-6">Visualize e gerencie o catálogo de produtos compartilhados.</p>
      
      <Tabs defaultValue="listagem" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="listagem" 
            className="py-3 data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white"
          >
            Produtos
          </TabsTrigger>
          <TabsTrigger 
            value="historico" 
            className="py-3 data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white"
          >
            Histórico de Alterações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listagem" className="mt-0">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Buscar por código, nome ou descrição..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#d9bb42] hover:bg-[#c5aa3a] text-white flex items-center gap-2">
                    <Plus size={16} />
                    <span>Adicionar Produto</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Produto</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes do novo produto universal para compartilhar com as empresas.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="codigo" className="text-right">
                        Código
                      </Label>
                      <Input
                        id="codigo"
                        name="codigo"
                        value={novoProduto.codigo}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={novoProduto.nome}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unidade" className="text-right">
                        Unidade
                      </Label>
                      <Input
                        id="unidade"
                        name="unidade"
                        value={novoProduto.unidade}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="precoCusto" className="text-right">
                        Preço Custo
                      </Label>
                      <Input
                        id="precoCusto"
                        name="precoCusto"
                        value={novoProduto.precoCusto}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="precoVenda" className="text-right">
                        Preço Venda
                      </Label>
                      <Input
                        id="precoVenda"
                        name="precoVenda"
                        value={novoProduto.precoVenda}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="button" className="bg-[#d9bb42] hover:bg-[#c5aa3a]" onClick={handleAddProduto}>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[100px]">Unidade</TableHead>
                  <TableHead className="w-[120px]">Preço Custo</TableHead>
                  <TableHead className="w-[120px]">Preço Venda</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{produto.codigo}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>{produto.precoCusto}</TableCell>
                      <TableCell>{produto.precoVenda}</TableCell>
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
                      Nenhum produto encontrado.
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
              <p className="text-sm text-gray-500">Registro de todas as modificações feitas nos produtos universais.</p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Data e Hora</TableHead>
                  <TableHead className="w-[150px]">Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoAlteracoes.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{item.data}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.usuario}</TableCell>
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

export default ProdutosUniversaisPage;