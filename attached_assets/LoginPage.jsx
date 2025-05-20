import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { LogIn } from 'lucide-react';
    import NixconLogo from '@/components/NixconLogo';
    import { motion } from 'framer-motion';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from "@/components/ui/use-toast";

    const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();
      const { login, setLoading: setAuthLoading } = useAuth();
      const { toast } = useToast();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthLoading(true); 

        try {
          const { user: authUser } = await login({ email, password }); 
          if (authUser) {
            toast({
              title: "Login bem-sucedido!",
              description: `Bem-vindo de volta!`,
              className: "bg-green-500 text-white border-green-600",
            });
            navigate('/dashboard');
          } else {
             toast({ 
              variant: "destructive",
              title: "Erro no Login",
              description: "Não foi possível autenticar. Verifique suas credenciais.",
            });
          }
        } catch (error) {
          console.error("Login error:", error);
          toast({
            variant: "destructive",
            title: "Erro no Login",
            description: error.message || "Email ou senha inválidos. Tente novamente.",
          });
        } finally {
          setIsLoading(false);
          setAuthLoading(false);
        }
      };

      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-background">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="bg-card border-border shadow-xl">
              <CardHeader className="text-center">
                <motion.div 
                  className="mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <NixconLogo className="h-20 w-20 text-primary" />
                </motion.div>
                <CardTitle className="text-3xl font-bold text-primary">Bem-vindo ao Nixcon</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Seu sistema de gestão contábil inteligente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-input border-border text-foreground focus:border-primary placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-foreground">Senha</Label>
                      <Button variant="link" className="text-xs text-primary hover:text-primary/80 p-0 h-auto">
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-input border-border text-foreground focus:border-primary placeholder:text-muted-foreground"
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3" disabled={isLoading}>
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                      ) : (
                        <LogIn className="mr-2 h-5 w-5" />
                      )}
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
              <CardFooter className="text-center flex-col space-y-2">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                    Fale Conosco
                  </Button>
                </p>
                <p className="text-xs text-muted-foreground pt-2">
                  Ao continuar, você concorda com nossos <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-xs">Termos de Serviço</Button> e <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto text-xs">Política de Privacidade</Button>.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default LoginPage;