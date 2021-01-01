import React from "react";
import { Container } from "react-bootstrap";

import "./lobby.scss";

// Lobby is the parent component. Home and Room are the children components.
const Lobby = (props) => {
    return (
        <Container className="lobby-area">
            <h3>Scuttle</h3>
            <hr></hr>
            {props.children}
        </Container>
    );
};

export default Lobby;
