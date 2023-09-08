import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CsvUploader from './Csv-uploader';
import { PRArray } from './model/PRArray';
import { ProductRequest } from './model/ProductRequest';
const strOffset = 24;

const App: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const[responseType, setResponseType] = useState<string>("");
  const[responseBody, setResponseBody] = useState<string>("");

  const handleUpload = async (file: File) => {
    try {
      let b = await file.text();
      b = b.slice(strOffset);
      console.log("formData ", b);
      const c = b.split("\r\n");
      console.log(c);
      let pList = new PRArray();
      let args: string[];
      for (let i = 0; i < c.length; i++){
        args = c[i].split(",");
        pList.add(new ProductRequest(args));
      }
      console.log(JSON.stringify(pList.array));
      const response = await fetch('http://localhost:3000/update/', {
        method: 'POST',
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: JSON.stringify(pList.array),
      });

      if (response.ok) {
        const data = await response.text();
        setResponse(data);
      }else{
        setResponseType("Error!");
        const data = await response.text();
        setResponseBody(data)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFinish = async ()=>{
    try{

    }catch(error){
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Upload de CSV</h1>
          <CsvUploader onUpload={handleUpload} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={onFinish}>Atualizar</Button>
          <h2>Resposta do Back-end</h2>
          <div>
            <h1>{responseType}</h1>
            <h2>{responseBody}</h2>
          </div>
          <pre>{response}</pre>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
