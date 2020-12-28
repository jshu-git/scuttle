import React from "react";

import "../style/board.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class Field extends React.Component {
    onClick = (targetCard) => {
        if (this.props.inChoosingScuttleStage) {
            return () => this.props.chooseScuttleTarget(targetCard);
        } else if (this.props.inChoosingEffectStage) {
            return () => this.props.chooseEffectTarget(targetCard);
        }
        return () => void 0;
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
                    className={"border"}
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
