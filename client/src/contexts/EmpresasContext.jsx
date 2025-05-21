import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Criar o contexto
const EmpresasContext = createContext();

// Dados iniciais de empresas para fins de demonstração
const empresasIniciais = [
  { 
    id: 'emp1', 
    nome: 'Comércio ABC', 
    cnpj: '12.345.678/0001-90',
    responsavel: 'Carlos Silva',
    telefone: '(11) 98765-4321',
    email: 'comercio.abc@email.com',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    regime: 'Simples Nacional',
    perfilVisualizacao: 'empresa_completo'
  },
  { 
    id: 'emp2', 
    nome: 'Grupo Aurora', 
    cnpj: '09.876.543/0001-21',
    responsavel: 'Maria Oliveira',
    telefone: '(11) 91234-5678',
    email: 'contato@aurora.com.br',
    endereco: 'Rua Augusta, 500',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01305-000',
    regime: 'Lucro Presumido',
    perfilVisualizacao: 'empresa_basico'
  },
  { 
    id: 'emp3', 
    nome: 'Holding XYZ', 
    cnpj: '65.432.109/0001-87',
    responsavel: 'Roberto Pereira',
    telefone: '(11) 97890-1234',
    email: 'diretoria@holdingxyz.com',
    endereco: 'Av. Faria Lima, 2000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '05426-100',
    regime: 'Lucro Real',
    perfilVisualizacao: 'empresa_completo'
  }
];

export const EmpresasProvider = ({ children }) => {
  // Estados do contexto
  const [empresas, setEmpresas] = useState(empresasIniciais);
  const [empresaAtual, setEmpresaAtual] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Carregar dados iniciais e verificar localStorage
  useEffect(() => {
    const empresaSalva = localStorage.getItem('nixcon_empresa_atual');
    
    if (empresaSalva) {
      try {
        const empresa = JSON.parse(empresaSalva);
        setEmpresaAtual(empresa);
      } catch (error) {
        console.error('Erro ao carregar empresa salva:', error);
        localStorage.removeItem('nixcon_empresa_atual');
      }
    }
    
    // Carregar empresas da API (quando estiver disponível)
    const carregarEmpresas = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        // Comentado até a API estar pronta
        /*
        const resposta = await axios.get('/api/clients');
        if (resposta.data) {
          setEmpresas(resposta.data);
        }
        */
        
        // Por enquanto, usamos dados iniciais
        setEmpresas(empresasIniciais);
        
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        setErro('Não foi possível carregar a lista de empresas.');
      } finally {
        setCarregando(false);
      }
    };
    
    carregarEmpresas();
  }, []);
  
  // Mudar a empresa atual
  const changeEmpresa = (id) => {
    const empresa = empresas.find(e => e.id === id);
    if (empresa) {
      setEmpresaAtual(empresa);
      localStorage.setItem('nixcon_empresa_atual', JSON.stringify(empresa));
      return empresa;
    }
    return null;
  };
  
  // Adicionar uma nova empresa
  const adicionarEmpresa = async (novaEmpresa) => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Comentado até a API estar pronta
      /*
      const resposta = await axios.post('/api/clients', novaEmpresa);
      const empresaAdicionada = resposta.data;
      
      setEmpresas(prev => [...prev, empresaAdicionada]);
      return empresaAdicionada;
      */
      
      // Simulação local
      const empresaAdicionada = {
        ...novaEmpresa,
        id: `emp${empresas.length + 1}`
      };
      
      setEmpresas(prev => [...prev, empresaAdicionada]);
      return empresaAdicionada;
    } catch (error) {
      console.error('Erro ao adicionar empresa:', error);
      setErro('Não foi possível adicionar a empresa.');
      return null;
    } finally {
      setCarregando(false);
    }
  };
  
  // Atualizar uma empresa existente
  const atualizarEmpresa = async (id, dadosAtualizados) => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Comentado até a API estar pronta
      /*
      const resposta = await axios.put(`/api/clients/${id}`, dadosAtualizados);
      const empresaAtualizada = resposta.data;
      
      setEmpresas(prev => prev.map(emp => 
        emp.id === id ? empresaAtualizada : emp
      ));
      
      // Se for a empresa atual, atualizar também
      if (empresaAtual && empresaAtual.id === id) {
        setEmpresaAtual(empresaAtualizada);
        localStorage.setItem('nixcon_empresa_atual', JSON.stringify(empresaAtualizada));
      }
      
      return empresaAtualizada;
      */
      
      // Simulação local
      const empresaAtualizada = {
        ...empresas.find(emp => emp.id === id),
        ...dadosAtualizados
      };
      
      setEmpresas(prev => prev.map(emp => 
        emp.id === id ? empresaAtualizada : emp
      ));
      
      // Se for a empresa atual, atualizar também
      if (empresaAtual && empresaAtual.id === id) {
        setEmpresaAtual(empresaAtualizada);
        localStorage.setItem('nixcon_empresa_atual', JSON.stringify(empresaAtualizada));
      }
      
      return empresaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      setErro('Não foi possível atualizar a empresa.');
      return null;
    } finally {
      setCarregando(false);
    }
  };
  
  // Remover uma empresa
  const removerEmpresa = async (id) => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Comentado até a API estar pronta
      /*
      await axios.delete(`/api/clients/${id}`);
      */
      
      // Remover do estado
      setEmpresas(prev => prev.filter(emp => emp.id !== id));
      
      // Se for a empresa atual, remover também
      if (empresaAtual && empresaAtual.id === id) {
        setEmpresaAtual(null);
        localStorage.removeItem('nixcon_empresa_atual');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao remover empresa:', error);
      setErro('Não foi possível remover a empresa.');
      return false;
    } finally {
      setCarregando(false);
    }
  };
  
  // Definir o valor do contexto que será disponibilizado
  const value = {
    empresas,
    empresaAtual,
    carregando,
    erro,
    changeEmpresa,
    adicionarEmpresa,
    atualizarEmpresa,
    removerEmpresa
  };
  
  return (
    <EmpresasContext.Provider value={value}>
      {children}
    </EmpresasContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useEmpresas = () => {
  const context = useContext(EmpresasContext);
  if (!context) {
    throw new Error('useEmpresas deve ser usado dentro de um EmpresasProvider');
  }
  return context;
};

export default EmpresasProvider;