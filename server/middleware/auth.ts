import { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../replitAuth";

// Definição dos tipos de modos de visualização
export enum ViewMode {
  ESCRITORIO = 'escritorio',
  EMPRESA = 'empresa', 
  CONTADOR = 'contador',
  EXTERNO = 'externo'
}

// Extensão do tipo Request para incluir propriedades personalizadas
declare global {
  namespace Express {
    interface Request {
      viewMode?: string;
      empresaId?: number;
      user?: any; // Temporário para resolver erros de tipo
    }
  }
}

// Definição das funções de autorização baseadas em modos de visualização
export function viewModeEscritorio(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.viewMode || ViewMode.ESCRITORIO;

  if (viewMode !== ViewMode.ESCRITORIO) {
    return res.status(403).json({ message: "Acesso negado. Este recurso requer o modo de visualização Escritório." });
  }

  next();
}

export function viewModeEmpresa(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.viewMode || ViewMode.ESCRITORIO;

  if (viewMode !== ViewMode.EMPRESA) {
    return res.status(403).json({ message: "Acesso negado. Este recurso requer o modo de visualização Empresa." });
  }

  next();
}

export function viewModeContador(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.viewMode || ViewMode.ESCRITORIO;

  if (viewMode !== ViewMode.CONTADOR) {
    return res.status(403).json({ message: "Acesso negado. Este recurso requer o modo de visualização Contador." });
  }

  next();
}

export function viewModeExterno(req: Request, res: Response, next: NextFunction) {
  const viewMode = req.viewMode || ViewMode.ESCRITORIO;

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

// Função para verificar se o usuário tem uma permissão específica
export function requirePermission(permission: string) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const userPermissions = req.user.permissions || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ message: `Acesso negado. Este recurso requer a permissão ${permission}.` });
    }

    next();
  };
}

// Função para verificar modo de visualização
export function requireViewMode(mode: ViewMode) {
  return (req: any, res: Response, next: NextFunction) => {
    const viewMode = req.viewMode || ViewMode.ESCRITORIO;

    if (viewMode !== mode) {
      return res.status(403).json({ message: `Acesso negado. Este recurso requer o modo de visualização ${mode}.` });
    }

    next();
  };
}

// Função para verificar o acesso a um cliente específico
export function requireClientAccess(req: any, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const clientId = parseInt(req.params.clientId || req.query.clientId || req.body.clientId);

  if (isNaN(clientId)) {
    return res.status(400).json({ message: "ID de cliente inválido" });
  }

  // Aqui seria verificado se o usuário tem acesso ao cliente especificado
  // Para este exemplo, vamos apenas simular a verificação
  const userClients = req.user.clients || [];

  if (!userClients.includes(clientId)) {
    return res.status(403).json({ message: "Acesso negado. Você não tem permissão para acessar este cliente." });
  }

  next();
}

// Exportando função para verificação de papel
export const requireRole = checkRole;

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
  return (req: any, res: Response, next: NextFunction) => {
    const viewMode = req.viewMode as string || ViewMode.ESCRITORIO;

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

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const user = await validateToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ message: 'Erro na autenticação' });
  }
};

async function validateToken(token: string): Promise<any> {
    // Implemente a lógica para validar o token (ex: JWT)
    // e retornar as informações do usuário se o token for válido
    return new Promise((resolve) => {
        setTimeout(() => {
            if (token === "valid_token") {
                resolve({
                    id: 1,
                    name: "John Doe",
                    email: "john.doe@example.com",
                    role: "admin"
                });
            } else {
                resolve(null);
            }
        }, 500);
    });
}