import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Folder, FileText, Search, Filter, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

const initialDocuments = [
  { id: 1, name: "Balanço Patrimonial 2023.pdf", client: "Empresa Alpha Ltda.", type: "Relatório", size: "2.5 MB", uploadDate: "2025-05-10", folder: "Balanços" },
  { id: 2, name: "Contrato Social.docx", client: "Comércio Beta S.A.", type: "Contrato", size: "300 KB", uploadDate: "2025-04-22", folder: "Documentos Legais" },
  { id: 3, name: "NFe_00123.xml", client: "Empresa Alpha Ltda.", type: "Nota Fiscal", size: "15 KB", uploadDate: "2025-05-15", folder: "Notas Fiscais/Maio" },
  { id: 4, name: "IRPF_Declaração_2024.pdf", client: "Serviços Gama ME", type: "Declaração", size: "1.2 MB", uploadDate: "2025-03-30", folder: "Imposto de Renda" },
];

const DocumentRow = ({ doc, delay }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="hover:bg-accent/50 transition-colors"
  >
    <TableCell className="font-medium text-foreground flex items-center">
      <FileText className="h-5 w-5 mr-2 text-primary" />
      {doc.name}
    </TableCell>
    <TableCell className="text-muted-foreground hidden md:table-cell">{doc.client}</TableCell>
    <TableCell className="text-muted-foreground hidden sm:table-cell">{doc.type}</TableCell>
    <TableCell className="text-muted-foreground hidden lg:table-cell">{doc.size}</TableCell>
    <TableCell className="text-muted-foreground hidden md:table-cell">{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
    <TableCell className="text-muted-foreground hidden lg:table-cell flex items-center">
      <Folder className="h-4 w-4 mr-1 text-primary" /> {doc.folder}
    </TableCell>
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ações</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
          <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">Ver</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">Baixar</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">Compartilhar</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem className="text-destructive hover:bg-destructive/10">Excluir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </motion.tr>
);

// Versão compacta para telas pequenas
const DocumentCard = ({ doc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm transition-colors"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        <span className="font-medium text-foreground truncate max-w-[150px]">{doc.name}</span>
      </div>
      <Badge variant="outline" className="text-xs">
        {doc.type}
      </Badge>
    </div>
    <div className="text-xs text-muted-foreground space-y-1">
      <div className="flex justify-between">
        <span>Cliente:</span>
        <span>{doc.client}</span>
      </div>
      <div className="flex justify-between">
        <span>Tamanho:</span>
        <span>{doc.size}</span>
      </div>
      <div className="flex justify-between">
        <span>Data:</span>
        <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
      </div>
    </div>
    <div className="mt-3 flex justify-end gap-2">
      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs h-8 px-2">Ver</Button>
      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 text-xs h-8 px-2">Excluir</Button>
    </div>
  </motion.div>
);

const DocumentsPage = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("Todos");
  const [filterType, setFilterType] = useState("Todos");
  const [viewMode, setViewMode] = useState("list");

  const clients = ["Todos", ...new Set(initialDocuments.map(doc => doc.client))];
  const types = ["Todos", ...new Set(initialDocuments.map(doc => doc.type))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = filterClient === "Todos" || doc.client === filterClient;
    const matchesType = filterType === "Todos" || doc.type === filterType;
    return matchesSearch && matchesClient && matchesType;
  });

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
            <FileText className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" /> 
            Gerenciador de Documentos
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Faça upload, organize e gerencie seus arquivos.
          </p>
        </div>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            <UploadCloud className="mr-2 h-5 w-5" /> Upload
          </Button>
          <Button 
            variant="outline" 
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground w-full sm:w-auto"
          >
            <Folder className="mr-2 h-5 w-5" /> Nova Pasta
          </Button>
        </div>
      </motion.div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl text-foreground">Documentos</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs sm:text-sm"
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            >
              {viewMode === "list" ? "Visualizar em Grid" : "Visualizar em Lista"}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Buscar documentos..."
                className="pl-9 bg-input border-border text-foreground focus:border-primary w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-input border-border text-foreground focus:border-primary w-full sm:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger className="bg-input border-border text-foreground focus:border-primary w-full sm:w-44">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {clients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Vista em lista para telas maiores */}
          {viewMode === "list" ? (
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Nome</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Cliente</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Tipo</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Tamanho</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Data</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Pasta</TableHead>
                    <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc, index) => (
                      <DocumentRow 
                        key={doc.id} 
                        doc={doc} 
                        delay={index * 0.05} 
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                        Nenhum documento encontrado. Ajuste os filtros ou faça upload de novos arquivos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <DocumentCard 
                    key={doc.id} 
                    doc={doc} 
                    delay={index * 0.05} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  Nenhum documento encontrado. Ajuste os filtros ou faça upload de novos arquivos.
                </div>
              )}
            </div>
          )}

          {/* Vista em grid para telas menores, sempre visível quando viewMode === list em telas pequenas */}
          {viewMode === "list" && (
            <div className="sm:hidden space-y-4 mt-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <DocumentCard 
                    key={doc.id} 
                    doc={doc} 
                    delay={index * 0.05} 
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  Nenhum documento encontrado. Ajuste os filtros ou faça upload de novos arquivos.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;