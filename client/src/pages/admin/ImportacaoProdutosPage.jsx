import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const ImportacaoProdutosPage = () => {
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('importar');
  
  // Referência para o input de arquivo
  const fileInputRef = useRef(null);
  
  // Estado para o arquivo selecionado
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Estado para o progresso da importação
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  
  // Histórico de alterações simulado
  const historicoAlteracoes = [
    { data: '20/05/2025 14:35', usuario: 'João Silva', acao: 'Importação de 25 produtos', detalhes: 'Arquivo: Produtos_Maio2025.xls', status: 'Sucesso' },
    { data: '15/05/2025 09:12', usuario: 'Ana Santos', acao: 'Importação de 12 produtos', detalhes: 'Arquivo: Produtos_Abril2025.xls', status: 'Sucesso' },
    { data: '10/05/2025 16:43', usuario: 'Carlos Oliveira', acao: 'Importação de 5 produtos', detalhes: 'Arquivo: Produtos_Especiais.xls', status: 'Falha' }
  ];
  
  // Função para abrir o seletor de arquivo
  const handleSelectFileClick = () => {
    fileInputRef.current.click();
  };
  
  // Função para lidar com a seleção de arquivo
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };
  
  // Função para baixar o modelo de planilha
  const handleDownloadTemplate = () => {
    console.log('Baixando modelo de planilha...');
    // Aqui implementaríamos a lógica real para download do modelo
  };
  
  // Função para simular a importação
  const handleImportFile = () => {
    if (!selectedFile) return;
    
    setImporting(true);
    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setImporting(false);
            // Simulando um resultado bem-sucedido
            setImportResult({
              success: true,
              message: 'Importação concluída com sucesso!',
              details: 'Foram importados 15 produtos. 10 produtos foram atualizados e 5 produtos foram criados.'
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  // Função para cancelar a importação
  const handleCancelImport = () => {
    setSelectedFile(null);
    setImportResult(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#d9bb42]/10 flex items-center justify-center rounded-lg">
          <Upload size={20} className="text-[#d9bb42]" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Importação de Produtos</h1>
      </div>
      
      <Tabs defaultValue="importar" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="importar" 
            className="py-3 data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white"
          >
            Importar Produtos
          </TabsTrigger>
          <TabsTrigger 
            value="historico" 
            className="py-3 data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white"
          >
            Histórico de Alterações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="importar" className="mt-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-3">Upload da Planilha</h2>
            <p className="text-sm text-gray-500 mb-6">
              Selecione o arquivo Excel (.xls ou .xlsx) com os dados dos produtos. Utilize o padrão SEBRAE (ex: "Produtos_HyCite_Simples.xls" ou similar).
            </p>
            
            <div className="border border-dashed border-gray-300 rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept=".xls,.xlsx"
                />
                
                {!selectedFile && !importing && !importResult && (
                  <>
                    <FileText size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4 text-center">Arraste e solte um arquivo Excel aqui ou clique para selecionar</p>
                    <Button 
                      onClick={handleSelectFileClick} 
                      className="bg-[#d9bb42] hover:bg-[#c5aa3a] text-white"
                    >
                      Escolher arquivo
                    </Button>
                  </>
                )}
                
                {selectedFile && !importing && !importResult && (
                  <div className="w-full">
                    <div className="flex items-center justify-between border border-gray-200 rounded p-3 mb-6">
                      <div className="flex items-center gap-3">
                        <FileText size={24} className="text-[#d9bb42]" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCancelImport} 
                        className="text-gray-500"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleImportFile} 
                        className="bg-[#d9bb42] hover:bg-[#c5aa3a] text-white px-6"
                      >
                        Importar Produtos
                      </Button>
                    </div>
                  </div>
                )}
                
                {importing && (
                  <div className="w-full">
                    <p className="text-center font-medium mb-2">Importando produtos...</p>
                    <Progress value={importProgress} className="mb-4 h-2" />
                    <p className="text-xs text-center text-gray-500">{importProgress}% concluído</p>
                  </div>
                )}
                
                {importResult && (
                  <div className="w-full">
                    <Alert className={importResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                      {importResult.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertTitle className={importResult.success ? "text-green-800" : "text-red-800"}>
                        {importResult.success ? "Importação concluída" : "Erro na importação"}
                      </AlertTitle>
                      <AlertDescription className={importResult.success ? "text-green-700" : "text-red-700"}>
                        {importResult.details}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-center mt-6">
                      <Button 
                        onClick={handleCancelImport} 
                        variant="outline"
                        className="px-6"
                      >
                        Nova Importação
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleDownloadTemplate} 
                variant="outline" 
                className="text-[#d9bb42] border-[#d9bb42] hover:bg-[#d9bb42]/10 flex items-center gap-2"
              >
                <Download size={16} />
                <span>Baixar Modelo da Planilha</span>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="mt-0">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Histórico de Importações</h2>
              <p className="text-sm text-gray-500">Registro de todas as importações de produtos realizadas.</p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Data e Hora</TableHead>
                  <TableHead className="w-[150px]">Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoAlteracoes.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{item.data}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.usuario}</TableCell>
                    <TableCell>{item.acao}</TableCell>
                    <TableCell>{item.detalhes}</TableCell>
                    <TableCell>
                      {item.status === 'Sucesso' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs">
                          <CheckCircle size={12} />
                          Sucesso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs">
                          <AlertTriangle size={12} />
                          Falha
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportacaoProdutosPage;