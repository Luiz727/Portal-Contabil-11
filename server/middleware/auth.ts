import { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../replitAuth";
import { db } from "../db";
import { clientUsers, users, userViewModes, VIEW_MODES } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Middleware para verificar se o usuário está autenticado
export const requireAuth = isAuthenticated;

// Middleware para verificar se o usuário tem um papel específico
export const requireRole = (roles: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user?.claims) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    
    const user = req.user.claims;
    const userRole = user?.role || "client"; // Padrão como cliente se não tiver role

    if (roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      message: "Acesso negado. Você não tem permissão para acessar este recurso."
    });
  };
};

// Middleware para verificar permissões em um cliente específico
export const requireClientAccess = (accessLevel: string[] = ["admin", "standard", "basic"]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user?.claims) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    
    const userId = req.user.claims.sub;
    const clientId = parseInt(req.params.clientId || req.body.clientId);
    
    if (!clientId) {
      return res.status(400).json({ message: "ID do cliente não fornecido" });
    }
    
    try {
      // Verifica se o usuário é um admin ou accountant - esses papéis têm acesso a todos os clientes
      const userRole = req.user.claims.role;
      if (userRole === "admin" || userRole === "accountant") {
        return next();
      }
      
      // Busca o relacionamento do usuário com o cliente
      const result = await db.select()
        .from(clientUsers)
        .where(and(
          eq(clientUsers.userId, userId),
          eq(clientUsers.clientId, clientId)
        ));
      
      if (result.length > 0 && accessLevel.includes(result[0].accessLevel)) {
        return next();
      }
      
      return res.status(403).json({
        message: "Acesso negado. Você não tem permissão para acessar este cliente."
      });
    } catch (error) {
      console.error("Erro ao verificar acesso ao cliente:", error);
      return res.status(500).json({ message: "Erro ao verificar acesso ao cliente" });
    }
  };
};

// Middleware para verificar se o usuário está no modo de visualização correto
export const requireViewMode = (viewModes: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user?.claims) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    
    // Buscar o modo de visualização atual do usuário da sessão
    const currentViewMode = req.session.viewMode || VIEW_MODES.ESCRITORIO;
    
    if (viewModes.includes(currentViewMode)) {
      return next();
    }
    
    return res.status(403).json({
      message: `Acesso negado. Este recurso está disponível apenas nos modos: ${viewModes.join(", ")}`
    });
  };
};