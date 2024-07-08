// PDFViewer.js
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewer = ({ file }) => (
  <Worker workerUrl="/pdfjs/pdf.worker.min.js">
    <div style={{height: '560px', width: '44.5%', float:'left'}} className='view'>
      <Viewer fileUrl={file} />
    </div>
  </Worker>
);

export default PDFViewer;
