import React, { useState } from 'react';
import FiscalMenu from '@/components/fiscal/FiscalMenu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Upload, Download, FileDigit, Calendar as CalendarIcon, AlertTriangle, Shield, LucideShieldCheck, Info, RefreshCcw, Plus } from 'lucide-react';

type Certificado = {
  id: string;
  nome: string;
  emissor: string;
  cnpj: string;
  dataEmissao: Date;
  dataValidade: Date;
  tipo: string;
  arquivo: string;
  ativo: boolean;
};

const CertificadoDigital = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([
    {
      id: '1',
      nome: 'Certificado A1 - Empresa Principal',
      emissor: 'AC EXEMPLO CERTIFICADORA',
      cnpj: '12.345.678/0001-90',
      dataEmissao: new Date('2023-01-01'),
      dataValidade: new Date('2024-01-01'),
      tipo: 'A1',
      arquivo: 'certificado_empresa.pfx',
      ativo: true
    },
    {
      id: '2',
      nome: 'Certificado A1 - Filial 01',
      emissor: 'AC EXEMPLO CERTIFICADORA',
      cnpj: '12.345.678/0002-71',
      dataEmissao: new Date('2023-02-15'),
      dataValidade: new Date('2024-02-15'),
      tipo: 'A1',
      arquivo: 'certificado_filial.pfx',
      ativo: false
    }
  ]);

  const [novoCertificado, setNovoCertificado] = useState<{
    nome: string;
    senha: string;
    dataValidade: Date | undefined;
    arquivo: File | null;
  }>({
    nome: '',
    senha: '',
    dataValidade: undefined,
    arquivo: null
  });

  const [certificadoSelecionado, setCertificadoSelecionado] = useState<Certificado | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNovoCertificado({
        ...novoCertificado,
        arquivo: e.target.files[0]
      });
    }
  };

  const handleAdicionarCertificado = () => {
    if (!novoCertificado.arquivo || !novoCertificado.nome || !novoCertificado.senha || !novoCertificado.dataValidade) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    // Aqui seria feita uma chamada para a API para enviar o certificado
    console.log('Enviando certificado:', novoCertificado);

    // Simular adição do certificado
    const novoCert: Certificado = {
      id: String(certificados.length + 1),
      nome: novoCertificado.nome,
      emissor: 'AC CERTIFICADORA (Detectado automaticamente)',
      cnpj: '12.345.678/0001-90 (Detectado automaticamente)',
      dataEmissao: new Date(),
      dataValidade: novoCertificado.dataValidade,
      tipo: 'A1',
      arquivo: novoCertificado.arquivo.name,
      ativo: false
    };

    setCertificados([...certificados, novoCert]);

    // Limpar o formulário
    setNovoCertificado({
      nome: '',
      senha: '',
      dataValidade: undefined,
      arquivo: null
    });
  };

  const handleToggleAtivo = (id: string) => {
    setCertificados(certificados.map(cert => {
      if (cert.id === id) {
        return { ...cert, ativo: !cert.ativo };
      }
      return cert;
    }));
  };

  const handleRemoverCertificado = (id: string) => {
    if (confirm('Tem certeza que deseja remover este certificado?')) {
      setCertificados(certificados.filter(cert => cert.id !== id));
    }
  };

  const handleDetalhes = (certificado: Certificado) => {
    setCertificadoSelecionado(certificado);
  };

  const diasParaVencer = (data: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(dataFim.getTime() - hoje.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const certificadoStatus = (dataValidade: Date) => {
    const hoje = new Date();
    
    if (isBefore(dataValidade, hoje)) {
      return { status: 'expirado', color: 'bg-red-100 text-red-800' };
    }
    
    const diasFaltando = diasParaVencer(dataValidade);
    
    if (diasFaltando <= 30) {
      return { status: 'expirando', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    return { status: 'válido', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="container mx-auto py-6">
      <FiscalMenu activeSection="ajustes" />
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Certificados Digitais
              </CardTitle>
              <CardDescription>
                Gerencie os certificados digitais para emissão de documentos fiscais
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Verificar Validade
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Certificado
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="listagem">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="listagem">Certificados Cadastrados</TabsTrigger>
              <TabsTrigger value="adicionar">Adicionar Certificado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listagem">
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Certifique-se de que o certificado digital esteja válido antes de emitir documentos fiscais.
                </AlertDescription>
              </Alert>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Emissor</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificados.map((certificado) => {
                      const { status, color } = certificadoStatus(certificado.dataValidade);
                      
                      return (
                        <TableRow key={certificado.id}>
                          <TableCell>
                            <div className="font-medium">{certificado.nome}</div>
                            <div className="text-xs text-muted-foreground">Tipo: {certificado.tipo}</div>
                          </TableCell>
                          <TableCell>{certificado.cnpj}</TableCell>
                          <TableCell>{certificado.emissor}</TableCell>
                          <TableCell>{format(certificado.dataValidade, 'dd/MM/yyyy')}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                              {status === 'válido' && `Válido (${diasParaVencer(certificado.dataValidade)} dias)`}
                              {status === 'expirando' && `Expirando em ${diasParaVencer(certificado.dataValidade)} dias`}
                              {status === 'expirado' && 'Expirado'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Checkbox 
                              checked={certificado.ativo}
                              onCheckedChange={() => handleToggleAtivo(certificado.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDetalhes(certificado)}
                              >
                                Detalhes
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoverCertificado(certificado.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remover
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {certificados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Nenhum certificado cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {certificadoSelecionado && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Detalhes do Certificado</CardTitle>
                    <CardDescription>Informações do certificado selecionado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Informações Básicas</h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Nome:</span>
                            <span className="col-span-2">{certificadoSelecionado.nome}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="font-medium">CNPJ:</span>
                            <span className="col-span-2">{certificadoSelecionado.cnpj}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Emissor:</span>
                            <span className="col-span-2">{certificadoSelecionado.emissor}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Tipo:</span>
                            <span className="col-span-2">{certificadoSelecionado.tipo}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-medium mt-4 mb-2">Arquivo</h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Nome do arquivo:</span>
                            <span className="col-span-2">{certificadoSelecionado.arquivo}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Validade</h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Data de emissão:</span>
                            <span className="col-span-2">{format(certificadoSelecionado.dataEmissao, 'dd/MM/yyyy')}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Data de validade:</span>
                            <span className="col-span-2">{format(certificadoSelecionado.dataValidade, 'dd/MM/yyyy')}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Dias restantes:</span>
                            <span className="col-span-2">
                              {isBefore(certificadoSelecionado.dataValidade, new Date()) 
                                ? <span className="text-red-500">Certificado expirado</span>
                                : `${diasParaVencer(certificadoSelecionado.dataValidade)} dias`
                              }
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="font-medium mt-4 mb-2">Status</h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-3">
                            <span className="font-medium">Status:</span>
                            <span className="col-span-2">
                              {certificadoSelecionado.ativo 
                                ? <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                                : <Badge variant="outline">Inativo</Badge>
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4">
                    <Button variant="outline" onClick={() => setCertificadoSelecionado(null)}>
                      Fechar
                    </Button>
                    {certificadoSelecionado.ativo ? (
                      <Button variant="default" onClick={() => handleToggleAtivo(certificadoSelecionado.id)}>
                        Desativar Certificado
                      </Button>
                    ) : (
                      <Button variant="default" onClick={() => handleToggleAtivo(certificadoSelecionado.id)}>
                        Ativar Certificado
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="adicionar">
              <div className="space-y-4">
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Importante</AlertTitle>
                  <AlertDescription>
                    Utilize apenas certificados do tipo A1 (.pfx ou .p12). O certificado deve estar em nome da empresa emitente.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nomeCertificado">Nome do Certificado</Label>
                      <Input
                        id="nomeCertificado"
                        placeholder="Ex: Certificado A1 - Empresa Principal"
                        value={novoCertificado.nome}
                        onChange={(e) => setNovoCertificado({...novoCertificado, nome: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Nome para identificação do certificado no sistema
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="senhaCertificado">Senha do Certificado</Label>
                      <Input
                        id="senhaCertificado"
                        type="password"
                        placeholder="Digite a senha do certificado"
                        value={novoCertificado.senha}
                        onChange={(e) => setNovoCertificado({...novoCertificado, senha: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        A senha será criptografada e utilizada apenas para comunicação com a SEFAZ
                      </p>
                    </div>
                    
                    <div>
                      <Label>Data de Validade</Label>
                      <div className="flex mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {novoCertificado.dataValidade ? (
                                format(novoCertificado.dataValidade, 'dd/MM/yyyy')
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={novoCertificado.dataValidade}
                              onSelect={(date) => setNovoCertificado({...novoCertificado, dataValidade: date})}
                              disabled={(date) => isBefore(date, new Date())}
                              initialFocus
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Data de validade do certificado
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="arquivoCertificado">Arquivo do Certificado</Label>
                      <div className="flex items-center mt-1">
                        <Input
                          id="arquivoCertificado"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pfx,.p12"
                        />
                        <div className="flex w-full">
                          <Input
                            value={novoCertificado.arquivo ? novoCertificado.arquivo.name : ''}
                            readOnly
                            placeholder="Nenhum arquivo selecionado"
                            className="rounded-r-none"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => document.getElementById('arquivoCertificado')?.click()}
                            className="rounded-l-none"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Selecionar
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Arquivo do certificado digital no formato PFX ou P12
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Instruções</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">1. Prepare seu certificado</h4>
                        <p className="text-sm text-muted-foreground">
                          Certifique-se de ter o arquivo do certificado A1 (.pfx ou .p12) e a senha de acesso.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">2. Preencha os dados</h4>
                        <p className="text-sm text-muted-foreground">
                          Informe um nome para identificação, a senha do certificado e a data de validade.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">3. Faça o upload do arquivo</h4>
                        <p className="text-sm text-muted-foreground">
                          Selecione o arquivo do certificado para upload.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">4. Cadastre o certificado</h4>
                        <p className="text-sm text-muted-foreground">
                          Clique em "Adicionar Certificado" para concluir o cadastro.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h4 className="font-medium flex items-center">
                          <Info className="h-4 w-4 mr-2 text-blue-500" />
                          Uso do Certificado
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          O certificado cadastrado será utilizado para assinatura digital e comunicação com a SEFAZ.
                          A senha é armazenada de forma segura e utilizada apenas no momento da comunicação.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex items-center">
            <LucideShieldCheck className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm">
              O sistema suporta certificados A1 no formato PFX ou P12
            </span>
          </div>
          
          {/* Botão condicionado à aba ativa */}
          <Tabs defaultValue="listagem" className="hidden">
            <TabsContent value="adicionar">
              <Button onClick={handleAdicionarCertificado}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Certificado
              </Button>
            </TabsContent>
          </Tabs>
          
          <Button onClick={handleAdicionarCertificado}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Certificado
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CertificadoDigital;