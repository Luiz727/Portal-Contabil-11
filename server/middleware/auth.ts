import { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../replitAuth";

// Definição dos tipos de modos de visualização
export enum ViewMode {
  ESCRITORIO = 'escritorio',
  EMPRESA = 'empresa',
  CONTADOR = 'contador',
  EXTERNO = 'externo'
}

// Definição das funções de autorização baseadas em modos de visualização
export function viewModeEscritorio(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.session?.viewMode as string;
  
  if (viewMode !== ViewMode.ESCRITORIO) {
    return res.status(403).json({ message: "Acesso negado. Este recurso requer o modo de visualização Escritório." });
  }
  
  next();
}

export function viewModeEmpresa(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.session?.viewMode as string;
  
  if (viewMode !== ViewMode.EMPRESA) {
    return res.status(403).json({ message: "Acesso negado. Este recurso requer o modo de visualização Empresa." });
  }
  
  next();
}

export function viewModeContador(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.session?.viewMode as string;
  
  if (viewMode !== ViewMode.CONTADOR) {
    return res.status(403).json({ message: "Acesso negado. Este recurso requer o modo de visualização Contador." });
  }
  
  next();
}

export function viewModeExterno(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.session?.viewMode as string;
  
  if (viewMode !== ViewMode.EXTERNO) {
    return res.status(403).json({ message: "Acesso negado. Este recurso requer o modo de visualização Externo." });
  }
  
  next();
}

// Middleware que verifica se o usuário está autenticado e tem o papel requerido
export function checkRole(role: string) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    const userRole = req.user.role;
    
    if (userRole !== role) {
      return res.status(403).json({ message: `Acesso negado. Este recurso requer o papel de ${role}.` });
    }
    
    next();
  };
}

// Combinação de middlewares para verificação de autenticação e papel
export const isAdmin = [isAuthenticated, checkRole('admin')];
export const isAccountant = [isAuthenticated, checkRole('accountant')];
export const isClient = [isAuthenticated, checkRole('client')];
export const isExternalUser = [isAuthenticated, checkRole('external')];
export const isEscritorioUser = [isAuthenticated, checkRole('escritorio')];

// Middleware que verifica se o usuário está autenticado e tem acesso à empresa específica
export function checkCompanyAccess(req: any, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }
  
  const companyId = parseInt(req.params.companyId || req.query.companyId || req.body.companyId);
  
  if (isNaN(companyId)) {
    return res.status(400).json({ message: "ID de empresa inválido" });
  }
  
  // Em um sistema real, você verificaria se o usuário tem acesso a esta empresa
  // através de uma consulta ao banco de dados ou verificando permissões armazenadas na sessão
  
  // Simulando verificação para este exemplo
  const userCompanies = req.user.companies || [];
  
  if (!userCompanies.includes(companyId)) {
    return res.status(403).json({ message: "Acesso negado. Você não tem permissão para acessar esta empresa." });
  }
  
  next();
}

// Middleware que permite acesso com base no modo de visualização
export function allowViewModes(allowedModes: ViewMode[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const viewMode = req.session?.viewMode as string;
    
    if (!viewMode || !allowedModes.includes(viewMode as ViewMode)) {
      return res.status(403).json({ 
        message: `Acesso negado. Este recurso requer um dos seguintes modos de visualização: ${allowedModes.join(', ')}.` 
      });
    }
    
    next();
  };
}

// Middleware que requer autenticação - exportando o isAuthenticated do replitAuth como requireAuth
export const requireAuth = isAuthenticated;