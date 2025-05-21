import { Request, Response } from "express";
import { db } from "../db";
import { users, roles, permissions, rolePermissions, userRoles, VIEW_MODES } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";
import { Express } from "express";
import { storage } from "../storage";

// Middleware para verificar se o usuário é admin ou superadmin
const isAdminOrSuperAdmin = async (req: any, res: Response, next: Function) => {
  try {
    if (!req.user || !req.user.claims || !req.user.claims.sub) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return res.status(403).json({ message: "Permissão negada: apenas administradores podem acessar esta funcionalidade" });
    }
    
    next();
  } catch (error) {
    console.error("Erro ao verificar permissões de administrador:", error);
    return res.status(500).json({ message: "Erro ao verificar permissões" });
  }
};

export function registerAdminRoutes(app: Express) {
  
  // Rotas para usuários
  app.get("/api/admin/users", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ message: "Erro ao listar usuários" });
    }
  });
  
  app.patch("/api/admin/users/:id/status", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: "Status inválido" });
      }
      
      const user = await storage.updateUserStatus(id, isActive);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      return res.json(user);
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
      return res.status(500).json({ message: "Erro ao atualizar status do usuário" });
    }
  });
  
  // Rotas para papéis (roles)
  app.get("/api/admin/roles", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const roles = await storage.getAllRoles();
      return res.json(roles);
    } catch (error) {
      console.error("Erro ao listar papéis:", error);
      return res.status(500).json({ message: "Erro ao listar papéis" });
    }
  });
  
  app.post("/api/admin/roles", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Nome do papel é obrigatório" });
      }
      
      // Verificar se já existe um papel com o mesmo nome
      const existingRole = await storage.getRoleByName(name);
      if (existingRole) {
        return res.status(409).json({ message: "Já existe um papel com este nome" });
      }
      
      const role = await storage.createRole({ name, description, isSystem: false });
      return res.status(201).json(role);
    } catch (error) {
      console.error("Erro ao criar papel:", error);
      return res.status(500).json({ message: "Erro ao criar papel" });
    }
  });
  
  app.put("/api/admin/roles/:id", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Nome do papel é obrigatório" });
      }
      
      const roleId = parseInt(id);
      if (isNaN(roleId)) {
        return res.status(400).json({ message: "ID do papel inválido" });
      }
      
      // Verificar se o papel existe
      const existingRole = await storage.getRole(roleId);
      if (!existingRole) {
        return res.status(404).json({ message: "Papel não encontrado" });
      }
      
      // Verificar se já existe outro papel com o mesmo nome
      const roleWithSameName = await storage.getRoleByName(name);
      if (roleWithSameName && roleWithSameName.id !== roleId) {
        return res.status(409).json({ message: "Já existe outro papel com este nome" });
      }
      
      try {
        const updatedRole = await storage.updateRole(roleId, { name, description });
        return res.json(updatedRole);
      } catch (error: any) {
        if (error.message === "Cannot modify system roles") {
          return res.status(403).json({ message: "Não é possível modificar papéis do sistema" });
        }
        throw error;
      }
    } catch (error) {
      console.error("Erro ao atualizar papel:", error);
      return res.status(500).json({ message: "Erro ao atualizar papel" });
    }
  });
  
  app.delete("/api/admin/roles/:id", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const roleId = parseInt(id);
      if (isNaN(roleId)) {
        return res.status(400).json({ message: "ID do papel inválido" });
      }
      
      try {
        const deleted = await storage.deleteRole(roleId);
        if (!deleted) {
          return res.status(404).json({ message: "Papel não encontrado" });
        }
        
        return res.status(204).end();
      } catch (error: any) {
        if (error.message === "Cannot delete system roles") {
          return res.status(403).json({ message: "Não é possível excluir papéis do sistema" });
        }
        throw error;
      }
    } catch (error) {
      console.error("Erro ao excluir papel:", error);
      return res.status(500).json({ message: "Erro ao excluir papel" });
    }
  });
  
  // Rotas para permissões
  app.get("/api/admin/permissions", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const permissions = await storage.getAllPermissions();
      return res.json(permissions);
    } catch (error) {
      console.error("Erro ao listar permissões:", error);
      return res.status(500).json({ message: "Erro ao listar permissões" });
    }
  });
  
  app.get("/api/admin/permissions/module/:module", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { module } = req.params;
      const permissions = await storage.getPermissionsByModule(module);
      return res.json(permissions);
    } catch (error) {
      console.error(`Erro ao listar permissões do módulo ${req.params.module}:`, error);
      return res.status(500).json({ message: "Erro ao listar permissões do módulo" });
    }
  });
  
  app.post("/api/admin/permissions", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { code, name, description, module } = req.body;
      
      if (!code || !name || !module) {
        return res.status(400).json({ message: "Código, nome e módulo são obrigatórios" });
      }
      
      // Verificar se já existe uma permissão com o mesmo código
      const existingPermission = await storage.getPermissionByCode(code);
      if (existingPermission) {
        return res.status(409).json({ message: "Já existe uma permissão com este código" });
      }
      
      const permission = await storage.createPermission({ code, name, description, module });
      return res.status(201).json(permission);
    } catch (error) {
      console.error("Erro ao criar permissão:", error);
      return res.status(500).json({ message: "Erro ao criar permissão" });
    }
  });
  
  // Rotas para associação de permissões a papéis
  app.get("/api/admin/roles/:id/permissions", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const roleId = parseInt(id);
      if (isNaN(roleId)) {
        return res.status(400).json({ message: "ID do papel inválido" });
      }
      
      const permissions = await storage.getRolePermissions(roleId);
      return res.json(permissions);
    } catch (error) {
      console.error("Erro ao listar permissões do papel:", error);
      return res.status(500).json({ message: "Erro ao listar permissões do papel" });
    }
  });
  
  app.post("/api/admin/roles/:roleId/permissions/:permissionId", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { roleId, permissionId } = req.params;
      
      const parsedRoleId = parseInt(roleId);
      const parsedPermissionId = parseInt(permissionId);
      
      if (isNaN(parsedRoleId) || isNaN(parsedPermissionId)) {
        return res.status(400).json({ message: "IDs inválidos" });
      }
      
      // Verificar se o papel e a permissão existem
      const role = await storage.getRole(parsedRoleId);
      const permission = await storage.getPermission(parsedPermissionId);
      
      if (!role) {
        return res.status(404).json({ message: "Papel não encontrado" });
      }
      
      if (!permission) {
        return res.status(404).json({ message: "Permissão não encontrada" });
      }
      
      const rolePermission = await storage.addPermissionToRole(parsedRoleId, parsedPermissionId);
      return res.status(201).json(rolePermission);
    } catch (error) {
      console.error("Erro ao adicionar permissão ao papel:", error);
      return res.status(500).json({ message: "Erro ao adicionar permissão ao papel" });
    }
  });
  
  app.delete("/api/admin/roles/:roleId/permissions/:permissionId", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { roleId, permissionId } = req.params;
      
      const parsedRoleId = parseInt(roleId);
      const parsedPermissionId = parseInt(permissionId);
      
      if (isNaN(parsedRoleId) || isNaN(parsedPermissionId)) {
        return res.status(400).json({ message: "IDs inválidos" });
      }
      
      const removed = await storage.removePermissionFromRole(parsedRoleId, parsedPermissionId);
      
      if (!removed) {
        return res.status(404).json({ message: "Associação entre papel e permissão não encontrada" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Erro ao remover permissão do papel:", error);
      return res.status(500).json({ message: "Erro ao remover permissão do papel" });
    }
  });
  
  // Rotas para associação de papéis a usuários
  app.get("/api/admin/users/:id/roles", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const roles = await storage.getUserRoles(id);
      return res.json(roles);
    } catch (error) {
      console.error("Erro ao listar papéis do usuário:", error);
      return res.status(500).json({ message: "Erro ao listar papéis do usuário" });
    }
  });
  
  app.post("/api/admin/users/:userId/roles/:roleId", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { userId, roleId } = req.params;
      
      const parsedRoleId = parseInt(roleId);
      
      if (isNaN(parsedRoleId)) {
        return res.status(400).json({ message: "ID do papel inválido" });
      }
      
      // Verificar se o usuário e o papel existem
      const user = await storage.getUser(userId);
      const role = await storage.getRole(parsedRoleId);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      if (!role) {
        return res.status(404).json({ message: "Papel não encontrado" });
      }
      
      const userRole = await storage.addRoleToUser(userId, parsedRoleId);
      return res.status(201).json(userRole);
    } catch (error) {
      console.error("Erro ao adicionar papel ao usuário:", error);
      return res.status(500).json({ message: "Erro ao adicionar papel ao usuário" });
    }
  });
  
  app.delete("/api/admin/users/:userId/roles/:roleId", isAuthenticated, isAdminOrSuperAdmin, async (req: Request, res: Response) => {
    try {
      const { userId, roleId } = req.params;
      
      const parsedRoleId = parseInt(roleId);
      
      if (isNaN(parsedRoleId)) {
        return res.status(400).json({ message: "ID do papel inválido" });
      }
      
      const removed = await storage.removeRoleFromUser(userId, parsedRoleId);
      
      if (!removed) {
        return res.status(404).json({ message: "Associação entre usuário e papel não encontrada" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Erro ao remover papel do usuário:", error);
      return res.status(500).json({ message: "Erro ao remover papel do usuário" });
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