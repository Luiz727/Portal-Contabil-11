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
  whatsappMessages,
  notifications,
  type User,
  type Client,
  type Task,
  type Document,
  type Event,
  type Invoice,
  type FinancialTransaction,
  type InventoryItem,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  
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
  
  // Dashboard operations
  getDashboardStats(): Promise<any>;
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
}

export const storage = new DatabaseStorage();
