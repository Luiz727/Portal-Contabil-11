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
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Save, Building, Upload, Download } from 'lucide-react';

// Esquema de validação para o formulário de configuração da empresa
const empresaSchema = z.object({
  // Dados gerais
  razaoSocial: z.string().min(1, 'A razão social é obrigatória'),
  nomeFantasia: z.string().min(1, 'O nome fantasia é obrigatório'),
  cnpj: z.string().min(14, 'O CNPJ deve ter 14 dígitos'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  regimeTributario: z.enum(['simples', 'presumido', 'real', 'mei']),
  cnae: z.string().min(1, 'O CNAE é obrigatório'),
  
  // Endereço
  cep: z.string().min(8, 'O CEP deve ter 8 dígitos'),
  logradouro: z.string().min(1, 'O logradouro é obrigatório'),
  numero: z.string().min(1, 'O número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'O bairro é obrigatório'),
  cidade: z.string().min(1, 'A cidade é obrigatória'),
  uf: z.string().min(2, 'A UF é obrigatória'),
  codigoMunicipio: z.string().min(1, 'O código do município é obrigatório'),
  
  // Contato
  telefone: z.string().min(10, 'O telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('E-mail inválido'),
  contato: z.string().optional(),
  
  // Configurações fiscais
  ambiente: z.enum(['producao', 'homologacao']),
  versaoNFe: z.string().min(1, 'A versão da NF-e é obrigatória'),
  tipoEmissao: z.enum(['normal', 'contingencia']),
  serieNFe: z.string().min(1, 'A série da NF-e é obrigatória'),
  serieNFCe: z.string().min(1, 'A série da NFC-e é obrigatória'),
  
  // Certificado Digital
  certificadoArquivo: z.string().optional(),
  certificadoSenha: z.string().optional(),
  certificadoValidade: z.string().optional(),
  
  // Sefaz
  horasContingencia: z.string().min(1, 'As horas em contingência são obrigatórias'),
  comErroContingencia: z.boolean(),
  usarSefazLocal: z.boolean(),
  
  // Logo
  logoMarca: z.string().optional(),
});

const ConfiguracaoEmpresa = () => {
  const [certificadoUpload, setCertificadoUpload] = useState<File | null>(null);
  const [logoUpload, setLogoUpload] = useState<File | null>(null);

  // Inicialização do formulário
  const form = useForm<z.infer<typeof empresaSchema>>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      razaoSocial: 'Empresa Principal Ltda',
      nomeFantasia: 'Empresa Principal',
      cnpj: '12345678000190',
      inscricaoEstadual: '123456789',
      inscricaoMunicipal: '98765432',
      regimeTributario: 'simples',
      cnae: '6202300',
      
      cep: '01234567',
      logradouro: 'Avenida Principal',
      numero: '1000',
      complemento: 'Sala 123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      codigoMunicipio: '3550308',
      
      telefone: '1122334455',
      email: 'contato@empresaprincipal.com.br',
      contato: 'Responsável Fiscal',
      
      ambiente: 'homologacao',
      versaoNFe: '4.00',
      tipoEmissao: 'normal',
      serieNFe: '1',
      serieNFCe: '2',
      
      certificadoArquivo: 'certificado.pfx',
      certificadoValidade: '2023-12-31',
      
      horasContingencia: '24',
      comErroContingencia: true,
      usarSefazLocal: false,
    },
  });

  // Função para enviar o formulário
  const onSubmit = (data: z.infer<typeof empresaSchema>) => {
    console.log('Configurações da empresa salvas:', data);
    
    // Aqui seria feita a chamada para a API
    // apiRequest.post('/api/fiscal/empresas', data)
    //   .then(response => {
    //     console.log('Empresa configurada com sucesso', response);
    //   })
    //   .catch(error => {
    //     console.error('Erro ao configurar empresa', error);
    //   });
  };

  const handleCertificadoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificadoUpload(e.target.files[0]);
      form.setValue('certificadoArquivo', e.target.files[0].name);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoUpload(e.target.files[0]);
      form.setValue('logoMarca', e.target.files[0].name);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <FiscalMenu activeSection="ajustes" />
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Configuração da Empresa Emissora
              </CardTitle>
              <CardDescription>
                Configure os dados da empresa emitente de documentos fiscais
              </CardDescription>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="dados-gerais">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                  <TabsTrigger value="configuracoes-fiscais">Config. Fiscais</TabsTrigger>
                  <TabsTrigger value="certificado">Certificado Digital</TabsTrigger>
                  <TabsTrigger value="personalizacao">Personalização</TabsTrigger>
                </TabsList>
                
                {/* Aba de Dados Gerais */}
                <TabsContent value="dados-gerais" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <FormField
                        control={form.control}
                        name="razaoSocial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Razão Social</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Nome oficial da empresa no CNPJ</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="nomeFantasia"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Nome Fantasia</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Nome comercial da empresa</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>CNPJ</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>CNPJ da empresa (apenas números)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <FormField
                        control={form.control}
                        name="inscricaoEstadual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inscrição Estadual</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Inscrição estadual da empresa</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="inscricaoMunicipal"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Inscrição Municipal</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Inscrição municipal da empresa</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="regimeTributario"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Regime Tributário</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o regime" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="simples">Simples Nacional</SelectItem>
                                <SelectItem value="presumido">Lucro Presumido</SelectItem>
                                <SelectItem value="real">Lucro Real</SelectItem>
                                <SelectItem value="mei">MEI</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Regime tributário da empresa</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cnae"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>CNAE</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Código CNAE principal</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="contato"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável Fiscal</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Nome do responsável fiscal da empresa</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Aba de Endereço */}
                <TabsContent value="endereco" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="logradouro"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Logradouro</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="numero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="complemento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="uf"
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
                                  <SelectItem value="AC">AC</SelectItem>
                                  <SelectItem value="AL">AL</SelectItem>
                                  <SelectItem value="AP">AP</SelectItem>
                                  <SelectItem value="AM">AM</SelectItem>
                                  <SelectItem value="BA">BA</SelectItem>
                                  <SelectItem value="CE">CE</SelectItem>
                                  <SelectItem value="DF">DF</SelectItem>
                                  <SelectItem value="ES">ES</SelectItem>
                                  <SelectItem value="GO">GO</SelectItem>
                                  <SelectItem value="MA">MA</SelectItem>
                                  <SelectItem value="MT">MT</SelectItem>
                                  <SelectItem value="MS">MS</SelectItem>
                                  <SelectItem value="MG">MG</SelectItem>
                                  <SelectItem value="PA">PA</SelectItem>
                                  <SelectItem value="PB">PB</SelectItem>
                                  <SelectItem value="PR">PR</SelectItem>
                                  <SelectItem value="PE">PE</SelectItem>
                                  <SelectItem value="PI">PI</SelectItem>
                                  <SelectItem value="RJ">RJ</SelectItem>
                                  <SelectItem value="RN">RN</SelectItem>
                                  <SelectItem value="RS">RS</SelectItem>
                                  <SelectItem value="RO">RO</SelectItem>
                                  <SelectItem value="RR">RR</SelectItem>
                                  <SelectItem value="SC">SC</SelectItem>
                                  <SelectItem value="SP">SP</SelectItem>
                                  <SelectItem value="SE">SE</SelectItem>
                                  <SelectItem value="TO">TO</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="codigoMunicipio"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Código do Município (IBGE)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Código IBGE do município</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Telefone da empresa</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>E-mail de contato</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Aba de Configurações Fiscais */}
                <TabsContent value="configuracoes-fiscais" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <FormField
                        control={form.control}
                        name="ambiente"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Ambiente de Emissão</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="producao" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Produção
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="homologacao" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Homologação (Testes)
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Ambiente onde serão emitidos os documentos fiscais
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="versaoNFe"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Versão da NF-e</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a versão" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="4.00">4.00</SelectItem>
                                <SelectItem value="3.10">3.10</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Versão do esquema XML da NF-e</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tipoEmissao"
                        render={({ field }) => (
                          <FormItem className="space-y-3 mt-4">
                            <FormLabel>Tipo de Emissão</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="normal" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Normal
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="contingencia" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Contingência
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Modo de emissão dos documentos fiscais
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="serieNFe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Série da NF-e</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>Série da NF-e</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="serieNFCe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Série da NFC-e</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>Série da NFC-e</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="horasContingencia"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Horas em Contingência</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Número de horas para manter o sistema em contingência após falha da SEFAZ
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="comErroContingencia"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Entrar em contingência automaticamente
                              </FormLabel>
                              <FormDescription>
                                Entrar em contingência quando ocorrer erro na comunicação com a SEFAZ
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="usarSefazLocal"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Usar SEFAZ local
                              </FormLabel>
                              <FormDescription>
                                Usar serviço local em vez do serviço nacional da SEFAZ
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Aba de Certificado Digital */}
                <TabsContent value="certificado" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Certificado Digital</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            id="certificado"
                            className="hidden"
                            onChange={handleCertificadoUpload}
                            accept=".pfx,.p12"
                          />
                          <Input
                            value={form.watch('certificadoArquivo') || ''}
                            readOnly
                            className="flex-1"
                            placeholder="Nenhum certificado selecionado"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('certificado')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Selecionar
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Certificado digital tipo A1 no formato PFX
                        </p>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="certificadoSenha"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Senha do Certificado</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Senha do certificado digital</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="certificadoValidade"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Validade do Certificado</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>Data de validade do certificado</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">Informações do Certificado</h3>
                      
                      {certificadoUpload ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-green-600">
                            <Check className="h-5 w-5 mr-2" />
                            <span>Certificado válido</span>
                          </div>
                          
                          <div className="space-y-1 mt-4">
                            <div className="grid grid-cols-3">
                              <span className="font-medium">Nome:</span>
                              <span className="col-span-2">Certificado A1 - Empresa Principal</span>
                            </div>
                            <div className="grid grid-cols-3">
                              <span className="font-medium">Emitido para:</span>
                              <span className="col-span-2">EMPRESA PRINCIPAL LTDA</span>
                            </div>
                            <div className="grid grid-cols-3">
                              <span className="font-medium">CNPJ:</span>
                              <span className="col-span-2">12.345.678/0001-90</span>
                            </div>
                            <div className="grid grid-cols-3">
                              <span className="font-medium">Emitido por:</span>
                              <span className="col-span-2">AC EXEMPLO CERTIFICADORA</span>
                            </div>
                            <div className="grid grid-cols-3">
                              <span className="font-medium">Validade:</span>
                              <span className="col-span-2">31/12/2023</span>
                            </div>
                            <div className="grid grid-cols-3">
                              <span className="font-medium">Tipo:</span>
                              <span className="col-span-2">A1</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40">
                          <p className="text-muted-foreground">
                            Nenhum certificado selecionado ou certificado inválido
                          </p>
                          <Button
                            className="mt-4"
                            variant="outline"
                            onClick={() => document.getElementById('certificado')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Selecionar Certificado
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Aba de Personalização */}
                <TabsContent value="personalizacao" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Logo da Empresa</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            id="logo"
                            className="hidden"
                            onChange={handleLogoUpload}
                            accept="image/*"
                          />
                          <Input
                            value={form.watch('logoMarca') || ''}
                            readOnly
                            className="flex-1"
                            placeholder="Nenhuma imagem selecionada"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Selecionar
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Logo da empresa para impressão em documentos (DANFE, etc.)
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium">Configurações de Impressão</h3>
                        <Separator className="my-2" />
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Mostrar ICMS desonerado</h4>
                              <p className="text-sm text-muted-foreground">
                                Exibir valor do ICMS desonerado no DANFE
                              </p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Imprimir dados do frete</h4>
                              <p className="text-sm text-muted-foreground">
                                Exibir informações de transporte no DANFE
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Exibir nome do produto antes do código</h4>
                              <p className="text-sm text-muted-foreground">
                                Trocar a ordem de exibição dos dados do produto
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="border rounded-md p-4 flex items-center justify-center" style={{ height: '250px' }}>
                        {logoUpload ? (
                          <div className="text-center">
                            <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center h-48 mb-2">
                              <img
                                src={URL.createObjectURL(logoUpload)}
                                alt="Logo da empresa"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Pré-visualização da logo
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center h-48 mb-2">
                              <Building className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Nenhuma logo selecionada
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium">Exportação e Backup</h3>
                        <Separator className="my-2" />
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          Exporte as configurações fiscais ou faça backup dos seus dados
                        </p>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar Configurações
                          </Button>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Backup Completo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfiguracaoEmpresa;