import { Request, Response, Express } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";
import { userViewModes as userViewModesTable, VIEW_MODES } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export function registerViewModeRoutes(app: Express) {
  // Obter configurações de todos os modos de visualização do usuário atual
  app.get("/api/view-modes", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      // Buscar todos os modos de visualização do usuário
      const viewModes = await db
        .select()
        .from(userViewModesTable)
        .where(eq(userViewModesTable.userId, userId))
        .orderBy(userViewModesTable.lastUsed);
      
      // Obter o modo de visualização atual da sessão
      const currentViewMode = req.session.viewMode || VIEW_MODES.ESCRITORIO;
      
      res.json({
        currentViewMode,
        viewModes: userViewModes,
        availableModes: Object.values(VIEW_MODES)
      });
    } catch (error) {
      console.error("Erro ao buscar modos de visualização:", error);
      res.status(500).json({ message: "Erro ao buscar modos de visualização" });
    }
  });

  // Obter configuração de um modo de visualização específico do usuário atual
  app.get("/api/view-modes/:viewMode", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const viewMode = req.params.viewMode;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      if (!Object.values(VIEW_MODES).includes(viewMode)) {
        return res.status(400).json({ message: "Modo de visualização inválido" });
      }
      
      // Buscar a configuração do modo de visualização
      const viewModeConfig = await storage.getUserViewMode(userId, viewMode);
      
      // Se não existir, criar um modo de visualização padrão
      if (!viewModeConfig) {
        const newConfig = await storage.saveUserViewMode({
          userId,
          viewMode,
          activeProfile: null,
          clientId: null
        });
        
        return res.json(newConfig);
      }
      
      res.json(viewModeConfig);
    } catch (error) {
      console.error("Erro ao buscar modo de visualização:", error);
      res.status(500).json({ message: "Erro ao buscar modo de visualização" });
    }
  });

  // Alterar para um modo de visualização específico
  app.post("/api/view-modes/switch", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const { viewMode, clientId, activeProfile } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      if (!viewMode || !Object.values(VIEW_MODES).includes(viewMode)) {
        return res.status(400).json({ message: "Modo de visualização inválido" });
      }
      
      // Salvar o modo de visualização na sessão
      req.session.viewMode = viewMode;
      
      // Salvar ou atualizar a configuração do modo de visualização
      const viewModeConfig = await storage.saveUserViewMode({
        userId,
        viewMode,
        clientId: clientId || null,
        activeProfile: activeProfile || null
      });
      
      res.json({
        message: `Modo de visualização alterado para ${viewMode}`,
        currentViewMode: viewMode,
        viewModeConfig
      });
    } catch (error) {
      console.error("Erro ao alterar modo de visualização:", error);
      res.status(500).json({ message: "Erro ao alterar modo de visualização" });
    }
  });

  // Obter o menu dinâmico baseado no modo de visualização atual
  app.get("/api/menu", requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      // Obter o modo de visualização atual da sessão
      const currentViewMode = req.session.viewMode || VIEW_MODES.ESCRITORIO;
      
      // Definir o menu base com itens comuns a todos os modos
      let menu = [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: "dashboard",
          viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR, VIEW_MODES.EXTERNO],
          permissions: []
        },
        {
          label: "Perfil",
          href: "/profile",
          icon: "user",
          viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR, VIEW_MODES.EXTERNO],
          permissions: []
        }
      ];
      
      // Adicionar itens específicos baseados no modo de visualização
      switch (currentViewMode) {
        case VIEW_MODES.ESCRITORIO:
          menu = [
            ...menu,
            {
              label: "Clientes",
              href: "/clients",
              icon: "building",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["view_clients"]
            },
            {
              label: "Honorários",
              href: "/honorarios",
              icon: "dollar-sign",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["manage_honorarios"]
            },
            {
              label: "Documentos",
              href: "/documents",
              icon: "file-text",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["view_documents"]
            },
            {
              label: "Tarefas",
              href: "/tasks",
              icon: "check-square",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["view_tasks"]
            },
            {
              label: "Calendário",
              href: "/calendar",
              icon: "calendar",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["view_calendar"]
            },
            {
              label: "Fiscal",
              href: "/fiscal",
              icon: "file",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["view_fiscal"]
            },
            {
              label: "Financeiro",
              href: "/financial",
              icon: "dollar-sign",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["view_financial"]
            },
            {
              label: "Usuários",
              href: "/users",
              icon: "users",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["manage_users"]
            },
            {
              label: "Configurações",
              href: "/settings",
              icon: "settings",
              viewModes: [VIEW_MODES.ESCRITORIO],
              permissions: ["manage_settings"]
            }
          ];
          break;
          
        case VIEW_MODES.EMPRESA:
          menu = [
            ...menu,
            {
              label: "Documentos",
              href: "/client/documents",
              icon: "file-text",
              viewModes: [VIEW_MODES.EMPRESA],
              permissions: []
            },
            {
              label: "Honorários",
              href: "/client/honorarios",
              icon: "dollar-sign",
              viewModes: [VIEW_MODES.EMPRESA],
              permissions: []
            },
            {
              label: "Fiscal",
              href: "/client/fiscal",
              icon: "file",
              viewModes: [VIEW_MODES.EMPRESA],
              permissions: []
            },
            {
              label: "Financeiro",
              href: "/client/financial",
              icon: "dollar-sign",
              viewModes: [VIEW_MODES.EMPRESA],
              permissions: []
            },
            {
              label: "Estoque",
              href: "/client/inventory",
              icon: "package",
              viewModes: [VIEW_MODES.EMPRESA],
              permissions: []
            },
            {
              label: "Relatórios",
              href: "/client/reports",
              icon: "bar-chart-2",
              viewModes: [VIEW_MODES.EMPRESA],
              permissions: []
            }
          ];
          break;
          
        case VIEW_MODES.CONTADOR:
          menu = [
            ...menu,
            {
              label: "Clientes",
              href: "/accountant/clients",
              icon: "building",
              viewModes: [VIEW_MODES.CONTADOR],
              permissions: []
            },
            {
              label: "Tarefas",
              href: "/accountant/tasks",
              icon: "check-square",
              viewModes: [VIEW_MODES.CONTADOR],
              permissions: []
            },
            {
              label: "Documentos",
              href: "/accountant/documents",
              icon: "file-text",
              viewModes: [VIEW_MODES.CONTADOR],
              permissions: []
            },
            {
              label: "Fiscal",
              href: "/accountant/fiscal",
              icon: "file",
              viewModes: [VIEW_MODES.CONTADOR],
              permissions: []
            },
            {
              label: "Honorários",
              href: "/accountant/honorarios",
              icon: "dollar-sign",
              viewModes: [VIEW_MODES.CONTADOR],
              permissions: []
            }
          ];
          break;
          
        case VIEW_MODES.EXTERNO:
          menu = [
            ...menu,
            {
              label: "Documentos",
              href: "/external/documents",
              icon: "file-text",
              viewModes: [VIEW_MODES.EXTERNO],
              permissions: []
            },
            {
              label: "Relatórios",
              href: "/external/reports",
              icon: "bar-chart-2",
              viewModes: [VIEW_MODES.EXTERNO],
              permissions: []
            }
          ];
          break;
      }
      
      // Filtrar o menu baseado nas permissões do usuário
      let filteredMenu = menu;
      
      // Se não for o modo escritório, não precisamos verificar permissões específicas
      if (currentViewMode === VIEW_MODES.ESCRITORIO) {
        // Buscar permissões do usuário
        const userPermissions = await storage.getUserPermissions(userId);
        
        // Verificar se é um admin (admins veem tudo)
        const userInfo = await storage.getUser(userId);
        const isAdmin = userInfo?.role === "admin";
        
        // Filtrar o menu baseado nas permissões, exceto para admins
        if (!isAdmin) {
          filteredMenu = menu.filter(item => {
            // Se não requer permissões, mostra para todos
            if (!item.permissions || item.permissions.length === 0) {
              return true;
            }
            
            // Verifica se o usuário tem pelo menos uma das permissões necessárias
            return item.permissions.some(permission => userPermissions.includes(permission));
          });
        }
      }
      
      res.json({
        menu: filteredMenu,
        currentViewMode
      });
    } catch (error) {
      console.error("Erro ao gerar menu dinâmico:", error);
      res.status(500).json({ message: "Erro ao gerar menu dinâmico" });
    }
  });
}