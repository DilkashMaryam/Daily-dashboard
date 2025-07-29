import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
import { storage } from "../server/storage";
import { insertRoutineItemSchema, updateRoutineItemSchema } from "../shared/schema";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS for Vercel deployment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Get all routine items
app.get("/api/items", async (req, res) => {
  try {
    const items = await storage.getAllItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// Create new routine item
app.post("/api/items", async (req, res) => {
  try {
    const validatedData = insertRoutineItemSchema.parse(req.body);
    const item = await storage.createItem(validatedData);
    res.status(201).json(item);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to create item" });
    }
  }
});

// Update routine item
app.patch("/api/items/:id", async (req, res) => {
  try {
    const validatedData = updateRoutineItemSchema.parse({
      ...req.body,
      id: req.params.id,
    });
    
    const item = await storage.updateItem(validatedData);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to update item" });
    }
  }
});

// Delete routine item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const success = await storage.deleteItem(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
});

// Increment click count
app.post("/api/items/:id/click", async (req, res) => {
  try {
    await storage.incrementClickCount(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to record click" });
  }
});

// Reorder items
app.patch("/api/items/reorder", async (req, res) => {
  try {
    const { itemIds } = req.body;
    if (!Array.isArray(itemIds)) {
      return res.status(400).json({ message: "itemIds must be an array" });
    }
    
    await storage.reorderItems(itemIds);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder items" });
  }
});

// Search items
app.get("/api/items/search", async (req, res) => {
  try {
    const { q } = req.query;
    const items = await storage.getAllItems();
    
    if (!q || typeof q !== "string") {
      return res.json(items);
    }

    const searchTerm = q.toLowerCase();
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );

    res.json(filteredItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to search items" });
  }
});

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};