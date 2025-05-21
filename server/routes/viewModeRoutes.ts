import { Request, Response, Express } from "express";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";
import { userViewModes, VIEW_MODES } from "../../shared/schema";
import { eq } from "drizzle-orm";

// Mapeamento amigável dos modos de visualização
const viewModeNames: Record<string, string> = {
  escritorio: "Escritório",
  empresa: "Empresa",
  contador: "Contador",
  externo: "Externo"
};

// Funcões auxiliares para construir menus baseados no viewMode e permissões
function getMenuItems(viewMode: string, userPermissions: string[] = []) {
  // Menu base para todos os usuários
  const baseMenu = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
      viewModes: ["escritorio", "empresa", "contador", "externo"],
      permissions: []
    }
  ];

  // Menus específicos por modo de visualização
  const escritorioMenu = [
    {
      label: "Gestão de Clientes",
      href: "/clientes",
      icon: "Users",
      viewModes: ["escritorio"],
      permissions: ["manage_clients"]
    },
    {
      label: "Fiscal",
      href: "/fiscal",
      icon: "FileText",
      viewModes: ["escritorio"],
      permissions: ["view_fiscal"]
    },
    {
      label: "Financeiro",
      href: "/financeiro",
      icon: "DollarSign",
      viewModes: ["escritorio"],
      permissions: ["view_financial"]
    },
    {
      label: "Honorários",
      href: "/honorarios",
      icon: "Receipt",
      viewModes: ["escritorio"],
      permissions: ["manage_fees"]
    },
    {
      label: "Documento Digital",
      href: "/documentos",
      icon: "File",
      viewModes: ["escritorio"],
      permissions: ["manage_documents"]
    },
    {
      label: "Agenda Integrada",
      href: "/agenda",
      icon: "Calendar",
      viewModes: ["escritorio"],
      permissions: ["view_calendar"]
    },
    {
      label: "Tarefas",
      href: "/tarefas",
      icon: "CheckSquare",
      viewModes: ["escritorio"],
      permissions: ["manage_tasks"]
    },
  ];

  const empresaMenu = [
    {
      label: "Minha Empresa",
      href: "/minha-empresa",
      icon: "Building2",
      viewModes: ["empresa"],
      permissions: []
    },
    {
      label: "Fiscal",
      href: "/fiscal",
      icon: "FileText",
      viewModes: ["empresa"],
      permissions: ["view_fiscal"]
    },
    {
      label: "Financeiro",
      href: "/financeiro",
      icon: "DollarSign",
      viewModes: ["empresa"],
      permissions: ["view_financial"]
    },
    {
      label: "Documentos",
      href: "/documentos",
      icon: "File",
      viewModes: ["empresa"],
      permissions: ["view_documents"]
    },
    {
      label: "Honorários",
      href: "/honorarios",
      icon: "Receipt",
      viewModes: ["empresa"],
      permissions: ["view_fees"]
    },
    {
      label: "Portal do Cliente",
      href: "/portal",
      icon: "Globe",
      viewModes: ["empresa"],
      permissions: []
    },
  ];

  const contadorMenu = [
    {
      label: "Meus Clientes",
      href: "/meus-clientes",
      icon: "Users",
      viewModes: ["contador"],
      permissions: ["view_clients"]
    },
    {
      label: "Fiscal",
      href: "/fiscal",
      icon: "FileText",
      viewModes: ["contador"],
      permissions: ["view_fiscal"]
    },
    {
      label: "Tarefas",
      href: "/tarefas",
      icon: "CheckSquare",
      viewModes: ["contador"],
      permissions: ["manage_tasks"]
    },
    {
      label: "Agenda",
      href: "/agenda",
      icon: "Calendar",
      viewModes: ["contador"],
      permissions: ["view_calendar"]
    }
  ];

  const externoMenu = [
    {
      label: "Documentos Compartilhados",
      href: "/documentos-compartilhados",
      icon: "File",
      viewModes: ["externo"],
      permissions: []
    },
    {
      label: "Consultorias",
      href: "/consultorias",
      icon: "MessageSquare",
      viewModes: ["externo"],
      permissions: []
    }
  ];

  // Combinar todos os menus
  const allMenuItems = [
    ...baseMenu,
    ...escritorioMenu,
    ...empresaMenu,
    ...contadorMenu,
    ...externoMenu
  ];

  // Filtrar pelo viewMode atual
  return allMenuItems.filter(item => 
    item.viewModes.includes(viewMode) && 
    (item.permissions.length === 0 || 
    item.permissions.some(perm => userPermissions.includes(perm)))
  );
}

export function registerViewModeRoutes(app: Express) {
  // Buscar os modos de visualização disponíveis para o usuário atual
  app.get("/api/user/view-modes", requireAuth, async (req: Request, res: Response) => {
    try {
      // Em um sistema real, você buscaria isso do banco de dados
      // com base no usuário autenticado
      
      // Simulando os modos disponíveis para o usuário
      const availableModes = [
        { id: "escritorio", nome: "Escritório" },
        { id: "empresa", nome: "Empresa" },
        { id: "contador", nome: "Contador" },
        { id: "externo", nome: "Externo" }
      ];
      
      // Na versão final, você filtraria com base nas permissões reais
      // Exemplo:
      // const availableModes = await db.query.userViewModes.findMany({
      //   where: eq(userViewModes.userId, req.user.id)
      // });
      
      res.json({ viewModes: availableModes });
    } catch (error) {
      console.error("Erro ao buscar modos de visualização:", error);
      res.status(500).json({ 
        message: "Erro ao buscar modos de visualização",
        error: (error as Error).message 
      });
    }
  });

  // Atualizar o modo de visualização atual do usuário
  app.post("/api/view-mode", requireAuth, async (req: Request, res: Response) => {
    try {
      const { viewMode } = req.body;
      
      if (!viewMode || !Object.values(VIEW_MODES).includes(viewMode)) {
        return res.status(400).json({ message: "Modo de visualização inválido" });
      }
      
      // Atualizar no banco de dados
      // Na versão final, você salvaria isso no banco
      // Exemplo:
      // await db.update(userViewModes)
      //   .set({ viewMode, lastUsed: new Date() })
      //   .where(eq(userViewModes.userId, req.user.id));
      
      // Para teste, apenas retornamos sucesso
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

  // Obter o menu de navegação com base no modo de visualização atual
  app.get("/api/menu", requireAuth, async (req: Request, res: Response) => {
    try {
      // O viewMode seria obtido do contexto da requisição, após processamento
      // pelo middleware que extrai essa informação
      const viewMode = req.query.viewMode as string || "escritorio";
      
      // Em um sistema real, você buscaria as permissões do usuário
      // do banco de dados
      
      // Simulação de permissões para teste
      const userPermissions = [
        "manage_clients", 
        "view_fiscal", 
        "view_financial", 
        "manage_fees",
        "manage_documents", 
        "view_calendar", 
        "manage_tasks",
        "view_clients", 
        "view_documents", 
        "view_fees"
      ];
      
      // Obter os itens de menu filtrados por modo e permissões
      const menuItems = getMenuItems(viewMode, userPermissions);
      
      res.json({ menuItems });
    } catch (error) {
      console.error("Erro ao buscar menu:", error);
      res.status(500).json({ 
        message: "Erro ao buscar menu",
        error: (error as Error).message 
      });
    }
  });
}