import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File } from '@shared/schema';
import { storage } from '../storage';
import { createCanvas } from 'canvas';
import officegen from 'officegen';
import mammoth from 'mammoth';

// Convert various formats to PDF
export async function convertToPdf(files: File[], toolId: string): Promise<File> {
  try {
    const pdfDoc = await PDFDocument.create();
    const outputFileName = `converted_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    for (const file of files) {
      const fileContent = await fs.readFile(file.path);

      if (file.mimeType.includes('image')) {
        // Convert image to PDF
        const page = pdfDoc.addPage([612, 792]);
        const image = await pdfDoc.embedJpg(fileContent);
        const { width, height } = image.scale(0.8);

        page.drawImage(image, {
          x: (612 - width) / 2,
          y: (792 - height) / 2,
          width,
          height,
        });
      } else if (file.mimeType.includes('word') || file.originalFilename.endsWith('.docx')) {
        // Convert Word to PDF using mammoth for text extraction
        const result = await mammoth.extractRawText({ buffer: fileContent });
        const page = pdfDoc.addPage([612, 792]);
        page.drawText(result.value, {
          x: 50,
          y: 750,
          size: 12,
          maxWidth: 500,
        });
      }
      // Add other format conversions as needed
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return await storage.createFile({
      filename: outputFileName,
      originalFilename: `converted_${path.basename(files[0].originalFilename, path.extname(files[0].originalFilename))}.pdf`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: files[0].userId,
      metadata: {
        sourceFiles: files.map(f => f.id),
        conversionType: toolId
      }
    });
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

    const { PDFNet } = await import('@pdftron/pdfnet-node');
    await PDFNet.initialize();
    await PDFNet.addResourceSearchPath('./');

    let outputFileName: string;
    let outputPath: string;

    switch (toolId) {
      case 'pdf-to-jpg':
        outputFileName = `${path.basename(file.originalFilename, '.pdf')}_${uuidv4()}.jpg`;
        outputPath = path.join(process.cwd(), 'uploads', outputFileName);

        await PDFNet.runWithCleanup(async () => {
          if (!(await PDFNet.StructuredOutputModule.isModuleAvailable())) {
            throw new Error('StructuredOutputModule not available');
          }
          const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);
          const pdfDraw = await PDFNet.PDFDraw.create(92);
          const page = await doc.getPage(1);
          await pdfDraw.export(page, outputPath);
        }, 'demo:1630195943448:78e1a25a0300000000025e875de658e8e1f4b5a21b2dd75596e782d3d06');
        break;

      case 'pdf-to-word':
        outputFileName = `${path.basename(file.originalFilename, '.pdf')}_${uuidv4()}.docx`;
        outputPath = path.join(process.cwd(), 'uploads', outputFileName);

        await PDFNet.runWithCleanup(async () => {
          if (!(await PDFNet.StructuredOutputModule.isModuleAvailable())) {
            throw new Error('StructuredOutputModule not available');
          }
          const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);
          await PDFNet.Convert.fileToWord(file.path, outputPath);
        }, 'demo:1630195943448:78e1a25a0300000000025e875de658e8e1f4b5a21b2dd75596e782d3d06');
        break;

      default:
        throw new Error(`Unsupported conversion format: ${toolId}`);
    }

    const stats = await fs.stat(outputPath);
    return await storage.createFile({
      filename: outputFileName,
      originalFilename: outputFileName,
      path: outputPath,
      size: stats.size,
      mimeType: toolId === 'pdf-to-jpg' ? 'image/jpeg' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        conversionType: toolId
      }
    });
  } catch (error) {
    console.error('Error converting from PDF:', error);
    throw error;
  }
}