import React from "react";
import "../style/board.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class Graveyard extends React.Component {
    render() {
        let graveyard = this.props.graveyard;
        let cells = [];

        for (let i = 0; i < graveyard.length; i++) {
            let card = graveyard[i];
            cells.push(
                <Col
                    key={card.id}
                    className={
                        this.props.inPopup ? "border targetable" : "border"
                    }
                    onClick={
                        this.props.inPopup
                            ? // we know we're in graveyard, so don't need to pass targetField
                              () => this.props.chooseEffectTarget(card)
                            : () => void 0
                    }
                >
                    {card.Value} of {card.Suit}
                </Col>
            );
        }

        return <Row md={5}>{cells}</Row>;
    }
}
