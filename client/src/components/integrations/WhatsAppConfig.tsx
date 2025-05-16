import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Schema de validação para as configurações do WhatsApp
const whatsappSchema = z.object({
  providerType: z.enum(["whatsapp_business", "evolution"]),
  active: z.boolean().default(false),
  // WhatsApp Business API
  phoneNumberId: z.string().optional(),
  accessToken: z.string().optional(),
  apiVersion: z.string().optional(),
  // Evolution API
  evolutionUrl: z.string().url({ message: "URL inválida para a Evolution API" }).optional().or(z.literal("")),
  evolutionApiKey: z.string().optional(),
  // Webhook
  webhookUrl: z.string().url({ message: "URL inválida para webhook" }).optional().or(z.literal("")),
  webhookVerifyToken: z.string().optional(),
  // Configurações de mensagens
  defaultSignature: z.string().max(160, { message: "Assinatura deve ter no máximo 160 caracteres" }).optional(),
  defaultGreeting: z.string().max(500, { message: "Saudação deve ter no máximo 500 caracteres" }).optional(),
  messageFooter: z.string().max(160, { message: "Rodapé deve ter no máximo 160 caracteres" }).optional(),
});

type WhatsAppFormValues = z.infer<typeof whatsappSchema>;

export default function WhatsAppConfig() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Buscar configurações existentes
  const { data: configExistente, isLoading } = useQuery({
    queryKey: ['/api/integrations/whatsapp/config'],
    on401: "returnNull"
  });

  // Form com valores padrão
  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: {
      providerType: "whatsapp_business",
      active: false,
      phoneNumberId: "",
      accessToken: "",
      apiVersion: "v16.0",
      evolutionUrl: "",
      evolutionApiKey: "",
      webhookUrl: "",
      webhookVerifyToken: "",
      defaultSignature: "",
      defaultGreeting: "",
      messageFooter: "",
    }
  });

  // Atualizar formulário quando os dados forem carregados
  useEffect(() => {
    if (configExistente) {
      form.reset(configExistente);
    }
  }, [configExistente, form]);

  // Tipo de provider selecionado no momento
  const providerType = form.watch("providerType");

  // Mutação para salvar configurações
  const saveConfig = useMutation({
    mutationFn: async (data: WhatsAppFormValues) => {
      return apiRequest('/api/integrations/whatsapp/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações do WhatsApp foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/whatsapp/config'] });
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
      return apiRequest('/api/integrations/whatsapp/test', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com a API do WhatsApp foi estabelecida com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao testar conexão:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar à API do WhatsApp. Verifique suas credenciais.",
        variant: "destructive",
      });
    }
  });

  // Manipulador de envio do formulário
  const onSubmit = (values: WhatsAppFormValues) => {
    saveConfig.mutate(values);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Configuração do WhatsApp</CardTitle>
        <CardDescription>
          Configure as credenciais para integração com o WhatsApp, permitindo o envio de documentos e notas fiscais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="provider">
            <TabsList className="mb-4">
              <TabsTrigger value="provider">Provedor</TabsTrigger>
              <TabsTrigger value="credentials">Credenciais</TabsTrigger>
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="provider" className="space-y-4">
                  <Alert>
                    <AlertTitle>Escolha de API</AlertTitle>
                    <AlertDescription>
                      Selecione qual API do WhatsApp você deseja utilizar. A API oficial do WhatsApp Business 
                      ou a Evolution API (não oficial, porém com mais recursos).
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="providerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Provedor</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o provedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="whatsapp_business">WhatsApp Business API (Oficial)</SelectItem>
                            <SelectItem value="evolution">Evolution API</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          A API oficial exige aprovação do Facebook/Meta. A Evolution API permite uso imediato.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Ativar Integração
                          </FormLabel>
                          <FormDescription>
                            Ative para utilizar o WhatsApp nas comunicações com clientes.
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
                </TabsContent>
                
                <TabsContent value="credentials" className="space-y-4">
                  {providerType === "whatsapp_business" ? (
                    <>
                      <Alert>
                        <AlertTitle>WhatsApp Business API</AlertTitle>
                        <AlertDescription>
                          Você precisa de um número de telefone verificado na API oficial do WhatsApp Business.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phoneNumberId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID do Número de Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="ID do número no WhatsApp Business" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accessToken"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Token de Acesso</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Token de acesso permanente" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="apiVersion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Versão da API</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="v16.0" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Versão da API do WhatsApp (ex: v16.0)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Alert>
                        <AlertTitle>Evolution API</AlertTitle>
                        <AlertDescription>
                          Configure a conexão com a Evolution API, que oferece mais recursos para automação de WhatsApp.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="evolutionUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL da Evolution API</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://sua-evolution-api.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="evolutionApiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chave da API</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Chave de API da Evolution" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="webhook" className="space-y-4">
                  <Alert>
                    <AlertTitle>Configuração de Webhook</AlertTitle>
                    <AlertDescription>
                      Configure webhooks para receber atualizações e mensagens do WhatsApp em tempo real.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Webhook</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://seu-dominio.com/api/webhooks/whatsapp"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL que receberá as notificações do WhatsApp.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="webhookVerifyToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token de Verificação</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Token para verificação do webhook"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Token utilizado pelo WhatsApp para verificar seu webhook.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="messages" className="space-y-4">
                  <Alert>
                    <AlertTitle>Configuração de Mensagens</AlertTitle>
                    <AlertDescription>
                      Defina padrões para as mensagens que serão enviadas via WhatsApp.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="defaultGreeting"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saudação Padrão</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Olá, {nome}! Aqui é do ContaSmart..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Texto de saudação no início das mensagens. Use {nome} para incluir o nome do cliente.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="messageFooter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rodapé de Mensagem</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Este é um rodapé padrão para todas as mensagens..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Texto que aparecerá no final de todas as mensagens.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="defaultSignature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assinatura</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Equipe ContaSmart"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Assinatura para o final das mensagens.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
          Nota: Para usar a API oficial do WhatsApp Business, você precisará de um número verificado e aprovado pela Meta.
        </p>
      </CardFooter>
    </Card>
  );
}