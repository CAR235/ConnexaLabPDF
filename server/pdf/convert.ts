
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
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          const font = await pdfDoc.embedFont('Helvetica');
          
          const content = await fs.readFile(file.path, 'utf-8');
          
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
              });
              
              line = word;
              y -= lineHeight;
              
              if (y < margin) {
                y = pdfDoc.addPage().getHeight() - margin;
              }
            } else {
              line = testLine;
            }
          }
          
          if (line) {
            page.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font,
            });
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
        const pdfParser = new pdf2json.default();
        const pdfData = await new Promise((resolve, reject) => {
          pdfParser.loadPDF(file.path);
          pdfParser.on('pdfParser_dataReady', (data) => resolve(data));
          pdfParser.on('pdfParser_dataError', (err) => reject(err));
        });
        
        let content = '';
        for (const page of (pdfData as any).Pages) {
          for (const text of page.Texts) {
            content += decodeURIComponent(text.R[0].T) + ' ';
          }
          content += '\n\n';
        }
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(content)],
              }),
            ],
          }],
        });
        
        const buffer = await Packer.toBuffer(doc);
        await fs.writeFile(outputPath + '.docx', buffer);
        break;
      }
      
      case 'pdf-to-excel': {
        const pdfParser = new pdf2json.default();
        const pdfData = await new Promise((resolve, reject) => {
          pdfParser.loadPDF(file.path);
          pdfParser.on('pdfParser_dataReady', (data) => resolve(data));
          pdfParser.on('pdfParser_dataError', (err) => reject(err));
        });
        
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet([[]]);
        
        let row = 0;
        for (const page of (pdfData as any).Pages) {
          for (const text of page.Texts) {
            xlsx.utils.sheet_add_aoa(worksheet, [[decodeURIComponent(text.R[0].T)]], { origin: { r: row++, c: 0 } });
          }
        }
        
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        xlsx.writeFile(workbook, outputPath + '.xlsx');
        break;
      }
      
      case 'pdf-to-powerpoint': {
        const pdfParser = new pdf2json.default();
        const pdfData = await new Promise((resolve, reject) => {
          pdfParser.loadPDF(file.path);
          pdfParser.on('pdfParser_dataReady', (data) => resolve(data));
          pdfParser.on('pdfParser_dataError', (err) => reject(err));
        });
        
        const pres = new pptxgenjs();
        
        for (const page of (pdfData as any).Pages) {
          const slide = pres.addSlide();
          let content = '';
          for (const text of page.Texts) {
            content += decodeURIComponent(text.R[0].T) + ' ';
          }
          slide.addText(content, { x: 0.5, y: 0.5, w: '90%', h: '90%' });
        }
        
        await pres.writeFile({ fileName: outputPath + '.pptx' });
        break;
      }
      
      case 'pdf-to-jpg': {
        const PDFNet = require('@pdftron/pdfnet-node');
        await PDFNet.initialize();
        
        await PDFNet.runWithCleanup(async () => {
          const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);
          const pageCount = await doc.getPageCount();
          
          for (let i = 1; i <= pageCount; i++) {
            const page = await doc.getPage(i);
            const pdfDraw = await PDFNet.PDFDraw.create(92);
            await pdfDraw.export(page, `${outputPath}_${i}.jpg`, 'JPEG');
          }
        });
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
