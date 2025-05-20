import { pgTable, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';

/**
 * Enumeração que define os papéis de usuário no sistema NIXCON
 * Esta enumeração garante a consistência com o modelo de permissões
 */
export const roleEnum = pgEnum('user_role', [
  'admin',       // Administrador do Sistema
  'escritorio',  // Membro do Escritório de Contabilidade
  'empresa',     // Empresa Usuária
  'cliente'      // Cliente das Empresas Usuárias
]);

/**
 * Enumeração que define os planos disponíveis para empresas usuárias
 */
export const planoEmpresaEnum = pgEnum('plano_empresa', [
  'mei',         // Microempreendedor Individual
  'pme',         // Pequena e Média Empresa
  'corporativo'  // Plano Corporativo
]);

/**
 * Tabela de usuários do sistema NIXCON
 * Contém todos os dados de usuários de todos os níveis
 */
export const usuarios = pgTable('usuarios', {
  id: varchar('id').primaryKey().notNull(),
  email: varchar('email').unique().notNull(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  profileImageUrl: varchar('profile_image_url'),
  role: roleEnum('role').default('cliente').notNull(),
  empresaId: varchar('empresa_id'),
  escritorioId: varchar('escritorio_id'),
  isSuperAdmin: boolean('is_super_admin').default(false),
  customPermissions: varchar('custom_permissions'), // JSON string com permissões customizadas
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Tabela de escritórios de contabilidade
 */
export const escritorios = pgTable('escritorios', {
  id: varchar('id').primaryKey().notNull(),
  nome: varchar('nome').notNull(),
  cnpj: varchar('cnpj').unique().notNull(),
  endereco: varchar('endereco'),
  telefone: varchar('telefone'),
  email: varchar('email'),
  logoUrl: varchar('logo_url'),
  website: varchar('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Tabela de empresas usuárias do sistema
 */
export const empresas = pgTable('empresas', {
  id: varchar('id').primaryKey().notNull(),
  nome: varchar('nome').notNull(),
  cnpj: varchar('cnpj').unique().notNull(),
  inscricaoEstadual: varchar('inscricao_estadual'),
  endereco: varchar('endereco'),
  telefone: varchar('telefone'),
  email: varchar('email'),
  logoUrl: varchar('logo_url'),
  website: varchar('website'),
  escritorioId: varchar('escritorio_id').notNull(), // Escritório responsável
  regimeTributario: varchar('regime_tributario').default('Simples Nacional'),
  plano: planoEmpresaEnum('plano').default('pme'),
  ativo: boolean('ativo').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Tabela de clientes das empresas usuárias
 */
export const clientes = pgTable('clientes', {
  id: varchar('id').primaryKey().notNull(),
  nome: varchar('nome').notNull(),
  cpfCnpj: varchar('cpf_cnpj').notNull(),
  tipo: varchar('tipo').default('PF'), // PF ou PJ
  endereco: varchar('endereco'),
  telefone: varchar('telefone'),
  email: varchar('email'),
  empresaId: varchar('empresa_id').notNull(), // Empresa à qual o cliente pertence
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Tabela para relação entre usuários e empresas
 * Permite que um usuário do escritório acesse várias empresas
 */
export const usuariosEmpresas = pgTable('usuarios_empresas', {
  usuarioId: varchar('usuario_id').notNull(),
  empresaId: varchar('empresa_id').notNull(),
  permissaoAdmin: boolean('permissao_admin').default(false),
});

/**
 * Definição de relações entre as tabelas
 */
export const usuariosRelations = relations(usuarios, ({ many }) => ({
  empresasAcesso: many(usuariosEmpresas),
}));

export const empresasRelations = relations(empresas, ({ one, many }) => ({
  escritorio: one(escritorios, {
    fields: [empresas.escritorioId],
    references: [escritorios.id],
  }),
  usuarios: many(usuariosEmpresas),
  clientes: many(clientes),
}));

export const escritoriosRelations = relations(escritorios, ({ many }) => ({
  empresas: many(empresas),
}));

export const clientesRelations = relations(clientes, ({ one }) => ({
  empresa: one(empresas, {
    fields: [clientes.empresaId],
    references: [empresas.id],
  }),
}));

export const usuariosEmpresasRelations = relations(usuariosEmpresas, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [usuariosEmpresas.usuarioId],
    references: [usuarios.id],
  }),
  empresa: one(empresas, {
    fields: [usuariosEmpresas.empresaId],
    references: [empresas.id],
  }),
}));

// Schemas Zod para inserção e validação
export const insertUsuarioSchema = createInsertSchema(usuarios).omit({ 
  createdAt: true, 
  updatedAt: true 
});

export const insertEscritorioSchema = createInsertSchema(escritorios).omit({ 
  createdAt: true, 
  updatedAt: true 
});

export const insertEmpresaSchema = createInsertSchema(empresas).omit({ 
  createdAt: true, 
  updatedAt: true 
});

export const insertClienteSchema = createInsertSchema(clientes).omit({ 
  createdAt: true, 
  updatedAt: true 
});

// Tipos inferidos
export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Escritorio = typeof escritorios.$inferSelect;
export type InsertEscritorio = z.infer<typeof insertEscritorioSchema>;
export type Empresa = typeof empresas.$inferSelect;
export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;
export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = z.infer<typeof insertClienteSchema>;