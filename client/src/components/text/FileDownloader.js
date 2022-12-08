import React from 'react';
import downloadIcon from './downloadIcon.png'

const FileDownloader = ({ fileUrl, fileName }) => {
  const handleDownload = () => {
    // Fetch the file from the server
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a new anchor element
        const a = document.createElement('a');

        // Set the href and download attributes for the anchor element
        a.href = url;
        a.download = fileName;

        // Append the anchor element to the document
        document.body.appendChild(a);

        // Click the anchor element to initiate the download
        a.click();

        // Remove the anchor element from the document
        document.body.removeChild(a);

        // Revoke the blob URL
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div>
      <img src={downloadIcon} onClick={handleDownload}/>
    </div>
  );
};

export default FileDownloader;