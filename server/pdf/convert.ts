import { PDFNet } from '@pdftron/pdfnet-node';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { type File } from '@shared/schema';
import { storage } from '../storage';

// Initialize PDFNet with your license key
const PDFTRON_LICENSE_KEY = 'demo:1630195943448:78e1a25a0300000000025e875de658e8e1f4b5a21b2dd75596e782d3d06';

// Convert various formats to PDF
export async function convertToPdf(files: File[], toolId: string): Promise<File> {
  try {
    await PDFNet.initialize(PDFTRON_LICENSE_KEY);

    const outputFileName = `converted_${uuidv4()}.pdf`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    await PDFNet.runWithCleanup(async () => {
      const doc = await PDFNet.PDFDoc.create();

      for (const file of files) {
        const fileContent = await fs.readFile(file.path);
        await doc.pageFromStream(await PDFNet.Filter.createFromMemory(fileContent));
      }

      await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    });

    const stats = await fs.stat(outputPath);
    return await storage.createFile({
      filename: outputFileName,
      originalFilename: `converted_${path.basename(files[0].originalFilename, path.extname(files[0].originalFilename))}.pdf`,
      path: outputPath,
      size: stats.size,
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

    await PDFNet.initialize(PDFTRON_LICENSE_KEY);

    const outputFileName = `${path.basename(file.originalFilename, '.pdf')}_${uuidv4()}.${toolId === 'pdf-to-word' ? 'docx' : 'jpg'}`;
    const outputPath = path.join(process.cwd(), 'uploads', outputFileName);

    await PDFNet.runWithCleanup(async () => {
      const doc = await PDFNet.PDFDoc.createFromFilePath(file.path);

      if (toolId === 'pdf-to-word') {
        const wordOptions = await PDFNet.Convert.WordOutputOptions.create();
        await PDFNet.Convert.toWord(doc, outputPath, wordOptions);
      } else if (toolId === 'pdf-to-jpg') {
        const pdfDraw = await PDFNet.PDFDraw.create(92);
        const page = await doc.getPage(1);
        await pdfDraw.export(page, outputPath);
      }
    }, PDFTRON_LICENSE_KEY);

    const stats = await fs.stat(outputPath);
    return await storage.createFile({
      filename: outputFileName,
      originalFilename: outputFileName,
      path: outputPath,
      size: stats.size,
      mimeType: toolId === 'pdf-to-word' ? 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 
        'image/jpeg',
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