import React from "react";

import "../style/board.css";
import { Row, Col, Image } from "react-bootstrap";
import { temp1, temp2 } from "../assets/cards.js";

export class Hand extends React.Component {
    getImage = (id) => {
        return temp2;
    };

    render() {
        let hand = this.props.hand;
        let cells = [];

        for (let i = 0; i < hand.length; i++) {
            let card = hand[i];
            cells.push(
                <Col
                    className={
                        this.props.inActionStage
                            ? "activeHand border"
                            : "border"
                    }
                    key={card.id}
                    onClick={
                        // note: when using ternary in onClick, have to use ()=>
                        this.props.inActionStage
                            ? () => this.props.toggleSelectedCard(card)
                            : () => void 0
                    }
                >
                    <Image src={this.getImage(card.id)} thumbnail />
                    {/* {card.id} */}
                </Col>
            );
        }

        return (
            <React.Fragment>
                <Row md={5}>{cells}</Row>
            </React.Fragment>
        );
    }
}
