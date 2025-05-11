import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (from the original schema, kept for reference)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Files table to store uploaded files
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
  metadata: jsonb("metadata"),
});

// Jobs table to track PDF processing jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  toolId: text("tool_id").notNull(), // e.g., "merge-pdf", "split-pdf"
  status: text("status").notNull(), // pending, processing, completed, failed
  inputFileIds: jsonb("input_file_ids").notNull(), // array of file ids
  outputFileId: integer("output_file_id").references(() => files.id),
  options: jsonb("options"), // tool-specific options
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  outputFileId: true,
  error: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Tool-specific options types
export interface MergePdfOptions {
  pageOrder?: number[];
}

export interface SplitPdfOptions {
  ranges?: string; // e.g. "1-3,5,7-9"
  splitMethod?: 'range' | 'everyNPages' | 'byBookmarks';
  everyNPages?: number;
}

export interface CompressPdfOptions {
  quality?: 'low' | 'medium' | 'high';
}

export interface ProtectPdfOptions {
  password: string;
  permissions?: {
    printing?: boolean;
    copying?: boolean;
    modifying?: boolean;
  };
}

export interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
  position?: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  imagePath?: string;
}

export interface PageNumberOptions {
  startNumber?: number;
  position?: 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
  format?: string; // e.g. "Page {n} of {total}"
  fontSize?: number;
  fontColor?: string;
}
