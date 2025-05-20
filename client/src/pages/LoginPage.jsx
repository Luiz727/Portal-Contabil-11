import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LockKeyhole, Mail, Shield } from 'lucide-react';

/**
 * Página de login do sistema NIXCON
 * Implementa autenticação simplificada para teste durante o desenvolvimento
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Função de login simplificada para testes
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de autenticação
    setTimeout(() => {
      if (email === 'adm@nixcon.com.br' && password === 'Temp123.') {
        // Credenciais de superadmin
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao NIXCON.",
          className: "bg-green-600 text-white",
        });
        
        // Salvar sessão e redirecionar
        localStorage.setItem('nixcon_user', JSON.stringify({
          email: 'adm@nixcon.com.br',
          name: 'Administrador NIXCON',
          role: 'superadmin'
        }));
        
        navigate('/');
      } else if (email === 'escritorio@nixcon.com.br' && password === 'Temp123.') {
        // Credenciais de escritório
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao NIXCON.",
          className: "bg-green-600 text-white",
        });
        
        localStorage.setItem('nixcon_user', JSON.stringify({
          email: 'escritorio@nixcon.com.br',
          name: 'Escritório Contábil',
          role: 'escritorio'
        }));
        
        navigate('/');
      } else if (email === 'empresa@nixcon.com.br' && password === 'Temp123.') {
        // Credenciais de empresa usuária
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao NIXCON.",
          className: "bg-green-600 text-white",
        });
        
        localStorage.setItem('nixcon_user', JSON.stringify({
          email: 'empresa@nixcon.com.br',
          name: 'Empresa ABC Ltda',
          role: 'empresa'
        }));
        
        navigate('/');
      } else if (email === 'cliente@nixcon.com.br' && password === 'Temp123.') {
        // Credenciais de cliente final
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao NIXCON.",
          className: "bg-green-600 text-white",
        });
        
        localStorage.setItem('nixcon_user', JSON.stringify({
          email: 'cliente@nixcon.com.br',
          name: 'Cliente NIXCON',
          role: 'cliente'
        }));
        
        navigate('/');
      } else {
        // Credenciais inválidas
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "E-mail ou senha incorretos. Tente novamente.",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">NIXCON</h1>
          <p className="text-muted-foreground">Sistema Contábil Integrado</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Acesse o sistema com suas credenciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Ambiente Seguro</span>
              </div>
              <p>Credenciais para teste:</p>
              <p className="text-xs">adm@nixcon.com.br | escritorio@nixcon.com.br</p>
              <p className="text-xs">empresa@nixcon.com.br | cliente@nixcon.com.br</p>
              <p className="text-xs font-bold mt-1">Senha para todos: Temp123.</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;