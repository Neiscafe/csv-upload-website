// import React from "react";
import { Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import { ServerResponse } from "./model/server-response";
import { FC } from "react";

interface ServerResponseProps {
	response: ServerResponse;
}

export const ResponseBox: FC<ServerResponseProps> = ({ response }) => {
	return (
		<div>
			<ListGroup>
				{response.validationStatus.map((message, index) => (
					<ListGroupItem key={index}>
						<Card>
							<Card.Body>
								<Card.Title>{message.message}</Card.Title>
								{message.type === "Success" ? (
									<Button variant="success">Sucesso</Button>
								) : (
									<Button variant="danger">Erro</Button>
								)}
							</Card.Body>
						</Card>
					</ListGroupItem>
				))}
			</ListGroup>
		</div>
	);
};

export default ResponseBox;