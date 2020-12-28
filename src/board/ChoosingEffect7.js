import React from "react";

import "../style/board.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class ChoosingEffect7 extends React.Component {
    render() {
        let cells = [];
        let deck = this.props.deck;

        for (let i = 0; i < 2; i++) {
            let idx = deck.length - 1 - i;
            let card = deck[idx];

            cells.push(
                <Col
                    key={card.id}
                    className={"border"}
                    // className={this.props.targetable ? "targetable" : ""}
                    // not sure why i have to do () =>, maybe bc it takes a param
                    onClick={() => this.props.chooseEffectTarget(card, "7Field")}
                >
                    {card.Value} of {card.Suit}
                </Col>
            );
        }

        return (
            <React.Fragment>
                <h5>Choose a card</h5>
                <Row md={5}>{cells}</Row>
            </React.Fragment>
        );
    }
}
