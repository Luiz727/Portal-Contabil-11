import { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { xmlVaultService } from "../services/xmlVaultService";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configuração para upload de arquivos XML
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

const xmlUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limite
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/xml" ||
      file.mimetype === "application/xml" ||
      file.originalname.endsWith(".xml")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos XML são permitidos"), false);
    }
  },
});

/**
 * Registra as rotas do Cofre de XML
 */
export function registerXmlVaultRoutes(app: Express) {
  // Adicionar XML ao cofre via upload
  app.post("/api/xml-vault/upload", isAuthenticated, xmlUpload.single("file"), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
      }

      const {
        chaveAcesso,
        tipo = "XML",
        clientId,
        metadados = "{}"
      } = req.body;

      if (!chaveAcesso) {
        return res.status(400).json({ message: "Chave de acesso é obrigatória" });
      }

      if (!clientId) {
        return res.status(400).json({ message: "ID do cliente é obrigatório" });
      }

      // Ler o arquivo
      const xmlContent = fs.readFileSync(req.file.path, "utf8");

      // Processar metadados
      let parsedMetadados = {};
      try {
        parsedMetadados = JSON.parse(metadados);
      } catch (e) {
        console.warn("Metadados inválidos, usando objeto vazio");
      }

      // Armazenar no cofre
      const userId = req.user.claims.sub;
      const result = await xmlVaultService.storeXml(
        xmlContent,
        chaveAcesso,
        tipo,
        parseInt(clientId),
        userId,
        parsedMetadados
      );

      // Remover arquivo temporário
      fs.unlinkSync(req.file.path);

      res.status(201).json({
        message: "XML armazenado com sucesso",
        documentId: result.id
      });
    } catch (error) {
      console.error("Erro no upload de XML:", error);
      res.status(500).json({
        message: "Erro ao processar o arquivo XML",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Adicionar XML ao cofre via JSON
  app.post("/api/xml-vault/store", isAuthenticated, async (req: any, res: Response) => {
    try {
      const {
        xmlContent,
        chaveAcesso,
        tipo = "XML",
        clientId,
        metadados = {}
      } = req.body;

      if (!xmlContent) {
        return res.status(400).json({ message: "Conteúdo XML é obrigatório" });
      }

      if (!chaveAcesso) {
        return res.status(400).json({ message: "Chave de acesso é obrigatória" });
      }

      if (!clientId) {
        return res.status(400).json({ message: "ID do cliente é obrigatório" });
      }

      // Armazenar no cofre
      const userId = req.user.claims.sub;
      const result = await xmlVaultService.storeXml(
        xmlContent,
        chaveAcesso,
        tipo,
        parseInt(clientId),
        userId,
        metadados
      );

      res.status(201).json({
        message: "XML armazenado com sucesso",
        documentId: result.id
      });
    } catch (error) {
      console.error("Erro ao armazenar XML:", error);
      res.status(500).json({
        message: "Erro ao armazenar XML",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Obter XML do cofre por ID
  app.get("/api/xml-vault/document/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const { content, metadata } = await xmlVaultService.getXmlById(documentId);

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Content-Disposition", `attachment; filename="${metadata.tipo || 'documento'}_${metadata.chaveAcesso || documentId}.xml"`);
      res.send(content);
    } catch (error) {
      console.error("Erro ao obter XML:", error);
      res.status(500).json({
        message: "Erro ao obter XML",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Obter metadados de um XML por ID
  app.get("/api/xml-vault/metadata/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const { metadata } = await xmlVaultService.getXmlById(documentId);
      res.json(metadata);
    } catch (error) {
      console.error("Erro ao obter metadados do XML:", error);
      res.status(500).json({
        message: "Erro ao obter metadados",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Verificar integridade do XML
  app.get("/api/xml-vault/verify/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const result = await xmlVaultService.verifyXmlIntegrity(documentId);
      res.json(result);
    } catch (error) {
      console.error("Erro ao verificar integridade do XML:", error);
      res.status(500).json({
        message: "Erro ao verificar integridade",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Listar XMLs por cliente
  app.get("/api/xml-vault/client/:clientId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID do cliente inválido" });
      }

      const xmlList = await xmlVaultService.listClientXmls(clientId);
      res.json(xmlList);
    } catch (error) {
      console.error("Erro ao listar XMLs do cliente:", error);
      res.status(500).json({
        message: "Erro ao listar XMLs",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Buscar XML por chave de acesso
  app.get("/api/xml-vault/chave/:chaveAcesso", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { chaveAcesso } = req.params;
      if (!chaveAcesso) {
        return res.status(400).json({ message: "Chave de acesso é obrigatória" });
      }

      const { content, metadata } = await xmlVaultService.getXmlByChaveAcesso(chaveAcesso);

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Content-Disposition", `attachment; filename="${metadata.tipo || 'documento'}_${chaveAcesso}.xml"`);
      res.send(content);
    } catch (error) {
      console.error("Erro ao obter XML por chave de acesso:", error);
      res.status(500).json({
        message: "Erro ao obter XML",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}