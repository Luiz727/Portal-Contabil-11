import { Express, Request, Response } from 'express';
import { isAuthenticated } from '../replitAuth';
import { isSuperAdmin, isEscritorioUser, isEmpresaUser } from '../middlewares/adminCheck';

/**
 * Rotas administrativas com controle de acesso em camadas
 * Implementa verificações para superadmin, escritório e empresas
 */
export function registerAdminRoutes(app: Express) {
  
  // Rota apenas para superadmin (adm@nixcon.com.br)
  app.get('/api/admin/superadmin', isAuthenticated, isSuperAdmin, (req, res) => {
    res.json({
      message: 'Acesso de superadmin confirmado!',
      access: 'superadmin'
    });
  });
  
  // Rota para usuários do escritório (inclui superadmin)
  app.get('/api/admin/escritorio', isAuthenticated, isEscritorioUser, (req, res) => {
    res.json({
      message: 'Acesso de escritório de contabilidade confirmado!',
      access: 'escritorio'
    });
  });
  
  // Rota para empresas usuárias (inclui escritório e superadmin)
  app.get('/api/admin/empresa', isAuthenticated, isEmpresaUser, (req, res) => {
    res.json({
      message: 'Acesso de empresa usuária confirmado!',
      access: 'empresa'
    });
  });
  
  // Rota para verificar papel do usuário atual
  app.get('/api/admin/meu-acesso', isAuthenticated, (req: any, res) => {
    const userEmail = req.user.claims?.email;
    const userRole = req.user.claims?.role;
    
    let accessLevel = 'cliente';
    
    if (userEmail === 'adm@nixcon.com.br') {
      accessLevel = 'superadmin';
    } else if (userRole === 'admin') {
      accessLevel = 'admin';
    } else if (userRole === 'escritorio') {
      accessLevel = 'escritorio';
    } else if (userRole === 'empresa') {
      accessLevel = 'empresa';
    }
    
    res.json({
      email: userEmail,
      role: userRole,
      accessLevel: accessLevel,
      isSuperAdmin: userEmail === 'adm@nixcon.com.br'
    });
  });
  
  // Rota para ver informações do sistema (apenas para superadmin)
  app.get('/api/admin/sistema/info', isAuthenticated, isSuperAdmin, (req, res) => {
    // Informações que apenas o superadmin deveria ver
    res.json({
      nome: 'NIXCON - Sistema de Contabilidade',
      versao: '1.0.0',
      ambiente: process.env.NODE_ENV || 'development',
      banco: 'Supabase',
      superadmin: 'adm@nixcon.com.br',
      usuarios: {
        escritorio: '3 usuários',  // Dados fictícios para exemplo
        empresas: '7 empresas',    
        clientes: '25 clientes'    
      },
      licenca: 'Enterprise Edition',
      database_url: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado',
      supabase_url: process.env.SUPABASE_URL ? 'Configurado' : 'Não configurado'
    });
  });
}