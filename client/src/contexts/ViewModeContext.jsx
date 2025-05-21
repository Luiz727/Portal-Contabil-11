import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos de visualização simplificados
export const VIEW_MODES = {
  ESCRITORIO: 'escritorio',  // Escritório contábil
  EMPRESA: 'empresa',       // Empresa cliente
  CONTADOR: 'contador',     // Contador externo
  EXTERNO: 'externo'        // Usuário externo de módulos específicos
};

// Nomes amigáveis para exibição
export const VIEW_MODE_NAMES = {
  [VIEW_MODES.ESCRITORIO]: 'Visão do Escritório',
  [VIEW_MODES.EMPRESA]: 'Visão da Empresa',
  [VIEW_MODES.CONTADOR]: 'Visão de Contador',
  [VIEW_MODES.EXTERNO]: 'Visão Externa'
};

// Permissões padrão para cada tipo de visualização
export const DEFAULT_PERMISSIONS = {
  [VIEW_MODES.ESCRITORIO]: {
    descricao: 'Acesso completo às funcionalidades do escritório contábil',
    permissoes: {
      'fiscal': [
        { id: 'fiscal_nfe', label: 'Notas Fiscais Eletrônicas', permissao: true },
        { id: 'fiscal_nfse', label: 'Notas Fiscais de Serviço', permissao: true },
        { id: 'fiscal_ged', label: 'GED Fiscal', permissao: true },
        { id: 'fiscal_impostos', label: 'Cálculo de Impostos', permissao: true },
        { id: 'fiscal_sped', label: 'SPED Fiscal', permissao: true },
        { id: 'fiscal_impostos_retidos', label: 'Impostos Retidos', permissao: true }
      ],
      'financeiro': [
        { id: 'financeiro_honorarios', label: 'Honorários', permissao: true },
        { id: 'financeiro_conciliacoes', label: 'Conciliações Bancárias', permissao: true },
        { id: 'financeiro_pagamentos', label: 'Pagamentos', permissao: true },
        { id: 'financeiro_recebimentos', label: 'Recebimentos', permissao: true },
        { id: 'financeiro_relatorios', label: 'Relatórios Financeiros', permissao: true }
      ],
      'gerencial': [
        { id: 'gerencial_clientes', label: 'Gestão de Clientes', permissao: true },
        { id: 'gerencial_usuarios', label: 'Gestão de Usuários', permissao: true },
        { id: 'gerencial_empresas', label: 'Gestão de Empresas', permissao: true },
        { id: 'gerencial_produtos', label: 'Cadastro Universal de Produtos', permissao: true },
        { id: 'gerencial_planos', label: 'Planos e Assinaturas', permissao: true }
      ],
      'admin': [
        { id: 'admin_configuracoes', label: 'Configurações do Sistema', permissao: true },
        { id: 'admin_perfis', label: 'Perfis de Visualização', permissao: true },
        { id: 'admin_integracao', label: 'Integrações', permissao: true },
        { id: 'admin_logs', label: 'Logs do Sistema', permissao: true }
      ]
    }
  },
  [VIEW_MODES.EMPRESA]: {
    descricao: 'Visualização da empresa cliente com acesso às suas informações e operações',
    permissoes: {
      'fiscal': [
        { id: 'fiscal_nfe', label: 'Notas Fiscais Eletrônicas', permissao: true },
        { id: 'fiscal_nfse', label: 'Notas Fiscais de Serviço', permissao: true },
        { id: 'fiscal_impostos', label: 'Cálculo de Impostos', permissao: true },
        { id: 'fiscal_sped', label: 'SPED Fiscal', permissao: false },
        { id: 'fiscal_impostos_retidos', label: 'Impostos Retidos', permissao: true }
      ],
      'financeiro': [
        { id: 'financeiro_honorarios', label: 'Honorários', permissao: false },
        { id: 'financeiro_conciliacoes', label: 'Conciliações Bancárias', permissao: true },
        { id: 'financeiro_pagamentos', label: 'Pagamentos', permissao: true },
        { id: 'financeiro_recebimentos', label: 'Recebimentos', permissao: true },
        { id: 'financeiro_relatorios', label: 'Relatórios Financeiros', permissao: false }
      ],
      'estoque': [
        { id: 'estoque_produtos', label: 'Produtos', permissao: true },
        { id: 'estoque_movimentacoes', label: 'Movimentações', permissao: true },
        { id: 'estoque_kits', label: 'Kits de Produtos', permissao: true },
        { id: 'estoque_relatorios', label: 'Relatórios de Estoque', permissao: true }
      ],
      'documentos': [
        { id: 'documentos_upload', label: 'Upload de Documentos', permissao: true },
        { id: 'documentos_ged', label: 'GED Documentos', permissao: true },
        { id: 'documentos_assinatura', label: 'Assinatura Eletrônica', permissao: false }
      ]
    }
  },
  [VIEW_MODES.CONTADOR]: {
    descricao: 'Visualização para contadores externos com acesso limitado às funções contábeis',
    permissoes: {
      'fiscal': [
        { id: 'fiscal_nfe', label: 'Notas Fiscais Eletrônicas', permissao: true },
        { id: 'fiscal_nfse', label: 'Notas Fiscais de Serviço', permissao: true },
        { id: 'fiscal_impostos', label: 'Cálculo de Impostos', permissao: true },
        { id: 'fiscal_sped', label: 'SPED Fiscal', permissao: true },
        { id: 'fiscal_impostos_retidos', label: 'Impostos Retidos', permissao: true }
      ],
      'financeiro': [
        { id: 'financeiro_honorarios', label: 'Honorários', permissao: false },
        { id: 'financeiro_conciliacoes', label: 'Conciliações Bancárias', permissao: false },
        { id: 'financeiro_relatorios', label: 'Relatórios Financeiros', permissao: true }
      ],
      'documentos': [
        { id: 'documentos_upload', label: 'Upload de Documentos', permissao: true },
        { id: 'documentos_ged', label: 'GED Documentos', permissao: true },
        { id: 'documentos_assinatura', label: 'Assinatura Eletrônica', permissao: false }
      ]
    }
  },
  [VIEW_MODES.EXTERNO]: {
    descricao: 'Visualização para usuários externos com acesso limitado a módulos específicos',
    permissoes: {
      'fiscal': [
        { id: 'fiscal_nfe', label: 'Notas Fiscais Eletrônicas', permissao: false },
        { id: 'fiscal_nfse', label: 'Notas Fiscais de Serviço', permissao: false },
        { id: 'fiscal_impostos', label: 'Cálculo de Impostos', permissao: true },
        { id: 'fiscal_sped', label: 'SPED Fiscal', permissao: false },
        { id: 'fiscal_impostos_retidos', label: 'Impostos Retidos', permissao: false }
      ],
      'documentos': [
        { id: 'documentos_upload', label: 'Upload de Documentos', permissao: true },
        { id: 'documentos_ged', label: 'GED Documentos', permissao: true },
        { id: 'documentos_assinatura', label: 'Assinatura Eletrônica', permissao: false }
      ]
    }
  }
};

