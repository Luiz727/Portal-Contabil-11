import { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";
import { integraNfService } from "../services/integraNfService";
import path from "path";
import fs from "fs";

// Diretório para uploads
const uploadDir = path.join(process.cwd(), "uploads");

// Garante que o diretório de uploads existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export function registerIntegraNfRoutes(app: Express) {
  // Rota para verificar se um cliente tem a integração ativa com o IntegraNF
  app.get("/api/integranf/status/:clientId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID de cliente inválido" });
      }
      
      const temIntegracao = await integraNfService.clienteTemIntegracao(clientId);
      
      res.json({ 
        integrationActive: temIntegracao,
        service: "IntegraNF"
      });
    } catch (error) {
      console.error("Erro ao verificar status da integração:", error);
      res.status(500).json({ 
        message: "Erro ao verificar integração com o IntegraNF", 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });
  
  // Emissão de NFe via IntegraNF
  app.post("/api/integranf/emitir-nfe", isAuthenticated, async (req: any, res: Response) => {
    try {
      // Obter dados da NFe do banco
      const nfeId = parseInt(req.body.nfeId);
      if (isNaN(nfeId)) {
        return res.status(400).json({ message: "ID da NFe inválido" });
      }
      
      const nfe = await storage.getNfe(nfeId);
      if (!nfe) {
        return res.status(404).json({ message: "NFe não encontrada" });
      }
      
      // Buscar os itens da NFe
      const items = await storage.getNfeItems(nfeId);
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "NFe não possui itens" });
      }
      
      // Buscar dados do cliente
      const cliente = await storage.getClient(nfe.clientId || 0);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      // Preparar parâmetros para emissão via IntegraNF
      const emissaoParams = {
        clientId: nfe.clientId || 0,
        numero: nfe.number,
        serie: nfe.series,
        naturezaOperacao: nfe.nature,
        dataEmissao: typeof nfe.issueDate === 'string' 
          ? nfe.issueDate 
          : nfe.issueDate.toISOString().split('T')[0],
        tipoOperacao: nfe.operationType === 'saída' ? 'saida' : 'entrada',
        valorTotal: Number(nfe.totalValue),
        items: items.map(item => ({
          descricao: item.description,
          quantidade: Number(item.quantity),
          valorUnitario: Number(item.unitValue),
          valorTotal: Number(item.totalValue),
          ncm: item.ncm,
          cfop: item.cfop,
          unidadeMedida: item.unitOfMeasure
        })),
        destinatario: {
          cnpj: cliente.cnpj,
          nome: cliente.name,
          endereco: cliente.address || "",
          cidade: cliente.city || "",
          estado: cliente.state || "",
          cep: cliente.postalCode || "",
          telefone: cliente.phone
        }
      };
      
      // Emitir via IntegraNF
      const resultado = await integraNfService.emitirNFe(emissaoParams);
      
      // Atualizar dados da NFe no banco
      if (resultado.success) {
        await storage.updateNfe(nfeId, {
          status: 'approved',
          accessKey: resultado.chaveAcesso,
          protocol: resultado.protocolo
        });
        
        // Se houver URL do PDF, baixar e salvar
        if (resultado.urlPdf) {
          // Download do PDF
          const pdfBuffer = await integraNfService.downloadPdf(nfe.clientId, resultado.chaveAcesso);
          
          // Salvar PDF
          const pdfPath = path.join(uploadDir, `${resultado.chaveAcesso}.pdf`);
          fs.writeFileSync(pdfPath, pdfBuffer);
          
          // Atualizar caminho do PDF na NFe
          await storage.updateNfe(nfeId, { pdfPath });
        }
        
        // Se houver XML, salvar
        if (resultado.xml) {
          const xmlPath = path.join(uploadDir, `${resultado.chaveAcesso}.xml`);
          fs.writeFileSync(xmlPath, resultado.xml);
          
          // Atualizar caminho do XML na NFe
          await storage.updateNfe(nfeId, { xmlPath });
        }
      } else {
        await storage.updateNfe(nfeId, {
          status: 'rejected',
          notes: resultado.message || "Falha na emissão via IntegraNF"
        });
      }
      
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao emitir NFe via IntegraNF:", error);
      res.status(500).json({ 
        message: "Erro ao emitir NFe via IntegraNF", 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });
  
  // Emissão de NFSe via IntegraNF
  app.post("/api/integranf/emitir-nfse", isAuthenticated, async (req: any, res: Response) => {
    try {
      // Obter dados da NFSe do banco
      const nfseId = parseInt(req.body.nfseId);
      if (isNaN(nfseId)) {
        return res.status(400).json({ message: "ID da NFSe inválido" });
      }
      
      const nfse = await storage.getNfse(nfseId);
      if (!nfse) {
        return res.status(404).json({ message: "NFSe não encontrada" });
      }
      
      // Buscar dados do cliente
      const cliente = await storage.getClient(nfse.clientId);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      
      // Preparar parâmetros para emissão via IntegraNF
      const emissaoParams = {
        clientId: nfse.clientId,
        valorServico: Number(nfse.totalValue),
        descricaoServico: nfse.serviceDescription,
        codigoServico: nfse.serviceCode,
        dataEmissao: nfse.issueDate.toISOString().split('T')[0],
        tomador: {
          cnpj: cliente.cnpj,
          nome: cliente.name,
          endereco: cliente.address || "",
          cidade: cliente.city || "",
          estado: cliente.state || "",
          cep: cliente.postalCode || "",
          email: cliente.email
        }
      };
      
      // Emitir via IntegraNF
      const resultado = await integraNfService.emitirNFSe(emissaoParams);
      
      // Atualizar dados da NFSe no banco
      if (resultado.success) {
        await storage.updateNfse(nfseId, {
          status: 'approved',
          number: resultado.numero || nfse.number,
          verificationCode: resultado.codigoVerificacao,
          accessKey: resultado.chaveAcesso,
          protocol: resultado.protocolo
        });
        
        // Se houver URL do PDF, baixar e salvar
        if (resultado.urlPdf) {
          // Download do PDF
          const pdfBuffer = await integraNfService.downloadPdf(nfse.clientId, resultado.chaveAcesso);
          
          // Salvar PDF
          const pdfPath = path.join(uploadDir, `${resultado.chaveAcesso}.pdf`);
          fs.writeFileSync(pdfPath, pdfBuffer);
          
          // Atualizar caminho do PDF na NFSe
          await storage.updateNfse(nfseId, { pdfPath });
        }
        
        // Se houver XML, salvar
        if (resultado.xml) {
          const xmlPath = path.join(uploadDir, `${resultado.chaveAcesso}.xml`);
          fs.writeFileSync(xmlPath, resultado.xml);
          
          // Atualizar caminho do XML na NFSe
          await storage.updateNfse(nfseId, { xmlPath });
        }
      } else {
        await storage.updateNfse(nfseId, {
          status: 'rejected',
          notes: resultado.message || "Falha na emissão via IntegraNF"
        });
      }
      
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao emitir NFSe via IntegraNF:", error);
      res.status(500).json({ 
        message: "Erro ao emitir NFSe via IntegraNF", 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });
  
  // Consulta de status de nota fiscal via IntegraNF
  app.get("/api/integranf/consultar/:clientId/:chaveAcesso", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const { chaveAcesso } = req.params;
      
      if (isNaN(clientId) || !chaveAcesso) {
        return res.status(400).json({ message: "Parâmetros inválidos" });
      }
      
      const resultado = await integraNfService.consultarStatusNota(clientId, chaveAcesso);
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao consultar status da nota via IntegraNF:", error);
      res.status(500).json({ 
        message: "Erro ao consultar status da nota", 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });
  
  // Cancelamento de nota fiscal via IntegraNF
  app.post("/api/integranf/cancelar", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { clientId, chaveAcesso, justificativa, tipo, notaId } = req.body;
      
      if (isNaN(clientId) || !chaveAcesso || !justificativa || !tipo || isNaN(notaId)) {
        return res.status(400).json({ message: "Parâmetros inválidos" });
      }
      
      // Cancelar via IntegraNF
      const resultado = await integraNfService.cancelarNota(clientId, chaveAcesso, justificativa);
      
      // Se cancelou com sucesso, atualizar o status no banco
      if (resultado.success) {
        if (tipo === 'nfe') {
          await storage.updateNfe(notaId, {
            status: 'cancelled',
            notes: `Cancelada em ${new Date().toISOString()} - ${justificativa}`
          });
        } else if (tipo === 'nfse') {
          await storage.updateNfse(notaId, {
            status: 'cancelled',
            notes: `Cancelada em ${new Date().toISOString()} - ${justificativa}`
          });
        }
      }
      
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao cancelar nota via IntegraNF:", error);
      res.status(500).json({ 
        message: "Erro ao cancelar nota", 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });
  
  // Download do PDF da nota fiscal
  app.get("/api/integranf/pdf/:clientId/:chaveAcesso", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const { chaveAcesso } = req.params;
      
      if (isNaN(clientId) || !chaveAcesso) {
        return res.status(400).json({ message: "Parâmetros inválidos" });
      }
      
      // Verificar se já temos o PDF salvo localmente
      const pdfPath = path.join(uploadDir, `${chaveAcesso}.pdf`);
      
      if (fs.existsSync(pdfPath)) {
        return res.download(pdfPath);
      }
      
      // Se não tiver localmente, baixar da API
      const pdfBuffer = await integraNfService.downloadPdf(clientId, chaveAcesso);
      
      // Salvar para uso futuro
      fs.writeFileSync(pdfPath, pdfBuffer);
      
      // Retornar o PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${chaveAcesso}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Erro ao baixar PDF da nota via IntegraNF:", error);
      res.status(500).json({ 
        message: "Erro ao baixar PDF da nota", 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });
  
  // Download do XML da nota fiscal
  app.get("/api/integranf/xml/:clientId/:chaveAcesso", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const { chaveAcesso } = req.params;
      
      if (isNaN(clientId) || !chaveAcesso) {
        return res.status(400).json({ message: "Parâmetros inválidos" });
      }
      
      // Verificar se já temos o XML salvo localmente
      const xmlPath = path.join(uploadDir, `${chaveAcesso}.xml`);
      
      if (fs.existsSync(xmlPath)) {
        return res.download(xmlPath);
      }
      
      // Se não tiver localmente, baixar da API
      const xmlContent = await integraNfService.downloadXml(clientId, chaveAcesso);
      
      // Salvar para uso futuro
      fs.writeFileSync(xmlPath, xmlContent);
      
      // Retornar o XML
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename=${chaveAcesso}.xml`);
      res.send(xmlContent);
    } catch (error) {
      console.error("Erro ao baixar XML da nota via IntegraNF:", error);
      res.status(500).json({ 
        message: "Erro ao baixar XML da nota", 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });
}