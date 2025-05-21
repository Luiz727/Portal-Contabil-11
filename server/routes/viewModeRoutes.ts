import { Request, Response, Express } from "express";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";
import { eq } from "drizzle-orm";

// Definindo as constantes dos modos de visualização aqui para evitar problemas de importação
const VIEW_MODES = {
  ESCRITORIO: 'escritorio',
  EMPRESA: 'empresa',
  CONTADOR: 'contador',
  EXTERNO: 'externo'
};

// Mapeamento amigável dos modos de visualização
const viewModeNames: Record<string, string> = {
  [VIEW_MODES.ESCRITORIO]: 'Escritório',
  [VIEW_MODES.EMPRESA]: 'Empresa',
  [VIEW_MODES.CONTADOR]: 'Contador',
  [VIEW_MODES.EXTERNO]: 'Externo'
};

function getMenuItems(viewMode: string, userPermissions: string[] = []) {
  // Menu base com itens que todos os modos podem ver
  const baseMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', path: '/' }
  ];
  
  // Itens específicos para cada modo de visualização
  const viewModeMenus: Record<string, Array<{ id: string, label: string, icon: string, path: string }>> = {
    [VIEW_MODES.ESCRITORIO]: [
      { id: 'clients', label: 'Clientes', icon: 'users', path: '/clients' },
      { id: 'financial', label: 'Financeiro', icon: 'dollar-sign', path: '/financial' },
      { id: 'fiscal', label: 'Módulo Fiscal', icon: 'file-text', path: '/fiscal' },
      { id: 'calendar', label: 'Calendário', icon: 'calendar', path: '/calendar' },
      { id: 'documents', label: 'Documentos', icon: 'folder', path: '/documents' },
      { id: 'tasks', label: 'Tarefas', icon: 'check-square', path: '/tasks' },
      { id: 'reports', label: 'Relatórios', icon: 'bar-chart-2', path: '/reports' },
      { id: 'settings', label: 'Configurações', icon: 'settings', path: '/settings' },
      { id: 'admin', label: 'Administração', icon: 'shield', path: '/admin' }
    ],
    [VIEW_MODES.EMPRESA]: [
      { id: 'fiscal', label: 'Módulo Fiscal', icon: 'file-text', path: '/fiscal' },
      { id: 'financial', label: 'Financeiro', icon: 'dollar-sign', path: '/financial' },
      { id: 'documents', label: 'Documentos', icon: 'folder', path: '/documents' },
      { id: 'invoices', label: 'Notas Fiscais', icon: 'file', path: '/invoices' },
      { id: 'tasks', label: 'Tarefas', icon: 'check-square', path: '/tasks' },
      { id: 'settings', label: 'Configurações', icon: 'settings', path: '/settings' }
    ],
    [VIEW_MODES.CONTADOR]: [
      { id: 'clients', label: 'Clientes', icon: 'users', path: '/clients' },
      { id: 'fiscal', label: 'Módulo Fiscal', icon: 'file-text', path: '/fiscal' },
      { id: 'documents', label: 'Documentos', icon: 'folder', path: '/documents' },
      { id: 'tasks', label: 'Tarefas', icon: 'check-square', path: '/tasks' },
      { id: 'calendar', label: 'Calendário', icon: 'calendar', path: '/calendar' }
    ],
    [VIEW_MODES.EXTERNO]: [
      { id: 'documents', label: 'Documentos', icon: 'folder', path: '/documents' },
      { id: 'tasks', label: 'Tarefas', icon: 'check-square', path: '/tasks' },
      { id: 'client-portal', label: 'Portal do Cliente', icon: 'layout', path: '/client-portal' }
    ]
  };
  
  // Combinar menu base com itens específicos do modo atual
  const combinedMenu = [
    ...baseMenu,
    ...(viewModeMenus[viewMode] || [])
  ];
  
  // Filtrar com base nas permissões do usuário (se necessário)
  if (userPermissions.length > 0) {
    // Esta é uma simplificação - em um sistema real, você teria um mapeamento
    // mais complexo entre permissões e itens de menu
    return combinedMenu.filter(item => userPermissions.includes(item.id));
  }
  
  return combinedMenu;
}

export function registerViewModeRoutes(app: Express) {
  // Buscar os modos de visualização disponíveis para o usuário
  app.get("/api/user/view-modes", requireAuth, async (req: Request, res: Response) => {
    try {
      // Em um sistema real, você buscaria isso do banco de dados
      // com base no usuário autenticado e suas permissões
      
      // Simulando dados para teste
      const availableViewModes = [
        { id: VIEW_MODES.ESCRITORIO, name: viewModeNames[VIEW_MODES.ESCRITORIO] },
        { id: VIEW_MODES.EMPRESA, name: viewModeNames[VIEW_MODES.EMPRESA] },
        { id: VIEW_MODES.CONTADOR, name: viewModeNames[VIEW_MODES.CONTADOR] },
        { id: VIEW_MODES.EXTERNO, name: viewModeNames[VIEW_MODES.EXTERNO] }
      ];
      
      res.json({ viewModes: availableViewModes });
    } catch (error) {
      console.error("Erro ao buscar modos de visualização:", error);
      res.status(500).json({ 
        message: "Erro ao buscar modos de visualização",
        error: (error as Error).message 
      });
    }
  });

  // Atualizar o modo de visualização do usuário
  app.post("/api/view-mode", requireAuth, async (req: Request, res: Response) => {
    try {
      const { viewMode } = req.body;
      
      if (!viewMode || !Object.values(VIEW_MODES).includes(viewMode)) {
        return res.status(400).json({ message: "Modo de visualização inválido" });
      }
      
      // Em um sistema real, você salvaria esta preferência no banco de dados
      // e atualizaria a sessão do usuário
      
      res.json({ 
        message: "Modo de visualização atualizado com sucesso",
        viewMode,
        viewModeName: viewModeNames[viewMode] 
      });
    } catch (error) {
      console.error("Erro ao atualizar modo de visualização:", error);
      res.status(500).json({ 
        message: "Erro ao atualizar modo de visualização",
        error: (error as Error).message 
      });
    }
  });

  // Obter os itens de menu disponíveis com base no modo de visualização atual
  app.get("/api/menu", requireAuth, async (req: Request, res: Response) => {
    try {
      // Em um sistema real, você obteria o modo de visualização e as permissões 
      // do usuário a partir da sessão ou banco de dados
      
      const viewMode = req.query.viewMode as string || VIEW_MODES.ESCRITORIO;
      const userPermissions: string[] = []; // Em um sistema real, você buscaria as permissões do usuário
      
      const menuItems = getMenuItems(viewMode, userPermissions);
      
      res.json({ menu: menuItems });
    } catch (error) {
      console.error("Erro ao buscar itens de menu:", error);
      res.status(500).json({ 
        message: "Erro ao buscar itens de menu",
        error: (error as Error).message 
      });
    }
  });
}