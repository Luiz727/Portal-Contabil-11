import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../db';
import { xml2js, js2xml } from 'xml-js';
import { documents } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

const XML_VAULT_DIR = path.join(process.cwd(), 'uploads', 'xml_vault');

// Garantir que a pasta do cofre existe
if (!fs.existsSync(XML_VAULT_DIR)) {
  fs.mkdirSync(XML_VAULT_DIR, { recursive: true });
}

// Interface para os dados do documento fiscal
export interface FiscalDocument {
  type: 'NFe' | 'NFSe' | 'CTe' | 'MDFe';
  number: string;
  accessKey?: string;
  issueDate: Date;
  xmlContent: string;
  emitterCnpj: string;
  emitterName: string;
  receiverCnpj?: string;
  receiverName?: string;
  totalValue: number;
  clientId?: number;
  userId: string;
}

// Classe para gerenciar o armazenamento seguro de XMLs fiscais
export class XmlVaultService {
  /**
   * Salva um documento XML no cofre
   */
  public async storeXml(fiscalDoc: FiscalDocument): Promise<{ id: number; path: string }> {
    try {
      // Gerar hash do conteúdo para verificação futura de integridade
      const hash = crypto.createHash('sha256').update(fiscalDoc.xmlContent).digest('hex');
      
      // Nome do arquivo baseado na chave de acesso ou número + tipo
      const fileName = fiscalDoc.accessKey || 
        `${fiscalDoc.type}_${fiscalDoc.number}_${Date.now()}.xml`;
      
      // Caminho completo do arquivo
      const filePath = path.join(XML_VAULT_DIR, fileName);
      
      // Salvar conteúdo XML no disco
      fs.writeFileSync(filePath, fiscalDoc.xmlContent);
      
      // Registrar o documento no banco de dados
      const [document] = await db.insert(documents).values({
        name: `${fiscalDoc.type} ${fiscalDoc.number} - ${fiscalDoc.emitterName}`,
        description: `Documento fiscal eletrônico: ${fiscalDoc.type} ${fiscalDoc.number}`,
        path: filePath,
        fileType: 'xml',
        size: Buffer.byteLength(fiscalDoc.xmlContent, 'utf8'),
        clientId: fiscalDoc.clientId || null,
        categoryId: null, // Poderíamos ter uma categoria específica para documentos fiscais
        uploadedBy: fiscalDoc.userId,
        metadata: {
          type: fiscalDoc.type,
          number: fiscalDoc.number,
          accessKey: fiscalDoc.accessKey,
          issueDate: fiscalDoc.issueDate.toISOString(),
          emitterCnpj: fiscalDoc.emitterCnpj,
          emitterName: fiscalDoc.emitterName,
          receiverCnpj: fiscalDoc.receiverCnpj,
          receiverName: fiscalDoc.receiverName,
          totalValue: fiscalDoc.totalValue,
          xmlHash: hash
        }
      }).returning();
      
      return {
        id: document.id,
        path: filePath
      };
    } catch (error) {
      console.error('Erro ao armazenar XML no cofre:', error);
      throw error;
    }
  }
  
  /**
   * Recupera um documento XML do cofre
   */
  public async retrieveXml(documentId: number): Promise<{ xmlContent: string; metadata: any }> {
    try {
      // Buscar informações do documento no banco de dados
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, documentId));
      
      if (!document) {
        throw new Error(`Documento não encontrado: ID ${documentId}`);
      }
      
