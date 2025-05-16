import axios from 'axios';
import { db } from '../db';
import { apiIntegrations } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface IntegraNfConfig {
  apiKey: string;
  endpoint: string;
  companyId: string;
}

interface EmissaoNFeParams {
  clientId: number;
  numero: string;
  serie: string;
  naturezaOperacao: string;
  dataEmissao: string;
  tipoOperacao: string; // 'entrada' ou 'saida'
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

export class IntegraNfService {
  private static instance: IntegraNfService;
  private configs: Map<number, IntegraNfConfig> = new Map();
  
  private constructor() {}
  
  public static getInstance(): IntegraNfService {
    if (!IntegraNfService.instance) {
      IntegraNfService.instance = new IntegraNfService();
    }
    return IntegraNfService.instance;
  }
  
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
      .where(
        eq(apiIntegrations.clientId, clientId),
        eq(apiIntegrations.type, 'integra_nf'),
        eq(apiIntegrations.active, true)
      );
    
    if (!integration || !integration.config) {
      console.log(`Nenhuma configuração do IntegraNF encontrada para o cliente ${clientId}`);
      return null;
    }
    
    const config = integration.config as unknown as IntegraNfConfig;
    
    // Salva em memória para uso futuro
    this.configs.set(clientId, config);
    
    return config;
  }
  
  /**
   * Emite uma NFe através do IntegraNF
   */
  public async emitirNFe(params: EmissaoNFeParams): Promise<any> {
    const config = await this.loadConfig(params.clientId);
    
    if (!config) {
      throw new Error(`Cliente não possui configuração válida do IntegraNF`);
    }
    
    try {
      // Preparando o payload para a API do IntegraNF
      const payload = {
        apiKey: config.apiKey,
        companyId: config.companyId,
        documento: {
          modelo: '55', // NFe
          numero: params.numero,
          serie: params.serie,
          naturezaOperacao: params.naturezaOperacao,
          dataEmissao: params.dataEmissao,
          tipoOperacao: params.tipoOperacao === 'saida' ? '1' : '0',
          valorTotal: params.valorTotal,
          itens: params.items.map((item, index) => ({
            numeroItem: index + 1,
            descricao: item.descricao,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal,
            ncm: item.ncm,
            cfop: item.cfop,
            unidadeMedida: item.unidadeMedida,
          })),
          destinatario: {
            cnpj: params.destinatario.cnpj.replace(/\D/g, ''),
            nome: params.destinatario.nome,
            endereco: params.destinatario.endereco,
            cidade: params.destinatario.cidade,
            estado: params.destinatario.estado,
            cep: params.destinatario.cep.replace(/\D/g, ''),
            telefone: params.destinatario.telefone?.replace(/\D/g, ''),
          }
        }
      };
      
      // Enviando para a API do IntegraNF
      const response = await axios.post(`${config.endpoint}/emitir-nfe`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao emitir NFe através do IntegraNF:', error);
      throw new Error(`Falha na comunicação com o IntegraNF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Emite uma NFSe através do IntegraNF
   */
  public async emitirNFSe(params: EmissaoNFSeParams): Promise<any> {
    const config = await this.loadConfig(params.clientId);
    
    if (!config) {
      throw new Error(`Cliente não possui configuração válida do IntegraNF`);
    }
    
    try {
      // Preparando o payload para a API do IntegraNF
      const payload = {
        apiKey: config.apiKey,
        companyId: config.companyId,
        documento: {
          modelo: 'nfse',
          valorServico: params.valorServico,
          descricaoServico: params.descricaoServico,
          codigoServico: params.codigoServico,
          dataEmissao: params.dataEmissao,
          tomador: {
            cnpj: params.tomador.cnpj.replace(/\D/g, ''),
            nome: params.tomador.nome,
            endereco: params.tomador.endereco,
            cidade: params.tomador.cidade,
            estado: params.tomador.estado,
            cep: params.tomador.cep.replace(/\D/g, ''),
            email: params.tomador.email,
          }
        }
      };
      
      // Enviando para a API do IntegraNF
      const response = await axios.post(`${config.endpoint}/emitir-nfse`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao emitir NFSe através do IntegraNF:', error);
      throw new Error(`Falha na comunicação com o IntegraNF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Consulta o status de uma nota fiscal no IntegraNF
   */
  public async consultarStatusNota(clientId: number, chaveAcesso: string): Promise<any> {
    const config = await this.loadConfig(clientId);
    
    if (!config) {
      throw new Error(`Cliente não possui configuração válida do IntegraNF`);
    }
    
    try {
      const payload = {
        apiKey: config.apiKey,
        companyId: config.companyId,
        chaveAcesso
      };
      
      const response = await axios.post(`${config.endpoint}/consultar-nota`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar status da nota fiscal no IntegraNF:', error);
      throw new Error(`Falha na comunicação com o IntegraNF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Cancela uma nota fiscal no IntegraNF
   */
  public async cancelarNota(clientId: number, chaveAcesso: string, justificativa: string): Promise<any> {
    const config = await this.loadConfig(clientId);
    
    if (!config) {
      throw new Error(`Cliente não possui configuração válida do IntegraNF`);
    }
    
    try {
      const payload = {
        apiKey: config.apiKey,
        companyId: config.companyId,
        chaveAcesso,
        justificativa
      };
      
      const response = await axios.post(`${config.endpoint}/cancelar-nota`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar nota fiscal no IntegraNF:', error);
      throw new Error(`Falha na comunicação com o IntegraNF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Download do PDF da DANFE/DANFSE
   */
  public async downloadPdf(clientId: number, chaveAcesso: string): Promise<Buffer> {
    const config = await this.loadConfig(clientId);
    
    if (!config) {
      throw new Error(`Cliente não possui configuração válida do IntegraNF`);
    }
    
    try {
      const payload = {
        apiKey: config.apiKey,
        companyId: config.companyId,
        chaveAcesso
      };
      
      const response = await axios.post(`${config.endpoint}/download-pdf`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        responseType: 'arraybuffer'
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer download do PDF no IntegraNF:', error);
      throw new Error(`Falha na comunicação com o IntegraNF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Download do XML da NFe/NFSe
   */
  public async downloadXml(clientId: number, chaveAcesso: string): Promise<string> {
    const config = await this.loadConfig(clientId);
    
    if (!config) {
      throw new Error(`Cliente não possui configuração válida do IntegraNF`);
    }
    
    try {
      const payload = {
        apiKey: config.apiKey,
        companyId: config.companyId,
        chaveAcesso
      };
      
      const response = await axios.post(`${config.endpoint}/download-xml`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      });
      
      return response.data.xml;
    } catch (error) {
      console.error('Erro ao fazer download do XML no IntegraNF:', error);
      throw new Error(`Falha na comunicação com o IntegraNF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Verifica se um cliente tem a configuração do IntegraNF ativa
   */
  public async clienteTemIntegracao(clientId: number): Promise<boolean> {
    const config = await this.loadConfig(clientId);
    return config !== null;
  }
}

// Exporta uma instância singleton
export const integraNfService = IntegraNfService.getInstance();