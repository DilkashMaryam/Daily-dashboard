import { type RoutineItem, type InsertRoutineItem, type UpdateRoutineItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Routine items
  getAllItems(): Promise<RoutineItem[]>;
  getItem(id: string): Promise<RoutineItem | undefined>;
  createItem(item: InsertRoutineItem): Promise<RoutineItem>;
  updateItem(item: UpdateRoutineItem): Promise<RoutineItem | undefined>;
  deleteItem(id: string): Promise<boolean>;
  incrementClickCount(id: string): Promise<void>;
  reorderItems(itemIds: string[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private items: Map<string, RoutineItem>;

  constructor() {
    this.items = new Map();
    
    // Add some default items for demonstration
    const defaultItems = [
      {
        id: randomUUID(),
        name: "Gmail",
        url: "https://gmail.com",
        description: "Email management and communication",
        order: 0,
        clickCount: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        name: "GitHub",
        url: "https://github.com",
        description: "Code repository and version control",
        order: 1,
        clickCount: 32,
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        name: "Slack",
        url: "https://slack.com",
        description: "Team communication and collaboration",
        order: 2,
        clickCount: 28,
        createdAt: new Date().toISOString(),
      },
    ];

    defaultItems.forEach(item => {
      this.items.set(item.id, item);
    });
  }

  async getAllItems(): Promise<RoutineItem[]> {
    return Array.from(this.items.values()).sort((a, b) => a.order - b.order);
  }

  async getItem(id: string): Promise<RoutineItem | undefined> {
    return this.items.get(id);
  }

  async createItem(insertItem: InsertRoutineItem): Promise<RoutineItem> {
    const id = randomUUID();
    const items = await this.getAllItems();
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : -1;
    
    const item: RoutineItem = {
      ...insertItem,
      id,
      order: insertItem.order ?? maxOrder + 1,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      description: insertItem.description ?? null,
    };
    
    this.items.set(id, item);
    return item;
  }

  async updateItem(updateData: UpdateRoutineItem): Promise<RoutineItem | undefined> {
    const existing = this.items.get(updateData.id);
    if (!existing) return undefined;

    const updated: RoutineItem = {
      ...existing,
      ...updateData,
    };

    this.items.set(updateData.id, updated);
    return updated;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async incrementClickCount(id: string): Promise<void> {
    const item = this.items.get(id);
    if (item) {
      item.clickCount += 1;
      this.items.set(id, item);
    }
  }

  async reorderItems(itemIds: string[]): Promise<void> {
    itemIds.forEach((id, index) => {
      const item = this.items.get(id);
      if (item) {
        item.order = index;
        this.items.set(id, item);
      }
    });
  }
}

export const storage = new MemStorage();
