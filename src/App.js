import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload from './FileUpload';
import PDFViewer from './PDFViewer';
import './App.css';

const App = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileDrop = async (files) => {
    const uploadedFiles = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      uploadedFiles.push({ name: file.name, data: arrayBuffer });
    }
    setPdfFiles(uploadedFiles);
    if (uploadedFiles.length > 0) {
      setPdfFile(URL.createObjectURL(files[0]));
      setPdfBytes(uploadedFiles[0].data);
    }
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please upload at least two PDFs to merge.');
      return;
    }

    const fileNames = pdfFiles.map((file, index) => `${index + 1}: ${file.name}`).join('\n');
    const orderInput = prompt(`Enter the order of PDFs to merge by their numbers:\n${fileNames}`);
    const order = orderInput.split(',').map(num => parseInt(num.trim()) - 1);

    const mergedPdf = await PDFDocument.create();

    for (const index of order) {
      const file = pdfFiles[index];
      const pdf = await PDFDocument.load(file.data);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    downloadPdf(mergedBytes, 'merged.pdf');
  };

  const splitPDF = async () => {
    const input = prompt('Enter page ranges to split (e.g., "1-3,4-6"):');
    const ranges = input.split(',').map(range => {
      const [start, end] = range.split('-').map(num => parseInt(num.trim()) - 1);
      return { start, end };
    });

    const pdfDoc = await PDFDocument.load(pdfBytes);

    for (let i = 0; i < ranges.length; i++) {
      const { start, end } = ranges[i];
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, Array.from({ length: end - start + 1 }, (_, j) => start + j));
      pages.forEach((page) => newPdf.addPage(page));
      const splitBytes = await newPdf.save();
      downloadPdf(splitBytes, `split_part_${i + 1}.pdf`);
    }
  };

  const deletePages = async () => {
    const input = prompt('Enter the page numbers to delete (comma-separated, 1-indexed):');
    const pageNumbers = input.split(',').map(num => parseInt(num.trim()) - 1);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pageNumbers.reverse().forEach((pageIndex) => pdfDoc.removePage(pageIndex));
    const editedBytes = await pdfDoc.save();
    downloadPdf(editedBytes, 'edited.pdf');
  };

  const downloadPdf = (pdfBytes, defaultFilename) => {
    const filename = prompt('Enter the filename for the downloaded PDF:', defaultFilename);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>PDF Editor</h1>
      <FileUpload onDrop={handleFileDrop} />
      {pdfFiles.length > 0 && {pdfFile} && (
        <div>
          <button onClick={mergePDFs}>Merge PDFs</button>
          <button onClick={splitPDF}>Split PDF</button>
          <button onClick={deletePages}>Delete Pages</button>
          <PDFViewer file={pdfFile} />
        </div>
        
      )}
    </div>
  );
};

export default App;
