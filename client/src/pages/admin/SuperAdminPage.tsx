import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function SuperAdminPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const handleSetSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/api/admin/superadmin", {
        email,
        secretKey
      });
      
      setSuccess(true);
      toast({
        title: "Sucesso!",
        description: "Usuário configurado como superadmin com sucesso.",
      });
      
      // Recarregar a página após 2 segundos para atualizar as permissões
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error("Erro ao configurar superadmin:", err);
      setError("Erro ao configurar superadmin. Verifique a chave secreta e tente novamente.");
      toast({
        title: "Erro",
        description: "Não foi possível configurar superadmin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Configuração de SuperAdmin</CardTitle>
          <CardDescription className="text-center">
            Esta página permite configurar um usuário como SuperAdmin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Configuração concluída com sucesso!</p>
                <p className="text-sm mt-1">
                  O usuário {email} agora é um SuperAdmin com acesso total ao sistema.
                </p>
                <p className="text-sm mt-2">
                  A página será recarregada em instantes...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSetSuperAdmin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email do Usuário</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secretKey">Chave Secreta</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    placeholder="Digite a chave secreta"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    A chave secreta para o ambiente de teste é: nixcon2025
                  </p>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full mt-4 bg-[#d9bb42] hover:bg-[#c2a73b] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processando...
                  </>
                ) : (
                  "Configurar SuperAdmin"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-xs text-center text-muted-foreground">
          <p className="w-full">
            Essa é uma funcionalidade administrativa utilizada apenas para
            fins de configuração inicial do sistema.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}