import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import IntegranotasConfig from '@/components/integrations/IntegranotasConfig';
import WhatsAppConfig from '@/components/integrations/WhatsAppConfig';
import GoogleIntegration from '@/components/integrations/GoogleIntegration';
import MicrosoftIntegration from '@/components/integrations/MicrosoftIntegration';

export default function Integrations() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("whatsapp");

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
          <CardDescription>
            Você precisa estar autenticado para acessar as configurações de integrações.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground">
            Configure integrações com serviços externos para ampliar as funcionalidades do sistema.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:w-[600px]">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="integranotas">Integranotas</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft 365</TabsTrigger>
          </TabsList>
          
          <TabsContent value="whatsapp" className="space-y-4">
            <WhatsAppConfig />
          </TabsContent>
          
          <TabsContent value="integranotas" className="space-y-4">
            <IntegranotasConfig />
          </TabsContent>
          
          <TabsContent value="google" className="space-y-4">
            <GoogleIntegration />
          </TabsContent>
          
          <TabsContent value="microsoft" className="space-y-4">
            <MicrosoftIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}