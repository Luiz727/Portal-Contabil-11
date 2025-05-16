import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../db';
import { documents } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

// Diretório do cofre
const VAULT_DIR = path.join(process.cwd(), 'uploads', 'xml_vault');

// Garantir que o diretório existe
if (!fs.existsSync(VAULT_DIR)) {
  fs.mkdirSync(VAULT_DIR, { recursive: true });
}

/**
 * Serviço para armazenamento seguro de documentos XML
 */
class XmlVaultService {
  /**
   * Armazena um XML no cofre e registra no banco de dados
   * @param xmlContent Conteúdo do XML
   * @param chaveAcesso Chave de acesso da NF
   * @param tipo Tipo de documento (NFe, NFSe, etc)
   * @param clientId ID do cliente
   * @param userId ID do usuário que está salvando
   * @param metadados Dados adicionais sobre o documento
   */
  public async storeXml(
    xmlContent: string,
    chaveAcesso: string,
    tipo: string,
    clientId: number,
    userId: string,
    metadados: Record<string, any> = {}
  ): Promise<{ id: number; path: string }> {
    try {
      // Gerar hash do conteúdo para verificação de integridade
      const hash = crypto.createHash('sha256').update(xmlContent).digest('hex');
      
      // Verificar se já existe arquivo com esta chave de acesso
      const filePath = path.join(VAULT_DIR, `${chaveAcesso}.xml`);
      
      // Salvar o arquivo
      fs.writeFileSync(filePath, xmlContent);
      
      // Criar registro no banco de dados
      const [docRecord] = await db
        .insert(documents)
        .values({
          name: `${tipo}_${chaveAcesso}.xml`,
          path: filePath,
          fileType: 'xml',
          size: Buffer.from(xmlContent).length,
          clientId,
          uploadedBy: userId,
          description: `XML ${tipo} - Chave: ${chaveAcesso}`,
          metadata: {
            ...metadados,
            chaveAcesso,
            tipo,
            hash,
            storedAt: new Date().toISOString()
          }
        })
        .returning();
      
      return {
        id: docRecord.id,
        path: filePath
      };
    } catch (error) {
      console.error('Erro ao armazenar XML no cofre:', error);
      throw error;
    }
  }
  
  /**
   * Recupera um XML do cofre pelo ID do documento
   */
  public async getXmlById(documentId: number): Promise<{ content: string; metadata: any }> {
    try {
      // Buscar documento no banco
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, documentId));
      
      if (!document) {
        throw new Error(`Documento não encontrado: ${documentId}`);
      }
      
      if (document.fileType !== 'xml') {
        throw new Error(`Documento não é um XML: ${documentId}`);
      }
      
      // Ler o arquivo
      const xmlContent = fs.readFileSync(document.path, 'utf8');
      
      // Verificar integridade do arquivo
      const hash = crypto.createHash('sha256').update(xmlContent).digest('hex');
      
      // Metadados do documento
      const metadata = document.metadata || {};
      
      // Se houver hash nos metadados, verificar se corresponde
      if (metadata.hash && metadata.hash !== hash) {
        console.warn(`Alerta: Hash do XML não corresponde ao armazenado. Documento ID: ${documentId}`);
      }
      
      return {
        content: xmlContent,
        metadata
      };
    } catch (error) {
      console.error('Erro ao recuperar XML do cofre:', error);
      throw error;
    }
  }
  
  /**
   * Recupera um XML do cofre pela chave de acesso
   */
  public async getXmlByChaveAcesso(chaveAcesso: string): Promise<{ content: string; metadata: any }> {
    try {
      // Buscar documento no banco pela chave de acesso nos metadados
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.fileType, 'xml'));
        
      // Filtrar pelo chaveAcesso no metadata
      // Note: Esta é uma implementação simplificada. Em um banco relacional real,
      // seria melhor ter uma tabela específica para metadados de XML ou usar JSONB com índices.
      const docWithChave = document && document.metadata && 
        typeof document.metadata === 'object' && 
        document.metadata.chaveAcesso === chaveAcesso 
          ? document 
          : null;
      
      if (!docWithChave) {
        throw new Error(`XML com chave de acesso não encontrado: ${chaveAcesso}`);
      }
      
      // Ler o arquivo
      const xmlContent = fs.readFileSync(docWithChave.path, 'utf8');
      
      return {
        content: xmlContent,
        metadata: docWithChave.metadata || {}
      };
    } catch (error) {
      console.error('Erro ao recuperar XML pela chave de acesso:', error);
      throw error;
    }
  }
  
  /**
   * Lista todos os XMLs de um cliente
   */
  public async listClientXmls(clientId: number): Promise<Array<{ id: number; chaveAcesso: string; tipo: string; storedAt: string }>> {
    try {
      // Buscar documentos XML do cliente
      const docs = await db
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.clientId, clientId),
            eq(documents.fileType, 'xml')
          )
        );
      
      // Mapear para o formato simplificado
      return docs
        .filter(doc => doc.metadata && typeof doc.metadata === 'object')
        .map(doc => {
          const metadata = doc.metadata as Record<string, any>;
          return {
            id: doc.id,
            chaveAcesso: metadata.chaveAcesso || '',
            tipo: metadata.tipo || 'Desconhecido',
            storedAt: metadata.storedAt || doc.createdAt?.toISOString() || ''
          };
        });
    } catch (error) {
      console.error('Erro ao listar XMLs do cliente:', error);
      throw error;
    }
  }
  
  /**
   * Verifica a integridade de um XML no cofre
   */
  public async verifyXmlIntegrity(documentId: number): Promise<{ isValid: boolean; message?: string }> {
    try {
      // Buscar documento no banco
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, documentId));
      
      if (!document) {
        return { isValid: false, message: `Documento não encontrado: ${documentId}` };
      }
      
      if (document.fileType !== 'xml') {
        return { isValid: false, message: `Documento não é um XML: ${documentId}` };
      }
      
      // Metadados do documento
      const metadata = document.metadata || {};
      
      // Se não houver hash nos metadados, não é possível verificar
      if (!metadata.hash) {
        return { isValid: false, message: 'Documento não possui hash armazenado' };
      }
      
      // Ler o arquivo
      const xmlContent = fs.readFileSync(document.path, 'utf8');
      
      // Verificar hash
      const currentHash = crypto.createHash('sha256').update(xmlContent).digest('hex');
      
      // Comparar com o hash armazenado
      if (metadata.hash !== currentHash) {
        return { 
          isValid: false, 
          message: 'Hash do documento não corresponde ao armazenado. Possível adulteração.' 
        };
      }
      
      return { isValid: true };
    } catch (error) {
      console.error('Erro ao verificar integridade do XML:', error);
      return { 
        isValid: false, 
        message: `Erro ao verificar integridade: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      };
    }
  }
}

// Exporta uma instância única do serviço
export const xmlVaultService = new XmlVaultService();