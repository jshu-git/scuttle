import React from "react";
import "../style/board.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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
                        "border"
                        // this.props.choosingEffect ? "targetable" : ""
                    }
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

        return (
            <React.Fragment>
                <Button
                    size="sm"
                    disabled={graveyard.length === 0}
                    onClick={this.props.toggleGraveyard}
                >
                    View Graveyard ({graveyard.length})
                </Button>
                {this.props.showGraveyard && <Row md={5}>{cells}</Row>}
            </React.Fragment>
        );
    }
}
