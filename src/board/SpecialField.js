import React from "react";
import "../style/board.css";

import { Row, Col } from "react-bootstrap/";

export class SpecialField extends React.Component {
    onClick = (targetCard) => {
        if (this.props.inPopup) {
            if (this.props.inChoosingEffectStage) {
                if (this.props.isOpponentSpecialField) {
                    return () =>
                        this.props.chooseEffectTarget(
                            targetCard,
                            "opponentSpecialField"
                        );
                } else if (this.props.isPlayerSpecialField) {
                    return () =>
                        this.props.chooseEffectTarget(
                            targetCard,
                            "playerSpecialField"
                        );
                }
            }
        }
        return () => void 0;
    };

    render() {
        let cells = [];
        let specialField = this.props.specialField;

        for (let i = 0; i < specialField.length; i++) {
            let card = specialField[i];
            cells.push(
                <Col
                    key={card.id}
                    className={
                        this.props.inPopup ? "border targetable" : "border"
                    }
                    onClick={this.onClick(card)}
                >
                    {card.Value} of {card.Suit}
                </Col>
            );
        }

        return <Row md={5}>{cells}</Row>;
    }
}
