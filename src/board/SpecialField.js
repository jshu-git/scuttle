import React from "react";
import "../style/board.css";

import { Col, Image } from "react-bootstrap/";

import { CardImages } from "../assets/Cards.js";

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
            let img = CardImages[card.id].default;

            cells.push(
                <Col key={card.id}>
                    <Image
                        src={img}
                        thumbnail
                        className={this.props.inPopup ? "targetable" : ""}
                        onClick={this.onClick(card)}
                    ></Image>
                </Col>
            );
        }

        return cells;
    }
}
