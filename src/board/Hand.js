import React from "react";

import "../style/board.css";
import { Row, Col, Image } from "react-bootstrap";
import { CardImages } from "../assets/Cards.js";

export class Hand extends React.Component {
    render() {
        let hand = this.props.hand;
        let cells = [];

        for (let i = 0; i < hand.length; i++) {
            let card = hand[i];
            let img = CardImages[card.id].default;

            cells.push(
                <Col key={card.id}>
                    <Image
                        // sm={10}
                        src={img}
                        thumbnail
                        className={
                            this.props.inActionStage ? "activeHover" : ""
                        }
                        onClick={
                            // note: when using ternary in onClick, have to use ()=>
                            this.props.inActionStage
                                ? () => this.props.toggleSelectedCard(card)
                                : () => void 0
                        }
                    />
                </Col>
            );
        }

        return (
            <React.Fragment>
                <Row
                    md={5}
                    className={this.props.inActionStage ? "active" : ""}
                >
                    {cells}
                </Row>
            </React.Fragment>
        );
    }
}
