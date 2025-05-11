import { PDFDocument, degrees } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File, CompressPdfOptions, PageNumberOptions } from '@shared/schema';
import { storage } from '../storage';

// Compress a PDF file
export async function compressPdf(file: File, options?: CompressPdfOptions): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // In a real implementation, this would apply compression settings
    // For now, we'll just resave the PDF which might apply some basic compression
    
    const outputFileName = `compressed_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF with compression settings
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `compressed_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        compressionLevel: options?.quality || 'medium',
        originalSize: file.size,
        compressedSize: pdfBytes.length,
        compressionRatio: file.size > 0 ? pdfBytes.length / file.size : 1
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw error;
  }
}

// Rotate pages in a PDF
export async function rotatePdf(file: File, options: { pages?: number[], angle?: number }): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // Get all page indices if not specified
    const pageIndices = options.pages || Array.from(
      { length: pdfDoc.getPageCount() }, 
      (_, i) => i
    );
    
    // Default rotation angle is 90 degrees clockwise
    const rotationAngle = options.angle || 90;
    
    // Rotate each specified page
    for (const pageIndex of pageIndices) {
      if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
        const page = pdfDoc.getPage(pageIndex);
        page.setRotation(degrees(rotationAngle));
      }
    }
    
    const outputFileName = `rotated_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `rotated_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        rotatedPages: pageIndices,
        rotationAngle: rotationAngle
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error rotating PDF pages:', error);
    throw error;
  }
}

// Add page numbers to a PDF
export async function addPageNumbers(file: File, options?: PageNumberOptions): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // In a real implementation, this would add page numbers to each page
    // For now, we'll just save the original PDF
    
    const outputFileName = `numbered_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `numbered_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        pageNumberOptions: options
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error adding page numbers to PDF:', error);
    throw error;
  }
}

// Remove pages from a PDF
export async function removePages(file: File, options: { pagesToRemove: number[] }): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // Get the total number of pages
    const pageCount = pdfDoc.getPageCount();
    
    // Sort the pages to remove in descending order
    // This ensures we remove pages from back to front to avoid index shifting
    const pagesToRemove = [...options.pagesToRemove].sort((a, b) => b - a);
    
    // Remove the specified pages
    for (const pageIndex of pagesToRemove) {
      if (pageIndex >= 0 && pageIndex < pageCount) {
        pdfDoc.removePage(pageIndex);
      }
    }
    
    const outputFileName = `edited_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `edited_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        removedPages: options.pagesToRemove,
        originalPageCount: pageCount,
        newPageCount: pdfDoc.getPageCount()
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error removing pages from PDF:', error);
    throw error;
  }
}

// Extract pages from a PDF
export async function extractPages(file: File, options: { pagesToExtract: number[] }): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const srcPdfDoc = await PDFDocument.load(fileBuffer);
    
    // Create a new PDF document for the extracted pages
    const extractedPdf = await PDFDocument.create();
    
    // Copy the specified pages to the new document
    for (const pageIndex of options.pagesToExtract) {
      if (pageIndex >= 0 && pageIndex < srcPdfDoc.getPageCount()) {
        const [copiedPage] = await extractedPdf.copyPages(srcPdfDoc, [pageIndex]);
        extractedPdf.addPage(copiedPage);
      }
    }
    
    const outputFileName = `extracted_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF
    const pdfBytes = await extractedPdf.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `extracted_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        extractedPages: options.pagesToExtract,
        pageCount: extractedPdf.getPageCount()
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error extracting pages from PDF:', error);
    throw error;
  }
}

// Repair a corrupted PDF
export async function repairPdf(file: File): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // In a real implementation, this would use specialized repair tools
    // For simplicity, we'll try to load and save it with pdf-lib which might fix some issues
    
    try {
      // Attempt to load and parse the PDF
      const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      
      const outputFileName = `repaired_${uuidv4()}.pdf`;
      const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      // Create a file entry
      const outputFile = await storage.createFile({
        filename: outputFileName,
        originalFilename: `repaired_${path.basename(file.originalFilename)}`,
        path: outputPath,
        size: pdfBytes.length,
        mimeType: 'application/pdf',
        userId: file.userId,
        metadata: {
          sourceFile: file.id,
          repaired: true
        }
      });
      
      return outputFile;
    } catch (parseError) {
      throw new Error(`Failed to repair PDF: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error repairing PDF:', error);
    throw error;
  }
}
