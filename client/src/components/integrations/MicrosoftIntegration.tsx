import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, X, RefreshCw, Calendar, FileText, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Schema de validação para as configurações do Microsoft 365
const microsoftIntegrationSchema = z.object({
  oneDriveEnabled: z.boolean().default(false),
  outlookCalendarEnabled: z.boolean().default(false),
  outlookEmailEnabled: z.boolean().default(false),
  driveAutoSync: z.boolean().default(false),
  calendarAutoSync: z.boolean().default(false),
  tenantId: z.string().min(1, { message: "ID do Tenant é obrigatório" }).optional().or(z.literal("")),
  clientId: z.string().min(1, { message: "ID do Cliente é obrigatório" }).optional().or(z.literal("")),
  clientSecret: z.string().min(1, { message: "Secret do Cliente é obrigatório" }).optional().or(z.literal("")),
  driveFolder: z.string().optional().or(z.literal("")),
});

type MicrosoftIntegrationFormValues = z.infer<typeof microsoftIntegrationSchema>;

export default function MicrosoftIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [authStatus, setAuthStatus] = useState({
    oneDrive: false,
    outlookCalendar: false,
    outlookEmail: false
  });
  
  // Buscar configurações existentes
  const { data: configExistente, isLoading } = useQuery({
    queryKey: ['/api/integrations/microsoft/config'],
    on401: "returnNull"
  });

  // Form com valores padrão
  const form = useForm<MicrosoftIntegrationFormValues>({
    resolver: zodResolver(microsoftIntegrationSchema),
    defaultValues: {
      oneDriveEnabled: false,
      outlookCalendarEnabled: false,
      outlookEmailEnabled: false,
      driveAutoSync: false,
      calendarAutoSync: false,
      tenantId: "",
      clientId: "",
      clientSecret: "",
      driveFolder: "",
    }
  });

  // Atualizar formulário quando os dados forem carregados
  useEffect(() => {
    if (configExistente) {
      form.reset(configExistente);
      
      // Verificar status de autenticação
      setAuthStatus({
        oneDrive: configExistente.oneDriveEnabled && !!configExistente.clientId,
        outlookCalendar: configExistente.outlookCalendarEnabled && !!configExistente.clientId,
        outlookEmail: configExistente.outlookEmailEnabled && !!configExistente.clientId
      });
    }
  }, [configExistente, form]);

  // Mutação para salvar configurações
  const saveConfig = useMutation({
    mutationFn: async (data: MicrosoftIntegrationFormValues) => {
      return apiRequest('/api/integrations/microsoft/config', {
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
        description: "As configurações do Microsoft 365 foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/microsoft/config'] });
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

  // Mutação para testar a conexão do OneDrive
  const testOneDriveConnection = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/integrations/microsoft/test/onedrive', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o OneDrive foi estabelecida com sucesso.",
      });
      setAuthStatus(prev => ({ ...prev, oneDrive: true }));
    },
    onError: (error) => {
      console.error("Erro ao testar conexão com OneDrive:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao OneDrive. Verifique suas credenciais.",
        variant: "destructive",
      });
      setAuthStatus(prev => ({ ...prev, oneDrive: false }));
    }
  });
  
  // Mutação para testar a conexão do Outlook Calendar
  const testOutlookCalendarConnection = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/integrations/microsoft/test/calendar', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o Outlook Calendar foi estabelecida com sucesso.",
      });
      setAuthStatus(prev => ({ ...prev, outlookCalendar: true }));
    },
    onError: (error) => {
      console.error("Erro ao testar conexão com Outlook Calendar:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Outlook Calendar. Verifique suas credenciais.",
        variant: "destructive",
      });
      setAuthStatus(prev => ({ ...prev, outlookCalendar: false }));
    }
  });
  
  // Mutação para testar a conexão do Outlook Email
  const testOutlookEmailConnection = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/integrations/microsoft/test/email', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o Outlook Email foi estabelecida com sucesso.",
      });
      setAuthStatus(prev => ({ ...prev, outlookEmail: true }));
    },
    onError: (error) => {
      console.error("Erro ao testar conexão com Outlook Email:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Outlook Email. Verifique suas credenciais.",
        variant: "destructive",
      });
      setAuthStatus(prev => ({ ...prev, outlookEmail: false }));
    }
  });

  // Mutação para sincronizar dados
  const syncData = useMutation({
    mutationFn: async (service: 'onedrive' | 'calendar' | 'email') => {
      return apiRequest(`/api/integrations/microsoft/sync/${service}`, {
        method: 'POST',
      });
    },
    onSuccess: (_, service) => {
      toast({
        title: "Sincronização iniciada",
        description: `A sincronização com o ${
          service === 'onedrive' ? 'OneDrive' : service === 'calendar' ? 'Outlook Calendar' : 'Outlook Email'
        } foi iniciada com sucesso.`,
      });
    },
    onError: (error) => {
      console.error("Erro ao iniciar sincronização:", error);
      toast({
        title: "Erro de sincronização",
        description: "Não foi possível iniciar a sincronização. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Manipulador de envio do formulário
  const onSubmit = (values: MicrosoftIntegrationFormValues) => {
    saveConfig.mutate(values);
  };

  const renderAuthStatus = (service: 'oneDrive' | 'outlookCalendar' | 'outlookEmail') => {
    const isAuthenticated = authStatus[service];
    
    return (
      <Badge variant={isAuthenticated ? "success" : "destructive"} className="ml-2">
        {isAuthenticated ? (
          <><Check className="w-3 h-3 mr-1" /> Autenticado</>
        ) : (
          <><X className="w-3 h-3 mr-1" /> Não autenticado</>
        )}
      </Badge>
    );
  };

  const getServiceIcon = (service: 'oneDrive' | 'outlookCalendar' | 'outlookEmail') => {
    switch (service) {
      case 'oneDrive':
        return <FileText className="w-5 h-5 mr-2" />;
      case 'outlookCalendar':
        return <Calendar className="w-5 h-5 mr-2" />;
      case 'outlookEmail':
        return <Mail className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Integração com Microsoft 365</CardTitle>
        <CardDescription>
          Configure integrações com OneDrive, Outlook Calendar e Outlook Email para sincronizar documentos, 
          eventos e mensagens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="credentials">
            <TabsList className="mb-4">
              <TabsTrigger value="credentials">Credenciais</TabsTrigger>
              <TabsTrigger value="onedrive">OneDrive</TabsTrigger>
              <TabsTrigger value="outlook">Outlook</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="credentials" className="space-y-4">
                  <Alert>
                    <AlertTitle>Credenciais do Microsoft 365</AlertTitle>
                    <AlertDescription>
                      Configure as credenciais do Azure AD para integração com os serviços do Microsoft 365.
                      Você precisará criar um registro de aplicativo no Azure Portal.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="tenantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Tenant (Directory ID)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            ID do Tenant (Directory ID) do seu Azure Active Directory.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Cliente (Application ID)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            ID do Aplicativo registrado no Azure AD.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret do Cliente</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Secret do aplicativo" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Secret do cliente criado no portal do Azure AD.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="onedrive" className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">OneDrive</h3>
                    {renderAuthStatus('oneDrive')}
                  </div>
                  
                  <Alert>
                    <AlertTitle className="flex items-center">
                      {getServiceIcon('oneDrive')} 
                      Integração com OneDrive
                    </AlertTitle>
                    <AlertDescription>
                      Sincronize arquivos e documentos com o OneDrive. 
                      Certifique-se de que seu aplicativo tenha as permissões corretas (Files.ReadWrite.All).
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="oneDriveEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Ativar OneDrive
                          </FormLabel>
                          <FormDescription>
                            Ative para sincronizar documentos com o OneDrive.
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
                  
                  {form.watch('oneDriveEnabled') && (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="driveFolder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Caminho da Pasta</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Documentos/ContaSmart" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Caminho da pasta no OneDrive para sincronização de documentos.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="driveAutoSync"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center rounded-lg border p-4">
                              <div className="flex-1">
                                <FormLabel className="text-base">
                                  Sincronização Automática
                                </FormLabel>
                                <FormDescription>
                                  Sincronize automaticamente documentos ao serem criados ou modificados.
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
                      
                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => testOneDriveConnection.mutate()}
                          disabled={testOneDriveConnection.isPending}
                        >
                          {testOneDriveConnection.isPending ? "Testando..." : "Testar Conexão"}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => syncData.mutate('onedrive')}
                          disabled={syncData.isPending || !authStatus.oneDrive}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sincronizar Agora
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="outlook" className="space-y-4">
                  <Alert>
                    <AlertTitle>Integração com Outlook</AlertTitle>
                    <AlertDescription>
                      Configure integrações com o Outlook Calendar e Email para sincronizar eventos e mensagens.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-6">
                    {/* Calendar */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <h3 className="text-lg font-medium flex items-center">
                          {getServiceIcon('outlookCalendar')} Outlook Calendar
                        </h3>
                        {renderAuthStatus('outlookCalendar')}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="outlookCalendarEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Ativar Outlook Calendar
                              </FormLabel>
                              <FormDescription>
                                Ative para sincronizar eventos com o Outlook Calendar.
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
                      
                      {form.watch('outlookCalendarEnabled') && (
                        <>
                          <FormField
                            control={form.control}
                            name="calendarAutoSync"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center rounded-lg border p-4 mb-4">
                                <div className="flex-1">
                                  <FormLabel className="text-base">
                                    Sincronização Automática
                                  </FormLabel>
                                  <FormDescription>
                                    Sincronize automaticamente eventos ao serem criados ou modificados.
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
                          
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => testOutlookCalendarConnection.mutate()}
                              disabled={testOutlookCalendarConnection.isPending}
                            >
                              {testOutlookCalendarConnection.isPending ? "Testando..." : "Testar Conexão"}
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => syncData.mutate('calendar')}
                              disabled={syncData.isPending || !authStatus.outlookCalendar}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sincronizar Agora
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <h3 className="text-lg font-medium flex items-center">
                          {getServiceIcon('outlookEmail')} Outlook Email
                        </h3>
                        {renderAuthStatus('outlookEmail')}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="outlookEmailEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Ativar Outlook Email
                              </FormLabel>
                              <FormDescription>
                                Ative para integrar com o Outlook Email para envio de notificações.
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
                      
                      {form.watch('outlookEmailEnabled') && (
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => testOutlookEmailConnection.mutate()}
                            disabled={testOutlookEmailConnection.isPending}
                          >
                            {testOutlookEmailConnection.isPending ? "Testando..." : "Testar Conexão"}
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => syncData.mutate('email')}
                            disabled={syncData.isPending || !authStatus.outlookEmail}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sincronizar Agora
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <Separator className="my-4" />
                
                <div className="flex justify-end">
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
          Para usar estas integrações, você precisa criar um registro de aplicativo no Azure Portal com as permissões adequadas.
        </p>
      </CardFooter>
    </Card>
  );
}