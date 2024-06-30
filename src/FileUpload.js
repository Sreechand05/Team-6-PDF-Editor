// FileUpload.js
import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
        'pdf' : ['.pdf'],
    },
    onDrop,
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <p>Drag & drop a PDF file here, or click to select one</p>
    </div>
  );
};

export default FileUpload;
