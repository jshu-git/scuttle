import React from "react";
import "../style/board.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class SpecialField extends React.Component {
    render() {
        let cells = [];
        let specialField = this.props.specialField;

        for (let i = 0; i < specialField.length; i++) {
            let card = specialField[i];
            cells.push(
                <Col
                    key={card.id}
                    className={"border"}
                    onClick={
                        this.props.choosingEffectStage
                            ? () => this.props.chooseEffectTarget(card)
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
