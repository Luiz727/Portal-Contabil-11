import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, FileText, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

/**
 * Componente para exibir a lista de simulações salvas
 * Permite editar e excluir simulações anteriores
 */
const SavedSimulationsList = ({ 
  simulations, 
  onEditSimulation, 
  onDeleteSimulation 
}) => {
  if (!simulations || simulations.length === 0) {
    return (
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
            Simulações Salvas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 border border-dashed rounded-md bg-gray-50">
            <p className="text-gray-500">Nenhuma simulação salva</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crie uma nova simulação e salve-a para visualizar aqui
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Simulações Salvas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Impostos</TableHead>
                <TableHead>Lucro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulations.map((simulation) => {
                const impostoTotal = simulation.summary 
                  ? simulation.summary.impostosVendas + simulation.summary.impostosCompras + simulation.summary.difal
                  : 0;
                  
                return (
                  <TableRow key={simulation.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{simulation.data}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{simulation.clienteNome || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(simulation.summary?.faturamentoTotal || 0)}</TableCell>
                    <TableCell>{formatCurrency(impostoTotal)}</TableCell>
                    <TableCell>{formatCurrency(simulation.summary?.lucroBruto || 0)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => onEditSimulation(simulation)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteSimulation(simulation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedSimulationsList;