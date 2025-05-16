import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ShareDocumentProps = {
  documentId: number;
  documentName: string;
};

type SharingOptions = {
  expiresIn: number; // horas
  password: string;
  requireAuthentication: boolean;
  maxDownloads: number;
  storageProvider: "local" | "googleDrive" | "oneDrive";
};

export default function ShareDocument({ documentId, documentName }: ShareDocumentProps) {
  const [shareLink, setShareLink] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(true);
  const [sharingOptions, setSharingOptions] = useState<SharingOptions>({
    expiresIn: 24,
    password: "",
    requireAuthentication: true,
    maxDownloads: 3,
    storageProvider: "local",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation para criar link de compartilhamento
  const { mutate: generateShareLink, isPending } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/documents/share', {
        method: 'POST',
        data: {
          documentId,
          ...sharingOptions,
        },
      });
      return response;
    },
    onSuccess: (data) => {
      setShareLink(data.shareLink);
      setShowShareOptions(false);
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Link gerado com sucesso",
        description: "Agora você pode compartilhar este documento de forma segura.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de compartilhamento.",
        variant: "destructive",
      });
    },
  });

  // Copiar link para área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  // Enviar link via WhatsApp
  const shareViaWhatsApp = () => {
    // Utilizaremos a integração do WhatsApp
    toast({
      title: "Enviando via WhatsApp",
      description: "Redirecionando para o módulo de WhatsApp.",
    });
    // Redirecionaria para o módulo de WhatsApp com o link pré-preenchido
  };

  // Função para atualizar as opções de compartilhamento
  const updateOption = (key: keyof SharingOptions, value: any) => {
    setSharingOptions({
      ...sharingOptions,
      [key]: value,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="material-icons text-sm mr-1">share</span>
          Compartilhar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Documento</DialogTitle>
        </DialogHeader>
        
        {showShareOptions ? (
          <div className="py-4">
            <p className="text-sm text-neutral-500 mb-4">
              Configurações para compartilhamento seguro do documento: <span className="font-medium">{documentName}</span>
            </p>
            
            <Tabs defaultValue="options" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="options" className="flex-1">Opções de Acesso</TabsTrigger>
                <TabsTrigger value="storage" className="flex-1">Armazenamento</TabsTrigger>
              </TabsList>
              
              <TabsContent value="options" className="space-y-4">
                <div>
                  <Label htmlFor="expires">Expirar após</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      id="expires"
                      min={1}
                      max={168}
                      step={1}
                      value={[sharingOptions.expiresIn]}
                      onValueChange={(value) => updateOption('expiresIn', value[0])}
                      className="flex-1"
                    />
                    <span className="w-14 text-center">{sharingOptions.expiresIn}h</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Senha de proteção (opcional)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite uma senha"
                    value={sharingOptions.password}
                    onChange={(e) => updateOption('password', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-auth">Requer autenticação</Label>
                  <Switch
                    id="require-auth"
                    checked={sharingOptions.requireAuthentication}
                    onCheckedChange={(checked) => updateOption('requireAuthentication', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-downloads">Limite de downloads</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      id="max-downloads"
                      min={1}
                      max={20}
                      step={1}
                      value={[sharingOptions.maxDownloads]}
                      onValueChange={(value) => updateOption('maxDownloads', value[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{sharingOptions.maxDownloads}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="storage" className="space-y-4">
                <RadioGroup
                  value={sharingOptions.storageProvider}
                  onValueChange={(value: "local" | "googleDrive" | "oneDrive") => updateOption('storageProvider', value)}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local" className="cursor-pointer">Armazenamento Local</Label>
                  </div>
                  
                  <Card className="mb-2">
                    <CardContent className="p-4 flex items-center space-x-2">
                      <RadioGroupItem value="googleDrive" id="googleDrive" />
                      <Label htmlFor="googleDrive" className="cursor-pointer flex items-center">
                        <span className="material-icons text-blue-700 mr-2">cloud</span>
                        <span>Google Drive</span>
                      </Label>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-2">
                      <RadioGroupItem value="oneDrive" id="oneDrive" />
                      <Label htmlFor="oneDrive" className="cursor-pointer flex items-center">
                        <span className="material-icons text-blue-500 mr-2">cloud</span>
                        <span>Microsoft OneDrive</span>
                      </Label>
                    </CardContent>
                  </Card>
                  
                  <p className="text-xs text-neutral-500 mt-4">
                    O documento será enviado para o serviço de armazenamento selecionado antes de ser compartilhado.
                    É necessário ter uma integração configurada com o serviço escolhido.
                  </p>
                </RadioGroup>
              </TabsContent>
            </Tabs>
            
            <div className="mt-5 flex justify-end">
              <Button
                onClick={() => generateShareLink()}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Gerando link...
                  </>
                ) : (
                  <>
                    <span className="material-icons text-sm mr-1">link</span>
                    Gerar Link Seguro
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-sm text-neutral-500 mb-4">
              Link de compartilhamento gerado com sucesso!
            </p>
            
            <div className="flex items-center space-x-2 mb-4">
              <Input
                value={shareLink}
                readOnly
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={copyToClipboard}
              >
                <span className="material-icons">content_copy</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center"
              >
                <span className="material-icons text-green-600 mr-1">whatsapp</span>
                Enviar via WhatsApp
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowShareOptions(true)}
                className="flex items-center justify-center"
              >
                <span className="material-icons text-sm mr-1">settings</span>
                Novas Opções
              </Button>
            </div>
            
            <div className="mt-4 p-2 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-xs text-yellow-700 flex items-start">
                <span className="material-icons text-yellow-600 text-sm mr-1">info</span>
                <span>
                  Este link expira em <strong>{sharingOptions.expiresIn} horas</strong>
                  {sharingOptions.maxDownloads > 0 && ` e permite no máximo ${sharingOptions.maxDownloads} downloads`}.
                  {sharingOptions.password && " É protegido por senha."}
                </span>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}