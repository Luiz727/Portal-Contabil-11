import { Request, Response, NextFunction } from 'express';
import { UserRole, SystemModule, AccessLevel, hasModuleAccess } from '../../shared/auth/permissions';

/**
 * Middleware para verificar permissões de acesso a módulos do sistema
 */
export function requireModuleAccess(module: SystemModule, requiredLevel: AccessLevel = AccessLevel.READ) {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      // Verifica se o usuário está autenticado
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      // Extrai o papel do usuário e suas permissões personalizadas
      const userRole = req.user.claims?.role as UserRole || UserRole.CLIENTE;
      const customPermissions = req.user.claims?.customPermissions;

      // Verifica se o usuário tem acesso ao módulo com o nível requerido
      if (!hasModuleAccess(userRole, module, requiredLevel, customPermissions)) {
        return res.status(403).json({ 
          message: 'Acesso negado',
          details: `Você não tem permissão para acessar este recurso: ${module} (nível ${requiredLevel} requerido)`
        });
      }

      // Se tudo estiver OK, prossegue para o próximo middleware/controlador
      next();
    } catch (error) {
      console.error('Erro no middleware de permissões:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}

/**
 * Middleware para verificar se o usuário é um administrador do sistema
 */
export function requireAdmin() {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      
      const userRole = req.user.claims?.role as UserRole || UserRole.CLIENTE;
      
      if (userRole !== UserRole.ADMIN) {
        return res.status(403).json({ 
          message: 'Acesso negado',
          details: 'Esta operação requer privilégios de administrador'
        });
      }
      
      next();
    } catch (error) {
      console.error('Erro no middleware de administrador:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}

/**
 * Middleware para verificar se o usuário é do escritório de contabilidade
 */
export function requireEscritorio() {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      
      const userRole = req.user.claims?.role as UserRole || UserRole.CLIENTE;
      
      if (userRole !== UserRole.ESCRITORIO && userRole !== UserRole.ADMIN) {
        return res.status(403).json({ 
          message: 'Acesso negado',
          details: 'Esta operação requer privilégios de escritório de contabilidade'
        });
      }
      
      next();
    } catch (error) {
      console.error('Erro no middleware de escritório:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}

/**
 * Middleware para verificar se o usuário é uma empresa usuária ou superior
 */
export function requireEmpresa() {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      
      const userRole = req.user.claims?.role as UserRole || UserRole.CLIENTE;
      
      if (userRole !== UserRole.EMPRESA && userRole !== UserRole.ESCRITORIO && userRole !== UserRole.ADMIN) {
        return res.status(403).json({ 
          message: 'Acesso negado',
          details: 'Esta operação requer privilégios de empresa usuária'
        });
      }
      
      next();
    } catch (error) {
      console.error('Erro no middleware de empresa:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}

/**
 * Middleware de contexto: verifica se o usuário tem direito a acessar dados de uma empresa específica
 */
export function requireEmpresaContext(empresaIdParamName: string = 'empresaId') {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      
      const userRole = req.user.claims?.role as UserRole || UserRole.CLIENTE;
      const empresaId = req.params[empresaIdParamName] || req.body[empresaIdParamName];
      
      // Administradores e escritório têm acesso a todas as empresas
      if (userRole === UserRole.ADMIN || userRole === UserRole.ESCRITORIO) {
        return next();
      }
      
      // Empresas só podem acessar seus próprios dados
      if (userRole === UserRole.EMPRESA) {
        const userEmpresaId = req.user.claims?.empresaId;
        
        if (!userEmpresaId || userEmpresaId !== empresaId) {
          return res.status(403).json({ 
            message: 'Acesso negado',
            details: 'Você não tem permissão para acessar dados desta empresa'
          });
        }
      }
      
      // Clientes só podem acessar dados se estiverem explicitamente vinculados
      if (userRole === UserRole.CLIENTE) {
        const userClienteId = req.user.claims?.id;
        
        // Aqui precisaríamos verificar se este cliente está vinculado à empresa
        // Isso requer uma consulta ao banco de dados
        
        // Temporariamente, negamos acesso para clientes
        return res.status(403).json({ 
          message: 'Acesso negado',
          details: 'Clientes não podem acessar dados diretos de empresas'
        });
      }
      
      next();
    } catch (error) {
      console.error('Erro no middleware de contexto de empresa:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}