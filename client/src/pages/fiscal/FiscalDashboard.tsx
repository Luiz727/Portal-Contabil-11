import React from 'react';
import { Link } from 'wouter';
import FiscalMenu from '@/components/fiscal/FiscalMenu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileCheck, AlertCircle, Clock, BarChart2, ShoppingCart } from 'lucide-react';

const FiscalDashboard = () => {
  // Dados de exemplo para o painel
  const estatisticas = {
    notasEmitidas: 124,
    notasCanceladas: 3,
    notasDenegadas: 1,
    notasPendentes: 2,
    totalVendas: 'R$ 156.789,50',
    totalCompras: 'R$ 87.452,30',
  };

  // Lista de ações rápidas
  const acoesRapidas = [
    { nome: 'Emitir NF-e', icone: <FileText className="h-5 w-5" />, rota: '/fiscal/emissor/nfe' },
    { nome: 'Emitir NFC-e', icone: <ShoppingCart className="h-5 w-5" />, rota: '/fiscal/emissor/nfce' },
    { nome: 'Consultar Notas', icone: <FileCheck className="h-5 w-5" />, rota: '/fiscal/emissor/consultar' },
    { nome: 'Relatórios', icone: <BarChart2 className="h-5 w-5" />, rota: '/fiscal/relatorios' },
  ];

  // Notas fiscais recentes
  const notasRecentes = [
    { numero: '000000123', cliente: 'Cliente Exemplo Ltda', valor: 'R$ 1.234,56', data: '17/05/2023', status: 'Autorizada' },
    { numero: '000000124', cliente: 'Comércio Silva ME', valor: 'R$ 567,89', data: '16/05/2023', status: 'Autorizada' },
    { numero: '000000125', cliente: 'Distribuidora XYZ', valor: 'R$ 890,12', data: '15/05/2023', status: 'Cancelada' },
    { numero: '000000126', cliente: 'Supermercado ABC', valor: 'R$ 3.456,78', data: '15/05/2023', status: 'Autorizada' },
    { numero: '000000127', cliente: 'Indústria Modelo', valor: 'R$ 12.345,67', data: '14/05/2023', status: 'Autorizada' },
  ];

  // Alertas do sistema
  const alertas = [
    { titulo: 'Certificado Digital', mensagem: 'Seu certificado digital vencerá em 15 dias', tipo: 'aviso' },
    { titulo: 'Contingência', mensagem: 'Sistema da SEFAZ em contingência', tipo: 'erro' },
    { titulo: 'Atualização', mensagem: 'Nova versão do esquema XML disponível', tipo: 'info' },
  ];

  return (
    <div className="container mx-auto py-6">
      <FiscalMenu />
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notas Emitidas</CardTitle>
            <FileCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.notasEmitidas}</div>
            <p className="text-xs text-muted-foreground">+7% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notas Canceladas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.notasCanceladas}</div>
            <p className="text-xs text-muted-foreground">-2% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total em Vendas</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalVendas}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total em Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalCompras}</div>
            <p className="text-xs text-muted-foreground">+5% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="recentes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recentes">Notas Recentes</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="contingencia">Em Contingência</TabsTrigger>
            </TabsList>
            <TabsContent value="recentes">
              <Card>
                <CardHeader>
                  <CardTitle>Notas Fiscais Recentes</CardTitle>
                  <CardDescription>Últimas notas fiscais emitidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left font-medium">Número</th>
                          <th className="py-2 px-4 text-left font-medium">Cliente</th>
                          <th className="py-2 px-4 text-left font-medium">Valor</th>
                          <th className="py-2 px-4 text-left font-medium">Data</th>
                          <th className="py-2 px-4 text-left font-medium">Status</th>
                          <th className="py-2 px-4 text-left font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notasRecentes.map((nota, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                            <td className="py-2 px-4">{nota.numero}</td>
                            <td className="py-2 px-4">{nota.cliente}</td>
                            <td className="py-2 px-4">{nota.valor}</td>
                            <td className="py-2 px-4">{nota.data}</td>
                            <td className="py-2 px-4">
                              <span 
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  nota.status === 'Autorizada' 
                                    ? 'bg-green-100 text-green-800' 
                                    : nota.status === 'Cancelada' 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {nota.status}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  Visualizar
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Imprimir
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-3">
                  <Button variant="ghost" size="sm">
                    Ver relatórios
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver todas as notas
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="pendentes">
              <Card>
                <CardHeader>
                  <CardTitle>Notas Pendentes</CardTitle>
                  <CardDescription>Notas aguardando ações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">Nenhuma nota pendente no momento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contingencia">
              <Card>
                <CardHeader>
                  <CardTitle>Em Contingência</CardTitle>
                  <CardDescription>Notas emitidas em contingência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <p className="text-muted-foreground">Nenhuma nota em contingência</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às funcionalidades mais utilizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {acoesRapidas.map((acao, index) => (
                  <Link href={acao.rota} key={index}>
                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center pt-6">
                        <div className="mb-4 p-2 bg-primary/10 rounded-full">
                          {acao.icone}
                        </div>
                        <h3 className="text-center font-medium">{acao.nome}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas e Notificações</CardTitle>
              <CardDescription>Alertas importantes do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertas.map((alerta, index) => (
                  <div key={index} className={`p-3 rounded-md border ${
                    alerta.tipo === 'erro' ? 'bg-red-50 border-red-200' : 
                    alerta.tipo === 'aviso' ? 'bg-yellow-50 border-yellow-200' : 
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <h4 className="font-medium mb-1">{alerta.titulo}</h4>
                    <p className="text-sm">{alerta.mensagem}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                Ver todos os alertas
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status dos Serviços</CardTitle>
              <CardDescription>Status dos serviços da SEFAZ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Autorização NF-e</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Consulta Destinatário</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Carta de Correção</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SEFAZ São Paulo</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Instável
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SEFAZ Minas Gerais</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                Verificar status
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Certificado Digital</CardTitle>
              <CardDescription>Informações do certificado digital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Empresa:</span>
                  <span className="text-sm">Empresa Principal Ltda</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Validade:</span>
                  <span className="text-sm">15/08/2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Dias restantes:</span>
                  <span className="text-sm text-yellow-600 font-medium">15 dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tipo:</span>
                  <span className="text-sm">A1</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Gerenciar certificados
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FiscalDashboard;