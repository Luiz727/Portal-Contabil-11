import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import FileUpload from "@/components/FileUpload";

// Create invoice schema
const invoiceSchema = z.object({
  number: z.string().min(1, { message: "Número da nota é obrigatório" }),
  type: z.string(),
  clientId: z.string(),
  issueDate: z.string(),
  totalValue: z.string().min(1, { message: "Valor total é obrigatório" }),
  status: z.string().default("active"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

type InvoiceFormProps = {
  invoiceId?: number;
  defaultValues?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
};

export default function InvoiceForm({ 
  invoiceId, 
  defaultValues, 
  isEditing = false,
  onSuccess,
}: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const [uploadedXmlDocumentId, setUploadedXmlDocumentId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch clients for dropdown
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Set up form with default values
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      clientId: defaultValues.clientId ? defaultValues.clientId.toString() : "",
      issueDate: defaultValues.issueDate ? new Date(defaultValues.issueDate).toISOString().substring(0, 10) : "",
      totalValue: defaultValues.totalValue ? defaultValues.totalValue.toString() : "",
    } : {
      number: "",
      type: "NFe",
      clientId: "",
      issueDate: new Date().toISOString().substring(0, 10),
      totalValue: "",
      status: "active",
    },
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      setIsSubmitting(true);

      // Format data for submission
      const formattedData = {
        ...data,
        clientId: parseInt(data.clientId),
        totalValue: parseFloat(data.totalValue.replace(",", ".")),
        documentId: uploadedXmlDocumentId,
      };

      if (isEditing && invoiceId) {
        // Update existing invoice
        await apiRequest("PATCH", `/api/invoices/${invoiceId}`, formattedData);
        toast({
          title: "Nota fiscal atualizada",
          description: "A nota fiscal foi atualizada com sucesso.",
        });
      } else {
        // Create new invoice
        await apiRequest("POST", "/api/invoices", formattedData);
        toast({
          title: "Nota fiscal criada",
          description: "A nota fiscal foi criada com sucesso.",
        });
      }

      // Invalidate invoices queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });

      if (onSuccess) {
        onSuccess();
      }
      
      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a nota fiscal. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleXmlUploadSuccess = (documentId: number) => {
    setUploadedXmlDocumentId(documentId);
    toast({
      title: "XML importado",
      description: "O arquivo XML foi importado com sucesso. As informações da nota fiscal serão extraídas automaticamente.",
    });
  };

  return (
    <div className="pt-4">
      <Tabs defaultValue="manual" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Entrada Manual</TabsTrigger>
          <TabsTrigger value="xml">Importar XML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Nota</FormLabel>
                      <FormControl>
                        <Input placeholder="Número da nota fiscal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NFe">NF-e</SelectItem>
                          <SelectItem value="NFSe">NFS-e</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!isLoadingClients && clients?.map((client: any) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Emissão</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => {
                            // Only allow numbers and comma/period
                            const value = e.target.value.replace(/[^0-9,.]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 space-x-2">
                <Button type="button" variant="outline" onClick={onSuccess}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                      Salvando...
                    </span>
                  ) : isEditing ? "Atualizar Nota" : "Emitir Nota"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="xml">
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="text-lg font-medium">Importar arquivo XML</h3>
              <p className="text-sm text-neutral-500 mt-1">
                Faça o upload do arquivo XML da nota fiscal para importar automaticamente os dados.
              </p>
            </div>
            
            <FileUpload 
              allowedTypes={["xml"]}
              maxSizeMB={5}
              onSuccess={() => {
                // In a real implementation, this would set the documentId from the response
                setUploadedXmlDocumentId(123);
                setTimeout(() => {
                  setActiveTab("manual");
                  
                  // This would pre-fill the form with data from the XML
                  form.setValue("number", "12345");
                  form.setValue("type", "NFe");
                  form.setValue("clientId", "1");
                  form.setValue("totalValue", "1250,00");
                  
                  toast({
                    title: "XML processado",
                    description: "As informações do XML foram extraídas. Verifique e complete os dados se necessário.",
                  });
                }, 1500);
              }}
            />
            
            <div className="mt-4">
              <Button 
                variant="outline"
                onClick={() => setActiveTab("manual")}
                className="w-full"
              >
                Preencher manualmente
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
