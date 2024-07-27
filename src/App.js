import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';
import FileUpload from './FileUpload';
import PDFViewer from './PDFViewer';
import './Bootstrap/css/bootstrap.min.css';
import './App.css';
import Dropdown from 'react-bootstrap/Dropdown';

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

  const logoClicked = async () => {
    setFilesUploaded(false);
    setPdfFile(null);
  }

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please upload at least two PDFs to merge.');
      return;
    }

    const fileNames = pdfFiles.map((file, index) => `${index + 1}: ${file.name}`).join('\n');
    const orderInput = prompt(`Enter the order of PDFs to merge by their numbers:\n${fileNames}`);
    if (!orderInput) {
      return;
    }
    const order = orderInput.split(',').map(num => parseInt(num.trim()) - 1);
    if (order.some(isNaN) || order.length !== pdfFiles.length) {
      alert('Invalid order. Please specify the correct order of all PDFs.');
      return;
    }
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
    if (!input) {
      return;
    }
    const ranges = input.split(',').map(range => {
      const [start, end] = range.split('-').map(num => parseInt(num.trim()) - 1);
      return { start, end };
    });
    if (ranges.some(range => isNaN(range.start) || isNaN(range.end))) {
      alert('Invalid range. Please enter valid page numbers.');
      return;
    }

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
    if (!input) {
      return;
    }
    const pageNumbers = input.split(',').map(num => parseInt(num.trim()) - 1);
    if (pageNumbers.some(isNaN)) {
      alert('Invalid page numbers. Please enter valid numbers.');
      return;
    }
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

      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpg'));
      const link = document.createElement('a');
      link.href = URL.createObjectURL(imageBlob);
      link.download = `page_${pageNum}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
    <div className='body'>
      <nav className="navb">
        <div className="logo">
          <img src="./pdf.png" alt="Logo" onClick={logoClicked} />
          <h1 onClick={logoClicked}>PDF Editor</h1>
          <span>Free-to-use Online PDF Editor</span>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Features Offered
          </Dropdown.Toggle>
          <Dropdown.Menu className='menu'>
            <Dropdown.Item disabled>Merge PDFs</Dropdown.Item>
            <Dropdown.Item disabled>Split PDF</Dropdown.Item>
            <Dropdown.Item disabled>Delete Pages</Dropdown.Item>
            <Dropdown.Item disabled>Convert to Text</Dropdown.Item>
            <Dropdown.Item disabled>Convert to JPG</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </nav>
      <div className='content-container'>
        <div className="pdf-viewer">
          {!filesUploaded && <FileUpload onDrop={handleFileDrop} />}
          {pdfFile && <PDFViewer file={pdfFile} />}
        </div>
        {filesUploaded && (
          <div className='button'>
            <button onClick={mergePDFs} id='merge'>Merge PDFs</button>
            <button onClick={splitPDF} id='split'>Split PDF</button>
            <button onClick={deletePages} id='delete'>Delete Pages</button>
            <button onClick={convertToText} id='txt'>Convert to Text</button>
            <button onClick={convertToImages} id='img'>Convert to JPG</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
