import { 
  type User, 
  type InsertUser, 
  type File, 
  type InsertFile,
  type Job,
  type InsertJob
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private files: Map<number, File>;
  private jobs: Map<number, Job>;
  
  private userId: number;
  private fileId: number;
  private jobId: number;
  
  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.jobs = new Map();
    
    this.userId = 1;
    this.fileId = 1;
    this.jobId = 1;
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // File methods
  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }
  
  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.fileId++;
    const file: File = {
      ...insertFile,
      id,
      createdAt: new Date()
    };
    this.files.set(id, file);
    return file;
  }
  
  async updateFile(id: number, updates: Partial<File>): Promise<File> {
    const file = await this.getFile(id);
    if (!file) {
      throw new Error(`File with ID ${id} not found`);
    }
    
    const updatedFile = { ...file, ...updates };
    this.files.set(id, updatedFile);
    return updatedFile;
  }
  
  async deleteFile(id: number): Promise<boolean> {
    return this.files.delete(id);
  }
  
  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }
  
  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobId++;
    const now = new Date();
    const job: Job = {
      ...insertJob,
      id,
      createdAt: now,
      updatedAt: now,
      outputFileId: null,
      error: null
    };
    this.jobs.set(id, job);
    return job;
  }
  
  async updateJob(id: number, updates: Partial<Job>): Promise<Job> {
    const job = await this.getJob(id);
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    
    const updatedJob = { 
      ...job, 
      ...updates,
      updatedAt: new Date()
    };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }
  
  async getJobsByUserId(userId: number | null): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.userId === userId,
    );
  }
}

export const storage = new MemStorage();
