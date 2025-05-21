import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o campo de e-mail",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Usar a rota de desenvolvimento para login
      const response = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: username,
          // Definir role com base no nome de usuário para facilitar os testes
          role: username.includes('admin') ? 'admin' : 
                username.includes('contador') ? 'accountant' : 
                username.includes('empresa') ? 'client' : 'user'
        })
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Salvar no localStorage apenas como backup
        localStorage.setItem('nixcon_user', JSON.stringify({
          ...userData,
          isAuthenticated: true
        }));
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${userData.firstName || userData.email}!`,
        });
        
        // Redirecionamento imediato após o login
        window.location.href = '/';
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Falha no login",
          description: errorData.message || "Erro na autenticação. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para alternar a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/favicon.ico" 
              alt="NIXCON Logo" 
              className="h-12 w-12"
            />
          </div>
          <h1 className="text-2xl font-bold text-nixcon-dark">NIXCON</h1>
          <p className="text-muted-foreground">Portal de Contabilidade</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para entrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email para desenvolvimento</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="Digite seu email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Dica: Para testar diferentes funções, inclua "admin", "contador" ou "empresa" no email.
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#d9bb42] hover:bg-[#c2a73a]"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar para Desenvolvimento"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <div className="text-center">
              <p>Para testes, use:</p>
              <p>Email: admin@nixcon.com (para administrador)</p>
              <p>Email: contador@nixcon.com (para contador)</p>
              <p>Email: empresa@nixcon.com (para empresa)</p>
            </div>
          </CardFooter>
        </Card>
        <p className="text-center mt-4 text-sm text-muted-foreground">
          © 2025 NIXCON. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;