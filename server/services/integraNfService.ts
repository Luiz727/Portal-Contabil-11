import axios from 'axios';
import fs from 'fs';
import { db } from '../db';
import { apiIntegrations } from '@shared/schema';
import { eq } from 'drizzle-orm';
import memoizee from 'memoizee';

// Interface para a configuração do IntegraNF
interface IntegraNfConfig {
  apiUrl: string;
  apiKey: string;
  cnpj: string;
}

// Interface para os parâmetros de emissão de NFe
interface EmissaoNFeParams {
  clientId: number;
  numero: string;
  serie: string;
  naturezaOperacao: string;
  dataEmissao: string;
  tipoOperacao: 'entrada' | 'saida';
  valorTotal: number;
  items: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    ncm: string;
    cfop: string;
    unidadeMedida: string;
  }>;
  destinatario: {
    cnpj: string;
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    telefone?: string;
  };
}

// Interface para os parâmetros de emissão de NFSe
interface EmissaoNFSeParams {
  clientId: number;
  valorServico: number;
  descricaoServico: string;
  codigoServico: string;
  dataEmissao: string;
  tomador: {
    cnpj: string;
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    email?: string;
  };
}

// Resultado padrão para operações de NFe/NFSe
interface ResultadoIntegraNf {
  success: boolean;
  message?: string;
  chaveAcesso?: string;
  numero?: string;
  serie?: string;
  protocolo?: string;
  status?: string;
  codigoVerificacao?: string;
  urlPdf?: string;
  xml?: string;
}

/**
 * Serviço para integração com a API do IntegraNF
 */
class IntegraNfService {
  // Cache de configurações por clientId
  private configs: Map<number, IntegraNfConfig> = new Map();
  
  // O método `clienteTemIntegracao` é memoizado para evitar consultas repetidas ao BD
  public clienteTemIntegracao = memoizee(
    async (clientId: number): Promise<boolean> => {
      const config = await this.loadConfig(clientId);
      return config !== null;
    },
    { maxAge: 60000, promise: true } // Cache por 1 minuto
  );
  
  /**
   * Carrega a configuração do IntegraNF para um cliente específico
   */
  public async loadConfig(clientId: number): Promise<IntegraNfConfig | null> {
    // Verifica se já temos a configuração em memória
    if (this.configs.has(clientId)) {
      return this.configs.get(clientId) as IntegraNfConfig;
    }
    
    // Busca configuração no banco de dados
    const [integration] = await db
      .select()
      .from(apiIntegrations)
      .where(eq(apiIntegrations.clientId, clientId));
    
    if (!integration || !integration.config) {
      console.log(`Nenhuma configuração do IntegraNF encontrada para o cliente ${clientId}`);
      return null;
    }
    
    // Assume que temos um objeto JSON válido em integration.config
    const config = typeof integration.config === 'string' 
      ? JSON.parse(integration.config) 
      : integration.config;
    
    if (!config.apiUrl || !config.apiKey || !config.cnpj) {
      console.log(`Configuração do IntegraNF incompleta para o cliente ${clientId}`);
      return null;
    }
    
    // Armazena em cache para uso futuro
    this.configs.set(clientId, config);
    
    return config;
  }
  
  /**
   * Emite uma Nota Fiscal Eletrônica (NFe) via IntegraNF
   */
  public async emitirNFe(params: EmissaoNFeParams): Promise<ResultadoIntegraNf> {
    try {
      const config = await this.loadConfig(params.clientId);
      if (!config) {
        return {
          success: false,
          message: "Configuração do IntegraNF não encontrada para este cliente"
        };
      }
      
      // Chamada à API do IntegraNF
      const response = await axios.post(
        `${config.apiUrl}/nfe/emitir`,
        {
          ...params,
          cnpjEmitente: config.cnpj
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Verifica se a requisição foi bem-sucedida
      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          chaveAcesso: response.data.chaveAcesso,
          numero: response.data.numero,
          serie: response.data.serie,
          protocolo: response.data.protocolo,
          status: response.data.status,
          urlPdf: response.data.urlPdf,
          xml: response.data.xml
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Falha na emissão da NFe"
        };
      }
    } catch (error) {
      console.error('Erro ao emitir NFe via IntegraNF:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao emitir NFe"
      };
    }
  }
  
