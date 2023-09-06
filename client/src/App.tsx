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

const App: React.FC = () => {
  const [response, setResponse] = useState<string>('');

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('http://localhost:3000/update', {
        method: 'POST',
        body: formData,
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
