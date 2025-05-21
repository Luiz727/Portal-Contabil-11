import { Request, Response, Express } from "express";
import { storage } from "../storage";
import { requireAuth, requireRole, requireClientAccess } from "../middleware/auth";
import { db } from "../db";
import { clientUsers } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export function registerClientUserRoutes(app: Express) {
  // Obter todos os relacionamentos entre clientes e usuários
  app.get("/api/client-users", requireAuth, requireRole(["admin", "accountant"]), async (req: Request, res: Response) => {
    try {
      // Buscar todos os relacionamentos
      const clientUsers = await db.query.clientUsers.findMany({
        with: {
          client: {
            columns: {
              name: true,
              cnpj: true
            }
          },
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
      
      res.json(clientUsers);
    } catch (error) {
      console.error("Erro ao buscar relacionamentos cliente-usuário:", error);
      res.status(500).json({ message: "Erro ao buscar relacionamentos cliente-usuário" });
    }
  });

  // Obter usuários de um cliente específico
  app.get("/api/clients/:clientId/users", requireAuth, requireClientAccess(), async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      
      // Verificar se o cliente existe
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      // Buscar todos os relacionamentos deste cliente
      const clientUserRelations = await db.query.clientUsers.findMany({
        where: eq(clientUsers.clientId, clientId),
        with: {
          user: true
        }
      });
      
      // Formatar os resultados
      const users = clientUserRelations.map(relation => {
        return {
          id: relation.user.id,
          email: relation.user.email,
          firstName: relation.user.firstName,
          lastName: relation.user.lastName,
          profileImageUrl: relation.user.profileImageUrl,
          role: relation.user.role,
          isActive: relation.user.isActive,
          lastLogin: relation.user.lastLogin,
          createdAt: relation.user.createdAt,
          updatedAt: relation.user.updatedAt,
          accessLevel: relation.accessLevel
        };
      });
      
      res.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários do cliente:", error);
      res.status(500).json({ message: "Erro ao buscar usuários do cliente" });
    }
  });

  // Obter clientes de um usuário específico
  app.get("/api/users/:userId/clients", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.params.userId;
      
      // Verificar se o usuário está buscando seus próprios clientes ou é um admin/accountant
      const isCurrentUser = userId === req.user?.claims?.sub;
      const isAdmin = req.user?.claims?.role === "admin";
      const isAccountant = req.user?.claims?.role === "accountant";
      
      if (!isCurrentUser && !isAdmin && !isAccountant) {
        return res.status(403).json({ 
          message: "Você não tem permissão para visualizar clientes de outros usuários" 
        });
      }
      
      // Buscar todos os relacionamentos deste usuário
      const userClientRelations = await db.query.clientUsers.findMany({
        where: eq(clientUsers.userId, userId),
        with: {
          client: true
        }
      });
      
      // Formatar os resultados
      const clients = userClientRelations.map(relation => {
        return {
          id: relation.client.id,
          name: relation.client.name,
          cnpj: relation.client.cnpj,
          email: relation.client.email,
          phone: relation.client.phone,
          address: relation.client.address,
          city: relation.client.city,
          state: relation.client.state,
          postalCode: relation.client.postalCode,
          groupId: relation.client.groupId,
          responsible: relation.client.responsible,
          active: relation.client.active,
          createdAt: relation.client.createdAt,
          updatedAt: relation.client.updatedAt,
          accessLevel: relation.accessLevel
        };
      });
      
      res.json(clients);
    } catch (error) {
      console.error("Erro ao buscar clientes do usuário:", error);
      res.status(500).json({ message: "Erro ao buscar clientes do usuário" });
    }
  });

  // Adicionar um usuário a um cliente
  app.post("/api/clients/:clientId/users/:userId", requireAuth, requireRole(["admin", "accountant"]), async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const userId = req.params.userId;
      const { accessLevel } = req.body;
      
      if (!accessLevel || !["basic", "standard", "admin"].includes(accessLevel)) {
        return res.status(400).json({ 
          message: "Nível de acesso inválido. Deve ser 'basic', 'standard' ou 'admin'" 
        });
      }
      
      // Verificar se o cliente existe
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      // Verificar se o usuário existe
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Adicionar o relacionamento
      const [clientUser] = await db
        .insert(clientUsers)
        .values({
          clientId,
          userId,
          accessLevel
        })
        .onConflictDoUpdate({
          target: [clientUsers.clientId, clientUsers.userId],
          set: {
            accessLevel
          }
        })
        .returning();
      
      res.status(201).json(clientUser);
    } catch (error) {
      console.error("Erro ao adicionar usuário ao cliente:", error);
      res.status(500).json({ message: "Erro ao adicionar usuário ao cliente" });
    }
  });

  // Remover um usuário de um cliente
  app.delete("/api/clients/:clientId/users/:userId", requireAuth, requireRole(["admin", "accountant"]), async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const userId = req.params.userId;
      
      // Verificar se o cliente existe
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      // Verificar se o usuário existe
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Remover o relacionamento
      const result = await db
        .delete(clientUsers)
        .where(and(
          eq(clientUsers.clientId, clientId),
          eq(clientUsers.userId, userId)
        ));
      
      if (result.rowCount !== null && result.rowCount > 0) {
        res.json({ message: "Usuário removido do cliente com sucesso" });
      } else {
        res.status(404).json({ message: "Relacionamento não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao remover usuário do cliente:", error);
      res.status(500).json({ message: "Erro ao remover usuário do cliente" });
    }
  });

  // Atualizar o nível de acesso de um usuário a um cliente
  app.put("/api/clients/:clientId/users/:userId/access", requireAuth, requireRole(["admin", "accountant"]), async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const userId = req.params.userId;
      const { accessLevel } = req.body;
      
      if (!accessLevel || !["basic", "standard", "admin"].includes(accessLevel)) {
        return res.status(400).json({ 
          message: "Nível de acesso inválido. Deve ser 'basic', 'standard' ou 'admin'" 
        });
      }
      
      // Atualizar o nível de acesso
      const [clientUser] = await db
        .update(clientUsers)
        .set({
          accessLevel
        })
        .where(and(
          eq(clientUsers.clientId, clientId),
          eq(clientUsers.userId, userId)
        ))
        .returning();
      
      if (!clientUser) {
        return res.status(404).json({ message: "Relacionamento não encontrado" });
      }
      
      res.json(clientUser);
    } catch (error) {
      console.error("Erro ao atualizar nível de acesso:", error);
      res.status(500).json({ message: "Erro ao atualizar nível de acesso" });
    }
  });
}