  /**
   * Emite uma Nota Fiscal de Serviço Eletrônica (NFSe) via IntegraNF
   */
  public async emitirNFSe(params: EmissaoNFSeParams): Promise<ResultadoIntegraNf> {
    try {
      const config = await this.loadConfig(params.clientId);
      if (!config) {
        return {
          success: false,
          message: "Configuração do IntegraNF não encontrada para este cliente"
        };
      }
      
      // Chamada à API do IntegraNF
      const response = await axios.post(
        `${config.apiUrl}/nfse/emitir`,
        {
          ...params,
          cnpjPrestador: config.cnpj
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Verifica se a requisição foi bem-sucedida
      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          chaveAcesso: response.data.chaveAcesso,
          numero: response.data.numero,
          protocolo: response.data.protocolo,
          status: response.data.status,
          codigoVerificacao: response.data.codigoVerificacao,
          urlPdf: response.data.urlPdf,
          xml: response.data.xml
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Falha na emissão da NFSe"
        };
      }
    } catch (error) {
      console.error('Erro ao emitir NFSe via IntegraNF:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao emitir NFSe"
      };
    }
  }
  
  /**
   * Consulta o status de uma nota fiscal pela chave de acesso
   */
  public async consultarStatusNota(clientId: number, chaveAcesso: string): Promise<ResultadoIntegraNf> {
    try {
      const config = await this.loadConfig(clientId);
      if (!config) {
        return {
          success: false,
          message: "Configuração do IntegraNF não encontrada para este cliente"
        };
      }
      
      // Chamada à API do IntegraNF
      const response = await axios.get(
        `${config.apiUrl}/nota/consultar/${chaveAcesso}`,
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          }
        }
      );
      
      // Verifica se a requisição foi bem-sucedida
      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          chaveAcesso: chaveAcesso,
          status: response.data.status,
          message: response.data.mensagem
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Falha na consulta da nota fiscal"
        };
      }
    } catch (error) {
      console.error('Erro ao consultar nota fiscal via IntegraNF:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao consultar nota fiscal"
      };
    }
  }
  
  /**
   * Cancela uma nota fiscal
   */
  public async cancelarNota(clientId: number, chaveAcesso: string, justificativa: string): Promise<ResultadoIntegraNf> {
    try {
      const config = await this.loadConfig(clientId);
      if (!config) {
        return {
          success: false,
          message: "Configuração do IntegraNF não encontrada para este cliente"
        };
      }
      
      // Chamada à API do IntegraNF
      const response = await axios.post(
        `${config.apiUrl}/nota/cancelar`,
        {
          chaveAcesso,
          justificativa,
          cnpj: config.cnpj
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Verifica se a requisição foi bem-sucedida
      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          chaveAcesso: chaveAcesso,
          protocolo: response.data.protocolo,
          message: "Nota fiscal cancelada com sucesso"
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Falha no cancelamento da nota fiscal"
        };
      }
    } catch (error) {
      console.error('Erro ao cancelar nota fiscal via IntegraNF:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao cancelar nota fiscal"
      };
    }
  }
  
  /**
   * Faz download do PDF de uma nota fiscal
   */
  public async downloadPdf(clientId: number, chaveAcesso: string): Promise<Buffer> {
    try {
      const config = await this.loadConfig(clientId);
      if (!config) {
        throw new Error("Configuração do IntegraNF não encontrada para este cliente");
      }
      
      // Chamada à API do IntegraNF
      const response = await axios.get(
        `${config.apiUrl}/nota/pdf/${chaveAcesso}`,
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          },
          responseType: 'arraybuffer'
        }
      );
      
      // Verifica se a resposta é válida
      if (response.status !== 200) {
        throw new Error(`Erro ao baixar PDF. Status: ${response.status}`);
      }
      
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Erro ao baixar PDF via IntegraNF:', error);
      throw error;
    }
  }
  
  /**
   * Faz download do XML de uma nota fiscal
   */
  public async downloadXml(clientId: number, chaveAcesso: string): Promise<string> {
    try {
      const config = await this.loadConfig(clientId);
      if (!config) {
        throw new Error("Configuração do IntegraNF não encontrada para este cliente");
      }
      
      // Chamada à API do IntegraNF
      const response = await axios.get(
        `${config.apiUrl}/nota/xml/${chaveAcesso}`,
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          }
        }
      );
      
      // Verifica se a resposta é válida
      if (response.status !== 200) {
        throw new Error(`Erro ao baixar XML. Status: ${response.status}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar XML via IntegraNF:', error);
      throw error;
    }
  }
}

// Exporta uma instância única do serviço
export const integraNfService = new IntegraNfService();