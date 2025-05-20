import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          variant: "success",
        });
        setLocation('/');
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">NIXCON</h1>
          <p className="text-gray-600 mt-2">Sistema de Contabilidade e Gestão Fiscal</p>
        </div>
        
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-center">Acesso ao Sistema</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-sm text-center text-gray-600 mt-2">
              <div className="mb-1">
                <span>Acesso para demonstração:</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs bg-gray-50 p-2 rounded">
                <div>Admin: <strong>adm@nixcon.com.br</strong></div>
                <div>Senha: <strong>Temp123.</strong></div>
                
                <div>Cliente: <strong>cliente@exemplo.com</strong></div>
                <div>Senha: <strong>cliente</strong></div>
                
                <div>Contador: <strong>contador@nixcon.com.br</strong></div>
                <div>Senha: <strong>contador</strong></div>
                
                <div>Visitante: <strong>visitante@exemplo.com</strong></div>
                <div>Senha: <strong>visitante</strong></div>
              </div>
            </div>
            
            <div className="w-full pt-4 text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation('/tax-calculator')}
              >
                Acessar Calculadora de Impostos
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;