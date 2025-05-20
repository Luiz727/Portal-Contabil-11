import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Calendar, User, Edit, Trash2, Eye, Send } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const SavedSimulationsList = ({ 
  simulations, 
  handleEditSimulation, 
  handleDeleteSimulation,
  handleSendOrder 
}) => {
  if (!simulations || simulations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Save className="mr-2 h-5 w-5 text-primary" />
            Simulações Salvas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Save className="h-12 w-12 text-muted-foreground opacity-20 mb-3" />
          <h3 className="text-lg font-medium">Nenhuma simulação salva</h3>
          <p className="text-muted-foreground text-center max-w-sm mt-1 mb-4">
            As simulações que você salvar aparecerão aqui para consulta futura.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Save className="mr-2 h-5 w-5 text-primary" />
          Simulações Salvas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="space-y-4">
            {simulations.map((simulation, index) => {
              const simulationDate = new Date(simulation.data);
              const timeAgo = formatDistanceToNow(simulationDate, { 
                addSuffix: true,
                locale: ptBR 
              });
              
              const totalProducts = simulation.produtos?.length || 0;
              const totalValue = simulation.summary?.faturamentoTotal || 
                simulation.produtos?.reduce((sum, p) => sum + (p.valorVendaTotal || 0), 0) || 0;
                
              return (
                <motion.div
                  key={simulation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AccordionItem 
                    value={simulation.id} 
                    className="border rounded-lg p-0 overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-accent/50 [&[data-state=open]]:bg-accent/50">
                      <div className="flex flex-1 items-center space-x-2 text-left mr-2">
                        <div className="font-medium truncate flex-1">
                          {simulation.clienteNome || 'Simulação sem cliente'}
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(totalValue)}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-4 pt-0 pb-3">
                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Data: </span>
                            <span className="ml-1 text-foreground">
                              {new Date(simulation.data).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="ml-1 text-xs">({timeAgo})</span>
                          </div>
                          
                          <div className="flex items-center text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            <span>Cliente: </span>
                            <span className="ml-1 text-foreground">
                              {simulation.clienteNome || 'Não informado'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                          <div className="p-2 bg-primary/5 rounded border border-primary/10">
                            <p className="text-muted-foreground">Produtos</p>
                            <p className="font-medium">{totalProducts}</p>
                          </div>
                          
                          <div className="p-2 bg-primary/5 rounded border border-primary/10">
                            <p className="text-muted-foreground">Faturamento</p>
                            <p className="font-medium">
                              {new Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              }).format(totalValue)}
                            </p>
                          </div>
                          
                          <div className="p-2 bg-primary/5 rounded border border-primary/10">
                            <p className="text-muted-foreground">Impostos</p>
                            <p className="font-medium">
                              {simulation.summary ? 
                                new Intl.NumberFormat('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL' 
                                }).format(simulation.summary.impostosVendas + 
                                          simulation.summary.impostosCompras + 
                                          simulation.summary.difal) : 
                                'N/D'}
                            </p>
                          </div>
                          
                          <div className="p-2 bg-primary/5 rounded border border-primary/10">
                            <p className="text-muted-foreground">Lucro</p>
                            <p className={`font-medium ${
                              simulation.summary?.lucroBruto > 0 ? 'text-green-600' : 
                              simulation.summary?.lucroBruto < 0 ? 'text-red-600' : ''
                            }`}>
                              {simulation.summary?.lucroBruto !== undefined ? 
                                new Intl.NumberFormat('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL' 
                                }).format(simulation.summary.lucroBruto) : 
                                'N/D'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => handleEditSimulation(simulation)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Detalhes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-primary hover:text-primary-foreground hover:bg-primary"
                            onClick={() => handleSendOrder(simulation.id)}
                          >
                            <Send className="h-3.5 w-3.5 mr-1" />
                            Enviar Pedido
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            onClick={() => handleDeleteSimulation(simulation.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedSimulationsList;