import React from "react";

import "../../style/board.css";
import { Col, Image } from "react-bootstrap";

import { CardImages } from "../../assets/cards.js";

export class Field extends React.Component {
    onClick = (targetCard) => {
        if (this.props.inPopup) {
            if (
                this.props.inChoosingScuttleStage &&
                this.props.isOpponentField
            ) {
                return () => this.props.chooseScuttleTarget(targetCard);
            } else if (this.props.inChoosingEffectStage) {
                if (this.props.isOpponentField) {
                    return () =>
                        this.props.chooseEffectTarget(
                            targetCard,
                            "opponentField"
                        );
                } else if (this.props.isPlayerField) {
                    return () =>
                        this.props.chooseEffectTarget(
                            targetCard,
                            "playerField"
                        );
                }
            }
        }
        return () => void 0;
    };

    // the same as onclick
    targetable = () => {
        if (this.props.inPopup) {
            if (
                this.props.inChoosingScuttleStage &&
                this.props.isOpponentField
            ) {
                return true;
            } else if (this.props.inChoosingEffectStage) {
                if (this.props.isOpponentField) {
                    return true;
                } else if (this.props.isPlayerField) {
                    return true;
                }
            }
        }
        return false;
    };

    render() {
        let field = this.props.field;
        let jacks = this.props.jacks;
        let cells = [];

        const style = {
            // for jack text
            textAlign: "center",
        };
        console.log(field);
        for (let i = 0; i < field.length; i++) {
            let card = field[i];
            let img = CardImages[card.id];
            // let owner, numJacked;
            // if (jacks[card]) {
            //     owner = jacks[card][0];
            //     numJacked = jacks[card][1].length;
            // }

            cells.push(
                <Col key={card.id} style={{}}>
                    <Image
                        src={img}
                        thumbnail
                        style={style}
                        className={this.props.inPopup ? "targetable" : ""}
                        onClick={this.onClick(card)}
                    ></Image>
                    {jacks[card.id] && (
                        <span>
                            ({jacks[card.id][1]},j
                            {jacks[card.id][2].length})
                        </span>
                    )}
                </Col>
            );
        }
        return cells;
    }
}
