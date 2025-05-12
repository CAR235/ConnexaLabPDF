
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File } from '@shared/schema';
import { storage } from '../storage';
import sharp from 'sharp';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as pdf2json from 'pdf2json';

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
          // Create a new PDF document
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          const font = await pdfDoc.embedFont('Helvetica');
          
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
            });
          }
          
          // Save the PDF
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
    
    switch (toolId) {
      case 'pdf-to-word': {
        // Convert PDF to text using pdf2json
        const pdfParser = new pdf2json.default();
        const pdfData = await new Promise((resolve, reject) => {
          pdfParser.loadPDF(file.path);
          pdfParser.on('pdfParser_dataReady', (data) => resolve(data));
          pdfParser.on('pdfParser_dataError', (err) => reject(err));
        });
        
        // Extract text from PDF
        let content = '';
        for (const page of (pdfData as any).Pages) {
          for (const text of page.Texts) {
            content += decodeURIComponent(text.R[0].T) + ' ';
          }
          content += '\n\n';
        }
        
        // Create Word document
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
        
        // Save as DOCX
        const buffer = await Packer.toBuffer(doc);
        await fs.writeFile(outputPath + '.docx', buffer);
        break;
      }
      
      case 'pdf-to-text': {
        const pdfDoc = await PDFDocument.load(await fs.readFile(file.path));
        let text = '';
        
        // Extract text from PDF using pdf-lib
        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();
          text += `Page ${i + 1}\n\n`;
          
          // Basic text extraction (page content)
          const content = await page.getTextContent();
          if (content) {
            text += content + '\n\n';
          }
        }
        
        await fs.writeFile(outputPath + '.txt', text);
        break;
      }
      
      default:
        throw new Error(`Unsupported conversion format: ${toolId}`);
    }

    const finalPath = outputPath + (toolId === 'pdf-to-word' ? '.docx' : '.txt');
    const stats = await fs.stat(finalPath);
    
    const outputFile = await storage.createFile({
      filename: path.basename(finalPath),
      originalFilename: path.basename(file.originalFilename, '.pdf') + (toolId === 'pdf-to-word' ? '.docx' : '.txt'),
      path: finalPath,
      size: stats.size,
      mimeType: toolId === 'pdf-to-word' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain',
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
