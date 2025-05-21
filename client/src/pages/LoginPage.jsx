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
    
    if (!username || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Neste momento estamos usando login simulado
      // Posteriormente isso será substituído por uma chamada à API
      setTimeout(() => {
        // Usuários mock para testes
        const users = [
          { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
          { username: 'contador', password: 'contador123', role: 'accountant', name: 'Contador' },
          { username: 'empresa', password: 'empresa123', role: 'client', name: 'Empresa' }
        ];
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
          // Em produção, aqui seria o token JWT recebido do backend
          localStorage.setItem('nixcon_user', JSON.stringify({
            id: Math.random().toString(36).substr(2, 9),
            username: user.username,
            name: user.name,
            role: user.role,
            isAuthenticated: true
          }));
          
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${user.name}!`,
          });
          
          // Redirecionamento imediato após o login
          window.location.href = '/';
          // Não usamos navigate() porque queremos recarregar a página por completo
          // para garantir que todos os contextos sejam recarregados
        } else {
          toast({
            title: "Falha no login",
            description: "Usuário ou senha incorretos",
            variant: "destructive",
          });
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
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
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#d9bb42] hover:bg-[#c2a73a]"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <div className="text-center">
              <p>Para testes, use:</p>
              <p>Usuário: admin | Senha: admin123</p>
              <p>Usuário: contador | Senha: contador123</p>
              <p>Usuário: empresa | Senha: empresa123</p>
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