import { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { xmlVaultService } from "../services/xmlVaultService";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";

// Configuração do multer para upload de arquivos XML
const uploadDir = path.join(process.cwd(), "uploads", "temp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const xmlFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Aceitar apenas arquivos XML
  if (file.mimetype === "application/xml" || file.mimetype === "text/xml" || path.extname(file.originalname).toLowerCase() === '.xml') {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos XML são permitidos"));
  }
};

const upload = multer({
  storage,
  fileFilter: xmlFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * Registra as rotas do XML Vault
 */
export function registerXmlVaultRoutes(app: Express) {
  // Rota para upload de XML fiscal
  app.post("/api/xml-vault/upload", isAuthenticated, upload.single("xmlFile"), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Nenhum arquivo XML foi enviado",
        });
      }

      // Obter informações do XML
      const xmlContent = fs.readFileSync(req.file.path, "utf8");
      
      // Extrair informações básicas do XML
      const xmlInfo = xmlVaultService.extractXmlInfo(xmlContent);
      
      if (!xmlInfo) {
        // Limpar arquivo temporário
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          message: "Não foi possível interpretar o arquivo XML enviado",
        });
      }
      
      // Validar o XML
      const validation = xmlVaultService.validateXml(xmlContent, xmlInfo.type || 'NFe');
      
      if (!validation.valid) {
        // Limpar arquivo temporário
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          message: "O arquivo XML fornecido é inválido",
          errors: validation.errors,
        });
      }
      
      // Armazenar o XML no cofre
      const userId = req.user.claims.sub;
      const clientId = req.body.clientId ? parseInt(req.body.clientId) : undefined;
      
      const result = await xmlVaultService.storeXml({
        ...xmlInfo,
        clientId,
        userId,
        type: xmlInfo.type as 'NFe' | 'NFSe' | 'CTe' | 'MDFe',
      } as any);
      
      // Limpar arquivo temporário
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(201).json({
        success: true,
        documentId: result.id,
        message: "Documento fiscal armazenado com sucesso no XML Vault",
      });
    } catch (error) {
      console.error("Erro no upload para XML Vault:", error);
      
      // Limpar arquivo temporário em caso de erro
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao processar XML",
      });
    }
  });
  
  // Rota para recuperar XML
  app.get("/api/xml-vault/document/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      
      if (isNaN(documentId)) {
        return res.status(400).json({
          success: false,
          message: "ID de documento inválido",
        });
      }
      
      const result = await xmlVaultService.retrieveXml(documentId);
      
      res.set("Content-Type", "application/xml");
      res.set("Content-Disposition", `attachment; filename="document_${documentId}.xml"`);
      res.send(result.xmlContent);
    } catch (error) {
      console.error("Erro ao recuperar XML do Vault:", error);
      
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Documento não encontrado",
      });
    }
  });
  
  // Rota para buscar documentos fiscais
  app.get("/api/xml-vault/search", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { type, emitterCnpj, receiverCnpj, clientId, startDate, endDate } = req.query;
      
      const searchParams: any = {};
      
      if (type) searchParams.type = type as string;
      if (emitterCnpj) searchParams.emitterCnpj = emitterCnpj as string;
      if (receiverCnpj) searchParams.receiverCnpj = receiverCnpj as string;
      if (clientId) searchParams.clientId = parseInt(clientId as string);
      if (startDate) searchParams.startDate = new Date(startDate as string);
      if (endDate) searchParams.endDate = new Date(endDate as string);
      
      const documents = await xmlVaultService.searchDocuments(searchParams);
      
      res.json({
        success: true,
        data: documents,
      });
    } catch (error) {
      console.error("Erro na busca de documentos fiscais:", error);
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao buscar documentos",
      });
    }
  });
  
  // Rota para verificar validade de XML
  app.post("/api/xml-vault/validate", isAuthenticated, upload.single("xmlFile"), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Nenhum arquivo XML foi enviado",
        });
      }
      
      // Obter conteúdo do XML
      const xmlContent = fs.readFileSync(req.file.path, "utf8");
      
      // Extrair informações básicas
      const xmlInfo = xmlVaultService.extractXmlInfo(xmlContent);
      
      if (!xmlInfo || !xmlInfo.type) {
        // Limpar arquivo temporário
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          message: "Não foi possível interpretar o arquivo XML enviado",
        });
      }
      
      // Validar o XML
      const validation = xmlVaultService.validateXml(xmlContent, xmlInfo.type as 'NFe' | 'NFSe' | 'CTe' | 'MDFe');
      
      // Limpar arquivo temporário
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.json({
        success: true,
        valid: validation.valid,
        errors: validation.errors,
        info: xmlInfo,
      });
    } catch (error) {
      console.error("Erro na validação de XML:", error);
      
      // Limpar arquivo temporário em caso de erro
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao validar XML",
      });
    }
  });
  
  // Rota para informações sobre um documento
  app.get("/api/xml-vault/info/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      
      if (isNaN(documentId)) {
        return res.status(400).json({
          success: false,
          message: "ID de documento inválido",
        });
      }
      
      const result = await xmlVaultService.retrieveXml(documentId);
      
      res.json({
        success: true,
        metadata: result.metadata,
      });
    } catch (error) {
      console.error("Erro ao obter informações do documento:", error);
      
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Documento não encontrado",
      });
    }
  });
}