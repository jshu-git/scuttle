import React from "react";

import "../style/board.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class Field extends React.Component {
    onClick = (targetCard) => {
        if (this.props.inChoosingScuttleStage && this.props.isOpponentField) {
            return () =>
                // doesn't need targetField since can only scuttle opponent field
                // however for chooseEffectTarget, needs targetField because effect can target EITHER field, and need a way to differentiate
                this.props.chooseScuttleTarget(targetCard);
        } else if (this.props.inChoosingEffectStage) {
            if (this.props.isOpponentField) {
                return () =>
                    this.props.chooseEffectTarget(targetCard, "opponentField");
            } else if (this.props.isPlayerField) {
                return () =>
                    this.props.chooseEffectTarget(targetCard, "playerField");
            }
        }
        return () => void 0;
    };

    // the same as onclick
    targetable = () => {
        if (this.props.inChoosingScuttleStage && this.props.isOpponentField) {
            return true;
        } else if (this.props.inChoosingEffectStage) {
            if (this.props.isOpponentField) {
                return true;
            } else if (this.props.isPlayerField) {
                return true;
            }
        }
        return false;
    };

    render() {
        let field = this.props.field;
        let jacks = this.props.jacks;
        let cells = [];

        for (let i = 0; i < field.length; i++) {
            let card = field[i];
            // let owner, numJacked;
            // if (jacks[card]) {
            //     owner = jacks[card][0];
            //     numJacked = jacks[card][1].length;
            // }

            cells.push(
                <Col
                    className={
                        this.targetable() ? "border targetable" : "border"
                    }
                    key={card.id}
                    onClick={this.onClick(card)}
                >
                    {card.Value} of {card.Suit}{" "}
                    {jacks[card.id] && (
                        <span>
                            (Owner: {jacks[card.id][1]} numJacked:{" "}
                            {jacks[card.id][2].length})
                        </span>
                    )}
                </Col>
            );
        }
        return <Row md={5}>{cells}</Row>;
    }
}
