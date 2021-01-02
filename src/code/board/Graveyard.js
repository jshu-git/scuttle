import React from "react";

import "./board.scss";
import { Row, Col, Image } from "react-bootstrap";

import { CardImages } from "../../assets/cards.js";

export class Graveyard extends React.Component {
    render() {
        let graveyard = this.props.graveyard;
        let cells = [];

        for (let i = 0; i < graveyard.length; i++) {
            let card = graveyard[i];
            let img = CardImages[card.id];
            cells.push(
                <Col key={card.id}>
                    <Image
                        src={img}
                        thumbnail
                        className={this.props.inPopup ? "targetable" : ""}
                        onClick={
                            this.props.inPopup
                                ? // we know we're in graveyard, so don't need to pass targetField
                                  () => this.props.chooseEffectTarget(card)
                                : () => void 0
                        }
                    ></Image>
                </Col>
            );
        }

        return (
            <Row xs={5} sm={5} md={5}>
                {cells}
            </Row>
        );
    }
}
