import React, { useState } from 'react';
import FiscalMenu from '@/components/fiscal/FiscalMenu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Search, Download, Printer, Eye, CalendarIcon, FileDigit, RefreshCcw, Filter, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

type DocFiscal = {
  id: string;
  tipo: 'NFe' | 'NFCe' | 'NFSe' | 'CTe' | 'MDFe';
  numero: string;
  serie: string;
  dataEmissao: Date;
  cliente: string;
  valor: number;
  chaveAcesso: string;
  status: 'autorizado' | 'cancelado' | 'denegado' | 'inutilizado' | 'pendente';
};

const StatusBadge = ({ status }: { status: DocFiscal['status'] }) => {
  const statusConfig = {
    autorizado: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    cancelado: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3 mr-1" /> },
    denegado: { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> },
    inutilizado: { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="h-3 w-3 mr-1" /> },
    pendente: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ConsultarDocumentos = () => {
  const [filtros, setFiltros] = useState({
    tipo: '',
    dataInicio: undefined as Date | undefined,
    dataFim: undefined as Date | undefined,
    cliente: '',
    status: '',
    numero: '',
    chaveAcesso: '',
  });

  const [documentos, setDocumentos] = useState<DocFiscal[]>([
    {
      id: '1',
      tipo: 'NFe',
      numero: '000000123',
      serie: '1',
      dataEmissao: new Date('2023-05-15'),
      cliente: 'Cliente Exemplo Ltda',
      valor: 1234.56,
      chaveAcesso: '35230512345678000190550010000001231000001231',
      status: 'autorizado',
    },
    {
      id: '2',
      tipo: 'NFe',
      numero: '000000124',
      serie: '1',
      dataEmissao: new Date('2023-05-14'),
      cliente: 'Comércio Silva ME',
      valor: 567.89,
      chaveAcesso: '35230512345678000190550010000001241000001241',
      status: 'autorizado',
    },
    {
      id: '3',
      tipo: 'NFCe',
      numero: '000000125',
      serie: '2',
      dataEmissao: new Date('2023-05-14'),
      cliente: 'Consumidor Final',
      valor: 89.90,
      chaveAcesso: '35230512345678000190650020000001251000001251',
      status: 'cancelado',
    },
    {
      id: '4',
      tipo: 'NFSe',
      numero: '000000001',
      serie: '1',
      dataEmissao: new Date('2023-05-13'),
      cliente: 'Empresa ABC Serviços',
      valor: 1500.00,
      chaveAcesso: '',
      status: 'autorizado',
    },
    {
      id: '5',
      tipo: 'CTe',
      numero: '000000010',
      serie: '1',
      dataEmissao: new Date('2023-05-12'),
      cliente: 'Transportadora XYZ',
      valor: 350.00,
      chaveAcesso: '35230512345678000190570010000000101000000101',
      status: 'autorizado',
    },
  ]);

  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocFiscal | null>(null);

  const handleFiltroChange = (campo: string, valor: any) => {
    setFiltros({
      ...filtros,
      [campo]: valor,
    });
  };

  const handleBuscar = () => {
    // Aqui seria feita uma chamada para a API com os filtros
    console.log('Buscando documentos com filtros:', filtros);
  };

  const handleLimparFiltros = () => {
    setFiltros({
      tipo: '',
      dataInicio: undefined,
      dataFim: undefined,
      cliente: '',
      status: '',
      numero: '',
      chaveAcesso: '',
    });
  };

  const handleVisualizarDocumento = (documento: DocFiscal) => {
    setDocumentoSelecionado(documento);
  };

  const getDocumentoIcon = (tipo: DocFiscal['tipo']) => {
    switch (tipo) {
      case 'NFe':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'NFCe':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'NFSe':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'CTe':
        return <FileDigit className="h-4 w-4 text-yellow-500" />;
      case 'MDFe':
        return <FileDigit className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filtrarDocumentos = () => {
    return documentos.filter(doc => {
      if (filtros.tipo && doc.tipo !== filtros.tipo) return false;
      if (filtros.numero && !doc.numero.includes(filtros.numero)) return false;
      if (filtros.cliente && !doc.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) return false;
      if (filtros.status && doc.status !== filtros.status) return false;
      if (filtros.chaveAcesso && !doc.chaveAcesso.includes(filtros.chaveAcesso)) return false;
      
      if (filtros.dataInicio && filtros.dataFim) {
        const dataDoc = new Date(doc.dataEmissao);
        return dataDoc >= filtros.dataInicio && dataDoc <= filtros.dataFim;
      }
      
      return true;
    });
  };

  const documentosFiltrados = filtrarDocumentos();

  return (
    <div className="container mx-auto py-6">
      <FiscalMenu activeSection="emissor" />
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Consultar Documentos Fiscais
              </CardTitle>
              <CardDescription>
                Consulte e gerencie documentos fiscais emitidos
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleLimparFiltros}>
                Limpar Filtros
              </Button>
              <Button size="sm" onClick={handleBuscar}>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="consulta">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consulta">Consulta Geral</TabsTrigger>
              <TabsTrigger value="chave">Consulta por Chave</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="consulta" className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                  <Select 
                    value={filtros.tipo} 
                    onValueChange={(value) => handleFiltroChange('tipo', value)}
                  >
                    <SelectTrigger id="tipoDocumento">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os tipos</SelectItem>
                      <SelectItem value="NFe">NFe</SelectItem>
                      <SelectItem value="NFCe">NFCe</SelectItem>
                      <SelectItem value="NFSe">NFSe</SelectItem>
                      <SelectItem value="CTe">CTe</SelectItem>
                      <SelectItem value="MDFe">MDFe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtros.dataInicio ? (
                          format(filtros.dataInicio, 'dd/MM/yyyy')
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filtros.dataInicio}
                        onSelect={(date) => handleFiltroChange('dataInicio', date)}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtros.dataFim ? (
                          format(filtros.dataFim, 'dd/MM/yyyy')
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filtros.dataFim}
                        onSelect={(date) => handleFiltroChange('dataFim', date)}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="statusDocumento">Status</Label>
                  <Select 
                    value={filtros.status} 
                    onValueChange={(value) => handleFiltroChange('status', value)}
                  >
                    <SelectTrigger id="statusDocumento">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="autorizado">Autorizado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="denegado">Denegado</SelectItem>
                      <SelectItem value="inutilizado">Inutilizado</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numeroDocumento">Número</Label>
                  <Input
                    id="numeroDocumento"
                    placeholder="Digite o número"
                    value={filtros.numero}
                    onChange={(e) => handleFiltroChange('numero', e.target.value)}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="clienteDocumento">Cliente</Label>
                  <Input
                    id="clienteDocumento"
                    placeholder="Digite o nome do cliente"
                    value={filtros.cliente}
                    onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Data Emissão</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentosFiltrados.length > 0 ? (
                      documentosFiltrados.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getDocumentoIcon(doc.tipo)}
                              <span className="ml-2">{doc.tipo}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{doc.numero}</div>
                            <div className="text-xs text-muted-foreground">Série: {doc.serie}</div>
                          </TableCell>
                          <TableCell>{format(doc.dataEmissao, 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{doc.cliente}</TableCell>
                          <TableCell>{doc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          <TableCell>
                            <StatusBadge status={doc.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleVisualizarDocumento(doc)}
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Download XML"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Imprimir DANFE"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Nenhum documento encontrado com os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="chave" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chaveAcesso">Chave de Acesso</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="chaveAcesso"
                      placeholder="Digite a chave de acesso"
                      value={filtros.chaveAcesso}
                      onChange={(e) => handleFiltroChange('chaveAcesso', e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleBuscar}>
                      <Search className="mr-2 h-4 w-4" />
                      Consultar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Digite a chave de acesso completa (44 dígitos)
                  </p>
                </div>
                
                <div className="rounded-md border p-4 space-y-4">
                  {filtros.chaveAcesso ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Resultado da Consulta</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tipo de Documento</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">NF-e (Nota Fiscal Eletrônica)</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Status</Label>
                          <div className="mt-1">
                            <StatusBadge status="autorizado" />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Número / Série</Label>
                          <div className="font-medium mt-1">000000123 / 1</div>
                        </div>
                        
                        <div>
                          <Label>Data de Emissão</Label>
                          <div className="font-medium mt-1">15/05/2023 14:30:45</div>
                        </div>
                        
                        <div>
                          <Label>Emitente</Label>
                          <div className="font-medium mt-1">Empresa Principal Ltda</div>
                          <div className="text-sm text-muted-foreground">CNPJ: 12.345.678/0001-90</div>
                        </div>
                        
                        <div>
                          <Label>Destinatário</Label>
                          <div className="font-medium mt-1">Cliente Exemplo Ltda</div>
                          <div className="text-sm text-muted-foreground">CNPJ: 98.765.432/0001-10</div>
                        </div>
                        
                        <div>
                          <Label>Valor Total</Label>
                          <div className="font-medium mt-1">R$ 1.234,56</div>
                        </div>
                        
                        <div>
                          <Label>Protocolo</Label>
                          <div className="font-medium mt-1">123456789012345</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex space-x-2">
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar DANFE
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download XML
                        </Button>
                        <Button variant="outline">
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        Digite a chave de acesso para consultar um documento fiscal
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="eventos" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="chaveAcessoEvento">Chave de Acesso</Label>
                  <Input
                    id="chaveAcessoEvento"
                    placeholder="Digite a chave de acesso"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipoEvento">Tipo de Evento</Label>
                  <Select>
                    <SelectTrigger id="tipoEvento" className="mt-1">
                      <SelectValue placeholder="Selecione o tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cancelamento">Cancelamento</SelectItem>
                      <SelectItem value="ccePdf">Carta de Correção</SelectItem>
                      <SelectItem value="manifestacaoDestinatario">Manifestação do Destinatário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Consultar Eventos
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border p-6 mt-4">
                <div className="flex flex-col items-center justify-center">
                  <RefreshCcw className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Consulte eventos relacionados a documentos fiscais (cancelamentos, cartas de correção, etc.)
                  </p>
                  <Button variant="outline" className="mt-4">
                    Consultar Eventos
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Modal de Detalhes do Documento */}
          {documentoSelecionado && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Detalhes do Documento</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDocumentoSelecionado(null)}
                    >
                      &times;
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Documento</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getDocumentoIcon(documentoSelecionado.tipo)}
                        <span className="font-medium">{documentoSelecionado.tipo}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        <StatusBadge status={documentoSelecionado.status} />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Número / Série</Label>
                      <div className="font-medium mt-1">{documentoSelecionado.numero} / {documentoSelecionado.serie}</div>
                    </div>
                    
                    <div>
                      <Label>Data de Emissão</Label>
                      <div className="font-medium mt-1">{format(documentoSelecionado.dataEmissao, 'dd/MM/yyyy')}</div>
                    </div>
                    
                    <div>
                      <Label>Cliente</Label>
                      <div className="font-medium mt-1">{documentoSelecionado.cliente}</div>
                    </div>
                    
                    <div>
                      <Label>Valor Total</Label>
                      <div className="font-medium mt-1">
                        {documentoSelecionado.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                    
                    {documentoSelecionado.chaveAcesso && (
                      <div className="col-span-2">
                        <Label>Chave de Acesso</Label>
                        <div className="font-mono bg-gray-100 p-2 rounded mt-1 text-sm break-all">
                          {documentoSelecionado.chaveAcesso}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 mt-6">
                    <h3 className="font-medium mb-2">Ações</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar DANFE
                      </Button>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download XML
                      </Button>
                      <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </Button>
                      
                      {documentoSelecionado.status === 'autorizado' && (
                        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <div>
            <span className="text-sm">
              Total de documentos: <strong>{documentosFiltrados.length}</strong>
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar Resultado
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConsultarDocumentos;