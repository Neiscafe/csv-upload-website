import React, { useState } from 'react';
import { Container, Button, Col } from 'react-bootstrap';
import CsvUploader from './csv-uploader';
import { PRArray } from '../../model/PRArray';
import { ProductRequest } from '../../model/ProductRequest';
import ResponseBox from './response-box';
import { ServerResponse } from '../../model/server-response';
import '../styles/app.css';

const strOffset = 24;

const App: React.FC = () => {
    const [responseMessage, setResponseMessage] = useState<ServerResponse>(new ServerResponse([]));
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

    const handleUpload = async (file: File) => {
        try {
            let b = await file.text();
            b = b.slice(strOffset);
            const c = b.split("\r\n");
            let pList = new PRArray();
            let args: string[];
            for (let i = 0; i < c.length; i++) {
                args = c[i].split(",");
                pList.add(new ProductRequest(args));
            }
            const response = await fetch('http://localhost:3000/validate/', {
                method: 'POST',
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(pList.array),
            });
            const data = await response.text();
            buttonState(JSON.parse(data));
        } catch (error) {
            console.log(error);
            setButtonDisabled(true);
        }

        function buttonState(data: ServerResponse) {
            if (data.validationStatus[0].type != "Success") {
                console.log("TRUE " + JSON.stringify(data));
                setButtonDisabled(true);
            } else {
                console.log("FALSE " + JSON.stringify(data));
                setButtonDisabled(false);
            }
            setResponseMessage(data);
        }
    };

    const onFinish = async () => {
        try {
            const response = await fetch('http://localhost:3000/update/', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.text();
                setResponseMessage(JSON.parse(data));
            } else {
                const data = await response.text();
                setResponseMessage(JSON.parse(data));
            }
        } catch (error) {
            // setResponseBody("Uknown Error ocurred!")
        }
    };

    return (
        <div>
            <div className='header'>
                <img className='header_image' src='../common/placeholder_company_logo.jpg' alt='Company Logo'></img>
                <h2>Upload de CSV</h2>
            </div>
            <Container className='page'>
                <Col>
                    <div className='uploader-div'>
                        <CsvUploader validateFile={handleUpload} />
                    </div>
                    <div className='buttons-div'>
                        <Button className='b-update' variant='warning' disabled={buttonDisabled} onClick={onFinish}>Atualizar</Button>
                    </div>
                    <div className='responses-div'>
                        <ResponseBox response={responseMessage} />
                    </div>
                </Col>
            </Container>
        </div>
    );
};

export default App;
