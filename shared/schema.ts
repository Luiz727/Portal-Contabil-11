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
  confidence: true,
  ativo: true
});

export type InsertHonorario = typeof honorarios.$inferInsert;
export type Honorario = typeof honorarios.$inferSelect;
export type InsertDocumentPattern = typeof documentPatterns.$inferInsert;
export type DocumentPattern = typeof documentPatterns.$inferSelect;
