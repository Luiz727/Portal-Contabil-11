import { Request, Response, NextFunction } from 'express';

// Definindo os modos de visualização diretamente aqui para evitar problemas de importação
export type ViewMode = 'escritorio' | 'empresa' | 'contador' | 'externo';

// Interface extendida do Express Request para incluir o usuário e o modo de visualização
declare global {
  namespace Express {
    interface Request {
      user?: any;
      viewMode?: ViewMode;
      empresa?: any;
    }
  }
}

// Middleware para verificar se o usuário está autenticado
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Não autorizado',
      message: 'Você precisa estar autenticado para acessar este recurso'
    });
  }
  next();
};

// Middleware para verificar o modo de visualização do usuário
export const checkViewMode = (allowedModes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.viewMode) {
      return res.status(400).json({ 
        error: 'Modo de visualização não definido',
        message: 'É necessário especificar um modo de visualização'
      });
    }
    
    if (!allowedModes.includes(req.viewMode)) {
      return res.status(403).json({ 
        error: 'Modo de visualização não permitido',
        message: `O acesso a este recurso não é permitido no modo de visualização ${req.viewMode}`
      });
    }
    
    next();
  };
};

// Middleware para exigir um modo de visualização específico
export const requireViewMode = (mode: ViewMode | ViewMode[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.viewMode) {
      return res.status(400).json({ 
        error: 'Modo de visualização não definido',
        message: 'É necessário especificar um modo de visualização'
      });
    }
    
    const modes = Array.isArray(mode) ? mode : [mode];
    
    if (!modes.includes(req.viewMode as ViewMode)) {
      return res.status(403).json({ 
        error: 'Modo de visualização não permitido',
        message: `O acesso a este recurso não é permitido no modo de visualização ${req.viewMode}`
      });
    }
    
    next();
  };
};

// Middleware para verificar se o usuário tem uma permissão específica
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Não autorizado',
        message: 'Você precisa estar autenticado para acessar este recurso'
      });
    }
    
    // Verificar se o usuário tem a permissão necessária
    // Isso depende de como as permissões estão estruturadas no seu sistema
    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      return res.status(403).json({ 
        error: 'Permissão negada',
        message: `Você não tem a permissão necessária (${permission}) para acessar este recurso`
      });
    }
    
    next();
  };
};

// Middleware para verificar o papel (role) do usuário
export const requireRole = (role: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Não autorizado',
        message: 'Você precisa estar autenticado para acessar este recurso'
      });
    }
    
    const roles = Array.isArray(role) ? role : [role];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Papel não autorizado',
        message: `Esta ação requer o papel de ${roles.join(' ou ')}`
      });
    }
    
    next();
  };
};

// Middleware para o modo de visualização Escritório
export const requireEscritorioMode = (req: Request, res: Response, next: NextFunction) => {
  if (!req.viewMode || req.viewMode !== 'escritorio') {
    return res.status(403).json({ 
      error: 'Modo de visualização não permitido',
      message: 'Este recurso só pode ser acessado no modo de visualização do Escritório'
    });
  }
  next();
};

// Middleware para o modo de visualização Empresa
export const requireEmpresaMode = (req: Request, res: Response, next: NextFunction) => {
  if (!req.viewMode || req.viewMode !== 'empresa') {
    return res.status(403).json({ 
      error: 'Modo de visualização não permitido',
      message: 'Este recurso só pode ser acessado no modo de visualização da Empresa'
    });
  }
  
  // Verificar se há uma empresa selecionada
  if (!req.empresa) {
    return res.status(400).json({ 
      error: 'Empresa não selecionada',
      message: 'É necessário selecionar uma empresa para acessar este recurso'
    });
  }
  
  next();
};

// Middleware para o modo de visualização Contador
export const requireContadorMode = (req: Request, res: Response, next: NextFunction) => {
  if (!req.viewMode || req.viewMode !== 'contador') {
    return res.status(403).json({ 
      error: 'Modo de visualização não permitido',
      message: 'Este recurso só pode ser acessado no modo de visualização de Contador'
    });
  }
  next();
};

// Middleware para o modo de visualização Externo
export const requireExternoMode = (req: Request, res: Response, next: NextFunction) => {
  if (!req.viewMode || req.viewMode !== 'externo') {
    return res.status(403).json({ 
      error: 'Modo de visualização não permitido',
      message: 'Este recurso só pode ser acessado no modo de visualização Externo'
    });
  }
  next();
};

// Middleware para verificar se o usuário é administrador
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Não autorizado',
      message: 'Você precisa estar autenticado para acessar este recurso'
    });
  }
  
  // Verificar se o usuário é um administrador
  // Isso depende de como os papéis estão estruturados no seu sistema
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Permissão negada',
      message: 'Este recurso só pode ser acessado por administradores'
    });
  }
  
  next();
};

// Combinação de middlewares para escritório com permissões de administrador
export const requireEscritorioAdmin = [requireEscritorioMode, requireAdmin];

// Função para extrair o modo de visualização do cabeçalho
export const extractViewMode = (req: Request, res: Response, next: NextFunction) => {
  const viewMode = req.headers['x-view-mode'] as string;
  
  if (viewMode) {
    req.viewMode = viewMode as ViewMode;
  }
  
  next();
};

// Função para extrair a empresa selecionada (quando no modo empresa)
export const extractEmpresa = (req: Request, res: Response, next: NextFunction) => {
  const empresaId = req.headers['x-empresa-id'] as string;
  
  if (empresaId && req.viewMode === 'empresa') {
    // Aqui você poderia buscar a empresa no banco de dados
    // Por enquanto, apenas definimos o ID
    req.empresa = { id: empresaId };
  }
  
  next();
};

// Middleware para configurar o contexto de visualização
export const setupViewContext = [extractViewMode, extractEmpresa];

// Middleware para verificar acesso a um cliente específico
export const requireClientAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Não autorizado',
      message: 'Você precisa estar autenticado para acessar este recurso'
    });
  }

  const clientId = req.params.clientId || req.body.clientId;
  
  if (!clientId) {
    return res.status(400).json({ 
      error: 'Cliente não especificado',
      message: 'É necessário especificar um cliente para acessar este recurso'
    });
  }
  
  // Usuários com papel 'admin' ou 'escritorio' têm acesso a todos os clientes
  if (req.user.role === 'admin' || req.user.role === 'escritorio') {
    return next();
  }
  
  // Para outros papéis, verificamos se o usuário tem acesso a este cliente específico
  // Isso depende de como as relações entre usuários e clientes estão estruturadas no seu sistema
  const userClientAccess = req.user.clientAccess || [];
  
  if (!userClientAccess.includes(clientId)) {
    return res.status(403).json({ 
      error: 'Acesso negado',
      message: 'Você não tem acesso a este cliente'
    });
  }
  
  next();
};

// Helpers para facilitar o uso nos routes
export const isAuthenticated = requireAuth;
export const isEscritorioUser = requireViewMode('escritorio');