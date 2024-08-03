# Team-6-PDF-Editor

An online PDF editor created by members of Team 6 for IITISoC 2024.
A web application for editing PDF files using React.js. This tool allows users to merge, split, delete pages, and convert PDFs to various formats.

## Features

- **Merge PDFs:** Combine multiple PDF files into one.
- **Split PDF:** Divide a PDF into multiple parts by specifying page ranges.
- **Delete Pages:** Remove specific pages from a PDF.
- **Convert to Text:** Extract text content from a PDF.
- **Convert to Images:** Convert PDF pages into JPEG images.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sreechand05/Team-6-PDF-Editor.git
   cd Team-6-PDF-Editor
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Access the application:**

   Open your browser and go to **'http://localhost:3000'**.

## Usage

1. **Upload PDF:** Use the drag-and-drop area to upload PDF files.
2. **Merge PDFs:** Click "Merge PDFs" and specify the order of PDFs.
3. **Split PDF:** Click "Split PDF" and enter page ranges.
4. **Delete Pages:** Click "Delete Pages" and specify page numbers.
5. **Convert to Text:** Extract text by clicking "Convert to Text".
6. **Convert to Images:** Convert pages to images with "Convert to Images".

## Error Handling

- Invalid inputs and canceled operations are handled with alerts.
- Ensure page numbers and ranges are correctly specified to avoid errors.

## Technologies Used

- **React.js:** Front-end library for building user interfaces.
- **pdf-lib:** Library for PDF manipulation.
- **pdfjs-dist:** PDF.js distribution for rendering PDFs.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

## Acknowledgments

Thanks to the developers of [pdf-lib](https://pdf-lib.js.org/) and [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) for their amazing libraries.
