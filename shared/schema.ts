import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  varchar,
  jsonb,
  index,
  date,
  decimal,
  primaryKey,
  foreignKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tipos de visualização disponíveis
export const VIEW_MODES = {
  ESCRITORIO: 'escritorio',
  EMPRESA: 'empresa',
  CONTADOR: 'contador',
  EXTERNO: 'externo'
};

export type ViewMode = 'escritorio' | 'empresa' | 'contador' | 'externo';

// Tipos para perfis de visualização
export interface PerfilVisualizacao {
  id: string;
  nome: string;
  descricao: string;
  permissoes: string[];
}

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for authentication and profile information
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").default("client").notNull(), // admin, accountant, client
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Roles table for role-based access control
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false), // System roles cannot be modified
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Permissions table to define granular permissions
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(), // A unique code for the permission (e.g., "manage_users")
  name: text("name").notNull(),
  description: text("description"),
  module: text("module").notNull(), // The module this permission belongs to (e.g., "users", "fiscal", "finance")
  createdAt: timestamp("created_at").defaultNow(),
});

// Role permissions - many-to-many relationship between roles and permissions
export const rolePermissions = pgTable("role_permissions", {
  roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: integer("permission_id").notNull().references(() => permissions.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey(table.roleId, table.permissionId),
}));

// User roles - many-to-many relationship between users and roles
export const userRoles = pgTable("user_roles", {
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: primaryKey(table.userId, table.roleId),
}));

