import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Cores para os níveis de permissão
const permissionLevelColors = {
  'admin': 'bg-red-500',
  'editor': 'bg-blue-500',
  'viewer': 'bg-green-500'
};

// Tradução dos níveis de permissão
const permissionLevelNames = {
  'admin': 'Administrador',
  'editor': 'Editor',
  'viewer': 'Visualizador'
};

/**
 * Card que mostra todas as empresas que o usuário atual tem acesso
 */
export default function EmpresasAcessiveisCard() {
  const { user } = useAuth();
  
  // Buscar empresas do usuário autenticado
  const { 
    data: empresasUsuario,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: [`/api/usuarios/${user?.id}/empresas`],
    enabled: !!user?.id,
    retry: 1
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Minhas Empresas
          </CardTitle>
          <CardDescription>
            Empresas às quais você tem acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando empresas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Minhas Empresas
          </CardTitle>
          <CardDescription>
            Empresas às quais você tem acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar empresas: {error?.message || 'Ocorreu um erro desconhecido'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Minhas Empresas
        </CardTitle>
        <CardDescription>
          Empresas às quais você tem acesso
        </CardDescription>
      </CardHeader>
      <CardContent>
        {empresasUsuario?.length > 0 ? (
          <div className="space-y-4">
            {empresasUsuario.map(empresa => (
              <div key={empresa.id} className="border rounded-md p-4 flex justify-between items-center bg-muted/30">
                <div>
                  <h3 className="font-medium">{empresa.nome}</h3>
                  <p className="text-sm text-muted-foreground">CNPJ: {empresa.cnpj}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${permissionLevelColors[empresa.permissionLevel] || 'bg-gray-500'}`}>
                    {permissionLevelNames[empresa.permissionLevel] || empresa.permissionLevel}
                  </Badge>
                  <Badge variant={
                    empresa.status === 'Ativo' ? 'success' :
                    empresa.status === 'Inativo' ? 'destructive' :
                    'secondary'
                  }>
                    {empresa.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground border rounded-md">
            Você não tem acesso a nenhuma empresa. Entre em contato com um administrador.
          </div>
        )}
      </CardContent>
    </Card>
  );
}