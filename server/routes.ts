import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { mergePdfs } from "./pdf/merge";
import { splitPdf } from "./pdf/split";
import { convertToPdf, convertFromPdf } from "./pdf/convert";
import { protectPdf, unlockPdf, addWatermark, signPdf } from "./pdf/security";
import { 
  compressPdf, 
  rotatePdf, 
  addPageNumbers, 
  removePages, 
  extractPages, 
  repairPdf 
} from "./pdf/edit";

// Set up file upload
const storage_dir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(storage_dir)) {
  fs.mkdirSync(storage_dir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storage_dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint
  app.post('/api/upload', upload.array('files', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadedFiles = [];
      
      for (const file of req.files) {
        // Store file metadata in the storage interface
        const fileData = {
          filename: file.filename,
          originalFilename: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          userId: null, // For anonymous users
          metadata: {}
        };
        
        const savedFile = await storage.createFile(fileData);
        uploadedFiles.push(savedFile.id.toString());
      }
      
      return res.status(200).json({ 
        message: 'Files uploaded successfully',
        fileIds: uploadedFiles
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'File upload failed' });
    }
  });

  // PDF processing endpoint
  app.post('/api/process/:toolId', async (req, res) => {
    try {
      const { toolId } = req.params;
      const { fileIds, options } = req.body;
      
      if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
        return res.status(400).json({ message: 'No files provided' });
      }
      
      // Get file information from storage
      const files = [];
      for (const fileId of fileIds) {
        const file = await storage.getFile(parseInt(fileId));
        if (!file) {
          return res.status(404).json({ message: `File with ID ${fileId} not found` });
        }
        files.push(file);
      }
      
      // Create a job entry
      const job = await storage.createJob({
        toolId,
        status: 'processing',
        inputFileIds: fileIds,
        options: options || {},
        userId: null // For anonymous users
      });
      
      let outputFile;
      
      // Process the files based on the tool type
      switch (toolId) {
        case 'merge-pdf':
          outputFile = await mergePdfs(files, options);
          break;
        case 'split-pdf':
          outputFile = await splitPdf(files[0], options);
          break;
        case 'compress-pdf':
          outputFile = await compressPdf(files[0], options);
          break;
        case 'rotate-pdf':
          outputFile = await rotatePdf(files[0], options);
          break;
        case 'add-page-numbers':
          outputFile = await addPageNumbers(files[0], options);
          break;
        case 'remove-pages':
          outputFile = await removePages(files[0], options);
          break;
        case 'extract-pages':
          outputFile = await extractPages(files[0], options);
          break;
        case 'repair-pdf':
          outputFile = await repairPdf(files[0]);
          break;
        case 'protect-pdf':
          outputFile = await protectPdf(files[0], options);
          break;
        case 'unlock-pdf':
          outputFile = await unlockPdf(files[0], options);
          break;
        case 'add-watermark':
          outputFile = await addWatermark(files[0], options);
          break;
        case 'sign-pdf':
          outputFile = await signPdf(files[0], options);
          break;
        case 'word-to-pdf':
        case 'excel-to-pdf':
        case 'powerpoint-to-pdf':
        case 'jpg-to-pdf':
        case 'html-to-pdf':
          outputFile = await convertToPdf(files, toolId);
          break;
        case 'pdf-to-word':
        case 'pdf-to-excel':
        case 'pdf-to-powerpoint':
        case 'pdf-to-jpg':
          outputFile = await convertFromPdf(files[0], toolId);
          break;
        default:
          return res.status(400).json({ message: `Unsupported tool: ${toolId}` });
      }
      
      // Update the job with the output file
      await storage.updateJob(job.id, {
        status: 'completed',
        outputFileId: outputFile.id
      });
      
      return res.status(200).json({
        message: 'Processing completed successfully',
        resultFileId: outputFile.id.toString()
      });
    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({ message: 'Processing failed', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // File download endpoint
  app.get('/api/download/:fileId', async (req, res) => {
    try {
      const { fileId } = req.params;
      
      const file = await storage.getFile(parseInt(fileId));
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      
      res.download(file.path, file.originalFilename);
    } catch (error) {
      console.error('Download error:', error);
      return res.status(500).json({ message: 'Download failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
