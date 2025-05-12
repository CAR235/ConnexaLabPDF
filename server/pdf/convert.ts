
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File } from '@shared/schema';
import { storage } from '../storage';
import PDFNet from '@pdftron/pdfnet-node';
import { exec } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';

const execPromise = promisify(exec);

// Convert various formats to PDF
export async function convertToPdf(files: File[], toolId: string): Promise<File> {
  try {
    const outputFileName = `converted_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    // Convert based on input file type
    for (const file of files) {
      const ext = path.extname(file.originalFilename).toLowerCase();
      
      switch (ext) {
        case '.docx':
        case '.doc':
          await PDFNet.initialize();
          await PDFNet.runWithCleanup(async () => {
            const doc = await PDFNet.PDFDoc.create();
            await PDFNet.Convert.toPdf(doc, file.path);
            await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
          });
          break;
          
        case '.xlsx':
        case '.xls':
          await PDFNet.initialize();
          await PDFNet.runWithCleanup(async () => {
            const doc = await PDFNet.PDFDoc.create();
            await PDFNet.Convert.toPdf(doc, file.path);
            await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
          });
          break;
          
        case '.pptx':
        case '.ppt':
          await PDFNet.initialize();
          await PDFNet.runWithCleanup(async () => {
            const doc = await PDFNet.PDFDoc.create();
            await PDFNet.Convert.toPdf(doc, file.path);
            await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
          });
          break;
          
        case '.jpg':
        case '.jpeg':
        case '.png':
          const image = await sharp(file.path);
          await image.pdf().toFile(outputPath);
          break;
          
        case '.html':
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          const htmlContent = await fs.readFile(file.path, 'utf-8');
          
          await PDFNet.initialize();
          await PDFNet.runWithCleanup(async () => {
            const doc = await PDFNet.PDFDoc.create();
            const htmlConv = await PDFNet.HTML2PDF.create();
            await htmlConv.insertFromHtmlString(htmlContent);
            await htmlConv.convert(doc);
            await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
          });
          break;
          
        default:
          throw new Error(`Unsupported file format: ${ext}`);
      }
    }

    const stats = await fs.stat(outputPath);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: path.basename(files[0].originalFilename, path.extname(files[0].originalFilename)) + '.pdf',
      path: outputPath,
      size: stats.size,
      mimeType: 'application/pdf',
      userId: files[0].userId,
      metadata: {
        sourceFiles: files.map(f => f.id),
        conversionType: toolId
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error converting to PDF:', error);
    throw error;
  }
}

// Convert PDF to various formats
export async function convertFromPdf(file: File, toolId: string): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }

    const outputFileName = `converted_${uuidv4()}`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    await PDFNet.initialize();
    
    switch (toolId) {
      case 'pdf-to-word':
        await PDFNet.runWithCleanup(async () => {
          const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);
          const conv = await PDFNet.Convert.fileToWord();
          await conv.convert(doc, outputPath + '.docx');
        });
        break;
        
      case 'pdf-to-excel':
        await PDFNet.runWithCleanup(async () => {
          const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);
          const conv = await PDFNet.Convert.fileToExcel();
          await conv.convert(doc, outputPath + '.xlsx');
        });
        break;
        
      case 'pdf-to-powerpoint':
        await PDFNet.runWithCleanup(async () => {
          const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);
          const conv = await PDFNet.Convert.fileToPowerPoint();
          await conv.convert(doc, outputPath + '.pptx');
        });
        break;
        
      case 'pdf-to-jpg':
        await PDFNet.runWithCleanup(async () => {
          const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);
          const pdfDraw = await PDFNet.PDFDraw.create(92);
          
          for (let i = 1; i <= await doc.getPageCount(); i++) {
            const page = await doc.getPage(i);
            await pdfDraw.export(page, `${outputPath}_${i}.jpg`);
          }
        });
        break;
        
      default:
        throw new Error(`Unsupported conversion format: ${toolId}`);
    }

    const finalPath = await findConvertedFile(outputPath);
    const stats = await fs.stat(finalPath);
    
    const outputFile = await storage.createFile({
      filename: path.basename(finalPath),
      originalFilename: path.basename(finalPath),
      path: finalPath,
      size: stats.size,
      mimeType: getMimeType(toolId),
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        conversionType: toolId
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error converting from PDF:', error);
    throw error;
  }
}

async function findConvertedFile(basePath: string): Promise<string> {
  const dir = path.dirname(basePath);
  const files = await fs.readdir(dir);
  const baseFileName = path.basename(basePath);
  return path.join(dir, files.find(f => f.startsWith(baseFileName)) || '');
}

function getMimeType(toolId: string): string {
  switch (toolId) {
    case 'pdf-to-word':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'pdf-to-excel':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'pdf-to-powerpoint':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'pdf-to-jpg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}
