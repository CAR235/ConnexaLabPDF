
import PDFNet from '@pdftron/pdfnet-node';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File } from '@shared/schema';
import { storage } from '../storage';

// Initialize PDFNet
PDFNet.initialize();

// Convert various formats to PDF
export async function convertToPdf(files: File[], toolId: string): Promise<File> {
  try {
    const outputFileName = `converted_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    await PDFNet.runWithCleanup(async () => {
      const doc = await PDFNet.PDFDoc.create();

      for (const file of files) {
        const fileContent = await fs.readFile(file.path);
        
        if (file.mimeType.includes('image')) {
          // Convert image to PDF
          const image = await PDFNet.Image.createFromMemory(doc, fileContent);
          const page = await doc.pageCreate();
          page.setMediaBox(0, 0, 612, 792);
          const builder = await PDFNet.ElementBuilder.create();
          const writer = await PDFNet.ElementWriter.create();
          writer.beginOnPage(page);
          const element = await builder.createImageFromMatrix(image, await PDFNet.Matrix2D.create(500, 0, 0, 500, 50, 50));
          writer.writePlacedElement(element);
          writer.end();
          doc.pagePushBack(page);
        } else if (file.mimeType.includes('word') || file.originalFilename.endsWith('.docx')) {
          // Convert Word to PDF using PDFTron
          const conv = await PDFNet.Convert.universalConversion(file.path, {
            pdftron_convert_options: {
              page_width: 612,
              page_height: 792,
            }
          });
          const wordDoc = await PDFNet.PDFDoc.createFromBuffer(conv);
          await doc.insertPages(doc.getPageCount(), wordDoc, 1, wordDoc.getPageCount(), PDFNet.PDFDoc.InsertFlag.e_none);
        }
      }

      await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    });
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
          
          // Get page content
          const operatorList = await page.getOperatorList();
          const textItems = operatorList.fnArray
            .map((fn, idx) => {
              if (fn === 121) { // ShowText operator
                return operatorList.argsArray[idx][0];
              }
              return '';
            })
            .filter(Boolean)
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
