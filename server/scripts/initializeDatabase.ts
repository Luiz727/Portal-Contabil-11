/**
 * Script para inicializar o banco de dados Supabase
 * Cria as tabelas necessárias e configura o usuário superadmin
 */

import { supabase, initializeSuperAdmin } from '../db/supabaseConfig';
import * as dotenv from 'dotenv';

dotenv.config();

// Função para executar SQL diretamente
async function executeSql(sql: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Erro ao executar SQL:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao executar SQL:', error);
    return false;
  }
}

// Criação das tabelas principais
async function createTables() {
  console.log('Criando tabelas no banco de dados...');
  
  // Definição dos enums
  const createEnums = `
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'escritorio', 'empresa', 'cliente');
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plano_empresa') THEN
        CREATE TYPE plano_empresa AS ENUM ('mei', 'pme', 'corporativo');
      END IF;
    END$$;
  `;
  
  // Tabela de escritórios
  const createEscritorios = `
    CREATE TABLE IF NOT EXISTS escritorios (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome TEXT NOT NULL,
      cnpj TEXT UNIQUE NOT NULL,
      endereco TEXT,
      telefone TEXT,
      email TEXT,
      logo_url TEXT,
      website TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
  `;
  
  // Tabela de empresas
  const createEmpresas = `
    CREATE TABLE IF NOT EXISTS empresas (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome TEXT NOT NULL,
      cnpj TEXT UNIQUE NOT NULL,
      inscricao_estadual TEXT,
      endereco TEXT,
      telefone TEXT,
      email TEXT,
      logo_url TEXT,
      website TEXT,
      escritorio_id UUID NOT NULL REFERENCES escritorios(id),
      regime_tributario TEXT DEFAULT 'Simples Nacional',
      plano plano_empresa DEFAULT 'pme',
      ativo BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
  `;
  
  // Tabela de usuários
  const createUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT,
      last_name TEXT,
      profile_image_url TEXT,
      role user_role DEFAULT 'cliente' NOT NULL,
      empresa_id UUID REFERENCES empresas(id),
      escritorio_id UUID REFERENCES escritorios(id),
      is_super_admin BOOLEAN DEFAULT false,
      custom_permissions TEXT,
      last_login TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
  `;
  
  // Tabela de relação entre usuários e empresas
  const createUsuariosEmpresas = `
    CREATE TABLE IF NOT EXISTS usuarios_empresas (
      usuario_id UUID NOT NULL REFERENCES usuarios(id),
      empresa_id UUID NOT NULL REFERENCES empresas(id),
      permissao_admin BOOLEAN DEFAULT false,
      PRIMARY KEY (usuario_id, empresa_id)
    );
  `;
  
  // Tabela de clientes
  const createClientes = `
    CREATE TABLE IF NOT EXISTS clientes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nome TEXT NOT NULL,
      cpf_cnpj TEXT NOT NULL,
      tipo TEXT DEFAULT 'PF',
      endereco TEXT,
      telefone TEXT,
      email TEXT,
      empresa_id UUID NOT NULL REFERENCES empresas(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
  `;
  
  // Tabela para sessões
  const createSessions = `
    CREATE TABLE IF NOT EXISTS sessions (
      sid VARCHAR(255) PRIMARY KEY,
      sess JSONB NOT NULL,
      expire TIMESTAMP WITH TIME ZONE NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
  `;
  
  // Executar os scripts SQL
  await executeSql(createEnums);
  await executeSql(createEscritorios);
  await executeSql(createEmpresas);
  await executeSql(createUsuarios);
  await executeSql(createUsuariosEmpresas);
  await executeSql(createClientes);
  await executeSql(createSessions);
  
  console.log('Tabelas criadas com sucesso!');
}

// Função para criar um escritório padrão NIXCON
async function createDefaultEscritorio() {
  console.log('Verificando se escritório NIXCON já existe...');
  
  const { data: existingEscritorio, error: queryError } = await supabase
    .from('escritorios')
    .select('*')
    .eq('nome', 'NIXCON Contabilidade')
    .single();
  
  if (existingEscritorio) {
    console.log('Escritório NIXCON já existe.');
    return existingEscritorio.id;
  }
  
  console.log('Criando escritório NIXCON...');
  
  const { data: escritorio, error } = await supabase
    .from('escritorios')
    .insert({
      nome: 'NIXCON Contabilidade',
      cnpj: '12.345.678/0001-90', // CNPJ fictício para exemplo
      endereco: 'Av. Paulista, 1000 - São Paulo/SP',
      telefone: '(11) 3456-7890',
      email: 'contato@nixcon.com.br',
      website: 'https://nixcon.com.br'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar escritório NIXCON:', error);
    throw error;
  }
  
  console.log('Escritório NIXCON criado com sucesso:', escritorio.id);
  return escritorio.id;
}

// Função para aplicar políticas de RLS
async function applyRlsPolicies() {
  console.log('Aplicando políticas de RLS...');
  
  // Ler o arquivo SQL com as políticas
  const fs = require('fs');
  const path = require('path');
  const policiesFilePath = path.join(__dirname, '../db/supabaseRlsPolicies.sql');
  
  if (!fs.existsSync(policiesFilePath)) {
    console.error('Arquivo de políticas RLS não encontrado:', policiesFilePath);
    return false;
  }
  
  const policiesSql = fs.readFileSync(policiesFilePath, 'utf8');
  
  // Separar em comandos individuais e executar
  const sqlCommands = policiesSql.split(';').filter(cmd => cmd.trim());
  
  for (const cmd of sqlCommands) {
    const result = await executeSql(cmd + ';');
    if (!result) {
      console.warn('Falha ao executar comando SQL de política RLS');
    }
  }
  
  console.log('Políticas RLS aplicadas com sucesso!');
  return true;
}

// Função principal de inicialização
async function initialize() {
  try {
    console.log('Inicializando banco de dados Supabase...');
    
    // Criar tabelas
    await createTables();
    
    // Criar escritório padrão
    const escritorioId = await createDefaultEscritorio();
    
    // Inicializar superadmin
    await initializeSuperAdmin();
    
    // Aplicar políticas RLS
    await applyRlsPolicies();
    
    console.log('Banco de dados inicializado com sucesso!');
    console.log('Usuário superadmin (adm@nixcon.com.br) configurado.');
    console.log('Escritório NIXCON criado com ID:', escritorioId);
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Executar inicialização
initialize();