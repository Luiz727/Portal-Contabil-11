import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FiscalMenu from '@/components/fiscal/FiscalMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FileText,
  Package,
  Truck,
  DollarSign,
  Save,
  Send,
  Printer,
  Download,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

// Esquema de validação para o formulário de NF-e
const nfeSchema = z.object({
  // Seção 1 - Identificação
  numero: z.string().optional(),
  serie: z.string().min(1, 'A série é obrigatória'),
  naturezaOperacao: z.string().min(1, 'A natureza da operação é obrigatória'),
  dataEmissao: z.string().min(1, 'A data de emissão é obrigatória'),
  horaEmissao: z.string().min(1, 'A hora de emissão é obrigatória'),
  tipoOperacao: z.enum(['entrada', 'saida'], {
    required_error: 'Selecione o tipo de operação',
  }),
  finalidade: z.enum(['normal', 'complementar', 'ajuste', 'devolucao'], {
    required_error: 'Selecione a finalidade da NF-e',
  }),
  
  // Seção 2 - Emitente
  emitenteId: z.string().min(1, 'O emitente é obrigatório'),
  
  // Seção 3 - Destinatário
  destinatarioTipo: z.enum(['pf', 'pj', 'estrangeiro'], {
    required_error: 'Selecione o tipo de destinatário',
  }),
  destinatarioId: z.string().min(1, 'O destinatário é obrigatório'),
  
  // Seção 7 - Totais e Pagamento
  informacoesAdicionais: z.string().optional(),
  formaPagamento: z.enum(['avista', 'prazo', 'outros'], {
    required_error: 'Selecione a forma de pagamento',
  }),
  
  // Seção 6 - Transporte
  transporteTipo: z.enum(['emitente', 'destinatario', 'terceiros', 'semfrete'], {
    required_error: 'Selecione o tipo de frete',
  }),
  transportadoraId: z.string().optional(),
  veiculo: z.string().optional(),
  placaVeiculo: z.string().optional(),
  ufVeiculo: z.string().optional(),
  
  // Outros
  observacoes: z.string().optional(),
});

// Tipo para os produtos da NF-e
type ProdutoNota = {
  id: number;
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  icmsBaseCalculo: number;
  icmsAliquota: number;
  icmsValor: number;
  ipiAliquota: number;
  ipiValor: number;
  pisAliquota: number;
  pisValor: number;
  cofinsAliquota: number;
  cofinsValor: number;
};

// Tipo para os totais da NF-e
type TotaisNota = {
  valorProdutos: number;
  valorFrete: number;
  valorSeguro: number;
  valorDesconto: number;
  valorOutrasDespesas: number;
  valorIPI: number;
  valorICMS: number;
  valorICMSST: number;
  valorPIS: number;
  valorCOFINS: number;
  valorTotal: number;
};

