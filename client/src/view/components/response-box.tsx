// import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { ServerResponse } from "../../model/server-response";
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
                                {message.type === "Success" ? (
                                    <h3>Sucesso</h3>
                                ) : (
                                    <h3>Erro</h3>
                                )}
                                <Card.Title>{message.message}</Card.Title>
                            </Card.Body>
                        </Card>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </div>
    );
};

export default ResponseBox;