// Perfis de visualização disponíveis
const PERFIS_VISUALIZACAO = {
  // Perfis de Administrador
  administrador: {
    id: 'administrador',
    nome: 'Administrador',
    descricao: 'Acesso completo ao sistema',
    permissoes: ['*'] // Todas as permissões
  },
  
  // Perfis de Contador
  contador_padrao: {
    id: 'contador_padrao',
    nome: 'Contador Padrão',
    descricao: 'Acesso a funções contábeis e fiscais',
    permissoes: ['fiscal', 'financeiro', 'documentos', 'relatorios']
  },
  contador_fiscal: {
    id: 'contador_fiscal',
    nome: 'Contador Fiscal',
    descricao: 'Especialista em operações fiscais',
    permissoes: ['fiscal', 'documentos', 'relatorios_fiscal']
  },
  
  // Perfis de Empresa
  empresa_basico: {
    id: 'empresa_basico',
    nome: 'Empresa - Básico',
    descricao: 'Permissões para o plano básico de empresas usuárias',
    permissoes: ['documentos', 'fiscal_basico', 'relatorios_basico']
  },
  empresa_completo: {
    id: 'empresa_completo',
    nome: 'Empresa - Completo',
    descricao: 'Permissões para o plano completo de empresas usuárias',
    permissoes: ['documentos', 'fiscal', 'financeiro', 'estoque', 'relatorios']
  },
  
  // Perfis de Usuário Externo
  externo_fiscal: {
    id: 'externo_fiscal',
    nome: 'Usuário Fiscal',
    descricao: 'Acesso apenas ao módulo fiscal',
    permissoes: ['fiscal_basico']
  },
  externo_contador: {
    id: 'externo_contador',
    nome: 'Contador Terceirizado',
    descricao: 'Acesso a módulos contábeis específicos',
    permissoes: ['fiscal', 'relatorios']
  }
};

