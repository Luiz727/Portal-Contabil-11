import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

type FileUploadProps = {
  clientId?: number;
  categoryId?: number;
  onSuccess?: () => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
};

export default function FileUpload({
  clientId,
  categoryId,
  onSuccess,
  allowedTypes = ["pdf", "doc", "docx", "xls", "xlsx", "xml"],
  maxSizeMB = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: `Por favor, selecione um arquivo dos seguintes tipos: ${allowedTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeMB) {
      toast({
        title: "Arquivo muito grande",
        description: `O tamanho máximo de arquivo permitido é ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      if (clientId) {
        formData.append('clientId', clientId.toString());
      }
      
      if (categoryId) {
        formData.append('categoryId', categoryId.toString());
      }
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao fazer upload do arquivo');
      }
      
      // Invalidate documents queries
      await queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (clientId) {
        await queryClient.invalidateQueries({ queryKey: [`/api/documents/client/${clientId}`] });
      }
      
      // Show success message
      toast({
        title: "Upload concluído",
        description: "O arquivo foi enviado com sucesso.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    handleUpload(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    handleUpload(files);
  };

  return (
    <div
      className={`relative border-2 ${
        isDragging ? "border-primary-500" : "border-neutral-300"
      } border-dashed rounded-lg p-6 flex justify-center items-center`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isUploading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-sm text-neutral-500">Enviando arquivo...</p>
        </div>
      ) : (
        <div className="text-center">
          <span className="material-icons text-neutral-400 mx-auto">cloud_upload</span>
          <p className="mt-1 text-sm text-neutral-500">
            <span className="font-medium text-primary-600 hover:text-primary-500">
              Arraste arquivos
            </span>{" "}
            ou clique para enviar
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {allowedTypes.map(type => type.toUpperCase()).join(', ')} até {maxSizeMB}MB
          </p>
        </div>
      )}
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        disabled={isUploading}
        accept={allowedTypes.map(type => `.${type}`).join(',')}
      />
    </div>
  );
}
