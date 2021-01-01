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
            {/* <div className="game-info">
        Developed by vyang1222 -{" "}
        <a href="https://github.com/vyang1222/online-coup" rel="noopener noreferrer" target="_blank">
          about this project.
        </a>
        {"\n"}
        Based on the original Coup board game by Indie Boards & Cards.
      </div> */}
        </Container>
    );
};

export default Lobby;
