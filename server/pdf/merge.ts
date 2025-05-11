import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MergePdfOptions, type File } from '@shared/schema';
import { storage } from '../storage';

export async function mergePdfs(files: File[], options?: MergePdfOptions): Promise<File> {
  try {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    
    // Sort files according to pageOrder if provided
    let filesToProcess = [...files];
    if (options?.pageOrder && options.pageOrder.length === files.length) {
      filesToProcess = options.pageOrder.map(index => files[index]);
    }
    
    // Loop through each input PDF file
    for (const file of filesToProcess) {
      // Make sure we're working with PDF files
      if (!file.mimeType.includes('pdf')) {
        throw new Error(`File ${file.originalFilename} is not a PDF`);
      }
      
      // Read the file
      const fileBuffer = await fs.readFile(file.path);
      
      // Load the PDF into pdf-lib
      const pdfDoc = await PDFDocument.load(fileBuffer);
      
      // Copy all pages from the source PDF to the merged PDF
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach(page => {
        mergedPdf.addPage(page);
      });
    }
    
    // Generate the merged PDF bytes
    const mergedPdfBytes = await mergedPdf.save();
    
    // Create a new output file name
    const outputFileName = `merged_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Write the merged PDF to disk
    await fs.writeFile(outputPath, mergedPdfBytes);
    
    // Create a new file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: 'merged.pdf',
      path: outputPath,
      size: mergedPdfBytes.length,
      mimeType: 'application/pdf',
      userId: files[0].userId, // Use the same user ID as the first file
      metadata: {
        sourceFiles: files.map(f => f.id),
        pageCount: mergedPdf.getPageCount()
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw error;
  }
}
