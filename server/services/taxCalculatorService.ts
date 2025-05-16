import { db } from '../db';
import {
  clients,
  taxSimulations,
  taxSimulationItems,
  universalProducts,
  clientProductPrices,
  nfes,
  nfeItems,
} from '@shared/schema';
import { eq, and, inArray } from 'drizzle-orm';

type TaxInput = {
  operationType: 'entrada' | 'saida';
  originState: string;
  destinationState: string;
  taxRegime: 'simples_nacional' | 'lucro_presumido' | 'lucro_real';
  clientId?: number;
  items: Array<{
    universalProductId: number;
    quantity: number;
    unitValue?: number; // Se não for fornecido, usa o preço do produto
    description?: string; // Se não for fornecido, usa a descrição do produto
    customNCM?: string; // Se não for fornecido, usa o NCM do produto
    customCFOP?: string; // Se não for fornecido, usa o CFOP do produto
    discountValue?: number;
  }>;
  freightValue?: number;
  insuranceValue?: number;
  otherCosts?: number;
  notes?: string;
};

type TaxItem = {
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  ncm: string;
  cfop: string;
  unitOfMeasure: string;
  icmsValue: number;
  icmsRate: number;
  icmsStValue: number;
  icmsStRate: number;
  ipiValue: number;
  ipiRate: number;
  pisValue: number;
  pisRate: number;
  cofinsValue: number;
  cofinsRate: number;
  issValue: number;
  issRate: number;
  discountValue: number;
  netValue: number;
  profitMargin?: number;
  costPrice?: number;
};

type TaxResult = {
  totalValue: number;
  totalTaxes: number;
  icmsTotal: number;
  icmsStTotal: number;
  ipiTotal: number;
  pisTotal: number;
  cofinsTotal: number;
  issTotal: number;
  items: TaxItem[];
};

/**
 * Serviço para cálculo de impostos e simulações fiscais
 */
