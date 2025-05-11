import { PDFDocument, degrees } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File, CompressPdfOptions, PageNumberOptions } from '@shared/schema';
import { storage } from '../storage';

export async function compressPdf(file: File, options?: CompressPdfOptions): Promise<File> {
  try {
    const fileBuffer = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(fileBuffer);

    // Basic compression by copying pages to a new document
    const compressedDoc = await PDFDocument.create();
    const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => compressedDoc.addPage(page));

    const outputFileName = `compressed_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    const pdfBytes = await compressedDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return await storage.createFile({
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
        compressedSize: pdfBytes.length
      }
    });
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw error;
  }
}

export async function rotatePdf(file: File, options: { pages: number[], angle: number }): Promise<File> {
  try {
    const fileBuffer = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(fileBuffer);

    const pageIndices = options.pages || pdfDoc.getPageIndices();
    const rotationAngle = options.angle || 90;

    for (const pageIndex of pageIndices) {
      if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
        const page = pdfDoc.getPage(pageIndex);
        page.setRotation(degrees(rotationAngle));
      }
    }

    const outputFileName = `rotated_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return await storage.createFile({
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
  } catch (error) {
    console.error('Error rotating PDF:', error);
    throw error;
  }
}

export async function extractPages(file: File, options: { pagesToExtract: number[] }): Promise<File> {
  try {
    const fileBuffer = await fs.readFile(file.path);
    const srcDoc = await PDFDocument.load(fileBuffer);
    const newDoc = await PDFDocument.create();

    const pages = await newDoc.copyPages(srcDoc, options.pagesToExtract);
    pages.forEach(page => newDoc.addPage(page));

    const outputFileName = `extracted_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    const pdfBytes = await newDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return await storage.createFile({
      filename: outputFileName,
      originalFilename: `extracted_${path.basename(file.originalFilename)}`,
      path: outputPath,
      size: pdfBytes.length,
      mimeType: 'application/pdf',
      userId: file.userId,
      metadata: {
        sourceFile: file.id,
        extractedPages: options.pagesToExtract,
        pageCount: newDoc.getPageCount()
      }
    });
  } catch (error) {
    console.error('Error extracting pages:', error);
    throw error;
  }
}

export async function repairPdf(file: File): Promise<File> {
  try {
    const fileBuffer = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

    const outputFileName = `repaired_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    return await storage.createFile({
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
  } catch (error) {
    console.error('Error repairing PDF:', error);
    throw error;
  }
}