// Contexto para o modo de visualização
const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  // Estado para armazenar o modo de visualização atual
  const [viewMode, setViewMode] = useState(VIEW_MODES.ESCRITORIO);
  // Estado para armazenar a empresa atual (quando estiver visualizando como empresa)
  const [currentCompany, setCurrentCompany] = useState(null);
  // Estado para armazenar o perfil de visualização ativo
  const [activeProfile, setActiveProfile] = useState(PERFIS_VISUALIZACAO.ADMINISTRADOR);
  // Estado para armazenar todos os perfis disponíveis
  const [profiles, setProfiles] = useState(PERFIS_VISUALIZACAO);
  
  // Carrega as preferências salvas ao inicializar
  useEffect(() => {
    const savedViewMode = localStorage.getItem('nixcon_view_mode');
    const savedCompany = localStorage.getItem('nixcon_current_company');
    const savedProfile = localStorage.getItem('nixcon_active_profile');
    const savedProfiles = localStorage.getItem('nixcon_profiles');
    
    if (savedViewMode && Object.values(VIEW_MODES).includes(savedViewMode)) {
      setViewMode(savedViewMode);
    }
    
    if (savedCompany) {
      try {
        setCurrentCompany(JSON.parse(savedCompany));
      } catch (error) {
        console.error('Erro ao carregar a empresa salva:', error);
        localStorage.removeItem('nixcon_current_company');
      }
    }
    
    if (savedProfile) {
      try {
        setActiveProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Erro ao carregar o perfil salvo:', error);
        localStorage.removeItem('nixcon_active_profile');
      }
    }
    
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        console.error('Erro ao carregar os perfis salvos:', error);
        localStorage.removeItem('nixcon_profiles');
      }
    }
  }, []);
  
  // Função para alterar o modo de visualização
  const changeViewMode = (newMode, company = null, profile = null) => {
    if (Object.values(VIEW_MODES).includes(newMode)) {
      setViewMode(newMode);
      localStorage.setItem('nixcon_view_mode', newMode);
      
      // Se estiver mudando para visão de empresa e tiver uma empresa específica
      if (newMode === VIEW_MODES.EMPRESA && company) {
        setCurrentCompany(company);
        localStorage.setItem('nixcon_current_company', JSON.stringify(company));
        
        // Se a empresa tem um perfil específico definido, usá-lo
        if (company.perfilVisualizacao) {
          const perfilEmpresa = profiles[company.perfilVisualizacao] || 
                               PERFIS_VISUALIZACAO.EMPRESA_BASICO;
          setActiveProfile(perfilEmpresa);
          localStorage.setItem('nixcon_active_profile', JSON.stringify(perfilEmpresa));
        } else if (profile) {
          // Se um perfil específico foi passado como parâmetro
          setActiveProfile(profile);
          localStorage.setItem('nixcon_active_profile', JSON.stringify(profile));
        } else {
          // Padrão para empresas
          setActiveProfile(PERFIS_VISUALIZACAO.EMPRESA_BASICO);
          localStorage.setItem('nixcon_active_profile', JSON.stringify(PERFIS_VISUALIZACAO.EMPRESA_BASICO));
        }
      } else if (newMode === VIEW_MODES.ESCRITORIO) {
        // Se estiver mudando para visão de escritório, usar perfil de administrador
        setActiveProfile(PERFIS_VISUALIZACAO.ADMINISTRADOR);
        localStorage.setItem('nixcon_active_profile', JSON.stringify(PERFIS_VISUALIZACAO.ADMINISTRADOR));
      } else if (newMode === VIEW_MODES.CONTADOR) {
        // Se estiver mudando para visão de contador, usar perfil de contador
        setActiveProfile(PERFIS_VISUALIZACAO.CONTADOR);
        localStorage.setItem('nixcon_active_profile', JSON.stringify(PERFIS_VISUALIZACAO.CONTADOR));
      }
    }
  };
  
  // Função para adicionar um novo perfil
  const addProfile = (profile) => {
    // Validar perfil
    if (!profile || !profile.id || !profile.nome || !profile.permissoes) {
      throw new Error('Perfil inválido');
    }
    
    // Atualizar perfis
    const updatedProfiles = {
      ...profiles,
      [profile.id]: profile
    };
    
    setProfiles(updatedProfiles);
    localStorage.setItem('nixcon_profiles', JSON.stringify(updatedProfiles));
  };
  
  // Função para atualizar um perfil existente
  const updateProfile = (profileId, updatedProfile) => {
    if (!profiles[profileId]) {
      throw new Error(`Perfil com ID ${profileId} não encontrado`);
    }
    
    const newProfiles = {
      ...profiles,
      [profileId]: {
        ...profiles[profileId],
        ...updatedProfile
      }
    };
    
    setProfiles(newProfiles);
    localStorage.setItem('nixcon_profiles', JSON.stringify(newProfiles));
    
    // Se o perfil ativo for o que está sendo atualizado, atualizar também
    if (activeProfile.id === profileId) {
      const updatedActiveProfile = {
        ...activeProfile,
        ...updatedProfile
      };
      setActiveProfile(updatedActiveProfile);
      localStorage.setItem('nixcon_active_profile', JSON.stringify(updatedActiveProfile));
    }
  };
  
  // Função para remover um perfil
  const removeProfile = (profileId) => {
    // Não permitir remover perfis padrão
    if (
      profileId === PERFIS_VISUALIZACAO.ADMINISTRADOR.id || 
      profileId === PERFIS_VISUALIZACAO.CONTADOR.id ||
      profileId === PERFIS_VISUALIZACAO.EMPRESA_BASICO.id ||
      profileId === PERFIS_VISUALIZACAO.EMPRESA_COMPLETO.id
    ) {
      throw new Error('Não é possível remover perfis padrão do sistema');
    }
    
    const { [profileId]: removedProfile, ...remainingProfiles } = profiles;
    
    if (!removedProfile) {
      throw new Error(`Perfil com ID ${profileId} não encontrado`);
    }
    
    setProfiles(remainingProfiles);
    localStorage.setItem('nixcon_profiles', JSON.stringify(remainingProfiles));
    
    // Se o perfil ativo for o que está sendo removido, voltar para o perfil padrão
    if (activeProfile.id === profileId) {
      setActiveProfile(PERFIS_VISUALIZACAO.ADMINISTRADOR);
      localStorage.setItem('nixcon_active_profile', JSON.stringify(PERFIS_VISUALIZACAO.ADMINISTRADOR));
    }
  };
  
  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission) => {
    if (!activeProfile || !activeProfile.permissoes) {
      return false;
    }
    
    // Se tiver permissão '*', tem acesso a tudo
    if (activeProfile.permissoes.includes('*')) {
      return true;
    }
    
    return activeProfile.permissoes.includes(permission);
  };
  
  // Valor do contexto que será disponibilizado
  const contextValue = {
    viewMode,
    currentCompany,
    changeViewMode,
    setCurrentCompany,
    viewModeName: VIEW_MODE_NAMES[viewMode],
    activeProfile,
    setActiveProfile,
    profiles,
    addProfile,
    updateProfile,
    removeProfile,
    hasPermission,
    PERFIS_PADRAO: PERFIS_VISUALIZACAO
  };
  
  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode deve ser usado dentro de um ViewModeProvider');
  }
  return context;
};

export { ViewModeContext };