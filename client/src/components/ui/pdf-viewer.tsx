
import { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/webviewer';

interface PDFViewerProps {
  file: string | File;
}

export function PDFViewer({ file }: PDFViewerProps) {
  const viewer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewer.current) return;

    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: file instanceof File ? URL.createObjectURL(file) : file,
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;

      // Add any additional viewer configuration here
      documentViewer.addEventListener('documentLoaded', () => {
        console.log('Document loaded');
      });
    });
  }, [file]);

  return <div ref={viewer} style={{ height: '100vh' }}></div>;
}
