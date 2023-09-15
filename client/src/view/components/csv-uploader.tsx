import React, { useState } from 'react';
import '../styles/csv-uploader.css'
import { Button } from 'react-bootstrap';

interface CsvUploaderParams {
    validateFile: (file: File)=>void;
}

const CsvUploader: React.FC<CsvUploaderParams> = ({validateFile}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const fileIsValid = () => {
        if (selectedFile == null)
            return;
        validateFile(selectedFile);
    }

    return (
        <div className='body'>
            <form>
                <input
                    type='file'
                    id="csvFile"
                    onChange={handleFileChange}
                    accept=".csv"
                />
            </form>
            <Button className="bValidate" variant="danger" onClick={fileIsValid} disabled={!selectedFile}>
                Validar
            </Button>
        </div>
    );
};

export default CsvUploader;