// FileUpload.js
import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf' : ['.pdf'],
    },
    onDrop,
  });

  return (
    <div className='home'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag & drop a PDF file here, or click to select one</p>
      </div>
      <div className='info'>
          <div className='topic'>
            <h3>Merge PDFs</h3>
            <p>Merge 2 or more PDFs together in any order you desire.</p>
          </div>
          <hr></hr>
          <div className='topic'>
            <h3>Split PDFs</h3>
            <p>Split a PDF into 2 or more PDFs specifying the page range for each PDF.</p>
          </div>
          <hr></hr>
          <div className='topic'>
            <h3>Delete Pages</h3>
            <p>Delete certain pages from your PDF as per your choice.</p>
          </div>
          <hr></hr>
          <div className='topic'>
            <h3>Convert to Text File</h3>
            <p>Convert your PDF into a Text File.</p>
          </div>
          <hr></hr>
          <div className='topic end'>
            <h3>Convert to Images</h3>
            <p>Convert every page of your PDF into an image.</p>
          </div>
      </div>
    </div>
  );
};

export default FileUpload;
