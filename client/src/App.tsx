// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Container, Row, Col } from 'react-bootstrap';
// import CsvUploader from './Csv-uploader';

// const App: React.FC = () => {
//   const [response, setResponse] = useState<string>('');

//   return (
//     <Container>
//       <Row>
//         <Col>
//           <h1>Upload de CSV</h1>
//           <CsvUploader/>
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           <h2>Resposta do Back-end</h2>
//           <pre>{response}</pre>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CsvUploader from './Csv-uploader';
import { PRArray } from './model/PRArray';
import { ProductRequest } from './model/ProductRequest';
const strOffset = 24;

const App: React.FC = () => {
  const [response, setResponse] = useState<string>('');

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
      console.log(pList.array);
      const response = await fetch('http://localhost:3000/update/', {
        method: 'POST',
        body: JSON.stringify(pList.array)
      });

      if (response.ok) {
        const data = await response.text();
        setResponse(data);
      } else {
        throw new Error('Erro ao enviar o arquivo CSV.');
      }
    } catch (error) {
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
          <h2>Resposta do Back-end</h2>
          <pre>{response}</pre>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
