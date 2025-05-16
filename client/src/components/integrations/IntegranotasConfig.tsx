import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Schema de validação para as configurações do Integranotas
const integranotasSchema = z.object({
  apiKey: z.string().min(1, { message: "Chave de API é obrigatória" }),
  apiTokenId: z.string().min(1, { message: "ID do Token é obrigatório" }),
  apiTokenSecret: z.string().min(1, { message: "Secret do Token é obrigatório" }),
  ambiente: z.enum(["homologacao", "producao"]),
  empresaId: z.string().min(1, { message: "ID da Empresa é obrigatório" }),
  certificadoDigital: z.string().optional(),
  certificadoSenha: z.string().optional(),
  webhookUrl: z.string().url({ message: "URL de webhook inválida" }).optional().or(z.literal("")),
  ativo: z.boolean().default(false),
  configuracoesAdicionais: z.string().optional(),
});

type IntegranotasFormValues = z.infer<typeof integranotasSchema>;

export default function IntegranotasConfig() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificadoArquivo, setCertificadoArquivo] = useState<File | null>(null);
  
  // Buscar configurações existentes
  const { data: configExistente, isLoading } = useQuery({
    queryKey: ['/api/integrations/integranotas/config'],
    on401: "returnNull"
  });

  // Form com valores padrão
  const form = useForm<IntegranotasFormValues>({
    resolver: zodResolver(integranotasSchema),
    defaultValues: {
      apiKey: "",
      apiTokenId: "",
      apiTokenSecret: "",
      ambiente: "homologacao",
      empresaId: "",
      certificadoDigital: "",
      certificadoSenha: "",
      webhookUrl: "",
      ativo: false,
      configuracoesAdicionais: "",
    }
  });

  // Atualizar formulário quando os dados forem carregados
  useEffect(() => {
    if (configExistente) {
      form.reset(configExistente);
    }
  }, [configExistente, form]);

  // Mutação para salvar configurações
  const saveConfig = useMutation({
    mutationFn: async (data: IntegranotasFormValues) => {
      const formData = new FormData();
      
      // Adicionar todos os campos do formulário
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      // Adicionar o arquivo do certificado se existir
      if (certificadoArquivo) {
        formData.append('certificadoArquivo', certificadoArquivo);
      }
      
      return apiRequest('/api/integrations/integranotas/config', {
        method: 'POST',
        body: formData,
        // Não definir 'Content-Type' para que o navegador defina corretamente com boundary para FormData
      });
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações do Integranotas foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/integranotas/config'] });
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Mutação para testar a conexão
  const testConnection = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/integrations/integranotas/test', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o Integranotas foi estabelecida com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao testar conexão:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Integranotas. Verifique suas credenciais.",
        variant: "destructive",
      });
    }
  });

  // Manipulador de envio do formulário
  const onSubmit = (values: IntegranotasFormValues) => {
    saveConfig.mutate(values);
  };

  // Manipulador de upload de certificado
  const handleCertificadoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCertificadoArquivo(file);
    if (file) {
      form.setValue('certificadoDigital', file.name);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Configuração do Integranotas</CardTitle>
        <CardDescription>
          Configure as credenciais de acesso à API do Integranotas para emissão de notas fiscais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="credenciais">
            <TabsList className="mb-4">
              <TabsTrigger value="credenciais">Credenciais</TabsTrigger>
              <TabsTrigger value="certificado">Certificado Digital</TabsTrigger>
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
              <TabsTrigger value="avancado">Avançado</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="credenciais" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave de API</FormLabel>
                          <FormControl>
                            <Input placeholder="Chave de API do Integranotas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="apiTokenId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Token</FormLabel>
                          <FormControl>
                            <Input placeholder="ID do Token" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="apiTokenSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret do Token</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Secret do Token" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="empresaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID da Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="ID da Empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ambiente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ambiente</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o ambiente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="homologacao">Homologação (Testes)</SelectItem>
                              <SelectItem value="producao">Produção</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Use "Homologação" para testes e "Produção" para notas fiscais reais.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ativo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Ativar Integração
                            </FormLabel>
                            <FormDescription>
                              Ative para usar o Integranotas para emissão de notas fiscais.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="certificado" className="space-y-4">
                  <Alert>
                    <AlertTitle>Certificado Digital</AlertTitle>
                    <AlertDescription>
                      O certificado digital é essencial para assinar digitalmente as notas fiscais eletrônicas.
                      Utilize um certificado A1 (arquivo) no formato .pfx ou .p12.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormItem>
                      <FormLabel>Arquivo do Certificado</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pfx,.p12"
                          onChange={handleCertificadoUpload}
                          className="flex-1"
                        />
                        {form.watch('certificadoDigital') && (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setCertificadoArquivo(null);
                              form.setValue('certificadoDigital', '');
                            }}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                      {form.watch('certificadoDigital') && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Certificado atual: {form.watch('certificadoDigital')}
                        </p>
                      )}
                    </FormItem>
                    
                    <FormField
                      control={form.control}
                      name="certificadoSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha do Certificado</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Senha do certificado digital"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A senha utilizada para proteger o certificado digital.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="webhook" className="space-y-4">
                  <Alert>
                    <AlertTitle>Configuração de Webhook</AlertTitle>
                    <AlertDescription>
                      Configure um webhook para receber notificações automáticas sobre o status das notas fiscais.
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Webhook</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://seu-dominio.com/api/webhooks/integranotas"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL que receberá as notificações de mudança de status das notas fiscais.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="avancado" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="configuracoesAdicionais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configurações Adicionais (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{"timeout": 30, "retry": 3}'
                            className="font-mono h-40"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Configurações adicionais em formato JSON para personalizar o comportamento da integração.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testConnection.mutate()}
                    disabled={testConnection.isPending}
                  >
                    {testConnection.isPending ? "Testando..." : "Testar Conexão"}
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={saveConfig.isPending}
                  >
                    {saveConfig.isPending ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Saiba mais sobre a API do Integranotas na <a href="https://integranotas.com.br/doc" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">documentação oficial</a>.
        </p>
      </CardFooter>
    </Card>
  );
}