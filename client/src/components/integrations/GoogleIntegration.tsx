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
import { Check, X, RefreshCw, Calendar, FileSpreadsheet, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Schema de validação para as configurações do Google
const googleIntegrationSchema = z.object({
  googleDriveEnabled: z.boolean().default(false),
  googleSheetsEnabled: z.boolean().default(false),
  googleCalendarEnabled: z.boolean().default(false),
  driveAutoSync: z.boolean().default(false),
  sheetsAutoSync: z.boolean().default(false),
  calendarAutoSync: z.boolean().default(false),
  driveFolder: z.string().optional(),
  driveClientEmail: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  drivePrivateKey: z.string().optional(),
  sheetsClientEmail: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  sheetsPrivateKey: z.string().optional(),
  calendarClientEmail: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  calendarPrivateKey: z.string().optional(),
});

type GoogleIntegrationFormValues = z.infer<typeof googleIntegrationSchema>;

export default function GoogleIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [authStatus, setAuthStatus] = useState({
    drive: false,
    sheets: false,
    calendar: false
  });
  
  // Buscar configurações existentes
  const { data: configExistente, isLoading } = useQuery({
    queryKey: ['/api/integrations/google/config'],
    on401: "returnNull"
  });

  // Form com valores padrão
  const form = useForm<GoogleIntegrationFormValues>({
    resolver: zodResolver(googleIntegrationSchema),
    defaultValues: {
      googleDriveEnabled: false,
      googleSheetsEnabled: false,
      googleCalendarEnabled: false,
      driveAutoSync: false,
      sheetsAutoSync: false,
      calendarAutoSync: false,
      driveFolder: "",
      driveClientEmail: "",
      drivePrivateKey: "",
      sheetsClientEmail: "",
      sheetsPrivateKey: "",
      calendarClientEmail: "",
      calendarPrivateKey: "",
    }
  });

  // Atualizar formulário quando os dados forem carregados
  useEffect(() => {
    if (configExistente) {
      form.reset(configExistente);
      
      // Verificar status de autenticação
      setAuthStatus({
        drive: configExistente.googleDriveEnabled && !!configExistente.driveClientEmail,
        sheets: configExistente.googleSheetsEnabled && !!configExistente.sheetsClientEmail,
        calendar: configExistente.googleCalendarEnabled && !!configExistente.calendarClientEmail
      });
    }
  }, [configExistente, form]);

  // Mutação para salvar configurações
  const saveConfig = useMutation({
    mutationFn: async (data: GoogleIntegrationFormValues) => {
      return apiRequest('/api/integrations/google/config', {
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
        description: "As configurações do Google foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/google/config'] });
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

  // Mutação para testar a conexão do Google Drive
  const testDriveConnection = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/integrations/google/test/drive', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o Google Drive foi estabelecida com sucesso.",
      });
      setAuthStatus(prev => ({ ...prev, drive: true }));
    },
    onError: (error) => {
      console.error("Erro ao testar conexão com Google Drive:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Google Drive. Verifique suas credenciais.",
        variant: "destructive",
      });
      setAuthStatus(prev => ({ ...prev, drive: false }));
    }
  });
  
  // Mutação para testar a conexão do Google Sheets
  const testSheetsConnection = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/integrations/google/test/sheets', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o Google Sheets foi estabelecida com sucesso.",
      });
      setAuthStatus(prev => ({ ...prev, sheets: true }));
    },
    onError: (error) => {
      console.error("Erro ao testar conexão com Google Sheets:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Google Sheets. Verifique suas credenciais.",
        variant: "destructive",
      });
      setAuthStatus(prev => ({ ...prev, sheets: false }));
    }
  });
  
  // Mutação para testar a conexão do Google Calendar
  const testCalendarConnection = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/integrations/google/test/calendar', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Conexão bem-sucedida",
        description: "A conexão com o Google Calendar foi estabelecida com sucesso.",
      });
      setAuthStatus(prev => ({ ...prev, calendar: true }));
    },
    onError: (error) => {
      console.error("Erro ao testar conexão com Google Calendar:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Google Calendar. Verifique suas credenciais.",
        variant: "destructive",
      });
      setAuthStatus(prev => ({ ...prev, calendar: false }));
    }
  });

  // Mutação para sincronizar dados
  const syncData = useMutation({
    mutationFn: async (service: 'drive' | 'sheets' | 'calendar') => {
      return apiRequest(`/api/integrations/google/sync/${service}`, {
        method: 'POST',
      });
    },
    onSuccess: (_, service) => {
      toast({
        title: "Sincronização iniciada",
        description: `A sincronização com o Google ${
          service === 'drive' ? 'Drive' : service === 'sheets' ? 'Sheets' : 'Calendar'
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
  const onSubmit = (values: GoogleIntegrationFormValues) => {
    saveConfig.mutate(values);
  };

  const renderAuthStatus = (service: 'drive' | 'sheets' | 'calendar') => {
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

  const getServiceIcon = (service: 'drive' | 'sheets' | 'calendar') => {
    switch (service) {
      case 'drive':
        return <FileText className="w-5 h-5 mr-2" />;
      case 'sheets':
        return <FileSpreadsheet className="w-5 h-5 mr-2" />;
      case 'calendar':
        return <Calendar className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Integração com Google</CardTitle>
        <CardDescription>
          Configure integrações com Google Drive, Google Sheets e Google Calendar para sincronizar documentos, 
          planilhas e eventos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="drive">
            <TabsList className="mb-4">
              <TabsTrigger value="drive">Google Drive</TabsTrigger>
              <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
              <TabsTrigger value="calendar">Google Calendar</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="drive" className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">Google Drive</h3>
                    {renderAuthStatus('drive')}
                  </div>
                  
                  <Alert>
                    <AlertTitle className="flex items-center">
                      {getServiceIcon('drive')} 
                      Integração com Google Drive
                    </AlertTitle>
                    <AlertDescription>
                      Sincronize arquivos e documentos com o Google Drive. 
                      Você precisará fornecer as credenciais da conta de serviço do Google.
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="googleDriveEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Ativar Google Drive
                          </FormLabel>
                          <FormDescription>
                            Ative para sincronizar documentos com o Google Drive.
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
                  
                  {form.watch('googleDriveEnabled') && (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="driveClientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email do Cliente de Serviço</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="service-account@project.iam.gserviceaccount.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Email da conta de serviço do Google Cloud.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="drivePrivateKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chave Privada</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Chave privada da conta de serviço" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                A chave privada da conta de serviço (formato PEM).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="driveFolder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID da Pasta</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="ID da pasta no Google Drive" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                O ID da pasta do Google Drive para sincronização.
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
                                  Sincronize automaticamente arquivos ao serem criados ou modificados.
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
                          onClick={() => testDriveConnection.mutate()}
                          disabled={testDriveConnection.isPending}
                        >
                          {testDriveConnection.isPending ? "Testando..." : "Testar Conexão"}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => syncData.mutate('drive')}
                          disabled={syncData.isPending || !authStatus.drive}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sincronizar Agora
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="sheets" className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">Google Sheets</h3>
                    {renderAuthStatus('sheets')}
                  </div>
                  
                  <Alert>
                    <AlertTitle className="flex items-center">
                      {getServiceIcon('sheets')} 
                      Integração com Google Sheets
                    </AlertTitle>
                    <AlertDescription>
                      Sincronize dados com planilhas do Google Sheets para relatórios financeiros e análises.
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="googleSheetsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Ativar Google Sheets
                          </FormLabel>
                          <FormDescription>
                            Ative para sincronizar dados com planilhas do Google Sheets.
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
                  
                  {form.watch('googleSheetsEnabled') && (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="sheetsClientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email do Cliente de Serviço</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="service-account@project.iam.gserviceaccount.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Email da conta de serviço do Google Cloud.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="sheetsPrivateKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chave Privada</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Chave privada da conta de serviço" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                A chave privada da conta de serviço (formato PEM).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="sheetsAutoSync"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center rounded-lg border p-4">
                              <div className="flex-1">
                                <FormLabel className="text-base">
                                  Sincronização Automática
                                </FormLabel>
                                <FormDescription>
                                  Sincronize automaticamente dados financeiros e de estoque com o Google Sheets.
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
                          onClick={() => testSheetsConnection.mutate()}
                          disabled={testSheetsConnection.isPending}
                        >
                          {testSheetsConnection.isPending ? "Testando..." : "Testar Conexão"}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => syncData.mutate('sheets')}
                          disabled={syncData.isPending || !authStatus.sheets}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sincronizar Agora
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="calendar" className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">Google Calendar</h3>
                    {renderAuthStatus('calendar')}
                  </div>
                  
                  <Alert>
                    <AlertTitle className="flex items-center">
                      {getServiceIcon('calendar')} 
                      Integração com Google Calendar
                    </AlertTitle>
                    <AlertDescription>
                      Sincronize compromissos, prazos e eventos com o Google Calendar.
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="googleCalendarEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Ativar Google Calendar
                          </FormLabel>
                          <FormDescription>
                            Ative para sincronizar eventos com o Google Calendar.
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
                  
                  {form.watch('googleCalendarEnabled') && (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="calendarClientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email do Cliente de Serviço</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="service-account@project.iam.gserviceaccount.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Email da conta de serviço do Google Cloud.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="calendarPrivateKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chave Privada</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Chave privada da conta de serviço" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                A chave privada da conta de serviço (formato PEM).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="calendarAutoSync"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center rounded-lg border p-4">
                              <div className="flex-1">
                                <FormLabel className="text-base">
                                  Sincronização Automática
                                </FormLabel>
                                <FormDescription>
                                  Sincronize automaticamente eventos e obrigações com o Google Calendar.
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
                          onClick={() => testCalendarConnection.mutate()}
                          disabled={testCalendarConnection.isPending}
                        >
                          {testCalendarConnection.isPending ? "Testando..." : "Testar Conexão"}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => syncData.mutate('calendar')}
                          disabled={syncData.isPending || !authStatus.calendar}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sincronizar Agora
                        </Button>
                      </div>
                    </>
                  )}
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
          Para usar estas integrações, você precisa ter uma conta de serviço do Google Cloud com as permissões adequadas.
        </p>
      </CardFooter>
    </Card>
  );
}