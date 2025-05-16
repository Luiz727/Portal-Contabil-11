import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [whatsappIntegrated, setWhatsappIntegrated] = useState(false);
  const [googleCalendarIntegrated, setGoogleCalendarIntegrated] = useState(false);
  const [microsoftIntegrated, setMicrosoftIntegrated] = useState(false);
  
  // Function to handle form submissions
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  // Function to handle integration toggles
  const handleIntegrationToggle = (integration: string, state: boolean) => {
    switch (integration) {
      case "whatsapp":
        setWhatsappIntegrated(state);
        toast({
          title: state ? "WhatsApp conectado" : "WhatsApp desconectado",
          description: state 
            ? "A integração com WhatsApp foi ativada com sucesso." 
            : "A integração com WhatsApp foi desativada.",
        });
        break;
      case "google":
        setGoogleCalendarIntegrated(state);
        toast({
          title: state ? "Google Calendar conectado" : "Google Calendar desconectado",
          description: state 
            ? "A integração com Google Calendar foi ativada com sucesso." 
            : "A integração com Google Calendar foi desativada.",
        });
        break;
      case "microsoft":
        setMicrosoftIntegrated(state);
        toast({
          title: state ? "Microsoft 365 conectado" : "Microsoft 365 desconectado",
          description: state 
            ? "A integração com Microsoft 365 foi ativada com sucesso." 
            : "A integração com Microsoft 365 foi desativada.",
        });
        break;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Configurações</h2>
          <p className="mt-1 text-sm text-neutral-500">Personalize as configurações do sistema</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs defaultValue="general" className="w-full">
          <div className="px-6 py-4 border-b border-neutral-200">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
            </TabsList>
          </div>

          {/* General Settings */}
          <TabsContent value="general" className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure as preferências gerais do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input id="company-name" defaultValue="ContaSmart Contabilidade" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select defaultValue="America/Sao_Paulo">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Selecione o fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                          <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                          <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                          <SelectItem value="America/Noronha">Fernando de Noronha (GMT-2)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Formato de Data</Label>
                    <Select defaultValue="dd/MM/yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Selecione o formato de data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue="pt-BR">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="dark-mode" className="text-base">Modo Escuro</Label>
                    <Switch id="dark-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="auto-logout" className="text-base">Logout Automático após 30 minutos de inatividade</Label>
                    <Switch id="auto-logout" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Fiscais</CardTitle>
                  <CardDescription>
                    Configurações para emissão de notas fiscais e obrigações fiscais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-tax-regime">Regime Tributário Padrão</Label>
                    <Select defaultValue="simples">
                      <SelectTrigger id="default-tax-regime">
                        <SelectValue placeholder="Selecione o regime tributário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples">Simples Nacional</SelectItem>
                        <SelectItem value="presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="real">Lucro Real</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificate-path">Caminho do Certificado Digital</Label>
                    <div className="flex space-x-2">
                      <Input id="certificate-path" placeholder="/path/to/certificate.pfx" className="flex-1" />
                      <Button variant="outline">Selecionar</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificate-password">Senha do Certificado</Label>
                    <Input id="certificate-password" type="password" />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="auto-nfe" className="text-base">Envio Automático de NF-e</Label>
                    <Switch id="auto-nfe" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit">Salvar Configurações</Button>
              </div>
            </form>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex flex-col items-center">
                      <img 
                        src={user?.profileImageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                        alt="Foto de perfil" 
                        className="w-24 h-24 rounded-full object-cover mb-2"
                      />
                      <Button variant="outline" size="sm">Alterar Foto</Button>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">Nome</Label>
                          <Input id="first-name" defaultValue={user?.firstName || ""} />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Sobrenome</Label>
                          <Input id="last-name" defaultValue={user?.lastName || ""} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" defaultValue={user?.email || ""} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Cargo</Label>
                        <Select defaultValue={user?.role || "client"}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Selecione o cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="accountant">Contador</SelectItem>
                            <SelectItem value="client">Cliente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" placeholder="(00) 00000-0000" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Atualize suas configurações de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Senha Atual</Label>
                    <Input id="old-password" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="two-factor" className="text-base">Autenticação de Dois Fatores</Label>
                    <Switch id="two-factor" />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Configure como deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notificações por E-mail</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-tasks">Atualizações de Tarefas</Label>
                      <Switch id="email-tasks" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-documents">Novos Documentos</Label>
                      <Switch id="email-documents" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-events">Lembretes de Eventos</Label>
                      <Switch id="email-events" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-invoices">Notas Fiscais</Label>
                      <Switch id="email-invoices" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notificações por WhatsApp</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp-tasks">Atualizações de Tarefas</Label>
                      <Switch id="whatsapp-tasks" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp-documents">Novos Documentos</Label>
                      <Switch id="whatsapp-documents" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp-events">Lembretes de Eventos</Label>
                      <Switch id="whatsapp-events" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp-invoices">Notas Fiscais</Label>
                      <Switch id="whatsapp-invoices" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notificações no Sistema</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-tasks">Atualizações de Tarefas</Label>
                      <Switch id="system-tasks" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-documents">Novos Documentos</Label>
                      <Switch id="system-documents" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-events">Lembretes de Eventos</Label>
                      <Switch id="system-events" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-messages">Mensagens de Chat</Label>
                      <Switch id="system-messages" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Horários de Notificação</CardTitle>
                  <CardDescription>
                    Configure quando deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="notif-start-time">Horário Inicial</Label>
                      <Input id="notif-start-time" type="time" defaultValue="08:00" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notif-end-time">Horário Final</Label>
                      <Input id="notif-end-time" type="time" defaultValue="18:00" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notif-days">Dias da Semana</Label>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="outline" size="sm" className="rounded-full">Segunda</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Terça</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Quarta</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Quinta</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Sexta</Button>
                      <Button variant="outline" size="sm" className="rounded-full bg-neutral-100">Sábado</Button>
                      <Button variant="outline" size="sm" className="rounded-full bg-neutral-100">Domingo</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit">Salvar Preferências</Button>
              </div>
            </form>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations" className="p-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Business API</CardTitle>
                  <CardDescription>
                    Integre com a API do WhatsApp para enviar mensagens automáticas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {whatsappIntegrated ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="material-icons text-green-600">check</span>
                          </div>
                          <div>
                            <p className="font-medium">Conectado</p>
                            <p className="text-sm text-neutral-500">Número: +55 11 98765-4321</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => handleIntegrationToggle("whatsapp", false)}
                        >
                          Desconectar
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-templates">Modelos de Mensagem</Label>
                        <Textarea 
                          id="whatsapp-templates" 
                          placeholder="Olá ${nome}, sua obrigação ${tipo} vence em ${dias} dias."
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                            <span className="material-icons text-neutral-500">phone</span>
                          </div>
                          <div>
                            <p className="font-medium">Não Conectado</p>
                            <p className="text-sm text-neutral-500">Conecte sua conta do WhatsApp Business</p>
                          </div>
                        </div>
                        <Button 
                          variant="default" 
                          onClick={() => handleIntegrationToggle("whatsapp", true)}
                        >
                          Conectar
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-api-key">API Key</Label>
                        <Input id="whatsapp-api-key" placeholder="Insira sua API Key do WhatsApp Business" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-phone">Número de Telefone</Label>
                        <Input id="whatsapp-phone" placeholder="+55 (00) 00000-0000" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Google Calendar</CardTitle>
                  <CardDescription>
                    Sincronize eventos com o Google Calendar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {googleCalendarIntegrated ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="material-icons text-green-600">check</span>
                        </div>
                        <div>
                          <p className="font-medium">Conectado</p>
                          <p className="text-sm text-neutral-500">Conta: usuario@gmail.com</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleIntegrationToggle("google", false)}
                      >
                        Desconectar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                          <span className="material-icons text-neutral-500">event</span>
                        </div>
                        <div>
                          <p className="font-medium">Não Conectado</p>
                          <p className="text-sm text-neutral-500">Sincronize com Google Calendar</p>
                        </div>
                      </div>
                      <Button 
                        variant="default" 
                        onClick={() => handleIntegrationToggle("google", true)}
                      >
                        Conectar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Microsoft 365</CardTitle>
                  <CardDescription>
                    Integre com Microsoft 365 para armazenamento e colaboração
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {microsoftIntegrated ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="material-icons text-green-600">check</span>
                        </div>
                        <div>
                          <p className="font-medium">Conectado</p>
                          <p className="text-sm text-neutral-500">Conta: usuario@empresa.com</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleIntegrationToggle("microsoft", false)}
                      >
                        Desconectar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                          <span className="material-icons text-neutral-500">cloud</span>
                        </div>
                        <div>
                          <p className="font-medium">Não Conectado</p>
                          <p className="text-sm text-neutral-500">Integre com Microsoft 365</p>
                        </div>
                      </div>
                      <Button 
                        variant="default" 
                        onClick={() => handleIntegrationToggle("microsoft", true)}
                      >
                        Conectar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Integrações de Contabilidade</CardTitle>
                  <CardDescription>
                    Integre com sistemas contábeis e financeiros
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <img src="https://via.placeholder.com/48" alt="Logo" className="h-12 w-12" />
                      <p className="font-medium">Domínio Sistemas</p>
                      <Button variant="outline" size="sm" className="w-full">Conectar</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <img src="https://via.placeholder.com/48" alt="Logo" className="h-12 w-12" />
                      <p className="font-medium">Fortes Contábil</p>
                      <Button variant="outline" size="sm" className="w-full">Conectar</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <img src="https://via.placeholder.com/48" alt="Logo" className="h-12 w-12" />
                      <p className="font-medium">Contmatic</p>
                      <Button variant="outline" size="sm" className="w-full">Conectar</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <img src="https://via.placeholder.com/48" alt="Logo" className="h-12 w-12" />
                      <p className="font-medium">TOTVS</p>
                      <Button variant="outline" size="sm" className="w-full">Conectar</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <img src="https://via.placeholder.com/48" alt="Logo" className="h-12 w-12" />
                      <p className="font-medium">Sage</p>
                      <Button variant="outline" size="sm" className="w-full">Conectar</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <span className="material-icons text-4xl text-neutral-400">add_circle_outline</span>
                      <p className="font-medium">Adicionar Outro</p>
                      <Button variant="outline" size="sm" className="w-full">Configurar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
