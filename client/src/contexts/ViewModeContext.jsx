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

// Perfis de visualização disponíveis
const PERFIS_VISUALIZACAO = {
  ADMINISTRADOR: {
    id: 'administrador',
    nome: 'Administrador',
    descricao: 'Acesso completo ao sistema',
    permissoes: ['*'] // Todas as permissões
  },
  CONTADOR: {
    id: 'contador',
    nome: 'Contador',
    descricao: 'Acesso a funções contábeis e fiscais',
    permissoes: ['fiscal', 'financeiro', 'documentos', 'relatorios']
  },
  EMPRESA_BASICO: {
    id: 'empresa_basico',
    nome: 'Empresa - Básico',
    descricao: 'Permissões para o plano básico de empresas usuárias',
    permissoes: ['documentos', 'fiscal_basico', 'relatorios_basico']
  },
  EMPRESA_COMPLETO: {
    id: 'empresa_completo',
    nome: 'Empresa - Completo',
    descricao: 'Permissões para o plano completo de empresas usuárias',
    permissoes: ['documentos', 'fiscal', 'financeiro', 'estoque', 'relatorios']
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