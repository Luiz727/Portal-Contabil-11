import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FileUpload from "@/components/FileUpload";
import DocumentCard from "@/components/documents/DocumentCard";
import { useToast } from "@/hooks/use-toast";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  // Fetch clients for filter
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch document categories for filter
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/document-categories"],
    queryFn: async () => {
      // This is just a placeholder since we don't have the endpoint yet
      return [
        { id: 1, name: "Fiscal" },
        { id: 2, name: "Contábil" },
        { id: 3, name: "Financeiro" },
        { id: 4, name: "Administrativo" },
        { id: 5, name: "Jurídico" }
      ];
    }
  });

  // Filter documents
  const filteredDocuments = documents?.filter((doc: any) => {
    // Text search
    const matchesSearch = 
      searchQuery === "" || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Client filter
    const matchesClient = clientFilter === "all" || doc.clientId === parseInt(clientFilter);
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || doc.categoryId === parseInt(categoryFilter);
    
    // File type filter
    const matchesFileType = fileTypeFilter === "all" || doc.fileType === fileTypeFilter;
    
    return matchesSearch && matchesClient && matchesCategory && matchesFileType;
  });

  // Handle document download
  const handleDownloadDocument = (id: number) => {
    window.open(`/api/documents/download/${id}`, '_blank');
  };
  
  // Get unique file types for filter
  const fileTypes = documents ? 
    [...new Set(documents.map((doc: any) => doc.fileType))] : 
    [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Gerenciador de Documentos</h2>
          <p className="mt-1 text-sm text-neutral-500">Upload, download e organização de documentos</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="material-icons text-sm mr-1">upload_file</span>
                Enviar Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Enviar Novo Documento</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Cliente</label>
                  <Select onValueChange={(value) => setClientFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Clientes</SelectItem>
                      {!isLoadingClients && clients?.map((client: any) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Categoria</label>
                  <Select onValueChange={(value) => setCategoryFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      {!isLoadingCategories && categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <FileUpload 
                  clientId={clientFilter !== "all" ? parseInt(clientFilter) : undefined}
                  categoryId={categoryFilter !== "all" ? parseInt(categoryFilter) : undefined}
                  onSuccess={() => {
                    setIsUploadDialogOpen(false);
                    toast({
                      title: "Documento enviado",
                      description: "O documento foi enviado com sucesso.",
                    });
                  }}
                  allowedTypes={["pdf", "doc", "docx", "xls", "xlsx", "xml"]}
                  maxSizeMB={10}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {!isLoadingClients && clients?.map((client: any) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {!isLoadingCategories && categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Arquivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {fileTypes.map((type: string) => (
                  <SelectItem key={type} value={type}>
                    {type.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredDocuments?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document: any) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDownload={handleDownloadDocument}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <span className="material-icons text-neutral-400 text-4xl">folder_open</span>
            <p className="mt-2 text-neutral-500">Nenhum documento encontrado</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <span className="material-icons text-sm mr-1">upload_file</span>
              Enviar Documento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
