import { Request, Response } from "express";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";
import { Express } from "express";

export function registerAdminRoutes(app: Express) {
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