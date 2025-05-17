import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { db } from '../db';
import { whatsappMessages } from '@shared/schema';

// Classe para integração com serviços de API WhatsApp
export class WhatsAppService {
  private apiKey: string;
  private apiUrl: string;
  private senderNumber: string;

  constructor() {
    // Obter credenciais do ambiente
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp-service.com/v1';
    this.senderNumber = process.env.WHATSAPP_SENDER_NUMBER || '';
  }

  /**
   * Verifica se o serviço está configurado corretamente
   */
  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiUrl && this.senderNumber);
  }

  /**
   * Envia uma mensagem de texto via WhatsApp
   */
  public async sendTextMessage(
    phoneNumber: string,
    message: string,
    clientId?: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Verificar configuração
      if (!this.isConfigured()) {
        throw new Error('Serviço de WhatsApp não configurado');
      }

      // Formatação do número de telefone (remover caracteres não numéricos)
      const formattedPhone = phoneNumber.replace(/\D/g, '');

      // Em produção, aqui estaria a chamada real à API
      // Exemplo com axios:
      /*
      const response = await axios.post(
        `${this.apiUrl}/messages/text`,
        {
          to: formattedPhone,
          message: message
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const messageId = response.data.id;
      */

      // Simulação para ambiente de desenvolvimento
      console.log(`[WhatsApp] Enviando mensagem para ${formattedPhone}: ${message}`);
      
      // Gerar um ID fake para a mensagem
      const messageId = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Registrar a mensagem no banco de dados
      await db.insert(whatsappMessages).values({
        phone: formattedPhone,
        content: message,
        status: 'sent',
        clientId: clientId || null,
        sentAt: new Date()
      });

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
   * Envia um arquivo via WhatsApp
   */
  public async sendFile(
    phoneNumber: string,
    filePath: string,
    caption: string,
    clientId?: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Verificar configuração
      if (!this.isConfigured()) {
        throw new Error('Serviço de WhatsApp não configurado');
      }

      // Verificar se o arquivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }

      // Formatação do número de telefone
      const formattedPhone = phoneNumber.replace(/\D/g, '');

      // Em produção, aqui estaria a chamada real à API
      // Exemplo com axios e FormData:
      /*
      const formData = new FormData();
      formData.append('to', formattedPhone);
      formData.append('caption', caption);
      formData.append('file', fs.createReadStream(filePath));

      const response = await axios.post(
        `${this.apiUrl}/messages/file`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders()
          }
        }
      );

      const messageId = response.data.id;
      */

      // Simulação para ambiente de desenvolvimento
      console.log(`[WhatsApp] Enviando arquivo para ${formattedPhone}: ${filePath} com legenda: ${caption}`);
      
      // Gerar um ID fake para a mensagem
      const messageId = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Registrar a mensagem no banco de dados
      await db.insert(whatsappMessages).values({
        phone: formattedPhone,
        content: `[Arquivo: ${filePath}] ${caption}`,
        status: 'sent',
        clientId: clientId || null,
        sentAt: new Date()
      });

      return {
        success: true,
        messageId
      };
    } catch (error) {
      console.error('Erro ao enviar arquivo via WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Envia uma nota fiscal (NFe/NFSe) via WhatsApp
   */
  public async sendInvoice(
    phoneNumber: string,
    invoiceType: 'NFe' | 'NFSe',
    invoiceNumber: string,
    filePath: string,
    clientName: string,
    clientId?: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Montar mensagem personalizada
      const caption = `*${invoiceType} ${invoiceNumber}*\n\n` +
        `Olá! Segue em anexo a ${invoiceType} emitida para ${clientName}.\n` +
        `Este documento também está disponível no portal do cliente.\n\n` +
        `Em caso de dúvidas, entre em contato conosco.`;

      // Enviar o arquivo
      return await this.sendFile(phoneNumber, filePath, caption, clientId);
    } catch (error) {
      console.error(`Erro ao enviar ${invoiceType} via WhatsApp:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Obtém as mensagens enviadas para um cliente
   */
  public async getMessagesByClient(clientId: number): Promise<any[]> {
    try {
      return await db
        .select()
        .from(whatsappMessages)
        .where({ clientId });
    } catch (error) {
      console.error('Erro ao buscar mensagens do cliente:', error);
      throw error;
    }
  }

  /**
   * Obtém as mensagens enviadas para um número de telefone
   */
  public async getMessagesByPhone(phoneNumber: string): Promise<any[]> {
    try {
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      return await db
        .select()
        .from(whatsappMessages)
        .where({ phone: formattedPhone });
    } catch (error) {
      console.error('Erro ao buscar mensagens do telefone:', error);
      throw error;
    }
  }
}

// Exportar instância singleton
export const whatsappService = new WhatsAppService();