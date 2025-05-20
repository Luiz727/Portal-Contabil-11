import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware para verificar se o usuário é um superadmin (email: adm@nixcon.com.br)
 * Usado para proteger rotas administrativas do sistema
 */
export function isSuperAdmin(req: any, res: Response, next: NextFunction) {
  try {
    // Verifica se o usuário está autenticado
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Verifica se o email do usuário é o do superadmin
    const userEmail = req.user.claims?.email;
    
    if (userEmail === 'adm@nixcon.com.br') {
      // É o superadmin, permite o acesso
      return next();
    }
    
    // Não é o superadmin, nega o acesso
    return res.status(403).json({ 
      message: 'Acesso negado',
      details: 'Esta operação requer privilégios de superadmin'
    });
  } catch (error) {
    console.error('Erro ao verificar superadmin:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

/**
 * Middleware para verificar se o usuário pertence ao escritório de contabilidade
 * Usado para proteger rotas do escritório
 */
export function isEscritorioUser(req: any, res: Response, next: NextFunction) {
  try {
    // Verifica se o usuário está autenticado
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Verifica o email para o superadmin
    const userEmail = req.user.claims?.email;
    if (userEmail === 'adm@nixcon.com.br') {
      // É o superadmin, permite o acesso
      return next();
    }

    // Verifica o perfil do usuário para escritório
    const userRole = req.user.claims?.role;
    if (userRole === 'escritorio' || userRole === 'admin') {
      // É um usuário do escritório ou admin, permite o acesso
      return next();
    }
    
    // Não é usuário do escritório, nega o acesso
    return res.status(403).json({ 
      message: 'Acesso negado',
      details: 'Esta operação requer privilégios de escritório de contabilidade'
    });
  } catch (error) {
    console.error('Erro ao verificar usuário de escritório:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

/**
 * Middleware para verificar se o usuário é uma empresa usuária
 * Usado para proteger rotas das empresas
 */
export function isEmpresaUser(req: any, res: Response, next: NextFunction) {
  try {
    // Verifica se o usuário está autenticado
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Verifica o email para o superadmin
    const userEmail = req.user.claims?.email;
    if (userEmail === 'adm@nixcon.com.br') {
      // É o superadmin, permite o acesso
      return next();
    }

    // Verifica o perfil do usuário
    const userRole = req.user.claims?.role;
    if (userRole === 'empresa' || userRole === 'escritorio' || userRole === 'admin') {
      // É uma empresa, escritório ou admin, permite o acesso
      return next();
    }
    
    // Não é empresa usuária, nega o acesso
    return res.status(403).json({ 
      message: 'Acesso negado',
      details: 'Esta operação requer privilégios de empresa usuária'
    });
  } catch (error) {
    console.error('Erro ao verificar usuário de empresa:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

/**
 * Middleware para verificar acesso contextual a uma empresa específica
 */
export function checkEmpresaAccess(empresaIdParam: string = 'empresaId') {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      // Verifica se o usuário está autenticado
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      // Superadmin tem acesso a todas as empresas
      const userEmail = req.user.claims?.email;
      if (userEmail === 'adm@nixcon.com.br') {
        return next();
      }

      // Admin e escritório têm acesso a todas as empresas
      const userRole = req.user.claims?.role;
      if (userRole === 'admin' || userRole === 'escritorio') {
        return next();
      }

      // Empresas só têm acesso aos seus próprios dados
      if (userRole === 'empresa') {
        const empresaId = req.params[empresaIdParam] || req.body[empresaIdParam];
        const userEmpresaId = req.user.claims?.empresaId;

        if (!userEmpresaId || userEmpresaId !== empresaId) {
          return res.status(403).json({
            message: 'Acesso negado',
            details: 'Você não tem permissão para acessar dados desta empresa'
          });
        }
      }

      // Se chegou até aqui, permite o acesso
      next();
    } catch (error) {
      console.error('Erro ao verificar acesso a empresa:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}