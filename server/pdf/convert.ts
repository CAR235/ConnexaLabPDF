
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

    const fileContent = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(fileContent);
    const pages = pdfDoc.getPages();
    
    let outputFileName: string;
    let outputPath: string;
    let outputContent: Buffer;

    switch (toolId) {
      case 'pdf-to-jpg':
        // Convert first page to JPG
        const page = pages[0];
        const canvas = createCanvas(page.getWidth(), page.getHeight());
        const ctx = canvas.getContext('2d');
        
        // Draw PDF page to canvas (simplified version)
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, page.getWidth(), page.getHeight());
        
        outputFileName = `${path.basename(file.originalFilename, '.pdf')}_${uuidv4()}.jpg`;
        outputPath = path.join(process.cwd(), 'uploads', outputFileName);
        outputContent = canvas.toBuffer('image/jpeg');
        await fs.writeFile(outputPath, outputContent);
        break;

      case 'pdf-to-word':
        // Create a Word document
        const docx = officegen('docx');
        
        // Extract text content from each page
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();
          
          // Create a paragraph for page header
          const headerPara = docx.createP();
          headerPara.addText(`Page ${i + 1}`, { bold: true, font_size: 14 });
          
          // Get page text content
          const textContent = await page.getTextContent();
          const textItems = textContent.items
            .map(item => ('str' in item ? item.str : ''))
            .join(' ');
          
          // Add content paragraph
          const contentPara = docx.createP();
          contentPara.addText(textItems || 'No text content found');
          
          // Add page break except for last page
          if (i < pages.length - 1) {
            docx.createP().addLineBreak();
          }
        }
        
        outputFileName = `${path.basename(file.originalFilename, '.pdf')}_${uuidv4()}.docx`;
        outputPath = path.join(process.cwd(), 'uploads', outputFileName);
        
        const docxStream = fs.createWriteStream(outputPath);
        await new Promise((resolve, reject) => {
          docx.generate(docxStream, {
            'finalize': resolve,
            'error': reject
          });
        });
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
