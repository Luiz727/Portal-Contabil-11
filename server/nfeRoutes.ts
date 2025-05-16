import type { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { 
  insertNfeSchema, 
  insertNfeItemSchema, 
  insertNfseSchema,
  insertSupplierSchema, 
  insertProductCategorySchema,
  insertApiIntegrationSchema, 
  insertImportExportLogSchema 
} from "@shared/schema";
import { js2xml } from "xml-js";

// Diretório para uploads
const uploadDir = path.join(process.cwd(), "uploads");

export function registerNfeRoutes(app: Express) {
  // ==================== Módulo de Notas Fiscais Eletrônicas (NFe) ====================
  
  // Rota para obter dashboard do cliente
  app.get('/api/client-dashboard/:clientId', isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }
      
      const stats = await storage.getClientDashboardStats(clientId);
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard do cliente:", error);
      res.status(500).json({ message: "Falha ao buscar estatísticas do dashboard" });
    }
  });
  
  // Rotas para NFe
  app.get('/api/nfe/:id', isAuthenticated, async (req, res) => {
    try {
      const nfeId = parseInt(req.params.id);
      if (isNaN(nfeId)) {
        return res.status(400).json({ message: "ID da NFe inválido" });
      }
      
      const nfe = await storage.getNfe(nfeId);
      if (!nfe) {
        return res.status(404).json({ message: "NFe não encontrada" });
      }
      
      // Buscar os itens da NFe
      const items = await storage.getNfeItems(nfeId);
      
      res.json({ ...nfe, items });
    } catch (error) {
      console.error("Erro ao buscar NFe:", error);
      res.status(500).json({ message: "Falha ao buscar NFe" });
    }
  });
  
  app.get('/api/nfe/client/:clientId', isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }
      
      const nfes = await storage.getNfesByClient(clientId);
      res.json(nfes);
    } catch (error) {
      console.error("Erro ao buscar NFes do cliente:", error);
      res.status(500).json({ message: "Falha ao buscar NFes do cliente" });
    }
  });
  
  app.get('/api/nfe/status/:status', isAuthenticated, async (req, res) => {
    try {
      const { status } = req.params;
      const nfes = await storage.getNfesByStatus(status);
      res.json(nfes);
    } catch (error) {
      console.error("Erro ao buscar NFes por status:", error);
      res.status(500).json({ message: "Falha ao buscar NFes por status" });
    }
  });
  
  app.post('/api/nfe', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const nfeData = insertNfeSchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const nfe = await storage.createNfe(nfeData);
      res.status(201).json(nfe);
    } catch (error) {
      console.error("Erro ao criar NFe:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados da NFe inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar NFe" });
    }
  });
  
  app.patch('/api/nfe/:id', isAuthenticated, async (req, res) => {
    try {
      const nfeId = parseInt(req.params.id);
      if (isNaN(nfeId)) {
        return res.status(400).json({ message: "ID da NFe inválido" });
      }
      
      const nfe = await storage.updateNfe(nfeId, req.body);
      if (!nfe) {
        return res.status(404).json({ message: "NFe não encontrada" });
      }
      
      res.json(nfe);
    } catch (error) {
      console.error("Erro ao atualizar NFe:", error);
      res.status(500).json({ message: "Falha ao atualizar NFe" });
    }
  });
  
  app.post('/api/nfe/:id/items', isAuthenticated, async (req: any, res) => {
    try {
      const nfeId = parseInt(req.params.id);
      if (isNaN(nfeId)) {
        return res.status(400).json({ message: "ID da NFe inválido" });
      }
      
      const itemData = insertNfeItemSchema.parse({
        ...req.body,
        nfeId
      });
      
      const item = await storage.createNfeItem(itemData);
      
      // Se o item estiver vinculado a um produto do estoque, registrar a movimentação
      if (itemData.itemId) {
        await storage.registerInventoryMovement({
          itemId: itemData.itemId,
          type: 'out', // Saída de estoque
          quantity: Number(itemData.quantity),
          date: new Date(),
          description: `Saída para NFe #${nfeId}`,
          invoiceId: null,
          createdBy: req.user.claims.sub
        });
      }
      
      res.status(201).json(item);
    } catch (error) {
      console.error("Erro ao adicionar item à NFe:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados do item inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao adicionar item à NFe" });
    }
  });
  
  app.post('/api/nfe/:id/generate-xml', isAuthenticated, async (req: any, res) => {
    try {
      const nfeId = parseInt(req.params.id);
      if (isNaN(nfeId)) {
        return res.status(400).json({ message: "ID da NFe inválido" });
      }
      
      const nfe = await storage.getNfe(nfeId);
      if (!nfe) {
        return res.status(404).json({ message: "NFe não encontrada" });
      }
      
      const items = await storage.getNfeItems(nfeId);
      const client = await storage.getClient(nfe.clientId);
      
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      // Construir o objeto XML da NFe (simplificado para exemplo)
      const nfeObject = {
        NFe: {
          _attributes: {
            xmlns: "http://www.portalfiscal.inf.br/nfe"
          },
          infNFe: {
            _attributes: {
              Id: `NFe${nfe.accessKey || ''}`,
              versao: "4.00"
            },
            ide: {
              cUF: "35", // código do estado (SP)
              cNF: Math.floor(Math.random() * 10000000).toString().padStart(8, '0'),
              natOp: nfe.nature,
              mod: "55", // modelo NFe
              serie: nfe.series,
              nNF: nfe.number,
              dhEmi: new Date().toISOString(),
              tpNF: nfe.operationType === 'saída' ? "1" : "0", // 0=Entrada, 1=Saída
              idDest: "1", // 1=Operação interna
              cMunFG: "3550308", // código do município (São Paulo)
              tpImp: "1", // 1=DANFE normal
              tpEmis: "1", // 1=Emissão normal
              cDV: "0", // dígito verificador
              tpAmb: "2", // 1=Produção, 2=Homologação
              finNFe: "1", // 1=Normal
              indFinal: "0", // 0=Normal, 1=Consumidor final
              indPres: "0", // 0=Não se aplica
              procEmi: "0", // 0=Aplicativo do contribuinte
              verProc: "ContaSmart 1.0" // versão do aplicativo
            },
            emit: {
              CNPJ: client.cnpj.replace(/\D/g, ''),
              xNome: client.name,
              xFant: client.name,
              enderEmit: {
                xLgr: client.address || "",
                nro: "S/N",
                xBairro: "",
                cMun: "3550308", // código do município (São Paulo)
                xMun: client.city || "São Paulo",
                UF: client.state || "SP",
                CEP: client.postalCode ? client.postalCode.replace(/\D/g, '') : "",
                fone: client.phone ? client.phone.replace(/\D/g, '') : ""
              },
              IE: "12345678901", // inscrição estadual
              CRT: "1" // código de regime tributário
            },
            det: items.map((item, index) => ({
              _attributes: { nItem: index + 1 },
              prod: {
                cProd: item.itemId || `PROD${index + 1}`,
                cEAN: "SEM GTIN",
                xProd: item.description,
                NCM: item.ncm,
                CFOP: item.cfop,
                uCom: item.unitOfMeasure,
                qCom: item.quantity,
                vUnCom: item.unitValue,
                vProd: item.totalValue,
                cEANTrib: "SEM GTIN",
                uTrib: item.unitOfMeasure,
                qTrib: item.quantity,
                vUnTrib: item.unitValue,
                indTot: "1" // 1=Valor do item compõe o total da NF-e
              },
              imposto: {
                ICMS: {
                  ICMS00: {
                    orig: "0", // 0=Nacional
                    CST: "00", // 00=Tributada integralmente
                    modBC: "0", // 0=Margem de valor agregado
                    vBC: item.totalValue,
                    pICMS: item.icmsRate || "18.00",
                    vICMS: item.icmsValue || (Number(item.totalValue) * 0.18).toFixed(2)
                  }
                },
                PIS: {
                  PISAliq: {
                    CST: "01", // 01=Operação tributável - Base de cálculo = valor da operação
                    vBC: item.totalValue,
                    pPIS: item.pisRate || "1.65",
                    vPIS: item.pisValue || (Number(item.totalValue) * 0.0165).toFixed(2)
                  }
                },
                COFINS: {
                  COFINSAliq: {
                    CST: "01", // 01=Operação tributável - Base de cálculo = valor da operação
                    vBC: item.totalValue,
                    pCOFINS: item.cofinsRate || "7.60",
                    vCOFINS: item.cofinsValue || (Number(item.totalValue) * 0.076).toFixed(2)
                  }
                }
              }
            })),
            total: {
              ICMSTot: {
                vBC: items.reduce((sum, item) => sum + Number(item.totalValue), 0).toFixed(2),
                vICMS: items.reduce((sum, item) => sum + (Number(item.icmsValue) || Number(item.totalValue) * 0.18), 0).toFixed(2),
                vProd: items.reduce((sum, item) => sum + Number(item.totalValue), 0).toFixed(2),
                vNF: nfe.totalValue,
                vPIS: items.reduce((sum, item) => sum + (Number(item.pisValue) || Number(item.totalValue) * 0.0165), 0).toFixed(2),
                vCOFINS: items.reduce((sum, item) => sum + (Number(item.cofinsValue) || Number(item.totalValue) * 0.076), 0).toFixed(2)
              }
            },
            transp: {
              modFrete: "9" // 9=Sem frete
            }
          }
        }
      };
      
      // Converter o objeto para XML
      const xml = js2xml(nfeObject, { compact: true, spaces: 2 });
      
      // Caminho para salvar o arquivo XML
      const fileName = `NFe_${nfe.number}_${nfe.series}_${Date.now()}.xml`;
      const filePath = path.join(uploadDir, fileName);
      
      // Salvar o XML no disco
      fs.writeFileSync(filePath, xml);
      
      // Atualizar a NFe com o caminho do XML
      await storage.updateNfe(nfeId, {
        xmlPath: filePath,
        status: 'pending' // Muda o status para pendente de aprovação
      });
      
      // Criar um documento vinculado ao XML
      const documentData = {
        name: fileName,
        description: `XML da NFe ${nfe.number} - Série ${nfe.series}`,
        path: filePath,
        fileType: 'xml',
        size: xml.length,
        clientId: nfe.clientId,
        uploadedBy: req.user.claims.sub
      };
      
      const document = await storage.createDocument(documentData);
      
      res.json({
        success: true,
        xmlPath: filePath,
        downloadUrl: `/api/documents/download/${document.id}`
      });
    } catch (error) {
      console.error("Erro ao gerar XML da NFe:", error);
      res.status(500).json({ message: "Falha ao gerar XML da NFe" });
    }
  });
  
  // ==================== Módulo de Notas Fiscais de Serviço (NFSe) ====================
  
  app.get('/api/nfse/:id', isAuthenticated, async (req, res) => {
    try {
      const nfseId = parseInt(req.params.id);
      if (isNaN(nfseId)) {
        return res.status(400).json({ message: "ID da NFSe inválido" });
      }
      
      const nfse = await storage.getNfse(nfseId);
      if (!nfse) {
        return res.status(404).json({ message: "NFSe não encontrada" });
      }
      
      res.json(nfse);
    } catch (error) {
      console.error("Erro ao buscar NFSe:", error);
      res.status(500).json({ message: "Falha ao buscar NFSe" });
    }
  });
  
  app.get('/api/nfse/client/:clientId', isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }
      
      const nfses = await storage.getNfsesByClient(clientId);
      res.json(nfses);
    } catch (error) {
      console.error("Erro ao buscar NFSes do cliente:", error);
      res.status(500).json({ message: "Falha ao buscar NFSes do cliente" });
    }
  });
  
  app.post('/api/nfse', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const nfseData = insertNfseSchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const nfse = await storage.createNfse(nfseData);
      res.status(201).json(nfse);
    } catch (error) {
      console.error("Erro ao criar NFSe:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados da NFSe inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar NFSe" });
    }
  });
  
  app.patch('/api/nfse/:id', isAuthenticated, async (req, res) => {
    try {
      const nfseId = parseInt(req.params.id);
      if (isNaN(nfseId)) {
        return res.status(400).json({ message: "ID da NFSe inválido" });
      }
      
      const nfse = await storage.updateNfse(nfseId, req.body);
      if (!nfse) {
        return res.status(404).json({ message: "NFSe não encontrada" });
      }
      
      res.json(nfse);
    } catch (error) {
      console.error("Erro ao atualizar NFSe:", error);
      res.status(500).json({ message: "Falha ao atualizar NFSe" });
    }
  });
  
  // ==================== Módulo de Fornecedores ====================
  
  app.get('/api/suppliers', isAuthenticated, async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      res.status(500).json({ message: "Falha ao buscar fornecedores" });
    }
  });
  
  app.get('/api/suppliers/client/:clientId', isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }
      
      const suppliers = await storage.getSuppliersByClient(clientId);
      res.json(suppliers);
    } catch (error) {
      console.error("Erro ao buscar fornecedores do cliente:", error);
      res.status(500).json({ message: "Falha ao buscar fornecedores do cliente" });
    }
  });
  
  app.post('/api/suppliers', isAuthenticated, async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados do fornecedor inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar fornecedor" });
    }
  });
  
  // ==================== Módulo de Categorias de Produtos ====================
  
  app.get('/api/product-categories', isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getProductCategories();
      res.json(categories);
    } catch (error) {
      console.error("Erro ao buscar categorias de produtos:", error);
      res.status(500).json({ message: "Falha ao buscar categorias de produtos" });
    }
  });
  
  app.get('/api/product-categories/client/:clientId', isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }
      
      const categories = await storage.getProductCategoriesByClient(clientId);
      res.json(categories);
    } catch (error) {
      console.error("Erro ao buscar categorias de produtos do cliente:", error);
      res.status(500).json({ message: "Falha ao buscar categorias de produtos do cliente" });
    }
  });
  
  app.post('/api/product-categories', isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertProductCategorySchema.parse(req.body);
      const category = await storage.createProductCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Erro ao criar categoria de produto:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados da categoria inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar categoria de produto" });
    }
  });
  
  // ==================== Módulo de Importação/Exportação ====================
  
  app.post('/api/import-export/logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logData = insertImportExportLogSchema.parse({
        ...req.body,
        createdBy: userId
      });
      
      const log = await storage.createImportExportLog(logData);
      res.status(201).json(log);
    } catch (error) {
      console.error("Erro ao criar log de importação/exportação:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados do log inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar log de importação/exportação" });
    }
  });
  
  app.get('/api/import-export/logs/client/:clientId', isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }
      
      const logs = await storage.getImportExportLogsByClient(clientId);
      res.json(logs);
    } catch (error) {
      console.error("Erro ao buscar logs de importação/exportação:", error);
      res.status(500).json({ message: "Falha ao buscar logs de importação/exportação" });
    }
  });
  
  // ==================== Módulo de Controle de Estoque Avançado ====================
  
  app.post('/api/inventory/movements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const movementData = {
        ...req.body,
        date: req.body.date || new Date(),
        createdBy: userId
      };
      
      const movement = await storage.registerInventoryMovement(movementData);
      res.status(201).json(movement);
    } catch (error) {
      console.error("Erro ao registrar movimentação de estoque:", error);
      res.status(500).json({ message: "Falha ao registrar movimentação de estoque" });
    }
  });
  
  // ==================== Módulo de Integrações API ====================
  
  app.get('/api/api-integrations/client/:clientId', isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }
      
      const integrations = await storage.getApiIntegrationsByClient(clientId);
      res.json(integrations);
    } catch (error) {
      console.error("Erro ao buscar integrações de API:", error);
      res.status(500).json({ message: "Falha ao buscar integrações de API" });
    }
  });
  
  app.post('/api/api-integrations', isAuthenticated, async (req, res) => {
    try {
      const integrationData = insertApiIntegrationSchema.parse(req.body);
      const integration = await storage.createApiIntegration(integrationData);
      res.status(201).json(integration);
    } catch (error) {
      console.error("Erro ao criar integração de API:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados da integração inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Falha ao criar integração de API" });
    }
  });
}