// User view modes - stores the active view mode configuration for each user
export const userViewModes = pgTable("user_view_modes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  viewMode: text("view_mode").notNull(), // escritorio, empresa, contador, externo
  activeProfile: text("active_profile"), // ID of the active profile within this view mode
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'set null' }),
  lastUsed: timestamp("last_used").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cnpj: text("cnpj").unique().notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  groupId: integer("group_id"), // For companies in a holding or economic group
  responsible: text("responsible"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company groups (holdings)
export const companyGroups = pgTable("company_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client user relationships - connects users to client companies
export const clientUsers = pgTable("client_users", {
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessLevel: text("access_level").default("basic").notNull(), // basic, standard, admin
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: primaryKey(table.clientId, table.userId),
}));

// Tasks for the team
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'set null' }),
  assignedTo: varchar("assigned_to").references(() => users.id, { onDelete: 'set null' }),
  priority: text("priority").default("normal").notNull(), // low, normal, high, urgent
  status: text("status").default("pending").notNull(), // pending, in_progress, completed, cancelled
  dueDate: timestamp("due_date"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: text("recurring_pattern"), // monthly, quarterly, yearly, etc.
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Document categories
export const documentCategories = pgTable("document_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  path: text("path").notNull(),
  fileType: text("file_type").notNull(), // pdf, doc, xlsx, xml, etc.
  size: integer("size").notNull(), // Size in bytes
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  categoryId: integer("category_id").references(() => documentCategories.id, { onDelete: 'set null' }),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  allDay: boolean("all_day").default(false),
  location: text("location"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'set null' }),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// XML invoices
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  number: text("number").notNull(),
  type: text("type").notNull(), // NFe, NFSe
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  issueDate: date("issue_date").notNull(),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  xmlData: text("xml_data"), // Store the full XML data
  documentId: integer("document_id").references(() => documents.id, { onDelete: 'set null' }), // Reference to the XML document
  status: text("status").default("active").notNull(), // active, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial accounts (bank accounts, cash accounts, etc.)
export const financialAccounts = pgTable("financial_accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // checking, savings, cash, credit_card
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  branch: text("branch"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  initialBalance: decimal("initial_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial transactions
export const financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => financialAccounts.id, { onDelete: 'cascade' }),
  type: text("type").notNull(), // income, expense, transfer
  category: text("category"),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  status: text("status").default("pending").notNull(), // pending, completed, cancelled
  invoiceId: integer("invoice_id").references(() => invoices.id, { onDelete: 'set null' }),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory items
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku"),
  quantity: integer("quantity").default(0).notNull(),
  unit: text("unit"), // units, kg, pieces, etc.
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  minQuantity: integer("min_quantity"), // For low stock alerts
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory movements
export const inventoryMovements = pgTable("inventory_movements", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").references(() => inventoryItems.id, { onDelete: 'cascade' }),
  type: text("type").notNull(), // in, out
  quantity: integer("quantity").notNull(),
  date: date("date").notNull(),
  description: text("description"),
  invoiceId: integer("invoice_id").references(() => invoices.id, { onDelete: 'set null' }),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// NFe - Notas Fiscais Eletrônicas
export const nfes = pgTable("nfes", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  number: text("number").notNull(),
  series: text("series").notNull(),
  issueDate: date("issue_date").notNull(),
  operationType: text("operation_type").notNull(), // entrada, saída
  nature: text("nature").notNull(), // Venda, Devolução, etc.
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  taxValue: decimal("tax_value", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("draft").notNull(), // draft, pending, approved, rejected, cancelled
  xmlPath: text("xml_path"), // Caminho para o arquivo XML
  pdfPath: text("pdf_path"), // Caminho para o DANFE em PDF
  notes: text("notes"),
  accessKey: text("access_key"), // Chave de acesso da NFe
  protocol: text("protocol"), // Protocolo de autorização
  invoiceId: integer("invoice_id").references(() => invoices.id, { onDelete: 'set null' }),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    clientNumberSeriesIdx: uniqueIndex("client_number_series_idx").on(table.clientId, table.number, table.series),
  };
});

// NFe Items
export const nfeItems = pgTable("nfe_items", {
  id: serial("id").primaryKey(),
  nfeId: integer("nfe_id").references(() => nfes.id, { onDelete: 'cascade' }),
  itemId: integer("item_id").references(() => inventoryItems.id, { onDelete: 'set null' }),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  unitValue: decimal("unit_value", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  ncm: text("ncm").notNull(), // Nomenclatura Comum do Mercosul
  cfop: text("cfop").notNull(), // Código Fiscal de Operações e Prestações
  unitOfMeasure: text("unit_of_measure").notNull(), // UN, KG, etc.
  taxGroup: text("tax_group"), // Grupo tributário
  icmsValue: decimal("icms_value", { precision: 10, scale: 2 }),
  icmsRate: decimal("icms_rate", { precision: 5, scale: 2 }),
  ipiValue: decimal("ipi_value", { precision: 10, scale: 2 }),
  ipiRate: decimal("ipi_rate", { precision: 5, scale: 2 }),
  pisValue: decimal("pis_value", { precision: 10, scale: 2 }),
  pisRate: decimal("pis_rate", { precision: 5, scale: 2 }),
  cofinsValue: decimal("cofins_value", { precision: 10, scale: 2 }),
  cofinsRate: decimal("cofins_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NFSe - Notas Fiscais de Serviço Eletrônicas
export const nfses = pgTable("nfses", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  number: text("number").notNull(),
  verificationCode: text("verification_code"),
  issueDate: date("issue_date").notNull(),
  serviceDescription: text("service_description").notNull(),
  serviceCode: text("service_code").notNull(), // Código de serviço municipal
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  issCity: text("iss_city").notNull(), // Cidade de prestação do serviço
  issRate: decimal("iss_rate", { precision: 5, scale: 2 }).notNull(),
  issValue: decimal("iss_value", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("draft").notNull(), // draft, pending, approved, rejected, cancelled
  xmlPath: text("xml_path"), // Caminho para o arquivo XML
  pdfPath: text("pdf_path"), // Caminho para o PDF
  notes: text("notes"),
  accessKey: text("access_key"), // Chave de acesso da NFSe
  protocol: text("protocol"), // Protocolo de autorização
  invoiceId: integer("invoice_id").references(() => invoices.id, { onDelete: 'set null' }),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    clientNumberIdx: uniqueIndex("client_number_idx").on(table.clientId, table.number),
  };
});

// Suppliers for inventory items and services
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cnpj: text("cnpj").unique().notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  contact: text("contact"),
  notes: text("notes"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product categories for inventory
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API integrations
export const apiIntegrations = pgTable("api_integrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // nfe, nfse, banking, marketplace, etc.
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  config: jsonb("config").notNull(), // Configuration details (endpoints, credentials, etc.)
  active: boolean("active").default(true),
  lastSyncDate: timestamp("last_sync_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Import/Export logs
export const importExportLogs = pgTable("import_export_logs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  type: text("type").notNull(), // import, export
  format: text("format").notNull(), // xml, csv, txt, etc.
  status: text("status").default("pending").notNull(), // pending, processing, completed, failed
  filePath: text("file_path"), // Path to imported/exported file
  processedItems: integer("processed_items").default(0),
  totalItems: integer("total_items").default(0),
  errorDetails: text("error_details"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdBy: varchar("created_by").references(() => users.id),
});

// WhatsApp messages
export const whatsappMessages = pgTable("whatsapp_messages", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  phone: text("phone").notNull(),
  content: text("content").notNull(),
  type: text("type").default("outgoing").notNull(), // incoming, outgoing
  status: text("status").default("pending").notNull(), // pending, sent, delivered, read, failed
  documentId: integer("document_id").references(() => documents.id, { onDelete: 'set null' }),
  sentAt: timestamp("sent_at"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // task, document, event, system
  read: boolean("read").default(false),
  relatedId: integer("related_id"), // ID of the related entity (task, document, etc.)
  relatedType: text("related_type"), // Type of the related entity
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  cnpj: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  postalCode: true,
  groupId: true,
  responsible: true,
  active: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  clientId: true,
  assignedTo: true,
  priority: true,
  status: true,
  dueDate: true,
  isRecurring: true,
  recurringPattern: true,
  createdBy: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  name: true,
  description: true,
  path: true,
  fileType: true,
  size: true,
  clientId: true,
  categoryId: true,
  uploadedBy: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  allDay: true,
  location: true,
  clientId: true,
  createdBy: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  number: true,
  type: true,
  clientId: true,
  issueDate: true,
  totalValue: true,
  xmlData: true,
  documentId: true,
  status: true,
});

export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions).pick({
  accountId: true,
  type: true,
  category: true,
  description: true,
  amount: true,
  date: true,
  status: true,
  invoiceId: true,
  createdBy: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  description: true,
  sku: true,
  quantity: true,
  unit: true,
  costPrice: true,
  salePrice: true,
  minQuantity: true,
  clientId: true,
});

// Schemas para as novas tabelas
export const insertNfeSchema = createInsertSchema(nfes).pick({
  clientId: true,
  number: true,
  series: true,
  issueDate: true,
  operationType: true,
  nature: true,
  totalValue: true,
  taxValue: true,
  status: true,
  xmlPath: true,
  pdfPath: true,
  notes: true,
  accessKey: true,
  protocol: true,
  invoiceId: true,
  createdBy: true,
});

export const insertNfeItemSchema = createInsertSchema(nfeItems).pick({
  nfeId: true,
  itemId: true,
  description: true,
  quantity: true,
  unitValue: true,
  totalValue: true,
  ncm: true,
  cfop: true,
  unitOfMeasure: true,
  taxGroup: true,
  icmsValue: true,
  icmsRate: true,
  ipiValue: true,
  ipiRate: true,
  pisValue: true,
  pisRate: true,
  cofinsValue: true,
  cofinsRate: true,
});

export const insertNfseSchema = createInsertSchema(nfses).pick({
  clientId: true,
  number: true,
  verificationCode: true,
  issueDate: true,
  serviceDescription: true,
  serviceCode: true,
  totalValue: true,
  issCity: true,
  issRate: true,
  issValue: true,
  status: true,
  xmlPath: true,
  pdfPath: true,
  notes: true,
  accessKey: true,
  protocol: true,
  invoiceId: true,
  createdBy: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  cnpj: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  postalCode: true,
  contact: true,
  notes: true,
  clientId: true,
  active: true,
});

export const insertProductCategorySchema = createInsertSchema(productCategories).pick({
  name: true,
  description: true,
  clientId: true,
});

export const insertApiIntegrationSchema = createInsertSchema(apiIntegrations).pick({
  name: true,
  type: true,
  clientId: true,
  config: true,
  active: true,
});

export const insertImportExportLogSchema = createInsertSchema(importExportLogs).pick({
  clientId: true,
  type: true,
  format: true,
  status: true,
  filePath: true,
  processedItems: true,
  totalItems: true,
  errorDetails: true,
  startedAt: true,
  completedAt: true,
  createdBy: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type Event = typeof events.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type InsertFinancialTransaction = typeof financialTransactions.$inferInsert;
export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Tipos para as novas tabelas
export type InsertNfe = typeof nfes.$inferInsert;
export type Nfe = typeof nfes.$inferSelect;
export type InsertNfeItem = typeof nfeItems.$inferInsert;
export type NfeItem = typeof nfeItems.$inferSelect;
export type InsertNfse = typeof nfses.$inferInsert;
export type Nfse = typeof nfses.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;
export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertApiIntegration = typeof apiIntegrations.$inferInsert;
export type ApiIntegration = typeof apiIntegrations.$inferSelect;
export type InsertImportExportLog = typeof importExportLogs.$inferInsert;
export type ImportExportLog = typeof importExportLogs.$inferSelect;

// Tabela de honorários para controle financeiro do escritório
export const honorarios = pgTable("honorarios", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: varchar("valor").notNull(),
  vencimento: varchar("vencimento").notNull(), 
  tipoServico: varchar("tipo_servico", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).default("pendente").notNull(),
  observacoes: text("observacoes"),
  nfseId: integer("nfse_id").references(() => nfses.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Tabela para padrões de documentos reconhecidos pela IA
export const documentPatterns = pgTable("document_patterns", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  pattern: text("pattern").notNull(),
  regexPattern: text("regex_pattern"),
  categoriaId: integer("categoria_id").references(() => documentCategories.id),
  palavrasChave: text("palavras_chave").array(),
  confiancaValor: integer("confianca_valor"),
  ativo: boolean("ativo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertHonorarioSchema = createInsertSchema(honorarios).pick({
  clientId: true,
  descricao: true,
  valor: true,
  vencimento: true,
  tipoServico: true,
  status: true,
  observacoes: true,
  nfseId: true
});

export const insertDocumentPatternSchema = createInsertSchema(documentPatterns).pick({
  nome: true,
  descricao: true,
  pattern: true,
  regexPattern: true,
  categoriaId: true,
  palavrasChave: true,
  confiancaValor: true,
  ativo: true
});

export type InsertHonorario = typeof honorarios.$inferInsert;
export type Honorario = typeof honorarios.$inferSelect;
export type InsertDocumentPattern = typeof documentPatterns.$inferInsert;
export type DocumentPattern = typeof documentPatterns.$inferSelect;

// Produtos universais - compartilhados entre empresas
export const universalProducts = pgTable("universal_products", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  ncm: text("ncm").notNull(), // Nomenclatura Comum do Mercosul
  cest: text("cest"), // Código Especificador da Substituição Tributária
  cfop: text("cfop"), // Código Fiscal de Operações e Prestações padrão
  defaultUnit: text("default_unit").notNull(), // UN, KG, etc.
  basePrice: decimal("base_price", { precision: 10, scale: 2 }), // Preço base de referência
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }), // Preço de custo padrão
  productType: text("product_type").default("product").notNull(), // product, service
  active: boolean("active").default(true),
  taxGroup: text("tax_group"), // Grupo tributário padrão
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Preços personalizados por cliente para produtos universais
export const clientProductPrices = pgTable("client_product_prices", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  universalProductId: integer("universal_product_id").references(() => universalProducts.id, { onDelete: 'cascade' }),
  customPrice: decimal("custom_price", { precision: 10, scale: 2 }).notNull(),
  validFrom: date("valid_from").defaultNow(),
  validUntil: date("valid_until"),
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    clientProductIdx: uniqueIndex("client_product_idx").on(table.clientId, table.universalProductId),
  };
});

// Simulações de cálculo de impostos
export const taxSimulations = pgTable("tax_simulations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: 'cascade' }),
  operationType: text("operation_type").notNull(), // entrada, saída
  destinationState: text("destination_state").notNull(),
  originState: text("origin_state").notNull(),
  taxRegime: text("tax_regime").notNull(), // simples_nacional, lucro_presumido, lucro_real
  simplesRate: decimal("simples_rate", { precision: 5, scale: 2 }),
  icmsRate: decimal("icms_rate", { precision: 5, scale: 2 }),
  icmsStRate: decimal("icms_st_rate", { precision: 5, scale: 2 }),
  ipiRate: decimal("ipi_rate", { precision: 5, scale: 2 }),
  pisRate: decimal("pis_rate", { precision: 5, scale: 2 }),
  cofinsRate: decimal("cofins_rate", { precision: 5, scale: 2 }),
  issRate: decimal("iss_rate", { precision: 5, scale: 2 }),
  freightValue: decimal("freight_value", { precision: 10, scale: 2 }).default("0"),
  insuranceValue: decimal("insurance_value", { precision: 10, scale: 2 }).default("0"),
  otherCosts: decimal("other_costs", { precision: 10, scale: 2 }).default("0"),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  totalTaxes: decimal("total_taxes", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("draft").notNull(), // draft, completed
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Itens da simulação de impostos
export const taxSimulationItems = pgTable("tax_simulation_items", {
  id: serial("id").primaryKey(),
  simulationId: integer("simulation_id").references(() => taxSimulations.id, { onDelete: 'cascade' }),
  universalProductId: integer("universal_product_id").references(() => universalProducts.id, { onDelete: 'cascade' }),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  unitValue: decimal("unit_value", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  ncm: text("ncm").notNull(),
  cfop: text("cfop").notNull(),
  unitOfMeasure: text("unit_of_measure").notNull(),
  icmsValue: decimal("icms_value", { precision: 10, scale: 2 }),
  icmsStValue: decimal("icms_st_value", { precision: 10, scale: 2 }),
  ipiValue: decimal("ipi_value", { precision: 10, scale: 2 }),
  pisValue: decimal("pis_value", { precision: 10, scale: 2 }),
  cofinsValue: decimal("cofins_value", { precision: 10, scale: 2 }),
  issValue: decimal("iss_value", { precision: 10, scale: 2 }),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).default("0"),
  netValue: decimal("net_value", { precision: 10, scale: 2 }).notNull(), // Valor líquido após impostos
  profitMargin: decimal("profit_margin", { precision: 10, scale: 2 }), // Margem de lucro calculada
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }), // Preço de custo para cálculo
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Price tiers para produtos (por faixa de cliente)
export const productPriceTiers = pgTable("product_price_tiers", {
  id: serial("id").primaryKey(),
  universalProductId: integer("universal_product_id").references(() => universalProducts.id, { onDelete: 'cascade' }),
  tierName: text("tier_name").notNull(), // básico, premium, revenda, atacado, varejo, etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  minimumQuantity: integer("minimum_quantity").default(1),
  active: boolean("active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    productTierIdx: uniqueIndex("product_tier_idx").on(table.universalProductId, table.tierName),
  };
});

// Kits de produtos (produtos compostos por outros produtos)
export const productKits = pgTable("product_kits", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  active: boolean("active").default(true),
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Itens do kit de produtos
export const productKitItems = pgTable("product_kit_items", {
  id: serial("id").primaryKey(),
  kitId: integer("kit_id").references(() => productKits.id, { onDelete: 'cascade' }),
  universalProductId: integer("universal_product_id").references(() => universalProducts.id, { onDelete: 'cascade' }),
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema de inserção para produtos universais
export const insertUniversalProductSchema = createInsertSchema(universalProducts).pick({
  code: true,
  name: true,
  description: true,
  ncm: true,
  cest: true,
  cfop: true,
  defaultUnit: true,
  basePrice: true,
  costPrice: true,
  productType: true,
  active: true,
  taxGroup: true,
  notes: true,
  createdBy: true,
});

// Schema de inserção para simulações de impostos
export const insertTaxSimulationSchema = createInsertSchema(taxSimulations).pick({
  name: true,
  clientId: true,
  operationType: true,
  destinationState: true,
  originState: true,
  taxRegime: true,
  simplesRate: true,
  icmsRate: true,
  icmsStRate: true,
  ipiRate: true,
  pisRate: true,
  cofinsRate: true,
  issRate: true,
  freightValue: true,
  insuranceValue: true,
  otherCosts: true,
  totalValue: true,
  totalTaxes: true,
  status: true,
  notes: true,
  createdBy: true,
});

// Schema de inserção para itens de simulação
export const insertTaxSimulationItemSchema = createInsertSchema(taxSimulationItems).pick({
  simulationId: true,
  universalProductId: true,
  description: true,
  quantity: true,
  unitValue: true,
  totalValue: true,
  ncm: true,
  cfop: true,
  unitOfMeasure: true,
  icmsValue: true,
  icmsStValue: true,
  ipiValue: true,
  pisValue: true,
  cofinsValue: true,
  issValue: true,
  discountValue: true,
  netValue: true,
  profitMargin: true,
  costPrice: true,
});

// Schema de inserção para kits de produtos
export const insertProductKitSchema = createInsertSchema(productKits).pick({
  code: true,
  name: true,
  description: true,
  basePrice: true,
  active: true,
  notes: true,
  createdBy: true,
});

// Tipos exportados
export type InsertUniversalProduct = typeof universalProducts.$inferInsert;
export type UniversalProduct = typeof universalProducts.$inferSelect;
export type InsertTaxSimulation = typeof taxSimulations.$inferInsert;
export type TaxSimulation = typeof taxSimulations.$inferSelect;
export type InsertTaxSimulationItem = typeof taxSimulationItems.$inferInsert;
export type TaxSimulationItem = typeof taxSimulationItems.$inferSelect;
export type InsertProductKit = typeof productKits.$inferInsert;
export type ProductKit = typeof productKits.$inferSelect;

// Esquemas e tipos para o sistema de autenticação e autorização
// Reaproveitando as definições de tipos já existentes: UpsertUser e User

export const insertRoleSchema = createInsertSchema(roles, {
  name: z.string().min(3).max(50),
  description: z.string().optional(),
  isSystem: z.boolean().default(false),
}).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;

export const insertPermissionSchema = createInsertSchema(permissions, {
  code: z.string().min(3).max(50),
  name: z.string().min(3).max(100),
  module: z.string().min(2).max(50),
}).omit({ id: true, createdAt: true });
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type Permission = typeof permissions.$inferSelect;

export const insertRolePermissionSchema = createInsertSchema(rolePermissions);
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;
export type RolePermission = typeof rolePermissions.$inferSelect;

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({ createdAt: true });
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof userRoles.$inferSelect;

export const insertUserViewModeSchema = createInsertSchema(userViewModes).omit({ id: true, createdAt: true, updatedAt: true, lastUsed: true });
export type InsertUserViewMode = z.infer<typeof insertUserViewModeSchema>;
export type UserViewMode = typeof userViewModes.$inferSelect;

export const insertClientUserSchema = createInsertSchema(clientUsers).omit({ createdAt: true });
export type InsertClientUser = z.infer<typeof insertClientUserSchema>;
export type ClientUser = typeof clientUsers.$inferSelect;
