// PDFViewer.js
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewer = ({ file }) => (
  <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
    <div style={{ height: '750px' }}>
      <Viewer fileUrl={file} />
    </div>
  </Worker>
);

export default PDFViewer;
