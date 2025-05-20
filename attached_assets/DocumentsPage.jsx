import React from 'react';
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
    className="hover:bg-slate-800/50 transition-colors"
  >
    <TableCell className="font-medium text-gray-200 flex items-center">
      <FileText className="h-5 w-5 mr-2 text-purple-400" />
      {doc.name}
    </TableCell>
    <TableCell className="text-gray-400">{doc.client}</TableCell>
    <TableCell className="text-gray-400">{doc.type}</TableCell>
    <TableCell className="text-gray-400">{doc.size}</TableCell>
    <TableCell className="text-gray-400">{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
    <TableCell className="text-gray-400 flex items-center">
      <Folder className="h-4 w-4 mr-1 text-yellow-400" /> {doc.folder}
    </TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">Ver</Button>
      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Excluir</Button>
    </TableCell>
  </motion.tr>
);

const DocumentsPage = () => {
  const [documents, setDocuments] = React.useState(initialDocuments);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterClient, setFilterClient] = React.useState("Todos");
  const [filterType, setFilterType] = React.useState("Todos");

  const clients = ["Todos", ...new Set(initialDocuments.map(doc => doc.client))];
  const types = ["Todos", ...new Set(initialDocuments.map(doc => doc.type))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = filterClient === "Todos" || doc.client === filterClient;
    const matchesType = filterType === "Todos" || doc.type === filterType;
    return matchesSearch && matchesClient && matchesType;
  });

  return (
    <div className="space-y-8 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-4xl font-bold gradient-text">Gerenciador de Documentos</h1>
        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Folder className="mr-2 h-5 w-5" /> Nova Pasta
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <UploadCloud className="mr-2 h-5 w-5" /> Upload de Arquivo
          </Button>
        </div>
      </motion.div>

      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-200 mb-4">Filtros e Busca de Documentos</CardTitle>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Buscar por nome do documento..."
                className="pl-10 bg-slate-700/50 border-slate-600 text-gray-200 focus:border-purple-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-gray-300 w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Cliente: {filterClient}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-gray-200">
                <DropdownMenuLabel>Filtrar por Cliente</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {clients.map(client => (
                  <DropdownMenuItem key={client} onSelect={() => setFilterClient(client)} className="hover:bg-slate-700 focus:bg-slate-700">
                    {client}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-gray-300 w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Tipo: {filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-gray-200">
                <DropdownMenuLabel>Filtrar por Tipo</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {types.map(type => (
                  <DropdownMenuItem key={type} onSelect={() => setFilterType(type)} className="hover:bg-slate-700 focus:bg-slate-700">
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-gray-300">Nome do Arquivo</TableHead>
                <TableHead className="text-gray-300">Cliente</TableHead>
                <TableHead className="text-gray-300">Tipo</TableHead>
                <TableHead className="text-gray-300">Tamanho</TableHead>
                <TableHead className="text-gray-300">Data de Upload</TableHead>
                <TableHead className="text-gray-300">Pasta</TableHead>
                <TableHead className="text-right text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <DocumentRow key={doc.id} doc={doc} delay={index * 0.05} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                    Nenhum documento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;