import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function SemPermissaoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. Esta área é exclusiva para usuários com permissões específicas.
        </p>
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full flex items-center justify-center gap-2 bg-[#d9bb42] hover:bg-[#c2a73b] text-white">
              <ArrowLeft className="h-4 w-4" />
              Voltar para a página inicial
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/api/login'}
          >
            Fazer login com outra conta
          </Button>
        </div>
      </div>
    </div>
  );
}