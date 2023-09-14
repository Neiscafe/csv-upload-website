// import React from "react";
import { Button, Card, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { ServerResponse } from "./model/server-response";
import { FC } from "react";

interface ServerResponseProps{
  response: ServerResponse;
}

export const ResponseBox: FC<ServerResponseProps> = ({response}) => {
  console.log("messages: "+response);
  return (
    <div>
        {response.validationStatus.length > 0 ? (
        <ListGroup>
          {response.validationStatus.map((message, index) => (
            <ListGroupItem key={index}>
              <Card>
                <Card.Body>
                  <Card.Title>{message.message}</Card.Title>
                  {message.type === "success" ? (
                    <Button variant="success">Sucesso</Button>
                  ) : (
                    <Button variant="danger">Erro</Button>
                  )}
                </Card.Body>
              </Card>
            </ListGroupItem>
          ))}
        </ListGroup>
      ) : (
        <Spinner size="sm" />
      )}
    </div>
  );
};

export default ResponseBox;