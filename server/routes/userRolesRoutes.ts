import { Request, Response, Express } from "express";
import { storage } from "../storage";
import { requireAuth, requireRole } from "../middleware/auth";
import { db } from "../db";
import { users, userRoles } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerUserRolesRoutes(app: Express) {
  // Obter todos os usuários com seus papéis
  app.get("/api/users", requireAuth, requireRole(["admin", "accountant"]), async (req: Request, res: Response) => {
    try {
      const allUsers = await storage.getAllUsers();

      // Para cada usuário, buscar seus papéis
      const usersWithRoles = await Promise.all(
        allUsers.map(async (user) => {
          const roles = await storage.getUserRoles(user.id);
          return {
            ...user,
            roles
          };
        })
      );

      res.json(usersWithRoles);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  // Obter um usuário específico com seus papéis
  app.get("/api/users/:id", requireAuth, requireRole(["admin", "accountant"]), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await storage.getUser(id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const roles = await storage.getUserRoles(id);

      res.json({
        ...user,
        roles
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  });

  // Atualizar o papel (role) de um usuário
  app.put("/api/users/:id/role", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "Papel é obrigatório" });
      }

      // Verificar se o usuário existe
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Atualizar o papel do usuário no campo role
      const [updatedUser] = await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      res.json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar papel do usuário:", error);
      res.status(500).json({ message: "Erro ao atualizar papel do usuário" });
    }
  });

  // Atualizar o status (ativo/inativo) de um usuário
  app.put("/api/users/:id/status", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { isActive } = req.body;

      if (isActive === undefined) {
        return res.status(400).json({ message: "Status é obrigatório" });
      }

      // Atualizar o status do usuário
      const updatedUser = await storage.updateUserStatus(id, isActive);

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
      res.status(500).json({ message: "Erro ao atualizar status do usuário" });
    }
  });

  // Obter papéis de um usuário
  app.get("/api/users/:id/roles", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      // Verificar se o usuário existe
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const roles = await storage.getUserRoles(id);
      res.json(roles);
    } catch (error) {
      console.error("Erro ao buscar papéis do usuário:", error);
      res.status(500).json({ message: "Erro ao buscar papéis do usuário" });
    }
  });

  // Adicionar um papel a um usuário
  app.post("/api/users/:userId/roles/:roleId", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const roleId = parseInt(req.params.roleId);

      // Verificar se o usuário existe
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Verificar se o papel existe
      const role = await storage.getRole(roleId);
      if (!role) {
        return res.status(404).json({ message: "Papel não encontrado" });
      }

      const userRole = await storage.addRoleToUser(userId, roleId);
      res.status(201).json(userRole);
    } catch (error) {
      console.error("Erro ao adicionar papel ao usuário:", error);
      res.status(500).json({ message: "Erro ao adicionar papel ao usuário" });
    }
  });

  // Remover um papel de um usuário
  app.delete("/api/users/:userId/roles/:roleId", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const roleId = parseInt(req.params.roleId);

      const success = await storage.removeRoleFromUser(userId, roleId);

      if (success) {
        res.json({ message: "Papel removido do usuário com sucesso" });
      } else {
        res.status(404).json({ message: "Relação entre usuário e papel não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao remover papel do usuário:", error);
      res.status(500).json({ message: "Erro ao remover papel do usuário" });
    }
  });

  // Obter informações do usuário autenticado atual
  app.get("/api/me", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;

      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Buscar papéis e configurações do usuário
      const roles = await storage.getUserRoles(userId);

      // Buscar o modo de visualização atual do usuário
      const viewMode = req.session.viewMode || "escritorio"; // Valor padrão
      let viewModeConfig = null;

      if (viewMode) {
        viewModeConfig = await storage.getUserViewMode(userId, viewMode);
      }

      res.json({
        ...user,
        roles,
        currentViewMode: viewMode,
        viewModeConfig
      });
    } catch (error) {
      console.error("Erro ao buscar informações do usuário atual:", error);
      res.status(500).json({ message: "Erro ao buscar informações do usuário atual" });
    }
  });

  // Atualizar o modo de visualização do usuário atual
  app.post("/api/me/view-mode", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const { viewMode, clientId, activeProfile } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      if (!viewMode) {
        return res.status(400).json({ message: "Modo de visualização é obrigatório" });
      }

      // Salvar o modo de visualização na sessão
      req.session.viewMode = viewMode;

      // Salvar as configurações do modo de visualização no banco de dados
      const viewModeConfig = await storage.saveUserViewMode({
        userId,
        viewMode,
        clientId,
        activeProfile
      });

      res.json(viewModeConfig);
    } catch (error) {
      console.error("Erro ao atualizar modo de visualização:", error);
      res.status(500).json({ message: "Erro ao atualizar modo de visualização" });
    }
  });
}