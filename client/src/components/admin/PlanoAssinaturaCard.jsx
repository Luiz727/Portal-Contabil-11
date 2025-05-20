import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Edit, Trash2, Zap, Users, Database, Info, Box, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Componente de Card para exibir informações de um plano de assinatura
 */
const PlanoAssinaturaCard = ({ 
  plano, 
  onEdit, 
  onDelete 
}) => {
  const { 
    id, 
    nome, 
    preco, 
    descricao, 
    recursos, 
    modulosDisponiveis, 
    tagModulos
  } = plano;

  // Formata o preço para exibição em formato de moeda brasileira
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);

  // Ícone para cada tipo de recurso
  const getIconForRecurso = (recurso) => {
    if (recurso.toLowerCase().includes('emissão') || recurso.toLowerCase().includes('nf-e')) {
      return <Box className="h-4 w-4 mr-2 text-green-500" />;
    } else if (recurso.toLowerCase().includes('cadastro') || recurso.toLowerCase().includes('produtos')) {
      return <Database className="h-4 w-4 mr-2 text-blue-500" />;
    } else if (recurso.toLowerCase().includes('suporte')) {
      return <Info className="h-4 w-4 mr-2 text-amber-500" />;
    } else if (recurso.toLowerCase().includes('cliente') || recurso.toLowerCase().includes('portal')) {
      return <Users className="h-4 w-4 mr-2 text-purple-500" />;
    } else if (recurso.toLowerCase().includes('financeiro')) {
      return <DollarSign className="h-4 w-4 mr-2 text-green-500" />;
    } else if (recurso.toLowerCase().includes('api') || recurso.toLowerCase().includes('integração')) {
      return <Zap className="h-4 w-4 mr-2 text-orange-500" />;
    } else if (recurso.toLowerCase().includes('gerente') || recurso.toLowerCase().includes('dedicado')) {
      return <Users className="h-4 w-4 mr-2 text-indigo-500" />;
    } else {
      return <Plus className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            {nome}
          </CardTitle>
          <DollarSign className="h-6 w-6 text-green-500" />
        </div>
        <div className="mt-1 text-2xl font-bold">
          {precoFormatado}
          <span className="text-sm font-normal text-muted-foreground">/mês</span>
        </div>
        <p className="text-sm text-muted-foreground">{descricao}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">RECURSOS PRINCIPAIS:</h4>
            <ul className="space-y-2">
              {recursos.map((recurso, index) => (
                <li key={index} className="flex items-center text-sm">
                  {getIconForRecurso(recurso)}
                  <span>{recurso}</span>
                </li>
              ))}
              {recursos.length < 3 && (
                <li className="text-xs text-muted-foreground mt-1 pl-6">
                  + recursos adicionais configuráveis
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">MÓDULOS:</h4>
            <div className="flex flex-wrap gap-2">
              {tagModulos ? (
                <Badge className="bg-primary-500/20 text-primary border border-primary/30">
                  {tagModulos}
                </Badge>
              ) : (
                modulosDisponiveis?.map((modulo, index) => (
                  <Badge 
                    key={index} 
                    className="bg-primary/20 text-primary border border-primary/30"
                  >
                    {modulo}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-primary hover:text-primary-600"
          onClick={() => onEdit(id)}
        >
          <Edit className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive-600"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanoAssinaturaCard;