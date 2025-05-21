import { Request, Response, Express } from "express";
import { storage } from "../storage";
import { requireAuth, requireRole, requirePermission } from "../middleware/auth";
import { db } from "../db";
import { roles, permissions, rolePermissions, userRoles } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export function registerPermissionsRoutes(app: Express) {
  // Buscar todas as permissões
  app.get("/api/permissions", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const result = await storage.getAllPermissions();
      res.json(result);
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
      res.status(500).json({ message: "Erro ao buscar permissões" });
    }
  });

  // Buscar permissões por módulo
  app.get("/api/permissions/module/:module", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const module = req.params.module;
      const result = await storage.getPermissionsByModule(module);
      res.json(result);
    } catch (error) {
      console.error("Erro ao buscar permissões do módulo:", error);
      res.status(500).json({ message: "Erro ao buscar permissões do módulo" });
    }
  });

  // Criar uma nova permissão
  app.post("/api/permissions", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const { code, name, description, module } = req.body;
      
      if (!code || !name || !module) {
        return res.status(400).json({ message: "Código, nome e módulo são obrigatórios" });
      }
      
      // Verificar se já existe permissão com o mesmo código
      const existingPermission = await storage.getPermissionByCode(code);
      if (existingPermission) {
        return res.status(400).json({ message: "Já existe uma permissão com este código" });
      }
      
      const permission = await storage.createPermission({
        code,
        name,
        description,
        module
      });
      
      res.status(201).json(permission);
    } catch (error) {
      console.error("Erro ao criar permissão:", error);
      res.status(500).json({ message: "Erro ao criar permissão" });
    }
  });

  // Excluir uma permissão
  app.delete("/api/permissions/:id", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePermission(id);
      
      if (success) {
        res.json({ message: "Permissão excluída com sucesso" });
      } else {
        res.status(404).json({ message: "Permissão não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao excluir permissão:", error);
      res.status(500).json({ message: "Erro ao excluir permissão" });
    }
  });

  // Buscar todos os perfis (roles)
  app.get("/api/roles", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const result = await storage.getAllRoles();
      res.json(result);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
      res.status(500).json({ message: "Erro ao buscar perfis" });
    }
  });

  // Buscar um perfil específico
  app.get("/api/roles/:id", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const role = await storage.getRole(id);
      
      if (!role) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      
      res.json(role);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  });

  // Criar um novo perfil
  app.post("/api/roles", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const { name, description, isSystem } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Nome é obrigatório" });
      }
      
      // Verificar se já existe perfil com o mesmo nome
      const existingRole = await storage.getRoleByName(name);
      if (existingRole) {
        return res.status(400).json({ message: "Já existe um perfil com este nome" });
      }
      
      const role = await storage.createRole({
        name,
        description,
        isSystem: isSystem || false
      });
      
      res.status(201).json(role);
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      res.status(500).json({ message: "Erro ao criar perfil" });
    }
  });

  // Atualizar um perfil
  app.put("/api/roles/:id", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Nome é obrigatório" });
      }
      
      // Verificar se já existe outro perfil com o mesmo nome
      const existingRole = await storage.getRoleByName(name);
      if (existingRole && existingRole.id !== id) {
        return res.status(400).json({ message: "Já existe outro perfil com este nome" });
      }
      
      const role = await storage.updateRole(id, {
        name,
        description
      });
      
      if (!role) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      
      res.json(role);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      
      // Verificar o tipo de erro para fornecer uma mensagem mais adequada
      if (error instanceof Error && error.message === "Cannot modify system roles") {
        return res.status(403).json({ message: "Não é possível modificar perfis do sistema" });
      }
      
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Excluir um perfil
  app.delete("/api/roles/:id", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRole(id);
      
      if (success) {
        res.json({ message: "Perfil excluído com sucesso" });
      } else {
        res.status(404).json({ message: "Perfil não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao excluir perfil:", error);
      
      // Verificar o tipo de erro para fornecer uma mensagem mais adequada
      if (error instanceof Error && error.message === "Cannot delete system roles") {
        return res.status(403).json({ message: "Não é possível excluir perfis do sistema" });
      }
      
      res.status(500).json({ message: "Erro ao excluir perfil" });
    }
  });

  // Buscar permissões de um perfil
  app.get("/api/roles/:id/permissions", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se o perfil existe
      const role = await storage.getRole(id);
      if (!role) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      
      const permissions = await storage.getRolePermissions(id);
      res.json(permissions);
    } catch (error) {
      console.error("Erro ao buscar permissões do perfil:", error);
      res.status(500).json({ message: "Erro ao buscar permissões do perfil" });
    }
  });

  // Adicionar uma permissão a um perfil
  app.post("/api/roles/:roleId/permissions/:permissionId", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const roleId = parseInt(req.params.roleId);
      const permissionId = parseInt(req.params.permissionId);
      
      // Verificar se o perfil existe
      const role = await storage.getRole(roleId);
      if (!role) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      
      // Verificar se a permissão existe
      const permission = await storage.getPermission(permissionId);
      if (!permission) {
        return res.status(404).json({ message: "Permissão não encontrada" });
      }
      
      const rolePermission = await storage.addPermissionToRole(roleId, permissionId);
      res.status(201).json(rolePermission);
    } catch (error) {
      console.error("Erro ao adicionar permissão ao perfil:", error);
      res.status(500).json({ message: "Erro ao adicionar permissão ao perfil" });
    }
  });

  // Remover uma permissão de um perfil
  app.delete("/api/roles/:roleId/permissions/:permissionId", requireAuth, requireRole(["admin"]), async (req: Request, res: Response) => {
    try {
      const roleId = parseInt(req.params.roleId);
      const permissionId = parseInt(req.params.permissionId);
      
      const success = await storage.removePermissionFromRole(roleId, permissionId);
      
      if (success) {
        res.json({ message: "Permissão removida do perfil com sucesso" });
      } else {
        res.status(404).json({ message: "Relação entre perfil e permissão não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao remover permissão do perfil:", error);
      res.status(500).json({ message: "Erro ao remover permissão do perfil" });
    }
  });

  // Verificar se o usuário atual tem permissão específica
  app.get("/api/my-permissions/:permissionCode", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const permissionCode = req.params.permissionCode;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      const hasPermission = await storage.hasPermission(userId, permissionCode);
      res.json({ hasPermission });
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      res.status(500).json({ message: "Erro ao verificar permissão" });
    }
  });

  // Verificar todas as permissões do usuário atual
  app.get("/api/my-permissions", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      // Buscar todos os papéis do usuário
      const userRoles = await storage.getUserRoles(userId);
      
      // Buscar todas as permissões de cada papel
      const permissionsSet = new Set();
      
      for (const role of userRoles) {
        const rolePermissions = await storage.getRolePermissions(role.id);
        rolePermissions.forEach(permission => {
          permissionsSet.add(permission.code);
        });
      }
      
      // Se o usuário tiver o papel "admin" no claims, conceder todas as permissões
      if (req.user?.claims?.role === "admin") {
        const allPermissions = await storage.getAllPermissions();
        allPermissions.forEach(permission => {
          permissionsSet.add(permission.code);
        });
      }
      
      const permissions = Array.from(permissionsSet);
      res.json({ permissions });
    } catch (error) {
      console.error("Erro ao buscar permissões do usuário:", error);
      res.status(500).json({ message: "Erro ao buscar permissões do usuário" });
    }
  });
}