import React from "react";
import { Container } from "react-bootstrap";

import "./lobby.scss";
import icon from "../assets/icon.svg";

// Lobby is the parent component. Home and Room are the children components.
const Lobby = (props) => {
    return (
        <Container className="lobby-area">
            <h3>
                Scuttle<img id="icon" src={icon} alt="icon"></img>
            </h3>
            <hr></hr>
            {props.children}
            <small>created by vindara and jshu (december 2020)</small>
        </Container>
    );
};

export default Lobby;
