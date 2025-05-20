import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="material-icons text-white">account_balance</span>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <CardTitle className="text-4xl font-bold">
              <span className="text-amber-500">NIX</span>
              <span className="text-gray-600">CON</span>
            </CardTitle>
          </div>
          <CardDescription>
            Sistema completo para escritórios de contabilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <p className="text-sm text-neutral-500 mb-4">
              Faça login para acessar o sistema
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={() => window.location.href = "/api/login"} 
                className="w-full"
              >
                Entrar na Plataforma
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full text-center text-xs text-neutral-500">
            <p>© 2023-2025 NIXCON. Todos os direitos reservados.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
