import {
  users,
  clients,
  tasks,
  documents,
  events,
  invoices,
  financialTransactions,
  financialAccounts,
  inventoryItems,
  inventoryMovements,
  nfes,
  nfeItems,
  nfses,
  suppliers,
  productCategories,
  apiIntegrations,
  importExportLogs,
  whatsappMessages,
  notifications,
  honorarios,
  documentPatterns,
  roles,
  permissions,
  rolePermissions,
  userRoles,
  userViewModes,
  clientUsers,
  type User,
  type Client,
  type Task,
  type Document,
  type Event,
  type Invoice,
  type FinancialTransaction,
  type InventoryItem,
  type UpsertUser,
  type Nfe,
  type NfeItem,
  type Nfse,
  type Supplier,
  type ProductCategory,
  type ApiIntegration,
  type ImportExportLog,
  type Honorario,
  type InsertHonorario,
  type DocumentPattern,
  type InsertDocumentPattern,
  type Role,
  type InsertRole,
  type Permission,
  type InsertPermission,
  type RolePermission,
  type UserRole,
  type UserViewMode,
  type InsertUserViewMode,
  type ClientUser,
  VIEW_MODES,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql, lt, or, like, not, isNull } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: string, isActive: boolean): Promise<User | undefined>;
  updateUserLastLogin(id: string): Promise<User | undefined>;
  
  // Role operations
  getRole(id: number): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  getAllRoles(): Promise<Role[]>;
  createRole(roleData: InsertRole): Promise<Role>;
  updateRole(id: number, roleData: Partial<Role>): Promise<Role | undefined>;
  deleteRole(id: number): Promise<boolean>;
  
  // Permission operations
  getPermission(id: number): Promise<Permission | undefined>;
  getPermissionByCode(code: string): Promise<Permission | undefined>;
  getAllPermissions(): Promise<Permission[]>;
  getPermissionsByModule(module: string): Promise<Permission[]>;
  createPermission(permissionData: InsertPermission): Promise<Permission>;
  deletePermission(id: number): Promise<boolean>;
  
  // Role Permission operations
  getRolePermissions(roleId: number): Promise<Permission[]>;
  addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission>;
  removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean>;
  
  // User Role operations
  getUserRoles(userId: string): Promise<Role[]>;
  addRoleToUser(userId: string, roleId: number): Promise<UserRole>;
  removeRoleFromUser(userId: string, roleId: number): Promise<boolean>;
  
  // Role operations
  getRole(id: number): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  getAllRoles(): Promise<Role[]>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: number, role: Partial<Role>): Promise<Role | undefined>;
  deleteRole(id: number): Promise<boolean>;
  
  // Permission operations
  getPermission(id: number): Promise<Permission | undefined>;
  getPermissionByCode(code: string): Promise<Permission | undefined>;
  getAllPermissions(): Promise<Permission[]>;
  getPermissionsByModule(module: string): Promise<Permission[]>;
  createPermission(permission: InsertPermission): Promise<Permission>;
  deletePermission(id: number): Promise<boolean>;
  
  // Role Permission operations
  getRolePermissions(roleId: number): Promise<Permission[]>;
  addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission>;
  removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean>;
  
  // User Role operations
  getUserRoles(userId: string): Promise<Role[]>;
  addRoleToUser(userId: string, roleId: number): Promise<UserRole>;
  removeRoleFromUser(userId: string, roleId: number): Promise<boolean>;
  
  // User View Mode operations
  getUserViewMode(userId: string, viewMode: string): Promise<UserViewMode | undefined>;
  saveUserViewMode(viewMode: InsertUserViewMode): Promise<UserViewMode>;
  
  // Access control operations
  hasPermission(userId: string, permissionCode: string): Promise<boolean>;
  
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  getClientsByGroup(groupId: number): Promise<Client[]>;
  createClient(client: Client): Promise<Client>;
  updateClient(id: number, client: Partial<Client>): Promise<Client | undefined>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasks(): Promise<Task[]>;
  getTasksByClient(clientId: number): Promise<Task[]>;
  getTasksByAssignee(userId: string): Promise<Task[]>;
  getPendingTasks(): Promise<Task[]>;
  createTask(task: Task): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocuments(): Promise<Document[]>;
  getDocumentsByClient(clientId: number): Promise<Document[]>;
  createDocument(document: Document): Promise<Document>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(event: Event): Promise<Event>;
  
  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoices(): Promise<Invoice[]>;
  getInvoicesByClient(clientId: number): Promise<Invoice[]>;
  createInvoice(invoice: Invoice): Promise<Invoice>;
  
  // Financial operations
  getFinancialTransaction(id: number): Promise<FinancialTransaction | undefined>;
  getFinancialTransactions(): Promise<FinancialTransaction[]>;
  getFinancialTransactionsByAccount(accountId: number): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: FinancialTransaction): Promise<FinancialTransaction>;
  getFinancialAccountsByClient(clientId: number): Promise<any[]>;
  
  // Inventory operations
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemsByClient(clientId: number): Promise<InventoryItem[]>;
  getLowStockItems(): Promise<InventoryItem[]>;
  createInventoryItem(item: InventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  registerInventoryMovement(movement: any): Promise<any>;
  
  // NFe operations
  getNfe(id: number): Promise<Nfe | undefined>;
  getNfesByClient(clientId: number): Promise<Nfe[]>;
  getNfesByStatus(status: string): Promise<Nfe[]>;
  createNfe(nfe: Nfe): Promise<Nfe>;
  updateNfe(id: number, nfe: Partial<Nfe>): Promise<Nfe | undefined>;
  getNfeItems(nfeId: number): Promise<NfeItem[]>;
  createNfeItem(item: NfeItem): Promise<NfeItem>;
  
  // NFSe operations
  getNfse(id: number): Promise<Nfse | undefined>;
  getNfsesByClient(clientId: number): Promise<Nfse[]>;
  getNfsesByStatus(status: string): Promise<Nfse[]>;
  createNfse(nfse: Nfse): Promise<Nfse>;
  updateNfse(id: number, nfse: Partial<Nfse>): Promise<Nfse | undefined>;
  
  // Supplier operations
  getSupplier(id: number): Promise<Supplier | undefined>;
  getSuppliers(): Promise<Supplier[]>;
  getSuppliersByClient(clientId: number): Promise<Supplier[]>;
  createSupplier(supplier: Supplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<Supplier>): Promise<Supplier | undefined>;
  
  // Product category operations
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  getProductCategories(): Promise<ProductCategory[]>;
  getProductCategoriesByClient(clientId: number): Promise<ProductCategory[]>;
  createProductCategory(category: ProductCategory): Promise<ProductCategory>;
  
  // API integration operations
  getApiIntegration(id: number): Promise<ApiIntegration | undefined>;
  getApiIntegrationsByClient(clientId: number): Promise<ApiIntegration[]>;
  getApiIntegrationsByType(type: string): Promise<ApiIntegration[]>;
  createApiIntegration(integration: ApiIntegration): Promise<ApiIntegration>;
  updateApiIntegration(id: number, integration: Partial<ApiIntegration>): Promise<ApiIntegration | undefined>;
  
  // Import/Export operations
  createImportExportLog(log: ImportExportLog): Promise<ImportExportLog>;
  getImportExportLogsByClient(clientId: number): Promise<ImportExportLog[]>;
  updateImportExportLog(id: number, log: Partial<ImportExportLog>): Promise<ImportExportLog | undefined>;
  
  // Dashboard operations
  getDashboardStats(): Promise<any>;
  getClientDashboardStats(clientId: number): Promise<any>;
  
  // Operações para honorários
  getHonorarios(): Promise<any[]>;
  getHonorario(id: number): Promise<any | undefined>;
  getHonorariosByClient(clientId: number): Promise<any[]>;
  getHonorariosByStatus(status: string): Promise<any[]>;
  createHonorario(data: any): Promise<any>;
  updateHonorario(id: number, data: Partial<any>): Promise<any | undefined>;
  
  // Operações para padrões de documentos
  getDocumentPatterns(): Promise<any[]>;
  getDocumentPattern(id: number): Promise<any | undefined>;
  getDocumentPatternsByCategory(categoryId: number): Promise<any[]>;
  createDocumentPattern(data: any): Promise<any>;
  updateDocumentPattern(id: number, data: Partial<any>): Promise<any | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.firstName, users.lastName);
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserLastLogin(id: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  // Role operations
  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }
  
  async getRoleByName(name: string): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.name, name));
    return role;
  }
  
  async getAllRoles(): Promise<Role[]> {
    return await db.select().from(roles).orderBy(roles.name);
  }
  
  async createRole(roleData: InsertRole): Promise<Role> {
    const [role] = await db
      .insert(roles)
      .values(roleData)
      .returning();
    return role;
  }
  
  async updateRole(id: number, roleData: Partial<Role>): Promise<Role | undefined> {
    // Não permite alteração de roles do sistema
    const [existingRole] = await db.select().from(roles).where(eq(roles.id, id));
    if (existingRole?.isSystem) {
      throw new Error("Cannot modify system roles");
    }
    
    const [role] = await db
      .update(roles)
      .set({ ...roleData, updatedAt: new Date() })
      .where(eq(roles.id, id))
      .returning();
    return role;
  }
  
  async deleteRole(id: number): Promise<boolean> {
    // Não permite exclusão de roles do sistema
    const [existingRole] = await db.select().from(roles).where(eq(roles.id, id));
    if (existingRole?.isSystem) {
      throw new Error("Cannot delete system roles");
    }
    
    const result = await db.delete(roles).where(eq(roles.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Permission operations
  async getPermission(id: number): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.id, id));
    return permission;
  }
  
  async getPermissionByCode(code: string): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.code, code));
    return permission;
  }
  
  async getAllPermissions(): Promise<Permission[]> {
    return await db.select().from(permissions).orderBy(permissions.module, permissions.name);
  }
  
  async getPermissionsByModule(module: string): Promise<Permission[]> {
    return await db.select().from(permissions).where(eq(permissions.module, module)).orderBy(permissions.name);
  }
  
  async createPermission(permissionData: InsertPermission): Promise<Permission> {
    const [permission] = await db
      .insert(permissions)
      .values(permissionData)
      .returning();
    return permission;
  }
  
  async deletePermission(id: number): Promise<boolean> {
    const result = await db.delete(permissions).where(eq(permissions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Role Permission operations
  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const result = await db
      .select({
        permission: permissions
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));
      
    return result.map(r => r.permission);
  }
  
  async addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    const [rolePermission] = await db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .onConflictDoNothing()
      .returning();
      
    if (!rolePermission) {
      // Se já existe, apenas retorna o existente
      const [existing] = await db
        .select()
        .from(rolePermissions)
        .where(and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.permissionId, permissionId)
        ));
      return existing;
    }
    
    return rolePermission;
  }
  
  async removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean> {
    const result = await db
      .delete(rolePermissions)
      .where(and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      ));
      
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // User Role operations
  async getUserRoles(userId: string): Promise<Role[]> {
    const result = await db
      .select({
        role: roles
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
      
    return result.map(r => r.role);
  }
  
  async addRoleToUser(userId: string, roleId: number): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values({ userId, roleId })
      .onConflictDoNothing()
      .returning();
      
    if (!userRole) {
      // Se já existe, apenas retorna o existente
      const [existing] = await db
        .select()
        .from(userRoles)
        .where(and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleId, roleId)
        ));
      return existing;
    }
    
    return userRole;
  }
  
  async removeRoleFromUser(userId: string, roleId: number): Promise<boolean> {
    const result = await db
      .delete(userRoles)
      .where(and(
        eq(userRoles.userId, userId),
        eq(userRoles.roleId, roleId)
      ));
      
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // User View Mode operations
  async getUserViewMode(userId: string, viewMode: string): Promise<UserViewMode | undefined> {
    const [userViewMode] = await db
      .select()
      .from(userViewModes)
      .where(and(
        eq(userViewModes.userId, userId),
        eq(userViewModes.viewMode, viewMode)
      ));
      
    return userViewMode;
  }
  
  async saveUserViewMode(viewModeData: InsertUserViewMode): Promise<UserViewMode> {
    // Atualiza o último acesso do modo de visualização anterior
    await db
      .update(userViewModes)
      .set({ lastUsed: new Date() })
      .where(and(
        eq(userViewModes.userId, viewModeData.userId),
        eq(userViewModes.viewMode, viewModeData.viewMode)
      ));
    
    // Insere ou atualiza o modo de visualização
    const [userViewMode] = await db
      .insert(userViewModes)
      .values({
        ...viewModeData,
        lastUsed: new Date()
      })
      .onConflictDoUpdate({
        target: [userViewModes.userId, userViewModes.viewMode],
        set: {
          ...viewModeData,
          lastUsed: new Date(),
          updatedAt: new Date()
        }
      })
      .returning();
      
    return userViewMode;
  }
  
  // Access control operations
  async hasPermission(userId: string, permissionCode: string): Promise<boolean> {
    // Verifica se o usuário tem a permissão através de seus papéis
    const userRolesWithPermission = await db
      .select()
      .from(userRoles)
      .innerJoin(
        rolePermissions, 
        eq(userRoles.roleId, rolePermissions.roleId)
      )
      .innerJoin(
        permissions, 
        eq(rolePermissions.permissionId, permissions.id)
      )
      .where(and(
        eq(userRoles.userId, userId),
        eq(permissions.code, permissionCode)
      ));
      
    return userRolesWithPermission.length > 0;
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(clients.name);
  }
  
  async getClientsByGroup(groupId: number): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.groupId, groupId));
  }

  async createClient(client: Client): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, client: Partial<Client>): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }
  
  async getTasksByClient(clientId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.clientId, clientId));
  }
  
  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.assignedTo, userId));
  }
  
  async getPendingTasks(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.status, 'pending'),
          gte(tasks.dueDate, new Date())
        )
      )
      .orderBy(tasks.dueDate);
  }

  async createTask(task: Task): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.createdAt));
  }
  
  async getDocumentsByClient(clientId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.clientId, clientId));
  }

  async createDocument(document: Document): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.startDate);
  }
  
  async getUpcomingEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(gte(events.startDate, new Date()))
      .orderBy(events.startDate)
      .limit(5);
  }

  async createEvent(event: Event): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.issueDate));
  }
  
  async getInvoicesByClient(clientId: number): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.clientId, clientId));
  }

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  // Financial operations
  async getFinancialTransaction(id: number): Promise<FinancialTransaction | undefined> {
    const [transaction] = await db.select().from(financialTransactions).where(eq(financialTransactions.id, id));
    return transaction;
  }

  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return await db.select().from(financialTransactions).orderBy(desc(financialTransactions.date));
  }
  
  async getFinancialTransactionsByAccount(accountId: number): Promise<FinancialTransaction[]> {
    return await db.select().from(financialTransactions).where(eq(financialTransactions.accountId, accountId));
  }

  async createFinancialTransaction(transaction: FinancialTransaction): Promise<FinancialTransaction> {
    const [newTransaction] = await db.insert(financialTransactions).values(transaction).returning();
    return newTransaction;
  }
  
  async getFinancialAccountsByClient(clientId: number): Promise<any[]> {
    return await db.select().from(financialAccounts).where(eq(financialAccounts.clientId, clientId));
  }

  // Inventory operations
  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(inventoryItems.name);
  }
  
  async getInventoryItemsByClient(clientId: number): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).where(eq(inventoryItems.clientId, clientId));
  }
  
  async getLowStockItems(): Promise<InventoryItem[]> {
    return await db
      .select()
      .from(inventoryItems)
      .where(
        sql`${inventoryItems.quantity} <= ${inventoryItems.minQuantity}`
      );
  }

  async createInventoryItem(item: InventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  // Inventory movement operations
  async registerInventoryMovement(movement: any): Promise<any> {
    const [newMovement] = await db.insert(inventoryMovements).values(movement).returning();
    
    // Update the inventory item quantity
    const item = await this.getInventoryItem(movement.itemId);
    if (item) {
      const newQuantity = movement.type === 'in'
        ? item.quantity + movement.quantity
        : item.quantity - movement.quantity;
      
      await this.updateInventoryItem(item.id, { 
        quantity: newQuantity,
        updatedAt: new Date() 
      });
    }
    
    return newMovement;
  }

  // NFe operations
  async getNfe(id: number): Promise<Nfe | undefined> {
    const [nfe] = await db.select().from(nfes).where(eq(nfes.id, id));
    return nfe;
  }

  async getNfesByClient(clientId: number): Promise<Nfe[]> {
    return await db.select().from(nfes)
      .where(eq(nfes.clientId, clientId))
      .orderBy(desc(nfes.issueDate));
  }

  async getNfesByStatus(status: string): Promise<Nfe[]> {
    return await db.select().from(nfes)
      .where(eq(nfes.status, status))
      .orderBy(desc(nfes.issueDate));
  }

  async createNfe(nfe: Nfe): Promise<Nfe> {
    const [newNfe] = await db.insert(nfes).values(nfe).returning();
    return newNfe;
  }

  async updateNfe(id: number, nfe: Partial<Nfe>): Promise<Nfe | undefined> {
    const [updatedNfe] = await db
      .update(nfes)
      .set({ ...nfe, updatedAt: new Date() })
      .where(eq(nfes.id, id))
      .returning();
    return updatedNfe;
  }

  async getNfeItems(nfeId: number): Promise<NfeItem[]> {
    return await db.select().from(nfeItems)
      .where(eq(nfeItems.nfeId, nfeId));
  }

  async createNfeItem(item: NfeItem): Promise<NfeItem> {
    const [newItem] = await db.insert(nfeItems).values(item).returning();
    return newItem;
  }

  // NFSe operations
  async getNfse(id: number): Promise<Nfse | undefined> {
    const [nfse] = await db.select().from(nfses).where(eq(nfses.id, id));
    return nfse;
  }

  async getNfsesByClient(clientId: number): Promise<Nfse[]> {
    return await db.select().from(nfses)
      .where(eq(nfses.clientId, clientId))
      .orderBy(desc(nfses.issueDate));
  }

  async getNfsesByStatus(status: string): Promise<Nfse[]> {
    return await db.select().from(nfses)
      .where(eq(nfses.status, status))
      .orderBy(desc(nfses.issueDate));
  }

  async createNfse(nfse: Nfse): Promise<Nfse> {
    const [newNfse] = await db.insert(nfses).values(nfse).returning();
    return newNfse;
  }

  async updateNfse(id: number, nfse: Partial<Nfse>): Promise<Nfse | undefined> {
    const [updatedNfse] = await db
      .update(nfses)
      .set({ ...nfse, updatedAt: new Date() })
      .where(eq(nfses.id, id))
      .returning();
    return updatedNfse;
  }

  // Supplier operations
  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(suppliers.name);
  }

  async getSuppliersByClient(clientId: number): Promise<Supplier[]> {
    return await db.select().from(suppliers)
      .where(eq(suppliers.clientId, clientId))
      .orderBy(suppliers.name);
  }

  async createSupplier(supplier: Supplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<Supplier>): Promise<Supplier | undefined> {
    const [updatedSupplier] = await db
      .update(suppliers)
      .set({ ...supplier, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier;
  }

  // Product category operations
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    const [category] = await db.select().from(productCategories).where(eq(productCategories.id, id));
    return category;
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories).orderBy(productCategories.name);
  }

  async getProductCategoriesByClient(clientId: number): Promise<ProductCategory[]> {
    return await db.select().from(productCategories)
      .where(eq(productCategories.clientId, clientId))
      .orderBy(productCategories.name);
  }

  async createProductCategory(category: ProductCategory): Promise<ProductCategory> {
    const [newCategory] = await db.insert(productCategories).values(category).returning();
    return newCategory;
  }

  // API integration operations
  async getApiIntegration(id: number): Promise<ApiIntegration | undefined> {
    const [integration] = await db.select().from(apiIntegrations).where(eq(apiIntegrations.id, id));
    return integration;
  }

  async getApiIntegrationsByClient(clientId: number): Promise<ApiIntegration[]> {
    return await db.select().from(apiIntegrations)
      .where(eq(apiIntegrations.clientId, clientId));
  }

  async getApiIntegrationsByType(type: string): Promise<ApiIntegration[]> {
    return await db.select().from(apiIntegrations)
      .where(eq(apiIntegrations.type, type));
  }

  async createApiIntegration(integration: ApiIntegration): Promise<ApiIntegration> {
    const [newIntegration] = await db.insert(apiIntegrations).values(integration).returning();
    return newIntegration;
  }

  async updateApiIntegration(id: number, integration: Partial<ApiIntegration>): Promise<ApiIntegration | undefined> {
    const [updatedIntegration] = await db
      .update(apiIntegrations)
      .set({ ...integration, updatedAt: new Date() })
      .where(eq(apiIntegrations.id, id))
      .returning();
    return updatedIntegration;
  }

  // Import/Export operations
  async createImportExportLog(log: ImportExportLog): Promise<ImportExportLog> {
    const [newLog] = await db.insert(importExportLogs).values(log).returning();
    return newLog;
  }

  async getImportExportLogsByClient(clientId: number): Promise<ImportExportLog[]> {
    return await db.select().from(importExportLogs)
      .where(eq(importExportLogs.clientId, clientId))
      .orderBy(desc(importExportLogs.startedAt));
  }

  async updateImportExportLog(id: number, log: Partial<ImportExportLog>): Promise<ImportExportLog | undefined> {
    const [updatedLog] = await db
      .update(importExportLogs)
      .set(log)
      .where(eq(importExportLogs.id, id))
      .returning();
    return updatedLog;
  }

  // Dashboard operations
  async getDashboardStats(): Promise<any> {
    // Count pending tasks
    const [pendingTasksCount] = await db
      .select({ count: sql`count(*)` })
      .from(tasks)
      .where(eq(tasks.status, 'pending'));
      
    // Count recent documents
    const [newDocumentsCount] = await db
      .select({ count: sql`count(*)` })
      .from(documents)
      .where(
        sql`${documents.createdAt} > NOW() - INTERVAL '7 days'`
      );
      
    // Count upcoming events/obligations
    const [upcomingEventsCount] = await db
      .select({ count: sql`count(*)` })
      .from(events)
      .where(
        and(
          gte(events.startDate, new Date()),
          sql`${events.startDate} < NOW() + INTERVAL '14 days'`
        )
      );
      
    // Sum pending accounts receivable
    const [accountsReceivable] = await db
      .select({ sum: sql`COALESCE(SUM(amount), 0)` })
      .from(financialTransactions)
      .where(
        and(
          eq(financialTransactions.type, 'income'),
          eq(financialTransactions.status, 'pending')
        )
      );
      
    return {
      pendingTasks: Number(pendingTasksCount.count) || 0,
      newDocuments: Number(newDocumentsCount.count) || 0,
      upcomingEvents: Number(upcomingEventsCount.count) || 0,
      accountsReceivable: accountsReceivable.sum || 0,
    };
  }

  // Client Dashboard stats (for the client portal)
  async getClientDashboardStats(clientId: number): Promise<any> {
    // Count pending NFe/NFSe
    const [pendingNfeCount] = await db
      .select({ count: sql`count(*)` })
      .from(nfes)
      .where(
        and(
          eq(nfes.clientId, clientId),
          eq(nfes.status, 'pending')
        )
      );
    
    const [pendingNfseCount] = await db
      .select({ count: sql`count(*)` })
      .from(nfses)
      .where(
        and(
          eq(nfses.clientId, clientId),
          eq(nfses.status, 'pending')
        )
      );
    
    // Count low stock items
    const [lowStockCount] = await db
      .select({ count: sql`count(*)` })
      .from(inventoryItems)
      .where(
        and(
          eq(inventoryItems.clientId, clientId),
          sql`${inventoryItems.quantity} <= ${inventoryItems.minQuantity}`
        )
      );
    
    // Get financial summary
    const [incomeSum] = await db
      .select({ sum: sql`COALESCE(SUM(amount), 0)` })
      .from(financialTransactions)
      .innerJoin(
        financialAccounts,
        eq(financialTransactions.accountId, financialAccounts.id)
      )
      .where(
        and(
          eq(financialAccounts.clientId, clientId),
          eq(financialTransactions.type, 'income'),
          eq(financialTransactions.status, 'completed'),
          sql`${financialTransactions.date} >= DATE_TRUNC('month', CURRENT_DATE)`
        )
      );
    
    const [expenseSum] = await db
      .select({ sum: sql`COALESCE(SUM(amount), 0)` })
      .from(financialTransactions)
      .innerJoin(
        financialAccounts,
        eq(financialTransactions.accountId, financialAccounts.id)
      )
      .where(
        and(
          eq(financialAccounts.clientId, clientId),
          eq(financialTransactions.type, 'expense'),
          eq(financialTransactions.status, 'completed'),
          sql`${financialTransactions.date} >= DATE_TRUNC('month', CURRENT_DATE)`
        )
      );
    
    // Get recent invoices
    const recentInvoices = await db
      .select()
      .from(invoices)
      .where(eq(invoices.clientId, clientId))
      .orderBy(desc(invoices.issueDate))
      .limit(5);
    
    // Converter para número antes de fazer a operação aritmética
    const incomeSumValue = Number(incomeSum.sum) || 0;
    const expenseSumValue = Number(expenseSum.sum) || 0;
    
    return {
      pendingNfeCount: Number(pendingNfeCount.count) || 0,
      pendingNfseCount: Number(pendingNfseCount.count) || 0,
      lowStockCount: Number(lowStockCount.count) || 0,
      monthlyIncome: incomeSumValue,
      monthlyExpense: expenseSumValue,
      balance: incomeSumValue - expenseSumValue,
      recentInvoices
    };
  }
  
  // Operações para honorários
  async getHonorarios(): Promise<Honorario[]> {
    return await db.select().from(honorarios);
  }
  
  async getHonorario(id: number): Promise<Honorario | undefined> {
    const [result] = await db.select().from(honorarios).where(eq(honorarios.id, id));
    return result;
  }
  
  async getHonorariosByClient(clientId: number): Promise<Honorario[]> {
    return await db.select().from(honorarios).where(eq(honorarios.clientId, clientId));
  }
  
  async getHonorariosByStatus(status: string): Promise<Honorario[]> {
    return await db.select().from(honorarios).where(eq(honorarios.status, status));
  }
  
  async createHonorario(data: InsertHonorario): Promise<Honorario> {
    const [result] = await db.insert(honorarios).values(data).returning();
    return result;
  }
  
  async updateHonorario(id: number, data: Partial<Honorario>): Promise<Honorario | undefined> {
    const [result] = await db
      .update(honorarios)
      .set(data)
      .where(eq(honorarios.id, id))
      .returning();
    return result;
  }
  
  // Operações para padrões de documentos
  async getDocumentPatterns(): Promise<DocumentPattern[]> {
    return await db.select().from(documentPatterns);
  }
  
  async getDocumentPattern(id: number): Promise<DocumentPattern | undefined> {
    const [result] = await db.select().from(documentPatterns).where(eq(documentPatterns.id, id));
    return result;
  }
  
  async getDocumentPatternsByCategory(categoryId: number): Promise<DocumentPattern[]> {
    return await db.select().from(documentPatterns).where(eq(documentPatterns.categoriaId, categoryId));
  }
  
  async createDocumentPattern(data: InsertDocumentPattern): Promise<DocumentPattern> {
    const [result] = await db.insert(documentPatterns).values(data).returning();
    return result;
  }
  
  async updateDocumentPattern(id: number, data: Partial<DocumentPattern>): Promise<DocumentPattern | undefined> {
    const [result] = await db
      .update(documentPatterns)
      .set(data)
      .where(eq(documentPatterns.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
