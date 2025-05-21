import { Request, Response } from "express";
import { db } from "../db";
import { users, empresasUsuarias, insertEmpresaUsuariaSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";
import { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";

export function registerAdminRoutes(app: Express) {
  // Rotas para Empresas Usuárias (clientes do escritório de contabilidade)
  
  // Listar todas as empresas usuárias
  app.get("/api/empresas-usuarias", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const empresas = await storage.getEmpresasUsuarias();
      return res.status(200).json(empresas);
    } catch (error) {
      console.error("Erro ao buscar empresas usuárias:", error);
      return res.status(500).json({ message: "Erro ao buscar empresas usuárias" });
    }
  });

  // Buscar empresa usuária por ID
  app.get("/api/empresas-usuarias/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const empresa = await storage.getEmpresaUsuaria(id);
      if (!empresa) {
        return res.status(404).json({ message: "Empresa usuária não encontrada" });
      }

      return res.status(200).json(empresa);
    } catch (error) {
      console.error("Erro ao buscar empresa usuária:", error);
      return res.status(500).json({ message: "Erro ao buscar empresa usuária" });
    }
  });

  // Criar nova empresa usuária
  app.post("/api/empresas-usuarias", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validationResult = insertEmpresaUsuariaSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Dados inválidos para criação da empresa usuária", 
          errors: validationResult.error.format() 
        });
      }

      const empresaData = validationResult.data;
      const novaEmpresa = await storage.createEmpresaUsuaria(empresaData);
      
      return res.status(201).json({
        message: "Empresa usuária criada com sucesso",
        empresa: novaEmpresa
      });
    } catch (error) {
      console.error("Erro ao criar empresa usuária:", error);
      return res.status(500).json({ message: "Erro ao criar empresa usuária" });
    }
  });

  // Atualizar empresa usuária existente
  app.patch("/api/empresas-usuarias/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      // Verificar se a empresa existe
      const empresaExistente = await storage.getEmpresaUsuaria(id);
      if (!empresaExistente) {
        return res.status(404).json({ message: "Empresa usuária não encontrada" });
      }

      // Validar os dados de atualização
      const validationSchema = insertEmpresaUsuariaSchema.partial();
      const validationResult = validationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Dados inválidos para atualização da empresa usuária", 
          errors: validationResult.error.format() 
        });
      }

      const empresaData = validationResult.data;
      const empresaAtualizada = await storage.updateEmpresaUsuaria(id, empresaData);
      
      return res.status(200).json({
        message: "Empresa usuária atualizada com sucesso",
        empresa: empresaAtualizada
      });
    } catch (error) {
      console.error("Erro ao atualizar empresa usuária:", error);
      return res.status(500).json({ message: "Erro ao atualizar empresa usuária" });
    }
  });

  // Listar empresas usuárias por status
  app.get("/api/empresas-usuarias/status/:status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const status = req.params.status;
      if (!status) {
        return res.status(400).json({ message: "Status é obrigatório" });
      }

      const empresas = await storage.getEmpresasUsuariasByStatus(status);
      return res.status(200).json(empresas);
    } catch (error) {
      console.error("Erro ao buscar empresas por status:", error);
      return res.status(500).json({ message: "Erro ao buscar empresas por status" });
    }
  });
  // Rota para atualizar o papel do usuário (apenas para administradores)
  app.post("/api/admin/user/role", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.body;
      
      if (!userId || !role) {
        return res.status(400).json({ message: "ID do usuário e função são obrigatórios" });
      }
      
      // Verificar se o papel é válido
      if (!["admin", "superadmin", "accountant", "client"].includes(role)) {
        return res.status(400).json({ message: "Função inválida" });
      }
      
      // Atualizar o papel do usuário
      const [updatedUser] = await db
        .update(users)
        .set({ 
          role,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      return res.status(200).json({ 
        message: "Função do usuário atualizada com sucesso", 
        user: updatedUser
      });
    } catch (error) {
      console.error("Erro ao atualizar função do usuário:", error);
      return res.status(500).json({ message: "Erro ao atualizar função do usuário" });
    }
  });

  // Rota específica para configurar superadmin
  app.post("/api/admin/superadmin", async (req: Request, res: Response) => {
    try {
      const { email, secretKey } = req.body;
      
      // Verificar a chave secreta (uma medida básica de segurança)
      if (secretKey !== "nixcon2025") {
        return res.status(401).json({ message: "Chave secreta inválida" });
      }
      
      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" });
      }
      
      // Buscar o usuário pelo email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Atualizar o papel do usuário para superadmin
      const [updatedUser] = await db
        .update(users)
        .set({ 
          role: "superadmin",
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id))
        .returning();
      
      return res.status(200).json({ 
        message: `Usuário ${email} configurado como superadmin com sucesso`, 
        user: updatedUser
      });
    } catch (error) {
      console.error("Erro ao configurar superadmin:", error);
      return res.status(500).json({ message: "Erro ao configurar superadmin" });
    }
  });
}