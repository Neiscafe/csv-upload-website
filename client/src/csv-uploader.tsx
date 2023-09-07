// import React, { ChangeEvent, useState } from 'react';
// import Papa, {ParseResult} from 'papaparse';

// type Data={
//   product_code: number,
//   new_price: number,
// }
// type Values={
//   data: Data[],
// }

// function FileUploadSingle() {
//   const [file, setFile] = useState<File>();
//   let value: Values;

//   const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
//     const target = e.target as HTMLInputElement & {file: FileList}
//     e.preventDefault();
//   };
  
//   const handleUploadClick = () => {
//     if (!file) {
//       console.log("Falha!", file);
//       return;
//     }
//     console.log("Sucesso! ", file);
//     var data = Papa.parse(file, {
//       header: true,
//       download: true,
//       skipEmptyLines:true,
//       delimiter:",",
//       complete: (results: ParseResult<Data>)=>{
//         value = results
//       }
//     });
//     console.log(value)
//     // 👇 Uploading the file using the fetch API to the server
//     fetch('http://localhost:3000/update/', {
//       method: 'GET',
//       body: file,
//       // 👇 Set headers manually for single file upload
//       headers: {
//         'content-type': file.type,
//         'content-length': `${file.size}`, // 👈 Headers need to be a string
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => console.log(data))
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />

//       <div>{file && `${file.name} - ${file.type}`}</div>

//       <button onClick={handleUploadClick}>Upload</button>
//     </div>
//   );
// }

// export default FileUploadSingle;

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