const EmissaoNFe = () => {
  // Estado para a lista de produtos
  const [produtos, setProdutos] = useState<ProdutoNota[]>([]);
  
  // Estado para os totais da nota
  const [totais, setTotais] = useState<TotaisNota>({
    valorProdutos: 0,
    valorFrete: 0,
    valorSeguro: 0,
    valorDesconto: 0,
    valorOutrasDespesas: 0,
    valorIPI: 0,
    valorICMS: 0,
    valorICMSST: 0,
    valorPIS: 0,
    valorCOFINS: 0,
    valorTotal: 0,
  });

  // Inicialização do formulário
  const form = useForm<z.infer<typeof nfeSchema>>({
    resolver: zodResolver(nfeSchema),
    defaultValues: {
      serie: '1',
      naturezaOperacao: 'Venda de mercadoria',
      dataEmissao: new Date().toISOString().split('T')[0],
      horaEmissao: new Date().toTimeString().split(' ')[0].substring(0, 5),
      tipoOperacao: 'saida',
      finalidade: 'normal',
      transporteTipo: 'emitente',
      formaPagamento: 'avista',
    },
  });

  // Função para adicionar produto
  const adicionarProduto = () => {
    // Aqui seria aberto um modal para selecionar o produto, definir quantidade etc.
    // Por enquanto vamos adicionar um produto de exemplo
    const novoProduto: ProdutoNota = {
      id: Date.now(), // ID temporário
      codigo: 'P001',
      descricao: 'Produto de Exemplo',
      ncm: '85171231',
      cfop: '5102',
      unidade: 'UN',
      quantidade: 1,
      valorUnitario: 100,
      valorTotal: 100,
      icmsBaseCalculo: 100,
      icmsAliquota: 18,
      icmsValor: 18,
      ipiAliquota: 5,
      ipiValor: 5,
      pisAliquota: 1.65,
      pisValor: 1.65,
      cofinsAliquota: 7.6,
      cofinsValor: 7.6,
    };
    
    setProdutos([...produtos, novoProduto]);
    atualizarTotais([...produtos, novoProduto]);
  };

  // Função para remover produto
  const removerProduto = (id: number) => {
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);
    setProdutos(produtosAtualizados);
    atualizarTotais(produtosAtualizados);
  };

  // Função para atualizar os totais da nota
  const atualizarTotais = (listaProdutos: ProdutoNota[]) => {
    const valorProdutos = listaProdutos.reduce((total, produto) => total + produto.valorTotal, 0);
    const valorIPI = listaProdutos.reduce((total, produto) => total + produto.ipiValor, 0);
    const valorICMS = listaProdutos.reduce((total, produto) => total + produto.icmsValor, 0);
    const valorPIS = listaProdutos.reduce((total, produto) => total + produto.pisValor, 0);
    const valorCOFINS = listaProdutos.reduce((total, produto) => total + produto.cofinsValor, 0);
    
    const novosTotais = {
      ...totais,
      valorProdutos,
      valorIPI,
      valorICMS,
      valorPIS,
      valorCOFINS,
      valorTotal: valorProdutos + totais.valorFrete + totais.valorSeguro + valorIPI - totais.valorDesconto + totais.valorOutrasDespesas,
    };
    
    setTotais(novosTotais);
  };

  // Função para enviar o formulário
  const onSubmit = (data: z.infer<typeof nfeSchema>) => {
    // Verificar se há pelo menos um produto
    if (produtos.length === 0) {
      alert('Adicione pelo menos um produto à NF-e');
      return;
    }
    
    // Preparar dados para API
    const nfeData = {
      ...data,
      produtos,
      totais,
    };
    
    console.log('Enviando NF-e:', nfeData);
    
    // Aqui seria feita a chamada para a API
    // apiRequest.post('/api/nfe/emissao', nfeData)
    //   .then(response => {
    //     console.log('NF-e emitida com sucesso', response);
    //   })
    //   .catch(error => {
    //     console.error('Erro ao emitir NF-e', error);
    //   });
  };

  return (
    <div className="container mx-auto py-6">
      <FiscalMenu activeSection="emissor" />
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Emissão de Nota Fiscal Eletrônica (NF-e)</CardTitle>
              <CardDescription>Preencha os dados para emitir uma NF-e</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => form.reset()}>
                Limpar
              </Button>
              <Button variant="outline" size="sm" onClick={() => form.handleSubmit(onSubmit)()}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button size="sm" onClick={() => form.handleSubmit(onSubmit)()}>
                <Send className="mr-2 h-4 w-4" />
                Emitir NF-e
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="identificacao">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="identificacao">
                    <FileText className="mr-2 h-4 w-4" />
                    Identificação
                  </TabsTrigger>
                  <TabsTrigger value="produtos">
                    <Package className="mr-2 h-4 w-4" />
                    Produtos
                  </TabsTrigger>
                  <TabsTrigger value="transporte">
                    <Truck className="mr-2 h-4 w-4" />
                    Transporte
                  </TabsTrigger>
                  <TabsTrigger value="pagamento">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pagamento
                  </TabsTrigger>
                  <TabsTrigger value="informacoes">
                    <FileText className="mr-2 h-4 w-4" />
                    Informações Adicionais
                  </TabsTrigger>
                </TabsList>
                
                {/* Aba de Identificação */}
                <TabsContent value="identificacao" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium">1. Identificação da NF-e</h3>
                      <Separator className="my-2" />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="numero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número da NF-e</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Gerado automaticamente" disabled />
                              </FormControl>
                              <FormDescription>Número sequencial da NF-e</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="serie"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Série</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>Série do documento fiscal</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="naturezaOperacao"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Natureza da Operação</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>Descrição da operação (ex: Venda, Devolução)</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dataEmissao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Emissão</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="horaEmissao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hora de Emissão</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="tipoOperacao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Operação</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="entrada">Entrada</SelectItem>
                                  <SelectItem value="saida">Saída</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="finalidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Finalidade</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="complementar">Complementar</SelectItem>
                                  <SelectItem value="ajuste">Ajuste</SelectItem>
                                  <SelectItem value="devolucao">Devolução</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">2. Emitente</h3>
                      <Separator className="my-2" />
                      
                      <FormField
                        control={form.control}
                        name="emitenteId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa Emitente</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o emitente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Empresa Principal Ltda</SelectItem>
                                <SelectItem value="2">Filial 01</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Selecione a empresa emitente da nota fiscal</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Aqui seriam exibidos os dados da empresa selecionada */}
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="font-medium">Dados do Emitente:</p>
                        <p>CNPJ: 12.345.678/0001-90</p>
                        <p>Razão Social: Empresa Principal Ltda</p>
                        <p>Endereço: Rua Exemplo, 123 - Centro</p>
                        <p>Cidade/UF: São Paulo/SP</p>
                      </div>
                      
                      <h3 className="text-lg font-medium mt-6">3. Destinatário</h3>
                      <Separator className="my-2" />
                      
                      <FormField
                        control={form.control}
                        name="destinatarioTipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Destinatário</FormLabel>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="pf" />
                                </FormControl>
                                <FormLabel className="font-normal">Pessoa Física</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="pj" />
                                </FormControl>
                                <FormLabel className="font-normal">Pessoa Jurídica</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="estrangeiro" />
                                </FormControl>
                                <FormLabel className="font-normal">Estrangeiro</FormLabel>
                              </FormItem>
                            </RadioGroup>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destinatarioId"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormLabel>Destinatário</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o destinatário" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Cliente Exemplo Ltda</SelectItem>
                                <SelectItem value="2">João da Silva</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                + Cadastrar novo cliente
                              </Button>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Aqui seriam exibidos os dados do destinatário selecionado */}
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="font-medium">Dados do Destinatário:</p>
                        <p>CNPJ: 98.765.432/0001-10</p>
                        <p>Razão Social: Cliente Exemplo Ltda</p>
                        <p>Endereço: Av. Cliente, 456 - Bairro Novo</p>
                        <p>Cidade/UF: Rio de Janeiro/RJ</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Aba de Produtos */}
                <TabsContent value="produtos" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">4. Produtos e Serviços</h3>
                    <Button onClick={adicionarProduto} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Produto
                    </Button>
                  </div>
                  <Separator className="my-2" />
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>NCM</TableHead>
                          <TableHead>CFOP</TableHead>
                          <TableHead>Un.</TableHead>
                          <TableHead>Qtde</TableHead>
                          <TableHead>Valor Unit.</TableHead>
                          <TableHead>Valor Total</TableHead>
                          <TableHead>ICMS</TableHead>
                          <TableHead>IPI</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {produtos.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={11} className="text-center py-4">
                              Nenhum produto adicionado. Clique em "Adicionar Produto" para incluir itens à NF-e.
                            </TableCell>
                          </TableRow>
                        ) : (
                          produtos.map((produto) => (
                            <TableRow key={produto.id}>
                              <TableCell>{produto.codigo}</TableCell>
                              <TableCell>{produto.descricao}</TableCell>
                              <TableCell>{produto.ncm}</TableCell>
                              <TableCell>{produto.cfop}</TableCell>
                              <TableCell>{produto.unidade}</TableCell>
                              <TableCell>{produto.quantidade}</TableCell>
                              <TableCell>R$ {produto.valorUnitario.toFixed(2)}</TableCell>
                              <TableCell>R$ {produto.valorTotal.toFixed(2)}</TableCell>
                              <TableCell>{produto.icmsAliquota}%</TableCell>
                              <TableCell>{produto.ipiAliquota}%</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => removerProduto(produto.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {produtos.length > 0 && (
                    <div className="flex justify-end mt-4">
                      <div className="w-80 border rounded-md p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Resumo dos Valores</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Valor dos Produtos:</span>
                            <span>R$ {totais.valorProdutos.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do Frete:</span>
                            <span>R$ {totais.valorFrete.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do Seguro:</span>
                            <span>R$ {totais.valorSeguro.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor de Desconto:</span>
                            <span>R$ {totais.valorDesconto.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do IPI:</span>
                            <span>R$ {totais.valorIPI.toFixed(2)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Valor Total da NF-e:</span>
                            <span>R$ {totais.valorTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* Aba de Transporte */}
                <TabsContent value="transporte" className="space-y-4">
                  <h3 className="text-lg font-medium">6. Transporte</h3>
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <FormField
                        control={form.control}
                        name="transporteTipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modalidade do Frete</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="emitente">0 - Por conta do Emitente</SelectItem>
                                <SelectItem value="destinatario">1 - Por conta do Destinatário</SelectItem>
                                <SelectItem value="terceiros">2 - Por conta de Terceiros</SelectItem>
                                <SelectItem value="semfrete">9 - Sem Frete</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Modalidade de frete da operação</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch('transporteTipo') !== 'semfrete' && (
                        <FormField
                          control={form.control}
                          name="transportadoraId"
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Transportadora</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a transportadora" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Transportadora Exemplar</SelectItem>
                                  <SelectItem value="2">Entrega Expressa Ltda</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                <Button variant="link" size="sm" className="p-0 h-auto">
                                  + Cadastrar nova transportadora
                                </Button>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    {form.watch('transporteTipo') !== 'semfrete' && (
                      <div>
                        <h4 className="font-medium mb-2">Informações do Veículo</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="placaVeiculo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Placa</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="ABC1234" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="ufVeiculo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>UF</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="UF" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="SP">SP</SelectItem>
                                    <SelectItem value="RJ">RJ</SelectItem>
                                    <SelectItem value="MG">MG</SelectItem>
                                    <SelectItem value="PR">PR</SelectItem>
                                    <SelectItem value="SC">SC</SelectItem>
                                    <SelectItem value="RS">RS</SelectItem>
                                    {/* Adicionar outros estados */}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="veiculo"
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Descrição do Veículo</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: Caminhão Baú" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Aba de Pagamento */}
                <TabsContent value="pagamento" className="space-y-4">
                  <h3 className="text-lg font-medium">7. Totais e Pagamento</h3>
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <FormField
                        control={form.control}
                        name="formaPagamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forma de Pagamento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="avista">À Vista</SelectItem>
                                <SelectItem value="prazo">A Prazo</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Forma de pagamento da operação</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch('formaPagamento') === 'prazo' && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Parcelas</p>
                          {/* Aqui seria implementado o controle de parcelas */}
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">
                              Configuração de parcelas a ser implementada
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="border rounded-md p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Resumo dos Valores</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Valor dos Produtos:</span>
                            <span>R$ {totais.valorProdutos.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do Frete:</span>
                            <span>R$ {totais.valorFrete.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do Seguro:</span>
                            <span>R$ {totais.valorSeguro.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor de Desconto:</span>
                            <span>R$ {totais.valorDesconto.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do IPI:</span>
                            <span>R$ {totais.valorIPI.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do ICMS:</span>
                            <span>R$ {totais.valorICMS.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do PIS:</span>
                            <span>R$ {totais.valorPIS.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor do COFINS:</span>
                            <span>R$ {totais.valorCOFINS.toFixed(2)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Valor Total da NF-e:</span>
                            <span>R$ {totais.valorTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Aba de Informações Adicionais */}
                <TabsContent value="informacoes" className="space-y-4">
                  <h3 className="text-lg font-medium">8. Informações Adicionais</h3>
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="informacoesAdicionais"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Informações Complementares</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Informações complementares que devem constar na NF-e"
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormDescription>
                            Informações adicionais de interesse do Fisco que devem constar na NF-e
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Observações para o cliente"
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormDescription>
                            Informações adicionais que serão mostradas ao cliente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => form.reset()}>
              Cancelar
            </Button>
            <Button variant="outline" size="sm" onClick={() => form.handleSubmit(onSubmit)()}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button size="sm" onClick={() => form.handleSubmit(onSubmit)()}>
              <Send className="mr-2 h-4 w-4" />
              Emitir NF-e
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmissaoNFe;