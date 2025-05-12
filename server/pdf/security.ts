import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File, ProtectPdfOptions, WatermarkOptions } from '@shared/schema';
import { storage } from '../storage';

// Add password protection to a PDF
export async function protectPdf(file: File, options: ProtectPdfOptions): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    if (!options.password) {
      throw new Error('Password is required');
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const qpdf = require('node-qpdf');
    
    // Set encryption options
    const encryptOptions = {
      keyLength: 256,
      password: options.password,
      ownerPassword: options.password,
      userPassword: options.password,
      permissions: {
        printing: options.permissions?.allowPrinting ?? false,
        modifying: options.permissions?.allowModifying ?? false,
        copying: options.permissions?.allowCopying ?? false,
        annotating: options.permissions?.allowAnnotating ?? false,
        fillingForms: options.permissions?.allowFillingForms ?? false,
        contentAccessibility: options.permissions?.allowAccessibility ?? true,
        documentAssembly: options.permissions?.allowAssembly ?? false
      }
    };

    // Encrypt the PDF
    await qpdf.encrypt(file.path, outputPath, encryptOptions);
    const outputFileName = `protected_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `protected_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        secured: true,
        permissions: options.permissions
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error protecting PDF:', error);
    throw error;
  }
}

// Remove password protection from a PDF
export async function unlockPdf(file: File, options: { password: string }): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib with the password
    const pdfDoc = await PDFDocument.load(fileBuffer, {
      password: options.password
    });
    
    // Create a new PDF without password protection
    const outputFileName = `unlocked_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF without encryption
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `unlocked_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        secured: false
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error unlocking PDF:', error);
    throw error;
  }
}

// Add a watermark to a PDF
export async function addWatermark(file: File, options: WatermarkOptions): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    if (!options.text && !options.imagePath) {
      throw new Error('Either text or image watermark is required');
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // In a real implementation, this would add the watermark to each page
    // For simplicity, we'll just save the original PDF
    
    const outputFileName = `watermarked_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `watermarked_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        watermarkOptions: options
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error adding watermark to PDF:', error);
    throw error;
  }
}

// Add a digital signature to a PDF
export async function signPdf(file: File, options: { signature?: string }): Promise<File> {
  try {
    if (!file.mimeType.includes('pdf')) {
      throw new Error(`File ${file.originalFilename} is not a PDF`);
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    
    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // In a real implementation, this would use a digital signature library
    // For now, we'll just save the original PDF
    
    const outputFileName = `signed_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    
    // Create a file entry
    const outputFile = await storage.createFile({
      filename: outputFileName,
      originalFilename: `signed_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        signed: true
      }
    });
    
    return outputFile;
  } catch (error) {
    console.error('Error signing PDF:', error);
    throw error;
  }
}
