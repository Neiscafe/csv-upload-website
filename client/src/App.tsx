import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CsvUploader from './Csv-uploader';
import { PRArray } from './model/PRArray';
import { ProductRequest } from './model/ProductRequest';
import ResponseBox from './Response-box';
import { ServerResponse } from './model/server-response';
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
		<Container>
			<Row>
				<Col>
					<h1>Upload de CSV</h1>
					<CsvUploader onUpload={handleUpload} />
				</Col>
			</Row>
			<Row>
				<Col>
					<Button disabled={buttonDisabled} className='bUpdate' onClick={onFinish}>Atualizar</Button>
					<h2>Resposta do Back-end</h2>
					<div>
						<ResponseBox response={responseMessage} />
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default App;
