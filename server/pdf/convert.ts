
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File } from '@shared/schema';
import { storage } from '../storage';
import sharp from 'sharp';

// Convert various formats to PDF
export async function convertToPdf(files: File[], toolId: string): Promise<File> {
  try {
    const outputFileName = `converted_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    // Convert based on input file type
    for (const file of files) {
      const ext = path.extname(file.originalFilename).toLowerCase();
      
      switch (ext) {
        case '.txt':
        case '.doc':
        case '.docx':
          // Create a new PDF document
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
          
          // Read text content
          const content = await fs.readFile(file.path, 'utf-8');
          
          // Add text to PDF
          const fontSize = 12;
          const margin = 50;
          const lineHeight = fontSize * 1.2;
          
          const words = content.split(/\s+/);
          let line = '';
          let y = page.getHeight() - margin;
          
          for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            const width = font.widthOfTextAtSize(testLine, fontSize);
            
            if (width > page.getWidth() - 2 * margin) {
              page.drawText(line, {
                x: margin,
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
              });
              
              line = word;
              y -= lineHeight;
              
              // Add new page if needed
              if (y < margin) {
                y = pdfDoc.addPage().getHeight() - margin;
              }
            } else {
              line = testLine;
            }
          }
          
          // Draw remaining text
          if (line) {
            page.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          }
          
          // Save the PDF
          const pdfBytes = await pdfDoc.save();
          await fs.writeFile(outputPath, pdfBytes);
          break;
          
        case '.jpg':
        case '.jpeg':
        case '.png':
          const image = await sharp(file.path);
          await image.pdf().toFile(outputPath);
          break;
          
        case '.html':
          const htmlContent = await fs.readFile(file.path, 'utf-8');
          const htmlDoc = await PDFDocument.create();
          const htmlPage = htmlDoc.addPage();
          const htmlFont = await htmlDoc.embedFont(StandardFonts.Helvetica);
          
          htmlPage.drawText(htmlContent.replace(/<[^>]*>/g, ' '), {
            x: 50,
            y: htmlPage.getHeight() - 50,
            size: 12,
            font: htmlFont,
            color: rgb(0, 0, 0),
            lineHeight: 16,
            maxWidth: htmlPage.getWidth() - 100,
          });
          
          const htmlPdfBytes = await htmlDoc.save();
          await fs.writeFile(outputPath, htmlPdfBytes);
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
    
    // Basic text extraction
    const pdfDoc = await PDFDocument.load(await fs.readFile(file.path));
    let text = '';
    
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      // Extract text (basic implementation)
      text += `Page ${i + 1}\n\n`;
    }
    
    switch (toolId) {
      case 'pdf-to-text':
        await fs.writeFile(outputPath + '.txt', text);
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
    case 'pdf-to-text':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}
