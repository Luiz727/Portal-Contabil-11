import { Request, Response, Express } from "express";
import { storage } from "./storage";
import { requireAuth, requireRole, requireViewMode, isAuthenticated, isEscritorioUser, ViewMode } from "./middleware/auth";
import { insertHonorarioSchema } from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { honorarios, clients, nfses } from "../shared/schema";

export function registerHonorariosRoutes(app: Express) {
  // Usando os middlewares mais avançados de autenticação e permissionamento
  const escritorioOnly = requireRole(["admin", "accountant"]);
  const viewModeEscritorio = requireViewMode('escritorio' as ViewMode);
  

  // Buscar todos os honorários com dados do cliente
  app.get("/api/honorarios", requireAuth, escritorioOnly, viewModeEscritorio, async (req: Request, res: Response) => {
    try {
      const result = await db.query.honorarios.findMany({
        with: {
          cliente: {
            columns: {
              name: true
            }
          }
        }
      });

      // Formatar a resposta para incluir o nome do cliente
      const formattedResult = result.map(hon => ({
        ...hon,
        clientName: hon.cliente ? hon.cliente.name : "Cliente não encontrado"
      }));

      res.json(formattedResult);
    } catch (error) {
      console.error("Erro ao buscar honorários:", error);
      res.status(500).json({ message: "Erro ao buscar honorários" });
    }
  });

  // Obter um honorário específico
  app.get("/api/honorarios/:id", isAuthenticated, isEscritorioUser, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const honorario = await storage.getHonorario(id);

      if (!honorario) {
        return res.status(404).json({ message: "Honorário não encontrado" });
      }

      res.json(honorario);
    } catch (error) {
      console.error("Erro ao buscar honorário:", error);
      res.status(500).json({ message: "Erro ao buscar honorário" });
    }
  });

  // Criar novo honorário
  app.post("/api/honorarios", isAuthenticated, isEscritorioUser, async (req: Request, res: Response) => {
    try {
      // Validar dados com Zod
      const validatedData = insertHonorarioSchema.parse({
        clientId: req.body.clientId,
        descricao: req.body.descricao,
        valor: req.body.valor,
        vencimento: req.body.vencimento,
        tipoServico: req.body.tipoServico,
        status: req.body.status || "pendente",
        observacoes: req.body.observacoes
      });

      // Criar honorário
      const honorario = await storage.createHonorario(validatedData);

      // Se solicitado, gerar NFS-e automaticamente
      if (req.body.gerarNfse) {
        try {
          // Buscar cliente para detalhes da nota
          const cliente = await storage.getClient(validatedData.clientId);
          
          if (!cliente) {
            throw new Error("Cliente não encontrado");
          }
          
          // Dados para a NFS-e
          const nfseData = {
            number: Date.now().toString().slice(-8), // Número temporário para simulação
            type: "NFSe",
            issueDate: new Date().toISOString().split('T')[0],
            totalValue: validatedData.valor,
            serviceDescription: validatedData.descricao,
            serviceCode: "17.01", // Código padrão para serviços de contabilidade
            issCity: "São Paulo", // Cidade padrão
            issRate: "2", // Alíquota padrão
            issValue: (parseFloat(validatedData.valor) * 0.02).toFixed(2), // 2% do valor total
            clientId: validatedData.clientId,
            status: "emitida",
            createdBy: req.user?.claims?.sub || null,
            verificationCode: Math.random().toString(36).substring(2, 10)
          };
          
          // Criar NFSe
          const nfse = await storage.createNfse(nfseData);
          
          // Atualizar honorário com o ID da NFSe
          await db.update(honorarios)
            .set({ nfseId: nfse.id })
            .where(eq(honorarios.id, honorario.id));
            
          // Atualizar honorário com a NFS-e
          honorario.nfseId = nfse.id;
        } catch (nfseError) {
          console.error("Erro ao gerar NFS-e automática:", nfseError);
          // Não interrompe o fluxo, apenas loga o erro
        }
      }

      res.status(201).json(honorario);
    } catch (error) {
      console.error("Erro ao criar honorário:", error);
      res.status(400).json({ message: "Erro ao criar honorário", error });
    }
  });

  // Atualizar status de um honorário
  app.patch("/api/honorarios/:id/status", isAuthenticated, isEscritorioUser, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["pendente", "pago", "atrasado", "cancelado"].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      // Verificar se o honorário existe
      const honorario = await storage.getHonorario(id);
      if (!honorario) {
        return res.status(404).json({ message: "Honorário não encontrado" });
      }

      // Atualizar status
      const updatedHonorario = await storage.updateHonorario(id, { status });
      res.json(updatedHonorario);
    } catch (error) {
      console.error("Erro ao atualizar status do honorário:", error);
      res.status(500).json({ message: "Erro ao atualizar status do honorário" });
    }
  });

  // Gerar NFS-e a partir de um honorário
  app.post("/api/honorarios/:id/gerar-nfse", isAuthenticated, isEscritorioUser, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      // Verificar se o honorário existe
      const honorario = await storage.getHonorario(id);
      if (!honorario) {
        return res.status(404).json({ message: "Honorário não encontrado" });
      }

      // Verificar se já existe uma NFS-e
      if (honorario.nfseId) {
        const nfse = await storage.getNfse(honorario.nfseId);
        return res.status(400).json({ 
          message: "Este honorário já possui uma NFS-e vinculada",
          numero: nfse?.number
        });
      }

      // Buscar cliente para dados da NFS-e
      const cliente = await storage.getClient(honorario.clientId);
      if (!cliente) {
        return res.status(400).json({ message: "Cliente não encontrado" });
      }

      // Dados para a NFS-e
      const nfseData = {
        number: Date.now().toString().slice(-8), // Número temporário para simulação
        type: "NFSe",
        issueDate: new Date().toISOString().split('T')[0],
        totalValue: honorario.valor,
        serviceDescription: honorario.descricao,
        serviceCode: "17.01", // Código padrão para serviços de contabilidade
        issCity: "São Paulo", // Cidade padrão
        issRate: "2", // Alíquota padrão
        issValue: (parseFloat(honorario.valor) * 0.02).toFixed(2), // 2% do valor total
        clientId: honorario.clientId,
        status: "emitida",
        createdBy: req.user?.claims?.sub || null,
        verificationCode: Math.random().toString(36).substring(2, 10)
      };

      // Criar NFSe
      const nfse = await storage.createNfse(nfseData);

      // Atualizar honorário com a NFS-e
      await db.update(honorarios)
        .set({ nfseId: nfse.id })
        .where(eq(honorarios.id, id));

      res.status(201).json({
        message: "NFS-e gerada com sucesso",
        numero: nfse.number,
        id: nfse.id
      });
    } catch (error) {
      console.error("Erro ao gerar NFS-e:", error);
      res.status(500).json({ message: "Erro ao gerar NFS-e" });
    }
  });
}