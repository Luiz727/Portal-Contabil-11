import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { whatsappMessages } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Serviço de integração com WhatsApp
 * Inspirado no WhatsCloud 7.5
 */
class WhatsappService {
  private apiKey: string;
  private apiUrl: string;
  private initialized: boolean = false;
  
  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/v1';
    
    // Verificar se a API está configurada
    this.initialized = !!(this.apiKey && this.apiUrl);
    
    if (!this.initialized) {
      console.warn('Serviço de WhatsApp não inicializado: Chave de API ou URL não configurados');
    }
  }
  
  /**
   * Inicializa o serviço com chave e URL da API
   */
  public initialize(apiKey: string, apiUrl: string): void {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.initialized = true;
    console.log('Serviço de WhatsApp inicializado com sucesso');
  }
  
  /**
   * Verifica se o serviço está inicializado
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Envia uma mensagem simples para um número de WhatsApp
   */
  public async sendMessage(
    to: string,
    message: string,
    clientId?: number,
    metadata: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Serviço de WhatsApp não inicializado'
      };
    }
    
    try {
      // Formatar número (remover caracteres especiais e adicionar prefixo de país se necessário)
      const formattedNumber = this.formatPhoneNumber(to);
      
      // Enviar mensagem para a API
      const response = await axios.post(
        `${this.apiUrl}/messages/text`,
        {
          to: formattedNumber,
          body: message
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Armazenar o histórico da mensagem
      const messageId = response.data?.messageId || `local_${Date.now()}`;
      await this.storeMessageHistory(formattedNumber, message, 'text', messageId, clientId, metadata);
      
      return {
        success: true,
        messageId
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Envia um documento para um número de WhatsApp
   */
  public async sendDocument(
    to: string,
    filePath: string,
    caption: string = '',
    clientId?: number,
    metadata: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Serviço de WhatsApp não inicializado'
      };
    }
    
    try {
      // Verificar se o arquivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }
      
      // Formatar número
      const formattedNumber = this.formatPhoneNumber(to);
      
      // Ler o arquivo como base64
      const fileContent = fs.readFileSync(filePath);
      const base64File = fileContent.toString('base64');
      
      // Determinar o tipo de mídia baseado na extensão
      const extension = path.extname(filePath).toLowerCase();
      const mimeType = this.getMimeType(extension);
      
      // Enviar documento para a API
      const response = await axios.post(
        `${this.apiUrl}/messages/document`,
        {
          to: formattedNumber,
          document: base64File,
          mimetype: mimeType,
          filename: path.basename(filePath),
          caption
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Armazenar o histórico da mensagem
      const messageId = response.data?.messageId || `local_${Date.now()}`;
      await this.storeMessageHistory(
        formattedNumber,
        caption || path.basename(filePath),
        'document',
        messageId,
        clientId,
        {
          ...metadata,
          filePath,
          mimeType
        }
      );
      
      return {
        success: true,
        messageId
      };
    } catch (error) {
      console.error('Erro ao enviar documento WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Envia uma nota fiscal (PDF e XML) via WhatsApp
   */
  public async sendInvoice(
    to: string,
    pdfPath: string,
    xmlPath: string,
    invoiceNumber: string,
    clientId?: number
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Serviço de WhatsApp não inicializado'
      };
    }
    
    try {
      // Formatar número
      const formattedNumber = this.formatPhoneNumber(to);
      
      // Mensagem inicial
      const introMessage = `🧾 *Nota Fiscal Eletrônica #${invoiceNumber}*\n\nSegue em anexo os arquivos da nota fiscal emitida.`;
      
      // Enviar mensagem inicial
      const messageResult = await this.sendMessage(
        formattedNumber,
        introMessage,
        clientId,
        { invoiceNumber }
      );
      
      if (!messageResult.success) {
        throw new Error(`Falha ao enviar mensagem: ${messageResult.error}`);
      }
      
      // Enviar PDF da NF
      const pdfResult = await this.sendDocument(
        formattedNumber,
        pdfPath,
        `Nota Fiscal #${invoiceNumber} - PDF`,
        clientId,
        { 
          invoiceNumber,
          documentType: 'invoice_pdf'
        }
      );
      
      if (!pdfResult.success) {
        throw new Error(`Falha ao enviar PDF: ${pdfResult.error}`);
      }
      
      // Enviar XML da NF
      const xmlResult = await this.sendDocument(
        formattedNumber,
        xmlPath,
        `Nota Fiscal #${invoiceNumber} - XML`,
        clientId,
        { 
          invoiceNumber,
          documentType: 'invoice_xml'
        }
      );
      
      if (!xmlResult.success) {
        throw new Error(`Falha ao enviar XML: ${xmlResult.error}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar nota fiscal por WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Obtém histórico de mensagens por cliente
   */
  public async getMessageHistory(clientId: number): Promise<any[]> {
    try {
      const messages = await db
        .select()
        .from(whatsappMessages)
        .where(eq(whatsappMessages.clientId, clientId))
        .orderBy(whatsappMessages.sentAt);
      
      return messages;
    } catch (error) {
      console.error('Erro ao obter histórico de mensagens:', error);
      return [];
    }
  }
  
  /**
   * Armazena o histórico de mensagem no banco de dados
   */
  private async storeMessageHistory(
    phoneNumber: string,
    content: string,
    type: string,
    messageId: string,
    clientId?: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await db.insert(whatsappMessages).values({
        phoneNumber,
        message: content,
        messageType: type,
        externalId: messageId,
        clientId: clientId || null,
        metadata,
        status: 'sent',
        sentAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao armazenar histórico de mensagem:', error);
    }
  }
  
  /**
   * Formata o número de telefone para o padrão internacional
   * Exemplo: converte "(11) 98765-4321" para "5511987654321"
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remover todos os caracteres não numéricos
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Se o número não começar com o código do país (55 para Brasil)
    if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    
    // Se estiver faltando o 9 no início do número de celular (após DDD)
    if (cleaned.length === 12) {
      cleaned = cleaned.substring(0, 4) + '9' + cleaned.substring(4);
    }
    
    return cleaned;
  }
  
  /**
   * Determina o tipo MIME baseado na extensão do arquivo
   */
  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.xml': 'application/xml',
      '.jpeg': 'image/jpeg',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  }
}

export const whatsappService = new WhatsappService();