class TaxCalculatorService {
  /**
   * Calcula os impostos para uma operação com base nos parâmetros fornecidos
   */
  public async calculateTaxes(input: TaxInput): Promise<TaxResult> {
    try {
      // Buscar informações do cliente se fornecido
      let clientInfo = null;
      let simplesRate = 0;
      
      if (input.clientId) {
        [clientInfo] = await db
          .select()
          .from(clients)
          .where(eq(clients.id, input.clientId));
          
        // Buscar configurações de impostos do cliente (em uma implementação real, isso viria de outra tabela)
        // Mas para simplificar, vamos supor que para clientes de contabilidade já temos a alíquota do Simples configurada
        if (clientInfo && input.taxRegime === 'simples_nacional') {
          // Em um cenário real, este valor seria obtido através de uma API ou tabela específica
          simplesRate = 4.5; // Exemplo: alíquota de 4.5% do Simples Nacional
        }
      }
      
      // Buscar os IDs dos produtos para carregar todos de uma vez
      const productIds = input.items.map(item => item.universalProductId);
      
      // Buscar informações dos produtos
      const products = await db
        .select()
        .from(universalProducts)
        .where(inArray(universalProducts.id, productIds));
      
      // Buscar preços personalizados dos produtos para o cliente, se fornecido
      let customPrices: any[] = [];
      if (input.clientId) {
        customPrices = await db
          .select()
          .from(clientProductPrices)
          .where(
            and(
              eq(clientProductPrices.clientId, input.clientId),
              inArray(clientProductPrices.universalProductId, productIds)
            )
          );
      }
      
      // Mapeamento de ID do produto para objeto do produto
      const productsMap = products.reduce((map, product) => {
        map[product.id] = product;
        return map;
      }, {} as Record<number, typeof products[0]>);
      
      // Mapeamento de ID do produto para preço personalizado
      const customPricesMap = customPrices.reduce((map, price) => {
        map[price.universalProductId] = price.customPrice;
        return map;
      }, {} as Record<number, number>);
      
      // Calcular impostos para cada item
      const taxItems: TaxItem[] = [];
      let totalValue = 0;
      let totalTaxes = 0;
      let icmsTotal = 0;
      let icmsStTotal = 0;
      let ipiTotal = 0;
      let pisTotal = 0;
      let cofinsTotal = 0;
      let issTotal = 0;
      
      for (const item of input.items) {
        const product = productsMap[item.universalProductId];
        
        if (!product) {
          throw new Error(`Produto não encontrado: ID ${item.universalProductId}`);
        }
        
        // Determinar o valor unitário
        let unitValue = item.unitValue;
        if (!unitValue) {
          // Usar preço personalizado se disponível, senão usar preço base
          unitValue = customPricesMap[item.universalProductId] || product.basePrice || 0;
        }
        
        // Calcular valor total do item sem impostos
        const totalItemValue = unitValue * item.quantity;
        
        // Aplicar desconto, se houver
        const discountValue = item.discountValue || 0;
        const totalAfterDiscount = totalItemValue - discountValue;
        
        // Definir alíquotas padrão com base no regime tributário e tipo de operação
        let icmsRate = 0;
        let icmsStRate = 0;
        let ipiRate = 0;
        let pisRate = 0;
        let cofinsRate = 0;
        let issRate = 0;
        
        // Definir alíquotas baseadas no regime tributário
        switch (input.taxRegime) {
          case 'simples_nacional':
            // Para Simples Nacional, a maioria dos impostos é unificada
            icmsRate = input.originState === input.destinationState ? 0 : 0; // ICMS pode ser isento em operações internas no Simples
            icmsStRate = 0; // ST é calculado caso a caso
            ipiRate = 0; // Geralmente isento no Simples
            pisRate = 0; // Incluído na alíquota unificada
            cofinsRate = 0; // Incluído na alíquota unificada
            issRate = product.productType === 'service' ? simplesRate : 0; // Para serviços, usa alíquota do Simples
            break;
            
          case 'lucro_presumido':
            icmsRate = this.getICMSRate(input.originState, input.destinationState, product.ncm);
            icmsStRate = this.getICMSSTRate(input.originState, input.destinationState, product.ncm);
            ipiRate = this.getIPIRate(product.ncm);
            pisRate = 0.65; // Alíquota padrão para PIS no Lucro Presumido
            cofinsRate = 3.0; // Alíquota padrão para COFINS no Lucro Presumido
            issRate = product.productType === 'service' ? 5.0 : 0; // ISS padrão para serviços
            break;
            
          case 'lucro_real':
            icmsRate = this.getICMSRate(input.originState, input.destinationState, product.ncm);
            icmsStRate = this.getICMSSTRate(input.originState, input.destinationState, product.ncm);
            ipiRate = this.getIPIRate(product.ncm);
            pisRate = 1.65; // Alíquota padrão para PIS no Lucro Real
            cofinsRate = 7.6; // Alíquota padrão para COFINS no Lucro Real
            issRate = product.productType === 'service' ? 5.0 : 0; // ISS padrão para serviços
            break;
        }
        
        // Calcular valores de impostos
        const icmsValue = (totalAfterDiscount * icmsRate) / 100;
        const icmsStValue = (totalAfterDiscount * icmsStRate) / 100;
        const ipiValue = (totalAfterDiscount * ipiRate) / 100;
        const pisValue = (totalAfterDiscount * pisRate) / 100;
        const cofinsValue = (totalAfterDiscount * cofinsRate) / 100;
        const issValue = (totalAfterDiscount * issRate) / 100;
        
        // Valor total de impostos para este item
        const itemTaxes = icmsValue + icmsStValue + ipiValue + pisValue + cofinsValue + issValue;
        
        // Valor líquido após impostos
        const netValue = totalAfterDiscount + itemTaxes;
        
        // Adicionar à lista de itens
        taxItems.push({
          description: item.description || product.name,
          quantity: item.quantity,
          unitValue,
          totalValue: totalAfterDiscount,
          ncm: item.customNCM || product.ncm,
          cfop: item.customCFOP || product.cfop || this.getDefaultCFOP(input.operationType, input.originState, input.destinationState),
          unitOfMeasure: product.defaultUnit,
          icmsValue,
          icmsRate,
          icmsStValue,
          icmsStRate,
          ipiValue,
          ipiRate,
          pisValue,
          pisRate,
          cofinsValue,
          cofinsRate,
          issValue,
          issRate,
          discountValue,
          netValue,
          profitMargin: netValue > 0 && product.costPrice ? ((netValue - product.costPrice * item.quantity) / netValue) * 100 : undefined,
          costPrice: product.costPrice,
        });
        
        // Acumular totais
        totalValue += totalAfterDiscount;
        totalTaxes += itemTaxes;
        icmsTotal += icmsValue;
        icmsStTotal += icmsStValue;
        ipiTotal += ipiValue;
        pisTotal += pisValue;
        cofinsTotal += cofinsValue;
        issTotal += issValue;
      }
      
      // Adicionar valores extras (frete, seguro, etc.)
      const freightValue = input.freightValue || 0;
      const insuranceValue = input.insuranceValue || 0;
      const otherCosts = input.otherCosts || 0;
      
      totalValue += freightValue + insuranceValue + otherCosts;
      
      return {
        totalValue,
        totalTaxes,
        icmsTotal,
        icmsStTotal,
        ipiTotal,
        pisTotal,
        cofinsTotal,
        issTotal,
        items: taxItems,
      };
    } catch (error) {
      console.error('Erro ao calcular impostos:', error);
      throw error;
    }
  }
  
