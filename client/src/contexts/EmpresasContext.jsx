import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexto que gerencia a seleção de empresas para o escritório poder atuar como se fosse uma empresa usuária
const EmpresasContext = createContext({});

export const EmpresasProvider = ({ children }) => {
  // Lista de empresas cadastradas (em produção viria da API)
  const [empresas, setEmpresas] = useState([
    {
      id: 1,
      nome: 'Tech Solutions Ltda',
      documento: '12.345.678/0001-90',
      regime_tributario: 'Simples Nacional',
      config_fiscal_padrao: {
        icms: 18,
        pis: 1.65,
        cofins: 7.6,
        ipi: 5,
        iss: 5,
        simplesNacionalAliquota: 6
      }
    },
    {
      id: 2,
      nome: 'Comércio ABC Eireli',
      documento: '98.765.432/0001-10',
      regime_tributario: 'Lucro Presumido',
      config_fiscal_padrao: {
        icms: 18,
        pis: 1.65,
        cofins: 7.6,
        ipi: 10,
        iss: 5,
        simplesNacionalAliquota: 0
      }
    },
    {
      id: 3,
      nome: 'Consultoria Silva ME',
      documento: '11.222.333/0001-44',
      regime_tributario: 'Simples Nacional',
      config_fiscal_padrao: {
        icms: 18,
        pis: 1.65,
        cofins: 7.6,
        ipi: 0,
        iss: 5,
        simplesNacionalAliquota: 4.5
      }
    }
  ]);

  // Empresa selecionada no momento pelo usuário do escritório
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  
  // Indica se o usuário do escritório está atuando como uma empresa
  const [actingAsEmpresa, setActingAsEmpresa] = useState(null);
  
  // Perfil do usuário atual (em produção viria do serviço de autenticação)
  const [userType, setUserType] = useState('Escritorio'); // Pode ser 'Escritorio', 'EmpresaUsuaria', 'UsuarioCalculadora'
  
  useEffect(() => {
    // Verificar permissões e configurações salvas ao iniciar
    const savedEmpresaId = localStorage.getItem('selectedEmpresaId');
    if (savedEmpresaId && empresas.length > 0) {
      const empresa = empresas.find(e => e.id === parseInt(savedEmpresaId));
      if (empresa) {
        setSelectedEmpresa(empresa);
      }
    }
    
    const actingAsId = localStorage.getItem('actingAsEmpresaId');
    if (actingAsId && empresas.length > 0) {
      const empresa = empresas.find(e => e.id === parseInt(actingAsId));
      if (empresa) {
        setActingAsEmpresa(empresa);
      }
    }
    
    // Simular perfil de usuário obtido da autenticação
    // Em produção isso viria do sistema de autenticação
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [empresas]);
  
  // Alterna para agir como uma empresa específica
  const actAsEmpresa = (empresa) => {
    setActingAsEmpresa(empresa);
    if (empresa) {
      localStorage.setItem('actingAsEmpresaId', empresa.id);
    } else {
      localStorage.removeItem('actingAsEmpresaId');
    }
  };
  
  // Seleciona uma empresa no contexto
  const selectEmpresa = (empresa) => {
    setSelectedEmpresa(empresa);
    if (empresa) {
      localStorage.setItem('selectedEmpresaId', empresa.id);
    } else {
      localStorage.removeItem('selectedEmpresaId');
    }
  };
  
  // Simula alteração no tipo de usuário (apenas para demonstração)
  const changeUserType = (type) => {
    if (['Escritorio', 'EmpresaUsuaria', 'UsuarioCalculadora'].includes(type)) {
      setUserType(type);
      localStorage.setItem('userType', type);
      
      // Limpar acting as ao mudar tipo
      if (type !== 'Escritorio') {
        setActingAsEmpresa(null);
        localStorage.removeItem('actingAsEmpresaId');
      }
    }
  };
  
  // Adiciona uma nova empresa (em produção enviaria para API)
  const addEmpresa = (novaEmpresa) => {
    // Gera ID automático para demonstração
    const newId = Math.max(0, ...empresas.map(e => e.id)) + 1;
    const empresaCompleta = {
      ...novaEmpresa,
      id: newId,
      config_fiscal_padrao: novaEmpresa.config_fiscal_padrao || {
        icms: 18,
        pis: 1.65,
        cofins: 7.6,
        ipi: 5,
        iss: 5,
        simplesNacionalAliquota: novaEmpresa.regime_tributario === 'Simples Nacional' ? 6 : 0
      }
    };
    
    setEmpresas([...empresas, empresaCompleta]);
    return empresaCompleta;
  };
  
  // Atualiza dados de uma empresa existente
  const updateEmpresa = (id, dadosAtualizados) => {
    const updatedEmpresas = empresas.map(empresa => 
      empresa.id === id ? { ...empresa, ...dadosAtualizados } : empresa
    );
    
    setEmpresas(updatedEmpresas);
    
    // Atualizar também a empresa selecionada/agindo como, se for a mesma
    if (selectedEmpresa && selectedEmpresa.id === id) {
      const empresaAtualizada = updatedEmpresas.find(e => e.id === id);
      setSelectedEmpresa(empresaAtualizada);
    }
    
    if (actingAsEmpresa && actingAsEmpresa.id === id) {
      const empresaAtualizada = updatedEmpresas.find(e => e.id === id);
      setActingAsEmpresa(empresaAtualizada);
    }
  };
  
  // Remove uma empresa
  const removeEmpresa = (id) => {
    setEmpresas(empresas.filter(empresa => empresa.id !== id));
    
    // Limpar seleções se necessário
    if (selectedEmpresa && selectedEmpresa.id === id) {
      setSelectedEmpresa(null);
      localStorage.removeItem('selectedEmpresaId');
    }
    
    if (actingAsEmpresa && actingAsEmpresa.id === id) {
      setActingAsEmpresa(null);
      localStorage.removeItem('actingAsEmpresaId');
    }
  };
  
  return (
    <EmpresasContext.Provider
      value={{
        empresas,
        selectedEmpresa,
        selectEmpresa,
        actingAsEmpresa,
        actAsEmpresa,
        userType,
        changeUserType,
        addEmpresa,
        updateEmpresa,
        removeEmpresa
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};

export const useEmpresas = () => useContext(EmpresasContext);

export default EmpresasContext;