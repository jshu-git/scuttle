import React from "react";

// components
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";
import { Graveyard } from "./Graveyard";

import "../style/board.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class ChoosingPopup extends React.Component {
    scuttle = () => {
        return (
            <Field
                inPopup={true}
                // for display
                field={this.props.opponentField}
                jacks={this.props.jacks}
                // onclick
                inChoosingScuttleStage={true}
                chooseScuttleTarget={this.props.chooseScuttleTarget}
                isOpponentField={true}
            />
        );
    };

    effect2 = () => {
        return (
            <Row>
                <Col>
                    <h6>Opponent Field</h6>
                    <Field
                        inPopup={true}
                        field={this.props.opponentField}
                        jacks={this.props.jacks}
                        inChoosingEffectStage={this.props.inChoosingEffectStage}
                        chooseEffectTarget={this.props.chooseEffectTarget}
                        isOpponentField={true}
                    />
                </Col>
                <Col>
                    <h6>Opponent Special Field</h6>
                    <SpecialField
                        inPopup={true}
                        specialField={this.props.opponentSpecialField}
                        inChoosingEffectStage={this.props.inChoosingEffectStage}
                        chooseEffectTarget={this.props.chooseEffectTarget}
                        isOpponentSpecialField={true}
                    />
                </Col>
            </Row>
        );
    };

    effect7 = () => {
        if (this.props.deck.length < 2) return;
        let cells = [];
        let deck = this.props.deck;

        for (let i = 0; i < 2; i++) {
            let idx = deck.length - 1 - i;
            let card = deck[idx];

            cells.push(
                <Col
                    key={card.id}
                    className={"border targetable"}
                    onClick={() => this.props.chooseEffectTarget(card)}
                >
                    {card.Value} of {card.Suit}
                </Col>
            );
        }

        return <Row md={5}>{cells}</Row>;
    };

    effect9 = () => {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h6>Opponent Field</h6>
                        <Field
                            inPopup={true}
                            field={this.props.opponentField}
                            jacks={this.props.jacks}
                            inChoosingEffectStage={
                                this.props.inChoosingEffectStage
                            }
                            chooseEffectTarget={this.props.chooseEffectTarget}
                            isOpponentField={true}
                        />
                    </Col>
                    <Col>
                        <h6>Opponent Special Field</h6>
                        <SpecialField
                            inPopup={true}
                            specialField={this.props.opponentSpecialField}
                            inChoosingEffectStage={
                                this.props.inChoosingEffectStage
                            }
                            chooseEffectTarget={this.props.chooseEffectTarget}
                            isOpponentSpecialField={true}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h6>Your Field</h6>
                        <Field
                            inPopup={true}
                            field={this.props.playerField}
                            jacks={this.props.jacks}
                            inChoosingEffectStage={
                                this.props.inChoosingEffectStage
                            }
                            chooseEffectTarget={this.props.chooseEffectTarget}
                            isPlayerField={true}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    };

    effectJ = () => {
        return (
            <Field
                inPopup={true}
                field={this.props.opponentField}
                jacks={this.props.jacks}
                inChoosingEffectStage={this.props.inChoosingEffectStage}
                chooseEffectTarget={this.props.chooseEffectTarget}
                isOpponentField={true}
            />
        );
    };

    effect3 = () => {
        return (
            <Graveyard
                inPopup={true}
                graveyard={this.props.graveyard}
                // onclick
                inChoosingEffectStage={this.props.inChoosingEffectStage}
                chooseEffectTarget={this.props.chooseEffectTarget}
            />
        );
    };

    render() {
        // props
        let selectedCard = this.props.selectedCard;
        // stages
        let inChoosingScuttleStage = this.props.inChoosingScuttleStage;
        let inChoosingEffectStage = this.props.inChoosingEffectStage;

        return (
            <Container>
                {/* scuttling, opponent field */}
                {inChoosingScuttleStage && (
                    <React.Fragment>{this.scuttle()}</React.Fragment>
                )}

                {/* 2 opponent field and opponent special field */}
                {selectedCard.Value === "2" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect2()}</React.Fragment>
                )}

                {/* 3 graveyard */}
                {selectedCard.Value === "3" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect3()}</React.Fragment>
                )}
                {/* 7 */}
                {selectedCard.Value === "7" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect7()}</React.Fragment>
                )}
                {/* 9 ALL fields */}
                {selectedCard.Value === "9" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect9()}</React.Fragment>
                )}
                {/* J opponent field */}
                {selectedCard.Value === "Jack" && inChoosingEffectStage && (
                    <React.Fragment>{this.effectJ()}</React.Fragment>
                )}
            </Container>
        );
    }
}