  /**
   * Salva uma simulação de imposto
   */
  public async saveSimulation(name: string, clientId: number, input: TaxInput, result: TaxResult, userId: string): Promise<number> {
    try {
      // Criar registro da simulação
      const [simulation] = await db.insert(taxSimulations).values({
        name,
        clientId,
        operationType: input.operationType,
        destinationState: input.destinationState,
        originState: input.originState,
        taxRegime: input.taxRegime,
        simplesRate: input.taxRegime === 'simples_nacional' ? 4.5 : null, // Exemplo simplificado
        icmsRate: result.items.length > 0 ? result.items[0].icmsRate : null,
        icmsStRate: result.items.length > 0 ? result.items[0].icmsStRate : null,
        ipiRate: result.items.length > 0 ? result.items[0].ipiRate : null,
        pisRate: result.items.length > 0 ? result.items[0].pisRate : null,
        cofinsRate: result.items.length > 0 ? result.items[0].cofinsRate : null,
        issRate: result.items.length > 0 ? result.items[0].issRate : null,
        freightValue: input.freightValue || 0,
        insuranceValue: input.insuranceValue || 0,
        otherCosts: input.otherCosts || 0,
        totalValue: result.totalValue,
        totalTaxes: result.totalTaxes,
        status: 'completed',
        notes: input.notes,
        createdBy: userId,
      }).returning();
      
      // Salvar itens da simulação
      for (const item of result.items) {
        await db.insert(taxSimulationItems).values({
          simulationId: simulation.id,
          universalProductId: input.items.find(i => i.description === item.description)?.universalProductId || 0,
          description: item.description,
          quantity: item.quantity,
          unitValue: item.unitValue,
          totalValue: item.totalValue,
          ncm: item.ncm,
          cfop: item.cfop,
          unitOfMeasure: item.unitOfMeasure,
          icmsValue: item.icmsValue,
          icmsStValue: item.icmsStValue,
          ipiValue: item.ipiValue,
          pisValue: item.pisValue,
          cofinsValue: item.cofinsValue,
          issValue: item.issValue,
          discountValue: item.discountValue,
          netValue: item.netValue,
          profitMargin: item.profitMargin,
          costPrice: item.costPrice,
        });
      }
      
      return simulation.id;
    } catch (error) {
      console.error('Erro ao salvar simulação:', error);
      throw error;
    }
  }
  
  /**
   * Obtém uma simulação de imposto por ID
   */
  public async getSimulation(id: number): Promise<any> {
    try {
      // Buscar simulação
      const [simulation] = await db
        .select()
        .from(taxSimulations)
        .where(eq(taxSimulations.id, id));
      
      if (!simulation) {
        throw new Error(`Simulação não encontrada: ID ${id}`);
      }
      
      // Buscar itens da simulação
      const items = await db
        .select()
        .from(taxSimulationItems)
        .where(eq(taxSimulationItems.simulationId, id));
      
      return {
        ...simulation,
        items,
      };
    } catch (error) {
      console.error('Erro ao obter simulação:', error);
      throw error;
    }
  }
  
  /**
   * Lista todas as simulações de um cliente
   */
  public async listClientSimulations(clientId: number): Promise<any[]> {
    try {
      return await db
        .select()
        .from(taxSimulations)
        .where(eq(taxSimulations.clientId, clientId))
        .orderBy(taxSimulations.createdAt);
    } catch (error) {
      console.error('Erro ao listar simulações do cliente:', error);
      throw error;
    }
  }
  
