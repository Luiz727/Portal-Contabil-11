import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Reconciliation() {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Fetch financial accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["/api/financial/accounts"],
    queryFn: async () => {
      // This is just a placeholder since we don't have the endpoint yet
      return [
        { id: 1, name: "Conta Bancária Principal", type: "checking", bankName: "Banco do Brasil", currentBalance: 45000, clientId: 1 },
        { id: 2, name: "Conta Poupança", type: "savings", bankName: "Caixa Econômica", currentBalance: 75000, clientId: 1 },
        { id: 3, name: "Conta Cartão de Crédito", type: "credit_card", bankName: "Nubank", currentBalance: -2500, clientId: 1 },
      ];
    }
  });

  // Fetch transactions for reconciliation
  const { data: reconciliationData, isLoading } = useQuery({
    queryKey: ["/api/financial/reconciliation", selectedAccount],
    enabled: !!selectedAccount,
    queryFn: async () => {
      // This is just a placeholder since we don't have the endpoint yet
      return {
        systemTransactions: [
          { id: 1, description: "Pagamento de Serviços", date: "2023-06-10", amount: 3500, status: "completed", type: "income" },
          { id: 2, description: "Aluguel do Escritório", date: "2023-06-05", amount: 4500, status: "completed", type: "expense" },
          { id: 3, description: "Compra de Material", date: "2023-06-15", amount: 1200, status: "completed", type: "expense" },
          { id: 4, description: "Consultoria Técnica", date: "2023-06-18", amount: 2800, status: "completed", type: "income" },
        ],
        bankTransactions: [
          { id: 101, description: "TED - Serviços Contábeis", date: "2023-06-10", amount: 3500 },
          { id: 102, description: "Débito - Aluguel", date: "2023-06-05", amount: -4500 },
          { id: 103, description: "Débito - Material Escritório", date: "2023-06-15", amount: -1200 },
          { id: 104, description: "TED - Recebimento", date: "2023-06-18", amount: 2800 },
          { id: 105, description: "Taxa Bancária", date: "2023-06-25", amount: -89.90 },
        ],
        matchedTransactions: [
          { systemId: 1, bankId: 101, match: true },
          { systemId: 2, bankId: 102, match: true },
          { systemId: 3, bankId: 103, match: true },
          { systemId: 4, bankId: 104, match: true },
        ],
        unmatchedSystem: [],
        unmatchedBank: [
          { id: 105, description: "Taxa Bancária", date: "2023-06-25", amount: -89.90 }
        ],
        summary: {
          systemBalance: 600,
          bankBalance: 510.10,
          difference: 89.90
        }
      };
    }
  });

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real implementation, the file would be uploaded to the server
    // For now, just close the dialog and show a success message
    setTimeout(() => {
      setIsImportDialogOpen(false);
    }, 1000);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Conciliação Bancária</h2>
          <p className="mt-1 text-sm text-neutral-500">Concilie suas transações do sistema com os extratos bancários</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="material-icons text-sm mr-1">upload_file</span>
                Importar Extrato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Importar Extrato Bancário</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Conta Bancária</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.map((account: any) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.name} - {account.bankName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Formato do Arquivo</label>
                  <Select defaultValue="ofx">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ofx">OFX - Open Financial Exchange</SelectItem>
                      <SelectItem value="csv">CSV - Valores Separados por Vírgula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Período do Extrato</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-500">Data Inicial</label>
                      <input type="date" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500">Data Final</label>
                      <input type="date" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="relative border-2 border-neutral-300 border-dashed rounded-lg p-6 flex justify-center items-center">
                    <div className="text-center">
                      <span className="material-icons text-neutral-400 mx-auto">cloud_upload</span>
                      <p className="mt-1 text-sm text-neutral-500">
                        <span className="font-medium text-primary-600 hover:text-primary-500">Clique para selecionar</span>
                        {" "}ou arraste e solte o arquivo
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">OFX, CSV até 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept=".ofx,.csv"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button disabled>
                  Importar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Account Selection */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Selecione a Conta para Conciliação</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta bancária" />
                </SelectTrigger>
                <SelectContent>
                  {!isLoadingAccounts && accounts?.map((account: any) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name} - {account.bankName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end gap-2">
              <Button variant="outline" className="flex-1">
                <span className="material-icons text-sm mr-1">sync</span>
                Conciliar Automaticamente
              </Button>
              <Button variant="outline">
                <span className="material-icons text-sm">save</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedAccount ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <span className="material-icons text-neutral-400 text-5xl mb-4">account_balance</span>
          <h3 className="text-xl font-medium text-neutral-800 mb-2">Selecione uma Conta Bancária</h3>
          <p className="text-neutral-500 mb-6">Para iniciar a conciliação, selecione uma conta bancária acima</p>
          <Button onClick={() => setIsImportDialogOpen(true)}>
            <span className="material-icons text-sm mr-1">upload_file</span>
            Importar Extrato
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20 bg-white rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Reconciliation Summary */}
          <div className="p-6 border-b border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">Saldo no Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-blue-600">
                    {formatCurrency(reconciliationData?.summary.systemBalance || 0)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">Saldo Bancário</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatCurrency(reconciliationData?.summary.bankBalance || 0)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">Diferença</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-semibold ${reconciliationData?.summary.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(reconciliationData?.summary.difference || 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {reconciliationData?.summary.difference !== 0 && (
              <Alert variant="warning" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  Existem diferenças entre o saldo do sistema e o extrato bancário. Verifique as transações não conciliadas abaixo.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Reconciliation Tabs */}
          <Tabs defaultValue="matched" className="w-full">
            <div className="px-6 py-4 border-b border-neutral-200">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="matched">Conciliadas</TabsTrigger>
                <TabsTrigger value="unmatched">Pendentes</TabsTrigger>
                <TabsTrigger value="all">Todas</TabsTrigger>
              </TabsList>
            </div>

            {/* Matched Transactions */}
            <TabsContent value="matched" className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição no Sistema</TableHead>
                    <TableHead>Descrição no Banco</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliationData?.matchedTransactions.map((match: any) => {
                    const systemTx = reconciliationData.systemTransactions.find(tx => tx.id === match.systemId);
                    const bankTx = reconciliationData.bankTransactions.find(tx => tx.id === match.bankId);
                    
                    if (!systemTx || !bankTx) return null;
                    
                    return (
                      <TableRow key={`${match.systemId}-${match.bankId}`}>
                        <TableCell>
                          <Badge variant="success" className="flex items-center w-fit">
                            <Check className="h-3 w-3 mr-1" />
                            Conciliado
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(systemTx.date)}</TableCell>
                        <TableCell>{systemTx.description}</TableCell>
                        <TableCell>{bankTx.description}</TableCell>
                        <TableCell className={`text-right font-medium ${systemTx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(systemTx.amount))}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <span className="material-icons text-sm">link_off</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Unmatched Transactions */}
            <TabsContent value="unmatched" className="p-6">
              <div className="space-y-8">
                {/* Unmatched System Transactions */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Transações do Sistema não Conciliadas</h3>
                  {reconciliationData?.unmatchedSystem?.length === 0 ? (
                    <p className="text-neutral-500 italic">Todas as transações do sistema foram conciliadas.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reconciliationData?.unmatchedSystem?.map((tx: any) => (
                          <TableRow key={tx.id}>
                            <TableCell>{formatDate(tx.date)}</TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell>
                              <Badge variant={tx.type === 'income' ? 'success' : 'destructive'}>
                                {tx.type === 'income' ? 'Receita' : 'Despesa'}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(tx.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                <span className="material-icons text-sm">link</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                
                {/* Unmatched Bank Transactions */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Transações do Banco não Conciliadas</h3>
                  {reconciliationData?.unmatchedBank?.length === 0 ? (
                    <p className="text-neutral-500 italic">Todas as transações do banco foram conciliadas.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reconciliationData?.unmatchedBank?.map((tx: any) => (
                          <TableRow key={tx.id}>
                            <TableCell>{formatDate(tx.date)}</TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell className={`text-right font-medium ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(tx.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm">
                                  <span className="material-icons text-sm">link</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <span className="material-icons text-sm">add</span>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <span className="material-icons text-sm">not_interested</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* All Transactions */}
            <TabsContent value="all" className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Combined and sorted list of all transactions */}
                  {[
                    ...reconciliationData?.systemTransactions.map((tx: any) => ({
                      ...tx,
                      origin: 'system',
                      matched: reconciliationData.matchedTransactions.some((m: any) => m.systemId === tx.id)
                    })),
                    ...reconciliationData?.bankTransactions.map((tx: any) => ({
                      ...tx,
                      origin: 'bank',
                      matched: reconciliationData.matchedTransactions.some((m: any) => m.bankId === tx.id),
                      type: tx.amount >= 0 ? 'income' : 'expense'
                    }))
                  ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((tx: any, idx: number) => (
                      <TableRow key={`${tx.origin}-${tx.id}`}>
                        <TableCell>
                          {tx.matched ? (
                            <Badge variant="success" className="flex items-center w-fit">
                              <Check className="h-3 w-3 mr-1" />
                              Conciliado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center w-fit">
                              <X className="h-3 w-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(tx.date)}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>
                          <Badge variant={tx.origin === 'system' ? 'primary' : 'secondary'}>
                            {tx.origin === 'system' ? 'Sistema' : 'Banco'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(tx.amount))}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <span className="material-icons text-sm">{tx.matched ? 'link_off' : 'link'}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
