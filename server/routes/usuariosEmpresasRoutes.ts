import { Express, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { insertUsuarioEmpresaSchema } from "@shared/schema";
import { and, eq } from "drizzle-orm";

// Middleware para verificar se o usuário é administrador
const isAdmin = (req: any, res: Response, next: Function) => {
  const user = req.user?.claims;
  const isUserAdmin = user?.role === "admin";
  
  if (!isUserAdmin) {
    return res.status(403).json({ message: "Acesso negado. Permissão de administrador necessária." });
  }
  
  next();
};

export function registerUsuariosEmpresasRoutes(app: Express) {
  // Vincular um usuário a uma empresa
  app.post("/api/usuarios-empresas", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { userId, empresaId, permissionLevel } = req.body;
      
      // Validar os dados recebidos
      const validatedData = insertUsuarioEmpresaSchema.parse({
        userId,
        empresaId,
        permissionLevel: permissionLevel || "viewer"
      });
      
      // Verificar se a vinculação já existe
      const vinculoExistente = await storage.verificarVinculoUsuarioEmpresa(userId, empresaId);
      
      if (vinculoExistente) {
        return res.status(409).json({ 
          message: "Usuário já está vinculado a esta empresa", 
          vinculo: vinculoExistente 
        });
      }
      
      // Criar a vinculação
      const novoVinculo = await storage.vincularUsuarioEmpresa(validatedData);
      
      res.status(201).json(novoVinculo);
    } catch (error: any) {
      console.error("Erro ao vincular usuário à empresa:", error);
      res.status(500).json({ 
        message: "Erro ao vincular usuário à empresa", 
        error: error.message 
      });
    }
  });
  
  // Desvincular um usuário de uma empresa
  app.delete("/api/usuarios-empresas/:userId/:empresaId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { userId, empresaId } = req.params;
      const empresaIdNum = parseInt(empresaId);
      
      // Verificar se a vinculação existe
      const vinculo = await storage.verificarVinculoUsuarioEmpresa(userId, empresaIdNum);
      
      if (!vinculo) {
        return res.status(404).json({ message: "Vinculação não encontrada" });
      }
      
      // Remover a vinculação
      await storage.desvincularUsuarioEmpresa(userId, empresaIdNum);
      
      res.status(200).json({ message: "Vinculação removida com sucesso" });
    } catch (error: any) {
      console.error("Erro ao desvincular usuário da empresa:", error);
      res.status(500).json({ 
        message: "Erro ao desvincular usuário da empresa", 
        error: error.message 
      });
    }
  });
  
  // Atualizar o nível de permissão de um usuário em uma empresa
  app.patch("/api/usuarios-empresas/:userId/:empresaId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { userId, empresaId } = req.params;
      const { permissionLevel } = req.body;
      const empresaIdNum = parseInt(empresaId);
      
      // Validar o nível de permissão
      if (!["admin", "editor", "viewer"].includes(permissionLevel)) {
        return res.status(400).json({ 
          message: "Nível de permissão inválido. Use 'admin', 'editor' ou 'viewer'" 
        });
      }
      
      // Verificar se a vinculação existe
      const vinculo = await storage.verificarVinculoUsuarioEmpresa(userId, empresaIdNum);
      
      if (!vinculo) {
        return res.status(404).json({ message: "Vinculação não encontrada" });
      }
      
      // Atualizar o nível de permissão
      const vinculoAtualizado = await storage.atualizarNivelPermissaoUsuarioEmpresa(
        userId, 
        empresaIdNum, 
        permissionLevel
      );
      
      res.status(200).json(vinculoAtualizado);
    } catch (error: any) {
      console.error("Erro ao atualizar permissão do usuário:", error);
      res.status(500).json({ 
        message: "Erro ao atualizar permissão do usuário", 
        error: error.message 
      });
    }
  });
  
  // Listar empresas de um usuário
  app.get("/api/usuarios/:userId/empresas", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userClaims = req.user?.claims;
      
      // Verificar se o usuário está tentando acessar seus próprios dados ou é admin
      if (userClaims?.sub !== userId && userClaims?.role !== "admin") {
        return res.status(403).json({ 
          message: "Acesso negado. Você só pode ver suas próprias empresas."
        });
      }
      
      // Buscar as empresas do usuário
      const empresas = await storage.getEmpresasDoUsuario(userId);
      
      res.status(200).json(empresas);
    } catch (error: any) {
      console.error("Erro ao buscar empresas do usuário:", error);
      res.status(500).json({ 
        message: "Erro ao buscar empresas do usuário", 
        error: error.message 
      });
    }
  });
  
  // Listar usuários de uma empresa
  app.get("/api/empresas/:empresaId/usuarios", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { empresaId } = req.params;
      const userClaims = req.user?.claims;
      const empresaIdNum = parseInt(empresaId);
      
      // Verificar se o usuário tem acesso à empresa (é administrador ou está vinculado à empresa)
      if (userClaims?.role !== "admin") {
        const vinculo = await storage.verificarVinculoUsuarioEmpresa(userClaims?.sub, empresaIdNum);
        if (!vinculo || vinculo.permissionLevel === "viewer") {
          return res.status(403).json({ 
            message: "Acesso negado. Você não tem permissão para ver os usuários desta empresa."
          });
        }
      }
      
      // Buscar os usuários da empresa
      const usuarios = await storage.getUsuariosDaEmpresa(empresaIdNum);
      
      res.status(200).json(usuarios);
    } catch (error: any) {
      console.error("Erro ao buscar usuários da empresa:", error);
      res.status(500).json({ 
        message: "Erro ao buscar usuários da empresa", 
        error: error.message 
      });
    }
  });
  
  // Verificar vinculação específica
  app.get("/api/usuarios-empresas/:userId/:empresaId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId, empresaId } = req.params;
      const userClaims = req.user?.claims;
      const empresaIdNum = parseInt(empresaId);
      
      // Verificar se o usuário tem acesso a esta informação
      if (userClaims?.sub !== userId && userClaims?.role !== "admin") {
        const vinculoRequerente = await storage.verificarVinculoUsuarioEmpresa(userClaims?.sub, empresaIdNum);
        if (!vinculoRequerente || vinculoRequerente.permissionLevel !== "admin") {
          return res.status(403).json({ 
            message: "Acesso negado. Você não tem permissão para ver esta vinculação."
          });
        }
      }
      
      // Buscar a vinculação
      const vinculo = await storage.verificarVinculoUsuarioEmpresa(userId, empresaIdNum);
      
      if (!vinculo) {
        return res.status(404).json({ message: "Vinculação não encontrada" });
      }
      
      res.status(200).json(vinculo);
    } catch (error: any) {
      console.error("Erro ao verificar vinculação:", error);
      res.status(500).json({ 
        message: "Erro ao verificar vinculação", 
        error: error.message 
      });
    }
  });
}