  /**
   * Prepara uma NFe a partir de uma simulação
   */
  public async prepareNFeFromSimulation(simulationId: number, clientId: number, userId: string): Promise<any> {
    try {
      // Buscar detalhes da simulação
      const simulation = await this.getSimulation(simulationId);
      
      if (simulation.clientId !== clientId) {
        throw new Error('Esta simulação não pertence ao cliente informado');
      }
      
      // Criar NFe a partir da simulação
      const [nfe] = await db.insert(nfes).values({
        clientId,
        number: '', // Número será gerado após envio
        series: '1', // Série padrão
        issueDate: new Date(),
        operationType: simulation.operationType === 'saida' ? 'saída' : 'entrada',
        nature: simulation.operationType === 'saida' ? 'Venda de mercadoria' : 'Compra de mercadoria',
        totalValue: simulation.totalValue,
        taxValue: simulation.totalTaxes,
        status: 'draft',
        notes: simulation.notes,
        createdBy: userId,
      }).returning();
      
      // Adicionar itens da NFe
      for (const item of simulation.items) {
        await db.insert(nfeItems).values({
          nfeId: nfe.id,
          itemId: item.universalProductId || null,
          description: item.description,
          quantity: item.quantity,
          unitValue: item.unitValue,
          totalValue: item.totalValue,
          ncm: item.ncm,
          cfop: item.cfop,
          unitOfMeasure: item.unitOfMeasure,
          taxGroup: 'Tributado', // Exemplo simplificado
          icmsValue: item.icmsValue,
          icmsRate: item.icmsRate,
          ipiValue: item.ipiValue,
          ipiRate: item.ipiRate,
          pisValue: item.pisValue,
          pisRate: item.pisRate,
          cofinsValue: item.cofinsValue,
          cofinsRate: item.cofinsRate,
        });
      }
      
      return nfe;
    } catch (error) {
      console.error('Erro ao preparar NFe a partir da simulação:', error);
      throw error;
    }
  }
  
  /**
   * Obtém a alíquota de ICMS com base nos estados de origem/destino e NCM
   * Em uma implementação real, isto seria muito mais complexo e utilizaria tabelas específicas
   */
  private getICMSRate(originState: string, destinationState: string, ncm: string): number {
    // Operação interna (mesmo estado)
    if (originState === destinationState) {
      return 18; // Alíquota padrão para operações internas
    }
    
    // Operação interestadual
    // Sul e Sudeste (exceto ES)
    const sulSudeste = ['SP', 'RJ', 'MG', 'RS', 'SC', 'PR'];
    
    if (sulSudeste.includes(originState) && sulSudeste.includes(destinationState)) {
      return 12; // Alíquota para operações entre estados do Sul e Sudeste
    }
    
    // Demais casos
    return 7; // Alíquota para outras operações interestaduais
  }
  
  /**
   * Obtém a alíquota de ICMS-ST (Substituição Tributária)
   * Em uma implementação real, isto seria extremamente complexo
   */
  private getICMSSTRate(originState: string, destinationState: string, ncm: string): number {
    // Simplificação extrema - na prática, isto dependeria de tabelas e regras específicas
    // Para efeitos da simulação, usamos 0 como padrão
    return 0;
  }
  
  /**
   * Obtém a alíquota de IPI com base no NCM
   * Em uma implementação real, isto utilizaria a TIPI (Tabela de Incidência do IPI)
   */
  private getIPIRate(ncm: string): number {
    // Simplificação - na prática, consultaria a TIPI
    // Para efeitos da simulação, usamos 5% como padrão para produtos industrializados
    return 5;
  }
  
  /**
   * Obtém o CFOP padrão com base no tipo de operação e estados envolvidos
   */
  private getDefaultCFOP(operationType: 'entrada' | 'saida', originState: string, destinationState: string): string {
    // Simplificação dos CFOPs mais comuns
    
    if (operationType === 'saida') {
      if (originState === destinationState) {
        return '5102'; // Venda de mercadoria dentro do estado
      } else {
        return '6102'; // Venda de mercadoria para outro estado
      }
    } else { // entrada
      if (originState === destinationState) {
        return '1102'; // Compra de mercadoria dentro do estado
      } else {
        return '2102'; // Compra de mercadoria de outro estado
      }
    }
  }
}

// Exportar uma instância única do serviço
export const taxCalculatorService = new TaxCalculatorService();