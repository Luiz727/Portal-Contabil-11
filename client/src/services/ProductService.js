/**
 * Serviço para gerenciar produtos e suas configurações fiscais
 */
class ProductService {
  /**
   * Busca produtos do banco de dados ou mockados para desenvolvimento
   */
  async getUniversalProducts() {
    // Em produção, isso seria uma chamada de API
    return [
      {
        id: 1,
        nome: 'Notebook Dell Inspiron',
        referencia: 'DELL-INS15',
        preco_custo: 2800.00,
        unidade: 'UN',
        ncm: '8471.30.19',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0.05,
          iss: 0
        }
      },
      {
        id: 2,
        nome: 'Monitor LG 24 polegadas',
        referencia: 'LG-MON24',
        preco_custo: 950.00,
        unidade: 'UN',
        ncm: '8528.52.20',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0.1,
          iss: 0
        }
      },
      {
        id: 3,
        nome: 'Teclado Mecânico Redragon',
        referencia: 'RED-KB55',
        preco_custo: 230.00,
        unidade: 'UN',
        ncm: '8471.60.52',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0.05,
          iss: 0
        }
      },
      {
        id: 4,
        nome: 'Mouse Logitech G Pro',
        referencia: 'LOG-GPRO',
        preco_custo: 350.00,
        unidade: 'UN',
        ncm: '8471.60.53',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0.05,
          iss: 0
        }
      },
      {
        id: 5,
        nome: 'Smartphone Samsung Galaxy S22',
        referencia: 'SAM-GS22',
        preco_custo: 3800.00,
        unidade: 'UN',
        ncm: '8517.12.31',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0.15,
          iss: 0
        }
      },
      {
        id: 6,
        nome: 'Consultoria em TI (Hora)',
        referencia: 'SERV-TI01',
        preco_custo: 120.00,
        unidade: 'HR',
        ncm: '',
        config_fiscal: {
          icms: 0,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0,
          iss: 0.05
        }
      },
      {
        id: 7,
        nome: 'Kit de Manutenção Informática',
        referencia: 'KIT-MANUT01',
        preco_custo: 450.00,
        unidade: 'UN',
        ncm: '8473.30.99',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0.05,
          iss: 0
        }
      },
      {
        id: 8,
        nome: 'Licença Software Office 365',
        referencia: 'LIC-OFF365',
        preco_custo: 899.00,
        unidade: 'UN',
        ncm: '8523.49.90',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0,
          iss: 0
        }
      },
      {
        id: 9,
        nome: 'Serviço de Instalação',
        referencia: 'SERV-INST',
        preco_custo: 180.00,
        unidade: 'HR',
        ncm: '',
        config_fiscal: {
          icms: 0,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0,
          iss: 0.05
        }
      },
      {
        id: 10,
        nome: 'Cadeira de Escritório Ergonômica',
        referencia: 'CAD-ERG01',
        preco_custo: 750.00,
        unidade: 'UN',
        ncm: '9401.30.90',
        config_fiscal: {
          icms: 0.18,
          pis: 0.0165,
          cofins: 0.076,
          ipi: 0.05,
          iss: 0
        }
      }
    ];
  }

  /**
   * Busca produtos de uma empresa específica
   */
  async getProductsByCompany(companyId) {
    const universalProducts = await this.getUniversalProducts();
    // Em produção, isso seria uma chamada de API
    return universalProducts.slice(0, 5); // Simulação
  }

  /**
   * Busca configurações fiscais padrão
   */
  async getDefaultTaxConfig() {
    return {
      icms: 0.18,
      pis: 0.0165,
      cofins: 0.076,
      ipi: 0.05,
      iss: 0.05,
      simplesNacionalAliquota: 0.06
    };
  }

  /**
   * Salva configurações fiscais do usuário
   */
  saveUserTaxConfig(userId, config) {
    localStorage.setItem(`nixconTaxConfig_${userId}`, JSON.stringify(config));
    return true;
  }
}

export default new ProductService();