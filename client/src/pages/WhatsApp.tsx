import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

type Contact = {
  id: number;
  name: string;
  phone: string;
  profileImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  status?: 'online' | 'offline' | 'typing';
  clientId?: number;
};

type Message = {
  id: number;
  contactId: number;
  content: string;
  timestamp: string;
  sender: 'user' | 'contact';
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'document' | 'audio';
    url: string;
    name: string;
    size?: number;
  }[];
};

export default function WhatsApp() {
  const [activeTab, setActiveTab] = useState<string>("chats");
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Simulação de contatos - seria obtido da API
  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ['/api/whatsapp/contacts'],
    queryFn: async () => {
      try {
        // Simulação - em produção viria da API
        return [
          {
            id: 1,
            name: "Maria Silva",
            phone: "+5511987654321",
            profileImage: "https://i.pravatar.cc/150?img=1",
            lastMessage: "Preciso dos relatórios deste mês",
            lastMessageTime: "10:30",
            unreadCount: 2,
            status: "online",
            clientId: 1
          },
          {
            id: 2,
            name: "João Oliveira",
            phone: "+5511998765432",
            profileImage: "https://i.pravatar.cc/150?img=2",
            lastMessage: "Os documentos foram enviados",
            lastMessageTime: "Ontem",
            unreadCount: 0,
            status: "offline",
            clientId: 2
          },
          {
            id: 3,
            name: "Ana Costa - Aurora Contabilidade",
            phone: "+5511976543210",
            profileImage: "https://i.pravatar.cc/150?img=3",
            lastMessage: "Obrigado pela atenção",
            lastMessageTime: "Seg",
            unreadCount: 0,
            status: "offline",
            clientId: 3
          }
        ] as Contact[];
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
        return [] as Contact[];
      }
    }
  });

  // Buscar mensagens para o contato selecionado
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['/api/whatsapp/messages', selectedContactId],
    enabled: !!selectedContactId,
    queryFn: async () => {
      try {
        // Simulação - em produção viria da API
        const mockMessages: Message[] = [
          {
            id: 1,
            contactId: 1,
            content: "Olá, bom dia! Preciso dos relatórios deste mês.",
            timestamp: "2025-05-16T10:30:00",
            sender: "contact",
            status: "read"
          },
          {
            id: 2,
            contactId: 1,
            content: "Bom dia, Maria! Como vai? Vou preparar os relatórios e enviar hoje ainda.",
            timestamp: "2025-05-16T10:32:00",
            sender: "user",
            status: "delivered"
          },
          {
            id: 3,
            contactId: 1,
            content: "Perfeito, obrigada! Também preciso das notas fiscais de abril.",
            timestamp: "2025-05-16T10:33:00",
            sender: "contact",
            status: "read"
          },
          {
            id: 4,
            contactId: 1,
            content: "Sem problemas. Vou incluir as notas fiscais também.",
            timestamp: "2025-05-16T10:35:00",
            sender: "user",
            status: "sent"
          },
          {
            id: 5,
            contactId: 2,
            content: "Boa tarde, os documentos solicitados foram enviados para seu e-mail.",
            timestamp: "2025-05-15T15:20:00",
            sender: "user",
            status: "read"
          },
          {
            id: 6,
            contactId: 2,
            content: "Obrigado, já recebi e vou analisar.",
            timestamp: "2025-05-15T15:45:00",
            sender: "contact",
            status: "read"
          },
          {
            id: 7,
            contactId: 3,
            content: "Gostaria de agradecer pelo atendimento de ontem.",
            timestamp: "2025-05-13T09:15:00",
            sender: "contact",
            status: "read"
          },
          {
            id: 8,
            contactId: 3,
            content: "Estamos sempre à disposição! Qualquer dúvida é só entrar em contato.",
            timestamp: "2025-05-13T09:20:00",
            sender: "user",
            status: "read"
          }
        ];

        return mockMessages.filter(msg => msg.contactId === selectedContactId);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return [] as Message[];
      }
    }
  });

  // Buscar documentos para compartilhamento
  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/documents'],
    enabled: showDocumentSelector
  });

  // Mutation para enviar mensagem
  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: async (messageData: { contactId: number; content: string; attachments?: any[] }) => {
      // Em produção, enviar para API
      console.log("Enviando mensagem:", messageData);
      return { id: Date.now(), timestamp: new Date().toISOString(), status: 'sent' };
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp/messages', selectedContactId] });
      
      // Simular atualização da lista de contatos
      const updatedContacts = contacts.map(contact => {
        if (contact.id === selectedContactId) {
          return {
            ...contact,
            lastMessage: messageInput,
            lastMessageTime: 'Agora'
          };
        }
        return contact;
      });
      
      queryClient.setQueryData(['/api/whatsapp/contacts'], updatedContacts);
    },
    onError: () => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Houve um problema ao enviar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Mutation para compartilhar documento
  const { mutate: shareDocument } = useMutation({
    mutationFn: async ({ documentId, contactId }: { documentId: number; contactId: number }) => {
      // Em produção, enviar para API
      console.log("Compartilhando documento:", { documentId, contactId });
      return { success: true };
    },
    onSuccess: () => {
      setShowDocumentSelector(false);
      toast({
        title: "Documento compartilhado",
        description: "O documento foi compartilhado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp/messages', selectedContactId] });
    },
    onError: () => {
      toast({
        title: "Erro ao compartilhar documento",
        description: "Houve um problema ao compartilhar o documento. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Função para conectar ao WhatsApp
  const handleConnect = () => {
    // Em produção, conectaria à API do WhatsApp
    toast({
      title: "Conectando ao WhatsApp",
      description: "Conectando à API do WhatsApp...",
    });
    
    // Simulando conexão bem-sucedida
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Conectado",
        description: "Conexão com WhatsApp estabelecida com sucesso!",
      });
    }, 1500);
  };

  // Rolagem automática para a última mensagem
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Formatar data da mensagem
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Selecionar um contato
  const handleSelectContact = (contactId: number) => {
    setSelectedContactId(contactId);
    
    // Atualizar contato para zerar contagem de não lidos
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, unreadCount: 0 };
      }
      return contact;
    });
    
    queryClient.setQueryData(['/api/whatsapp/contacts'], updatedContacts);
  };

  // Enviar mensagem
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContactId) return;
    
    sendMessage({
      contactId: selectedContactId,
      content: messageInput
    });
  };

  // Compartilhar documento
  const handleShareDocument = (documentId: number) => {
    if (!selectedContactId) return;
    
    shareDocument({
      documentId,
      contactId: selectedContactId
    });
  };

  return (
    <div className="h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">WhatsApp</h2>
          <p className="mt-1 text-sm text-neutral-500">Comunique-se com clientes via WhatsApp</p>
        </div>
        
        {!isConnected ? (
          <Button onClick={handleConnect} className="mt-4 md:mt-0">
            <span className="material-icons text-sm mr-1">sync</span>
            Conectar WhatsApp
          </Button>
        ) : (
          <div className="flex items-center mt-4 md:mt-0">
            <span className="flex items-center text-green-600 mr-4">
              <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
              Conectado
            </span>
            <Button variant="outline" size="sm">
              <span className="material-icons text-sm mr-1">settings</span>
              Configurações
            </Button>
          </div>
        )}
      </div>

      {isConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full bg-white rounded-lg shadow overflow-hidden">
          {/* Lista de Contatos */}
          <div className="md:col-span-1 border-r border-neutral-200">
            <Tabs defaultValue="chats" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b border-neutral-200">
                <TabsList className="w-full justify-start px-2 pt-2">
                  <TabsTrigger value="chats" className="flex-1">Conversas</TabsTrigger>
                  <TabsTrigger value="status" className="flex-1">Status</TabsTrigger>
                  <TabsTrigger value="calls" className="flex-1">Chamadas</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-3 border-b border-neutral-100">
                <Input 
                  placeholder="Buscar ou começar nova conversa" 
                  className="w-full"
                />
              </div>
              
              <TabsContent value="chats" className="m-0">
                <ScrollArea className="h-[calc(100vh-315px)]">
                  <div className="divide-y divide-neutral-100">
                    {isLoadingContacts ? (
                      <div className="py-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-neutral-500">Carregando contatos...</p>
                      </div>
                    ) : contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <div 
                          key={contact.id}
                          className={`flex items-center p-3 cursor-pointer hover:bg-neutral-50 ${selectedContactId === contact.id ? 'bg-primary-50' : ''}`}
                          onClick={() => handleSelectContact(contact.id)}
                        >
                          <div className="relative">
                            <img 
                              src={contact.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                              alt={contact.name} 
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            {contact.status === 'online' && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                            )}
                          </div>
                          
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-neutral-800 truncate">{contact.name}</p>
                              <p className="text-xs text-neutral-500">{contact.lastMessageTime}</p>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-neutral-600 truncate">{contact.lastMessage}</p>
                              {contact.unreadCount && contact.unreadCount > 0 ? (
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white text-xs font-medium">
                                  {contact.unreadCount}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center">
                        <span className="material-icons text-neutral-400 text-3xl">person_off</span>
                        <p className="mt-2 text-sm text-neutral-500">Nenhum contato encontrado</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="status" className="m-0 p-4 text-center">
                <span className="material-icons text-neutral-400 text-5xl">update</span>
                <p className="mt-2 text-neutral-500">Status dos contatos aparecerão aqui</p>
              </TabsContent>
              
              <TabsContent value="calls" className="m-0 p-4 text-center">
                <span className="material-icons text-neutral-400 text-5xl">call</span>
                <p className="mt-2 text-neutral-500">O histórico de chamadas aparecerá aqui</p>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Área de Conversa */}
          <div className="md:col-span-2 flex flex-col h-full">
            {selectedContactId ? (
              <>
                {/* Cabeçalho da conversa */}
                <div className="flex items-center p-3 border-b border-neutral-200 bg-neutral-50">
                  {contacts.find(c => c.id === selectedContactId)?.profileImage && (
                    <img 
                      src={contacts.find(c => c.id === selectedContactId)?.profileImage} 
                      alt="Foto de perfil" 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{contacts.find(c => c.id === selectedContactId)?.name}</p>
                    <p className="text-xs text-neutral-500">
                      {contacts.find(c => c.id === selectedContactId)?.status === 'online' 
                        ? 'Online' 
                        : 'Offline'}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <span className="material-icons">search</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <span className="material-icons">more_vert</span>
                    </Button>
                  </div>
                </div>
                
                {/* Mensagens */}
                <ScrollArea ref={scrollRef} className="flex-1 bg-[#e5ded8] p-4">
                  {isLoadingMessages ? (
                    <div className="py-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-neutral-500">Carregando mensagens...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[75%] p-3 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-primary-100 text-neutral-800 rounded-tr-none' 
                                : 'bg-white text-neutral-800 rounded-tl-none'
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                            <div className="flex justify-end items-center mt-1">
                              <p className="text-xs text-neutral-500 mr-1">
                                {formatMessageTime(message.timestamp)}
                              </p>
                              {message.sender === 'user' && (
                                <span className="material-icons text-xs text-blue-500">
                                  {message.status === 'sent' ? 'check' : message.status === 'delivered' ? 'done_all' : 'done_all'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <span className="material-icons text-neutral-400 text-3xl">chat</span>
                      <p className="mt-2 text-sm text-neutral-500">Comece uma conversa!</p>
                    </div>
                  )}
                </ScrollArea>
                
                {/* Área de entrada de mensagem */}
                <div className="p-3 border-t border-neutral-200 bg-neutral-50">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <span className="material-icons">mood</span>
                    </Button>
                    
                    <Dialog open={showDocumentSelector} onOpenChange={setShowDocumentSelector}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="material-icons">attach_file</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Compartilhar Documento</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="space-y-4">
                            {isLoadingDocuments ? (
                              <div className="py-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                                <p className="mt-2 text-sm text-neutral-500">Carregando documentos...</p>
                              </div>
                            ) : documents.length > 0 ? (
                              <ScrollArea className="h-[300px]">
                                <div className="space-y-2">
                                  {documents.map((doc: any) => (
                                    <div 
                                      key={doc.id}
                                      className="flex items-center p-2 hover:bg-neutral-50 rounded-md cursor-pointer"
                                      onClick={() => handleShareDocument(doc.id)}
                                    >
                                      <div className="h-10 w-10 rounded bg-primary-100 flex items-center justify-center text-primary-600">
                                        <span className="material-icons">description</span>
                                      </div>
                                      <div className="ml-3 flex-1 overflow-hidden">
                                        <p className="font-medium text-neutral-800 truncate">{doc.name}</p>
                                        <p className="text-xs text-neutral-500">
                                          {doc.fileType.toUpperCase()} • {formatDate(doc.createdAt)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            ) : (
                              <div className="py-6 text-center">
                                <span className="material-icons text-neutral-400 text-3xl">folder_off</span>
                                <p className="mt-2 text-sm text-neutral-500">Nenhum documento encontrado</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Input
                      placeholder="Digite uma mensagem"
                      className="flex-1"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleSendMessage} 
                      disabled={!messageInput.trim() || isSendingMessage}
                    >
                      {isSendingMessage ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                      ) : (
                        <span className="material-icons">send</span>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-neutral-50">
                <span className="material-icons text-neutral-300 text-6xl">chat</span>
                <p className="mt-4 text-neutral-500">Selecione um contato para iniciar uma conversa</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-8 h-full">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/124/124034.png" 
            alt="WhatsApp Logo" 
            className="h-24 w-24 mb-6"
          />
          <h3 className="text-xl font-bold text-neutral-800 mb-2">Conecte-se ao WhatsApp</h3>
          <p className="text-neutral-600 text-center mb-6 max-w-md">
            Conecte sua conta do WhatsApp para começar a enviar mensagens e compartilhar documentos com seus clientes.
          </p>
          <Button size="lg" onClick={handleConnect}>
            <span className="material-icons mr-2">link</span>
            Conectar WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
}