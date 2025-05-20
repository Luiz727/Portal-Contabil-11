import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { UploadCloud, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

import DocumentUpload from '@/components/documents-manager/DocumentUpload';
import DocumentFilters from '@/components/documents-manager/DocumentFilters';
import DocumentTable from '@/components/documents-manager/DocumentTable';
import DocumentIntegrations from '@/components/documents-manager/DocumentIntegrations';

const initialDocuments = [
  { id: 'doc1', name: "Balanço Patrimonial 2023.pdf", client: "Empresa Alpha Ltda.", type: "Relatório", size: "2.5 MB", uploadDate: "2025-05-10", folder: "Balanços", status: "Processado", extractedData: { competencia: "12/2023", valorTotalAtivos: "R$ 1.250.000,00" } },
  { id: 'doc2', name: "Contrato Social.docx", client: "Comércio Beta S.A.", type: "Contrato", size: "300 KB", uploadDate: "2025-04-22", folder: "Documentos Legais", status: "Pendente", extractedData: {} },
  { id: 'doc3', name: "NFe_00123.xml", client: "Empresa Alpha Ltda.", type: "Nota Fiscal", size: "15 KB", uploadDate: "2025-05-15", folder: "Notas Fiscais/Maio", status: "Processado", extractedData: { numero: "00123", valor: "R$ 1.500,00", emissor: "Fornecedor X" } },
  { id: 'doc4', name: "IRPF_Declaração_2024.pdf", client: "Serviços Gama ME", type: "Declaração", size: "1.2 MB", uploadDate: "2025-03-30", folder: "Imposto de Renda", status: "Erro", extractedData: {} },
];

const DocumentsManagerPage = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("Todos");
  const [filterType, setFilterType] = useState("Todos");
  const [isViewDataDialogOpen, setIsViewDataDialogOpen] = useState(false);
  const [currentDocumentData, setCurrentDocumentData] = useState(null);
  const { toast } = useToast();

  const clients = ["Todos", ...new Set(documents.map(doc => doc.client))];
  const types = ["Todos", ...new Set(documents.map(doc => doc.type))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = filterClient === "Todos" || doc.client === filterClient;
    const matchesType = filterType === "Todos" || doc.type === filterType;
    return matchesSearch && matchesClient && matchesType;
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newDocument = {
        id: `doc${Date.now()}`,
        name: file.name,
        client: "Cliente Padrão", 
        type: file.type.startsWith('image/') ? 'Imagem' : (file.name.endsWith('.xml') ? 'Nota Fiscal' : (file.name.endsWith('.csv') ? 'CSV' : 'Outro')),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        folder: "Uploads Recentes",
        status: "Pendente",
        extractedData: {}
      };
      setDocuments(prev => [newDocument, ...prev]);
      toast({ title: "Arquivo Adicionado", description: `${file.name} pronto para processamento.`, className: "bg-primary text-primary-foreground" });
    }
  };

  const handleProcessDocument = (docId) => {
    setDocuments(prevDocs => prevDocs.map(doc => {
      if (doc.id === docId) {
        toast({ title: "Processando Arquivo...", description: `Iniciando leitura de ${doc.name}.`, className: "bg-blue-500 text-white" });
        
        let extractedData = {};
        if (doc.name.endsWith('.xml')) {
          extractedData = { numero: `NF-${Math.floor(Math.random() * 10000)}`, valor: `R$ ${(Math.random() * 5000).toFixed(2)}`, dataEmissao: new Date().toLocaleDateString() };
        } else if (doc.name.endsWith('.pdf')) {
          extractedData = { tipoDocumento: "Relatório Financeiro", competencia: `0${Math.floor(Math.random() * 9) + 1}/2025` };
        } else if (doc.name.endsWith('.csv')) {
          extractedData = { totalLinhas: Math.floor(Math.random() * 200) + 50, colunas: "Cliente;Valor;Data" };
        } else {
           extractedData = { info: "Dados genéricos extraídos."};
        }
        
        setTimeout(() => {
            setDocuments(currentDocs => currentDocs.map(d => d.id === docId ? {...d, status: "Processado", extractedData } : d));
            toast({ title: "Arquivo Processado!", description: `${doc.name} foi lido com sucesso.`, className: "bg-green-500 text-white" });
        }, 2000);
        return { ...doc, status: "Processando" }; 
      }
      return doc;
    }));
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
    toast({ title: "Documento Excluído", description: "O arquivo foi removido da lista.", variant: "destructive" });
  };

  const handleViewData = (doc) => {
    setCurrentDocumentData(doc);
    setIsViewDataDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <UploadCloud className="mr-3 h-8 w-8 text-primary" /> Gerenciador de Documentos
          </h1>
          <p className="text-muted-foreground mt-1">Faça upload, organize, leia e gerencie seus arquivos.</p>
        </div>
        <DocumentUpload onFileUpload={handleFileUpload} />
      </motion.div>

      <DocumentIntegrations />

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Documentos Enviados</CardTitle>
          <DocumentFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterClient={filterClient}
            setFilterClient={setFilterClient}
            filterType={filterType}
            setFilterType={setFilterType}
            clients={clients}
            types={types}
          />
        </CardHeader>
        <CardContent>
          <DocumentTable 
            documents={filteredDocuments}
            onProcess={handleProcessDocument}
            onViewData={handleViewData}
            onDelete={handleDeleteDocument}
          />
        </CardContent>
      </Card>

      <Dialog open={isViewDataDialogOpen} onOpenChange={setIsViewDataDialogOpen}>
        <DialogContent className="sm:max-w-md bg-popover border-border text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary flex items-center">
              <Eye className="mr-2 h-6 w-6" /> Dados Extraídos de: {currentDocumentData?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1">
              Informações lidas automaticamente do arquivo.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            {currentDocumentData && Object.keys(currentDocumentData.extractedData).length > 0 ? (
              <div className="space-y-3 py-4">
                {Object.entries(currentDocumentData.extractedData).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-muted-foreground">Nenhum dado extraído para este documento ou o processamento falhou.</p>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setIsViewDataDialogOpen(false)} variant="outline">Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsManagerPage;