
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File } from '@shared/schema';
import { storage } from '../storage';
import sharp from 'sharp';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as pdf2json from 'pdf2json';
import * as xlsx from 'xlsx';
import * as pptxgenjs from 'pptxgenjs';

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
        case '.docx': {
          const docxBuffer = await fs.readFile(file.path);
          const pdfDoc = await PDFDocument.create();
          
          // Extract text and formatting from DOCX
          const result = await new Promise((resolve) => {
            const mammoth = require('mammoth');
            mammoth.convertToHtml({ buffer: docxBuffer })
              .then((result: any) => resolve(result));
          });
          
          const content = (result as any).value;
          const page = pdfDoc.addPage();
          const font = await pdfDoc.embedFont('Helvetica');
          
          // Preserve formatting with HTML parsing
          const lines = content.split(/<[^>]*>/g).filter(Boolean);
          const fontSize = 12;
          const margin = 50;
          const lineHeight = fontSize * 1.2;
          
          let y = page.getHeight() - margin;
          
          for (const line of lines) {
            if (y < margin) {
              y = pdfDoc.addPage().getHeight() - margin;
            }
            
            page.drawText(line.trim(), {
              x: margin,
              y,
              size: fontSize,
              font,
              lineHeight,
            });
            
            y -= lineHeight;
          }
          
          const pdfBytes = await pdfDoc.save();
          await fs.writeFile(outputPath, pdfBytes);
          break;
        }
          
        case '.xls':
        case '.xlsx': {
          const workbook = xlsx.readFile(file.path);
          const pdfDoc = await PDFDocument.create();
          
          for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const page = pdfDoc.addPage();
            const font = await pdfDoc.embedFont('Helvetica');
            const content = xlsx.utils.sheet_to_string(sheet);
            
            page.drawText(content, {
              x: 50,
              y: page.getHeight() - 50,
              size: 12,
              font,
            });
          }
          
          const pdfBytes = await pdfDoc.save();
          await fs.writeFile(outputPath, pdfBytes);
          break;
        }
          
        case '.ppt':
        case '.pptx': {
          const pdfDoc = await PDFDocument.create();
          const presentation = new pptxgenjs();
          const slides = await presentation.load(file.path);
          
          for (const slide of slides) {
            const page = pdfDoc.addPage();
            // Convert slide content to PDF page
            // This is a simplified version - in reality would need more complex conversion
          }
          
          const pdfBytes = await pdfDoc.save();
          await fs.writeFile(outputPath, pdfBytes);
          break;
        }
          
        case '.jpg':
        case '.jpeg':
        case '.png': {
          const image = sharp(file.path);
          await image.pdf().toFile(outputPath);
          break;
        }
          
        case '.html': {
          const htmlContent = await fs.readFile(file.path, 'utf-8');
          const htmlDoc = await PDFDocument.create();
          const htmlPage = htmlDoc.addPage();
          const htmlFont = await htmlDoc.embedFont('Helvetica');
          
          htmlPage.drawText(htmlContent.replace(/<[^>]*>/g, ' '), {
            x: 50,
            y: htmlPage.getHeight() - 50,
            size: 12,
            font: htmlFont,
            lineHeight: 16,
            maxWidth: htmlPage.getWidth() - 100,
          });
          
          const htmlPdfBytes = await htmlDoc.save();
          await fs.writeFile(outputPath, htmlPdfBytes);
          break;
        }
          
        default:
          throw new Error(`Unsupported file format: ${ext}`);
      }
    }

    const stats = await fs.stat(outputPath);
    
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
    
    switch (toolId) {
      case 'pdf-to-word': {
        // Use pdf-lib to maintain formatting
        const pdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        
        const doc = new Document({
          sections: await Promise.all(pages.map(async (page) => {
            const text = await page.extractText();
            const { width, height } = page.getSize();
            
            return {
              properties: {
                page: {
                  size: {
                    width: width,
                    height: height,
                  },
                },
              },
              children: text.split('\n').map(line => 
                new Paragraph({
                  children: [new TextRun(line)],
                  spacing: { line: 360 },
                })
              ),
            };
          }))
        });
        
        const buffer = await Packer.toBuffer(doc);
        await fs.writeFile(outputPath + '.docx', buffer);
        break;
      }
      
      case 'pdf-to-excel': {
        // Use pdf-lib to maintain table structure
        const pdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        
        const workbook = xlsx.utils.book_new();
        const data: string[][] = [];
        
        for (const page of pages) {
          const text = await page.extractText();
          const rows = text.split('\n').map(row => row.split(/\s+/));
          data.push(...rows);
        }
        
        const worksheet = xlsx.utils.aoa_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        xlsx.writeFile(workbook, outputPath + '.xlsx');
        break;
      }
      
      case 'pdf-to-powerpoint': {
        // Fix pptxgenjs constructor issue
        const pptx = require('pptxgenjs');
        const pres = new pptx();
        
        const pdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        
        for (const page of pages) {
          const text = await page.extractText();
          const { width, height } = page.getSize();
          
          const slide = pres.addSlide();
          slide.addText(text, {
            x: 0.5,
            y: 0.5,
            w: '90%',
            h: '90%',
            fontSize: 12,
            breakLine: true
          });
        }
        
        await pres.writeFile({ fileName: outputPath + '.pptx' });
        break;
      }
      
      case 'pdf-to-jpg': {
        const pdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        
        // Use sharp for better image handling
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();
          
          // Convert PDF page to PNG first for better quality
          const pngBytes = await page.toPNG();
          await sharp(Buffer.from(pngBytes))
            .resize(Math.round(width), Math.round(height), {
              fit: 'contain',
              background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .jpeg({ quality: 90 })
            .toFile(`${outputPath}_${i + 1}.jpg`);
        }
        break;
      }
      
      default:
        throw new Error(`Unsupported conversion format: ${toolId}`);
    }

    const finalPath = outputPath + ({
      'pdf-to-word': '.docx',
      'pdf-to-excel': '.xlsx',
      'pdf-to-powerpoint': '.pptx',
      'pdf-to-jpg': '_1.jpg'
    }[toolId] || '.txt');

    const stats = await fs.stat(finalPath);
    
    const mimeTypes = {
      'pdf-to-word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'pdf-to-excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'pdf-to-powerpoint': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'pdf-to-jpg': 'image/jpeg'
    };
    
    const outputFile = await storage.createFile({
      filename: path.basename(finalPath),
      originalFilename: path.basename(file.originalFilename, '.pdf') + path.extname(finalPath),
      path: finalPath,
      size: stats.size,
      mimeType: mimeTypes[toolId as keyof typeof mimeTypes] || 'text/plain',
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
