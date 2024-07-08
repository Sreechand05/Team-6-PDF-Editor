import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';
//import { Document as DocxDocument, Packer, Paragraph } from 'docx';
import FileUpload from './FileUpload';
import PDFViewer from './PDFViewer';
import './App.css';

const App = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [filesUploaded, setFilesUploaded] = useState(false);

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
      setFilesUploaded(true);
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

  const convertToText = async () => {
    const pdfDoc = await getDocument({ data: pdfBytes.slice(0) }).promise;
    const numPages = pdfDoc.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    const blob = new Blob([fullText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToImages = async () => {
    const pdfDoc = await getDocument({ data: pdfBytes.slice(0) }).promise;
    const numPages = pdfDoc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const link = document.createElement('a');
      link.href = URL.createObjectURL(imageBlob);
      link.download = `page_${pageNum}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /*const convertToDocx = async () => {
    const pdfDoc = await getDocument({ data: pdfBytes.slice(0) }).promise;
    const numPages = pdfDoc.numPages;
    const doc = new DocxDocument();

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      doc.addSection({
        children: [new Paragraph(pageText)],
      });
    }

    const docBlob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(docBlob);
    link.download = 'converted.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };*/

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
    <div className='body'>
      <div className="nav"><h1>PDF Editor</h1></div>
      {!filesUploaded && <FileUpload onDrop={handleFileDrop} />}
      {filesUploaded && (
        <div className='PDF'>
          <PDFViewer file={pdfFile} className='view' />
          <div className='button'>
            <button onClick={mergePDFs}>Merge PDFs</button>
            <button onClick={splitPDF}>Split PDF</button>
            <button onClick={deletePages}>Delete Pages</button>
            <button onClick={convertToText}>Convert to Text</button>
            <button onClick={convertToImages}>Convert to Images</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
