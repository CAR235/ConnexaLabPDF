import { 
  type User, 
  type InsertUser, 
  type File, 
  type InsertFile,
  type Job,
  type InsertJob,
  users,
  files,
  jobs
} from "@shared/schema";

import { db } from "./db";
import { eq, and, isNull } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // File methods
  getFile(id: number): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, updates: Partial<File>): Promise<File>;
  deleteFile(id: number): Promise<boolean>;
  
  // Job methods
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, updates: Partial<Job>): Promise<Job>;
  getJobsByUserId(userId: number | null): Promise<Job[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // File methods
  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }
  
  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db.insert(files).values(insertFile).returning();
    return file;
  }
  
  async updateFile(id: number, updates: Partial<File>): Promise<File> {
    const [updatedFile] = await db
      .update(files)
      .set(updates)
      .where(eq(files.id, id))
      .returning();
    
    if (!updatedFile) {
      throw new Error(`File with ID ${id} not found`);
    }
    
    return updatedFile;
  }
  
  async deleteFile(id: number): Promise<boolean> {
    const result = await db
      .delete(files)
      .where(eq(files.id, id))
      .returning({ id: files.id });
    
    return result.length > 0;
  }
  
  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }
  
  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    
    return job;
  }
  
  async updateJob(id: number, updates: Partial<Job>): Promise<Job> {
    const now = new Date();
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: now
    };
    
    const [updatedJob] = await db
      .update(jobs)
      .set(updatesWithTimestamp)
      .where(eq(jobs.id, id))
      .returning();
    
    if (!updatedJob) {
      throw new Error(`Job with ID ${id} not found`);
    }
    
    return updatedJob;
  }
  
  async getJobsByUserId(userId: number | null): Promise<Job[]> {
    if (userId === null) {
      return db
        .select()
        .from(jobs)
        .where(isNull(jobs.userId));
    } else {
      return db
        .select()
        .from(jobs)
        .where(eq(jobs.userId, userId));
    }
  }
}

export const storage = new DatabaseStorage();
