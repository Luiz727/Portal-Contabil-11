import React, { useState, useRef } from 'react';
import { useProdutos } from '@/contexts/ProdutosContext';
import { useEmpresas } from '@/contexts/EmpresasContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileSpreadsheet, Upload, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function ImportadorProdutos({ children }) {
  const { importarProdutos } = useProdutos();
  const { empresas, actingAsEmpresa, userType } = useEmpresas();
  const { toast } = useToast();
  
  const fileInputRef = useRef(null);
  const [arquivo, setArquivo] = useState(null);
  const [formato, setFormato] = useState('SEBRAE');
  const [importandoUniversal, setImportandoUniversal] = useState(true);
  const [empresaTarget, setEmpresaTarget] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [open, setOpen] = useState(false);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validações básicas
      const valido = validarArquivo(file);
      if (valido) {
        setArquivo(file);
      } else {
        toast({
          variant: "destructive",
          title: "Arquivo inválido",
          description: "Por favor, selecione uma planilha Excel (.xls ou .xlsx)",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  const validarArquivo = (file) => {
    const tiposPermitidos = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    return tiposPermitidos.includes(file.type) || 
           file.name.endsWith('.xls') || 
           file.name.endsWith('.xlsx') ||
           file.name.endsWith('.csv');
  };
  
  const handleImportar = async () => {
    if (!arquivo) {
      toast({
        variant: "destructive",
        title: "Selecione um arquivo",
        description: "Por favor, selecione uma planilha para importar",
      });
      return;
    }
    
    setProcessando(true);
    setProgresso(0);
    setResultado(null);
    
    // Simulação do progresso (em ambiente real seria o progresso real)
    const interval = setInterval(() => {
      setProgresso(prev => {
        const next = prev + Math.floor(Math.random() * 10);
        return next > 90 ? 90 : next;
      });
    }, 200);
    
    try {
      // Obter a empresa alvo se não for importação universal
      const empresaId = !importandoUniversal ? 
        (empresaTarget || (actingAsEmpresa ? actingAsEmpresa.id : null)) : 
        null;
      
      // Em ambiente real, seria feito upload e processamento do arquivo
      const result = await importarProdutos(arquivo, formato, empresaId);
      
      // Simulação da resposta da API
      clearInterval(interval);
      setProgresso(100);
      
      setTimeout(() => {
        setResultado(result);
        setProcessando(false);
        
        if (result.sucesso) {
          toast({
            title: "Importação concluída",
            description: `${result.produtosImportados} produtos importados, ${result.produtosAtualizados} atualizados.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro na importação",
            description: result.mensagem || "Ocorreu um erro durante a importação.",
          });
        }
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setProcessando(false);
      
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro inesperado durante a importação.",
      });
    }
  };
  
  const resetForm = () => {
    setArquivo(null);
    setFormato('SEBRAE');
    setImportandoUniversal(true);
    setEmpresaTarget(null);
    setProcessando(false);
    setProgresso(0);
    setResultado(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Determina se pode fazer importação universal (apenas escritório)
  const podeImportarUniversal = userType === 'Escritorio';
  
  // Se não puder importar universal, força como específico
  React.useEffect(() => {
    if (!podeImportarUniversal && importandoUniversal) {
      setImportandoUniversal(false);
    }
  }, [podeImportarUniversal, importandoUniversal]);
  
  // Ao abrir o importador, limpa o formulário
  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importar Produtos
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importar Produtos</DialogTitle>
          <DialogDescription>
            Importe uma lista de produtos a partir de uma planilha no formato pré-definido.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Arquivo */}
          <div className="space-y-2">
            <Label htmlFor="arquivo">Arquivo de Produtos</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                id="arquivo"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={processando}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={processando}
                className="w-full justify-start"
              >
                <Upload className="mr-2 h-4 w-4" />
                {arquivo ? arquivo.name : 'Selecionar arquivo...'}
              </Button>
              
              {arquivo && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setArquivo(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  disabled={processando}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              Formatos aceitos: Excel (.xls, .xlsx) ou CSV.
            </p>
          </div>
          
          {/* Formato */}
          <div className="space-y-2">
            <Label htmlFor="formato">Formato</Label>
            <Select
              value={formato}
              onValueChange={setFormato}
              disabled={processando}
            >
              <SelectTrigger id="formato">
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEBRAE">Padrão SEBRAE</SelectItem>
                <SelectItem value="INTERNO">Formato Interno</SelectItem>
                <SelectItem value="SIMPLES">Formato Simples</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[0.8rem] text-muted-foreground">
              O formato determina como os dados serão interpretados. Escolha o que corresponde à estrutura do seu arquivo.
            </p>
          </div>
          
          {/* Tipo de Importação */}
          {podeImportarUniversal && (
            <div className="space-y-2">
              <Label>Tipo de Importação</Label>
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="universal"
                    name="tipoImportacao"
                    checked={importandoUniversal}
                    onChange={() => setImportandoUniversal(true)}
                    disabled={processando}
                  />
                  <Label htmlFor="universal" className="cursor-pointer">
                    Produtos Universais (para todas empresas selecionadas)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="especifico"
                    name="tipoImportacao"
                    checked={!importandoUniversal}
                    onChange={() => setImportandoUniversal(false)}
                    disabled={processando}
                  />
                  <Label htmlFor="especifico" className="cursor-pointer">
                    Produtos Específicos (para uma empresa)
                  </Label>
                </div>
              </div>
            </div>
          )}
          
          {/* Seleção de Empresa (somente se for específico) */}
          {!importandoUniversal && podeImportarUniversal && (
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select
                value={empresaTarget ? String(empresaTarget) : ''}
                onValueChange={(value) => setEmpresaTarget(value ? Number(value) : null)}
                disabled={processando}
              >
                <SelectTrigger id="empresa">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {actingAsEmpresa && (
                    <SelectItem value={String(actingAsEmpresa.id)}>
                      {actingAsEmpresa.nome} (atual)
                    </SelectItem>
                  )}
                  {empresas.map(empresa => (
                    <SelectItem 
                      key={empresa.id} 
                      value={String(empresa.id)}
                      disabled={actingAsEmpresa && actingAsEmpresa.id === empresa.id}
                    >
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Área de Progresso */}
          {processando && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Processando Importação</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progresso} className="h-2" />
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  {progresso < 100 
                    ? "Analisando e processando produtos..." 
                    : "Finalizando importação..."}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Resultado */}
          {resultado && (
            <Alert variant={resultado.sucesso ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {resultado.sucesso ? "Importação concluída" : "Erro na importação"}
              </AlertTitle>
              <AlertDescription className="space-y-2">
                {resultado.sucesso ? (
                  <div className="mt-2 space-y-1">
                    <p>• {resultado.produtosImportados} produtos importados</p>
                    <p>• {resultado.produtosAtualizados} produtos atualizados</p>
                    {resultado.produtosComErro > 0 && (
                      <p>• {resultado.produtosComErro} produtos com erro</p>
                    )}
                  </div>
                ) : (
                  <p>{resultado.mensagem || "Ocorreu um erro durante a importação."}</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={processando}
          >
            {resultado ? "Fechar" : "Cancelar"}
          </Button>
          
          {!resultado && (
            <Button 
              onClick={handleImportar}
              disabled={!arquivo || processando}
            >
              <Upload className="mr-2 h-4 w-4" />
              Iniciar Importação
            </Button>
          )}
          
          {resultado && resultado.sucesso && (
            <Button 
              onClick={resetForm}
              variant="outline"
            >
              Importar mais produtos
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}