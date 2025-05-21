import { Request, Response, Express } from "express";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";

export function registerEmpresasRoutes(app: Express) {
  // Buscar todas as empresas disponíveis para o usuário atual
  app.get("/api/empresas", requireAuth, async (req: Request, res: Response) => {
    try {
      // Em um sistema real, você buscaria isso do banco de dados
      // com base no usuário autenticado e suas permissões
      
      // Simulando dados de empresas para teste
      const empresas = [
        { id: 1, nome: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90", cidade: "São Paulo", estado: "SP" },
        { id: 2, nome: "XYZ Comércio S.A.", cnpj: "23.456.789/0001-01", cidade: "Rio de Janeiro", estado: "RJ" },
        { id: 3, nome: "Tech Solutions ME", cnpj: "34.567.890/0001-12", cidade: "Belo Horizonte", estado: "MG" },
        { id: 4, nome: "Indústria Nacional EPP", cnpj: "45.678.901/0001-23", cidade: "Curitiba", estado: "PR" }
      ];
      
      res.json({ empresas });
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      res.status(500).json({ 
        message: "Erro ao buscar empresas",
        error: (error as Error).message 
      });
    }
  });

  // Buscar detalhes de uma empresa específica
  app.get("/api/empresas/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const empresaId = parseInt(req.params.id);
      
      if (isNaN(empresaId)) {
        return res.status(400).json({ message: "ID de empresa inválido" });
      }
      
      // Simulando dados de uma empresa específica
      // Em um sistema real, você buscaria isso do banco de dados
      const empresas = [
        { id: 1, nome: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90", cidade: "São Paulo", estado: "SP", 
          endereco: "Av. Paulista, 1000", cep: "01310-000", email: "contato@empresaabc.com", telefone: "(11) 3333-4444" },
        { id: 2, nome: "XYZ Comércio S.A.", cnpj: "23.456.789/0001-01", cidade: "Rio de Janeiro", estado: "RJ", 
          endereco: "Av. Rio Branco, 500", cep: "20040-002", email: "contato@xyzcomercio.com", telefone: "(21) 2222-3333" },
        { id: 3, nome: "Tech Solutions ME", cnpj: "34.567.890/0001-12", cidade: "Belo Horizonte", estado: "MG", 
          endereco: "Av. Afonso Pena, 2000", cep: "30130-007", email: "contato@techsolutions.com", telefone: "(31) 3333-2222" },
        { id: 4, nome: "Indústria Nacional EPP", cnpj: "45.678.901/0001-23", cidade: "Curitiba", estado: "PR", 
          endereco: "Rua XV de Novembro, 700", cep: "80020-310", email: "contato@industrianacional.com", telefone: "(41) 4444-5555" }
      ];
      
      const empresa = empresas.find(e => e.id === empresaId);
      
      if (!empresa) {
        return res.status(404).json({ message: "Empresa não encontrada" });
      }
      
      res.json({ empresa });
    } catch (error) {
      console.error("Erro ao buscar detalhes da empresa:", error);
      res.status(500).json({ 
        message: "Erro ao buscar detalhes da empresa",
        error: (error as Error).message 
      });
    }
  });

  // Atualizar a empresa atual do usuário
  app.post("/api/empresa-atual", requireAuth, async (req: Request, res: Response) => {
    try {
      const { empresaId } = req.body;
      
      if (empresaId === undefined || isNaN(parseInt(empresaId.toString()))) {
        return res.status(400).json({ message: "ID de empresa inválido" });
      }
      
      // Em um sistema real, você verificaria se o usuário tem acesso a esta empresa
      // e salvaria a preferência no banco de dados
      
      // Simulando dados para teste
      const empresas = [
        { id: 1, nome: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90" },
        { id: 2, nome: "XYZ Comércio S.A.", cnpj: "23.456.789/0001-01" },
        { id: 3, nome: "Tech Solutions ME", cnpj: "34.567.890/0001-12" },
        { id: 4, nome: "Indústria Nacional EPP", cnpj: "45.678.901/0001-23" }
      ];
      
      const empresa = empresas.find(e => e.id === parseInt(empresaId.toString()));
      
      if (!empresa) {
        return res.status(404).json({ message: "Empresa não encontrada" });
      }
      
      res.json({ 
        message: "Empresa atual atualizada com sucesso",
        empresa 
      });
    } catch (error) {
      console.error("Erro ao atualizar empresa atual:", error);
      res.status(500).json({ 
        message: "Erro ao atualizar empresa atual",
        error: (error as Error).message 
      });
    }
  });
}