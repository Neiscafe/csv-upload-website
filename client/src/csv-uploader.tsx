import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

interface CsvUploaderProps {
  onUpload: (file: File) => void;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div>
      <form>
        <input
          type='file'
          id="csvFile"
          onChange={handleFileChange}
          accept=".csv"
        />
      </form>
      <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>
        Enviar CSV
      </Button>
    </div>
  );
};

export default CsvUploader;