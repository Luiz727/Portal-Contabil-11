import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getFileIcon, getFileIconClass, formatDate } from "@/lib/utils";

type DocumentCardProps = {
  document: any;
  onDownload: (id: number) => void;
};

export default function DocumentCard({ document, onDownload }: DocumentCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  // Get icon for file type
  const iconName = getFileIcon(document.fileType);
  const iconClass = getFileIconClass(document.fileType);
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get client name
  const { data: client } = useQuery({
    queryKey: [`/api/clients/${document.clientId}`],
    enabled: !!document.clientId,
  });
  
  // Get category name
  const { data: category } = useQuery({
    queryKey: [`/api/document-categories/${document.categoryId}`],
    enabled: !!document.categoryId,
    queryFn: async () => {
      // This is just a placeholder since we don't have the endpoint yet
      const categories = [
        { id: 1, name: "Fiscal" },
        { id: 2, name: "Contábil" },
        { id: 3, name: "Financeiro" },
        { id: 4, name: "Administrativo" },
        { id: 5, name: "Jurídico" }
      ];
      return categories.find(cat => cat.id === document.categoryId);
    }
  });
  
  // Get uploader name
  const { data: uploader } = useQuery({
    queryKey: [`/api/users/${document.uploadedBy}`],
    enabled: !!document.uploadedBy,
    queryFn: async () => {
      // This is just a placeholder since we don't have the endpoint yet
      return { firstName: "João", lastName: "Silva" };
    }
  });
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow duration-200"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4 border-b border-neutral-100">
          <div className={`h-10 w-10 rounded ${iconClass} flex items-center justify-center`}>
            <span className="material-icons">{iconName}</span>
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="font-medium text-neutral-800 truncate">{document.name}</p>
            <p className="text-xs text-neutral-500">
              {formatFileSize(document.size)} • {document.fileType.toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-2 text-sm">
            {client && (
              <div className="flex items-center text-neutral-600">
                <span className="material-icons text-sm mr-2">business</span>
                <span className="truncate">{client.name}</span>
              </div>
            )}
            
            {category && (
              <div className="flex items-center text-neutral-600">
                <span className="material-icons text-sm mr-2">folder</span>
                <span>{category.name}</span>
              </div>
            )}
            
            <div className="flex items-center text-neutral-600">
              <span className="material-icons text-sm mr-2">calendar_today</span>
              <span>{formatDate(document.createdAt)}</span>
            </div>
            
            {uploader && (
              <div className="flex items-center text-neutral-600">
                <span className="material-icons text-sm mr-2">person</span>
                <span>
                  {uploader.firstName} {uploader.lastName}
                </span>
              </div>
            )}
          </div>
          
          <div className={`mt-4 flex justify-between items-center transition-opacity duration-200 ${showOptions ? 'opacity-100' : 'opacity-0'}`}>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <span className="material-icons text-sm mr-1">info</span>
                  Detalhes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Detalhes do Documento</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <h3 className="font-medium">Nome</h3>
                    <p>{document.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Descrição</h3>
                    <p>{document.description || "Sem descrição"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Tipo</h3>
                      <p>{document.fileType.toUpperCase()}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Tamanho</h3>
                      <p>{formatFileSize(document.size)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Data de Upload</h3>
                      <p>{formatDate(document.createdAt)}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Enviado por</h3>
                      <p>
                        {uploader 
                          ? `${uploader.firstName} ${uploader.lastName}` 
                          : "Desconhecido"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Cliente</h3>
                      <p>{client ? client.name : "Não associado"}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Categoria</h3>
                      <p>{category ? category.name : "Sem categoria"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => onDownload(document.id)}>
                    <span className="material-icons text-sm mr-1">download</span>
                    Download
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="default" size="sm" onClick={() => onDownload(document.id)}>
              <span className="material-icons text-sm mr-1">download</span>
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