      // Verificar se é um documento XML
      if (document.fileType !== 'xml') {
        throw new Error('O documento solicitado não é um XML');
      }
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(document.path)) {
        throw new Error('Arquivo XML não encontrado no disco');
      }
      
      // Ler o conteúdo do XML
      const xmlContent = fs.readFileSync(document.path, 'utf8');
      
      // Verificar integridade do arquivo
      const currentHash = crypto.createHash('sha256').update(xmlContent).digest('hex');
      
      if (document.metadata && document.metadata.xmlHash && currentHash !== document.metadata.xmlHash) {
        throw new Error('Integridade do XML comprometida: o hash atual não corresponde ao original');
      }
      
      return {
        xmlContent,
        metadata: document.metadata
      };
    } catch (error) {
      console.error('Erro ao recuperar XML do cofre:', error);
      throw error;
    }
  }
  
  /**
   * Busca documentos fiscais por tipo, emissor, destinatário ou período
   */
  public async searchDocuments(params: {
    type?: string;
    emitterCnpj?: string;
    receiverCnpj?: string;
    clientId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    try {
      // Iniciar a query
      let query = db.select().from(documents);
      
      // Filtrar apenas documentos XML
      query = query.where(eq(documents.fileType, 'xml'));
      
      // Adicionar condições baseadas nos parâmetros
      // Na implementação real, isso seria mais complexo e usaria JSON functions para filtrar no metadata
      if (params.clientId) {
        query = query.where(eq(documents.clientId, params.clientId));
      }
      
      // Executar a consulta
      const results = await query;
      
      // Filtros adicionais no resultado (poderia ser feito no banco com JSON functions)
      return results.filter(doc => {
        if (!doc.metadata) return false;
        
        if (params.type && doc.metadata.type !== params.type) return false;
        if (params.emitterCnpj && doc.metadata.emitterCnpj !== params.emitterCnpj) return false;
        if (params.receiverCnpj && doc.metadata.receiverCnpj !== params.receiverCnpj) return false;
        
        if (params.startDate && params.endDate) {
          const docDate = new Date(doc.metadata.issueDate);
          if (docDate < params.startDate || docDate > params.endDate) return false;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Erro ao buscar documentos fiscais:', error);
      throw error;
    }
  }
  
  /**
   * Valida um XML fiscal
   */
  public validateXml(xmlContent: string, type: 'NFe' | 'NFSe' | 'CTe' | 'MDFe'): { valid: boolean; errors?: any[] } {
    try {
      // Conversão para validar a estrutura do XML
      const parsedXml = xml2js(xmlContent, { compact: true });
      
      // Em uma implementação real, aqui teríamos verificações específicas para cada tipo de documento
      // usando esquemas XSD ou validações customizadas
      
      // Verificação básica da estrutura
      if (type === 'NFe' && !parsedXml.nfeProc?.NFe?.infNFe) {
        return {
          valid: false,
          errors: [{ message: 'Estrutura de NFe inválida' }]
        };
      }
      
      if (type === 'NFSe' && !parsedXml.CompNfse) {
        return {
          valid: false,
          errors: [{ message: 'Estrutura de NFSe inválida' }]
        };
      }
      
      // Adicionar mais validações específicas para cada tipo de documento
      
      return { valid: true };
    } catch (error) {
      console.error('Erro ao validar XML fiscal:', error);
      return {
        valid: false,
        errors: [{ message: error.message }]
      };
    }
  }
  
  /**
   * Extrai informações básicas de um XML fiscal
   */
  public extractXmlInfo(xmlContent: string): Partial<FiscalDocument> | null {
    try {
      const parsedXml = xml2js(xmlContent, { compact: true });
      
      // Tentar detectar o tipo e extrair informações baseado na estrutura
      if (parsedXml.nfeProc?.NFe?.infNFe) {
        // É uma NFe
        const infNFe = parsedXml.nfeProc.NFe.infNFe;
        const ide = infNFe.ide || {};
        const emit = infNFe.emit || {};
        const dest = infNFe.dest || {};
        const total = infNFe.total?.ICMSTot || {};
        
        return {
          type: 'NFe',
          number: ide.nNF?._text,
          accessKey: infNFe._attributes?.Id?.replace('NFe', '') || null,
          issueDate: ide.dhEmi?._text ? new Date(ide.dhEmi._text) : new Date(),
          emitterCnpj: emit.CNPJ?._text,
          emitterName: emit.xNome?._text,
          receiverCnpj: dest.CNPJ?._text || dest.CPF?._text,
          receiverName: dest.xNome?._text,
          totalValue: parseFloat(total.vNF?._text || '0'),
          xmlContent
        };
      }
      
      if (parsedXml.CompNfse) {
        // É uma NFSe - a estrutura varia muito entre municípios
        const nfse = parsedXml.CompNfse.Nfse || {};
        const infNfse = nfse.InfNfse || {};
        const prestador = infNfse.PrestadorServico || {};
        const tomador = infNfse.TomadorServico || {};
        
        return {
          type: 'NFSe',
          number: infNfse.Numero?._text,
          issueDate: infNfse.DataEmissao?._text ? new Date(infNfse.DataEmissao._text) : new Date(),
          emitterCnpj: prestador.IdentificacaoPrestador?.Cnpj?._text,
          emitterName: prestador.RazaoSocial?._text,
          receiverCnpj: tomador.IdentificacaoTomador?.CpfCnpj?.Cnpj?._text || tomador.IdentificacaoTomador?.CpfCnpj?.Cpf?._text,
          receiverName: tomador.RazaoSocial?._text,
          totalValue: parseFloat(infNfse.ValoresNfse?.ValorLiquido?._text || infNfse.Servico?.Valores?.ValorServicos?._text || '0'),
          xmlContent
        };
      }
      
      // Para outros tipos (CTe, MDFe, etc.), implementar detecção específica
      
      return null;
    } catch (error) {
      console.error('Erro ao extrair informações do XML:', error);
      return null;
    }
  }
}

// Exportar instância singleton
export const xmlVaultService = new XmlVaultService();