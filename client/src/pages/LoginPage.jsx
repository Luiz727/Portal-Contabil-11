import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Mail } from 'lucide-react';

/**
 * Página de Login para o sistema NIXCON
 * Implementa autenticação com suporte a camadas de acesso
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Função que manipula o login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verificação específica para o superadmin adm@nixcon.com.br
      if (email === 'adm@nixcon.com.br' && password === 'Temp123.') {
        // Login direto para o superadmin (em produção seria via API)
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo administrador NIXCON!",
          variant: "success",
        });
        
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);
        return;
      }
      
      // Para outros usuários, tentar login via API normal
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema NIXCON!",
        variant: "success",
      });

      // Redirecionar para dashboard após login
      setLocation('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro de login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">NIXCON</h1>
          <p className="mt-2 text-gray-600">Sistema de Contabilidade</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Digite seu email e senha para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              <p>
                Acesse com seu email e senha fornecidos pelo escritório de contabilidade
              </p>
            </div>
            
            {/* Mensagem especial para demonstração */}
            <div className="rounded-md bg-gray-100 p-3 text-xs text-gray-600">
              <p className="font-semibold">Demonstração:</p>
              <p>Para acesso como superadmin, use:</p>
              <p>Email: adm@nixcon.com.br</p>
              <p>Senha: Temp123.</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;