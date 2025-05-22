import React, { createContext, useState, useContext, useEffect } from 'react';
import { useEmpresas } from './EmpresasContext';

// Contexto que gerencia produtos universais e específicos
const ProdutosContext = createContext({});

export const ProdutosProvider = ({ children }) => {
  const { empresas, actingAsEmpresa, userType } = useEmpresas();
  
  // Lista de produtos universais (administrados pelo escritório)
  const [produtosUniversais, setProdutosUniversais] = useState([
    {
      id: 1,
      codigo: 'PROD001',
      descricao: 'Notebook Dell Inspiron',
      ncm: '8471.30.19',
      unidade: 'UN',
      valorCusto: 3200.00,
      valorVenda: 4500.00,
      estoque: 10,
      cest: '2106800',
      origem: 0, // 0-Nacional, 1-Estrangeira Importação Direta, etc
      tipoItem: 'Mercadoria para Revenda',
      imagens: [],
      empresasAssociadas: [1, 2, 3], // IDs das empresas que podem usar este produto
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    },
    {
      id: 2,
      codigo: 'PROD002',
      descricao: 'Monitor LG 24"',
      ncm: '8528.52.20',
      unidade: 'UN',
      valorCusto: 800.00,
      valorVenda: 1200.00,
      estoque: 15,
      cest: '2106900',
      origem: 0,
      tipoItem: 'Mercadoria para Revenda',
      imagens: [],
      empresasAssociadas: [1, 2], // IDs das empresas que podem usar este produto
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    },
    {
      id: 3,
      codigo: 'SERV001',
      descricao: 'Consultoria Contábil',
      ncm: '',
      unidade: 'HORA',
      valorCusto: 80.00,
      valorVenda: 180.00,
      estoque: null, // Serviço não tem estoque
      cest: '',
      origem: 0,
      tipoItem: 'Serviço',
      imagens: [],
      empresasAssociadas: [1, 3], // IDs das empresas que podem usar este serviço
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }
  ]);
  
  // Lista de produtos específicos por empresa (customizações ou produtos exclusivos)
  const [produtosEspecificos, setProdutosEspecificos] = useState({
    // ID da empresa como chave, array de produtos como valor
    1: [
      {
        id: 101,
        produtoUniversalId: 1, // Referência ao produto universal, se for customização
        codigo: 'PROD001',
        descricao: 'Notebook Dell Inspiron',
        ncm: '8471.30.19',
        unidade: 'UN',
        valorCusto: 3200.00,
        valorVenda: 4800.00, // Preço customizado pela empresa
        estoque: 7,
        cest: '2106800',
        origem: 0,
        tipoItem: 'Mercadoria para Revenda',
        imagens: [],
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      },
      {
        id: 201,
        produtoUniversalId: null, // Produto exclusivo da empresa
        codigo: 'PROD101',
        descricao: 'Serviço de Instalação',
        ncm: '',
        unidade: 'SERV',
        valorCusto: 50.00,
        valorVenda: 120.00,
        estoque: null,
        cest: '',
        origem: 0,
        tipoItem: 'Serviço',
        imagens: [],
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      }
    ],
    2: [
      {
        id: 102,
        produtoUniversalId: 1,
        codigo: 'PROD001',
        descricao: 'Notebook Dell Inspiron',
        ncm: '8471.30.19',
        unidade: 'UN',
        valorCusto: 3200.00,
        valorVenda: 4750.00, // Preço customizado pela empresa
        estoque: 5,
        cest: '2106800',
        origem: 0,
        tipoItem: 'Mercadoria para Revenda',
        imagens: [],
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      }
    ],
    3: []
  });
  
  // Lista de produtos do tipo "kit" (compostos por outros produtos)
  const [produtosKit, setProdutosKit] = useState([
    {
      id: 4,
      codigo: 'KIT001',
      descricao: 'Kit Informática Básico',
      ncm: '',
      unidade: 'KIT',
      valorCusto: 4100.00, // Soma dos custos dos componentes
      valorVenda: 5800.00, // Preço do kit completo
      estoque: 5,
      cest: '',
      origem: 0,
      tipoItem: 'Kit',
      imagens: [],
      empresasAssociadas: [1, 2], // IDs das empresas que podem usar este kit
      componentes: [
        { produtoId: 1, quantidade: 1 }, // 1 Notebook
        { produtoId: 2, quantidade: 1 }, // 1 Monitor
      ],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }
  ]);
  
  // Obtém a lista combinada de produtos para a empresa atual
  const getProdutosEmpresa = (empresaId) => {
    if (!empresaId) return [];
    
    // Produtos universais disponíveis para esta empresa
    const universaisDaEmpresa = produtosUniversais.filter(
      p => p.empresasAssociadas.includes(Number(empresaId))
    );
    
    // Produtos específicos desta empresa
    const especificosDaEmpresa = produtosEspecificos[empresaId] || [];
    
    // Kits disponíveis para esta empresa
    const kitsDaEmpresa = produtosKit.filter(
      p => p.empresasAssociadas.includes(Number(empresaId))
    );
    
    // Combinar e remover duplicações (produtos específicos sobrescrevem universais)
    const produtosUniversaisSemCustomizacao = universaisDaEmpresa.filter(pu => {
      return !especificosDaEmpresa.some(pe => pe.produtoUniversalId === pu.id);
    });
    
    return [...produtosUniversaisSemCustomizacao, ...especificosDaEmpresa, ...kitsDaEmpresa];
  };
  
  // Obtém os produtos disponíveis para o contexto atual (empresa ou escritório)
  const getProdutosDisponiveis = () => {
    // Se está agindo como uma empresa, retorna produtos daquela empresa
    if (actingAsEmpresa) {
      return getProdutosEmpresa(actingAsEmpresa.id);
    }
    
    // Se é uma empresa usuária, retorna seus produtos
    if (userType === 'EmpresaUsuaria') {
      // Aqui assumimos que temos um ID da empresa atual (que viria da autenticação)
      // Para demonstração, usamos a primeira empresa
      return getProdutosEmpresa(1);
    }
    
    // Se é escritório e não está agindo como empresa, retorna todos produtos universais
    if (userType === 'Escritorio') {
      return produtosUniversais;
    }
    
    // Para usuários da calculadora, retorna um conjunto limitado (demo)
    if (userType === 'UsuarioCalculadora') {
      return produtosUniversais.slice(0, 2);
    }
    
    return [];
  };
  
  // CRUD para produtos universais
  
  // Adiciona produto universal (administrado pelo escritório)
  const adicionarProdutoUniversal = (produto) => {
    // Gera ID automático para demonstração
    const newId = Math.max(0, ...produtosUniversais.map(p => p.id)) + 1;
    const novoProduto = {
      ...produto,
      id: newId,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    
    setProdutosUniversais([...produtosUniversais, novoProduto]);
    return novoProduto;
  };
  
  // Atualiza produto universal
  const atualizarProdutoUniversal = (id, dados) => {
    const produtosAtualizados = produtosUniversais.map(produto => {
      if (produto.id === id) {
        return {
          ...produto,
          ...dados,
          atualizadoEm: new Date().toISOString()
        };
      }
      return produto;
    });
    
    setProdutosUniversais(produtosAtualizados);
    
    // Também atualiza os produtos específicos derivados deste produto universal
    const produtosEspecificosAtualizados = { ...produtosEspecificos };
    
    Object.keys(produtosEspecificosAtualizados).forEach(empresaId => {
      produtosEspecificosAtualizados[empresaId] = produtosEspecificosAtualizados[empresaId].map(produto => {
        if (produto.produtoUniversalId === id) {
          // Mantém os campos personalizados pela empresa, mas atualiza os campos base
          const camposParaAtualizar = {
            codigo: dados.codigo || produto.codigo,
            descricao: dados.descricao || produto.descricao,
            ncm: dados.ncm || produto.ncm,
            unidade: dados.unidade || produto.unidade,
            cest: dados.cest || produto.cest,
            origem: dados.origem !== undefined ? dados.origem : produto.origem,
            tipoItem: dados.tipoItem || produto.tipoItem,
            atualizadoEm: new Date().toISOString()
          };
          
          return {
            ...produto,
            ...camposParaAtualizar
          };
        }
        return produto;
      });
    });
    
    setProdutosEspecificos(produtosEspecificosAtualizados);
  };
  
  // Remove produto universal
  const removerProdutoUniversal = (id) => {
    setProdutosUniversais(produtosUniversais.filter(p => p.id !== id));
    
    // Também remove produtos específicos derivados deste produto universal
    const produtosEspecificosAtualizados = { ...produtosEspecificos };
    
    Object.keys(produtosEspecificosAtualizados).forEach(empresaId => {
      produtosEspecificosAtualizados[empresaId] = produtosEspecificosAtualizados[empresaId].filter(
        p => p.produtoUniversalId !== id
      );
    });
    
    setProdutosEspecificos(produtosEspecificosAtualizados);
    
    // Remove o produto de qualquer kit
    const kitsAtualizados = produtosKit.map(kit => {
      return {
        ...kit,
        componentes: kit.componentes.filter(comp => comp.produtoId !== id)
      };
    });
    
    setProdutosKit(kitsAtualizados);
  };
  
  // CRUD para produtos específicos de uma empresa
  
  // Adiciona/atualiza produto específico para uma empresa
  const atualizarProdutoEspecifico = (empresaId, produto) => {
    const produtosEmpresa = produtosEspecificos[empresaId] || [];
    const indexExistente = produtosEmpresa.findIndex(p => {
      // Se for customização de produto universal
      if (produto.produtoUniversalId) {
        return p.produtoUniversalId === produto.produtoUniversalId;
      }
      // Se for produto exclusivo da empresa, compara pelo ID próprio
      return p.id === produto.id;
    });
    
    let novosProdutos = [...produtosEmpresa];
    
    if (indexExistente >= 0) {
      // Atualiza o produto existente
      novosProdutos[indexExistente] = {
        ...novosProdutos[indexExistente],
        ...produto,
        atualizadoEm: new Date().toISOString()
      };
    } else {
      // Adiciona novo produto específico
      const newId = Math.max(
        0, 
        ...Object.values(produtosEspecificos).flat().map(p => p.id),
        100 // Mínimo 100 para produtos específicos
      ) + 1;
      
      novosProdutos.push({
        ...produto,
        id: produto.id || newId,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      });
    }
    
    setProdutosEspecificos({
      ...produtosEspecificos,
      [empresaId]: novosProdutos
    });
  };
  
  // Remove produto específico
  const removerProdutoEspecifico = (empresaId, produtoId) => {
    if (!produtosEspecificos[empresaId]) return;
    
    setProdutosEspecificos({
      ...produtosEspecificos,
      [empresaId]: produtosEspecificos[empresaId].filter(p => p.id !== produtoId)
    });
  };
  
  // Funções para Kits
  
  // Adicionar kit
  const adicionarKit = (kit) => {
    const newId = Math.max(0, ...produtosKit.map(p => p.id)) + 1;
    const novoKit = {
      ...kit,
      id: newId,
      tipoItem: 'Kit',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    
    setProdutosKit([...produtosKit, novoKit]);
    return novoKit;
  };
  
  // Atualizar kit
  const atualizarKit = (id, dados) => {
    const kitsAtualizados = produtosKit.map(kit => {
      if (kit.id === id) {
        return {
          ...kit,
          ...dados,
          atualizadoEm: new Date().toISOString()
        };
      }
      return kit;
    });
    
    setProdutosKit(kitsAtualizados);
  };
  
  // Remover kit
  const removerKit = (id) => {
    setProdutosKit(produtosKit.filter(k => k.id !== id));
  };
  
  // Função para importar produtos do formato SEBRAE ou outro
  const importarProdutos = async (arquivo, formato = 'SEBRAE', empresaId = null) => {
    // No ambiente real, enviaria o arquivo para o servidor processar
    
    // Simula a importação de dados (apenas demonstração)
    console.log(`Importando produtos no formato ${formato} ${empresaId ? 'para empresa ID ' + empresaId : 'universal'}`);
    
    // Retorna detalhes do processo de importação
    return {
      sucesso: true,
      produtosImportados: 5,
      produtosAtualizados: 2,
      produtosComErro: 0
    };
  };
  
  // Define o contexto dos produtos
  const contextValue = {
    produtosUniversais,
    produtosEspecificos,
    produtosKit,
    getProdutosEmpresa,
    getProdutosDisponiveis,
    adicionarProdutoUniversal,
    atualizarProdutoUniversal,
    removerProdutoUniversal,
    atualizarProdutoEspecifico,
    removerProdutoEspecifico,
    adicionarKit,
    atualizarKit,
    removerKit,
    importarProdutos
  };
  
  return (
    <ProdutosContext.Provider value={contextValue}>
      {children}
    </ProdutosContext.Provider>
  );
};

export function useProdutos() {
  return useContext(ProdutosContext);
};

export default ProdutosContext;