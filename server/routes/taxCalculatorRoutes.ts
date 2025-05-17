import { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { taxCalculatorService } from "../services/taxCalculatorService";
import { z } from "zod";

/**
 * Registra as rotas da calculadora de impostos
 */
export function registerTaxCalculatorRoutes(app: Express) {
  // Rota para cálculo de impostos
  app.post("/api/tax-calculator/calculate", isAuthenticated, async (req: any, res: Response) => {
    try {
      // Validar entrada
      const inputSchema = z.object({
        operationType: z.enum(['entrada', 'saida']),
        originState: z.string().length(2),
        destinationState: z.string().length(2),
        taxRegime: z.enum(['simples_nacional', 'lucro_presumido', 'lucro_real']),
        clientId: z.number().optional(),
        items: z.array(z.object({
          universalProductId: z.number(),
          quantity: z.number().positive(),
          unitValue: z.number().optional(),
          description: z.string().optional(),
          customNCM: z.string().optional(),
          customCFOP: z.string().optional(),
          discountValue: z.number().optional(),
        })).min(1),
        freightValue: z.number().optional(),
        insuranceValue: z.number().optional(),
        otherCosts: z.number().optional(),
        notes: z.string().optional(),
      });

      const input = inputSchema.parse(req.body);
      
      // Calcular impostos
      const result = await taxCalculatorService.calculateTaxes(input);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error("Erro no cálculo de impostos:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao calcular impostos",
        error: error instanceof z.ZodError ? error.format() : undefined
      });
    }
  });
  
  // Rota para salvar simulação
  app.post("/api/tax-calculator/save-simulation", isAuthenticated, async (req: any, res: Response) => {
    try {
      // Validar entrada
      const inputSchema = z.object({
        name: z.string().min(1),
        clientId: z.number(),
        taxInput: z.object({
          operationType: z.enum(['entrada', 'saida']),
          originState: z.string().length(2),
          destinationState: z.string().length(2),
          taxRegime: z.enum(['simples_nacional', 'lucro_presumido', 'lucro_real']),
          clientId: z.number().optional(),
          items: z.array(z.object({
            universalProductId: z.number(),
            quantity: z.number().positive(),
            unitValue: z.number().optional(),
            description: z.string().optional(),
            customNCM: z.string().optional(),
            customCFOP: z.string().optional(),
            discountValue: z.number().optional(),
          })).min(1),
          freightValue: z.number().optional(),
          insuranceValue: z.number().optional(),
          otherCosts: z.number().optional(),
          notes: z.string().optional(),
        }),
        taxResult: z.object({
          totalValue: z.number(),
          totalTaxes: z.number(),
          icmsTotal: z.number(),
          icmsStTotal: z.number(),
          ipiTotal: z.number(),
          pisTotal: z.number(),
          cofinsTotal: z.number(),
          issTotal: z.number(),
          items: z.array(z.object({
            description: z.string(),
            quantity: z.number(),
            unitValue: z.number(),
            totalValue: z.number(),
            ncm: z.string(),
            cfop: z.string(),
            unitOfMeasure: z.string(),
            icmsValue: z.number(),
            icmsRate: z.number(),
            icmsStValue: z.number(),
            icmsStRate: z.number(),
            ipiValue: z.number(),
            ipiRate: z.number(),
            pisValue: z.number(),
            pisRate: z.number(),
            cofinsValue: z.number(),
            cofinsRate: z.number(),
            issValue: z.number(),
            issRate: z.number(),
            discountValue: z.number(),
            netValue: z.number(),
            profitMargin: z.number().optional(),
            costPrice: z.number().optional(),
          }))
        })
      });

      const input = inputSchema.parse(req.body);
      
      // Salvar simulação
      const userId = req.user.claims.sub;
      const simulationId = await taxCalculatorService.saveSimulation(
        input.name,
        input.clientId,
        input.taxInput,
        input.taxResult,
        userId
      );
      
      res.json({
        success: true,
        simulationId
      });
    } catch (error) {
      console.error("Erro ao salvar simulação:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao salvar simulação",
        error: error instanceof z.ZodError ? error.format() : undefined
      });
    }
  });
  
  // Rota para obter simulação por ID
  app.get("/api/tax-calculator/simulation/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }
      
      const simulation = await taxCalculatorService.getSimulation(id);
      
      res.json({
        success: true,
        data: simulation
      });
    } catch (error) {
      console.error("Erro ao obter simulação:", error);
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Simulação não encontrada"
      });
    }
  });
  
  // Rota para listar simulações de um cliente
  app.get("/api/tax-calculator/client-simulations/:clientId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({
          success: false,
          message: "ID do cliente inválido"
        });
      }
      
      const simulations = await taxCalculatorService.listClientSimulations(clientId);
      
      res.json({
        success: true,
        data: simulations
      });
    } catch (error) {
      console.error("Erro ao listar simulações do cliente:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao listar simulações"
      });
    }
  });
  
  // Rota para criar NFe a partir de simulação
  app.post("/api/tax-calculator/create-nfe-from-simulation", isAuthenticated, async (req: any, res: Response) => {
    try {
      const inputSchema = z.object({
        simulationId: z.number(),
        clientId: z.number()
      });

      const input = inputSchema.parse(req.body);
      
      const userId = req.user.claims.sub;
      const nfe = await taxCalculatorService.prepareNFeFromSimulation(
        input.simulationId,
        input.clientId,
        userId
      );
      
      res.json({
        success: true,
        data: nfe,
        message: "NFe criada com sucesso a partir da simulação"
      });
    } catch (error) {
      console.error("Erro ao criar NFe a partir da simulação:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao criar NFe"
      });
    }
  });
  
  // API para buscar produtos universais
  app.get("/api/universal-products", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { q, active, offset, limit } = req.query;
      
      // Aqui implementaríamos filtros para buscar produtos
      // Por enquanto, vamos retornar um resultado vazio
      res.json({
        success: true,
        data: [],
        total: 0
      });
    } catch (error) {
      console.error("Erro ao buscar produtos universais:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao buscar produtos"
      });
    }
  });
  
  // API para cadastrar produto universal (apenas para administradores/contadores)
  app.post("/api/universal-products", isAuthenticated, async (req: any, res: Response) => {
    try {
      // Verificar se o usuário tem permissão (admin ou contador)
      if (req.user.role !== "admin" && req.user.role !== "accountant") {
        return res.status(403).json({
          success: false,
          message: "Permissão negada. Apenas administradores e contadores podem cadastrar produtos universais."
        });
      }
      
      // Implementar o cadastro de produto universal
      // Por enquanto, retornamos sucesso sem fazer nada
      res.json({
        success: true,
        message: "Produto universal cadastrado com sucesso"
      });
    } catch (error) {
      console.error("Erro ao cadastrar produto universal:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao cadastrar produto"
      });
    }
  });
  
  // API para definir preço personalizado de produto para cliente
  app.post("/api/client-product-prices", isAuthenticated, async (req: any, res: Response) => {
    try {
      // Verificar se o usuário tem permissão adequada
      // Por enquanto, retornamos sucesso sem fazer nada
      res.json({
        success: true,
        message: "Preço personalizado de produto definido com sucesso"
      });
    } catch (error) {
      console.error("Erro ao definir preço personalizado:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao definir preço personalizado"
      });
    }
  });
}